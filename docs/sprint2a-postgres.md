# Sprint 2A: esquema, RLS y validacion local

> Continuidad, 19 de octubre de 2026: esta entrega se integro mediante PR #5,
> merge `3362f92`. El contenido siguiente conserva la evidencia de aquella fase.
> La interfaz y RPC se autorizaron posteriormente; su estado esta en
> [sprint2a-persistence.md](sprint2a-persistence.md). La migracion y las dos suites
> originales permanecen intactas en esa continuacion.

Revision: 17 de octubre de 2026.
Rama: `feature/sprint2a-postgres`, creada desde `origin/feature/expediente-v2`,
commit base `89573cad2eb18a8be0ff33c3df7d1af5e4c71b02`.

## Estado y limite de autorizacion

El propietario aprobo la cobertura inicial y autorizo ejecutar las pruebas
exclusivamente en Supabase local desechable, incluida la instalacion de CLI y
Docker. El 17 de octubre de 2026 se aplico la migracion a una base local vacia:
**172 pruebas pgTAP ejecutadas, 172 aprobadas y 0 fallidas**.
No se modificaron la migracion ni las pruebas aprobadas para obtener este resultado.
No se conecto a proyectos remotos ni se usaron claves service role. El entorno
desechable ya fue eliminado. El propietario dio por satisfactoria esta fase local
y autorizo preparar su cierre. Detenido antes del commit y push para revisar el
diff final. No hay commit, push ni PR de Sprint 2A. El PR posterior tendra como
destino exclusivamente `feature/expediente-v2`, nunca `main`, y requiere nueva
autorizacion. Tampoco estan autorizadas migraciones remotas, Storage o interfaz.

| Archivo | Contenido |
| --- | --- |
| [Migracion](../supabase/migrations/20261017000100_expediente_schema_rls.sql) | Cuatro tablas, restricciones, indices, triggers tecnicos, privilegios y 16 politicas RLS. |
| [Autorizacion](../supabase/tests/expediente_rls.test.sql) | Dos usuarios ficticios, CRUD propio, ataques cruzados, ausencia de identidad y anon. |
| [Integridad](../supabase/tests/expediente_constraints.test.sql) | Edad, pesos, tipos veterinarios, fechas desconocidas, JSON y relaciones de adjuntos. |

No se modifica aplicacion, dependencias, sesiones SSR, localStorage, checkout,
Mercado Pago, calculadora, planes, suscripciones, WhatsApp, .env.local ni produccion.
No se crean buckets, adaptadores remotos, importaciones, IA o asistente.

El cierre incluye unicamente los cuatro archivos de Sprint 2A de esta entrega
y `.gitignore`. `.env.local` sigue ignorado y no seguido por Git. `.mp-sandbox/`
es trabajo privado preexistente: al inicio no tenia regla de exclusion en esta
rama base; ahora `.gitignore` lo excluye explicitamente. No se leyo, modifico
ni agrego su contenido. No usar `git add .`: seleccionar solamente estos cinco
archivos y comprobar el indice antes de cualquier commit posterior.

## Fuente aprobada y discrepancias

