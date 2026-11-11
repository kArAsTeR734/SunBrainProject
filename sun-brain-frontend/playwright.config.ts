import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  workers: 1,
  use: {
    baseURL: 'http://localhost:3002',
    channel: process.env.PLAYWRIGHT_CHANNEL,
  },
  webServer: [
    {
      command: 'npm run dev -- --port 3002',
      url: 'http://localhost:3002',
      reuseExistingServer: false,
    },
    {
      command: 'npm run preview -- --host localhost --port 3030',
      url: 'http://localhost:3030',
      reuseExistingServer: false,
    },
  ],
});
