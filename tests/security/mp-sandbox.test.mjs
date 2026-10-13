import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { once } from "node:events";
import { spawnSync } from "node:child_process";
import { test } from "node:test";
import { createReceiver, destinations, readApi, validatePayment, validatePreference, validateSeller, verifySignature } from "../../scripts/mp-sandbox/core.mjs";

const config = { sandboxConfirmed: true, country: "MX", sellerId: "123", buyerId: "456", origin: "https://lobo-test-only.trycloudflare.com" };
const secret = "fake-webhook-secret-for-unit-tests";
const preference = () => ({ collector_id: 123, items: [{ id: "plan-chico-unico", quantity: 1, unit_price: 630, currency_id: "MXN" }], ...destinations(config.origin), external_reference: "lobo-sandbox-test-12345678" });
const payment = () => ({ collector_id: 123, payer: { id: 456 }, live_mode: false, currency_id: "MXN", transaction_amount: 630, external_reference: "lobo-sandbox-test-12345678", status: "approved", status_detail: "accredited" });
const body = () => ({ type: "payment", action: "payment.updated", live_mode: false, user_id: 123, data: { id: "789" } });
function headers(time = Date.now()) {
  const ts = String(Math.floor(time / 1000));
  const requestId = "test-request";
  return { "content-type": "application/json", "x-request-id": requestId,
    "x-signature": `ts=${ts},v1=${createHmac("sha256", secret).update(`id:789;request-id:${requestId};ts:${ts};`).digest("hex")}` };
}

test("sandbox launcher discards inherited credentials, proxies and NODE_OPTIONS", () => {
  const result = spawnSync("/bin/sh", ["scripts/mp-sandbox/run.sh", "isolation"], { encoding: "utf8", env: {
    ...process.env, MERCADO_PAGO_ACCESS_TOKEN: "fake-production-token", SUPABASE_SERVICE_ROLE_KEY: "fake-supabase",
    HTTPS_PROXY: "https://example.invalid", NODE_OPTIONS: "--require=/nonexistent-test-module",
  } });
  assert.equal(result.status, 0, result.stderr);
  const report = JSON.parse(result.stdout);
  assert.deepEqual(report.environmentKeys.sort(), ["LC_ALL", "PATH"]);
  assert.equal(report.transactionsEnabled, false);
  assert.doesNotMatch(result.stdout + result.stderr, /fake-production-token|fake-supabase/);
});

test("seller must match a distinct, confirmed Mexican test account", () => {
  const seller = { id: 123, country_id: "MX", site_id: "MLM", tags: ["test_user"] };
  assert.equal(validateSeller(seller, config).testUser, true);
  for (const change of [{ id: 456 }, { country_id: "AR" }, { site_id: "MLA" }, { tags: [] }]) assert.throws(() => validateSeller({ ...seller, ...change }, config));
  assert.throws(() => validateSeller(seller, { ...config, sandboxConfirmed: false }));
  assert.throws(() => validateSeller(seller, { ...config, buyerId: "123" }));
});

test("destinations reject production, localhost, userinfo, queries, paths and lookalike domains", () => {
  for (const origin of ["https://eatlikeawolf.mx", "http://127.0.0.1:3199", `${config.origin}/`, `${config.origin}?x=1`, `${config.origin}.evil.test`, "https://user@lobo-test.trycloudflare.com", "https://lobo-test.trycloudflare.com:443"]) assert.throws(() => destinations(origin));
});

test("preference validation rejects every productive return and notification URL", () => {
  assert.equal(validatePreference(preference(), config, "plan-chico-unico").amount, 630);
  for (const state of ["success", "failure", "pending"]) {
    const value = preference(); value.back_urls[state] = `https://eatlikeawolf.mx/${state}`;
    assert.throws(() => validatePreference(value, config, "plan-chico-unico"));
  }
  for (const change of [{ notification_url: "https://eatlikeawolf.mx/api/webhooks/whatsapp" }, { notification_url: "" }, { collector_id: 999 }, { live_mode: true }, { binary_mode: true }, { external_reference: "" }]) assert.throws(() => validatePreference({ ...preference(), ...change }, config, "plan-chico-unico"));
});

test("both fixed plans require exact amount, currency and quantity", () => {
  for (const [planId, amount] of [["plan-chico-unico", 630], ["plan-mediano-unico", 945]]) {
    const value = preference(); Object.assign(value.items[0], { id: planId, unit_price: amount });
    assert.equal(validatePreference(value, config, planId).amount, amount);
    for (const change of [{ quantity: 2 }, { currency_id: "USD" }, { unit_price: amount - 1 }]) {
      assert.throws(() => validatePreference({ ...value, items: [{ ...value.items[0], ...change }] }, config, planId));
    }
  }
});

