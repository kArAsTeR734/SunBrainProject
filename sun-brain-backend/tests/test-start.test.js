import test from "node:test";
import assert from "node:assert/strict";
import TaskModel from "../src/models/task-model.js";
import TestModel from "../src/models/test-models.js";
import TaskService from "../src/services/task-service.js";
import TestService from "../src/services/test-service.js";

test("starts tests with the available distinct tasks, up to 20", async (t) => {
  let numberCount = 3;
  t.mock.method(TaskModel, "getSubjectByCode", async () => ({ id: 1, code: "emath" }));
  t.mock.method(TaskModel, "getCountsByNumberAndDifficulty", async () =>
    Array.from({ length: numberCount }, (_, i) => [
      { task_number: i + 1, difficulty: "easy", count: 1 },
      { task_number: i + 1, difficulty: "medium", count: 1 },
    ]).flat(),
  );
  t.mock.method(TaskModel, "getByNumber", async (number) => [
    { id: number * 10, task_number: number, difficulty: "easy" },
    { id: number * 10 + 1, task_number: number, difficulty: "medium" },
  ]);
  t.mock.method(TestModel, "create", async () => ({ id: 1 }));
  let savedTasks = [];
  t.mock.method(TestModel, "addTasks", async (_id, tasks) => { savedTasks = tasks; });
  t.mock.method(TestModel, "getTaskCountsByTest", async () => []);

  for (const [count, expected] of [[3, 6], [12, 20]]) {
    numberCount = count;
    const meta = await TaskService.getTestPoolMeta("emath");
    const result = await TestService.startTest(1, "emath");
    assert.equal(meta.plannedTotalTasks, expected);
    assert.equal(result.totalTasks, expected);
    assert.equal(new Set(savedTasks.map((task) => task.id)).size, expected);
  }

  numberCount = 0;
  assert.equal((await TaskService.getTestPoolMeta("emath")).plannedTotalTasks, 0);
  await assert.rejects(TestService.startTest(1, "emath"), /No tasks available/);
});
