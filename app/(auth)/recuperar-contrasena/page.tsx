import AuthForm from "../AuthForm";

export default function RecoverPage() {
  return <><h1>Recupera tu contraseña</h1><p>Te enviaremos un enlace a tu correo.</p><AuthForm action="recuperar" /></>;
}
