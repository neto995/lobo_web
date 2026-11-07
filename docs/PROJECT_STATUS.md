# LOBO — Project Status

**Proyecto:** LOBO Digital Platform  
**Repositorio:** `neto995/lobo_web`  
**Última actualización:** 5 de noviembre de 2026
**Estado general:** Desarrollo activo  
**Producción:** `main` — https://eatlikeawolf.mx

> Este documento es la referencia del estado actual del desarrollo digital de LOBO. Distingue entre funcionalidades en producción, implementaciones en desarrollo, pruebas realizadas y trabajo pendiente. Debe actualizarse después de cada cambio relevante.

**Estado vigente — validación técnica de Sprint 2A completada en desarrollo,
pendiente de revisión y decisión de cierre del PR #6.** Las migraciones
`20261017000100` y `20261018000100` se aplicaron únicamente en `lobo-dev`.
El propietario ejecutó el procedimiento y Codex revisó su reporte: preflight,
dry-run, aplicación y postcheck PASS; cuatro tablas con RLS, 16 políticas,
19 restricciones, 10 índices, dos triggers y RPC SECURITY INVOKER con permisos
restringidos. La cuenta y la identidad Auth preexistentes quedaron preservadas.

| Verificación completada | Evidencia y alcance |
| --- | --- |
| Auth del Preview | PASS manual reportado por el propietario: registro, confirmación, login, logout y recuperación |
| Persistencia de perfiles y pesos | PASS observado en el Preview con A/B; 12.4 aceptado, objetivo NULL, edición e historial conservados; nuevo login y sesión independiente comprobados |
| RLS y atomicidad | **72/72 PASS, 0 FAIL**: verificador ejecutado por el propietario con sesiones authenticated normales; Codex revisó el reporte, sin repetirlo |
| Precisión en las rutas Next.js | PASS: el propietario ejecutó el script revisado con A; los dos POST con 12.46 devolvieron HTTP 400, sin perfil parcial, medición extra ni cambios en los datos previos |
| Edad histórica | PASS observado por Codex el 5 de noviembre: editar solo raza conservó exactamente 38 meses y fecha 2026-11-04, objetivo NULL e historial; no se preparó otra fecha ni se cambió el reloj |
| Limpieza limitada | PASS: propietario ejecutó el borrado de los diez IDs inventariados; Codex cotejó el reporte. 2 adjuntos de metadatos, 2 registros veterinarios, 4 pesos y 2 perros eliminados y ausencia verificada |
| Protección contra repetición | Segundo intento reportado por el propietario bloqueado en preflight local, antes de autenticarse; conserva el marcador y el reporte exitoso |

No quedan filas de esos diez fixtures según la verificación del ejecutor; esto
no significa que toda la base esté vacía. No se borraron cuentas Auth, datos
anteriores ni archivos Storage; las cuentas de prueba se conservan. Las dos
sesiones creadas por el verificador de limpieza se cerraron. **La ventana de
pruebas controladas puede cerrarse.** Esta revisión documental no ejecutó
pruebas nuevas, consultas remotas ni otra limpieza.

