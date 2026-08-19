import json
import re
import sys
from typing import Any, List, Optional, Tuple


ZERO_WIDTH_CHARS_RE = re.compile(r"[\u200B-\u200D\uFEFF]")
SHORT_MATH_FRAGMENT_RE = re.compile(r"^[\\A-Za-zА-Яа-яЁё0-9+\-−=*/^_().,;:{}\[\]<>|]+$")
CYRILLIC_WORD_RE = re.compile(r"[А-Яа-яЁё]{2,}")


def normalize_ws(text: str) -> str:
    text = text.replace("\xa0", " ").replace("\u202f", " ").replace("\u2009", " ")
    text = text.replace("\u2060", "").replace("\u00ad", "")
    text = ZERO_WIDTH_CHARS_RE.sub("", text)
    text = text.replace("−", "-")
    text = re.sub(r"\s+", " ", text)
    text = re.sub(r"\s+([.,;:!?])", r"\1", text)
    text = re.sub(r"([(])\s+", r"\1", text)
    text = re.sub(r"\s+([)])", r"\1", text)
    return text.strip()


def unescape_latex_backslashes(text: str) -> str:
    text = re.sub(r"\\+n(?![A-Za-z])", "\n", text)
    text = re.sub(r"\\+r(?![A-Za-z])", "\n", text)
    text = re.sub(r"\\\\(?=[A-Za-z0-9{}[\]().,;:_^+\-−=|])", r"\\", text)
    text = re.sub(r"\\(?=\d)", "", text)
    text = text.replace(r"\ight", r"\right")
    return text


def is_short_math_fragment(line: str) -> bool:
    stripped = line.strip()
    if not stripped:
        return False
    if CYRILLIC_WORD_RE.search(stripped):
        return False
    if len(stripped) <= 4:
        return bool(SHORT_MATH_FRAGMENT_RE.fullmatch(stripped))
    if len(stripped) <= 16 and re.search(r"(?:\\|vec|[=+\-*/^_])", stripped, re.IGNORECASE):
        return bool(SHORT_MATH_FRAGMENT_RE.fullmatch(stripped))
    return False


def unwrap_split_math_lines(text: str) -> str:
    lines = [line.strip() for line in text.replace("\r", "").split("\n")]
    result: List[str] = []
    run: List[str] = []

    def flush_run() -> None:
        nonlocal run
        if not run:
            return
        if len(run) >= 4:
            result.append("".join(run))
        else:
            result.extend(run)
        run = []

    for line in lines:
        if is_short_math_fragment(line):
            run.append(line)
            continue
        flush_run()
        if line:
            result.append(line)

    flush_run()
    return " ".join(result)


def repair_broken_latex_commands(text: str) -> str:
    text = re.sub(r"\\?\s*d\s*f\s*r\s*a\s*c", r"\\dfrac", text, flags=re.IGNORECASE)
    text = re.sub(r"(?<!d)\\?\s*f\s*r\s*a\s*c", r"\\frac", text, flags=re.IGNORECASE)
    text = re.sub(r"\\?\s*c\s*d\s*o\s*t", r"\\cdot", text, flags=re.IGNORECASE)
    text = re.sub(r"\\?\s*t\s*i\s*m\s*e\s*s", r"\\times", text, flags=re.IGNORECASE)
    text = re.sub(r"\\?\s*s\s*q\s*r\s*t", r"\\sqrt", text, flags=re.IGNORECASE)
    text = re.sub(r"\\?\s*l\s*i\s*m", r"\\lim", text, flags=re.IGNORECASE)
    return text


def skip_spaces(text: str, index: int) -> int:
    while index < len(text) and text[index].isspace():
        index += 1
    return index


