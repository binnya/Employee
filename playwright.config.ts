// @ts-check
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  outputDir: './test-results',
  workers: 2,
  reporter: [['html', { open: 'never' }]],
  use: {
    headless: true,
    trace: 'on',
    video: 'on',
    screenshot: 'only-on-failure',
  },
  timeout: 300000,
  expect: {
    timeout: 10000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});

