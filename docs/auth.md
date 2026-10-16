# Auth V1: etapa 1, exclusivamente local / preview

Implementa email/password, registro con confirmacion, recuperacion, logout,
cookies SSR y proteccion de `/mi-expediente`. Google queda para la etapa 2.
No desplegar a produccion ni habilitar clientes reales hasta PostgreSQL + RLS.

Actualizacion de dependencias: ver [remediacion de seguridad](security-dependencies.md)
para el resultado posterior (17 a 7 paquetes afectados). La auditoria de 17
paquetes mas abajo se conserva como registro historico de Auth V1, no como el
estado actual de esta rama. Persisten avisos y no se autoriza produccion.

## Configuracion manual (proyecto Supabase de pruebas)

1. Crear o seleccionar un proyecto de pruebas separado de produccion.
2. Habilitar Email + Password y Confirm email. Configurar minimo 12 caracteres
   y una politica compatible con el formulario (maximo 128 caracteres).
3. Configurar SMTP propio y verificar su remitente / DNS. El servicio de prueba
   integrado no sirve para probar entregas a clientes arbitrarios.
4. Registrar Site URL como `APP_URL` (el origen, sin `/auth/confirm`) y agregar
   la redirect URL exacta `APP_URL/auth/confirm` para cada entorno. En local:
   `http://127.0.0.1:3101` y `http://127.0.0.1:3101/auth/confirm`, respectivamente.
   No permitir comodines de dominios publicos ni usar URLs de produccion.
5. Configurar las plantillas de correo siguientes (sin tracking de enlaces):

Confirm signup:

```html
<a href="{{ .RedirectTo }}?token_hash={{ .TokenHash }}&type=email">Confirmar mi correo</a>
```

Reset password:

```html
<a href="{{ .RedirectTo }}?token_hash={{ .TokenHash }}&type=recovery">Restablecer mi contraseña</a>
```

