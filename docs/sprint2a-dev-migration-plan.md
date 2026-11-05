# Sprint 2A: migraciones y validacion en lobo-dev

Fecha de registro inicial: 22 de octubre de 2026. Actualizado el 5 de noviembre:
las dos migraciones, las pruebas autenticadas autorizadas y la limpieza acotada
estan completadas exclusivamente en lobo-dev y su Preview. Cierre formal y
revision/integracion del PR pendientes de decision del propietario.
Rama: `feature/sprint2a-persistence`; commit de la aplicacion web:
`aedd22a3dd3ddbfe1652bc8e3429a6f749266f20`. PR #6 hacia `feature/expediente-v2`.
Sin autorizacion para nuevas migraciones, merge o Production en esta tarea.

## Aplicacion autorizada y reporte local, 4 de noviembre de 2026

El propietario ejecuto el comando preparado en su Terminal con prompt privado.
Codex inspecciono posteriormente `migration-result.json` del directorio privado
de operacion: `ok: true`, `phase: finished`, `remoteApplyAttempted: true`.
No se repitio la aplicacion durante esta inspeccion.

| Verificacion registrada | Resultado |
| --- | --- |
| Destino | lobo-dev, ref zzbdoxeyvztnnbhwcbvd; excluye Production |
| Preflight remoto | PASS: transaccion READ ONLY explicita; inventario esperado y ausencia de conflictos |
| Dry-run | PASS: exactamente las dos migraciones aprobadas, sin semillas ni roles adicionales |
| Aplicacion CLI | PASS; versiones 20261017000100 y 20261018000100 registradas |
| Postcheck | PASS: 4 tablas con RLS, 16 politicas, 19 restricciones, 10 indices y 2 triggers nuevos |
| RPC | PASS: SECURITY INVOKER, search_path seguro y permisos restringidos |
| Auth preexistente | PASS: misma cuenta y misma identidad, comparadas antes/despues sin publicar sus IDs |
| Datos ficticios creados por el ejecutor | 0 cuentas y 0 registros |
| Pruebas con sesiones normales | No incluidas en el ejecutor; comprobadas despues mediante interfaz y verificador autenticado, con alcance descrito abajo |

El intento anterior se habia detenido en preflight/read_only_required, sin
aplicacion. Se corrigio exclusivamente el procedimiento local: BEGIN READ ONLY
explicito, misma conexion/transaccion para comprobacion e inventario, ROLLBACK
confirmado antes de usar la CLI. Validacion local de esa correccion: 32/32 pruebas
unitarias y 32/32 comprobaciones de integracion ficticias; SQL aprobado intacto.

El respaldo previo `lobo-dev-0147729f-a146-4c14-a6b7-044ce1bb2261.verified`
ya tiene integridad y cobertura PASS. Se conservan `restoration: not_tested` y
`originalAclEquivalence: not_provable_from_count_only_inventory`. No se creo otra
exportacion ni se restauro ningun dato. Los apartados historicos de octubre
que indican respaldo o migraciones pendientes quedan sustituidos por este estado.

La precision directa de la API y la edad historica se validaron posteriormente,
con atribucion y alcance separados abajo. La limpieza de diez filas tambien
termino; la ventana controlada puede cerrarse. No se usaron privilegios
administrativos ni suites que presuponen una base vacia en las pruebas
con usuarios. Esta conciliacion documental no genero solicitudes remotas.

### Pruebas autenticadas del Preview — cuentas A y B

El propietario confirmo que la sesion de Chrome pertenece a una cuenta de
prueba autorizada. Codex opero el Preview de feature/sprint2a-persistence mediante
su interfaz y consulto GET /api/mi-expediente/dogs con esa misma sesion normal.
No se usaron credenciales administrativas ni consultas SQL para estas pruebas.

| Comprobacion | Resultado observado |
| --- | --- |
| Alta con 12.4 kg y objetivo vacio | PASS: un perfil ficticio, un peso inicial 12.4 y targetWeight null en la API; la interfaz indica No definido |
| Edicion del perfil | PASS: cambio de raza ficticia; birthDate null, ageMonthsEstimate 38 y ageEstimatedAt 2026-11-04 sin cambios |
| Nueva medicion | PASS: se agrego 12.1; la API conserva los dos IDs y valores 12.4 y 12.1 |
| 12.46 al crear perfil | PASS solo de interfaz: validacion nativa rechazo el envio; la API siguio mostrando un perfil, sin alta parcial |
| 12.46 al agregar peso | PASS solo de interfaz: validacion nativa rechazo el envio; la API mantuvo exactamente las dos mediciones |
| Logout | PASS: regreso a login, navegacion directa a /mi-expediente redirigio a login y la API respondio que la sesion termino |
| Nuevo login A | PASS: propietario completo el login y Codex observo nuevamente el perfil y los dos pesos |
| Otra sesion independiente | PASS manual reportado por el propietario; Codex observo ademas la ventana Chrome identificada como Incognito, con el mismo perfil, pesos 12.4/12.1 y objetivo No definido |
| Precision por peticion directa a API | PASS posterior: propietario ejecuto el script revisado con A; ambos POST con 12.46 devolvieron 400 y GET antes/despues fue identico. Codex no eludio la advertencia de Chrome |
| Operaciones propias de B | PASS: alta con 8.2 kg, edicion de raza y nueva medicion 8.3; ambos pesos conservados, objetivo y edad desconocida null en GET de la API |
| Lectura cruzada por la API del Preview | PASS observado: B no obtuvo el perro A y A en Incognito no obtuvo el perro B; ambas respuestas indicaron que el expediente no esta disponible. No se capturo independientemente el codigo HTTP |
| Escrituras cruzadas, RLS directo y atomicidad RPC | PASS en el verificador posterior: 72/72 comprobaciones, detalladas en la seccion siguiente |

La primera edicion comprobo la fecha solo dentro del mismo dia. El 5 de noviembre
se realizo la comprobacion adicional con fecha original 2026-11-04: PASS,
registrado por separado abajo; no se sustituye la evidencia inicial.

Estas pruebas crearon dos perros ficticios y cuatro pesos. El verificador
posterior agrego cuatro metadatos. Los diez IDs historicos permanecen en el
registro privado y todos fueron eliminados por la limpieza autorizada del
5 de noviembre; no se deben reutilizar como fixtures presentes.

Se prepararon auxiliares privados fuera de Git, sin nuevas dependencias ni cambios
de aplicacion. El script acotado de precision del Preview paso 9/9 pruebas con
fetch ficticio, antes de su ejecucion real posterior por el propietario.
El verificador PostgREST/RPC
paso 12/12 pruebas locales de controles: destino, clave publicable, rol
authenticated, usuarios distintos, propietario esperado, escrituras filtradas y
ocultacion de diagnosticos. Estos resultados NO son pruebas remotas de RLS.

### Resultado remoto del verificador autenticado — 4 de noviembre de 2026

El propietario ejecuto `authenticated-rls-check.py --approved-user-tests` en su
Terminal, introduciendo las credenciales de las cuentas A/B en prompts ocultos.
Codex reviso el reporte local `authenticated-rls-result.json`: `ok: true`,
**72 comprobaciones, 72 PASS, 0 FAIL**. Es una ejecucion automatizada iniciada
por el propietario; no se repitio al revisar su resultado. No fue una suite SQL
ni una prueba de las rutas POST del Preview: uso PostgREST/RPC de lobo-dev con
dos sesiones normales, usuarios distintos y propiedad de los fixtures validada.

