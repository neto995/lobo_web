# Sprint 2A: perfiles y pesos en PostgreSQL

Revision: 20 de octubre de 2026. Rama local `feature/sprint2a-persistence`.
Base: `3362f92aa0e9c713901c82dad28fa96e764d21ee`, PR #5 integrado en
`feature/expediente-v2`. Cambios pendientes de revision; sin commit, push ni PR.

## Alcance y decisiones autorizadas

Se implementan alta, consulta y edicion de perfiles, historial de peso, adaptador
remoto y API autenticada. Se conserva PackRepository asincrono y la sesion SSR.
No se implementan Storage, cartilla veterinaria, IA, borrado ni importaciones.
No se modifican checkout, Mercado Pago, calculadora, planes, suscripciones,
WhatsApp, dependencias, configuracion privada ni produccion.
No se aplicaron migraciones remotas ni se desplego esta rama a Preview/produccion.

### Rutas y autorizacion

| Ruta | Operacion |
| --- | --- |
| GET /api/mi-expediente/dogs | Listado propio e historial |
| POST /api/mi-expediente/dogs | Crear perro y primer peso atomicos |
| GET /api/mi-expediente/dogs/[id] | Detalle propio |
| PATCH /api/mi-expediente/dogs/[id] | Editar perfil sin reemplazar pesos |
| POST /api/mi-expediente/dogs/[id]/weights | Agregar medicion actual |

Cada handler valida `auth.getUser()` y consulta con ese cliente SSR/JWT y RLS,
nunca service role. No acepta identidad ni propietario enviados por el navegador.
Las escrituras verifican Origin exacto y Sec-Fetch-Site. JSON limitado a 16 KiB,
campos permitidos explicitamente, UUID validos y errores sin detalles internos.
401 sin sesion, 403 por origen rechazado, 404 indistinguible entre ajeno/inexistente;
respuestas privadas `no-store`. El proxy agrega solo las nuevas rutas privadas.
Auth sigue bloqueado en `VERCEL_ENV=production`; comprar no requiere login.

NUMERIC, NULL y nombres SQL se normalizan al DTO remoto. La lectura pagina usando
conteo exacto, incluyendo proyectos con max_rows reducido. Los pesos se ordenan
por recorded_at e ID, sin truncar el historial. La grafica muestra los ultimos
seis; el desplegable conserva todas las mediciones. No hay Realtime: consultar
desde otro dispositivo requiere entrar o recargar la vista.

Timeout de consultas 10 s y del transporte navegador 30 s, sin reintentos
automaticos de PostgREST en estas rutas. Una escritura incierta no muestra exito
y bloquea otro intento hasta consultar de nuevo. Una lectura anterior no elimina
ese bloqueo. No es una garantia de idempotencia entre recargas o dispositivos:
revisar los datos antes de repetir. No hay fallback a localStorage.

### RPC e integridad

Nueva migracion: `20261018000100_create_dog_with_initial_weight.sql`.
La migracion integrada del PR #5 y sus dos suites SQL permanecen intactas.

- `create_dog_with_initial_weight` es SECURITY INVOKER, search_path vacio y
  referencias calificadas al esquema. El propietario sale de `auth.uid()`.
- EXECUTE solo para authenticated entre los roles API. Se revocan PUBLIC, anon
  y el permiso por defecto de service_role. El propietario administrativo de la
  funcion conserva sus privilegios inherentes de PostgreSQL.
- Ambas inserciones aplican RLS; un error del peso revierte el perro completo.
- Se retornan las filas confirmadas y la API expone unicamente el DTO permitido.
- No se alteran las cuatro tablas ni sus 16 politicas. No se agregan modelos.

La atomicidad cubre esta RPC, no una regla universal que obligue a todo perro a
tener peso: los grants existentes permiten otras inserciones propias directas.
Las validaciones del formulario no amplian los CHECK SQL aprobados. RLS de
attachments protege metadata, no archivos: Storage sigue sin implementarse.

### Formulario y datos heredados

Nacimiento conocido exacto; estimacion de anos/meses con referencia inicial
America/Mexico_City; o edad desconocida con tres NULL. Editar otro campo conserva
meses y fecha originales. Cambiar explicitamente la estimacion establece nueva
referencia. La edad visible avanza por calendario, incluyendo fines de mes y
anos bisiestos. No se infiere nacimiento ni se transforma texto heredado.

