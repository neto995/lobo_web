import assert from "node:assert/strict";
import { test } from "node:test";
import { authConfig, confirmationInput, validPostOrigin } from "../config.ts";
import { runAuthAction } from "../flows.ts";

const env = { AUTH_V1_ENABLED: "true", APP_URL: "http://localhost:3100", NEXT_PUBLIC_SUPABASE_URL: "https://test.supabase.co", NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_test" };
const form = (values = {}) => { const data = new FormData(); Object.entries(values).forEach(([k, v]) => data.set(k, v)); return data; };
const credentials = { email: "test@example.com", password: "test-password-123", confirmation: "test-password-123" };

test("auth requiere activación explícita y nunca se habilita en producción", () => {
  assert.ok(authConfig(env));
  assert.equal(authConfig({ ...env, AUTH_V1_ENABLED: "false" }), null);
  assert.equal(authConfig({ ...env, VERCEL_ENV: "production" }), null);
  assert.equal(authConfig({ ...env, APP_URL: "https://eatlikeawolf.mx" }), null);
  assert.ok(authConfig({ ...env, VERCEL_ENV: "preview", APP_URL: "https://test.vercel.app" }));
  for (const APP_URL of ["https://user:pass@example.com", "https://test.vercel.app/evil", "javascript:alert(1)", "http://test.vercel.app", "http://localhost:3100?next=evil"]) assert.equal(authConfig({ ...env, VERCEL_ENV: "preview", APP_URL }), null);
  assert.equal(authConfig({ ...env, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_secret_no" }), null);
});

test("POST exige origen conocido; no confía en Host ni en cross-site", () => {
  const config = authConfig(env);
  assert.equal(validPostOrigin(new Request("http://evil.test", { headers: { origin: config.origin } }), config), true);
  for (const origin of ["https://evil.test", "null", "http://localhost:3100.evil.test", ""]) assert.equal(validPostOrigin(new Request(config.origin, { headers: { origin } }), config), false);
  assert.equal(validPostOrigin(new Request(config.origin, { headers: { origin: config.origin, "sec-fetch-site": "cross-site" } }), config), false);
});

test("confirmación acepta solo email/recovery y nunca toma un next externo", () => {
  const url = new URL(`https://test/auth/confirm?type=email&token_hash=${"a".repeat(64)}&next=https://evil.test`);
  assert.deepEqual(confirmationInput(url), { type: "email", tokenHash: "a".repeat(64) });
  for (const query of ["type=invite&token_hash=a", "type=recovery", "type=email&token_hash=%0d%0a"]) assert.equal(confirmationInput(new URL(`https://test/?${query}`)), null);
});

test("validación ocurre antes de contactar al proveedor", async () => {
  const auth = new Proxy({}, { get() { throw new Error("Provider must not be called"); } });
  for (const values of [{ ...credentials, email: "bad" }, { ...credentials, password: "short" }, { ...credentials, confirmation: "different" }]) assert.ok((await runAuthAction("registro", form(values), auth, env.APP_URL)).error);
});

test("login normaliza email, conserva contraseña y oculta errores del proveedor", async () => {
  let sent;
  const auth = { signInWithPassword: async (input) => { sent = input; return { error: null }; } };
  const result = await runAuthAction("login", form({ email: " test@example.com ", password: "  password  " }), auth, env.APP_URL);
  assert.equal(result.redirect, "/mi-expediente");
  assert.deepEqual(sent, { email: "test@example.com", password: "  password  " });
  auth.signInWithPassword = async () => ({ error: { message: "SECRET database detail" } });
  assert.doesNotMatch(JSON.stringify(await runAuthAction("login", form(credentials), auth, env.APP_URL)), /SECRET/);
});

test("registro no enumera usuarios existentes y no conserva autologin", async () => {
  let signouts = 0;
  const auth = { signUp: async () => ({ data: { session: null }, error: null }), signOut: async () => { signouts++; return { error: null }; } };
  const normal = await runAuthAction("registro", form(credentials), auth, env.APP_URL);
  auth.signUp = async () => ({ data: { session: null }, error: { code: "user_already_exists" } });
  assert.deepEqual(await runAuthAction("registro", form(credentials), auth, env.APP_URL), normal);
  auth.signUp = async () => ({ data: { session: {} }, error: null });
  await runAuthAction("registro", form(credentials), auth, env.APP_URL);
  assert.equal(signouts, 1);
});

test("recuperación entrega respuesta neutra y callback fijo", async () => {
  let callback;
  const auth = { resetPasswordForEmail: async (_email, options) => { callback = options.redirectTo; return { error: null }; } };
  const response = await runAuthAction("recuperar", form(credentials), auth, env.APP_URL);
  assert.ok(response.message);
  assert.equal(callback, `${env.APP_URL}/auth/confirm`);
});

test("restablecer exige OTP recovery válido incluso con otra sesión existente", async () => {
  const calls = [];
  const auth = {
    verifyOtp: async (input) => { calls.push(input); return { error: null }; },
    getUser: async () => ({ data: { user: { id: "verified" } }, error: null }),
    updateUser: async () => { calls.push("update"); return { error: null }; },
    signOut: async (options) => { calls.push(options); return { error: null }; },
  };
  assert.ok((await runAuthAction("restablecer", form(credentials), auth, env.APP_URL)).error);
  assert.equal(calls.length, 0);
  assert.equal((await runAuthAction("restablecer", form(credentials), auth, env.APP_URL, "valid-token")).redirect, "/login?estado=restablecida");
  assert.deepEqual(calls, [{ type: "recovery", token_hash: "valid-token" }, "update", { scope: "local" }]);
  calls.length = 0;
  auth.verifyOtp = async () => ({ error: { message: "expired" } });
  assert.ok((await runAuthAction("restablecer", form(credentials), auth, env.APP_URL, "expired")).error);
  assert.equal(calls.length, 0);
});

test("logout usa scope local y falla visiblemente si el proveedor falla", async () => {
  let scope;
  const auth = { signOut: async (options) => { scope = options.scope; return { error: null }; } };
  assert.equal((await runAuthAction("logout", form(), auth, env.APP_URL)).redirect, "/login");
  assert.equal(scope, "local");
  auth.signOut = async () => { throw new Error("secret network details"); };
  assert.doesNotMatch(JSON.stringify(await runAuthAction("logout", form(), auth, env.APP_URL)), /secret/);
});
