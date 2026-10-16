import type { Metadata } from "next";
import Link from "next/link";
import { authConfig } from "@/lib/auth/config";
import styles from "./auth.module.css";

export const metadata: Metadata = { robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <main className={styles.root}>
    <Link href="/" className={styles.brand}>LOBO<span>.</span></Link>
    <div className={styles.content}>{authConfig() ? children : <><h1>Acceso de prueba no disponible</h1><p>Mi LOBO todavía no está abierto al público.</p><Link href="/">Volver a LOBO</Link></>}</div>
  </main>;
}
