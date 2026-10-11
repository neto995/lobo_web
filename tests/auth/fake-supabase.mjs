import { createServer } from "node:http";
import { randomUUID } from "node:crypto";

// Test-only Auth HTTP double. Application code always uses the real Supabase SDK.
const users = new Map();
const sessions = new Map();
const refreshTokens = new Map();
const usedTokens = new Set();
const password = "test-password-123";
const emailToken = "a".repeat(64);
const recoveryToken = "b".repeat(64);
function seed() {
  users.clear(); sessions.clear(); refreshTokens.clear(); usedTokens.clear();
  for (const [email, id] of [["a@example.com", "11111111-1111-4111-8111-111111111111"], ["b@example.com", "22222222-2222-4222-8222-222222222222"]]) users.set(email, { id, email, password, confirmed: true });
}
seed();
const publicUser = (user) => ({ id: user.id, email: user.email, aud: "authenticated", role: "authenticated", email_confirmed_at: new Date().toISOString(), created_at: new Date().toISOString(), app_metadata: { provider: "email", providers: ["email"] }, user_metadata: {} });
function session(user) {
  const exp = Math.floor(Date.now() / 1000) + 3600;
  const encode = (value) => Buffer.from(JSON.stringify(value)).toString("base64url");
  const token = `${encode({ alg: "HS256", typ: "JWT" })}.${encode({ sub: user.id, exp, aud: "authenticated", session_id: randomUUID() })}.test-signature`;
  const refresh = randomUUID();
  sessions.set(token, user);
  refreshTokens.set(refresh, user);
  return { access_token: token, refresh_token: refresh, expires_in: 3600, expires_at: exp, token_type: "bearer", user: publicUser(user) };
}
createServer(async (req, res) => {
  const url = new URL(req.url, "http://127.0.0.1:54329");
  let body = "";
  for await (const chunk of req) body += chunk;
  const input = body ? JSON.parse(body) : {};
  const send = (status, data) => { res.writeHead(status, { "Content-Type": "application/json" }); res.end(JSON.stringify(data)); };
  const fail = () => send(400, { code: "invalid_credentials", msg: "Invalid request" });
  const user = sessions.get((req.headers.authorization ?? "").replace("Bearer ", ""));
  if (url.pathname === "/health") return send(200, { ok: true });
  if (url.pathname === "/__reset") { seed(); return send(200, {}); }
  if (url.pathname === "/auth/v1/signup") {
    if (!users.has(input.email)) users.set(input.email, { id: randomUUID(), email: input.email, password: input.password, confirmed: false });
    return send(200, { user: publicUser(users.get(input.email)), session: null });
  }
  if (url.pathname === "/auth/v1/token") {
    if (url.searchParams.get("grant_type") === "refresh_token") {
      const found = refreshTokens.get(input.refresh_token);
      return found ? send(200, session(found)) : fail();
    }
    const found = users.get(input.email);
    return found?.confirmed && found.password === input.password ? send(200, session(found)) : fail();
  }
  if (url.pathname === "/auth/v1/verify") {
    if (usedTokens.has(input.token_hash)) return fail();
    if (input.type === "email" && input.token_hash === emailToken) {
      const found = users.get("new@example.com");
      if (!found) return fail();
      found.confirmed = true; usedTokens.add(emailToken); return send(200, session(found));
    }
    if (input.type === "recovery" && input.token_hash === recoveryToken) { usedTokens.add(recoveryToken); return send(200, session(users.get("a@example.com"))); }
    return fail();
  }
  if (url.pathname === "/auth/v1/recover") return send(200, {});
  if (url.pathname === "/auth/v1/user") {
    if (!user) return send(401, { code: "bad_jwt", msg: "Invalid token" });
    if (req.method === "PUT") user.password = input.password;
    return send(200, publicUser(user));
  }
  if (url.pathname === "/auth/v1/logout") {
    if (user) {
      sessions.delete((req.headers.authorization ?? "").replace("Bearer ", ""));
      for (const [token, owner] of refreshTokens) if (owner === user) refreshTokens.delete(token);
    }
    return send(204, null);
  }
  send(404, { message: "Not found" });
}).listen(54329, "127.0.0.1");