Se leyo el [ERD](https://www.tldraw.com/f/vabZqlBNieYOh96ayC-_M) sin modificarlo.
La aclaracion del propietario en este encargo prevalece sobre el tablero:

- `dogs` V0.4 conserva los campos y reglas de edad del ERD aprobado.
- `weight_entries` V0.1 no lleva `user_id` redundante. Incluye el rango 1..150,
  `recorded_at` obligatorio y su indice descendente por perro/fecha.
- `health_records` V0.2 usa **record_type**, no `kind`, y **event_date DATE NULL**,
  no `event_at`. Incluye next_due_date, clinic_name y veterinarian opcionales.
- Los ocho tipos exactos son `vaccination`, `deworming`, `flea_tick_control`,
  `consultation`, `prescription`, `lab_result`, `surgery` y `other`.
- `attachments` V0.1 se incluye en esta fase 2A, aunque el tablero diga 2B.
  Conserva la FK compuesta hacia `(health_records.id, health_records.dog_id)`.
- No hay esquema JSON aprobado ni valores literales definitivos de `purpose`,
  lista MIME, limite de archivos o retencion. No se implementan esas restricciones.

Se propone actualizar esas etiquetas del tablero en una revision posterior.
La documentacion general de la rama base conserva estados anteriores al cierre
de Sprint 1. Se consultaron explicitamente, sin copiar ni fusionar ramas,
[SPRINTS](https://github.com/neto995/lobo_web/blob/b37879452aed3e9950a31e1b0879159f596fe31c/docs/SPRINTS.md)
y [PROJECT_STATUS](https://github.com/neto995/lobo_web/blob/b37879452aed3e9950a31e1b0879159f596fe31c/docs/PROJECT_STATUS.md)
de `docs/sprint-tracking`. Sprint 1 esta cerrado tecnicamente en desarrollo,
no liberado a produccion. Sus avisos residuales y errores globales de lint
continuan pendientes; no se modifican sus reportes en este encargo.

## SQL preparado

Tablas, grants y RLS se crean en una sola transaccion, sin periodo intermedio
con tablas nuevas desprotegidas ni modificaciones de datos existentes.

| Tabla | Restricciones e indice explicito |
| --- | --- |
| dogs | Propietario FK auth.users; nombre no vacio; nacimiento o estimacion no negativa con fecha de referencia, nunca ambos; edad desconocida completamente NULL; sex male/female/unknown; indice (user_id, created_at). |
| weight_entries | FK dogs; numeric(5,1) entre 1 y 150; recorded_at requerido sin fecha por defecto; indice (dog_id, recorded_at DESC). |
| health_records | FK dogs; ocho record_type; titulo no vacio; event_date y next_due_date opcionales sin defaults; details JSONB sin esquema adicional; UNIQUE(id, dog_id); indice (dog_id, event_date DESC). |
| attachments | FK dogs y auth.users; health_record_id opcional; FK compuesta (health_record_id, dog_id); storage_path unico; indice (dog_id, created_at DESC). |

Detalles tecnicos visibles para revision:

- UUID nuevos por `gen_random_uuid()`. Propietario de dogs, dog_id de las hijas,
  uploaded_by y storage_path son NOT NULL para evitar filas sin propietario o ruta.
- Solo timestamps tecnicos usan `now()`: created_at y updated_at son NOT NULL.
  Triggers en dogs/health_records actualizan updated_at, nunca event_date.
  Estos campos no se presentan como un registro de auditoria inmutable.
- `sex` omitido queda `unknown`; is_sterilized, edad, peso objetivo y URL heredada
  pueden ser NULL. No se deducen valores faltantes.
- Todas las FK conservan `NO ACTION`, sin cascadas automaticas. Borrar un perro,
  registro o usuario con referencias requiere resolver primero sus dependencias.
  DELETE propio no elimina hijos ni objetos de Storage implicitamente.
- JSONB garantiza JSON valido, no contenido clinico valido. details admite NULL
  y cualquier forma JSON por ahora, sin claves ni medicamentos obligatorios.
- purpose, MIME, nombre original y tamano son metadata sin reglas adicionales.
  `storage_path` aun no valida prefijo de propietario ni existencia/propiedad del
  objeto real. No habilitar subidas con esta migracion solamente.
- `numeric(5,1)` redondea a una decimal antes de CHECK. Una futura importacion
  debe detectar cambios de precision y pedir confirmacion, no perderlos en silencio.
- El ERD pide validar fechas/peso objetivo, pero no fija limites exactos. No se
  impone aun rango a target_weight_kg ni regla de fechas futuras. No son
  validaciones completas para habilitar el formulario remoto.

## Politicas de autorizacion

Hay SELECT, INSERT, UPDATE y DELETE separados en cada tabla, solo para
`authenticated`. Se revocan grants previos de PUBLIC/anon/authenticated y
se otorga a authenticated solo ese CRUD, no TRUNCATE/REFERENCES/TRIGGER.

- dogs compara `user_id = (select auth.uid())`.
- Las hijas exigen que exista el perro correspondiente con ese propietario.
  weight_entries no duplica user_id.
- UPDATE verifica fila anterior (`USING`) y resultante (`WITH CHECK`), impidiendo
  trasladar datos o propietarios a otra cuenta.
- attachments comprueba tambien `uploaded_by = auth.uid()`. La FK compuesta
  impide asociar un registro de otro perro, incluso de la misma cuenta.
- anon no recibe permisos. authenticated sin sujeto JWT no obtiene filas ni puede
  insertar. Sin vistas/RPC SECURITY DEFINER, bypass ni service role.

**Alcance de archivos:** estas politicas protegen metadata, no los bytes.
Una ruta unica no prueba la propiedad del objeto. Antes de habilitar
subidas/descargas se necesitan bucket privado, convencion de rutas y politicas
de Storage probadas entre usuarios. Tampoco legacy_photo_url queda protegida por
RLS. Esta entrega no afirma que Storage este protegido.

Referencias: [RLS y privilegios](https://supabase.com/docs/guides/database/postgres/row-level-security),
[pruebas SQL](https://supabase.com/docs/guides/database/testing),
[Storage](https://supabase.com/docs/guides/storage/security/access-control) y
[pgTAP](https://pgtap.org/documentation.html).

## Propuestas pendientes, NO implementadas

### details por tipo

Propuesta minima comun: SQL NULL u objeto JSON; ninguna clave clinica obligatoria.
Validar tipos solo al aprobar las claves. No interpretar ni completar informacion
ausente, fijar dosis, medicamentos, cronologias o catalogos.

| record_type | Propuesta para revision, no contrato aprobado |
| --- | --- |
| vaccination | Objeto opcional, sin vacuna, lote o fecha obligatorios. |
| deworming | Objeto opcional, sin producto, dosis o periodicidad obligatorios. |
| flea_tick_control | Objeto opcional, sin producto, dosis o periodicidad obligatorios. |
| consultation | Objeto opcional, sin diagnostico obligatorio. |
| prescription | Objeto opcional; proponer medications como array de objetos si aparece, permitiendo varios elementos; sus campos siguen por definir. |
| lab_result | Objeto opcional, sin resultados o unidades clinicas obligatorios. |
| surgery | Objeto opcional, sin procedimiento o fecha obligatorios. |
| other | Objeto opcional, sin claves clinicas exigidas. |

La fixture JSON ilustra preservacion de varios elementos; no aprueba ese esquema.
event_date desconocido sigue NULL. La futura IA nunca debe inventarlo; cualquier
extraccion requiere revision y confirmacion antes de guardar. IA no se implementa.

### Archivos y eliminacion

Propuestas, no reglas activas ni decisiones ya aprobadas:

1. purpose: `profile_photo` y `veterinary_document`. Foto de perfil sin
   health_record_id; documento con vinculo opcional solo al mismo perro.
2. PDF, JPEG y PNG para documentos; JPEG y PNG para perfil. Maximo propuesto:
   **10 MiB por archivo**, tamano positivo y verificacion del formato real en
   servidor, no solo extension/Content-Type. Rechazar SVG/HTML y formatos no
   aprobados. No procesar automaticamente contenido activo o sospechoso.
3. Bucket privado `lobo-dog-files` segun ERD; rutas generadas bajo
   `<user.id>/<dog.id>/<attachment.id>/...`, sin nombre original en la ruta.
   Metadata y Storage deben verificar correspondencia de usuario, perro, ruta y
   objeto, incluyendo UPDATE y borrado.
4. Acceso autenticado y URLs firmadas de corta duracion, nunca URL publica
   permanente. Probar subida, lectura, sustitucion y borrado cruzados.
5. Proponer limpieza de temporales no confirmados despues de **24 horas**, con
   comprobacion de propietario, ausencia de referencias y proteccion contra
   confirmaciones concurrentes. No basta borrar por antiguedad o prefijo.
   No automatizar sin aprobar como identificar temporal y confirmacion.
6. No aplicar TTL a expedientes/archivos confirmados. Definir borrado explicito,
   orden de eliminacion y reintentos ante errores entre DB/Storage.

Para dogs: proponer nombre maximo 80 caracteres y peso objetivo opcional 1..150 kg
(alineados con la interfaz), fechas de nacimiento/referencia finitas y no futuras
con una zona de referencia acordada. No imponer una edad maxima clinica.
Estas restricciones adicionales siguen pendientes de aprobacion.

## Compatibilidad con Mi Expediente

Revisados [PackRepository](../app/mi-expediente/repository.ts),
[tipos](../app/mi-expediente/types.ts), [formulario](../app/mi-expediente/components/DogForm.tsx),
[validaciones](../app/mi-expediente/data.ts) y
[localStorageRepository](../app/mi-expediente/localStorageRepository.ts).
Propuestas para otra entrega, no conversiones implementadas:

| Dato actual | Tratamiento propuesto sin perdida silenciosa |
| --- | --- |
| age, texto libre | Conservar original; no interpretar automaticamente "4 anos", rangos o "Sin especificar". Para nuevas entradas: fecha conocida, meses estimados con referencia, o desconocida. Importar solo con confirmacion explicita. |
| dailyPortion | Numero entero en Dog, string en DogFormValues. No tiene columna equivalente. No descartarlo, inventar feeding_plans ni esconderlo en details. Mantener adaptador local hasta aprobar su tratamiento; bloquear importacion que lo pierda. |
| photoUrl | Solo tras revision explicita podria conservarse literalmente en legacy_photo_url. Sin descarga ni conversion automatica. Una URL externa puede revelar solicitudes a terceros; fotos nuevas requieren Storage privado. |
| sex / is_sterilized | Proponer mapeo explicito Macho/Hembra/Sin especificar a male/female/unknown. Nunca inferir esterilizacion; desconocida queda NULL. |
| breed / targetWeight | DTO actual exige string/numero; esquema permite NULL. Aprobar representacion de desconocido sin inventar cero o texto como dato real. |
| weights | Mapear value/recordedAt sin perder historial, precision ni fecha original. Revisar UUID y timestamps antes de importar; no sobrescribir invalidos. |
| create(values) | Actualmente crea perro y primer peso juntos. El adaptador remoto debe resolver atomicidad sin service role en otra entrega. |

PackRepository es asincrono, pero **cambiar solo el adaptador no resuelve el DTO**
ni dailyPortion. Tampoco incluye CRUD veterinario, adjuntos o delete.
No cambiar formulario, contrato o persistencia sin aprobar esa compatibilidad.

`lobo.mi-expediente.v1` y `lobo.mi-expediente.auth-v1.<user.id>` permanecen intactos.
Ni legacy ni el namespace UUID demuestran propiedad: no son aislamiento seguro
entre personas que comparten navegador. No se leen, atribuyen, borran ni marcan
como migrados automaticamente. RLS futura no convierte esos datos en propios.

## Pruebas y evidencia

SQL con pgTAP, transaccion y ROLLBACK. Requiere Supabase local **desechable y sin
datos ajenos**, no un proyecto remoto. Setup administrativo solo para fixtures
ficticias; operaciones y ataques como authenticated con sujeto A/B, nunca como
superusuario/service role. Sin cuentas reales, envio de correo o credenciales
del proyecto. La comprobacion final privilegiada confirma victimas intactas.

| Cobertura ejecutada localmente | Aserciones |
| --- | --- |
| CRUD propio A y B | Lectura de IDs reales, INSERT/UPDATE/DELETE con filas/valores devueltos. |
| Cruces A/B en ambas direcciones | Lectura vacia; UPDATE/DELETE con cero filas; INSERT ajeno rechazado; victimas intactas. |
| Cambios de FK/propietario | Rechazo de transferencia de dogs.user_id, dog_id ajeno y uploaded_by falsificado. |
| Adjuntos | FK compuesta entre perros, incluso mismo propietario; ruta unica; vinculo opcional; sin cascadas silenciosas. |
| Sin identidad / anon | Sin lecturas ni mutaciones autorizadas en las cuatro tablas. |
| Integridad | Ocho tipos exactos, NULL event_date, JSON con varios elementos, rango de peso, fecha de peso requerida, edad excluyente y timestamps. |
| Privilegios | RLS activo, cuatro politicas por tabla, sin grants TRUNCATE/REFERENCES/TRIGGER. |

### Validacion local del 17 de octubre de 2026

| Suite | Ejecutadas | Aprobadas | Fallidas | Resultado |
| --- | ---: | ---: | ---: | --- |
| expediente_constraints.test.sql | 42 | 42 | 0 | PASS, salida 0 |
| expediente_rls.test.sql | 130 | 130 | 0 | PASS, salida 0 |
| Total | 172 | 172 | 0 | Dos suites completas |

Las pruebas comprobaron CRUD propio y rechazo de accesos cruzados A/B,
transferencias de propietario, suplantacion de uploaded_by, ausencia de identidad,
acceso anonimo y FK compuesta de adjuntos. Tambien verificaron los ocho tipos,
fechas desconocidas NULL, integridad de edad/peso y timestamps tecnicos.
Son pruebas SQL con roles y sujetos JWT simulados, no sesiones HTTP reales.

Entorno y aislamiento comprobados:

- Supabase CLI 2.121.0, Docker Desktop 4.94.0 / engine 29.8.2.
- Imagen oficial `public.ecr.aws/supabase/postgres:17.11.0.004`, PostgreSQL 17.11;
  pgTAP disponible 1.3.3 y ejecutor oficial `supabase/pg_prove:3.36`.
- Proyecto temporal `lobo-sprint2a-local-lsikzk`, fuera del repositorio, con HOME
  temporal y entorno vacio (`env -i`), sin cargar .env.local, credenciales del
  proyecto, enlaces remotos ni seed. Docker usa el socket Unix local.
- Solo PostgreSQL: API, Auth servidor, Storage, Studio, correo y otros servicios
  deshabilitados. Antes de la migracion: cero tablas public, cero auth.users,
  cero servidores externos y cero suscripciones PostgreSQL.
- Antes de aplicar SQL se confirmo `127.0.0.1:55432` como unico puerto publicado;
  rol authenticated sin BYPASSRLS. Red Docker dedicada, sin afirmar bloqueo de
  trafico saliente: no se configuro una red interna sin salida.
- Se uso `supabase migration up --local` y luego `supabase test db` por archivo,
  con `--local`, `--workdir` temporal y `--network-id` explicitos. Nunca db push,
  --linked, un proyecto remoto ni credenciales de produccion.
- Tras ambos ROLLBACK: cero filas en auth.users, dogs, weight_entries,
  health_records y attachments; cuatro tablas con RLS y 16 politicas. Historial
  local de migracion `20261017000100`; cero servidores externos y suscripciones.
- Al terminar se retiraron exclusivamente los contenedores, volumen y red de
  este proyecto desechable. Puerto 55432 sin listener. Docker y CLI siguen
  instalados; los archivos SQL del repositorio permanecen intactos.

Incidencias de entorno, separadas de resultados SQL:

1. La instalacion inicial de Docker por Homebrew no pudo crear enlaces de sistema
   que requerian sudo. Se uso la aplicacion oficial verificada y el propietario
   completo su inicio. No se solicitaron ni registraron contrasenas.
2. Una red Docker interna impidio la conexion local de CLI. En el siguiente
   arranque, la opcion de red para loopback no evito la publicacion en todas las
   interfaces. Se detuvo esa base vacia **antes de aplicar la migracion o crear
   fixtures** y se recreo solo su contenedor con enlace explicito a 127.0.0.1.
   La exposicion inicial no se presenta como aislamiento correcto; se corrigio
   y verifico antes de probar SQL.
3. Un intento de herramienta fue bloqueado por limite de uso antes de ejecutarse.
   Tras reanudar, el primer intento del ejecutor fallo con
   `could not translate host name "db" to address: Name does not resolve`:
   **0 pruebas ejecutadas**, proceso psql con salida 2 y CLI con salida 1.
   No fue un fallo de una asercion ni de la migracion. Se restauro el alias db
   en la red local y se confirmo nuevamente el puerto loopback antes de repetir.
4. Las dos ejecuciones finales no tuvieron errores SQL inesperados. El unico
   aviso fue `extension "pgtap" already exists, skipping`, no un error.
   Los rechazos SQL esperados por permisos, CHECK y FK se comprobaron mediante
   throws_ok y cuentan como pruebas aprobadas, no fallos.

Las copias ejecutadas coincidieron exactamente con los originales aprobados:

| Archivo | SHA-256 |
| --- | --- |
| Migracion | `d228642e9e3866a13e42a8895ea269021881929d0153f8f2cf39013d04a834c4` |
| Autorizacion | `8d5f3033d801672ef610157d7f47e12465736364212087de4169518d147e67d5` |
| Integridad | `c939c66adae4ba5d9036612b35b3fd23b34f8baccd7bbda49749a3f4aa242337` |

Se conservaron sus comentarios historicos de preparacion para no cambiar los
archivos aprobados; el estado de ejecucion vigente es el de esta evidencia.
Los logs locales quedaron fuera de Git en
`/private/tmp/lobo-sprint2a-pgtap.LsIKZK/logs/`: `constraints-run1.log` (conexion),
`constraints-run2.log` (42 PASS), `rls-run1.log` (130 PASS) y `stop.log`.
Son evidencia temporal, no un artefacto persistente ni archivos para versionar.

Para conservar evidencia verificable aunque desaparezca el directorio temporal,
se cotejaron nuevamente los hashes y los logs al preparar este cierre. Extractos
literales de los resultados finales, sin credenciales:

Integridad (`constraints-run2.log`):

```text
All tests successful.
Files=1, Tests=42,  1 wallclock secs ( 0.02 usr  0.01 sys +  0.01 cusr  0.03 csys =  0.07 CPU)
Result: PASS
```

Autorizacion (`rls-run1.log`):

```text
All tests successful.
Files=1, Tests=130,  0 wallclock secs ( 0.02 usr  0.02 sys +  0.01 cusr  0.01 csys =  0.06 CPU)
Result: PASS
```

Esta preparacion de cierre no volvio a ejecutar las suites ni las migraciones.

### Otras verificaciones y limites

- `npm test`, ejecutado antes de esta fase SQL el mismo 17 de octubre, con
  entorno limpio y sin cargar .env.local: **43/43 OK**, no repetido ahora. Incluye
  Auth, repositorio local y checkout con transporte simulado. Sin preferencias,
  pagos ni conexiones a proveedores reales.
- Advertencia preexistente de Node: MODULE_TYPELESS_PACKAGE_JSON al cargar TS.
  Sin cambios de dependencias o modulos para silenciarla.
- Revision estructural estatica: cuatro tablas, 16 politicas y cuatro indices
  explicitos; sin patrones reconocidos de secretos ni errores de espacios en
  los cuatro archivos nuevos. Esto no es compilacion SQL ni prueba de RLS.
- TypeScript, lint, build y Playwright no repetidos: no hay cambios de aplicacion.
  Integracion Auth/DB y aislamiento HTTP/Storage siguen sin probar.

Esta evidencia valida el esquema y aislamiento SQL en el entorno local descrito;
no demuestra aislamiento de bytes en Storage, integracion con sesiones SSR,
compatibilidad del futuro adaptador ni autorizacion de despliegue. Los riesgos
y decisiones pendientes descritos arriba siguen abiertos.

## Pendientes para autorizacion

1. El propietario acepto las 172/172 pruebas locales. Revisar el diff final y
   autorizar por separado commit y push; despues, un PR a feature/expediente-v2.
   No aplicar a Supabase remoto ni crear commit, push o PR sin nueva autorizacion.
2. Aprobar o ajustar details, purpose, MIME/tamano, rutas, temporales/borrado y
   limites de dogs antes de habilitar esos flujos.
3. Resolver dailyPortion y el DTO de edad/NULL antes de conectar el repositorio
   remoto. Ninguna importacion heredada esta autorizada implicitamente.
4. Mantener pendientes pruebas HTTP con Auth y pruebas de archivos hasta que se
   aprueben sus respectivas implementaciones. No avanzar a Storage o interfaz.

Migracion aplicada solo al entorno local desechable ya eliminado. Sin migraciones
remotas, commit, push, PR, merge ni despliegue en esta fase.