def read_group(text: str, index: int, opener: str = "{", closer: str = "}") -> Tuple[Optional[str], int]:
    index = skip_spaces(text, index)
    if index >= len(text) or text[index] != opener:
        return None, index

    depth = 0
    start = index + 1
    cursor = index
    while cursor < len(text):
        char = text[cursor]
        if char == "\\":
            cursor += 2
            continue
        if char == opener:
            depth += 1
        elif char == closer:
            depth -= 1
            if depth == 0:
                return text[start:cursor], cursor + 1
        cursor += 1

    return None, index


def read_optional_group(text: str, index: int) -> Tuple[Optional[str], int]:
    return read_group(text, index, "[", "]")


def read_argument(text: str, index: int) -> Tuple[str, int]:
    grouped, next_index = read_group(text, index)
    if grouped is not None:
        return grouped, next_index

    index = skip_spaces(text, index)
    if index >= len(text):
        return "", index

    if text[index] == "\\":
        cursor = index + 1
        while cursor < len(text) and text[cursor].isalpha():
            cursor += 1
        return text[index:cursor], cursor

    return text[index], index + 1


def normalize_plain_math_tokens(text: str) -> str:
    text = text.replace("∣", "|")
    text = re.sub(
        r"\b(sin|cos|tan|tg|ctg|cot)\s*([A-Za-zА-Яа-яЁё])",
        lambda match: f"{match.group(1)} {match.group(2)}",
        text,
        flags=re.IGNORECASE,
    )
    text = re.sub(r"(?<=\d)\s*pi\b", "π", text, flags=re.IGNORECASE)
    text = re.sub(r"\bpi\b", "π", text, flags=re.IGNORECASE)

    trig_names = r"(sin|cos|tan|tg|ctg|cot)"
    text = re.sub(
        rf"\b{trig_names}\s*([A-Za-zА-Яа-яЁё])=([0-9])([0-9])\s*{trig_names}\s*\2=\4\3\b",
        lambda match: f"{match.group(1)} {match.group(2)}={match.group(3)}/{match.group(4)}",
        text,
        flags=re.IGNORECASE,
    )
    text = re.sub(
        rf"\b([0-9]+){trig_names}\s*([A-Za-zА-Яа-яЁё])=([0-9])\1\s+{trig_names}\s*\3=\4\b",
        lambda match: f"{match.group(1)} {match.group(2)} {match.group(3)}={match.group(4)}",
        text,
        flags=re.IGNORECASE,
    )
    text = re.sub(r"(\[[^\[\]]+\])\s*\1", r"\1", text)
    text = re.sub(r"(\([^\(\)]+\])\s*\1", r"\1", text)
    text = re.sub(r"(\([^\(\)]+\))\s*\1", r"\1", text)
    return text


def normalize_polynomial_powers(text: str) -> str:
    return re.sub(r"\b([A-Za-zА-Яа-яЁё])\s*2\b", r"\1^2", text)


def brace_unbraced_sqrt_arguments(text: str) -> str:
    result: List[str] = []
    index = 0

    while index < len(text):
        if not text.startswith(r"\sqrt", index):
            result.append(text[index])
            index += 1
            continue

        command_end = index + len(r"\sqrt")
        argument_start = skip_spaces(text, command_end)
        if argument_start < len(text) and text[argument_start] in "{[":
            result.append(text[index:command_end])
            index = command_end
            continue

        cursor = argument_start
        while cursor < len(text):
            if text.startswith(r"\sqrt", cursor):
                break
            if text[cursor] in "=,.;":
                break
            cursor += 1

        argument = normalize_ws(text[argument_start:cursor])
        if not argument:
            result.append(text[index:command_end])
            index = command_end
            continue

        argument = normalize_polynomial_powers(argument)
        result.append(r"\sqrt{" + argument + "}")
        index = cursor

    return "".join(result)


