import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const script = fileURLToPath(
  new URL("../../scripts/verify_catalog_task.py", import.meta.url),
);

export function validateCatalogTask(
  task,
  requiresImage,
  expression = null,
  independentAnswer = null,
) {
  return new Promise((resolve, reject) => {
    const child = spawn(
      process.env.TASK_TEXT_NORMALIZER_PYTHON ||
        process.env.PYTHON ||
        "python3",
      [script],
      { stdio: ["pipe", "pipe", "pipe"], windowsHide: true },
    );
    let output = "";
    const timer = setTimeout(() => {
      child.kill();
      reject(new Error("Task verification timed out"));
    }, 5000);
    child.stdout.on("data", (chunk) => {
      output += chunk;
      if (output.length > 10000) child.kill();
    });
    child.stderr.on("data", () => {});
    child.on("error", () => {
      clearTimeout(timer);
      reject(new Error("Python task verifier is unavailable"));
    });
    child.on("close", () => {
      clearTimeout(timer);
      try {
        const result = JSON.parse(output);
        if (!result.valid) throw new Error(result.error);
        resolve(result);
      } catch (error) {
        reject(new Error(error.message || "Task verification failed"));
      }
    });
    child.stdin.on("error", () => {});
    child.stdin.end(
      JSON.stringify({ task, requiresImage, expression, independentAnswer }),
    );
  });
}

export function parseCatalogJson(text) {
  // A malformed/partial response is retried, never repaired into a potentially different task.
  return JSON.parse(
    text
      .trim()
      .replace(/^```json\s*/i, "")
      .replace(/\s*```$/, ""),
  );
}
