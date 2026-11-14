import { expect, test } from '@playwright/test';

test('catalog renders SVG in statement and solution without enabling unsafe links', async ({
  page,
}) => {
  const token = `header.${Buffer.from(JSON.stringify({ exp: Date.now() / 1000 + 3600 })).toString('base64url')}.signature`;
  await page.addInitScript((value) => localStorage.setItem('access_token', value), token);
  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 140"><path d="M20 110 L120 20 L220 110 Z" fill="none" stroke="black" stroke-width="2"/><text x="110" y="135">AB=6</text></svg>';
  const image = `![image:block](data:image/svg+xml;utf8,${encodeURIComponent(svg)})`;
  await page.route(
    (url) => url.pathname.startsWith('/api/'),
    async (route) => {
      const path = new URL(route.request().url()).pathname;
      let data: unknown = {};
      if (path === '/api/profile/me')
        data = { user: { id: 1, fullName: 'Проверка SVG', role: 'student' } };
      else if (path.startsWith('/api/topics/'))
        data = { topics: [{ id: 1, name: 'Планиметрия', number: 1 }] };
      else if (path.startsWith('/api/tasks/catalog/'))
        data = {
          catalogTasks: [
            {
              id: 90001,
              content: `${image}\n\nНайдите площадь треугольника: $S=6$. Условия: $x\\ne 0$ и $x\\neq 1$. [Ссылка](javascript:alert%281%29)`,
              solutionLatex: `Используем формулу площади при $x\\ne 0$.\n\n${image}`,
              points: 1,
            },
          ],
          nextCursor: null,
        };
      else if (path.endsWith('/check')) data = { correct: false, points: 0 };
      await route.fulfill({
        json: { success: true, data },
        headers: {
          'Access-Control-Allow-Origin': new URL(page.url()).origin,
          'Access-Control-Allow-Credentials': 'true',
        },
      });
    },
  );
  await page.goto('/student/catalog/emath/1');
  const imageElement = page.locator('img[src^="data:image/svg+xml"]');
  await expect(imageElement).toHaveCount(1);
  await expect
    .poll(() =>
      imageElement.first().evaluate((img) => (img as HTMLImageElement).naturalWidth),
    )
    .toBeGreaterThan(0);
  await expect(page.locator('.katex').first()).toBeVisible();
  await expect(page.locator('.katex-mathml').filter({ hasText: '≠' })).toHaveCount(2);
  await expect(page.locator('a[href^="javascript:"]')).toHaveCount(0);
  const check = page.getByRole('button', { name: 'Проверить', exact: true });
  await page.getByPlaceholder('Введите ответ').fill('0');
  for (let i = 0; i < 3; i++) {
    await check.click();
    await expect(check).toBeEnabled();
  }
  await page.getByRole('button', { name: 'Показать решение', exact: true }).click();
  await expect(imageElement).toHaveCount(2);
  await expect(page.locator('.katex-mathml').filter({ hasText: '≠' })).toHaveCount(3);
  await expect
    .poll(() =>
      imageElement.last().evaluate((img) => (img as HTMLImageElement).naturalWidth),
    )
    .toBeGreaterThan(0);
});