def brace_unbraced_fraction_arguments(text: str) -> str:
    def replace_compact_fraction(match: re.Match[str]) -> str:
        command = match.group(1)
        numerator = normalize_polynomial_powers(match.group(2))
        denominator = normalize_polynomial_powers(match.group(3))
        return f"\\{command}{{{numerator}}}{{{denominator}}}"

    text = re.sub(
        r"\\(d?frac)\s*([A-Za-zА-Яа-яЁё0-9]+[+\-−][A-Za-zА-Яа-яЁё0-9]+)"
        r"([A-Za-zА-Яа-яЁё0-9]+[+\-−][A-Za-zА-Яа-яЁё0-9]+)(?=\s*[=,.;)]|$)",
        replace_compact_fraction,
        text,
        flags=re.IGNORECASE,
    )
    return text


def is_simple_fraction_part(value: str) -> bool:
    return bool(re.fullmatch(r"[A-Za-zА-Яа-яЁё0-9π∞.,]+", value.strip()))


def format_fraction(numerator: str, denominator: str) -> str:
    converted_numerator = normalize_ws(convert_latex_expression(numerator))
    converted_denominator = normalize_ws(convert_latex_expression(denominator))

    if (
        is_simple_fraction_part(converted_numerator)
        and is_simple_fraction_part(converted_denominator)
    ):
        return f"{converted_numerator}/{converted_denominator}"

    return f"({converted_numerator})/({converted_denominator})"


def convert_latex_expression(text: str) -> str:
    result: List[str] = []
    index = 0

    command_replacements = {
        "cdot": "·",
        "times": "×",
        "le": "≤",
        "leq": "≤",
        "ge": "≥",
        "geq": "≥",
        "neq": "≠",
        "ne": "≠",
        "pm": "±",
        "infty": "∞",
        "in": "∈",
        "notin": "∉",
        "cup": "∪",
        "cap": "∩",
        "emptyset": "∅",
        "varnothing": "∅",
        "setminus": "∖",
        "to": "→",
        "rightarrow": "→",
        "Rightarrow": "⇒",
        "Longrightarrow": "⇒",
        "leftarrow": "←",
        "pi": "π",
        "alpha": "α",
        "beta": "β",
        "gamma": "γ",
        "delta": "δ",
        "theta": "θ",
        "lambda": "λ",
        "mu": "μ",
        "varphi": "φ",
        "phi": "φ",
        "circ": "°",
        "sin": "sin",
        "cos": "cos",
        "tan": "tg",
        "cot": "ctg",
        "ln": "ln",
        "log": "log",
        "angle": "∠",
    }

    ignored_commands = {"left", "right", "big", "bigl", "bigr", "Big", "Bigl", "Bigr"}

    while index < len(text):
        char = text[index]

        if char == "\\":
            cursor = index + 1
            while cursor < len(text) and text[cursor].isalpha():
                cursor += 1
            command = text[index + 1:cursor]

            if not command and cursor < len(text):
                result.append(text[cursor])
                index = cursor + 1
                continue

            if command in ignored_commands:
                index = cursor
                continue

            if command in {"frac", "dfrac", "tfrac"}:
                numerator, after_numerator = read_argument(text, cursor)
                denominator, after_denominator = read_argument(text, after_numerator)
                if numerator and denominator:
                    result.append(format_fraction(numerator, denominator))
                    index = after_denominator
                    continue

            if command == "sqrt":
                root_power, after_optional = read_optional_group(text, cursor)
                argument, after_argument = read_argument(text, after_optional)
                if argument:
                    converted_argument = convert_latex_expression(argument)
                    if root_power:
                        converted_power = convert_latex_expression(root_power)
                        result.append(f"корень {converted_power} степени из ({converted_argument})")
                    else:
                        result.append(f"√({converted_argument})")
                    index = after_argument
                    continue

            if command in {"vec", "overrightarrow"}:
                argument, after_argument = read_argument(text, cursor)
                if argument:
                    result.append(f"вектор {convert_latex_expression(argument)}")
                    index = after_argument
                    continue

            if command == "lim":
                after_lim = skip_spaces(text, cursor)
                limit_text = ""
                if after_lim < len(text) and text[after_lim] == "_":
                    raw_limit, after_limit = read_argument(text, after_lim + 1)
                    limit_text = convert_latex_expression(raw_limit)
                    after_lim = after_limit
                result.append(f"предел при {limit_text} " if limit_text else "предел ")
                index = after_lim
                continue

            if command == "log":
                after_log = skip_spaces(text, cursor)
                base_text = ""
                if after_log < len(text) and text[after_log] == "_":
                    raw_base, after_base = read_argument(text, after_log + 1)
                    base_text = convert_latex_expression(raw_base)
                    after_log = after_base
                result.append(f"log по основанию {base_text} " if base_text else "log")
                index = after_log
                continue

            replacement = command_replacements.get(command)
            if replacement is not None:
                result.append(replacement)
                index = cursor
                continue

            result.append(command)
            index = cursor
            continue

        if char in {"^", "_"}:
            argument, after_argument = read_argument(text, index + 1)
            converted_argument = convert_latex_expression(argument)
            if char == "^":
                if re.fullmatch(r"[A-Za-zА-Яа-яЁё0-9]+", converted_argument):
                    result.append(f"^{converted_argument}")
                else:
                    result.append(f"^({converted_argument})")
            else:
                if re.fullmatch(r"[A-Za-zА-Яа-яЁё0-9]+", converted_argument):
                    result.append(f"_{converted_argument}")
                else:
                    result.append(f"_({converted_argument})")
            index = after_argument
            continue

        if char in "{}":
            index += 1
            continue

        result.append(char)
        index += 1

    return "".join(result)


