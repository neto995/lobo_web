import { cookies } from "next/headers";
import { PENDING_EMAIL_COOKIE } from "@/lib/auth/config";
import AuthForm from "../AuthForm";

export default async function RegistroPage({ searchParams }: { searchParams: Promise<{ confirmar?: string }> }) {
  const confirming = (await searchParams).confirmar === "1" && !!(await cookies()).get(PENDING_EMAIL_COOKIE)?.value;
  return <><h1>{confirming ? "Confirma tu correo" : "Crea tu cuenta LOBO"}</h1><AuthForm action={confirming ? "confirmar" : "registro"} /></>;
}
