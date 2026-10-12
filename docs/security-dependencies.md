# Remediacion de dependencias: 11 octubre 2026

Rama: `fix/security-dependencies`, creada desde `origin/feature/auth-v1`
actualizado (`fbfb357f91df17237cb480e4767a55780ec8650b`). No incorpora cambios
posteriores de `feature/expediente-v2` ni modifica otras ramas.

## Resultado y alcance

Remediacion parcial, con regresion local aprobada. NO es autorizacion para
produccion ni certificacion de ausencia de vulnerabilidades.

| Auditoria completa | Antes | Despues |
| --- | ---: | ---: |
| Critical | 1 | 0 |
| High | 12 | 5 |
| Moderate | 3 | 2 |
| Low | 1 | 0 |
| Paquetes afectados | 17 | 7 |

`npm audit --omit=dev` despues: 2 moderate, 0 high, 0 critical. Esta vista
separa runtime de herramientas de desarrollo; NO sustituye la auditoria completa.
Ambas auditorias posteriores terminan con codigo 1 por los avisos restantes.

Evidencia completa, sin supresiones, con advisory, rango, severidad, cadena,
`isDirect` y sugerencia original de npm:

- [Antes](security/audit-before.json).
- [Despues](security/audit-after.json).

Los conteos son paquetes afectados, incluyendo propagacion transitiva, no
vulnerabilidades independientes. Los 7 paquetes restantes derivan de 2 advisories.

## Versiones y decisiones

Se consultaron `npm view ... dist-tags`, versiones, engines y peerDependencies
contra el registro durante esta ejecucion, no se reutilizo la sugerencia vieja.
`latest` de Next y eslint-config-next es 16.4.0; se excluyeron canary y preview.
Tambien se verifico 16.3.8 como alternativa anterior corregida. Se eligio 16.4.0
estable, dentro del major 16 y con el mismo numero para framework y configuracion
de lint. Sus peers admiten React 19.2.4 y Node >=20.9; estas pruebas usaron Node
24.15.0. Los tests nativos del proyecto requieren Node >=22.18.

El framework trae PostCSS 8.5.23 y resuelve Sharp 0.35.5 sin overrides. PostCSS
8.5.29 existe, pero no se fuerza sobre la version corregida elegida por Next.
Los cambios de Babel y Browserslist incluyen sus helpers y datos compatibles;
las variantes de SWC y Sharp del lockfile cambian junto con sus paquetes padres.

| Paquete auditado | Relacion | Antes | Despues / version corregida verificada |
| --- | --- | --- | --- |
| next | Directa, runtime | 16.2.6 | 16.4.0, sin avisos publicados en esta auditoria |
| eslint-config-next | Directa, dev | 16.2.6 | 16.4.0, pendiente por braces |
| @next/eslint-plugin-next | Transitiva, dev | 16.2.6 | 16.4.0, pendiente por braces |
| @babel/core | Transitiva, dev | 7.29.0 | 7.29.7, corregida |
| baseline-browser-mapping | Transitiva, tooling/framework | 2.10.31 | 2.11.28, corregida |
| brace-expansion | Transitiva, dev | 1.1.14 y 5.0.6 | 1.1.21 y 5.0.12, corregidas |
| braces | Transitiva, dev | 3.0.3 | 3.0.3; no hay parche estable publicado |
| browserslist | Transitiva, dev | 4.28.2 | 4.29.3, corregida |
| fast-glob | Transitiva, dev | 3.3.1 | 3.3.1, pendiente por braces |
| js-yaml | Transitiva, dev | 4.1.1 | 4.3.2, corregida |
| mercadopago | Directa, runtime | 2.12.1 | 2.12.1; 3.6.1 disponible pero no aplicada |
| micromatch | Transitiva, dev | 4.0.8 | 4.0.8, pendiente por braces |
| nanoid | Transitiva, PostCSS | 3.3.12 | 3.3.20, corregida |
| postcss | Transitiva, framework/build | 8.4.31 y 8.5.15 | 8.5.23, corregida y deduplicada |
| sharp | Transitiva opcional, imagenes | 0.34.5 | 0.35.5, corregida |
| source-map-js | Transitiva, PostCSS | 1.2.1 | 1.2.2, corregida |
| uuid | Transitiva de Mercado Pago, runtime | 9.0.1 | 9.0.1; parche 11.1.1 fuera del rango del SDK |

Las versiones indicadas como corregidas estan instaladas, fuera de los rangos
reportados y ausentes del reporte posterior; no se afirma que sean las primeras
versiones corregidas de cada serie. El JSON conserva todos los advisories, incluso
cuando varios pertenecen al mismo paquete o se propagan hacia sus padres.

React/react-dom 19.2.4, Supabase SSR 0.12.7, Supabase JS 2.117.3, Mercado Pago
2.12.1 y uuid 9.0.1 conservan exactamente sus entradas previas del lockfile.
No se agregaron dependencias directas, overrides ni exclusiones de auditoria. No se uso
`npm audit fix` ni `--force`.