def convert_simple_latex_to_text(text: str) -> str:
    text = convert_latex_expression(text)
    replacements = (
        (r"\\left", ""),
        (r"\\right", ""),
        (r"\\cdot", "·"),
        (r"\\times", "×"),
        (r"\\leq?", "≤"),
        (r"\\geq?", "≥"),
        (r"\\neq", "≠"),
        (r"\\pm", "±"),
        (r"\\pi", "π"),
        (r"\\alpha", "α"),
        (r"\\beta", "β"),
        (r"\\gamma", "γ"),
        (r"\\varphi|\\phi", "φ"),
        (r"\\theta", "θ"),
    )
    for pattern, replacement in replacements:
        text = re.sub(pattern, replacement, text)

    text = re.sub(r"\\(?:vec|overrightarrow)\s*\{\s*([^{}]+?)\s*\}", r"вектор \1", text)
    text = re.sub(r"\\(?:vec|overrightarrow)\s+([A-Za-zА-Яа-яЁё])", r"вектор \1", text)
    text = re.sub(
        r"(?<![A-Za-zА-Яа-яЁё])vec\s*([A-Za-zА-Яа-яЁё])\b",
        r"вектор \1",
        text,
        flags=re.IGNORECASE,
    )
    text = re.sub(r"\\frac\s*\{\s*([^{}]+?)\s*\}\s*\{\s*([^{}]+?)\s*\}", r"(\1)/(\2)", text)
    text = re.sub(r"\\sqrt\s*\{\s*([^{}]+?)\s*\}", r"√(\1)", text)
    text = text.replace(r"\(", "").replace(r"\)", "")
    text = text.replace(r"\[", "").replace(r"\]", "")
    text = text.replace("$", "")
    return text


def compact_math_spacing(text: str) -> str:
    text = re.sub(r"\s*([=+\-−*/^])\s*", r"\1", text)
    text = re.sub(r"\s*([∈∉∪∩∖])\s*", r" \1 ", text)
    text = re.sub(r"(?<=\d)(?=(?:sin|cos|tg|tan|ctg|cot)\b)", " ", text, flags=re.IGNORECASE)
    text = re.sub(r"(?<=\))(?=(?:sin|cos|tg|tan|ctg|cot)\b)", " ", text, flags=re.IGNORECASE)
    text = re.sub(r"(?<=[A-Za-zА-Яа-яЁё])(?=√)", " ", text)
    text = re.sub(r"\s*;\s*", ";", text)
    text = re.sub(r"\(\s*", "(", text)
    text = re.sub(r"\s*\)", ")", text)
    text = re.sub(r"(?<=\d)(вектор)", r" \1", text)
    text = re.sub(
        r"(вектор\s+[A-Za-zА-Яа-яЁё])([+\-−])(?=(?:\d+\s*)?вектор)",
        r"\1 \2 ",
        text,
    )
    text = re.sub(r"(\))([+])(?=\d|[A-Za-zА-Яа-яЁё√(])", r"\1 \2 ", text)
    text = re.sub(r"\s+([.,;:!?])", r"\1", text)
    text = re.sub(r"([.,;:!?])(?=[^\s)\]}])", r"\1 ", text)
    return normalize_ws(text)