| Categoria | Evidencia del reporte |
| --- | --- |
| Propiedad y datos propios | PASS: ambos usuarios leen su perfil/historial; A conserva objetivo SQL NULL, pesos 12.4/12.1 y referencia de edad original |
| Atomicidad | PASS: peso inicial 0 rechazo la RPC con HTTP 400/23514; nombre ficticio ausente antes y despues; no persistio perro parcial |
| Metadatos propios | PASS: INSERT de un registro veterinario y un adjunto por usuario, HTTP 201; event_date desconocida permanece NULL |
| SELECT/UPDATE/DELETE ajenos | PASS en las cuatro tablas y ambas direcciones: HTTP 200 con lista vacia, sin filas leidas, actualizadas ni borradas |
| INSERT ajeno | PASS: ocho intentos rechazados con HTTP 403/42501 |
| Cambios de propietario y uploaded_by | PASS: rechazados con HTTP 403/42501 |
| Asociacion de adjunto con registro de otro perro | PASS: FK compuesta rechazo con HTTP 409/23503 en ambas direcciones |
| Integridad tras intentos cruzados | PASS: perfiles, historiales y cuatro metadatos iguales a sus respectivos estados previos |
| Cierre de sesiones del verificador | PASS para A y B con scope=local; no se solicito cierre global |

No se crearon cuentas, no se alteraron credenciales ni configuracion de Auth,
no se subieron archivos Storage y no se usaron SQL, admin o service_role. La
cuenta Auth preexistente estaba preservada en el postcheck de migracion; este
verificador no tiene capacidad de administrarla y no recontabilizo auth.users.

Al concluir ese verificador habia **10 filas ficticias**: 2 perros, 4 pesos,
2 health_records y 2 attachments (solo metadatos). La limpieza posterior elimino
exactamente esos diez IDs, inventariados fuera de Git; se conserva ese historial.
El marcador de ejecucion sigue presente: no repetir el comando.

Evidencia privada en `/private/tmp/lobo-sprint2a-apply-y988lmk8/`:
`authenticated-rls-result.json`, `authenticated-test-progress.json` y
`authenticated-rls-fictitious-tests.json`. SHA-256 del reporte remoto revisado:
`4ef52e95d12c1daf774c223f7bf40ec23c02e978bb02b581b1172d65ce31e087`.
Los archivos temporales pueden desaparecer; este resumen conserva el alcance
y los resultados sin correos, tokens, claves ni contrasenas.

**Limites de esos 72 controles:** no prueban las rutas POST del Preview ni
UPDATE/DELETE propios de metadatos. La precision de la API, la edad historica y
DELETE propio de las cuatro tablas tienen evidencia posterior separada. UPDATE
propio de metadatos no se probo remotamente; no hay interfaz veterinaria en esta
entrega. Restauracion no probada y equivalencia exacta de permisos sobre
parametros no demostrable con el inventario. Ningun PASS autoriza merge o Production.

## Validacion final del Preview y limpieza, 5 de noviembre de 2026

### Precision: dos POST de Next.js, ejecutados por el propietario

Despues de revisar el script completo, el propietario lo ejecuto personalmente
con la cuenta A en el Preview autorizado. Codex no desactivo ni eludio la
advertencia de Chrome ni ejecuto ese codigo por otra via. El primer intento
`fixture_not_accessible` (HTTP 200, checks vacios) se detuvo antes de los POST;
la sesion A y el fixture original se confirmaron antes del intento satisfactorio.
No se sustituyo el ID por otro perro ni se debilito la comprobacion.

Resultado completo revisado en la captura privada del propietario:

| Control | Resultado |
| --- | --- |
| create_12_46 | PASS, HTTP 400 en la ruta Next.js de creacion |
| weight_12_46 | PASS, HTTP 400 en la ruta Next.js de nueva medicion |
| no_partial_profile_or_extra_measurement | PASS, GET antes/despues identico |
| Resultado global | ok: true; sin nuevos registros ni cambios en los existentes |

Captura de evidencia: `libfile_a6c272cef40481919e5afd4e027c13b6`, referenciada
en el registro privado. Es ejecucion manual del propietario revisada por Codex,
no una nueva ejecucion de Codex ni una llamada directa a PostgREST.

### Edad historica: edicion normal y comparacion posterior

Codex realizo un unico guardado en la interfaz normal del Preview con A el
5 de noviembre (America/Mexico_City), sobre el mismo perro ficticio inventariado.
Cambio exclusivamente raza. GET autenticado posterior confirmo:

- `ageMonthsEstimate = 38` y `ageEstimatedAt = 2026-11-04` exactos antes/despues.
- Objetivo NULL, nombre, sexo y nacimiento sin cambios.
- Los dos pesos 12.4/12.1 conservan sus IDs, valores y fechas; historial identico.

La fecha ya era anterior al dia de edicion. La preparacion previamente aprobada
para pasarla al 3 de noviembre **no se ejecuto**; no se cambio el reloj.
Esta observacion directa de Codex es independiente de la prueba de precision
ejecutada por el propietario.

### Auxiliar local y limpieza limitada

El control local de limpieza se ajusto a la evidencia real de 38 meses y
2026-11-04; no se altero ningun dato remoto para satisfacerlo. Resultado anterior
a la limpieza: **21/21 pruebas ficticias PASS, 0 FAIL, 0 omitidas**. Incluyen
los 15 controles existentes y seis casos negativos: precision pendiente,
fecha anterior del plan, otra fecha no verificada, borrado sin filtro,
marcador de repeticion y propietario incorrecto. Sin red, credenciales ni
sesiones reales. No se reejecutaron en esta revision documental.

El propietario ejecuto personalmente `qa-finish.py --cleanup` con las sesiones
normales A/B. Codex reviso el reporte local exitoso y cotejo cada ID contra el
inventario original, sin repetir solicitudes. El ejecutor valido ambos
inventarios y dependencias antes del primer DELETE, borro por ID en orden
y comprobo ausencia despues de cada borrado y al finalizar.

| Tabla | Filas inventariadas | Borradas y ausencia verificada |
| --- | ---: | ---: |
| attachments (solo metadatos) | 2 | 2 |
| health_records | 2 | 2 |
| weight_entries | 4 | 4 |
| dogs | 2 | 2 |
| Total | 10 | **10** |

`cleanup-result.json`: `ok: true`, `verifiedDeletedRows: 10`,
`accountsCreatedOrDeleted: 0`, `checkerSessionClosedA/B: true`.
SHA-256 del reporte revisado:
`dcc6574566dad565cf1ebfd42ef2317168e82a94827ea1a07ff8aa8ac3b95264`.

No quedan filas de esos diez fixtures segun las comprobaciones del ejecutor;
no se afirma que toda la base este vacia. Las cuentas Auth A/B se conservan.
La cuenta Auth preexistente fue comprobada en el postcheck de migracion;
la limpieza no tiene capacidad administrativa ni vuelve a contar auth.users.
No se borraron datos previos, cuentas, archivos Storage ni filas por filtros
generales. No hubo cascadas, TRUNCATE, reset o cambios de esquema.

El propietario reporto despues un segundo intento bloqueado con
`local_preflight / previous_write_attempt_requires_review`. La inspeccion
local del auxiliar confirma que el marcador se comprueba antes de crear clientes
o pedir credenciales; el reporte exitoso no se sobrescribe. Ese bloqueo esperado
no invalida el PASS de la primera limpieza. Se conservan intactos marcador,
reporte, verificador y sus pruebas; no se retiro la proteccion para reintentar.

### Estado para revision del PR #6

**La ventana de pruebas controladas puede cerrarse.** El alcance remoto solicitado
tiene evidencia PASS y la limpieza esta completada. Esta actualizacion es
documental: no reejecuta pruebas, no abre sesiones ni consulta servicios.

Queda pendiente revisar el diff local y decidir su publicacion y el cierre formal.
PR #6 tiene como destino `feature/expediente-v2`; su ultimo estado conocido es
Draft, no reconfirmado mediante GitHub en esta revision. HEAD local sigue en
`aedd22a3dd3ddbfe1652bc8e3429a6f749266f20`. La prueba ya existente y no versionada
`app/mi-expediente/tests/routes.test.mjs` permanece intacta; debe revisarse
separadamente antes de incluirla en cualquier commit. No se realizaron
commit, push, merge ni despliegues.