El respaldo cifrado previo tiene integridad y cobertura PASS. Se mantienen
`restoration: not_tested` y
`originalAclEquivalence: not_provable_from_count_only_inventory`.
No se reabre el trabajo de respaldo. Evidencia, atribución, límites y pendientes
en [el informe de migraciones y validación](sprint2a-dev-migration-plan.md#validacion-final-del-preview-y-limpieza-5-de-noviembre-de-2026).
El cierre formal, la integración del PR y cualquier publicación requieren
decisiones separadas; no se autorizaron merge ni Production.

<details>
<summary>Historial de preparación de octubre — sustituido por el estado vigente anterior</summary>

Los bloqueos y autorizaciones pendientes que siguen describen su momento
histórico, no instrucciones para repetir exportaciones o migraciones.

**Preparación de Preview Sprint 2A:** persistencia aprobada en `609e97f`; protección
comercial adicional validada localmente (63 unitarias y 23 pruebas Playwright en
dev, repetidas 23/23 en build optimizado). Mercado Pago restringido en Vercel a
Production para futuros despliegues; pagos bloqueados en código fuera de ese
entorno. Publicación controlada autorizada: primer Preview sin Auth, configuración
posterior exclusiva de la rama con `lobo-dev` y nueva validación remota pendiente.
No hay autorización de producción ni migraciones remotas. Evidencia y límites en
[Sprint 2A Persistence](sprint2a-persistence.md#aislamiento-comercial-autorizado-21-de-octubre-de-2026).

**Actualización del 22 de octubre, posterior a la preparación anterior:** PR #6
Draft publicado hacia `feature/expediente-v2`, commit de Preview `aedd22a`.
El propietario reporta PASS manual de registro, confirmación, login, logout y
recuperación en ese Preview. No son pruebas automatizadas ejecutadas por Codex
ni evidencia de persistencia/RLS remotas. La inspección remota READ ONLY confirmó
`lobo-dev`: PostgreSQL 17.11, historial ausente, sin tablas ni políticas en public
ni funciones objetivo; una cuenta Auth y cero objetos/buckets Storage. Ambas
migraciones cotejadas con GitHub están pendientes. Vercel confirma Preview
`aedd22a`, URL y clave publicable de `lobo-dev`, Auth habilitado y APP_URL de esta
rama; las cuatro variables son exclusivas de su Preview y no hay variables Shared
vinculadas. No se guardaron cambios ni se imprimieron claves. Free no incluye
backups del proyecto: falta preparar un respaldo recuperable y autorizar el
mecanismo de aplicación. Ver
[inventario, validación y rollback propuestos](sprint2a-dev-migration-plan.md).
No se aplicaron migraciones remotas ni se autorizó merge o Production.

**Respaldo previo, bloqueado:** el panel de `lobo-dev` confirmó nuevamente que
Free no incluye backups del proyecto. No se creó ni verificó una copia exportada.
El propietario encontró la contraseña original. Tras el fallo TLS inicial del
22 de octubre, el día 23 proporcionó la CA oficial descargada: la prueba SIN
contraseña con psql 17.11 y verify-full validó cadena y hostname, alcanzando la
petición de autenticación. No hubo login ni consulta ejecutada. El procedimiento
con prompt oculto está preparado fuera de Git, pendiente de ejecución personal
del propietario. Faltan validar la conexión autenticada y confirmar el
cifrado/recuperación bajo custodia del propietario.
El 24 de octubre el propietario reportó fallo de autenticación. Se compararon
panel y script: host, puerto, base y usuario postgres.zzbdoxeyvztnnbhwcbvd
coinciden; el script ya usaba ese usuario completo. Sin cambios de parámetros,
TLS ni contraseñas. Reintento manual preparado, resultado pendiente.
Posteriormente el propietario restableció personalmente la contraseña solo de
lobo-dev y reportó PASS: TLS verify-full, autenticación, PostgreSQL 17.11,
READ ONLY/ROLLBACK, una cuenta y una identidad Auth. Es evidencia manual, sin
exportación ni nueva consulta ejecutada por Codex. Los tres clientes PostgreSQL
17.11 para respaldo/inspección están disponibles. Con autorización posterior se
instaló age 1.3.2 desde Homebrew: 8/8 comprobaciones finales con archivos ficticios,
incluidas igualdad byte a byte/SHA-256, rechazo de frase errónea y alteración, y
detección de productor fallido. En la preparación posterior del 24 de octubre,
el flujo PostgreSQL ficticio 17.11 → age → inspección sin restaurar pasó 25/25
comprobaciones de cobertura; una prueba adicional rechazó la contraseña ficticia
incorrecta sin revelar diagnósticos. Contenedor aislado detenido y eliminado.
FileVault ahora informa On y el volumen Data confirma Yes, sin conversión en
curso reportada; Codex no lo activó. Carpeta privada fuera de Git creada con
permisos 0700, archivos cifrados ficticios 0600 y scripts sin secretos preparados.
No existe respaldo real: exportación pendiente de autorización separada, frase
nueva bajo custodia del propietario y ventana sin cambios en lobo-dev. La prueba
no certifica cobertura real de Auth ni recuperación funcional de Supabase.
Evidencia, comando preparado y limitaciones en el informe de migración.
Codex no cambió credenciales, plan ni permisos remotos. La cobertura de Auth y la integridad deben verificarse antes de
aplicar migraciones; no se ejecutó ninguna restauración. Procedimiento y límites
en el informe enlazado arriba.

</details>

---

## 1. Visión del producto

LOBO es una marca de alimentación para perros que busca desarrollar una plataforma digital integrada para:

- Vender productos y planes de alimentación.
- Ayudar a los clientes a calcular sus porciones.
- Crear y administrar expedientes individuales de sus perros.
- Registrar clientes y pedidos automáticamente.
- Automatizar procesos de atención, ventas y seguimiento.

**Principio de producto:** simplificar la experiencia del cliente sin comprometer seguridad, privacidad ni la operación comercial existente.

---

## 2. Estado de los componentes

| Componente | Estado | Observaciones |
|---|---|---|
| Sitio web comercial | En producción | Next.js + Vercel |
| Calculadora de alimentación | En producción | Preservar comportamiento actual |
| Checkout Mercado Pago | En producción | Checkout existente; evitar regresiones |
| Mi Expediente — interfaz | En desarrollo | Base existente en `feature/expediente-v2` |
| Autenticación con Supabase | Integrada y cerrada técnicamente en desarrollo | PR #1 integrado; no publicada a producción |
| Seguridad de dependencias | Correcciones integradas | PR #2 integrado; avisos residuales sin resolver |
| Expedientes en PostgreSQL | Migraciones y validación del alcance de Sprint 2A completadas en lobo-dev/Preview | PR #6 pendiente de revisión y decisión de integración; no producción |
| Row Level Security de expedientes | Cuatro tablas y 16 políticas; aislamiento A/B remoto PASS | 72/72 comprobaciones y limpieza posterior por IDs; sin aplicación a producción |
| Registro automático de pedidos | No implementado | Etapa futura |
| CRM de clientes | No implementado | Etapa futura |
| IA en WhatsApp para ventas | Pendiente | No confundir con el flujo de WhatsApp existente |

**Regla:** implementado, probado e integrado a producción son estados distintos.

---

## 3. Sprint 1 — Autenticación

**Estado:** cierre técnico en desarrollo aprobado por el propietario el 16 de octubre; no publicado a producción.

PR #2 integrado en `feature/auth-v1` (`50bdfc1`), PR #1 integrado en
`feature/expediente-v2` (`89573ca`). El propietario confirmó en el Preview integrado
registro, confirmación, acceso protegido, logout y recuperación por correo con
nuevo login. Esa evidencia histórica no equivale a una prueba remota de Sprint 2A.

Tecnologías:
- Supabase Auth.
- Next.js App Router.
- Sesiones SSR.
- Resend para correos de autenticación.

Funcionalidades desarrolladas:
- Registro con correo y contraseña.
- Confirmación de correo.
- Inicio y cierre de sesión.
- Recuperación de contraseña.
- Protección de rutas del expediente.
- Separación de datos locales por usuario autenticado.

**Limitaciones conocidas:**
- En la versión integrada de Sprint 1, los expedientes aún utilizaban localStorage.
- La continuación Sprint 2A permite persistencia de perfiles y pesos; cuenta con
  pruebas locales y migraciones aplicadas únicamente en lobo-dev. Persistencia,
  aislamiento, precisión de API y edad histórica ya tienen evidencia remota;
  la integración del PR #6 y su cierre formal siguen pendientes.
- Los registros heredados de localStorage no se importan automáticamente.
- La autenticación todavía no está publicada en producción.

**Referencia:** [PR #1 — Auth V1](https://github.com/neto995/lobo_web/pull/1)

---

## 4. Seguridad de dependencias

**Estado:** correcciones integradas; riesgos residuales en seguimiento.

- Rama: `fix/security-dependencies`.
- Next.js y eslint-config-next 16.4.2; React y React DOM 19.2.9.
- Pruebas de regresión realizadas.
- Auditoría de dependencias documentada.
- Persisten vulnerabilidades residuales que requieren seguimiento.
- La remediación del 14 de octubre está documentada en `security-dependencies.md`.

El último reporte de seguridad conserva `braces` (cinco paquetes de herramientas,
high) y Mercado Pago/`uuid` (dos runtime, moderate). No se realizó una nueva auditoría
de dependencias en esta entrega ni se modificaron versiones. Los dos errores de
lint de WhatsApp siguen presentes. El propietario aceptó esos riesgos solo para
cierre técnico en desarrollo, no para producción. Pruebas actuales y límites:
[Sprint 2A persistencia](sprint2a-persistence.md).

**Referencia:** [PR #2 — Seguridad](https://github.com/neto995/lobo_web/pull/2)

---

## 5. Mercado Pago Sandbox

**Estado:** preparación preservada; pruebas adicionales pausadas.

Se desarrollaron herramientas aisladas para:
- Validar credenciales del vendedor de pruebas.
- Comprobar el aislamiento respecto de producción.
- Preparar un receptor HTTPS temporal.
- Validar destinos de retorno y recepción de webhooks.

**Verificado:**
- Token aceptado y vendedor de prueba correcto.
- Cuenta mexicana de pruebas.
- Rutas HTTPS temporales funcionando.
- Ningún destino de pruebas apuntaba a producción.
- Túnel y receptor posteriormente detenidos.

**No realizado:**
- No se crearon pagos ni preferencias de prueba.
- No se configuraron webhooks en Mercado Pago.
- No se ejecutó una compra completa de sandbox.

Trabajo preservado en:
- Rama: `chore/mercadopago-sandbox`.
- Commit: `8561926`.
- Lobo Sandbox: https://www.mercadopago.com.mx/developers/panel/app/4615055711436243/
  
**Decisión actual:** no continuar con Mercado Pago Sandbox hasta que su validación sea necesaria para un cambio de checkout o para el registro automático de pedidos.

---

## 6. Git y despliegues

| Rama | Propósito |
|---|---|
| `main` | Producción |
| `feature/expediente-v2` | Base de desarrollo de Mi Expediente |
| `feature/auth-v1` | Autenticación |
| `fix/security-dependencies` | Actualizaciones y pruebas de seguridad |
| `chore/mercadopago-sandbox` | Herramientas aisladas de pruebas |
| `docs/project-foundation` | Documentación y continuidad del proyecto |
| `feature/sprint2a-persistence` | Perfiles y pesos publicados en Preview; PR #6 hacia `feature/expediente-v2`, último estado conocido Draft |

**Integración verificada:** PR #2 y PR #1 integrados con los commits indicados
arriba; PR #5 (esquema/RLS) integrado en `feature/expediente-v2` mediante
`3362f92aa0e9c713901c82dad28fa96e764d21ee`, base de la rama actual.
HEAD local y referencia remota almacenada: `aedd22a3dd3ddbfe1652bc8e3429a6f749266f20`.
[PR #6](https://github.com/neto995/lobo_web/pull/6) ya existe; no se consultó
GitHub ni se ejecutó fetch en esta revisión documental. Su estado actual y checks
se deben reconfirmar antes de decidir integración, siempre hacia
`feature/expediente-v2`, nunca `main`.

Pendiente de guardar/revisar: cambios locales en `docs/PROJECT_STATUS.md`, nuevo
`docs/sprint2a-dev-migration-plan.md` y la prueba preexistente no versionada
`app/mi-expediente/tests/routes.test.mjs`. Esta última no se modificó ni ejecutó
en esta revisión. No se incluyen automáticamente en un commit ni en el PR.

**Despliegues:** Vercel usa `main` como rama de producción. Las ramas de desarrollo examinadas generan despliegues Preview. No desplegar cambios productivos sin autorización.

---

## 7. Sprint 2A — Persistencia en desarrollo

**Mi Expediente LOBO: persistencia en Supabase PostgreSQL.**

Objetivo: permitir que un cliente registre y administre los expedientes de sus perros y encuentre la misma información al iniciar sesión desde diferentes dispositivos.

Alcance de esta entrega: creación, consulta y edición de perfiles; historial de
peso; API autenticada y adaptador remoto; RPC atómica SECURITY INVOKER para perro
y primer peso. Edad exacta/estimada/desconocida, referencia America/Mexico_City y
aviso explícito de datos anteriores no importados. Ambos namespaces legacy intactos.

Ajustes aprobados del 20 de octubre: la API rechaza pesos que requieren redondeo
a una decimal, el peso objetivo vacío se guarda como NULL y el inicial sigue
siendo obligatorio. El aviso aclara que los datos anteriores pueden conservarse
si no se eliminó su almacenamiento, sin leerlos ni atribuirlos automáticamente.

**Estado:** implementación en `feature/sprint2a-persistence`, Preview y migraciones
en lobo-dev validados para el alcance autorizado; pendiente de revisión documental
y decisión del propietario sobre cierre e integración. Los resultados locales
históricos (221 pgTAP, 4 integraciones reales locales y, tras aislamiento comercial,
63 unitarias y 23 Playwright por modalidad) no se reejecutaron ni se presentan
como pruebas remotas. Ver [evidencia local histórica](sprint2a-persistence.md) y
[evidencia remota actual](sprint2a-dev-migration-plan.md).

Sin Storage, cartilla, IA, importación ni interfaz de borrado de perfiles.
El borrado de QA fue una operación autorizada y acotada, no una nueva función
comercial. No se realizaron commit, push, merge o despliegue en esta revisión.

---

## 8. Riesgos y pendientes relevantes

| Pendiente | Prioridad |
|---|---|
| Dar seguimiento a los avisos residuales de dependencias | Alta |
| Revisar el diff documental y la prueba local no versionada; decidir por separado qué guardar/publicar | Alta |
| Reconfirmar estado/checks de PR #6 y decidir cierre e integración a `feature/expediente-v2` | Alta |
| Revisar el aviso de privacidad y completar información pendiente | Alta, antes de publicar funcionalidades que traten datos personales |
| Mantener pruebas de checkout para cambios futuros | Media |
| Resolver lint global preexistente de WhatsApp | Media |
| Conciliar las notas históricas de README/roadmap con el estado vigente cuando se autorice su actualización; `docs/SPRINTS.md` no está en esta rama | Documentación |
| Implementar registro automático de pedidos | Futuro |
| Implementar automatización comercial de WhatsApp | Futuro |

---

## 9. Reglas de continuidad

Antes de comenzar una nueva sesión de desarrollo:

1. Leer este documento.
2. Consultar `ROADMAP.md` y `DECISIONS.md`.
3. Comprobar en GitHub el estado real de ramas, PR y commits.
4. No asumir que algo está en producción solo porque funciona localmente.
5. No modificar checkout, suscripciones, calculadora o WhatsApp sin autorización explícita.
6. No publicar contraseñas, tokens, variables privadas ni datos de clientes en Git.
7. Registrar cambios importantes al finalizar cada etapa.

**Este documento representa el último estado documentado, no una verificación automática en tiempo real.**
