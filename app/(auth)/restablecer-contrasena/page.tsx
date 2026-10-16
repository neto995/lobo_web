import Link from "next/link";
import { cookies } from "next/headers";
import { PENDING_RECOVERY_COOKIE } from "@/lib/auth/config";
import AuthForm from "../AuthForm";

export default async function ResetPage() {
  const pending = (await cookies()).get(PENDING_RECOVERY_COOKIE)?.value;
  return <><h1>Elige una nueva contraseña</h1>{pending ? <AuthForm action="restablecer" /> : <><p>Abre el enlace de recuperación que recibiste por correo.</p><Link href="/recuperar-contrasena">Solicitar otro enlace</Link></>}</>;
}