def token_canonical(token: str) -> str:
    return re.sub(r"\s+", "", token.lower().replace("−", "-"))


def remove_adjacent_duplicate_tokens(text: str) -> str:
    tokens = text.split()
    result: List[str] = []
    for token in tokens:
        if result and token_canonical(result[-1]) == token_canonical(token):
            continue
        result.append(token)
    return " ".join(result)


def remove_duplicate_vector_assignments(text: str) -> str:
    return re.sub(
        r"\b(вектор\s+[A-Za-zА-Яа-яЁё]\s*=\s*\([^)]*\))(?:\s+\1)+",
        r"\1",
        text,
        flags=re.IGNORECASE,
    )


def normalize_vector_artifacts(text: str) -> str:
    text = re.sub(
        r"(вектор\s+[A-Za-zА-Яа-яЁё])\s*(\([^)]*\))",
        r"\1=\2",
        text,
        flags=re.IGNORECASE,
    )
    text = re.sub(
        r"\b(вектор\s+[A-Za-zА-Яа-яЁё])\s+\1\b",
        r"\1",
        text,
        flags=re.IGNORECASE,
    )
    text = re.sub(
        r"\|\s*(вектор\s+[A-Za-zА-Яа-яЁё])\s*\|",
        r"|\1|",
        text,
        flags=re.IGNORECASE,
    )
    text = re.sub(
        r"(\|вектор\s+[A-Za-zА-Яа-яЁё]\|\s*=\s*[-+]?\d+(?:[.,]\d+)?)\s+\1",
        r"\1",
        text,
        flags=re.IGNORECASE,
    )
    text = re.sub(
        r"(\|вектор\s+[A-Za-zА-Яа-яЁё]\|)\s+\1",
        r"\1",
        text,
        flags=re.IGNORECASE,
    )
    text = re.sub(
        r"(\|вектор\s+[A-Za-zА-Яа-яЁё]\|)\s+(?:вектор\s+[A-Za-zА-Яа-яЁё]\|)",
        r"\1",
        text,
        flags=re.IGNORECASE,
    )
    return text


def remove_duplicate_equations(text: str) -> str:
    return re.sub(
        r"((?:вектор\s+)?[A-Za-zА-Яа-яЁё0-9√().^+\-−*/ ]+=[A-Za-zА-Яа-яЁё0-9√().^+\-−*/ ]+)\s+\1",
        r"\1",
        text,
        flags=re.IGNORECASE,
    )


