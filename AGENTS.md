# Инструкции для работы с SunBrain

SunBrain — образовательная веб-платформа. Frontend находится в `sun-brain-frontend`, backend — в `sun-brain-backend`. Перед изменениями изучайте соответствующий код и настройки проекта; не считайте README или этот файл заменой текущему коду.

## Принципы работы

Всегда используйте `.agents/skills/karpathy-guidelines/SKILL.md` при выполнении задач.

Ниже приведён полный текст принципов из [andrej-karpathy-skills](https://github.com/multica-ai/andrej-karpathy-skills/blob/main/skills/karpathy-guidelines/SKILL.md).

# Karpathy Guidelines

Behavioral guidelines to reduce common LLM coding mistakes, derived from [Andrej Karpathy's observations](https://x.com/karpathy/status/2015883857489522876) on LLM coding pitfalls.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

Сохраняйте существующие изменения пользователя. Не добавляйте секреты и файлы окружения с реальными учётными данными в репозиторий.

## Документация и проверки

- Для документации библиотек, API, настройки и примеров используйте Context7, если он доступен. Учитывайте версии из соответствующего `package.json` и lock-файла; при недоступности Context7 обращайтесь к официальной документации и сообщайте об ограничении, если оно влияет на результат.
- Выбирайте проверки по затронутой области. Для frontend доступны `npm run lint` и `npm run build` из `sun-brain-frontend`; у backend в текущем `package.json` нет команд тестирования или линтинга. Не утверждайте, что проверка пройдена, если она не запускалась.
