"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./expediente.module.css";

export default function SessionBoundary({ userId, children }: { userId: string; children: React.ReactNode }) {
  const [state, setState] = useState<"checking" | "ready" | "error">("checking");
  useEffect(() => {
    let active = true;
    let generation = 0;
    const check = async () => {
      const current = ++generation;
      try {
        const response = await fetch("/auth/session", { cache: "no-store" });
        const result = await response.json();
        if (!active || current !== generation) return;
        if (response.status === 401) { setState("checking"); window.location.replace("/login"); }
        else if (!response.ok) setState("error");
        else if (result.userId !== userId) { setState("checking"); window.location.replace("/mi-expediente"); }
        else setState("ready");
      } catch { if (active && current === generation) setState("error"); }
    };
    const recheck = () => { setState("checking"); void check(); };
    const visibility = () => {
      if (document.visibilityState === "hidden") { ++generation; setState("checking"); }
      else recheck();
    };
    const channel = typeof BroadcastChannel !== "undefined" ? new BroadcastChannel("lobo-auth") : null;
    if (channel) channel.onmessage = recheck;
    const interval = window.setInterval(() => { if (document.visibilityState === "visible") void check(); }, 60_000);
    window.addEventListener("pageshow", recheck);
    window.addEventListener("focus", recheck);
    document.addEventListener("visibilitychange", visibility);
    void check();
    return () => {
      active = false;
      ++generation;
      channel?.close();
      window.clearInterval(interval);
      window.removeEventListener("pageshow", recheck);
      window.removeEventListener("focus", recheck);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [userId]);
  if (state !== "ready") return <main className={`${styles.root} ${styles["loading-screen"]}`}><p role="status">{state === "error" ? "No pudimos verificar tu sesión. Revisa tu conexión." : "Verificando tu sesión…"}</p>{state === "error" && <Link href="/login">Volver a iniciar sesión</Link>}</main>;
  return children;
}

export function LogoutButton() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  return <div><button className={`${styles["text-button"]} ${styles["logout-button"]}`} disabled={pending} onClick={async () => {
    setPending(true);
    setError("");
    try {
      const response = await fetch("/auth/logout", { method: "POST", body: new FormData() });
      if (!response.ok) throw new Error();
      if (typeof BroadcastChannel !== "undefined") {
        const channel = new BroadcastChannel("lobo-auth");
        channel.postMessage("changed");
        channel.close();
      }
      window.location.replace("/login");
    } catch { setError("No pudimos cerrar sesión. Reintenta."); setPending(false); }
  }}>{pending ? "Cerrando…" : "Cerrar sesión"}</button>{error && <p role="alert">{error}</p>}</div>;
}