Sin dailyPortion, URL manual, feeding_plans ni calculos duplicados. Avatar local
y enlace a la calculadora existente. Ajuste autorizado el 20 de octubre:
peso objetivo opcional al crear y editar, vacio como NULL; peso inicial obligatorio.
La API acepta pesos entre 1 y 150 kg representables a una decimal y rechaza
12.46 sin convertirlo en 12.5. Valida tambien el texto antes de convertirlo a
Number para no perder precision extra. 12.4 y 12.400 representan el mismo peso
valido. No cambian tablas, RPC ni politicas: la validacion descrita corresponde
a la API de esta interfaz, no a una nueva restriccion SQL para escritores directos.
Historial vacio no se convierte en cero.
El aviso explica que los expedientes anteriores no se importaron ni atribuyeron
y pueden conservarse en el navegador si su almacenamiento no ha sido eliminado.
No se consulta el almacenamiento para comprobar su existencia.

No se leen, atribuyen ni sobrescriben `lobo.mi-expediente.v1` ni
`lobo.mi-expediente.auth-v1.<user.id>`. El adaptador legacy conserva su comportamiento;
solo se separaron sus tipos. Porcion, edad textual, URLs e historial quedan intactos.
La futura importacion exigira revision explicita de propiedad y de todos los campos,
conservando los originales. El namespace UUID no demuestra propiedad ni protege
contra otras personas que compartan navegador.

## Evidencia de pruebas

Repeticion del 20 de octubre tras los tres ajustes autorizados. Los resultados
finales siguientes sustituyen los conteos del 19 de octubre (60 unitarias,
3 reales y 20 por suite simulada), sin reetiquetar evidencia remota.

| Comprobacion | Resultado |
| --- | --- |
| npm test | 62 ejecutadas, 62 aprobadas, 0 fallidas |
| pgTAP local real | 221 ejecutadas, 221 aprobadas, 0 fallidas |
| HTTP/browser con Supabase local real | 4 ejecutadas, 4 aprobadas, 0 fallidas |
| Playwright / Supabase simulado, dev | 22 ejecutadas, 22 aprobadas, 0 fallidas |
| Playwright / Supabase simulado, build optimizado final | 22 ejecutadas, 22 aprobadas, 0 fallidas |
| TypeScript sin incremental | Aprobado |
| Lint dirigido a archivos de esta entrega | Aprobado |
| npm run build, copia aislada | Aprobado, Next 16.4.2 / Turbopack, 28 paginas generadas |
| Lint global | 2 errores preexistentes WhatsApp:96-97, sin modificar ni suprimir |

Las 221 SQL: 42 de integridad + 130 RLS previas + 49 RPC nuevas. Incluyen ACL,
SECURITY INVOKER, ausencia de identidad, ataques A/B y rollback cuando el peso falla
por CHECK, NOT NULL o RLS. Extracto verificado de `supabase test db`:

```text
All tests successful.
Files=3, Tests=221
Result: PASS
```

La integracion real local usa Auth, PostgREST y PostgreSQL, cuentas ficticias y
JWT propios. Cubre alta con peso, edicion sin perdida de historial, otra medicion,
logout/login, otra sesion de navegador y acceso cruzado por Next y directamente
por PostgREST. La RPC se prueba directamente con peso invalido y con anon.
La nueva prueba real confirma target_weight_kg SQL NULL mediante PostgREST y
valores 12.4 exactos en el historial; 12.46 devuelve 400 en alta y medicion,
sin perro parcial ni peso adicional. Un peso inicial vacio tambien devuelve 400.
Auth local autoconfirma emails ficticios: NO prueba Resend, entrega de correo ni
recuperacion remota. Los flujos de confirmacion/recuperacion siguen cubiertos por
la suite simulada; la evidencia manual anterior de Sprint 1 no se reetiqueta.

La suite simulada incluye preservacion byte a byte de ambos namespaces y ausencia
de lecturas legacy, errores de carga/escritura, respuesta perdida sin reintento,
edad en tres modos y 1005 mediciones. Las tres regresiones comerciales verifican
rutas publicas, imagenes y validacion API sin llamadas a pagos. Las unitarias
incluyen calculadora y contrato real del SDK de checkout con transporte simulado.
No se crearon preferencias ni pagos. Capturas revisadas en 375 y 1280 px.

Incidencias del 20 de octubre:

