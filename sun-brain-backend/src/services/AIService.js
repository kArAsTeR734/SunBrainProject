import { OpenAI } from 'openai';
import {
  normalizeSvg
} from "../utils/task-content-utils.js";
import { normalizeGeneratedTextBatch } from './task-text-normalizer-service.js';

const HOMEWORK_SYSTEM_PROMPT = `
You generate math homework tasks for exam preparation.
Return strictly valid JSON and nothing else.

Expected JSON format:
{
  "title": "Short homework title",
  "tasks": [
    {
      "difficulty": "easy | medium | hard",
      "statementLatex": "task statement in KaTeX-friendly LaTeX/plain text",
      "solutionLatex": "step-by-step solution in KaTeX-friendly LaTeX/plain text",
      "answerLatex": "final short answer as text",
      "imageSvg": "<svg>...</svg> or null"
    }
  ]
}

Rules:
1. Return exactly the requested number of tasks.
2. Use the requested difficulty for every task.
3. statementLatex / solutionLatex / answerLatex must be clean text (no one-symbol-per-line formatting).
4. Prefer text-only tasks. Set imageSvg to null by default.
5. Do not create tasks that require a graph, figure, diagram, drawing, or SVG to solve.
6. For graph/geometry/diagram exam numbers, generate equivalent tasks with formulas, tables, coordinates, or written conditions so they can be solved without images.
7. No external links in imageSvg.
8. Escape every backslash in JSON strings. For example, write "\\\\frac{1}{2}", not "\\frac{1}{2}".
9. Use valid LaTeX command syntax with braces, for example "\\\\frac{x^2-9}{x-3}" and "\\\\cdot".
10. Keep each solution concise enough to fit in the JSON response.
11. Do not generate vector tasks or use vector notation.
`;

const REQUIRED_DIFFICULTIES = ['easy', 'medium', 'hard'];
const VECTOR_TASK_REGEX = /(?:\\vec|\\overrightarrow|\bvec[a-zа-яё]\b|вектор|векторы|координатн(?:ой|ая|ую)\s+плоскост)/i;

class AIService {
  constructor() {
    this.modelName = process.env.DEEPSEEK_MODEL || 'deepseek-chat';
    this.baseURL =
      process.env.BASE_DEEPSEEK_URL ||
      process.env.DEEPSEEK_BASE_URL ||
      'https://api.deepseek.com/v1';
    this.apiKey = process.env.DEEPSEEK_API_KEY;

    this.client = new OpenAI({
      apiKey: this.apiKey || 'missing-api-key',
      baseURL: this.baseURL
    });
  }

  ensureConfigured() {
    if (!this.apiKey) {
      throw new Error('DEEPSEEK_API_KEY is not configured');
    }
  }

  async chat(messages, options = {}) {
    this.ensureConfigured();

    const completion = await this.client.chat.completions.create({
      model: options.model || this.modelName,
      messages,
      temperature: options.temperature ?? 0.4,
      max_tokens: options.maxTokens ?? 4096
    });

    return completion?.choices?.[0]?.message?.content || '';
  }

  async generateHomeworkByTaskNumber({
    subjectName,
    topicName,
    taskNumber,
    tasksPerDifficulty = 5
  }) {
    const chunks = [];
    let title = '';

    for (const difficulty of REQUIRED_DIFFICULTIES) {
      const chunk = await this.generateHomeworkChunk({
        subjectName,
        topicName,
        taskNumber,
        difficulty,
        tasksCount: tasksPerDifficulty
      });

      if (!title && chunk.title) {
        title = chunk.title;
      }

      chunks.push(...chunk.tasks);
    }

    return {
      title: title || `AI homework for task #${taskNumber}`,
      tasks: chunks
    };
  }

  async generateHomeworkChunk({
    subjectName,
    topicName,
    taskNumber,
    difficulty,
    tasksCount
  }) {
    const userPrompt = `
Subject: ${subjectName}
Exam task number: ${taskNumber}
Topic name: ${topicName}
Difficulty: ${difficulty}

Generate homework for a student who made mistakes in this task number.
Need exactly ${tasksCount} ${difficulty} tasks.
Each task must include a detailed solution and final answer.
`;

    let lastError = null;

    for (let attempt = 1; attempt <= 3; attempt += 1) {
      try {
        const retryHint = lastError
          ? `\n\nPrevious attempt failed with this backend parser error: ${lastError.message}\nReturn a corrected complete JSON object only.`
          : '';
        const content = await this.chat(
          [
            { role: 'system', content: HOMEWORK_SYSTEM_PROMPT.trim() },
            { role: 'user', content: `${userPrompt.trim()}${retryHint}` }
          ],
          { temperature: attempt === 1 ? 0.7 : 0.3, maxTokens: 16000 }
        );

        const parsed = this.parseJsonResponse(content);
        return await this.normalizeHomeworkPayload(parsed, tasksCount, difficulty);
      } catch (error) {
        lastError = error;
      }
    }

    throw new Error(
      `Failed to generate AI homework (${difficulty}): ${
        lastError?.message || 'Unknown error'
      }`
    );
  }

