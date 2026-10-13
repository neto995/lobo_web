import { createHmac, timingSafeEqual } from "node:crypto";
import { createServer } from "node:http";

export const prices = Object.freeze({ "plan-chico-unico": 630, "plan-mediano-unico": 945 });
export function requireSafe(condition, code) {
  if (!condition) throw new Error(code);
}

export function validateConfig(config) {
  requireSafe(config?.sandboxConfirmed === true && config.country === "MX", "CONFIRM_TEST_ACCOUNTS_MX");
  requireSafe(/^[1-9]\d*$/.test(config.sellerId) && /^[1-9]\d*$/.test(config.buyerId), "INVALID_ACCOUNT_IDS");
  requireSafe(config.sellerId !== config.buyerId, "ACCOUNTS_MUST_DIFFER");
  return config;
}

export function destinations(origin) {
  // Restrict this harness to one temporary provider, not an arbitrary HTTPS host.
  requireSafe(typeof origin === "string" && /^https:\/\/[a-z0-9]+(?:-[a-z0-9]+)*\.trycloudflare\.com$/.test(origin), "INVALID_SANDBOX_ORIGIN");
  return {
    back_urls: Object.fromEntries(["success", "failure", "pending"].map((state) => [state, `${origin}/return/${state}`])),
    notification_url: `${origin}/webhooks/mercadopago`,
  };
}

export function validateSeller(seller, config) {
  validateConfig(config);
  requireSafe(String(seller.id) === config.sellerId, "SELLER_MISMATCH");
  requireSafe(seller.country_id === "MX" && seller.site_id === "MLM", "SELLER_NOT_MEXICO");
  requireSafe(Array.isArray(seller.tags) && seller.tags.includes("test_user"), "SELLER_NOT_VERIFIED_TEST_USER");
  return { sellerMatches: true, country: "MX", testUser: true };
}

export function validatePreference(preference, config, planId) {
  validateConfig(config);
  const expected = destinations(config.origin);
  requireSafe(Object.hasOwn(prices, planId), "INVALID_PLAN");
  requireSafe(String(preference.collector_id) === config.sellerId, "SELLER_MISMATCH");
  requireSafe(preference.live_mode !== true, "LIVE_PREFERENCE_BLOCKED");
  requireSafe(preference.items?.length === 1, "INVALID_ITEMS");
  const item = preference.items[0];
  requireSafe(item.id === planId && item.quantity === 1 && item.unit_price === prices[planId] && item.currency_id === "MXN", "AMOUNT_OR_CURRENCY_MISMATCH");
  for (const state of Object.keys(expected.back_urls)) {
    requireSafe(preference.back_urls?.[state] === expected.back_urls[state], "UNSAFE_RETURN_URL");
  }
  requireSafe(preference.notification_url === expected.notification_url, "UNSAFE_NOTIFICATION_URL");
  requireSafe(preference.binary_mode !== true, "PENDING_PAYMENTS_DISABLED");
  requireSafe(/^lobo-sandbox-[a-zA-Z0-9-]{8,80}$/.test(preference.external_reference), "MISSING_SANDBOX_REFERENCE");
  return { destinationsMatch: true, sellerMatches: true, amount: prices[planId], currency: "MXN" };
}

export function validatePayment(payment, preference, config, planId) {
  validatePreference(preference, config, planId);
  requireSafe(payment.live_mode === false, "PAYMENT_NOT_TEST_MODE");
  requireSafe(String(payment.collector_id) === config.sellerId, "SELLER_MISMATCH");
  requireSafe(String(payment.payer?.id) === config.buyerId, "BUYER_MISMATCH");
  requireSafe(payment.currency_id === "MXN" && payment.transaction_amount === prices[planId], "AMOUNT_OR_CURRENCY_MISMATCH");
  requireSafe(payment.external_reference === preference.external_reference, "REFERENCE_MISMATCH");
  requireSafe(["approved", "rejected", "pending", "in_process", "authorized", "cancelled", "refunded", "charged_back", "in_mediation"].includes(payment.status), "UNKNOWN_PAYMENT_STATUS");
  requireSafe(typeof payment.status_detail === "string" && /^[a-z0-9_]{1,100}$/.test(payment.status_detail), "INVALID_STATUS_DETAIL");
  return { live_mode: false, sellerMatches: true, buyerMatches: true, amount: payment.transaction_amount,
    currency: payment.currency_id, status: payment.status, status_detail: payment.status_detail };
}

