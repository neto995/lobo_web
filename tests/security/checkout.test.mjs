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
  for (const body of ["{", "null", "{}", JSON.stringify({ planId: "unknown" })]) {
    requests.length = 0;
    const response = await POST(new Request("http://127.0.0.1/api/checkout", { method: "POST", body }));
    assert.equal(response.status, 400);
    assert.equal(requests.length, 0);
  }
});
