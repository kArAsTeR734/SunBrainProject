import { expect, type Page, test } from '@playwright/test';

const token = (exp: number) =>
  `header.${Buffer.from(JSON.stringify({ exp })).toString('base64url')}.signature`;
const user = {
  id: 1,
  email: 'performance@example.test',
  fullName: 'Проверка загрузки',
  role: 'student',
  avatarUrl: '',
};
const task = (id: number) => ({
  id,
  content: `Задание ${id}: $2+2$`,
  solutionLatex: '$4$',
  points: 1,
});

async function prepare(page: Page, accessToken: string | null, delay = 0) {
  await page.addInitScript((value) => {
    if (value) localStorage.setItem('access_token', value);
  }, accessToken);
  let refreshCount = 0;
  await page.route(
    (url) => url.pathname.startsWith('/api/'),
    async (route) => {
      const url = new URL(route.request().url());
      const headers = {
        'Access-Control-Allow-Origin': new URL(page.url()).origin,
        'Access-Control-Allow-Credentials': 'true',
      };
      let data: unknown;
      if (url.pathname === '/api/auth/refresh') {
        refreshCount++;
        await new Promise((resolve) => setTimeout(resolve, delay));
        data = { accessToken: token(Date.now() / 1000 + 3600) };
      } else if (url.pathname === '/api/profile/me') {
        data = { user };
      } else if (url.pathname.startsWith('/api/tasks/catalog/')) {
        data = { catalogTasks: [task(1)], nextCursor: null };
      } else if (url.pathname.startsWith('/api/topics/')) {
        data = { topics: [{ id: 1, name: 'Тема', number: 1 }] };
      } else {
        data = { homeworks: [], topUsers: [], currentUser: { points: 0 } };
      }
      await route.fulfill({ json: { success: true, data }, headers });
    },
  );
  return () => refreshCount;
}

test('production home defers Markdown, KaTeX JS, CSS and fonts until tasks are opened', async ({
  page,
}) => {
  await prepare(page, token(Date.now() / 1000 + 3600));
  const assets: string[] = [];
  page.on('request', (request) => assets.push(request.url()));
  await page.goto('http://localhost:3030/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await page.waitForLoadState('networkidle');
  expect(assets.filter((url) => /MarkdownContent|KaTeX/i.test(url))).toEqual([]);
  const homeKB = await page.evaluate(() =>
    Math.round(
      performance
        .getEntriesByType('resource')
        .filter((e) => (e as PerformanceResourceTiming).initiatorType === 'script')
        .reduce((n, e) => n + (e as PerformanceResourceTiming).decodedBodySize, 0) / 1000,
    ),
  );
  await test
    .info()
    .attach('home-network.json', {
      body: JSON.stringify({ scriptKB: homeKB, resources: assets }),
      contentType: 'application/json',
    });

  // Navigate in the same document so the requests above still describe this session.
  await page.evaluate(() => {
    history.pushState({}, '', '/student/catalog/emath/1');
    window.dispatchEvent(new PopStateEvent('popstate'));
  });
  await expect(page.locator('.katex').first()).toBeVisible();
  expect(assets.some((url) => /MarkdownContent.*\.js/.test(url))).toBeTruthy();
});

test('a fresh access token opens a protected catalog without refresh', async ({
  page,
}) => {
  const count = await prepare(page, token(Date.now() / 1000 + 3600));
  await page.goto('/student/catalog/emath/1');
  await expect(
    page.getByRole('heading', { name: 'Задача 1', exact: true }),
  ).toBeVisible();
  expect(count()).toBe(0);
});

test('cookie-only session restores and public home remains visible during slow refresh', async ({
  page,
}) => {
  const count = await prepare(page, null, 2500);
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('access_token'))).toBeNull();
  await expect
    .poll(() => page.evaluate(() => localStorage.getItem('access_token')))
    .not.toBeNull();
  expect(count()).toBe(1);
});