Los reportes privados originales se preservan y el registro de progreso conserva
los estados anteriores con su procedencia. La evidencia aqui registrada no
autoriza nuevas exportaciones, pruebas remotas o limpieza adicional.

## Evidencia manual de Auth

El propietario reporto satisfactoriamente registro, confirmacion de correo,
login, logout y recuperacion en el Preview de Sprint 2A. Los cinco flujos se
registran como **PASS manual reportado por el propietario**, no como ejecuciones
automatizadas ni observaciones independientes de Codex. La fecha indicada es
la del reporte; no se presume una hora exacta de ejecucion.

Preview de referencia:
https://lobo-web-git-feature-sprint2a-persistence-neto995-s-projects.vercel.app

Esa evidencia manual inicial de Auth no validaba persistencia remota, migraciones,
RLS entre usuarios ni ausencia de datos previos. Las pruebas posteriores de
aplicacion del 4 y 5 de noviembre se registran por separado en las secciones anteriores.
Las 221 SQL y cuatro integraciones reales documentadas previamente son locales,
no resultados de lobo-dev.

<details>
<summary>Historial de reconocimiento y respaldo de octubre — no ejecutar sus instrucciones</summary>

Estos apartados conservan los estados y propuestas de su fecha. El respaldo
real ya esta verificado y las dos migraciones aplicadas. Sus pendientes y comandos
quedan archivados; no representan tareas actuales ni autorizacion para repetirlos.

## Estado de reconocimiento remoto (historico del 22 de octubre)

| Comprobacion | Estado observado el 22 de octubre |
| --- | --- |
| Git local | Rama correcta y limpia antes de esta actualizacion documental; commit aedd22a. |
| SQL local frente a GitHub | Ambas migraciones coinciden por Git blob SHA con GitHub en el commit indicado. |
| Proyecto confirmado | Panel de lobo-dev, ref `zzbdoxeyvztnnbhwcbvd`, organizacion LOBO Free; PostgreSQL 17.11. Es el proyecto de desarrollo previamente identificado. |
| Historial remoto de migraciones | Panel sin migraciones; to_regclass('supabase_migrations.schema_migrations') devuelve NULL: tabla de historial ausente. |
| Objetos objetivo | Cero relaciones public (tablas/vistas/materializadas/foraneas/secuencias), cero politicas public, cero triggers de usuario public y ninguna de las dos funciones objetivo. |
| Datos existentes | Una cuenta en auth.users; cero buckets y objetos Storage. Solo conteos, sin consultar identidades ni contenido. |
| Preview | 5RSDfa2TDgZqKRqRQpv2sEYMN79e Ready, aedd22a, Preview de feature/sprint2a-persistence. Cuatro variables Auth exclusivas de esa rama, agregadas el 21 de octubre. |
| Destino Supabase de Preview | Reconfirmado tras la verificacion de identidad del propietario: URL de lobo-dev y clave publicable exactamente igual a la del panel de ese proyecto. No se imprimio ni guardo la clave. |
| Configuracion Auth | AUTH_V1_ENABLED=true; APP_URL corresponde exactamente al alias feature/sprint2a-persistence. Las cuatro variables son exclusivas de esa rama Preview; no hay variables Shared vinculadas. |
| Mercado Pago | Variable secreta restringida a Production; no se leyo ni modifico su valor. |
| Backups del proyecto | Panel confirma que Free no incluye project backups. No hay un respaldo recuperable verificado para esta operacion. |

El intento inicial de `supabase projects list` fallo por falta de autenticacion.
Tras reconectar Chrome se consultaron paneles y se ejecuto una unica consulta
agregada en el editor SQL: BEGIN READ ONLY, SELECT y ROLLBACK. Resultado con
transaction_read_only=on, una fila, sin error SQL. No se guardo el snippet ni
se enlazo el worktree; no se obtuvo una clave administrativa ni se cambiaron
ajustes. No hay conector Supabase/Vercel disponible en esta sesion.

**Pendientes antes de ejecutar:** preparar/verificar un respaldo privado y obtener
autorizacion explicita para aplicar las dos migraciones de desarrollo. La CLI
sigue sin sesion: el mecanismo exacto de aplicacion e historial debe acordarse
antes de autorizarlo. Ambas migraciones faltan en el estado actual consultado.

Vercel se reviso sin guardar cambios ni volver a desplegar. La clave se comparo
solo en memoria entre los valores visibles de ambos paneles y se volvio a ocultar.
No se consultaron secretos productivos. Evidencia visual sin claves:
`/private/tmp/lobo-preview-config-verified-20261022.png`.
La comprobacion corresponde a la configuracion vigente de la rama y al Preview
Ready identificado; no se extrajeron secretos del entorno interno de ejecucion.

Resultado agregado conservado, sin datos personales:

```json
{"read_only":"on","history_table":null,"public_policies":0,"auth_users_count":1,"postgres_version":"17.11","public_relations":[],"target_functions":[],"public_user_triggers":0,"storage_buckets_count":0,"storage_objects_count":0}
```

Evidencia visual temporal: `/private/tmp/lobo-dev-readonly-inventory-20261022.png`.
El resultado anterior conserva la evidencia textual aunque desaparezca la imagen.
El panel Supabase mostraba un aviso general de incidencia tecnica; esta consulta
si termino sin error. Comprobar salud del servicio antes de cualquier aplicacion.

## Preparacion de respaldo privado: sin exportacion real

Estado historico: preparacion local completada el 24 de octubre, segun la seccion
"Flujo PostgreSQL ficticio completo". Los bloqueos iniciales y sus resoluciones
se conservan abajo como historial. Falta autorizacion separada para exportar.

Verificacion del 22 de octubre: se reconfirmaron nombre lobo-dev, organizacion
LOBO Free y ref `zzbdoxeyvztnnbhwcbvd` en Database > Backups. El panel indica
explicitamente que Free no incluye project backups. No hay una copia descargable
ni recuperabilidad verificadas; no se activo Pro, PITR ni ningun servicio de pago.
El inventario READ ONLY anterior identifica una cuenta Auth que debe preservarse.

No se exportaron datos, hashes de contrasenas, tokens ni claves. No se ejecuto
restauracion, ni siquiera local. Estado: **respaldo no creado / integridad no
verificada / restauracion no probada**. Esto bloquea aplicar las migraciones.

### Requisitos que faltan

- El propietario restablecio personalmente la contrasena solo de lobo-dev y
  confirmo posteriormente conexion PASS. Introducir la nueva contrasena
  exclusivamente en el prompt oculto de psql en una terminal bajo su control:
  nunca chat, archivos, variables de entorno, argumentos de proceso ni reportes.
  La clave publicable de Auth no sustituye esa credencial. No resetear la
  contrasena ni crear roles de acceso. TLS ya fue validado con la CA oficial.
- Un destino privado fuera del repositorio y de carpetas sincronizadas, y un
  mecanismo de cifrado autenticado con recuperacion de la clave bajo control del
  propietario. age 1.3.2 ya instalado y probado con datos ficticios, segun la
  evidencia posterior. Falta confirmar la proteccion del equipo y destino real.
- Cliente psql 17.11 comprobado sin red usando la imagen Docker local
  public.ecr.aws/supabase/postgres:17.11.0.004. No hubo descarga ni instalacion.
  Sigue pendiente verificar el cliente de exportacion y sus filtros reales.

### Conexion privada: incidente TLS del 22 de octubre

