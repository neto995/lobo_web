export type AuthConfig = { url: string; key: string; origin: string; secure: boolean };

export function authConfig(env: NodeJS.ProcessEnv = process.env): AuthConfig | null {
  if (env.AUTH_V1_ENABLED !== "true" || env.VERCEL_ENV === "production") return null;
  try {
    const site = new URL(env.APP_URL ?? "");
    const local = ["localhost", "127.0.0.1", "[::1]"].includes(site.hostname);
    // Until PostgreSQL + RLS, only local development and Vercel Preview are allowed.
    if (!local && env.VERCEL_ENV !== "preview") return null;
    if (site.protocol !== "https:" && !(local && site.protocol === "http:")) return null;
    if (site.username || site.password || site.pathname !== "/" || site.search || site.hash) return null;
    const supabase = new URL(env.NEXT_PUBLIC_SUPABASE_URL ?? "");
    if (supabase.protocol !== "https:" && !(local && supabase.protocol === "http:" && ["localhost", "127.0.0.1"].includes(supabase.hostname))) return null;
    const key = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";
    if (!key.startsWith("sb_publishable_")) return null;
    return { url: supabase.origin, key, origin: site.origin, secure: site.protocol === "https:" };
  } catch {
    return null;
  }
}

export const PENDING_EMAIL_COOKIE = "lobo-auth-email";
export const PENDING_RECOVERY_COOKIE = "lobo-auth-recovery";

export function confirmationInput(url: URL) {
  const type = url.searchParams.get("type");
  const tokenHash = url.searchParams.get("token_hash") ?? "";
  if ((type !== "email" && type !== "recovery") || !/^[A-Za-z0-9_-]{32,256}$/.test(tokenHash)) return null;
  return { type, tokenHash } as const;
}

export function validPostOrigin(request: Request, config: AuthConfig) {
  return request.headers.get("origin") === config.origin && request.headers.get("sec-fetch-site") !== "cross-site";
}
