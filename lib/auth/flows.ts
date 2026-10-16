import type { SupabaseClient } from "@supabase/supabase-js";

export type AuthResult = { message?: string; error?: string; redirect?: string };
export type AuthAction = "login" | "registro" | "recuperar" | "restablecer" | "confirmar" | "logout";
export const authActions: readonly string[] = ["login", "registro", "recuperar", "restablecer", "confirmar", "logout"];
const genericError = "No pudimos completar la solicitud. Intenta de nuevo más tarde.";

export async function runAuthAction(
  action: AuthAction,
  form: FormData,
  auth: SupabaseClient["auth"],
  origin: string,
  pendingToken?: string,
): Promise<AuthResult> {
  const email = String(form.get("email") ?? "").trim();
  const password = String(form.get("password") ?? "");
  if (["login", "registro", "recuperar"].includes(action) && (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254)) {
    return { error: "Escribe un correo válido." };
  }
  if (["login", "registro", "restablecer"].includes(action) && (!password || password.length > 128)) return { error: "Revisa tu contraseña (máximo 128 caracteres)." };
  if (["registro", "restablecer"].includes(action)) {
    if (password.length < 12) return { error: "Usa una contraseña de al menos 12 caracteres." };
    if (password !== form.get("confirmation")) return { error: "Las contraseñas no coinciden." };
  }
  try {
    if (action === "login") {
      const { error } = await auth.signInWithPassword({ email, password });
      return error ? { error: "No pudimos iniciar sesión. Revisa tus datos y la confirmación de tu correo." } : { redirect: "/mi-expediente" };
    }
    if (action === "registro") {
      const { data, error } = await auth.signUp({ email, password, options: { emailRedirectTo: `${origin}/auth/confirm` } });
      if (data.session) {
        const { error: signoutError } = await auth.signOut({ scope: "local" });
        if (signoutError) return { error: genericError };
      }
      if (error && !["user_already_exists", "email_exists"].includes(error.code ?? "")) return { error: genericError };
      return { message: "Si el registro puede completarse, recibirás un correo para confirmar tu cuenta. Si ya tienes cuenta, inicia sesión o recupera tu contraseña." };
    }
    if (action === "recuperar") {
      const { error } = await auth.resetPasswordForEmail(email, { redirectTo: `${origin}/auth/confirm` });
      return error ? { error: genericError } : { message: "Si existe una cuenta para ese correo, recibirás un enlace para restablecer tu contraseña." };
    }
    if (action === "confirmar" || action === "restablecer") {
      if (!pendingToken) return { error: "El enlace falta o venció. Solicita uno nuevo." };
      const { error } = await auth.verifyOtp({ token_hash: pendingToken, type: action === "confirmar" ? "email" : "recovery" });
      if (error) return { error: "El enlace venció o ya fue utilizado. Solicita uno nuevo." };
      if (action === "confirmar") return { redirect: "/mi-expediente" };
      const { data, error: userError } = await auth.getUser();
      if (userError || !data.user) return { error: genericError };
      const { error: updateError } = await auth.updateUser({ password });
      if (updateError) return { error: "No pudimos cambiar la contraseña. Solicita otro enlace e intenta con una contraseña distinta de al menos 12 caracteres." };
      const { error: signoutError } = await auth.signOut({ scope: "local" });
      if (signoutError) return { error: "Tu contraseña cambió, pero no pudimos cerrar la sesión. Vuelve a iniciar sesión antes de continuar." };
      return { redirect: "/login?estado=restablecida" };
    }
    const { error } = await auth.signOut({ scope: "local" });
    return error ? { error: genericError } : { redirect: "/login" };
  } catch {
    return { error: genericError };
  }
}