6. Configurar SOLO `.env.local` o Vercel Preview con los nombres de `.env.example`:
   `AUTH_V1_ENABLED=true`, `APP_URL`, `NEXT_PUBLIC_SUPABASE_URL` y
   `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. Se acepta la clave moderna
   `sb_publishable_...`; no usar anon JWT, service_role, secret key ni DB URL.
   Aunque llevan prefijo NEXT_PUBLIC para mantener la convencion de Supabase,
   en esta etapa el SDK de Auth se usa exclusivamente desde el servidor.
7. Para Vercel Preview, usar un origen HTTPS estable y permitir los callbacks
   en su proteccion de acceso. El codigo requiere `VERCEL_ENV=preview` para
   origenes no locales, y bloquea siempre `VERCEL_ENV=production`.
8. Revisar limites de intentos / correo de Supabase. Al pasar por servidor,
   el proveedor puede ver una IP compartida. Antes de abrir a clientes reales,
   definir proteccion contra abuso por IP en el borde y CAPTCHA si corresponde;
   no hay un rate limiter distribuido propio en esta etapa.

Auth esta desactivado por defecto. Si falta configuracion, las pantallas muestran
acceso no disponible y los handlers devuelven 503. La tienda sigue publica.
Codex no creo proyectos, cuentas, claves, SMTP ni variables remotas.

## Arquitectura y seguridad

- `lib/auth/config.ts`: validacion de configuracion, bloqueo de produccion,
  parametros de confirmacion y origen estricto para POST (CSRF).
- `lib/auth/server.ts`: cliente SSR por request y `requireUser()` con `getUser()`.
- `proxy.ts`: renueva cookies antes del render, solo en rutas Auth / expediente.
  No sustituye la validacion del servidor en pagina ni en operaciones sensibles.
- `lib/auth/flows.ts`: validacion y operaciones contra Supabase, sin guardar
  contrasenas ni imprimir errores del proveedor.
- `app/auth/[action]/route.ts`: POST para las operaciones; destinos fijos.
  No se acepta `next`, callback externo, GET logout ni un user.id del formulario.
- `/auth/confirm`: recibe `email` o `recovery`, guarda el hash temporalmente
  en cookie HttpOnly de 10 minutos y redirige inmediatamente a una URL limpia.
  GET no consume OTP: protege ante scanners que siguen enlaces de correo.
  La confirmacion requiere POST; recovery verifica OTP antes de cambiar password,
  incluso si habia otra cuenta logueada. El tipo de la URL no es autorizacion.
- `/auth/session`: valida identidad con Supabase para cambios de cuenta, foco,
  navegacion atras y un chequeo cada 60 segundos en primer plano.
- Sesiones en cookies HttpOnly, SameSite=Lax, host-only, Secure en HTTPS.
  No hay SDK Auth de navegador, tokens en localStorage ni tokens en props React.
  Proxy / handlers usan no-store; no aplicar ISR ni cache compartida en estas rutas.
- Logout cierra la sesion actual (`scope: local`), no todos los dispositivos.
  Tras cambiar password se solicita login de nuevo. La revocacion de otras
  sesiones depende del proveedor; no se promete revocacion instantanea de JWT.
- BroadcastChannel + revalidacion del servidor desmontan la interfaz ante cambio
  de identidad. Una pestana inactiva oculta los datos hasta revalidar.

El enlace de correo contiene un secreto temporal. No registrar URLs completas
de `/auth/confirm` en observabilidad ni guardar contrasenas/cookies en logs.
Los handlers de confirmacion no renderizan Analytics y usan no-referrer.
Si el OTP se consume pero el cambio de password falla, se requiere un enlace
nuevo; se muestra un error generico. El codigo no almacena un grant adicional.

## Datos locales: limitacion deliberada

`lobo.mi-expediente.v1` se conserva sin leer, migrar, vincular ni sobrescribir
desde la interfaz autenticada. Puede seguir conteniendo datos legacy anonimos.
Cada cuenta comienza vacia con `lobo.mi-expediente.auth-v1.<user.id>`.
Un UUID validado en servidor selecciona el adaptador; no usamos email ni metadata
editable para identificar al propietario. Los eventos tambien separan las claves.

Esto NO ofrece aislamiento seguro entre personas que comparten navegador.
Cualquier script del mismo origen o persona con acceso al perfil puede leer las
claves, incluso tras logout. No hay cifrado, respaldo ni sincronizacion.
Logout conserva los registros locales y limpiar el navegador los elimina.
El aviso discreto en Mi Expediente comunica el almacenamiento temporal local.
No introducir datos privados reales durante estas pruebas.

La futura migracion implementara otro `PackRepository`, con `user_id` referenciando
`auth.users.id`, RLS para SELECT/INSERT/UPDATE/DELETE y comprobaciones WITH CHECK.
Los pesos deberan autorizarse a traves del propietario de su perro. No confiar
en IDs de propietario enviados por el cliente. Los legacy requeriran un flujo
explicito de revision/importacion; no se infiere propiedad por coincidir navegador.
No se crean tablas, politicas, migraciones, CRM, pedidos ni administracion aqui.

## Pruebas sin credenciales

Node >= 22.18:

```sh
npm ci
npm test
npx tsc --noEmit --incremental false
npx eslint 'app/(auth)' app/auth app/mi-expediente lib/auth proxy.ts tests/auth playwright.config.ts
npx playwright install chromium
npm run test:integration
npm run build
```

Con Google Chrome instalado: `PLAYWRIGHT_CHANNEL=chrome npm run test:integration`.
Playwright inicia Next en 127.0.0.1:3100 y un doble HTTP de Supabase en
127.0.0.1:54329, usa el SDK real y detiene ambos al terminar. No se conecta a
Supabase real. Estos puertos deben estar libres. No hay un bypass de Auth en
el codigo de aplicacion; el doble de pruebas solo existe bajo `tests/auth`.
Las capturas / traces usan exclusivamente datos inventados y quedan ignoradas.

Cobertura: validacion, CSRF, enlaces invalidos/reutilizados, registro/confirmacion,
recuperacion, cookies HttpOnly, renovacion, cookies adulteradas, logout entre
pestanas, cambio A/B, legacy intacto, red caida y vistas movil/escritorio.
Los tests existentes de expediente y calculadora se ejecutan sin modificarlos
salvo la extension de pruebas del adaptador de expediente.

## Pruebas que SI requieren Supabase configurado

- Entrega real de correo (inbox/spam), confirmacion activada y cuentas duplicadas.
- Recuperacion desde otro navegador/dispositivo, expiracion real de OTP,
  reenvios y limites del proveedor. Probar el caso de una sesion B ya iniciada
  que abre un enlace de recuperacion de A.
- Cookies Secure en HTTPS, refresh/rotacion reales, concurrencia entre pestañas,
  sesion revocada en Supabase y errores temporales de red del proveedor.
- Dominios exactos de Preview, SMTP, restricciones de acceso de Vercel y
  que ninguna respuesta autenticada se comparta por cache/CDN.
- Una compra de prueba sin login usando la configuracion de pagos de pruebas.

Google OAuth y la autorizacion con RLS se probaran en sus respectivas etapas.

## Verificacion realizada (11 octubre 2026)

- 41 pruebas unitarias aprobadas (Auth, repositorio/datos y calculadora).
- 8 pruebas de integracion Playwright aprobadas contra el build optimizado
  local, SDK real y proveedor HTTP simulado; no credenciales reales.
- TypeScript y build aprobados. Las rutas comerciales siguen estaticas.
- Lint de todos los archivos de este cambio aprobado. Lint global falla por
  dos `no-explicit-any` preexistentes en `app/api/whatsapp/webhook/route.ts:96-97`.
  Ese archivo no se modifico.
- Capturas revisadas en 375 y 1280 px; logout disponible tambien en movil.
- `npm audit`: 17 paquetes reportados (1 low, 3 moderate, 12 high, 1 critical).
  Next 16.2.6 tiene avisos criticos y requiere revision/actualizacion antes de
  cualquier apertura a clientes reales. Next, Sharp, PostCSS, Mercado Pago y
  uuid mantienen exactamente las versiones del lockfile original. No se aplico
  `npm audit fix` ni se ampliaron cambios al framework o pagos.
  La aplicabilidad de cada aviso requiere revision; el conteo no implica que
  todos sean explotables en este sitio. Auditoria de dependencias no aprobada.
- No se ejecuto compra real ni deploy.

### Dependencias pendientes (npm audit, 11 octubre 2026)

Son 17 paquetes afectados, no 17 avisos unicos: npm tambien cuenta paquetes
afectados a traves de dependencias transitivas. Todos existian con las mismas
versiones en el lockfile base; no se modifico ninguna entrada de paquete previa.
La auditoria actual no reporta paquetes nuevos de Supabase o Playwright.

| Paquete | Severidad maxima | Riesgo reportado / dependencia afectada |
| --- | --- | --- |
| next (16.2.6) | Critical | Ejecucion remota de codigo, bypass de Proxy, SSRF, DoS y cache |
| @next/eslint-plugin-next | High | Cadena fast-glob / micromatch / braces |
| brace-expansion | High | Expansion sin limites, agotamiento de memoria, CPU o pila |
| braces | High | Agotamiento de pila con patrones anidados |
| browserslist | High | Memoria sin limite y errores con estadisticas no confiables |
| eslint-config-next | High | Dependencias del plugin de Next |
| fast-glob | High | Cadena micromatch / braces |
| js-yaml | High | Consumo excesivo de CPU al procesar YAML |
| micromatch | High | Dependencia braces |
| nanoid | High | Bucles infinitos en generadores con tamanos invalidos |
| postcss | High | Lectura de archivos mediante sourceMappingURL; XSS en versiones antiguas |
| sharp | High | Vulnerabilidades heredadas de libvips, libheif y librsvg |
| source-map-js | High | Denegacion de servicio mediante source maps |
| baseline-browser-mapping | Moderate | Terminacion del proceso con entradas invalidas |
| mercadopago | Moderate | Dependencia uuid |
| uuid | Moderate | Falta de validacion de limites de buffer |
| @babel/core | Low | Lectura de archivos mediante sourceMappingURL |

Avisos criticos de Next incluidos en el reporte:

- [RCE en servidores Windows](https://github.com/advisories/GHSA-p293-qw3h-jr36).
- [RCE en optimizacion de imagenes AVIF](https://github.com/advisories/GHSA-2xp9-vwfh-vxw4).
- [RCE en next/og ImageResponse](https://github.com/advisories/GHSA-vcvr-r3jv-pc5j).

El reporte propone Next 16.4.0 y Mercado Pago 3.6.1; el segundo implica un cambio
mayor. Tambien propone un cambio mayor de eslint-config-next a 14.2.35, que no
debe aplicarse automaticamente sobre este proyecto Next 16. Se requiere una
tarea separada de actualizacion y regresion. No se ha demostrado explotabilidad
de cada aviso en esta aplicacion; tampoco se considera segura para produccion.

### Pruebas reales reportadas por el usuario (11 octubre 2026)

En el proyecto de desarrollo de Supabase, con correo enviado por Resend:

- Registro y confirmacion de correo: aprobados.
- Login y recuperacion de contrasena: aprobados.
- Proteccion de `/mi-expediente`: aprobada.
- Los expedientes legacy no aparecen en la cuenta nueva: aprobado.

Estos resultados fueron confirmados por el usuario, no por la suite automatizada.
Las pruebas adicionales de proveedor, HTTPS y Preview listadas arriba siguen
siendo necesarias antes de habilitar clientes reales, junto con PostgreSQL + RLS.

Para repetir la integracion contra el build local (no despliega):

```sh
npm run build
PLAYWRIGHT_CHANNEL=chrome PLAYWRIGHT_PRODUCTION=1 npm run test:integration
```

## Archivos del cambio

Nuevos:

- `.env.example`, `proxy.ts`, `playwright.config.ts`, `docs/auth.md`.
- `lib/auth/config.ts`, `server.ts`, `flows.ts`, `tests/auth.test.mjs`.
- `app/(auth)/layout.tsx`, `AuthForm.tsx`, `auth.module.css` y las cuatro
  paginas: `login`, `registro`, `recuperar-contrasena`, `restablecer-contrasena`.
- `app/auth/[action]/route.ts`, `app/auth/confirm/route.ts`,
  `app/auth/session/route.ts`, `app/mi-expediente/SessionBoundary.tsx`.
- `tests/auth/auth.spec.ts`, `tests/auth/fake-supabase.mjs`.

Modificados:

- `.gitignore`, `package.json`, `package-lock.json`.
- Dentro de `app/mi-expediente/`: `page.tsx`, `MiExpediente.tsx`,
  `repository.ts`, `localStorageRepository.ts`, `usePack.ts`,
  `components/Topbar.tsx`, `expediente.module.css`, `README.md` y
  `tests/repository.test.mjs`.

Checkout, Mercado Pago, calculadora, planes, webhook WhatsApp y archivos SEO
sin cambios. No hay cambios en las versiones existentes de pagos o Next.
