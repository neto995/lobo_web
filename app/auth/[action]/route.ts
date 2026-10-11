import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { authConfig, PENDING_EMAIL_COOKIE, PENDING_RECOVERY_COOKIE, validPostOrigin } from "@/lib/auth/config";
import { authActions, runAuthAction, type AuthAction } from "@/lib/auth/flows";
import { serverAuth } from "@/lib/auth/server";

const headers = { "Cache-Control": "private, no-store", "Referrer-Policy": "no-referrer" };

export async function POST(request: Request, context: { params: Promise<{ action: string }> }) {
  const config = authConfig();
  if (!config) return NextResponse.json({ error: "El acceso de prueba no está disponible." }, { status: 503, headers });
  if (!validPostOrigin(request, config)) return NextResponse.json({ error: "Solicitud no permitida." }, { status: 403, headers });
  const { action } = await context.params;
  if (!authActions.includes(action)) return NextResponse.json({ error: "Solicitud no válida." }, { status: 404, headers });
  if (Number(request.headers.get("content-length") ?? 0) > 8192) return NextResponse.json({ error: "Solicitud demasiado grande." }, { status: 413, headers });
  try {
    const form = await request.formData();
    const store = await cookies();
    const tokenCookie = action === "restablecer" ? PENDING_RECOVERY_COOKIE : PENDING_EMAIL_COOKIE;
    const client = await serverAuth(true);
    const result = await runAuthAction(action as AuthAction, form, client.auth, config.origin, store.get(tokenCookie)?.value);
    if (result.redirect) {
      store.delete(PENDING_EMAIL_COOKIE);
      store.delete(PENDING_RECOVERY_COOKIE);
    }
    return NextResponse.json(result, { status: result.error ? 400 : 200, headers });
  } catch {
    return NextResponse.json({ error: "No pudimos completar la solicitud. Intenta de nuevo." }, { status: 400, headers });
  }
}