test("payment validator requires false live_mode, expected identities, amount and reference", () => {
  for (const status of ["approved", "rejected", "pending", "in_process"]) assert.equal(validatePayment({ ...payment(), status }, preference(), config, "plan-chico-unico").status, status);
  for (const change of [{ live_mode: true }, { live_mode: undefined }, { live_mode: "false" }, { collector_id: 999 }, { payer: { id: 999 } }, { currency_id: "USD" }, { transaction_amount: 1 }, { external_reference: "other" }, { status: "unknown" }]) assert.throws(() => validatePayment({ ...payment(), ...change }, preference(), config, "plan-chico-unico"));
});

test("API transport is GET only, fixed hosts, header token and no redirects", async () => {
  const seen = [];
  const fake = async (url, options) => { seen.push({ url, options }); return { ok: true, json: async () => ({}) }; };
  for (const kind of ["seller", "preference", "payment"]) await readApi(kind, "123", "fake-token", fake);
  assert.equal(seen.length, 3);
  for (const request of seen) {
    assert.equal(request.options.method, "GET"); assert.equal(request.options.redirect, "error");
    assert.equal(request.options.headers.Authorization, "Bearer fake-token"); assert.doesNotMatch(request.url, /fake-token/);
  }
  await assert.rejects(readApi("create", "123", "fake-token", fake));
  await assert.rejects(readApi("payment", "123?access_token=other", "fake-token", fake));
  assert.equal(seen.length, 3);
});

test("webhook signatures reject stale timestamps, altered IDs and duplicate IDs", () => {
  const url = new URL("http://localhost/webhooks/mercadopago?data.id=789");
  assert.equal(verifySignature(headers(), url, body(), secret), true);
  assert.equal(verifySignature(headers(Date.now() - 600000), url, body(), secret), false);
  assert.equal(verifySignature(headers(), url, { ...body(), data: { id: "other" } }, secret), false);
  assert.equal(verifySignature(headers(), new URL(`${url}&data.id=789`), body(), secret), false);
  assert.equal(verifySignature({ ...headers(), "x-signature": "invalid" }, url, body(), secret), false);
});

test("isolated HTTP receiver ignores return claims, rejects live events, deduplicates and exposes no files", async (t) => {
  const logs = [];
  const server = createReceiver({ config, secret, log: (event) => logs.push(event) });
  server.listen(0, "127.0.0.1"); await once(server, "listening");
  t.after(() => { server.closeAllConnections(); server.close(); });
  const base = `http://127.0.0.1:${server.address().port}`;
  const ret = await fetch(`${base}/return/success?status=approved&access_token=do-not-echo`);
  assert.equal((await ret.json()).paymentVerified, false);
  for (const path of ["/.env.local", "/.mp-sandbox/seller-token.txt", "/api/checkout", "/api/webhooks/whatsapp"]) assert.equal((await fetch(base + path)).status, 404);
  const post = (value, signature = headers()) => fetch(`${base}/webhooks/mercadopago?data.id=789`, { method: "POST", headers: signature, body: JSON.stringify(value) });
  assert.equal((await post(body(), { "content-type": "application/json" })).status, 401);
  assert.equal((await post({ ...body(), live_mode: true })).status, 422);
  assert.equal((await post({ ...body(), user_id: 999 })).status, 422);
  const replayHeaders = headers();
  assert.equal((await post(body(), replayHeaders)).status, 200);
  assert.equal((await post(body(), replayHeaders)).status, 200);
  assert.equal(logs.length, 1);
  assert.equal(logs[0].paymentVerified, false);
  assert.equal((await fetch(`${base}/webhooks/mercadopago?data.id=789`, { method: "POST", headers: headers(), body: JSON.stringify({ padding: "x".repeat(17000) }) })).status, 413);
});

test("bootstrap receiver has no functional webhook before private setup", async (t) => {
  const server = createReceiver({ config: {} }); server.listen(0, "127.0.0.1"); await once(server, "listening");
  t.after(() => { server.closeAllConnections(); server.close(); });
  const response = await fetch(`http://127.0.0.1:${server.address().port}/webhooks/mercadopago`, { method: "POST" });
  assert.equal(response.status, 503);
});
