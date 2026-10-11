"use client";

import { useState } from "react";
import Link from "next/link";
import type { AuthAction, AuthResult } from "@/lib/auth/flows";
import styles from "./auth.module.css";

const labels = { login: "Iniciar sesión", registro: "Crear cuenta", recuperar: "Enviar enlace", restablecer: "Guardar contraseña", confirmar: "Confirmar mi correo", logout: "Cerrar sesión" };

export default function AuthForm({ action }: { action: AuthAction }) {
  const [result, setResult] = useState<AuthResult>({});
  const [pending, setPending] = useState(false);
  const email = ["login", "registro", "recuperar"].includes(action);
  const password = ["login", "registro", "restablecer"].includes(action);
  const newPassword = action === "registro" || action === "restablecer";
  return <>
    <form className={styles.form} onSubmit={async (event) => {
      event.preventDefault();
      if (pending) return;
      const form = event.currentTarget;
      setPending(true);
      setResult({});
      try {
        const response = await fetch(`/auth/${action}`, { method: "POST", body: new FormData(form) });
        const next: AuthResult = await response.json();
        if (response.ok && next.redirect) {
          if (typeof BroadcastChannel !== "undefined") {
            const channel = new BroadcastChannel("lobo-auth");
            channel.postMessage("changed");
            channel.close();
          }
          window.location.assign(next.redirect);
          return;
        }
        setResult(next);
        if (response.ok) form.reset();
      } catch { setResult({ error: "No pudimos conectar. Revisa tu conexión e intenta de nuevo." }); }
      setPending(false);
    }}>
      <fieldset disabled={pending}>
        {email && <label>Correo electrónico<input type="email" name="email" autoComplete="email" maxLength={254} required /></label>}
        {password && <label>Contraseña<input type="password" name="password" autoComplete={newPassword ? "new-password" : "current-password"} minLength={newPassword ? 12 : undefined} maxLength={128} required aria-describedby={newPassword ? "password-help" : undefined} /></label>}
        {newPassword && <><p id="password-help" className={styles.note}>Al menos 12 caracteres.</p><label>Confirmar contraseña<input type="password" name="confirmation" autoComplete="new-password" minLength={12} maxLength={128} required /></label></>}
        <button type="submit">{pending ? "Un momento…" : labels[action]}</button>
      </fieldset>
      {result.error && <p role="alert" className={styles.error}>{result.error}</p>}
      {result.message && <p role="status">{result.message}</p>}
    </form>
    <nav className={styles.links} aria-label="Acceso a tu cuenta">
      {action !== "login" && <Link href="/login">Iniciar sesión</Link>}
      {action === "login" && <Link href="/registro">Crear cuenta</Link>}
      <Link href="/recuperar-contrasena">Recuperar contraseña</Link>
    </nav>
  </>;
}