- Primera repeticion SQL: 221 ejecutadas, 217 aprobadas, 4 fallidas. Los conteos
  globales encontraron perfiles ficticios de integraciones anteriores. Sin error
  SQL ni fallo de aislamiento RLS. Se repitieron copias temporales de las mismas
  suites con TRUNCATE de las cuatro tablas dentro de BEGIN/ROLLBACK, antes de
  crear fixtures. No se cambiaron pruebas versionadas, tablas ni politicas.
  La huella SHA-256 del contenido de las cuatro tablas antes/despues coincidio:
  los datos locales existentes no fueron borrados. Resultado final 221/221.
- Primera suite simulada dev: 20 aprobadas, 2 fallidas. El selector nuevo
  "No definido" coincidia con resumen y detalle; se preciso al elemento
  semantico de definicion. Otro caso agoto su tiempo al iniciar sesion, sin
  causa concluyente; no se cambiaron Auth ni timeouts. Repeticion completa
  22/22 y suite sobre build optimizado 22/22.
- Lint global repetido: los mismos dos errores de WhatsApp, no resueltos.

Incidencias historicas del 19 de octubre: faltaba Chromium de Playwright; se uso Chrome instalado
sin agregar dependencias. El dev preexistente 3101 se conservo y se probo desde
otra copia. Se corrigieron la expectativa antigua de cache dev (no-cache/no-store,
manteniendo no-store obligatorio en el build), selectores ambiguos del anunciador
de Next y reintentos de lectura que retrasaban el error. Una corrida intermedia
19/20 tuvo timeout de login bajo carga; la repeticion completa paso. La primera
local fue 2/3: Auth encontro una conexion terminada tras reiniciar PostgreSQL
(SQLSTATE 57P01, confirmado sin imprimir logs privados); al estabilizarse paso 3/3.
No se modificaron politicas de seguridad para aprobar pruebas.

Warnings no bloqueantes: Node MODULE_TYPELESS_PACKAGE_JSON y recomendacion LCP
de la imagen comercial existente. No se cambia package.json ni el sitio por ellos.

## Entorno y reproduccion

Node 24.15.0; Supabase CLI 2.121.0; Docker Engine 29.8.2; PostgreSQL 17.11
aarch64; pgTAP 1.3.3; Next/eslint-config-next 16.4.2; React/React DOM 19.2.9.

Entorno Supabase temporal: `/private/tmp/lobo-persistence-local.DFpfDf`.
Copia de aplicacion: `/private/tmp/lobo-persistence-playwright.YBPSbd`.
No contiene .git, .env*, .mp-sandbox/ ni los archivos privados del worktree.
Se copiaron dependencias instaladas, sin modificar el lockfile. Los procesos de
prueba usan entorno limpio salvo HOME/PATH/TMPDIR y variables explicitas de prueba.

API local 55441, PostgreSQL 55442 y correo local 55444, publicados solo en
127.0.0.1. Storage, Studio, Realtime, analytics y edge runtime deshabilitados.
Next usa 3100 para simulado y 3102 para real. El proyecto CLI es unico y desechable;
no esta enlazado. No se usa db push, --linked ni service role remoto.

El config temporal fija db.major_version=17, seed deshabilitado, schema public,
max_rows=1000, auth.site_url=http://127.0.0.1:3102, confirmaciones de email locales
deshabilitadas y ningun SMTP externo. Las migraciones se aplicaron solo alli.
Para repetir desde cero, copiar config/migraciones/tests a un proyecto temporal
vacio y comprobar destino y puertos antes de aplicar. Nunca reutilizar datos reales.

El status del CLI se conserva fuera de Git con permisos privados; la aplicacion
recibe otro JSON que contiene exclusivamente API_URL y PUBLISHABLE_KEY locales,
no claves secretas. La config de pruebas rechaza destinos distintos de
http://127.0.0.1:55441 y requiere clave publicable.

Comandos desde una copia aislada, con entorno limpio y el workdir SQL local:

```sh
npm test
npx tsc --noEmit --incremental false
npx eslint app/mi-expediente app/api/mi-expediente lib/expediente proxy.ts tests/auth tests/persistence-local
supabase test db --workdir /ruta/al/proyecto-local-desechable
LOCAL_SUPABASE_STATUS_JSON=/ruta/privada/status-publicable.json npx playwright test --config tests/persistence-local/playwright.config.ts
PLAYWRIGHT_CHANNEL=chrome npm run test:integration
npm run build
PLAYWRIGHT_CHANNEL=chrome PLAYWRIGHT_PRODUCTION=1 npm run test:integration
```