En la continuacion del 22 de octubre se reconfirmo en el panel el proyecto y
Session pooler: host aws-0-us-east-1.pooler.supabase.com, puerto 5432 y usuario
postgres.zzbdoxeyvztnnbhwcbvd. La comprobacion previa se hizo SIN contrasena,
con psql -w, sslmode=verify-full y sslrootcert=system, dentro de un contenedor
efimero de solo lectura, sin volumenes ni registro de Docker y con entorno limpio.
Resultado: codigo de salida 2, `SSL error: certificate verify failed`.

No se completo autenticacion ni se ejecuto SQL remoto. No se solicito ni recibio
la contrasena. El error no demuestra por si solo una intrusion ni identifica
su causa: no esta establecida la confianza del certificado para este cliente.
No cambiar a require, prefer o disable ni aceptar certificados sin validar.
Detencion de seguridad: falta contrastar la cadena y la CA oficial del servicio,
obtenida de una fuente autenticada, manteniendo verificacion del nombre del host.

Procedimiento preparado, aun no ejecutable hasta resolver TLS:
1. Repetir la prueba sin contrasena y exigir validacion TLS satisfactoria.
2. En terminal privada, iniciar psql con -X -W, entorno limpio y sin historial,
   archivos de credenciales ni registro de Docker. El propietario introduce la
   contrasena en el prompt sin eco; no escribirla como comando de shell.
3. Ejecutar solo una consulta fija BEGIN READ ONLY / SELECT agregado / ROLLBACK,
   con timeout, sin consola SQL libre. Mostrar solo estado de solo lectura,
   version y conteos, nunca filas de Auth. Terminar el cliente y contenedor.
4. Confirmar cifrado antes de exportar: propuesta age en modo de frase secreta,
   con frase aleatoria independiente de PostgreSQL, guardada por el propietario
   en Bitwarden y con recuperacion de la boveda disponible por separado. No
   escribirla en comandos, archivos en claro ni junto al respaldo. Requiere
   autorizacion para instalar age, que todavia no esta disponible.
5. Solo despues de esa confirmacion preparar el flujo cifrado de exportacion y
   verificacion. No se ha creado un script de exportacion ni iniciado un backup.

