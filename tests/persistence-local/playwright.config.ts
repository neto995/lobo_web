import { defineConfig } from "@playwright/test";
import { readFileSync } from "node:fs";

// Opt-in only: the status file must come from the disposable local CLI project.
const path = process.env.LOCAL_SUPABASE_STATUS_JSON;
if (!path) throw new Error("LOCAL_SUPABASE_STATUS_JSON is required for disposable local tests.");
const status = JSON.parse(readFileSync(path, "utf8"));
const api = new URL(status.API_URL);
if (api.protocol !== "http:" || api.hostname !== "127.0.0.1" || api.port !== "55441" || api.username || api.password) throw new Error("Refusing a non-local Supabase target.");
if (typeof status.PUBLISHABLE_KEY !== "string" || !status.PUBLISHABLE_KEY.startsWith("sb_publishable_")) throw new Error("A local publishable key is required; secret/service-role keys are not accepted.");

export default defineConfig({
  testDir: ".", testMatch: "*.spec.ts", fullyParallel: false, workers: 1,
  use: { baseURL: "http://127.0.0.1:3102", headless: true, channel: process.env.PLAYWRIGHT_CHANNEL || "chrome", trace: "off" },
  webServer: {
    command: "npm run dev -- --hostname 127.0.0.1 --port 3102",
    url: "http://127.0.0.1:3102/login", timeout: 120_000, reuseExistingServer: false,
    env: {
      AUTH_V1_ENABLED: "true", APP_URL: "http://127.0.0.1:3102", VERCEL_ENV: "preview",
      NEXT_PUBLIC_SUPABASE_URL: api.origin, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: status.PUBLISHABLE_KEY,
      NEXT_TELEMETRY_DISABLED: "1",
    },
  },
});
