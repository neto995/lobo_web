import AuthForm from "../AuthForm";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ estado?: string }> }) {
  const { estado } = await searchParams;
  return <><h1>Entra a Mi LOBO</h1>{estado === "restablecida" && <p role="status">Contraseña actualizada. Ya puedes iniciar sesión.</p>}{estado === "enlace-invalido" && <p role="alert">El enlace no es válido. Solicita uno nuevo.</p>}<AuthForm action="login" /></>;
}
