import { NextResponse } from "next/server";
import { authConfig, confirmationInput, PENDING_EMAIL_COOKIE, PENDING_RECOVERY_COOKIE } from "@/lib/auth/config";

export async function GET(request: Request) {
  const config = authConfig();
  const headers = { "Cache-Control": "private, no-store", "Referrer-Policy": "no-referrer" };
  if (!config) return new NextResponse("Acceso de prueba no disponible.", { status: 503, headers });
  const input = confirmationInput(new URL(request.url));
  if (!input) return NextResponse.redirect(new URL("/login?estado=enlace-invalido", config.origin), { status: 303, headers });
  // Do not consume tokens on GET: email scanners frequently follow links.
  const recovery = input.type === "recovery";
  const response = NextResponse.redirect(new URL(recovery ? "/restablecer-contrasena" : "/registro?confirmar=1", config.origin), { status: 303, headers });
  response.cookies.set(recovery ? PENDING_RECOVERY_COOKIE : PENDING_EMAIL_COOKIE, input.tokenHash, {
    httpOnly: true, secure: config.secure, sameSite: "lax", path: "/", maxAge: 600,
  });
  return response;
}