for (const failure of [false, true]) {
  test(`parallel and late 401 share a refresh; failure=${failure}`, async ({ page }) => {
    await prepare(page, token(Date.now() / 1000 + 3600));
    await page.goto('/');
    let refreshCount = 0;
    await page.route('**/api/auth/refresh', async (route) => {
      refreshCount++;
      await new Promise((resolve) => setTimeout(resolve, 100));
      await route.fulfill({
        headers: {
          'Access-Control-Allow-Origin': 'http://localhost:3002',
          'Access-Control-Allow-Credentials': 'true',
        },
        status: failure ? 401 : 200,
        json: { success: !failure, data: { accessToken: 'renewed' } },
      });
    });
    await page.route('**/api/probe/*', async (route) => {
      if (route.request().headers().authorization === 'Bearer renewed') {
        await route.fulfill({
          headers: {
            'Access-Control-Allow-Origin': 'http://localhost:3002',
            'Access-Control-Allow-Credentials': 'true',
          },
          json: { success: true, data: {} },
        });
      } else {
        if (route.request().url().endsWith('/late'))
          await new Promise((resolve) => setTimeout(resolve, 400));
        await route.fulfill({
          headers: {
            'Access-Control-Allow-Origin': 'http://localhost:3002',
            'Access-Control-Allow-Credentials': 'true',
          },
          status: 401,
          json: {},
        });
      }
    });
    const statuses = await page.evaluate(async () => {
      // The dev server exposes the same client module used by the app.
      const { api } = await import('/src/shared/api/client.ts' /* @vite-ignore */);
      return (
        await Promise.allSettled(
          ['a', 'b', 'late'].map((name) => api.get(`/api/probe/${name}`)),
        )
      ).map((result) => result.status);
    });
    expect(refreshCount).toBe(1);
    expect(statuses).toEqual(Array(3).fill(failure ? 'rejected' : 'fulfilled'));
    if (failure)
      expect(await page.evaluate(() => localStorage.getItem('access_token'))).toBeNull();
  });
}

test('pagination keeps cards on an error, retries, stops at the end and resets for another topic', async ({
  page,
}) => {
  await prepare(page, token(Date.now() / 1000 + 3600));
  let failNext = true;
  await page.route('**/api/tasks/catalog/*', async (route) => {
    const url = new URL(route.request().url());
    const cursor = Number(url.searchParams.get('cursor') || 0);
    if (cursor === 12 && failNext) {
      await route.fulfill({
        headers: {
          'Access-Control-Allow-Origin': 'http://localhost:3002',
          'Access-Control-Allow-Credentials': 'true',
        },
        status: 503,
        json: {},
      });
      return;
    }
    const ids = Array.from(
      { length: Math.min(12, 25 - cursor) },
      (_, i) => cursor + i + 1,
    );
    await route.fulfill({
      headers: {
        'Access-Control-Allow-Origin': 'http://localhost:3002',
        'Access-Control-Allow-Credentials': 'true',
      },
      json: {
        success: true,
        data: {
          catalogTasks: ids.map(task),
          nextCursor: cursor + ids.length < 25 ? cursor + ids.length : null,
        },
      },
    });
  });
  await page.goto('/student/catalog/emath/1');
  const cards = page.getByRole('heading', { name: /^Задача / });
  await expect(cards).toHaveCount(12);
  await page.getByRole('button', { name: 'Показать ещё' }).click();
  await expect(page.getByRole('button', { name: 'Повторить загрузку' })).toBeVisible();
  await expect(cards).toHaveCount(12);
  failNext = false;
  await page.getByRole('button', { name: 'Повторить загрузку' }).click();
  await expect(cards).toHaveCount(24);
  await page.getByRole('button', { name: 'Показать ещё' }).click();
  await expect(cards).toHaveCount(25);
  await expect(page.getByRole('button', { name: 'Показать ещё' })).toHaveCount(0);
  await page.evaluate(() => {
    history.pushState({}, '', '/student/catalog/emath/2');
    window.dispatchEvent(new PopStateEvent('popstate'));
  });
  await expect(cards).toHaveCount(12);
});

for (const accessToken of ['malformed', token(1)]) {
  test(`expired or malformed access token restores once: ${accessToken}`, async ({
    page,
  }) => {
    const count = await prepare(page, accessToken);
    await page.goto('/student/catalog/emath/1');
    await expect(
      page.getByRole('heading', { name: 'Задача 1', exact: true }),
    ).toBeVisible();
    expect(count()).toBe(1);
  });
}

test('a rejected renewed token logs out with bounded retries', async ({ page }) => {
  await prepare(page, token(Date.now() / 1000 + 3600));
  await page.goto('/student/catalog/emath/1');
  await expect(
    page.getByRole('heading', { name: 'Задача 1', exact: true }),
  ).toBeVisible();
  let requests = 0;
  await page.route('**/api/probe/denied', async (route) => {
    requests++;
    await route.fulfill({ status: 401, json: {} });
  });
  await page.evaluate(async () => {
    const { api } = await import('/src/shared/api/client.ts' /* @vite-ignore */);
    await api.get('/api/probe/denied').catch(() => undefined);
  });
  await expect(page).toHaveURL(/\/login$/);
  expect(requests).toBe(2);
  expect(await page.evaluate(() => localStorage.getItem('access_token'))).toBeNull();
});