  parseJsonResponse(content) {
    if (!content || typeof content !== 'string') {
      throw new Error('AI returned empty response');
    }

    const cleaned = this.stripJsonMarkdownFence(content.trim());
    const jsonSlice = this.extractJsonObject(cleaned);
    const backslashSafeJson = this.escapeJsonStringBackslashes(jsonSlice);

    try {
      return this.parseJsonWithBackslashRepair(backslashSafeJson);
    } catch (error) {
      try {
        return this.parseJsonWithBackslashRepair(
          this.escapeInvalidJsonBackslashes(backslashSafeJson)
        );
      } catch (repairedError) {
        throw new Error(repairedError.message || error.message);
      }
    }
  }

  stripJsonMarkdownFence(content) {
    return content
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();
  }

  extractJsonObject(content) {
    const start = content.indexOf('{');

    if (start === -1) {
      throw new Error('AI did not return valid JSON');
    }

    let depth = 0;
    let inString = false;
    let escaped = false;

    for (let index = start; index < content.length; index += 1) {
      const char = content[index];

      if (inString) {
        if (escaped) {
          escaped = false;
          continue;
        }

        if (char === '\\') {
          escaped = true;
          continue;
        }

        if (char === '"') {
          inString = false;
        }

        continue;
      }

      if (char === '"') {
        inString = true;
        continue;
      }

      if (char === '{') {
        depth += 1;
      } else if (char === '}') {
        depth -= 1;

        if (depth === 0) {
          return content.slice(start, index + 1);
        }
      }
    }

    throw new Error('AI returned incomplete JSON');
  }

