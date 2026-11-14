import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { Pool } from "pg";
import { CatalogGenerationService } from "../src/services/catalog-generation-service.js";
import { CATALOG_MODEL } from "../src/services/catalog-ai-provider.js";

// Explicit opt-in; a private temporary schema never touches catalog data.
test(
  "durable progress, concurrency, budget, retry cap, review gate and idempotent publication",
  { skip: process.env.CATALOG_INTEGRATION_TEST !== "1" },
  async () => {
    const schema = `ai_catalog_test_${Date.now()}`;
    const config = {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 5432),
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    };
    const admin = new Pool(config);
    const pool = new Pool({
      ...config,
      options: `-c search_path=${schema}`,
      max: 3,
    });
    try {
      await admin.query(`CREATE SCHEMA ${schema}`);
      await pool.query(`CREATE TABLE topics(id SERIAL PRIMARY KEY,name TEXT,number INT,subject_code TEXT);
        CREATE TABLE tasks(id SERIAL PRIMARY KEY,content TEXT,original_tex TEXT,solution TEXT,correct_answer TEXT,
          points INT,topic_id INT,difficulty TEXT,exam_type TEXT,answer_format TEXT,created_at TIMESTAMP,updated_at TIMESTAMP);
        INSERT INTO topics(name,number,subject_code) VALUES('Уравнения',7,'emath');`);
      await pool.query(
        await readFile(
          new URL(
            "../prisma/migrations/20261114000000_ai_catalog_generation/migration.sql",
            import.meta.url,
          ),
          "utf8",
        ),
      );
      let generated = 0;
      let reject = false;
      let missingUsage = false;
      let failNetwork = false;
      const provider = {
        pricing: async () => ({
          inputRublesPerMillion: 33,
          outputRublesPerMillion: 165,
        }),
        reserve: () => 1,
        complete: async (messages) => {
          if (failNetwork)
            throw Object.assign(new Error("secret request should not leak"), {
              status: 503,
            });
          const system = messages[0].content;
          const text = system.includes("Return exactly")
            ? '{"ok":true}'
            : system.includes("Independently solve")
              ? JSON.stringify({
                  valid: !reject,
                  reason:
                    "Независимо проверено делением числа из условия на два.",
                  independentAnswer: String(generated),
                  expression: `${generated * 2}/2`,
                })
              : JSON.stringify({
                  statementLatex: `Найдите половину числа $${++generated * 2}$. Укажите число.`,
                  solutionLatex: `Разделим число $${generated * 2}$ на два. Получаем $${generated}$.`,
                  answerLatex: String(generated),
                  imageSvg: null,
                });
          return {
            text,
            model: CATALOG_MODEL,
            reasoning: { effort: "low" },
            status: "completed",
            id: "test-response",
            usage: missingUsage
              ? undefined
              : { input_tokens: 10, output_tokens: 20 },
          };
        },
      };
      const service = new CatalogGenerationService({ pool, provider });
      const run = await service.create({
        budgetRubles: 50,
        reviewBeforePublish: true,
      });
      assert.equal(run.items.length, 3);
      let progress = await service.advance(run.id);
      assert.equal(progress.items[0].status, "verified");
      assert.equal(
        (await pool.query("SELECT count(*) FROM tasks")).rows[0].count,
        "0",
      );
      // A second service instance proves progress is read from PostgreSQL, not process memory.
      const restarted = new CatalogGenerationService({ pool, provider });
      await restarted.publish(run.id, [run.items[0].id]);
      await restarted.publish(run.id, [run.items[0].id]);
      assert.equal(
        (await pool.query("SELECT count(*) FROM tasks")).rows[0].count,
        "1",
      );
      const lock = await pool.connect();
      await lock.query("SELECT pg_advisory_lock(721402)");
      await assert.rejects(
        service.advance(run.id),
        (error) => error.status === 409,
      );
      await lock.query("SELECT pg_advisory_unlock(721402)");
      lock.release();
      reject = true;
      for (let i = 0; i < 4; i++) progress = await service.advance(run.id);
      assert.equal(progress.items[1].attempts, 3);
      assert.equal(
        progress.items[0].task_id,
        (await service.get(run.id)).items[0].task_id,
      );
      assert.equal(progress.items[1].status, "failed");
      const cheap = await service.create({ budgetRubles: 0.1 });
      assert.equal(
        (await service.advance(cheap.id)).status,
        "budget_exhausted",
      );
      assert.equal(Number((await service.get(cheap.id)).charged_rubles), 0);
      const uncertain = await service.create({ budgetRubles: 50 });
      missingUsage = true;
      reject = false;
      await service.advance(uncertain.id);
      assert.equal(Number((await service.get(uncertain.id)).charged_rubles), 3);
      const network = await service.create({ budgetRubles: 50 });
      failNetwork = true;
      assert.equal(
        (await service.advance(network.id)).status,
        "provider_error",
      );
      assert.equal(Number((await service.get(network.id)).charged_rubles), 1);
      assert.equal(
        (await pool.query("SELECT count(*) FROM tasks")).rows[0].count,
        "2",
      );
      failNetwork = false;
      const interrupted = await service.create({ budgetRubles: 50 });
      await pool.query("UPDATE ai_catalog_items SET attempts=3 WHERE id=$1", [
        interrupted.items[0].id,
      ]);
      await pool.query(
        `UPDATE ai_catalog_runs SET charged_rubles=1,provider_evidence='{}'::jsonb WHERE id=$1`,
        [interrupted.id],
      );
      await pool.query(
        `INSERT INTO ai_catalog_calls(run_id,purpose,reserved_rubles,charged_rubles)
        VALUES($1,'generate',1,1)`,
        [interrupted.id],
      );
      const recovered = await service.advance(interrupted.id);
      assert.equal(recovered.items[0].status, "failed");
      assert.match(recovered.items[0].error, /interrupted/);
      assert.equal(recovered.calls[0].status, "uncertain");
      assert.ok(Number(recovered.charged_rubles) >= 1);
    } finally {
      await pool.end();
      await admin.query(`DROP SCHEMA ${schema} CASCADE`);
      await admin.end();
    }
  },
);
