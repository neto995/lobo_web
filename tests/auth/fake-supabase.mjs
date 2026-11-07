import { createServer } from "node:http";
import { randomUUID } from "node:crypto";

// Test-only Auth/PostgREST HTTP double, not evidence of PostgreSQL RLS enforcement.
const users = new Map();
const sessions = new Map();
const refreshTokens = new Map();
const usedTokens = new Set();
const dogs = new Map();
const weights = new Map();
let databaseUnavailable = false;
const password = "test-password-123";
const emailToken = "a".repeat(64);
const recoveryToken = "b".repeat(64);
function seed() {
  users.clear(); sessions.clear(); refreshTokens.clear(); usedTokens.clear();
  dogs.clear(); weights.clear(); databaseUnavailable = false;
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
function matches(row, params) {
  for (const [column, filter] of params) {
    if (["select", "order", "limit", "offset"].includes(column)) continue;
    if (filter.startsWith("eq.") && String(row[column]) !== filter.slice(3)) return false;
    if (filter.startsWith("in.(") && !filter.slice(4, -1).split(",").map((value) => value.replaceAll('"', "")).includes(String(row[column]))) return false;
  }
  return true;
}
function selectRows(rows, req, url, send) {
  const ordered = [...rows].sort((a, b) => {
    for (const field of (url.searchParams.get("order") ?? "id.asc").split(",")) {
      const [column, direction] = field.split(".");
      const difference = String(a[column] ?? "").localeCompare(String(b[column] ?? ""));
      if (difference) return direction === "desc" ? -difference : difference;
    }
    return 0;
  });
  const range = String(req.headers.range ?? "").match(/^(\d+)-(\d+)$/);
  const from = range ? Number(range[1]) : Number(url.searchParams.get("offset") ?? 0);
  const count = range ? Number(range[2]) - from + 1 : Number(url.searchParams.get("limit") ?? 1000);
  const page = ordered.slice(from, from + count);
  if (req.headers.accept?.includes("application/vnd.pgrst.object+json")) {
    return page.length === 1 ? send(200, page[0]) : send(406, { code: "PGRST116", message: "Cannot coerce the result to a single JSON object", details: `The result contains ${page.length} rows` });
  }
  return send(200, page, { "Content-Range": page.length ? `${from}-${from + page.length - 1}/${ordered.length}` : `*/${ordered.length}` });
}
createServer(async (req, res) => {
  const url = new URL(req.url, "http://127.0.0.1:54329");
  let body = "";
  for await (const chunk of req) body += chunk;
  const input = body ? JSON.parse(body) : {};
  const send = (status, data, headers = {}) => { res.writeHead(status, { "Content-Type": "application/json", ...headers }); res.end(status === 204 ? undefined : JSON.stringify(data)); };
  const fail = () => send(400, { code: "invalid_credentials", msg: "Invalid request" });
  const user = sessions.get((req.headers.authorization ?? "").replace("Bearer ", ""));
  if (url.pathname === "/health") return send(200, { ok: true });
  if (url.pathname === "/__reset") { seed(); return send(200, {}); }
  if (url.pathname === "/__database-unavailable") { databaseUnavailable = input.enabled === true; return send(200, {}); }
  if (url.pathname === "/__seed-history") {
    if (!dogs.has(input.dogId) || !Number.isInteger(input.count) || input.count < 1 || input.count > 1500) return fail();
    for (const entry of weights.values()) if (entry.dog_id === input.dogId) weights.delete(entry.id);
    for (let index = 0; index < input.count; index++) {
      const id = randomUUID();
      weights.set(id, { id, dog_id: input.dogId, weight_kg: 10 + (index % 10) / 10, recorded_at: new Date(Date.UTC(2020, 0, 1 + index)).toISOString(), created_at: new Date().toISOString() });
    }
    return send(200, {});
  }
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
  if (url.pathname.startsWith("/rest/v1/")) {
    if (!user) return send(401, { code: "PGRST301", message: "Invalid token" });
    if (databaseUnavailable) return send(503, { code: "TEST_UNAVAILABLE", message: "Internal test database detail must not reach the browser" });
    const owns = (dogId) => dogs.get(dogId)?.user_id === user.id;
    if (url.pathname === "/rest/v1/rpc/create_dog_with_initial_weight" && req.method === "POST") {
      if (!(input.p_initial_weight_kg >= 1 && input.p_initial_weight_kg <= 150)) return send(400, { code: "23514", message: "weight_entries_weight_kg_check" });
      const now = new Date().toISOString();
      const dog = { id: randomUUID(), user_id: user.id, name: input.p_name, breed: input.p_breed, sex: input.p_sex, birth_date: input.p_birth_date, age_months_estimate: input.p_age_months_estimate, age_estimated_at: input.p_age_estimated_at, target_weight_kg: input.p_target_weight_kg, created_at: now, updated_at: now };
      const weight = { id: randomUUID(), dog_id: dog.id, weight_kg: input.p_initial_weight_kg, recorded_at: now, created_at: now };
      dogs.set(dog.id, dog); weights.set(weight.id, weight);
      return send(200, { dog, weight });
    }
    if (url.pathname === "/rest/v1/dogs") {
      const rows = [...dogs.values()].filter((dog) => owns(dog.id) && matches(dog, url.searchParams));
      if (req.method === "PATCH") {
        if (input.user_id && input.user_id !== user.id) return send(403, { code: "42501", message: "row violates row-level security policy" });
        for (const dog of rows) Object.assign(dog, input, { updated_at: new Date().toISOString() });
      }
      if (["GET", "PATCH"].includes(req.method)) return selectRows(rows, req, url, send);
    }
    if (url.pathname === "/rest/v1/weight_entries") {
      if (req.method === "POST") {
        if (!owns(input.dog_id)) return send(403, { code: "42501", message: "row violates row-level security policy" });
        if (!(input.weight_kg >= 1 && input.weight_kg <= 150)) return send(400, { code: "23514", message: "weight_entries_weight_kg_check" });
        const weight = { id: randomUUID(), ...input, created_at: new Date().toISOString() };
        weights.set(weight.id, weight);
        return selectRows([weight], req, url, send);
      }
      if (req.method === "GET") return selectRows([...weights.values()].filter((weight) => owns(weight.dog_id) && matches(weight, url.searchParams)), req, url, send);
    }
  }
  send(404, { message: "Not found" });
}).listen(54329, "127.0.0.1");