  escapeInvalidJsonBackslashes(jsonValue) {
    let result = '';
    let inString = false;

    for (let index = 0; index < jsonValue.length; index += 1) {
      const char = jsonValue[index];

      if (char === '"') {
        const slashCount = this.countBackslashesBefore(jsonValue, index);
        if (slashCount % 2 === 0) {
          inString = !inString;
        }

        result += char;
        continue;
      }

      if (inString && char === '\\') {
        const nextChar = jsonValue[index + 1] || '';
        if (!/["\\/bfnrtu]/.test(nextChar)) {
          result += '\\\\';
          continue;
        }
      }

      result += char;
    }

    return result;
  }

  parseJsonWithBackslashRepair(jsonValue) {
    let current = jsonValue;
    let lastError = null;

    for (let attempt = 0; attempt < 20; attempt += 1) {
      try {
        return JSON.parse(current);
      } catch (error) {
        lastError = error;
        const position = this.getJsonErrorPosition(error);

        if (position === null || !/escaped|escape/i.test(error.message || '')) {
          throw error;
        }

        const slashIndex = this.findBackslashNearPosition(current, position);
        if (slashIndex === -1) {
          throw error;
        }

        current = `${current.slice(0, slashIndex)}\\${current.slice(slashIndex)}`;
      }
    }

    throw lastError || new Error('AI did not return valid JSON');
  }

  getJsonErrorPosition(error) {
    const match = String(error?.message || '').match(/position\s+(\d+)/i);
    if (!match) {
      return null;
    }

    const position = Number(match[1]);
    return Number.isInteger(position) && position >= 0 ? position : null;
  }

  findBackslashNearPosition(value, position) {
    const start = Math.min(Math.max(position, 0), value.length - 1);
    const min = Math.max(0, start - 12);

    for (let index = start; index >= min; index -= 1) {
      if (value[index] === '\\') {
        return index;
      }
    }

    const max = Math.min(value.length - 1, start + 12);
    for (let index = start + 1; index <= max; index += 1) {
      if (value[index] === '\\') {
        return index;
      }
    }

    return -1;
  }

  escapeJsonStringBackslashes(jsonValue) {
    let result = '';
    let inString = false;

    for (let index = 0; index < jsonValue.length; index += 1) {
      const char = jsonValue[index];

      if (char === '"') {
        const slashCount = this.countBackslashesBefore(jsonValue, index);
        if (slashCount % 2 === 0) {
          inString = !inString;
        }

        result += char;
        continue;
      }

      if (inString && char === '\\') {
        const nextChar = jsonValue[index + 1] || '';
        const unicodeEscape = nextChar === 'u' && /^[0-9a-fA-F]{4}/.test(
          jsonValue.slice(index + 2, index + 6)
        );

        if (
          nextChar &&
          nextChar !== '"' &&
          nextChar !== '\\' &&
          nextChar !== '/' &&
          !unicodeEscape
        ) {
          result += '\\\\';
          continue;
        }

        if (!nextChar) {
          result += '\\\\';
          continue;
        }
      }

      if (inString) {
        switch (char) {
          case '\b':
            result += '\\b';
            continue;
          case '\f':
            result += '\\\\f';
            continue;
          case '\n':
            result += '\\n';
            continue;
          case '\r':
            result += '\\r';
            continue;
          case '\t':
            result += '\\t';
            continue;
          default:
            break;
        }
      }

      result += char;
    }

    return result;
  }

  countBackslashesBefore(value, index) {
    let count = 0;

    for (let cursor = index - 1; cursor >= 0 && value[cursor] === '\\'; cursor -= 1) {
      count += 1;
    }

    return count;
  }

  async normalizeHomeworkPayload(payload, tasksPerDifficulty, expectedDifficulty = null) {
    if (!payload || typeof payload !== 'object') {
      throw new Error('Invalid homework payload');
    }

    const expectedTotal = expectedDifficulty
      ? tasksPerDifficulty
      : tasksPerDifficulty * REQUIRED_DIFFICULTIES.length;
    const rawTasks = Array.isArray(payload.tasks) ? payload.tasks : [];

    if (rawTasks.length !== expectedTotal) {
      throw new Error(
        `AI returned ${rawTasks.length} tasks, expected ${expectedTotal}`
      );
    }

    const textFields = [];
    for (const task of rawTasks) {
      textFields.push(String(task?.statementLatex || task?.questionLatex || ''));
      textFields.push(String(task?.solutionLatex || ''));
      textFields.push(String(task?.answerLatex || task?.answer || ''));
    }
    textFields.push(String(payload.title || ''));

    const normalizedTextFields = await normalizeGeneratedTextBatch(textFields);

    const tasks = rawTasks.map((task, index) => {
      const difficultyFallbackIndex = Math.floor(index / tasksPerDifficulty);
      const fallbackDifficulty =
        expectedDifficulty ||
        REQUIRED_DIFFICULTIES[difficultyFallbackIndex] ||
        'hard';
      const rawDifficulty = String(task?.difficulty || '').trim().toLowerCase();
      const normalizedDifficulty = expectedDifficulty
        ? expectedDifficulty
        : REQUIRED_DIFFICULTIES.includes(rawDifficulty)
          ? rawDifficulty
          : fallbackDifficulty;

      const textFieldIndex = index * 3;
      const statementLatex = normalizedTextFields[textFieldIndex] || '';
      const solutionLatex = normalizedTextFields[textFieldIndex + 1] || '';
      const answerLatex = normalizedTextFields[textFieldIndex + 2] || '';
      const imageSvg = normalizeSvg(task?.imageSvg);

      if (!statementLatex || !solutionLatex || !answerLatex) {
        throw new Error('AI returned incomplete task data');
      }

      if (
        VECTOR_TASK_REGEX.test(statementLatex) ||
        VECTOR_TASK_REGEX.test(solutionLatex)
      ) {
        throw new Error('AI returned vector task, but vector tasks are disabled');
      }

      return {
        difficulty: normalizedDifficulty,
        statementLatex,
        solutionLatex,
        answerLatex,
        imageSvg
      };
    });

    if (!expectedDifficulty) {
      for (const difficulty of REQUIRED_DIFFICULTIES) {
        const count = tasks.filter(task => task.difficulty === difficulty).length;
        if (count !== tasksPerDifficulty) {
          throw new Error(
            `AI returned invalid difficulty distribution for "${difficulty}"`
          );
        }
      }
    }

    const title = normalizedTextFields[rawTasks.length * 3] || '';

    return {
      title: title || 'AI homework',
      tasks
    };
  }
}

const aiService = new AIService();

export default aiService;
