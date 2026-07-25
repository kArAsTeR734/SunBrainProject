import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { normalizeLatexText } from "../utils/task-content-utils.js";

const DEFAULT_TIMEOUT_MS = 5000;
const normalizerScriptPath = fileURLToPath(
  new URL("../../scripts/task_text_normalizer.py", import.meta.url),
);

function getTimeoutMs() {
  const value = Number(process.env.TASK_TEXT_NORMALIZER_TIMEOUT_MS);
  return Number.isFinite(value) && value > 0 ? value : DEFAULT_TIMEOUT_MS;
}

function getPythonCommand() {
  return (
    process.env.TASK_TEXT_NORMALIZER_PYTHON || process.env.PYTHON || "python"
  );
}

function getNormalizerScriptPath() {
  return process.env.TASK_TEXT_NORMALIZER_SCRIPT || normalizerScriptPath;
}

function fallbackNormalizeBatch(values) {
  return values.map((value) => normalizeLatexText(String(value ?? "")));
}

function runPythonNormalizer(values) {
  return new Promise((resolve, reject) => {
    const child = spawn(getPythonCommand(), [getNormalizerScriptPath()], {
      stdio: ["pipe", "pipe", "pipe"],
      windowsHide: true,
    });

    let stdout = "";
    let stderr = "";
    let settled = false;

    const timeout = setTimeout(() => {
      if (settled) {
        return;
      }

      settled = true;
      child.kill();
      reject(new Error("TestTask text normalizer timed out"));
    }, getTimeoutMs());

    child.stdout.setEncoding("utf8");
    child.stderr.setEncoding("utf8");

    child.stdout.on("data", (chunk) => {
      stdout += chunk;
    });

    child.stderr.on("data", (chunk) => {
      stderr += chunk;
    });

    child.on("error", (error) => {
      if (settled) {
        return;
      }

      settled = true;
      clearTimeout(timeout);
      reject(error);
    });

    child.on("close", (code) => {
      if (settled) {
        return;
      }

      settled = true;
      clearTimeout(timeout);

      if (code !== 0) {
        reject(
          new Error(stderr || `Task text normalizer exited with code ${code}`),
        );
        return;
      }

      try {
        const parsed = JSON.parse(stdout);
        if (!Array.isArray(parsed?.texts)) {
          reject(
            new Error("TestTask text normalizer returned invalid payload"),
          );
          return;
        }

        resolve(
          parsed.texts.map((value) => normalizeLatexText(String(value ?? ""))),
        );
      } catch (error) {
        reject(error);
      }
    });

    child.stdin.end(JSON.stringify({ texts: values }));
  });
}

export async function normalizeGeneratedTextBatch(values) {
  const fallback = fallbackNormalizeBatch(values);

  if (process.env.TASK_TEXT_NORMALIZER_DISABLED === "true") {
    return fallback;
  }

  try {
    return await runPythonNormalizer(fallback);
  } catch (error) {
    console.warn(
      `Task text normalizer unavailable, using JS fallback: ${error.message}`,
    );
    return fallback;
  }
}
