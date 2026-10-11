import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { authConfig } from "./config";

export async function serverAuth(writable = false) {
  const config = authConfig();
  if (!config) throw new Error("Auth V1 unavailable");
  const store = await cookies();
  return createServerClient(config.url, config.key, {
    cookieOptions: { httpOnly: true, secure: config.secure, sameSite: "lax", path: "/" },
    cookies: {
      getAll: () => store.getAll(),
      setAll(values) {
        // Server Components cannot write cookies; Proxy refreshes before rendering.
        if (writable) values.forEach(({ name, value, options }) => store.set(name, value, options));
      },
    },
  });
}

export async function requireUser() {
  if (!authConfig()) redirect("/login");
  const client = await serverAuth();
  const { data, error } = await client.auth.getUser();
  if (error || !data.user) redirect("/login");
  return data.user;
}