## Aplicabilidad a LOBO

Analisis basado en el codigo y configuracion local, no en una inspeccion del
despliegue Vercel ni en explotacion del sitio. Una condicion no observada reduce
exposicion, pero no convierte una dependencia vulnerable en una version corregida.

### Next y procesamiento de imagenes

- RCE Windows, [GHSA-p293-qw3h-jr36](https://github.com/vercel/next.js/security/advisories/GHSA-p293-qw3h-jr36): requiere filesystem Windows. No aplica al desarrollo macOS ni a un runtime Linux en Vercel; sigue siendo relevante si se autoaloja en Windows. Parche de la serie 16: 16.3.3; instalado 16.4.0.
- RCE AVIF, [GHSA-2xp9-vwfh-vxw4](https://github.com/vercel/next.js/security/advisories/GHSA-2xp9-vwfh-vxw4): afecta la decodificacion de AVIF mediante Sharp/libheif. LOBO usa `next/image`, por lo que el optimizador es una superficie real. Las imagenes observadas son assets locales; no se encontro carga de AVIF del usuario hacia ese optimizador. No se asumio inmunidad por alojarse en Vercel. Next y Sharp quedaron actualizados; prueba HTTP de optimizacion aprobada.
- RCE `next/og`, [GHSA-vcvr-r3jv-pc5j](https://github.com/vercel/next.js/security/advisories/GHSA-vcvr-r3jv-pc5j): requiere ImageResponse Node con valores no confiables en SVG. No se encontraron usos de ImageResponse/next/og en el proyecto. Parche 16.3.6; instalado 16.4.0.
- Bypass Proxy, [GHSA-6gpp-xcg3-4w24](https://github.com/vercel/next.js/security/advisories/GHSA-6gpp-xcg3-4w24): requiere App Router/Turbopack con una entrada en `config.i18n.locales`. LOBO no configura i18n y ademas valida `getUser()` dentro de la pagina, no solo en Proxy. La actualizacion no elimina esa defensa.
- SSRF de imagenes, [GHSA-cjq9-62q9-8jv4](https://github.com/vercel/next.js/security/advisories/GHSA-cjq9-62q9-8jv4): el advisory excluye apps sin `images.remotePatterns`; LOBO no configura esa lista. SSRF por rewrites tampoco tiene el escenario identificado: solo existe una redireccion fija, no rewrites a hosts controlados por clientes.
- Avisos Server Actions, Edge payload y endpoints de Server Functions: Auth y checkout usan Route Handlers; no se encontraron directivas `use server`, custom server ni runtime Edge. No se identifico esa ruta de explotacion en codigo de LOBO.
- Cache/SSG/ISR y cuerpos malformados: hay paginas comerciales estaticas. Auth es dinamico y usa no-store; esto reduce exposicion de sesiones, pero no permite descartar avisos del framework o diferencias de cache/CDN. Se actualizo Next y se comprobo no-store en integracion; falta verificar Vercel Preview.
- MCP del servidor de desarrollo: aplicable al entorno de desarrollo, no a `next start`. No exponer `next dev` a redes publicas. Metadata dinamica con dynamicParams: no se encontraron generadores de imagen parametrizados que cumplan ese escenario.
- Sharp/libvips/libheif/librsvg: aplicabilidad condicionada al formato e imagen procesados. Se actualizo la dependencia real, sin desactivar el optimizador ni ocultar avisos.

### Tooling y otras transitivas

- PostCSS/Babel/source-map-js: lectura de archivos, XSS o DoS dependen de CSS, comentarios sourceMappingURL o mapas no confiables. El build usa fuentes del repo, no CSS arbitrario recibido por una API. Riesgo de tooling/CI relevante al aceptar contribuciones; corregido mediante versiones verificadas.
- brace-expansion, browserslist, baseline-browser-mapping y js-yaml: fallos con patrones, consultas, estadisticas o YAML adversarios. No se encontraron endpoints publicos que acepten esas entradas para estas librerias. Son riesgos del build/lint; se actualizaron sin cambiar sus majors.
- nanoid: condiciones de bucles infinitos con tamanos invalidos. LOBO no lo invoca directamente con valores del cliente; llega por PostCSS. Actualizado dentro de la serie 3.

## Pendientes y opciones detenidas

### High: cadena de lint (5 paquetes, un advisory)

`eslint-config-next -> @next/eslint-plugin-next -> fast-glob -> micromatch -> braces`.
[GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) afecta
patrones de llaves profundamente anidados; el registro sigue publicando 3.0.3
como latest y el advisory no ofrece parche. Los cinco paquetes son dev-only;
no aparecen en la auditoria omit=dev. No hay un endpoint que procese patrones
de usuarios mediante esta cadena, pero lint/CI sobre entradas no confiables
puede agotar la pila.

Se detuvo el downgrade automatico propuesto a eslint-config-next 14.2.35:
desalinearia lint de Next 16 y no es una remediacion conservadora. Opciones:
esperar el parche upstream y actualizar la cadena; o revisar en una tarea
separada un reemplazo/fork mantenido con equivalencia de reglas. No quitar
reglas, ignorar el advisory ni ejecutar CI de contribuciones no confiables
con secretos para mejorar artificialmente el resultado.

### Moderate: Mercado Pago / uuid (2 paquetes, un advisory)

[GHSA-w5hq-g745-h8pq](https://github.com/uuidjs/uuid/security/advisories/GHSA-w5hq-g745-h8pq)
afecta v3/v5/v6 con buffers de salida. El SDK instalado usa `uuid.v4()` sin
buffer en `dist/utils/restClient/index.js` para la clave de idempotencia. Esa
ruta no coincide con el escenario vulnerable. El test del SDK real confirma
la clave v4, el payload, los importes y la respuesta usando transporte simulado.

No se declara corregido: uuid 9.0.1 permanece vulnerable y deprecado. La ultima
serie 2 de Mercado Pago consultada (2.13.0) sigue dependiendo de uuid ^9.0.0;
actualizarla no resuelve el aviso. uuid 11.1.1 es un parche verificado, pero
forzarlo con override viola el rango declarado por el SDK. Mercado Pago 3.6.1
es estable y propuesto por npm, pero implica cambio mayor. Se detuvieron esas
opciones: requieren revision de migracion y compra en sandbox antes de tocar
pagos. En esta rama no se altera el flujo ni el paquete de Mercado Pago.

### Aviso upstream aun no publicado

El [anuncio oficial del 8 de octubre](https://nextjs.org/blog/upcoming-nextjs-security-update-october-2026)
previene de un lanzamiento el 14 de octubre por dos fallos criticos y uno alto
en dependencias upstream. A la fecha de este reporte no publica alcance,
versiones afectadas ni parches. No se cuentan como remediados ni se inventan
versiones solucionadas. Repetir registro, advisories, auditoria y regresion al
publicarse. Un resultado actual de cero critical NO cierra este pendiente.

## Pruebas y regresiones

Comandos ejecutados en el worktree, sin variables de produccion:

```sh
npm ci --cache /private/tmp/lobo-auth-npm-cache
npm audit --json
npm audit --omit=dev --json
npm test
npx tsc --noEmit --incremental false
npx eslint 'app/(auth)' app/auth app/mi-expediente lib/auth proxy.ts tests/auth tests/security playwright.config.ts
npm run build
PLAYWRIGHT_CHANNEL=chrome PLAYWRIGHT_PRODUCTION=1 npm run test:integration
npm run lint
```

- Instalacion limpia: aprobada, 382 paquetes instalados. Warning de deprecacion uuid pendiente.
- Unitarias: 43/43, incluyendo las 41 previas y dos pruebas del contrato real de checkout con HTTP simulado. No se enviaron preferencias ni pagos al proveedor.
- TypeScript y build optimizado: aprobados con Next 16.4.0; rutas comerciales siguen estaticas y Auth/APIs dinamicas.
- Lint de Auth y tests: aprobado. Lint global sigue fallando exclusivamente por los dos `no-explicit-any` preexistentes en WhatsApp:96-97; no se cambiaron ni suprimieron.
- Playwright: 11/11 contra build optimizado y Supabase simulado. Incluye las ocho pruebas de Auth V1 (registro, OTP, recuperacion, cookies SSR/refresh, CSRF, logout, cambio de cuenta y legacy) y tres pruebas de regresion comercial.
- Rutas publicas sin login, redireccion 301, cabeceras, robots/sitemap, paginas de resultados y calculadora: aprobadas. Checkout invalido mantiene 400 y GET 405; webhook GET no autorizado mantiene 403 y evento vacio mantiene 200, sin llamadas externas de mensajeria.
- Imagen local optimizada: HTTP 200, content-type image y cuerpo no vacio. Pagina principal con imagen cargada y calculadora visibles a 375 y 1280 px, sin errores JS capturados. Capturas locales ignoradas por Git.
- Las primeras versiones de las pruebas nuevas fallaron por una expectativa de URL sin slash final y por tipos DOM demasiado amplios; se corrigieron solo los tests y se repitieron hasta aprobar. No fue necesaria una correccion del codigo de negocio.

No se detectaron regresiones en estas pruebas; no cubren todos los escenarios
reales. Pendientes manuales: entrega Resend/confirmacion/recuperacion contra
Supabase real tras el upgrade, cookies Secure y cache en Vercel Preview, pagos
en sandbox y regresion en el runtime Linux de Vercel. Los resultados reales
previos de Auth V1 no equivalen a ejecutar esas pruebas nuevamente con Next 16.4.
No se cambiaron credenciales, checkout, WhatsApp, SEO, calculadora ni planes.
No se hizo deploy, merge ni habilitacion de clientes reales. PostgreSQL + RLS y
las limitaciones de localStorage de Auth V1 siguen pendientes antes de produccion.

Referencia de version: [Next.js 16.4](https://nextjs.org/blog/next-16-4).
