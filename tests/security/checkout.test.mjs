import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { test } from "node:test";

const require = createRequire(import.meta.url);
const fetchPath = require.resolve("node-fetch");
require(fetchPath);
const requests = [];
// Replace only the SDK's HTTP transport before importing the real route and SDK.
require.cache[fetchPath].exports = async (url, options) => {
  requests.push({ url, options });
  return {
    ok: true,
    status: 201,
    headers: { raw: () => ({}) },
    json: async () => ({ id: "fake-preference", init_point: "https://example.com/fake-payment" }),
  };
};
process.env.MERCADO_PAGO_ACCESS_TOKEN = "fake-security-test-only";
const { POST } = await import("../../app/api/checkout/route.ts");

test("checkout conserva ambos planes y el contrato del SDK sin autenticar al comprador", async () => {
  process.env.VERCEL_ENV = "production";
  for (const [planId, title, price] of [
    ["plan-chico-unico", "Plan Chico", 630],
    ["plan-mediano-unico", "Plan Mediano", 945],
  ]) {
    requests.length = 0;
    const response = await POST(new Request("http://127.0.0.1/api/checkout", {
      method: "POST", body: JSON.stringify({ planId, unitPrice: 1 }),
    }));
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { id: "fake-preference", init_point: "https://example.com/fake-payment" });
    assert.equal(requests.length, 1);
    const { url, options } = requests[0];
    assert.equal(url, "https://api.mercadopago.com/checkout/preferences/");
    assert.equal(options.method, "POST");
    const headers = new Headers(options.headers);
    assert.equal(headers.get("authorization"), "Bearer fake-security-test-only");
    assert.match(headers.get("x-idempotency-key"), /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
    assert.deepEqual(JSON.parse(options.body), {
      items: [{ id: planId, title, quantity: 1, currency_id: "MXN", unit_price: price }],
      back_urls: { success: "https://eatlikeawolf.mx/success", failure: "https://eatlikeawolf.mx/failure", pending: "https://eatlikeawolf.mx/pending" },
    });
  }
});

test("checkout rechaza JSON o planes invalidos antes de usar el SDK", async () => {
  process.env.VERCEL_ENV = "production";
  for (const body of ["{", "null", "{}", JSON.stringify({ planId: "unknown" })]) {
    requests.length = 0;
    const response = await POST(new Request("http://127.0.0.1/api/checkout", { method: "POST", body }));
    assert.equal(response.status, 400);
    assert.equal(requests.length, 0);
  }
});

test("checkout bloquea todo entorno no productivo antes del SDK, incluso con token y cabeceras productivas", async () => {
  const originalNodeEnv = process.env.NODE_ENV;
  try {
    process.env.NODE_ENV = "production";
    for (const environment of ["preview", "development", "unknown", undefined]) {
      if (environment === undefined) delete process.env.VERCEL_ENV;
      else process.env.VERCEL_ENV = environment;
      for (const tokenPresent of [true, false]) {
        if (tokenPresent) process.env.MERCADO_PAGO_ACCESS_TOKEN = "fake-security-test-only";
        else delete process.env.MERCADO_PAGO_ACCESS_TOKEN;
        for (const body of ["{", JSON.stringify({ planId: "plan-chico-unico" }), JSON.stringify({ planId: "plan-mediano-unico" })]) {
          requests.length = 0;
          const response = await POST(new Request("https://eatlikeawolf.mx/api/checkout", {
            method: "POST", body,
            headers: { origin: "https://eatlikeawolf.mx", "x-forwarded-host": "eatlikeawolf.mx" },
          }));
          assert.equal(response.status, 403);
          assert.equal(response.headers.get("cache-control"), "no-store");
          assert.deepEqual(await response.json(), { error: "Payments are unavailable in this environment" });
          assert.equal(requests.length, 0);
        }
      }
    }
  } finally {
    if (originalNodeEnv === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = originalNodeEnv;
    process.env.VERCEL_ENV = "production";
    process.env.MERCADO_PAGO_ACCESS_TOKEN = "fake-security-test-only";
  }
});
