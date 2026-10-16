import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/auth",
  fullyParallel: false,
  workers: 1,
  use: { baseURL: "http://127.0.0.1:3100", headless: true, trace: "retain-on-failure", channel: process.env.PLAYWRIGHT_CHANNEL || undefined },
  webServer: [
    { command: "node tests/auth/fake-supabase.mjs", url: "http://127.0.0.1:54329/health", reuseExistingServer: false },
    {
      command: process.env.PLAYWRIGHT_PRODUCTION === "1" ? "npm run start -- --hostname 127.0.0.1 --port 3100" : "npm run dev -- --hostname 127.0.0.1 --port 3100",
      url: "http://127.0.0.1:3100/login",
      timeout: 120_000,
      reuseExistingServer: false,
      env: { AUTH_V1_ENABLED: "true", APP_URL: "http://127.0.0.1:3100", NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:54329", NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_fake_tests_only", VERCEL_ENV: "preview", NEXT_TELEMETRY_DISABLED: "1" },
    },
  ],
});
