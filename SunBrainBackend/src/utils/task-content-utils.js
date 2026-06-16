const ZERO_WIDTH_CHARS_REGEX = /[\u200B-\u200D\uFEFF]/g;
const BROKEN_LATEX_CONTROL_REGEX = /[\b\f\t]/;

function restoreBrokenLatexCommands(value) {
  return value
    .replace(/\\?\f\s*r\s*a\s*c/gi, '\\frac')
    .replace(/\\?\t\s*i\s*m\s*e\s*s/gi, '\\times')
    .replace(/\\?\t\s*a\s*n/gi, '\\tan')
    .replace(/(^|[^A-Za-zА-Яа-я\\])c\s*d\s*o\s*t(?=[^A-Za-zА-Яа-я]|$)/gi, (
      match,
      prefix
    ) => `${prefix}\\cdot`);
}

function unwrapSplitLatexLines(value) {
  const lines = value.split('\n');
  const result = [];
  let run = [];

  const flushRun = () => {
    if (run.length >= 5) {
      result.push(run.map(line => line.trim()).join(''));
    } else {
      result.push(...run);
    }

    run = [];
  };

  for (const line of lines) {
    const trimmed = line.trim();
    const isSplitMathLine =
      (trimmed.length > 0 &&
        trimmed.length <= 3 &&
        !/[A-Za-zА-Яа-я]{2,}/.test(trimmed)) ||
      /^\\[A-Za-z]+$/.test(trimmed);

    if (isSplitMathLine) {
      run.push(line);
    } else {
      flushRun();
      result.push(line);
    }
  }

  flushRun();

  return result.join('\n');
}

export function parseStructuredTaskContent(content) {
  if (typeof content !== 'string') {
    return null;
  }

  const trimmed = content.trim();

  if (!trimmed.startsWith('{')) {
    return null;
  }

  try {
    const parsed = JSON.parse(trimmed);
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch (error) {
    return null;
  }
}

export function normalizeLatexText(value) {
  if (typeof value !== 'string') {
    return '';
  }

  const withoutInvisibleChars = value.replace(ZERO_WIDTH_CHARS_REGEX, '');
  const repairedCommands = restoreBrokenLatexCommands(withoutInvisibleChars);
  const hasSplitLatexArtifacts =
    BROKEN_LATEX_CONTROL_REGEX.test(withoutInvisibleChars) ||
    /(^|[^A-Za-zА-Яа-я\\])c\s*d\s*o\s*t(?=[^A-Za-zА-Яа-я]|$)/i.test(
      withoutInvisibleChars
    );
  const repairedText = hasSplitLatexArtifacts
    ? restoreBrokenLatexCommands(unwrapSplitLatexLines(repairedCommands))
    : repairedCommands;

  return repairedText
    .replace(/\r/g, '')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export function normalizeSvg(svgValue) {
  if (!svgValue || typeof svgValue !== 'string') {
    return null;
  }

  const cleaned = svgValue.trim();

  if (!cleaned || !cleaned.startsWith('<svg')) {
    return null;
  }

  return cleaned;
}

export function svgToDataUri(svgValue) {
  const normalized = normalizeSvg(svgValue);
  if (!normalized) {
    return null;
  }

  return `data:image/svg+xml;utf8,${encodeURIComponent(normalized)}`;
}

export function buildRenderableTaskStatement(payload) {
  if (!payload || typeof payload !== 'object') {
    return null;
  }

  const statementLatex = normalizeLatexText(
    String(payload.statementLatex || payload.questionLatex || '')
  );

  if (!statementLatex) {
    return null;
  }

  const imageDataUri = svgToDataUri(payload.imageSvg);
  if (!imageDataUri) {
    return statementLatex;
  }

  return `![image:block](${imageDataUri})\n\n${statementLatex}`;
}

export function normalizeTaskContent(content, originalTex = null) {
  const payload = parseStructuredTaskContent(content);

  if (!payload) {
    return {
      payload: null,
      content: typeof content === 'string' ? content : '',
      originalTex: originalTex || null
    };
  }

  const normalizedStatement = normalizeLatexText(
    String(payload.statementLatex || payload.questionLatex || '')
  );

  const renderedContent =
    buildRenderableTaskStatement(payload) || normalizedStatement || String(content);

  return {
    payload,
    content: renderedContent,
    originalTex: normalizedStatement || originalTex || null
  };
}