def normalize_geometry_artifacts(text: str) -> str:
    text = re.sub(r"([A-ZА-Я])\s*_\s*1\b", r"\1_1", text)
    text = re.sub(r"([A-ZА-Я])\s+1\b", r"\1_1", text)
    text = re.sub(r"([A-ZА-Я])1", r"\1_1", text)
    text = re.sub(r"\bangle\b", "∠", text, flags=re.IGNORECASE)
    text = re.sub(r"(\d+)\^\(°\)", r"\1°", text)
    text = re.sub(r"(\d+)\^°", r"\1°", text)

    text = re.sub(
        r"\b([A-ZА-Я]{1,8}(?:[A-ZА-Я]_1)+)\s+\1\b",
        r"\1",
        text,
    )
    text = re.sub(
        r"\b([A-ZА-Я]{1,8}(?:[A-ZА-Я]_1)+)\s+([A-ZА-Я]{1,8}(?:_1)?(?:\s+[A-ZА-Я]_1)+)\b",
        lambda match: match.group(1)
        if match.group(1).replace("_1", "") == match.group(2).replace(" ", "").replace("_1", "")
        else match.group(0),
        text,
    )
    text = re.sub(
        r"\b([A-ZА-Я]{1,3}(?:_1)?)\s*=\s*([-+]?\d+(?:[.,]\d+)?)\s*\1\s*=\s*\2\b",
        r"\1=\2",
        text,
    )
    text = re.sub(
        r"\b([A-ZА-Я]{1,3}_?1?=[-+]?\d+(?:[.,]\d+)?)\s+\1\b",
        r"\1",
        text,
    )
    text = re.sub(
        r"\b([A-ZА-Я]{1,3}(?:_1)?\s*=\s*[-+]?\d+(?:[.,]\d+)?)\s*\1\b",
        lambda match: normalize_ws(match.group(1)).replace(" =", "=").replace("= ", "="),
        text,
    )
    text = re.sub(r"\b([A-ZА-Я]{1,3}_1)\1\b", r"\1", text)
    return text


def remove_repeated_compact_math_runs(text: str) -> str:
    text = re.sub(
        r"((?:\d*)vec([A-Za-zА-Яа-яЁё])([+\-−])(?:\d*)vec([A-Za-zА-Яа-яЁё]))"
        r"(?:\d*)vec\2\3(?:\d*)\s*vec\4",
        r"\1",
        text,
        flags=re.IGNORECASE,
    )

    def replace_run(match: re.Match[str]) -> str:
        value = match.group(0)
        normalized = value.replace("−", "-")
        for size in range(len(normalized) // 2, 3, -1):
            if len(normalized) % size != 0:
                continue
            chunk = normalized[:size]
            repeats = len(normalized) // size
            if chunk * repeats == normalized:
                return value[:size]
        return value

    return re.sub(
        r"(?:\\?[A-Za-zА-Яа-яЁё0-9]+|[=+\-−*/^().,;:{}\[\]√]){8,}",
        replace_run,
        text,
    )


def normalize_task_text(value: Any) -> str:
    if not isinstance(value, str):
        return ""

    text = unescape_latex_backslashes(value)
    text = repair_broken_latex_commands(text)
    text = unwrap_split_math_lines(text)
    text = repair_broken_latex_commands(text)
    text = normalize_plain_math_tokens(text)
    text = brace_unbraced_fraction_arguments(text)
    text = brace_unbraced_sqrt_arguments(text)
    text = remove_repeated_compact_math_runs(text)
    text = convert_simple_latex_to_text(text)
    text = compact_math_spacing(text)
    text = normalize_plain_math_tokens(text)
    text = remove_repeated_compact_math_runs(text)
    text = remove_duplicate_vector_assignments(text)
    text = normalize_vector_artifacts(text)
    text = remove_duplicate_equations(text)
    text = normalize_geometry_artifacts(text)
    text = remove_adjacent_duplicate_tokens(text)
    return normalize_ws(text)


def main() -> None:
    raw = sys.stdin.read()
    try:
        payload = json.loads(raw) if raw.strip() else {}
    except json.JSONDecodeError as exc:
        print(json.dumps({"error": f"Invalid JSON: {exc}"}, ensure_ascii=False), file=sys.stderr)
        raise SystemExit(1)

    texts = payload.get("texts", [])
    if not isinstance(texts, list):
        print(json.dumps({"error": "Expected 'texts' to be a list"}, ensure_ascii=False), file=sys.stderr)
        raise SystemExit(1)

    normalized = [normalize_task_text(item) for item in texts]
    sys.stdout.write(json.dumps({"texts": normalized}, ensure_ascii=False))


if __name__ == "__main__":
    main()
