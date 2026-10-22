import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { authConfig } from "./lib/auth/config";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });
  response.headers.set("Cache-Control", "private, no-store");
  const settings = authConfig();
  if (!settings) return response;
  const supabase = createServerClient(settings.url, settings.key, {
    cookieOptions: { httpOnly: true, secure: settings.secure, sameSite: "lax", path: "/" },
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(values, cacheHeaders) {
        values.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        values.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        response.headers.set("Cache-Control", "private, no-store");
        Object.entries(cacheHeaders).forEach(([name, value]) => response.headers.set(name, value));
      },
    },
  });
  // The page and each sensitive handler still perform their own authorization.
  await supabase.auth.getUser();
  return response;
}

export const config = {
  matcher: ["/mi-expediente/:path*", "/api/mi-expediente/:path*", "/login", "/registro", "/recuperar-contrasena", "/restablecer-contrasena", "/auth/:path*"],
};