export async function readApi(resource, id, token, fetcher = fetch) {
  requireSafe(typeof token === "string" && token.length > 0 && !/\s/.test(token), "INVALID_PRIVATE_TOKEN");
  let url;
  if (resource === "seller") url = "https://api.mercadolibre.com/users/me";
  else {
    requireSafe(["preference", "payment"].includes(resource), "READ_ONLY_RESOURCE_REQUIRED");
    requireSafe(typeof id === "string" && /^[a-zA-Z0-9-]{1,120}$/.test(id), "INVALID_RESOURCE_ID");
    url = resource === "preference" ? `https://api.mercadopago.com/checkout/preferences/${id}` : `https://api.mercadopago.com/v1/payments/${id}`;
  }
  const response = await fetcher(url, { method: "GET", redirect: "error", signal: AbortSignal.timeout(10000),
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } });
  requireSafe(response.ok, "REMOTE_READ_FAILED");
  return response.json();
}

export function verifySignature(headers, url, body, secret, now = Date.now()) {
  if (!secret || secret.length < 16) return false;
  const signature = headers["x-signature"];
  const requestId = headers["x-request-id"];
  const ids = url.searchParams.getAll("data.id");
  if (ids.length !== 1 || !/^\d{1,30}$/.test(ids[0]) || String(body.data?.id) !== ids[0]) return false;
  if (typeof requestId !== "string" || !/^[a-zA-Z0-9-]{1,100}$/.test(requestId) || typeof signature !== "string") return false;
  const parts = signature.split(",").map((part) => part.trim());
  const ts = parts.find((part) => /^ts=\d{10,13}$/.test(part))?.slice(3);
  const v1 = parts.find((part) => /^v1=[a-f0-9]{64}$/.test(part))?.slice(3);
  if (parts.length !== 2 || !ts || !v1) return false;
  const millis = Number(ts) * (ts.length === 10 ? 1000 : 1);
  if (Math.abs(now - millis) > 300000) return false;
  const expected = createHmac("sha256", secret).update(`id:${ids[0]};request-id:${requestId};ts:${ts};`).digest();
  return timingSafeEqual(expected, Buffer.from(v1, "hex"));
}

export function createReceiver({ config, secret = "", log = () => {} }) {
  const seen = new Set();
  const server = createServer(async (req, res) => {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Referrer-Policy", "no-referrer");
    res.setHeader("Content-Security-Policy", "default-src 'none'; frame-ancestors 'none'");
    const reply = (code, value) => { res.writeHead(code); res.end(JSON.stringify(value)); };
    try {
      const url = new URL(req.url, "http://127.0.0.1");
      if (req.method === "GET" && url.pathname === "/health") return reply(200, { service: "lobo-mp-sandbox", transactionsEnabled: false });
      if (req.method === "GET" && /^\/return\/(success|failure|pending)$/.test(url.pathname)) {
        return reply(200, { received: true, paymentVerified: false, message: "Retorno de prueba. No acredita un pago. Validar mediante consulta autenticada." });
      }
      if (req.method !== "POST" || url.pathname !== "/webhooks/mercadopago") return reply(404, { error: "NOT_FOUND" });
      if (!secret) return reply(503, { error: "WEBHOOK_NOT_CONFIGURED" });
      validateConfig(config);
      destinations(config.origin);
      if (req.headers["content-type"]?.split(";")[0] !== "application/json") return reply(415, { error: "JSON_REQUIRED" });
      const chunks = [];
      let size = 0;
      for await (const chunk of req) {
        size += chunk.length;
        if (size > 16384) { reply(413, { error: "BODY_TOO_LARGE" }); return; }
        chunks.push(chunk);
      }
      const body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
      if (!body || !verifySignature(req.headers, url, body, secret)) return reply(401, { error: "INVALID_SIGNATURE" });
      if (body.type !== "payment" || !["payment.created", "payment.updated"].includes(body.action)
        || body.live_mode !== false || String(body.user_id) !== config.sellerId) return reply(422, { error: "NOT_EXPECTED_TEST_EVENT" });
      const key = `${req.headers["x-request-id"]}:${req.headers["x-signature"]}`;
      if (!seen.has(key)) {
        if (seen.size >= 500) seen.delete(seen.values().next().value);
        seen.add(key);
        // An authenticated notification is a hint, not proof of payment or body integrity.
        log({ event: body.action, paymentId: String(body.data.id), signatureValid: true, paymentVerified: false });
      }
      reply(200, { received: true, paymentVerified: false });
    } catch {
      if (!res.headersSent) reply(400, { error: "INVALID_REQUEST" });
    }
  });
  server.requestTimeout = 10000;
  server.headersTimeout = 10000;
  server.maxConnections = 32;
  return server;
}