Las pruebas reales NO deben ejecutarse a la vez que pgTAP o un reinicio de la base.
Las suites simuladas administran sus servidores temporales y los detienen al salir.
Si la base local ya contiene fixtures de navegacion, las suites SQL originales
requieren una base vacia o aislamiento transaccional de esos datos. No resetear
ni truncar permanentemente los registros para resolver sus conteos globales.
El harness local de esta repeticion esta en
`/private/tmp/lobo-persistence-local.DFpfDf/recheck-pgtap.mjs`; genera copias
transaccionales sin alterar los SQL del repositorio y verifica contenido intacto.
Salida conservada en `pgtap-oct20.log` dentro del mismo directorio temporal.

## Pendientes y riesgos

- Revision del diff antes de commit/push/PR; destino futuro feature/expediente-v2.
- Migraciones y pruebas en lobo-dev/Preview requieren aprobacion separada. Sin
  tablas/RPC, la API falla visiblemente y no vuelve a escribir localStorage.
- Sin prueba de carga: se pagina el servidor, pero el navegador recibe todo el
  historial. Evaluar paginacion de presentacion para volumen mayor.
- Idempotencia entre recargas/dispositivos no implementada; ante respuesta perdida
  consultar antes de repetir. No anunciar que un error significa que no se guardo.
- Avisos heredados: braces (5 paquetes dev high), Mercado Pago/uuid (2 runtime
  moderate), segun el ultimo reporte versionado, no una auditoria nueva.
  Siguen sin resolver; aceptacion del propietario solo para desarrollo.
- Los dos errores globales de lint de WhatsApp siguen intactos.
- Auth permanece bloqueado en produccion; ninguna prueba local autoriza publicarla.

## Inventario del diff

39 archivos de la entrega de persistencia, conservados en el commit local
`609e97f316004a5bf734be9eb68d65ad3f2e12df` antes de la proteccion comercial adicional.
La revision de rutas y patrones de secretos no detecto archivos privados ni
credenciales incrustadas; no equivale a una auditoria externa de seguridad.
.env.local y .mp-sandbox/ siguen ignorados y sin seguimiento, sin leer su contenido.

```text
README.md
app/api/mi-expediente/dogs/[id]/route.ts
app/api/mi-expediente/dogs/[id]/weights/route.ts
app/api/mi-expediente/dogs/route.ts
app/mi-expediente/MiExpediente.tsx
app/mi-expediente/README.md
app/mi-expediente/age.ts
app/mi-expediente/components/DogForm.tsx
app/mi-expediente/components/FeedingPlan.tsx
app/mi-expediente/components/PackList.tsx
app/mi-expediente/components/Topbar.tsx
app/mi-expediente/components/WeightForm.tsx
app/mi-expediente/components/WeightHistory.tsx
app/mi-expediente/data.ts
app/mi-expediente/expediente.module.css
app/mi-expediente/legacyTypes.ts
app/mi-expediente/localStorageRepository.ts
app/mi-expediente/page.tsx
app/mi-expediente/remoteRepository.ts
app/mi-expediente/repository.ts
app/mi-expediente/tests/age.test.mjs
app/mi-expediente/tests/persistence.test.mjs
app/mi-expediente/tests/repository.test.mjs
app/mi-expediente/types.ts
app/mi-expediente/usePack.ts
docs/DECISIONS.md
docs/PROJECT_STATUS.md
docs/sprint2a-persistence.md
docs/sprint2a-postgres.md
lib/expediente/model.ts
lib/expediente/server.ts
proxy.ts
supabase/migrations/20261018000100_create_dog_with_initial_weight.sql
supabase/tests/expediente_create_rpc.test.sql
tests/auth/auth.spec.ts
tests/auth/fake-supabase.mjs
tests/auth/persistence.spec.ts
tests/persistence-local/persistence.spec.ts
tests/persistence-local/playwright.config.ts
```

Vista de revision local aislada: http://127.0.0.1:3102/login. Usa cuentas ficticias;
se autoconfirman localmente y no se envian correos reales. El servidor preexistente
3101 no fue detenido ni reconfigurado. La copia y los contenedores locales quedan
activos para revision; cerrar esos recursos al terminar, sin tocar otros proyectos.

