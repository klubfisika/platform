import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/playwright",
  timeout: 30_000,
  use: {
    baseURL: "http://localhost:5173",
    browserName: "chromium",
    headless: true,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "Desktop Chrome",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