Referencias del procedimiento:
[prompt de psql](https://www.postgresql.org/docs/17/app-psql.html),
[verificacion TLS](https://www.postgresql.org/docs/17/libpq-ssl.html),
[age oficial](https://github.com/FiloSottile/age).

### Continuacion del 23 de octubre: TLS verificado, autenticacion pendiente

El propietario proporciono la CA descargada desde Supabase en
`/Users/ernestootaqui/Downloads/prod-ca-2021.crt`. Certificado publico, no clave
privada: Supabase Root 2021 CA, CA:TRUE, validez 2021-04-28 a 2031-04-26.
Huella SHA-256:
`80:70:25:AD:50:D4:ED:21:9D:2C:9C:7D:29:9C:00:4F:82:4E:B0:0C:F7:F6:5A:FE:F6:07:D0:7B:72:E6:CA:FA`.

Repetida la prueba psql -w contra el hostname oficial del Session pooler, con
sslmode=verify-full y esta CA montada en solo lectura. Resultado esperado:
`fe_sendauth: no password supplied`, salida 2. La validacion de cadena y hostname
supero el bloqueo anterior y alcanzo autenticacion. Esto NO es un login exitoso:
no se envio contrasena ni se ejecuto la consulta.

Preparado fuera de Git `/private/tmp/lobo-dev-readonly-check.sh`, sin secretos.
Sintaxis `sh -n` aprobada. Verifica la huella CA, fija destino e imagen local,
usa psql -X -W con prompt oculto, entorno limpio dentro del contenedor, sin logs
de Docker ni core dumps, sin volumenes salvo la CA, y termina tras una consulta
fija BEGIN READ ONLY / SELECT version y conteos Auth / ROLLBACK. No abre una
consola SQL libre ni exporta filas. Los conteos resultantes quedan pendientes.

La herramienta no permitio abrir Terminal; el propietario debe ejecutar el
procedimiento personalmente. No se inicio el prompt ni se recibio la contrasena.
El respaldo sigue sin crear; no hubo instalaciones, migraciones ni cambios remotos.

### Revision del 24 de octubre: parametros coincidentes, reintento pendiente

El propietario reporto `password authentication failed for user "postgres"`.
No es un resultado de autenticacion observado independientemente por Codex.
Se reviso el script temporal completo y se comparo con Connect > Session pooler
del panel lobo-dev y la documentacion oficial:

| Parametro | Panel y script |
| --- | --- |
| Host | aws-0-us-east-1.pooler.supabase.com |
| Puerto | 5432 |
| Usuario | postgres.zzbdoxeyvztnnbhwcbvd |
| Base | postgres |

No se encontro discrepancia: el script ya incluia el usuario con project ref.
El texto del error no acredita que el cliente enviara solo postgres ni permite
atribuir la causa exclusivamente a una contrasena incorrecta. No se modificaron
parametros ni credenciales. Se verificaron sintaxis sh -n, vigencia y misma huella
de CA; se conserva verify-full. SQL fijo: BEGIN READ ONLY, SELECT de version,
estado de solo lectura y conteos de auth.users/auth.identities, ROLLBACK.
Sin DDL/DML, funciones de escritura, exportacion o cambios de configuracion remota.

Preparado un nuevo intento manual con el mismo script. Introducir la contrasena
original en Password:, sin comillas ni codificacion URL, que solo corresponde a
credenciales embebidas en una URI, no al prompt. No guardar ni compartir el secreto.
Si falla otra vez, detenerse y reportar el error antes de cualquier cambio adicional.
La autenticacion y la consulta siguen pendientes; no se hizo otro intento con
contrasena en esta revision. Referencia:
[Session pooler oficial](https://supabase.com/docs/guides/database/connecting-to-postgres#shared-pooler-session-mode).

### Conexion PASS y preparacion final, 24 de octubre

El propietario reporto PASS con la nueva contrasena: verify-full, autenticacion,
PostgreSQL 17.11, READ ONLY con ROLLBACK, una cuenta y una identidad Auth, sin
exportacion. Evidencia manual reportada; Codex no repitio esa consulta.

Comprobaciones locales realizadas en esta preparacion:
- pg_dump, pg_dumpall y pg_restore 17.11 disponibles en la imagen local fijada.
  Solo se ejecuto --version, sin red, exportaciones ni restauraciones.
- En la comprobacion inicial age no estaba instalado. Posteriormente el
  propietario autorizo Homebrew y las pruebas ficticias; resultado abajo.
- FileVault: `FileVault is Off.` No se cambiaron ajustes. Pipes y tmpfs no
  garantizan ausencia de restos en swap o memoria paginada de la VM. Exportacion
  bloqueada hasta confirmar un equipo con almacenamiento y memoria paginada
  protegidos por cifrado; no prometer impacto o persistencia fisica cero.

Procedimiento final propuesto, pendiente de autorizacion:

1. age 1.3.2 instalado con autorizacion, sin dependencias del proyecto. Confirmar
   equipo cifrado y destino privado propuesto fuera de Git y sincronizacion:
   /Users/ernestootaqui/Library/Application Support/LOBO Private Backups/lobo-dev/.
   Directorio 0700, archivos 0600; no crear ni sobrescribir hasta aprobar.
2. El propietario genera una frase aleatoria larga e independiente en Bitwarden
   y conserva acceso/recuperacion de su boveda por separado. Usar prompt oculto
   age -p; NO dejarlo vacio, pues age puede autogenerar y mostrar la frase.
   Ningun secreto en argumentos, entorno, archivos en claro ni reportes.
3. Validar primero el mecanismo con datos ficticios: cifrado/descifrado, frase
   incorrecta, datos alterados, cancelacion y fallo del productor. No usar Auth.
4. Tras aprobacion separada para exportar, reconfirmar destino, CA y verify-full;
   coordinar ventana sin pruebas Auth ni cambios de esquema/roles en los Previews
   que comparten lobo-dev. Preflight READ ONLY de inventario, permisos y conteos.
   Leer users/identities no acredita acceso a todas las tablas dependientes.
5. Dos componentes cifrados: pg_dump --format=custom de todos los esquemas no
   sistema, sin filtros ni --no-owner/--no-acl; y pg_dumpall --globals-only
   --no-role-passwords. Conservar esquema, datos Auth completos, secuencias,
   funciones, triggers, RLS, ACL/default privileges, roles y membresias; historial
   si existe. Si faltan permisos u objetos administrados necesarios, detenerse,
   sin cambiar grants, omitir silenciosamente tablas ni declarar copia completa.
6. --no-role-passwords excluye contrasenas de roles PostgreSQL, NO los hashes de
   auth.users. Hashes, identidades y tokens de Auth deben quedar dentro del
   archivo cifrado, nunca en reportes. Credenciales administrativas en Bitwarden.
7. Flujo binario por pipes directamente a age, sin SQL/dump/tar temporal. No
   reutilizar docker -it del test para los datos: un TTY puede alterar sus bytes.
   Validar antes con datos ficticios un canal separado para la contrasena: prompt
   local oculto, memoria del proceso y stdin privado del cliente sin TTY; nunca
   PGPASSWORD ni .pgpass. El cliente PostgreSQL puede leer el prompt desde stdin
   cuando no tiene /dev/tty. Separar prompts de PostgreSQL y age para evitar que
   una frase llegue al proceso equivocado. Sin trazas, logs Docker ni core dumps.
8. Comprobar todos los codigos de salida (pipefail). Escribir solo .age.partial
   cifrado y no marcarlo completo si falla un proceso. Sin reintentos automaticos
   ni fallback a disco en claro. Sanitizar errores sin publicar filas o secretos.
9. Verificar descifrado completo a un consumidor sin salida de datos, SHA-256 del
   cifrado y lectura completa del archivo con pg_restore SIN conexion a base.
   Inspeccionar en memoria inventario, permisos y datos Auth contra preflight;
   no imprimir SQL ni hashes. TOC/checksum solos no prueban cobertura completa.
   Solo despues marcar completo; manifiesto publico limitado a versiones,
   huellas, conteos y estados, con inventario sensible dentro del cifrado.
10. No restaurar. Recuperacion funcional queda sin probar y exige autorizacion
    posterior y destino nuevo desechable compatible con Supabase, extensiones y
    roles administrados. No dar por recuperables sesiones o datos cifrados con
    claves externas sin revisar sus dependencias.

El dump de base tiene su snapshot consistente; globales y conteos separados no
comparten automaticamente ese instante. No certificar consistencia conjunta sin
coordinar la ventana y verificarla. La lectura consume recursos y puede competir
con DDL; limitar esperas y detenerse ante conflicto. Configuracion SMTP, URLs,
claves externas y bytes Storage no se incluyen en el respaldo SQL.

Faltan confirmar equipo cifrado y destino, validar la integracion completa del
cliente PostgreSQL con el cifrado y aprobar la exportacion real. No existe aun script ejecutable
de exportacion ni respaldo verificado. Fuentes:
[age](https://github.com/FiloSottile/age),
[formula oficial](https://formulae.brew.sh/formula/age),
[pg_dump](https://www.postgresql.org/docs/17/app-pgdump.html),
[pg_dumpall](https://www.postgresql.org/docs/17/app-pg-dumpall.html),
[limites tmpfs](https://docs.docker.com/engine/storage/tmpfs/).

### Instalacion y pruebas age autorizadas, 24 de octubre

Homebrew instalo unicamente age 1.3.2 desde su bottle oficial; ejecutable
/opt/homebrew/bin/age, version comprobada v1.3.2. Auto-update, analytics y cleanup
deshabilitados para esta instalacion. Sin cambios en package.json/package-lock.
El listado previo sin permisos fallo por acceso al cache de Homebrew; la
instalacion autorizada y la comprobacion de version finalizaron con salida 0.

Fixture exclusivamente ficticia en /private/tmp/lobo-age-fixture.GwcVZm/:
original.txt, encrypted.age, recovered.txt, tampered.age y scripts de pruebas.
Directorio privado 0700, archivos de datos 0600. La frase de esta prueba es
deliberadamente ficticia y NO debe reutilizarse para respaldos reales. No se
consultaron Bitwarden ni Supabase ni se uso una contrasena de base de datos.

| Comprobacion | Resultado y evidencia |
| --- | --- |
| Cifrado con age -p, prompt oculto y confirmacion | PASS, salida 0 |
| Descifrado con la frase ficticia correcta | PASS, salida 0 |
| Identidad byte a byte y SHA-256 | PASS, cmp salida 0 y hashes iguales |
| Frase incorrecta | PASS: rechazo esperado, salida 1, incorrect passphrase |
| Alteracion de un byte del cifrado | PASS: rechazo esperado, salida 1, fallo de autenticacion del contenido |
| Cifrado por pipe con productor ficticio | PASS, salida 0 |
| Descifrado por pipe y comparacion sin archivo recuperado | PASS, salida 0 |
| Productor simulado termina con salida 42 | PASS: pipefail detecta 42 y no promueve failed.age.partial a copia completa |

SHA-256 coincidente de original y recovered:
`553d09a625a2305d1d3d8cf68f04f3beb7e3508fb67246d36a9d88cb92a0d37f`.
SHA-256 de encrypted.age:
`67a056a3ed7e9d68c66bc3975e1bba069bb2ad40a5ce7486d79053a95120c2a8`.

Incidencias de ejecucion resueltas: un descifrado se inicio antes de terminar el
cifrado y encontro archivo ausente; se repitio tras verificar su salida 0. El
primer pipe no pudo abrir /dev/tty bajo el sandbox; se repitio con permiso local
para el prompt, sin acceso remoto. No son fallos de integridad del cifrado final.

Limites: 8/8 comprobaciones finales de archivos ficticios; no prueban pg_dump,
snapshot consistente, canal de contrasena Docker ni recuperabilidad Supabase.
Cancelacion por senal y archivo PostgreSQL binario quedan pendientes de prueba.
El productor simulado no fue PostgreSQL. Los archivos en claro creados aqui son
solo los fixtures autorizados; el flujo real no debe crear equivalentes en disco.
En esa etapa FileVault seguia desactivado; la comprobacion posterior documentada
abajo confirma On. Codex no habilito ni modifico FileVault.

Antes del respaldo real: confirmar equipo cifrado, destino privado y permisos;
el propietario prepara en Bitwarden una frase nueva aleatoria (no la ficticia),
con acceso de recuperacion a la boveda separado del archivo. No introducir la
frase por chat, argumentos o variables. Probar apertura con esa frase sin datos
reales y autorizar por separado el preflight/exportacion de lobo-dev. No hay
respaldo real creado ni restauracion ejecutada. No se hizo commit, push o merge.

### Flujo PostgreSQL ficticio completo, 24 de octubre

Sin conexion a Supabase. PostgreSQL, pg_dump, pg_dumpall y pg_restore 17.11;
age 1.3.2. Imagen local fijada:
`sha256:b15d862126dd2dac02da524696ccfde2dcce2ceaee0a58973b2727befe492706`.
Base ficticia en tmpfs, red deshabilitada, sin puertos ni volumen de datos
persistente, sistema de archivos de contenedor de solo lectura y logs Docker
deshabilitados. Solo los scripts y SQL ficticios se montaron como lectura.
El contenedor desechable fue detenido; su ausencia se verifico despues.

| Verificacion del flujo completo | Resultado |
| --- | --- |
| Inventario cifrado: READ ONLY, version, tres tablas/conteos, RLS, funcion, permisos y membresia | 7/7 PASS |
| Archivo custom descifrado y recorrido completo con pg_restore --file=-, sin conexion: Auth ficticio, filas, funcion, RLS, grants, default privileges, secuencia, FK y propietario | 14/14 PASS |
| Globales: roles ficticios, membresia y ausencia de contrasenas de roles | 4/4 PASS |
| Contrasena PostgreSQL ficticia incorrecta, prueba adicional | PASS: rechazo esperado, salida 2; diagnostico oculto |

Total de cobertura: **25/25**, cero fallos; mas una prueba negativa aprobada.
Son distintas de las 8 pruebas anteriores de age. No hubo restauracion: el SQL
producido por pg_restore paso a un verificador en memoria, sin ejecutarse ni
escribirse en disco. No se comparo un hash de dump original en claro; la evidencia
es descifrado autenticado completo, lectura del archivo y comprobaciones de
contenido ficticio. Cancelacion por senal no probada. El verificador ficticio no
es un validador general del contenido real de Supabase.

FileVault reconfirmado: `FileVault is On.`; volumen Data: `FileVault: Yes`,
desbloqueado para la sesion, sin conversion en curso reportada. No se cambiaron
ajustes. La primera consulta diskutil bajo sandbox fallo por permisos del
framework; repetida con acceso local de lectura, salida 0. Esto protege datos
en reposo, no contra procesos privilegiados o un equipo desbloqueado comprometido;
no certifica ausencia fisica de restos de memoria o paginacion.

Carpeta creada fuera de Git:
`~/Library/Application Support/LOBO Private Backups/lobo-dev/`.
Directorios 0700; tres archivos ficticios cifrados en `fixture-EwENW3Gg/`, 0600.
Sin ancestro .git ni enlaces simbolicos en los destinos verificados. No se ha
auditado software de sincronizacion/backup de terceros instalado en el equipo.

SHA-256 verificados de los archivos ficticios cifrados:
- dump.unverified.age: `890ac2c5e4c7b52bacf5678815d7d68121f16988d13c19c94a8323d3c39aaba1`
- globals.unverified.age: `86f23ea62e08f3c300aa66f10b96879a68be653feb0d6e710a71bacc27de69fc`
- inventory.unverified.age: `e18dc2834f46196759c45163c91459362c78b7af88cb8e42f3773bffbfbf4aca`

Scripts privados conservados en `lobo-dev/tools/backup.sh` y `client.cjs`, 0700,
sin secretos; sintaxis Bash y Node PASS. La exportacion utiliza tres componentes:
inventario, dump custom y globales, todos cifrados. Password se solicita oculto
en la terminal, se transmite por stdin, sin argumentos/variables de entorno ni
archivo .pgpass. age solicita su frase por separado. El script deshabilita trazas
y core dumps, sanitiza diagnosticos y usa pipefail; solo escribe cifrado, dejando
archivos .partial ante fallo y .unverified.age al terminar. No marca una copia
como verificada automaticamente. No guarda contrasenas ni dumps en claro de
forma deliberada; los valores existen transitoriamente en memoria. Los archivos
SQL en claro de esta prueba contienen exclusivamente datos ficticios autorizados.

**Comando preparado, NO ejecutado contra lobo-dev; requiere autorizacion nueva:**

```sh
/bin/bash "$HOME/Library/Application Support/LOBO Private Backups/lobo-dev/tools/backup.sh" lobo-dev --approved-export
```

Antes: reconfirmar proyecto/ref, host Session Pooler, usuario completo, base,
CA y verify-full; FileVault, carpeta/permisos y ausencia de sincronizacion no
deseada. Acordar ventana sin pruebas Auth ni cambios de esquema/roles en todos
los Previews que comparten lobo-dev. El propietario prepara una frase aleatoria
nueva en Bitwarden, independiente de PostgreSQL, y conserva recuperacion de su
boveda separada. Nunca dejar vacio el prompt de age: generaria y mostraria una
frase. Nunca reutilizar las frases ficticias. Confirmar lectura de todas las
tablas necesarias, no solo users/identities. No cambiar permisos si falla.

Despues: exigir salida correcta de todos los procesos y ausencia de diagnosticos;
descifrar cada componente por pipe, recorrer completamente el custom sin conexion
y comparar inventario, esquema, funciones, RLS, ACL/default privileges, roles y
conteos Auth sin imprimir datos. El ultimo conteo manual fue una cuenta y una
identidad: volver a medir, no fijarlo como supuesto. Revisar dependencias y objetos
administrados, cifrado completo, SHA-256 y 0600. Cualquier omission/permisos o
inconsistencia bloquea la declaracion de respaldo completo; no omitir tablas.
Los snapshots de los tres componentes no son comunes: verificar la ventana.
La exportacion incluye hashes y datos Auth en el cifrado, pero excluye passwords
de roles mediante --no-role-passwords. No incluye configuracion externa de Auth,
SMTP, claves externas ni bytes Storage. Recuperacion funcional sigue sin probar
y necesitara autorizacion separada sobre un destino nuevo desechable compatible.

No se accedio a Bitwarden ni se exportaron datos reales. Sin migraciones,
restauraciones, cambios en Production, commit, push ni merge.

### Cobertura exigida y procedimiento propuesto, no ejecutado sobre Supabase

1. Reconfirmar destino y salud del servicio. Consultar solo metadatos para conocer
   todos los esquemas, tablas Auth, extensiones, roles/grants y personalizaciones.
   No dar por suficiente un CSV de usuarios ni un dump limitado a public.
2. Preparar exportacion logica consistente de esquema y datos, con cuentas,
   identidades y tablas dependientes de Auth; incluir permisos, membresias de
   roles, propietarios, RLS, funciones, triggers, secuencias e historial si existe.
   Revisar expresamente omisiones de la CLI en esquemas administrados. Si una
   tabla Auth necesaria no puede leerse o recuperarse, detenerse, no excluirla.
3. Mantener el dump y sus metadatos sensibles cifrados desde la escritura, sin
   archivos intermedios en claro, permisos privados y sin salida de filas a logs.
   Guardar la clave de recuperacion separadamente bajo custodia del propietario.
   Coordinar una ventana sin cambios de pruebas: varios dumps separados no
   garantizan por si solos un unico instante consistente.
4. Verificar codigo de salida, cifrado/descifrado completo, checksum SHA-256 del
   archivo cifrado, inventario interno y cobertura/conteos contra el snapshot.
   Registrar solo fecha, versiones, alcance, huella y resultados sin datos privados.
   Un checksum acredita integridad del archivo, no suficiencia ni restaurabilidad.
5. Recuperacion futura, con autorizacion separada: usar exclusivamente un destino
   nuevo y desechable compatible, preparar roles y esquemas administrados, recuperar
   esquema/datos/dependencias/grants segun el manifiesto, y verificar Auth e
   integridad. No ejecutar ahora. No prometer que sesiones existentes sobrevivan
   un cambio de proyecto o claves de firma. No restaurar sobre lobo-dev activo.

Limites: un respaldo SQL no incluye por si mismo configuracion externa de Auth,
SMTP/Resend, redirecciones, claves de firma, secretos Vercel ni archivos de Storage.
Estos ultimos estaban ausentes en el inventario; reconfirmarlo antes de exportar.
Las contrasenas de roles PostgreSQL no equivalen a los hashes de cuentas Auth.
Roles administrados y datos cifrados con claves externas requieren un destino y
un procedimiento compatibles; no copiar claves raiz ni omitir permisos a ciegas.

Un dump de lectura no altera filas, pero consume recursos y adquiere bloqueos de
lectura que pueden interferir con DDL concurrente. Presentar esa ventana e impacto
antes de ejecutarlo; no prometer impacto operativo cero. No se genero trafico de
exportacion ni se contrataron servicios en esta tarea. La restauracion completa
de Auth afectaria tambien a otros Previews conectados a lobo-dev.

Referencias oficiales revisadas:
[backup/restore Supabase](https://supabase.com/docs/guides/platform/migrating-within-supabase/backup-restore),
[CLI dump](https://supabase.com/docs/reference/cli/supabase-db-dump),
[pg_dump PostgreSQL 17](https://www.postgresql.org/docs/17/app-pgdump.html).
La cobertura indicada es un criterio de aceptacion pendiente, no evidencia de
una copia existente. No hay autorizacion para aplicar SQL remoto de escritura.

</details>

## Inventario cotejado con GitHub

| Orden | Migracion | Contenido | Git blob SHA | Estado remoto |
| --- | --- | --- | --- | --- |
| 1 | `20261017000100_expediente_schema_rls.sql` | dogs, weight_entries, health_records y attachments; PK/FK/CHECK; cuatro indices explicitos; funcion de updated_at y dos triggers; RLS y 16 politicas CRUD. | `1008de71b44da8491c1adb071012480e42d588e5` | Aplicada y registrada en lobo-dev; postcheck PASS |
| 2 | `20261018000100_create_dog_with_initial_weight.sql` | RPC atomica para perro y peso inicial; auth.uid(), SECURITY INVOKER, search_path vacio y EXECUTE solo authenticated entre roles API. | `ac44b128aa96127c91a1b48beca88484ebd2a2f8` | Aplicada y registrada en lobo-dev; postcheck PASS |

Fuentes exactas:
[esquema](https://github.com/neto995/lobo_web/blob/aedd22a3dd3ddbfe1652bc8e3429a6f749266f20/supabase/migrations/20261017000100_expediente_schema_rls.sql),
[RPC](https://github.com/neto995/lobo_web/blob/aedd22a3dd3ddbfe1652bc8e3429a6f749266f20/supabase/migrations/20261018000100_create_dog_with_initial_weight.sql).

La primera migracion es indivisible en este plan: incluye las tablas veterinarias
y metadata de adjuntos ya aprobadas. No habilita Storage ni su interfaz. La RPC
depende de dogs y weight_entries. Ambos archivos contienen BEGIN/COMMIT y CREATE
sin IF NOT EXISTS: no son idempotentes. No repetirlos ni ocultar colisiones.

<details>
<summary>Procedimiento historico previo a la aplicacion — completado, no repetir</summary>

Las siguientes consultas y pasos conservan el plan utilizado para la autorizacion.
La aplicacion y su historial ya estan confirmados arriba; no son una orden vigente.

## Reconocimiento y comprobaciones previas

Se verificaron en Supabase nombre/ref del proyecto y en Vercel el despliegue
Preview de aedd22a. Un rotulo "Production" de la rama primaria de un proyecto
Supabase no identifica por si solo la produccion comercial de LOBO.
Confirmar nombre/ref, destino URL del despliegue y ambitos de variables juntos.

En Vercel se comprobaron sin imprimir claves: NEXT_PUBLIC_SUPABASE_URL usa
el host del ref esperado y NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY coincide con la
clave publicable de ese mismo proyecto, no secret/service_role. AUTH_V1_ENABLED=true
y APP_URL igual al alias de esta rama. Ambitos exclusivos de rama Preview y
MERCADO_PAGO_ACCESS_TOKEN solo Production. No se uso .env.local como prueba del
entorno remoto. Vercel Authentication habia sido comprobado en la fase anterior;
volver a comprobar su acceso protegido antes de las pruebas posteriores.

El diagnostico ejecutado consulto pg_class/pg_namespace, pg_proc, pg_policies,
pg_trigger, to_regclass del historial y conteos de auth.users/storage, agregados
en el JSON anterior. No se consultaron emails, tokens, contrasenas ni expedientes.
Las consultas desglosadas siguientes son una guia para repetir/ampliar la lectura;
no se ejecutaron literalmente en este formato. No usar pg_stat_activity/query.

```sql
BEGIN READ ONLY;
SELECT current_database() AS database_name,
       current_user AS database_role,
       current_setting('server_version') AS server_version,
       current_setting('transaction_read_only') AS read_only;

SELECT to_regclass('supabase_migrations.schema_migrations') AS migration_history;

SELECT n.nspname AS schema_name, c.relname AS object_name,
       c.relkind, c.relrowsecurity, c.relforcerowsecurity
FROM pg_catalog.pg_class c
JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relkind IN ('r', 'p', 'v', 'm', 'f')
ORDER BY c.relname;

SELECT schemaname, tablename, policyname, roles, cmd, qual, with_check
FROM pg_catalog.pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('dogs', 'weight_entries', 'health_records', 'attachments')
ORDER BY tablename, policyname;

SELECT p.oid::regprocedure AS signature, p.prosecdef AS security_definer,
       p.proconfig AS configuration, p.proacl AS privileges
FROM pg_catalog.pg_proc p
JOIN pg_catalog.pg_namespace n ON n.oid = p.pronamespace
WHERE n.nspname = 'public'
  AND p.proname IN ('create_dog_with_initial_weight', 'set_expediente_updated_at');

SELECT con.conname, con.conrelid::regclass AS source_table,
       con.confrelid::regclass AS referenced_table,
       pg_catalog.pg_get_constraintdef(con.oid) AS definition
FROM pg_catalog.pg_constraint con
WHERE con.contype = 'f'
  AND (con.conrelid IN (
    SELECT c.oid FROM pg_catalog.pg_class c
    JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public'
      AND c.relname IN ('dogs', 'weight_entries', 'health_records', 'attachments')
  ) OR con.confrelid IN (
    SELECT c.oid FROM pg_catalog.pg_class c
    JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public'
      AND c.relname IN ('dogs', 'weight_entries', 'health_records', 'attachments')
  ));
ROLLBACK;
```

Solo si existe schema_migrations, consultar en otra transaccion READ ONLY
`SELECT version FROM supabase_migrations.schema_migrations ORDER BY version;`.
Si no existe, registrar "historial ausente", no "esquema vacio".
Si existen objetos objetivo, detener el plan de aplicacion y ampliar la lectura:
columnas/defaults/CHECK/indices, grants efectivos, definiciones de funciones y
triggers, vistas/dependencias pg_depend, publicaciones y conteos exactos por
tabla (COUNT, sin contenido). Las dependencias de funciones PL/pgSQL o consumidores
externos pueden no constar en pg_depend: revisar tambien codigo y otros Previews.
Guardar solo resumen sin datos personales. current_database() no prueba el ref.

Comparacion: si historial y esquema coinciden exactamente, omitir la migracion
aplicada. Si hay historia sin objetos, objetos sin historia, diferencias o
migraciones desconocidas, detenerse y presentar conciliacion; no ejecutar repair,
DROP, CREATE OR REPLACE ni cambios manuales para forzar coincidencia.

## Plan historico de ejecucion, posteriormente autorizado y completado

1. Reconfirmar valores Vercel y repetir el inventario de lectura justo antes de
   aplicar para detectar cambios posteriores. Preservar la cuenta Auth existente;
   Auth existente no equivale a base vacia. Los callbacks y variables muestran
   otros Previews de expediente-v2 y seguridad: coordinar su uso de lobo-dev.
2. Acordar ventana sin escrituras de pruebas y verificar una copia recuperable
   previa de lobo-dev y su historial. No asumir backups/PITR habilitados: comprobar
   disponibilidad y procedimiento de restauracion; mantener copias privadas.
3. Congelar el SQL aprobado y cotejar las dos huellas contra GitHub. Presentar
   el comando/herramienta exacto, destino explicito y migraciones faltantes para
   autorizacion. Usar un workspace operativo aislado, sin seed ni secretos Git.
   La aplicacion debe conservar el historial de Supabase; pegar SQL en el editor
   por si solo no garantiza registrar una migracion. No preparar un db push ciego.
4. Tras autorizacion, aplicar solo las faltantes, primero esquema y luego RPC,
   manteniendo sus transacciones. No mezclar ambos archivos bajo un BEGIN externo
   suponiendo atomicidad conjunta: contienen COMMIT propios. Si falla cualquiera,
   detenerse, conservar error sin datos sensibles y consultar el estado real.
5. Inspeccionar historial, cuatro tablas, restricciones, indices, triggers,
   RLS activo, 16 politicas, grants y firma exacta de la RPC. Revisar permisos
   efectivos anon/authenticated y revocacion PUBLIC/service_role de la RPC.
   Un rol administrativo puede omitir RLS: no usarlo para demostrar aislamiento.
6. Ejecutar la matriz posterior con dos cuentas ficticias autorizadas y JWT
   individuales. No introducir fixtures por escritura directa en auth.users.
   Mantener los pagos bloqueados y no probar compras ni tocar Production.
7. Informar resultados y conservar evidencia saneada. Ningun resultado autoriza
   merge, Production, Storage ni importaciones. Detenerse antes de ampliar alcance.

</details>

## Matriz final de validacion y limites

| Verificacion | Estado | Evidencia y limite |
| --- | --- | --- |
| Migraciones e historial | PASS | Reporte del ejecutor revisado: ambas versiones, cuatro tablas RLS, 16 politicas, restricciones, indices, triggers y RPC |
| A/B: creacion, lectura y edicion propias | PASS | Interfaz y API del Preview con sesiones normales; objetivo NULL, peso inicial y mediciones conservados |
| Precision 12.46 | PASS | Dos POST Next.js HTTP 400 ejecutados por el propietario; GET identico, sin filas parciales/adicionales |
| Edad original anterior a la edicion | PASS | Edicion de raza el 5 de noviembre conserva 38 meses y 2026-11-04; sin cambio previo de fecha |
| Logout/login y segunda sesion | PASS | Observacion de Codex y confirmacion manual del propietario en Incognito, atribuidas arriba |
| Lectura cruzada de API | PASS | Ambas direcciones respondieron expediente no disponible; codigo HTTP no capturado independientemente |
| RLS: cuatro tablas, ambas direcciones | PASS | 72/72 del verificador via PostgREST/RPC: operaciones ajenas rechazadas, victima sin cambios |
| Propietario, uploaded_by y FK compuesta | PASS | Rechazos remotos 403/42501 y 409/23503 registrados |
| Atomicidad RPC | PASS | Peso inicial 0 dio 400/23514; ausencia de perro parcial comprobada. NULL/>150 y otras variantes tienen evidencia local, no se reetiquetan como remotas |
| DELETE propio y limpieza | PASS | Diez IDs eliminados, dependencias primero, ausencia verificada, cero cuentas eliminadas |
| Segundo intento de limpieza | PASS de proteccion | Bloqueo local reportado por propietario; guardia revisada, sin nueva ejecucion de Codex |
| anon CRUD/RPC, ocho tipos y demas restricciones exhaustivas | Evidencia local | Cubiertos por las 221 pgTAP y/o integracion local segun el informe de persistencia; no se ejecutaron las suites completas en lobo-dev |
| UPDATE propio de metadatos veterinarios/adjuntos | No probado remotamente | Fuera de la interfaz de esta entrega; no se afirma cobertura remota completa de todos los verbos propios |
| Pagos bloqueados en Preview / contrato comercial | Evidencia previa | Pruebas y configuracion documentadas; sin pagos ni nueva revision de Vercel/Production durante este cierre documental |
| Restauracion funcional / equivalencia exacta ACL de parametros | No demostradas | Limites del respaldo conservados; integridad y cobertura verificadas no prueban restauracion |
| Revision del diff y decision de cierre/integracion | PENDIENTE | PR #6 existente; no se presume aprobado, fusionado ni listo para produccion |

Las suites pgTAP son exclusivamente locales desechables; no se ejecutaron en
lobo-dev. Los resultados historicos locales (221 SQL, cuatro integraciones
reales locales y posteriormente 63 unitarias/23 Playwright por modalidad)
permanecen separados de los 72 controles remotos, la prueba manual de precision,
la observacion de edad y la limpieza. Ninguno fue reejecutado en esta tarea.
No se necesitan nuevas filas para documentar el alcance ya comprobado.

## Impacto y riesgos

- Esquema aditivo: el preflight previo a la aplicacion no encontro objetos
  objetivo ni filas que sobrescribir. Ahora ambas migraciones estan aplicadas;
  no repetirlas. No se certifica ausencia de referencias dinamicas o consumidores
  externos. Las migraciones no modificaron auth.users ni localStorage.
- dogs.user_id y attachments.uploaded_by referencian auth.users con NO ACTION;
  despues de crear registros, eliminar la cuenta referenciada puede fallar hasta
  resolver sus hijos. No eliminar usuarios para solucionar pruebas.
- FK compuesta impide unir adjunto y registro de perros diferentes. Storage no
  esta implementado; RLS protege metadata, no bytes ni URLs externas heredadas.
- NUMERIC(5,1) redondea escritores SQL/PostgREST directos. El rechazo de 12.46
  pertenece a la API del Preview, no es un nuevo CHECK de esta migracion.
- La RPC exige RLS, pero CRUD directo propio sigue permitido. No garantiza que
  todo perro creado fuera de la RPC tenga peso inicial. JSONB/details y metadata
  de archivos conservan limites pendientes documentados, sin inventar reglas.
- Auth usa lobo-dev en otros Previews: una restauracion completa podria revertir
  cuentas, contrasenas o sesiones posteriores al respaldo. No hacerla como
  rollback rutinario sin evaluar impacto y obtener autorizacion separada.
- Avisos residuales braces/uuid y dos errores globales ESLint de WhatsApp no
  fueron corregidos ni auditados de nuevo en esta tarea.

## Contingencia de recuperacion — requiere autorizacion separada

No existe una migracion down versionada; no prometer reversion automatica.
Antes del COMMIT, un error SQL revierte la transaccion del archivo correspondiente.
Si el esquema ya se confirmo y falla la RPC, el esquema permanece: consultar
estado e historial antes de reintentar, sin repetir la primera migracion.

Tras COMMIT, preferir correccion hacia delante o contencion del Preview afectado,
con aprobacion especifica, conservando datos y RLS. No desactivar RLS, no usar
service role en la aplicacion, no resetear el proyecto ni restaurar globalmente
por defecto. Una contencion por rama no revoca acceso PostgREST de JWT existentes;
si falla el aislamiento, detener pruebas y proponer restriccion de grants del
proyecto con su impacto sobre otros consumidores antes de aplicarla.

Solo si se verifica que los objetos fueron creados por esta entrega, siguen
vacios y no tienen dependencias externas, proponer por separado una reversion
versionada: RPC por firma exacta, attachments, health_records, weight_entries,
dogs y funcion de timestamp. Nunca DROP CASCADE ni borrar filas por conveniencia.
Si existen datos, respaldarlos y revisar correccion/restauracion antes de borrar
objetos. Mantener el historial coherente; no editarlo o repararlo sin aprobacion.

Referencias consultadas:
[migraciones Supabase](https://supabase.com/docs/guides/deployment/database-migrations),
[backups y limites](https://supabase.com/docs/guides/platform/backups).
La disponibilidad de backups depende del plan; los backups de base no incluyen
los bytes de Storage. No se cambio el plan. El respaldo cifrado privado ya fue
creado y verificado en la fase autorizada anterior; no se restauro ni se genero
otra copia en esta revision. Se mantienen restauracion funcional no probada y
`originalAclEquivalence: not_provable_from_count_only_inventory`.