## Aislamiento comercial autorizado (21 de octubre de 2026)

Alcance adicional aprobado por el propietario para publicar un Preview seguro:

- Unica API de creacion encontrada: `POST /api/checkout`. Ahora exige
  `VERCEL_ENV=production` antes de interpretar el cuerpo o instanciar el SDK.
  Preview, development, valores desconocidos y variable ausente responden 403,
  `Cache-Control: no-store`, aun si existe un token. `NODE_ENV=production` no basta.
- `Plans` decide en servidor si habilita pagos. Fuera de Production no pasa los
  tres enlaces productivos a `PlanCard`; sus cinco botones quedan deshabilitados
  y el manejador tambien rechaza la accion. No se cambiaron precios, planes,
  destinos productivos, contrato del SDK, calculadora, WhatsApp ni dependencias.
- La pagina comercial se genera al compilar: el entorno de build y despliegue
  debe coincidir. No promover un build Preview a Production; reconstruir en su
  entorno. No se publico ni autorizo Production.
- Vercel: `MERCADO_PAGO_ACCESS_TOKEN` paso de Production + Preview a solo
  Production. Se edito unicamente el selector de entornos, sin leer, copiar,
  escribir ni rotar el valor. No se pulsaron acciones de redeploy anteriores.
  Afecta todos los Previews futuros del proyecto; los anteriores conservan sus
  snapshots y pueden retener el token. No quedan declarados saneados.
- Vercel Authentication sigue activo con Standard Protection, sin excepciones
  de dominios ni secreto de bypass de automatizacion configurado.
- Se verifico que la URL y clave publicable de Auth de la rama integrada
  corresponden a `lobo-dev`. No se utilizo service role. En ese proyecto se agrego
  solo el callback exacto de la futura rama, conservando Site URL y los tres
  callbacks anteriores, sin comodines ni cambios SQL.
- Vercel rechazo las cuatro variables de la nueva rama mientras no existia en
  GitHub. El propietario aprobo explicitamente este orden: primer push protegido
  con Auth y pagos deshabilitados; despues configurar solo esa rama con lobo-dev
  y generar otro Preview. Las pruebas reales de Auth de ese Preview quedan
  pendientes hasta ejecutarlas; no se sustituyen por las pruebas simuladas.

Validacion ejecutada en copia temporal sin `.env*`, `.mp-sandbox` ni secretos,
con entorno de proceso limpio y sin token de Mercado Pago:

| Verificacion | Resultado |
|---|---|
| `npm test` | 63/63, incluido contrato Production del SDK con transporte simulado y 24 combinaciones denegadas fuera de Production |
| TypeScript sin incremental | PASS |
| ESLint de los cinco archivos de codigo/pruebas afectados | PASS |
| Playwright con servidor dev y proveedor simulado | 23/23 |
| Build optimizado `VERCEL_ENV=preview` sin credenciales | PASS, 28 paginas |
| Playwright sobre ese build, Auth simulado | 23/23 |
| Build local `VERCEL_ENV=production` sin credenciales | PASS, 28 paginas; no es deploy |
| Smoke local Production, navegador con todas las llamadas externas y checkout interceptados | Cinco botones habilitados; tres destinos y dos planId originales; cero pagos reales |
| `git diff --check` | PASS antes del commit adicional |

El primer intento de Playwright obtuvo 22/23 por un selector exacto que no
incluia el simbolo del desplegable de compra unica. Se corrigio solo el selector;
las dos suites completas posteriores aprobaron. La prueba adicional de UI
Production se ejecuto desde un script temporal fuera de Git; los casos permanentes
del SDK y denegacion quedan en `tests/security/checkout.test.mjs`.

Las 221 pruebas SQL y cuatro pruebas con Supabase local reportadas arriba son
evidencia anterior de la persistencia: no se volvieron a ejecutar para este cambio
comercial, que no modifica SQL ni permisos. Siguen pendientes las migraciones
remotas. Los avisos de dependencias y dos errores globales de ESLint preexistentes
continuan abiertos; esta validacion dirigida no afirma resolverlos.

Referencias: [ambitos de variables Vercel](https://vercel.com/docs/environment-variables)
y [VERCEL_ENV](https://vercel.com/docs/environment-variables/system-environment-variables).

