import test from "node:test";
import assert from "node:assert/strict";
import {
  validateCatalogTask,
  parseCatalogJson,
} from "../src/services/catalog-task-validation.js";
import {
  statementKey,
  similarStatements,
} from "../src/models/catalog-generation-model.js";
import { CatalogAIProvider } from "../src/services/catalog-ai-provider.js";

const task = {
  statementLatex:
    "Найдите половину числа $3$. Ответ запишите десятичной дробью.",
  solutionLatex: "Делим число $3$ на $2$: получаем $1{,}5$. Ответ: $1{,}5$.",
  answerLatex: "1,5",
  imageSvg: null,
  solutionImageSvg: null,
};
const svg =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100"><path d="M10 80 L100 10 L180 80 Z" fill="none" stroke="black"/></svg>';

test("decimal comma and independently derived rational calculation", async () => {
  assert.equal((await validateCatalogTask(task, false, "3/2")).answer, "1.5");
  await assert.rejects(
    validateCatalogTask(task, false, "4/2"),
    /does not match/,
  );
  await assert.rejects(
    validateCatalogTask(task, false, "3/2", "2"),
    /Reviewer answer/,
  );
  assert.equal(
    (await validateCatalogTask(task, false, "3/2", "1.50")).valid,
    true,
  );
  await assert.rejects(
    validateCatalogTask({ ...task, answerLatex: "1/2" }, false),
    /finite decimal/,
  );
});

test("arithmetic cannot execute code, silently round roots, or exhaust exponentiation", async () => {
  for (const expression of [
    '__import__("os").getcwd()',
    "sqrt(2)",
    "9**999999",
    "(1).__class__",
    "1.5",
  ]) {
    await assert.rejects(validateCatalogTask(task, false, expression));
  }
  assert.equal(
    (
      await validateCatalogTask(
        { ...task, answerLatex: "10" },
        false,
        "comb(5,2)",
      )
    ).valid,
    true,
  );
});

test("required SVG and valid illustration", async () => {
  await assert.rejects(
    validateCatalogTask(task, true),
    /requires an illustration/,
  );
  assert.equal(
    (await validateCatalogTask({ ...task, imageSvg: svg }, true)).valid,
    true,
  );
});

test("reject malformed and active SVG in both statement and solution", async () => {
  const unsafe = [
    svg.replace("<path", "<script"),
    svg.replace('fill="none"', 'onload="alert(1)"'),
    svg.replace("<path", '<image href="https://example.com/a.png"'),
    svg.replace('fill="none"', 'fill="url(https://example.com/a)"'),
    svg.replace("</svg>", '<text x="900" y="20">A</text></svg>'),
    "<!DOCTYPE svg><svg/>",
    "<svg><path/></svg>",
    svg.slice(0, -6),
  ];
  for (const imageSvg of unsafe) {
    await assert.rejects(validateCatalogTask({ ...task, imageSvg }, true));
    await assert.rejects(
      validateCatalogTask({ ...task, solutionImageSvg: imageSvg }, false),
    );
  }
});

test("partial JSON is never silently repaired", () => {
  assert.deepEqual(parseCatalogJson('```json\n{"ok":true}\n```'), { ok: true });
  assert.throws(() => parseCatalogJson('{"ok":true'));
});

test("duplicate key tolerates presentation differences without dropping numbers", () => {
  assert.equal(statementKey("Найдите $2 + 3$."), statementKey(" Найдите 2+3!"));
  assert.notEqual(statementKey("Найдите 2+3"), statementKey("Найдите 2+4"));
});

test("semantic review receives the closest existing statements instead of an entire catalog", () => {
  const unrelated = Array.from(
    { length: 20 },
    (_, i) => `Площадь треугольника со стороной ${i + 1}`,
  );
  const closest =
    "В коробке лежат красные и синие карандаши. Найдите вероятность красного.";
  const result = similarStatements(
    "В коробке красные и синие карандаши. Вероятность выбора красного?",
    [...unrelated, closest],
  );
  assert.equal(result[0], closest);
  assert.equal(result.length, 8);
});

test("request reservation uses full output cap and conservative input estimate", () => {
  const provider = new CatalogAIProvider();
  const pricing = { inputRublesPerMillion: 33, outputRublesPerMillion: 165 };
  const a = provider.reserve(
    [{ role: "user", content: "Задача" }],
    3200,
    pricing,
  );
  assert.ok(a > (3200 * 165) / 1e6);
  assert.ok(
    provider.reserve(
      [{ role: "user", content: "Задача".repeat(100) }],
      3200,
      pricing,
    ) > a,
  );
});

test("provider requests the fixed model with an output cap and no unconfirmed reasoning parameter", async () => {
  const provider = new CatalogAIProvider();
  provider.client = {
    responses: {
      create: async (request) => {
        assert.equal(request.model, "gpt-6.1-terra");
        assert.equal(request.max_output_tokens, 100);
        assert.equal(request.stream, false);
        assert.equal(request.store, false);
        assert.equal("reasoning" in request, false);
        return {
          model: request.model,
          status: "completed",
          output: [{ content: [{ type: "output_text", text: '{"ok":true}' }] }],
        };
      },
    },
  };
  assert.equal(
    (await provider.complete([{ role: "user", content: "Test" }], 100)).text,
    '{"ok":true}',
  );
});
