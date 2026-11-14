import { Pool } from "pg";
import { randomUUID, createHash } from "node:crypto";

export const catalogPool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 3,
  connectionTimeoutMillis: 5000,
});

export function statementKey(text) {
  return createHash("sha256")
    .update(
      String(text)
        .normalize("NFKC")
        .toLowerCase()
        .replace(/[\s$\\{}.,;:!?«»"'()]/g, ""),
    )
    .digest("hex");
}

export function taskStatement(row) {
  if (row.original_tex) return row.original_tex;
  try {
    return JSON.parse(row.content).statementLatex || row.content;
  } catch {
    return row.content;
  }
}

export function similarStatements(statement, statements) {
  const words = (text) =>
    new Set(
      String(text)
        .toLowerCase()
        .match(/[\p{L}\p{N}]+/gu) || [],
    );
  const target = words(statement);
  return [...new Set(statements)]
    .map((text) => {
      const tokens = words(text);
      const overlap = [...tokens].filter((word) => target.has(word)).length;
      return { text, score: overlap / Math.max(target.size, tokens.size, 1) };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map((item) => item.text);
}

export async function snapshot(client, id) {
  const run = (
    await client.query("SELECT * FROM ai_catalog_runs WHERE id=$1", [id])
  ).rows[0];
  if (!run)
    throw Object.assign(new Error("Generation run not found"), { status: 404 });
  const items = (
    await client.query(
      "SELECT * FROM ai_catalog_items WHERE run_id=$1 ORDER BY id",
      [id],
    )
  ).rows;
  const calls = (
    await client.query(
      "SELECT * FROM ai_catalog_calls WHERE run_id=$1 ORDER BY id",
      [id],
    )
  ).rows;
  return { ...run, items, calls };
}

export async function createRun(client, { budgetRubles, reviewBeforePublish }) {
  const id = randomUUID();
  await client.query("BEGIN");
  try {
    // Snapshot every emath topic, including legacy topics; number is metadata, not identity.
    const topics = (
      await client.query(
        "SELECT id,name,number FROM topics WHERE subject_code='emath' ORDER BY number,id",
      )
    ).rows;
    if (!topics.length)
      throw Object.assign(new Error("No emath topics found"), { status: 400 });
    await client.query(
      "INSERT INTO ai_catalog_runs(id,budget_rubles,review_before_publish) VALUES($1,$2,$3)",
      [id, budgetRubles, reviewBeforePublish],
    );
    for (const topic of topics) {
      for (const difficulty of ["easy", "medium", "hard"]) {
        await client.query(
          `INSERT INTO ai_catalog_items
          (run_id,topic_id,topic_name,topic_number,difficulty,requires_image) VALUES($1,$2,$3,$4,$5,$6)`,
          [
            id,
            topic.id,
            topic.name,
            topic.number,
            difficulty,
            difficulty === "easy" &&
              /планиметр|стереометр|вектор|график|производн|функци/i.test(
                topic.name,
              ),
          ],
        );
      }
    }
    await client.query("COMMIT");
    return snapshot(client, id);
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  }
}

export async function reserveCall(client, runId, itemId, purpose, amount) {
  await client.query("BEGIN");
  try {
    const result = await client.query(
      `UPDATE ai_catalog_runs SET charged_rubles=charged_rubles+$2
      WHERE id=$1 AND charged_rubles+$2<=budget_rubles RETURNING id`,
      [runId, amount],
    );
    if (!result.rowCount)
      throw Object.assign(new Error("Generation budget exhausted"), {
        code: "BUDGET_EXHAUSTED",
      });
    const call = (
      await client.query(
        `INSERT INTO ai_catalog_calls
      (run_id,item_id,purpose,reserved_rubles,charged_rubles) VALUES($1,$2,$3,$4,$4) RETURNING id`,
        [runId, itemId, purpose, amount],
      )
    ).rows[0];
    await client.query("COMMIT");
    return call.id;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  }
}

export async function settleCall(client, callId, response, pricing) {
  const u = response.usage;
  // Keep the full reservation after ambiguous failures or missing usage (also after a crash).
  const known = [u?.input_tokens, u?.output_tokens].every(
    (v) => Number.isSafeInteger(v) && v >= 0,
  );
  const inputRate = Math.max(
    pricing.inputRublesPerMillion,
    pricing.cacheCreation1hRublesPerMillion || 0,
    pricing.cacheCreation5mRublesPerMillion || 0,
  );
  const outputRate = Math.max(
    pricing.outputRublesPerMillion,
    pricing.reasoningRublesPerMillion || 0,
  );
  const amount = known
    ? Math.ceil(
        (u.input_tokens * inputRate + u.output_tokens * outputRate) * 1.1,
      ) / 1_000_000
    : null;
  await client.query("BEGIN");
  try {
    const call = (
      await client.query(
        "SELECT * FROM ai_catalog_calls WHERE id=$1 FOR UPDATE",
        [callId],
      )
    ).rows[0];
    // Never silently exceed the preflight bound; stop the run on a provider accounting mismatch.
    if (amount !== null && amount > Number(call.reserved_rubles))
      throw Object.assign(
        new Error("Provider usage exceeded the reserved bound"),
        { code: "PROVIDER_FAILED", status: 502 },
      );
    const charged = amount ?? Number(call.reserved_rubles);
    await client.query(
      `UPDATE ai_catalog_calls SET charged_rubles=$2,usage=$3,provider_response_id=$4,status=$5 WHERE id=$1`,
      [
        callId,
        charged,
        u || null,
        response.id || null,
        known ? "settled" : "uncertain",
      ],
    );
    await client.query(
      "UPDATE ai_catalog_runs SET charged_rubles=charged_rubles-$2+$3 WHERE id=$1",
      [call.run_id, call.reserved_rubles, charged],
    );
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  }
}

export async function publishItem(client, item) {
  await client.query("BEGIN");
  try {
    // Serialize publication across different runs too, so the duplicate check and insert are atomic.
    await client.query("SELECT pg_advisory_xact_lock(721401)");
    const current = (
      await client.query(
        "SELECT * FROM ai_catalog_items WHERE id=$1 FOR UPDATE",
        [item.id],
      )
    ).rows[0];
    if (current.task_id) {
      await client.query("COMMIT");
      return current.task_id;
    }
    if (current.status !== "verified")
      throw new Error("Task has not passed verification");
    const task = current.candidate;
    const existing = (
      await client.query("SELECT original_tex,content FROM tasks")
    ).rows;
    if (
      existing.some((row) => {
        return (
          statementKey(taskStatement(row)) === statementKey(task.statementLatex)
        );
      })
    )
      throw new Error("Duplicate statement already exists in catalog");
    const solution = task.solutionImageSvg
      ? `${task.solutionLatex}\n\n![image:block](data:image/svg+xml;utf8,${encodeURIComponent(task.solutionImageSvg)})`
      : task.solutionLatex;
    const inserted = (
      await client.query(
        `INSERT INTO tasks
      (content,original_tex,solution,correct_answer,points,topic_id,difficulty,exam_type,answer_format,created_at,updated_at)
      VALUES($1,$2,$3,$4,$5,$6,$7,'ai_generated','decimal',NOW(),NOW()) RETURNING id`,
        [
          JSON.stringify({ ...task, format: "latex" }),
          task.statementLatex,
          solution,
          task.answerLatex,
          { easy: 1, medium: 2, hard: 3 }[item.difficulty],
          item.topic_id,
          item.difficulty,
        ],
      )
    ).rows[0];
    await client.query(
      "UPDATE ai_catalog_items SET status='published',task_id=$2,error=NULL WHERE id=$1",
      [item.id, inserted.id],
    );
    await client.query("COMMIT");
    return inserted.id;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  }
}
