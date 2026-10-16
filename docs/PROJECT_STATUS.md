# LOBO — Project Status

**Proyecto:** LOBO Digital Platform  
**Repositorio:** `neto995/lobo_web`  
**Última actualización:** 16 de octubre de 2026\
**Estado general:** Sprint 1 integrado en desarrollo; cierre técnico pendiente\
**Producción:** `main` — https://eatlikeawolf.mx

> Este documento es la referencia del estado actual del desarrollo digital de LOBO. Distingue entre funcionalidades en producción, implementaciones en desarrollo, pruebas realizadas y trabajo pendiente. Debe actualizarse después de cada cambio relevante.

**Referencia de integración:** `feature/expediente-v2`, commit `89573ca`. Este estado describe esa rama, no las dependencias ni la aplicación de `main` o de la rama documental `docs/sprint-tracking`. El alcance y los criterios de cierre están en [SPRINTS.md](SPRINTS.md); ROADMAP conserva la planificación de referencia, no la evidencia de los merges recientes.

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
| Autenticación con Supabase | Integrada en `feature/expediente-v2` | PR #1 fusionado; pruebas reales en Preview de seguridad aprobadas, smoke integrado pendiente; no publicada en producción |
| Seguridad de dependencias | Parches de octubre integrados | PR #2 fusionado; Next 16.4.2 / React 19.2.9; persisten avisos residuales |
| Expedientes en PostgreSQL | No implementado | Objetivo de Sprint 2 |
| Row Level Security de expedientes | No implementado | Requisito previo a usar datos reales |
| Registro automático de pedidos | No implementado | Etapa futura |
| CRM de clientes | No implementado | Etapa futura |
| IA en WhatsApp para ventas | Pendiente | No confundir con el flujo de WhatsApp existente |

**Regla:** implementado, probado e integrado a producción son estados distintos.

---

## 3. Sprint 1 — Autenticación

**Estado:** integrado en desarrollo mediante PR #1 (`89573ca`), con seguridad de PR #2 (`50bdfc1`). **Cierre técnico pendiente del smoke test de Auth sobre el Preview de la rama integrada.**

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
- Los expedientes aún no se almacenan en PostgreSQL.
- No existe sincronización de expedientes entre dispositivos.
- Los registros heredados de localStorage no se importan automáticamente.
- Separar datos locales por `user.id` no ofrece aislamiento seguro entre personas que comparten navegador.
- La autenticación todavía no está publicada en producción.

### Evidencia de validación por entorno

| Verificación | Entorno / referencia | Resultado y alcance |
|---|---|---|
| Unitarias | Local, rama de seguridad `fe6520f`, antes del merge final | 43/43; incluyen 9 de Auth y 2 de contrato de checkout con transporte simulado. |
| Integración Playwright | Local, build optimizado de la rama de seguridad, Supabase simulado | 11/11: 8 Auth + 3 regresiones comerciales. No es una ejecución sobre la rama integrada. |
| TypeScript, lint acotado y build | Mismo estado local de seguridad | Correctos; lint global fallido, detallado abajo. |
| Auth con servicios reales | Preview de `fix/security-dependencies`; éxito confirmado por el propietario | Registro, confirmación de correo, login, acceso protegido, logout, recuperación y nuevo login con Supabase/Resend. No se atribuye esta prueba al merge final. |
| Build del Preview integrado | `feature/expediente-v2`, `89573ca` | Vercel informa `success`; compilación confirmada, no validación funcional completa. |
| Smoke test final de Auth | Preview exacto de `89573ca` | **Pendiente. No ejecutado/verificado en esta actualización.** |

Las pruebas locales de seguridad también cubrieron sesiones SSR, cookies, CSRF, redirecciones, aislamiento local entre cuentas y conservación de legacy; las comerciales comprobaron rutas públicas sin login, calculadora, imágenes y contratos del checkout. No incluyeron pagos reales ni una compra completa de sandbox. Las comprobaciones de cookies/cache locales no se convierten automáticamente en evidencia del Preview integrado.

El antiguo total de 53 unitarias incluía 10 pruebas de la rama independiente de sandbox; **43 es el total documentado para el estado de seguridad integrado**. No se repitieron las suites después del merge final en esta tarea documental.

**Para cerrar:** ejecutar el smoke test en el Preview que corresponda exactamente a `89573ca` (o identificar el nuevo commit si cambia la rama), registrar URL/commit y resultados, y confirmar la aceptación de riesgos pendientes. Incluir registro, confirmación, login, acceso autenticado y rechazo anónimo a `/mi-expediente`, logout, recuperación y nuevo login. Un build exitoso no permite marcar estas pruebas como aprobadas.

**Referencias:** [PR #1 fusionado](https://github.com/neto995/lobo_web/pull/1), [commit integrado](https://github.com/neto995/lobo_web/commit/89573cad2eb18a8be0ff33c3df7d1af5e4c71b02), [Preview integrado: estado de Vercel](https://vercel.com/neto995-s-projects/lobo-web/HGgFLek7s9Yyc9JojRHWDYeYqZ2v).

---

## 4. Seguridad de dependencias

**Estado:** remediación del anuncio del 14 de octubre integrada mediante PR #2 y posteriormente PR #1; seguimiento residual abierto, sin auditoría limpia ni autorización de producción.

| Paquete | Versión integrada verificada en el lockfile de `89573ca` |
|---|---|
| `next` / `eslint-config-next` | 16.4.2 / 16.4.2 |
| `react` / `react-dom` | 19.2.9 / 19.2.9 |
| `sharp` | 0.35.5 |
| `mercadopago` / `uuid` | 2.12.1 / 9.0.1, sin actualización del SDK |

Los avisos de Next.js/React del 14 de octubre se revisaron y los parches quedaron registrados en `fe6520f`, ancestro del merge integrado. La actualización del framework cubre sus copias de React Server Components; actualizar solamente `react` no habría sido suficiente. No se declara que estos cambios estén publicados en producción.

### Auditorías y avisos residuales

Última ejecución documentada: **15 de octubre de 2026, rama de seguridad**, antes del merge final. Se verificaron los reportes conservados en la rama integrada; no se ejecutó una nueva auditoría en esta tarea.

| Auditoría | Resultado documentado |
|---|---|
| Completa | 7 paquetes afectados: 5 high, 2 moderate, 0 critical; salida 1 |
| Solo producción (`--omit=dev`) | 2 moderate, 0 high, 0 critical; salida 1 |

Son **2 advisories independientes**, con severidad propagada a sus dependencias padre:

| Advisory / cadena | Aplicabilidad y pendiente |
|---|---|
| `braces` 3.0.3, GHSA-vfj7-8cjw-p6xm (high) | Cadena de desarrollo: `eslint-config-next` → `@next/eslint-plugin-next` → `fast-glob` → `micromatch` → `braces` (5 paquetes). Agotamiento de pila con patrones anidados no confiables; riesgo de tooling/CI, no una entrada pública identificada en LOBO. Sin parche publicado en la última revisión; mantener CI no confiable aislado y sin secretos, y revisar upstream antes de actualizar. No corregido. |
| `uuid` 9.0.1, GHSA-w5hq-g745-h8pq (moderate) | Cadena runtime `mercadopago` → `uuid` (2 paquetes). El escenario vulnerable usa v3/v5/v6 con buffers; el SDK observado usa `v4()` sin argumentos. Menor exposición observada no significa remediación. Parche 11.1.1 fuera del rango del SDK; override o cambio mayor de Mercado Pago requieren autorización, revisión de compatibilidad y sandbox. No corregido. |

**Límite de la auditoría:** npm no reportó los nuevos avisos de Next ni siquiera con la versión anterior 16.4.0. Por eso el conteo de cero critical no demuestra ausencia de fallos críticos; la evidencia de remediación incluye advisories oficiales y versiones corregidas. Los reportes completos y de producción siguen fallando por los avisos anteriores, sin supresiones.

**Lint global:** conserva 2 errores preexistentes `@typescript-eslint/no-explicit-any` en `app/api/whatsapp/webhook/route.ts:96-97`. El lint acotado a Auth y tests pasó; eso no resuelve el lint global. WhatsApp permanece sin cambios.

**Evidencia histórica versionada:** [reporte de seguridad del estado integrado](https://github.com/neto995/lobo_web/blob/89573cad2eb18a8be0ff33c3df7d1af5e4c71b02/docs/security-dependencies.md), [auditoría completa](https://github.com/neto995/lobo_web/blob/89573cad2eb18a8be0ff33c3df7d1af5e4c71b02/docs/security/audit-oct14-after-full.json), [auditoría de producción](https://github.com/neto995/lobo_web/blob/89573cad2eb18a8be0ff33c3df7d1af5e4c71b02/docs/security/audit-oct14-after-production.json), [PR #2 fusionado](https://github.com/neto995/lobo_web/pull/2). El reporte técnico conserva el contexto previo al merge; los merges y las pruebas reales posteriores se actualizan aquí, sin atribuirle pruebas que no ejecutó.

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
| `feature/expediente-v2` | Desarrollo integrado de Mi Expediente, Auth y seguridad; `89573ca` |
| `feature/auth-v1` | Auth con PR #2 integrado; `50bdfc1`; PR #1 ya fusionado |
| `fix/security-dependencies` | Parches y pruebas de seguridad integrados mediante PR #2; `fe6520f` |
| `chore/mercadopago-sandbox` | Herramientas aisladas de pruebas |
| `docs/project-foundation` | Documentación y continuidad del proyecto |
| `docs/sprint-tracking` | Seguimiento documental; PR #4 abierto como borrador hacia `main`, sin merge |

**Integración realizada y verificada en GitHub:**

1. [PR #2](https://github.com/neto995/lobo_web/pull/2) fusionado hacia `feature/auth-v1`: merge `50bdfc1`.
2. [PR #1](https://github.com/neto995/lobo_web/pull/1) fusionado hacia `feature/expediente-v2`: merge `89573ca`.
3. Preview de `89573ca` con estado Vercel `success`. **Smoke test final de Auth pendiente** antes de cerrar Sprint 1 y preparar la implementación de Sprint 2.

El cambio independiente del aviso de privacidad (`3d54f86`) está incluido en `feature/expediente-v2`: el marcador de domicilio fue sustituido. No equivale a una revisión integral de privacidad ni a un despliegue productivo.

**Despliegues:** Vercel usa `main` como rama de producción. Las ramas de desarrollo examinadas generan despliegues Preview. No desplegar cambios productivos sin autorización.

Esta actualización modifica únicamente documentación en [PR #4](https://github.com/neto995/lobo_web/pull/4). No ejecuta merges, despliegues ni cambios de configuración; no se verificó nuevamente producción ni se trasladaron los cambios de aplicación a esta rama documental.

---

## 7. Siguiente objetivo — Sprint 2

**Mi Expediente LOBO: persistencia en Supabase PostgreSQL.**

Objetivo: permitir que un cliente registre y administre los expedientes de sus perros y encuentre la misma información al iniciar sesión desde diferentes dispositivos.

Alcance por diseñar:
- Esquema de datos de perros y expedientes.
- Relación de cada expediente con su propietario autenticado.
- Políticas Row Level Security (RLS).
- Creación, consulta, edición y eliminación de registros.
- Adaptación del repositorio de datos existente.
- Tratamiento seguro de datos heredados de localStorage.
- Pruebas de aislamiento entre cuentas.
- Pruebas de persistencia entre dispositivos.

**Estado:** planificado, no iniciado. Diseño pendiente de aprobación; no hay esquema, migraciones ni políticas RLS de expedientes aprobados o implementados por este sprint. No se fija una fecha de inicio. Primero completar el cierre técnico de Sprint 1; consultar los criterios propuestos en [SPRINTS.md](SPRINTS.md).

---

## 8. Riesgos y pendientes relevantes

| Pendiente | Prioridad |
|---|---|
| Ejecutar y registrar el smoke test de Auth del Preview integrado (`89573ca`) | Alta; bloquea el cierre técnico de Sprint 1 |
| Dar seguimiento a `braces` y Mercado Pago/`uuid`; confirmar aceptación de riesgos pendientes al cerrar | Alta; no declarar auditoría limpia |
| Definir esquema PostgreSQL y políticas RLS | Alta |
| Revisar privacidad y requisitos de publicación; domicilio ya completado en desarrollo | Alta, antes de publicar funcionalidades que traten datos personales |
| Mantener pruebas de checkout para cambios futuros | Media |
| Resolver lint global preexistente de WhatsApp | Media |
| Implementar registro automático de pedidos | Futuro |
| Implementar automatización comercial de WhatsApp | Futuro |

---

## 9. Reglas de continuidad

Antes de comenzar una nueva sesión de desarrollo:

1. Leer este documento.
2. Consultar [SPRINTS.md](SPRINTS.md), `ROADMAP.md` y `DECISIONS.md`.
3. Comprobar en GitHub el estado real de ramas, PR y commits.
4. No asumir que algo está en producción solo porque funciona localmente.
5. No modificar checkout, suscripciones, calculadora o WhatsApp sin autorización explícita.
6. No publicar contraseñas, tokens, variables privadas ni datos de clientes en Git.
7. Registrar cambios importantes al finalizar cada etapa.

**Este documento representa el último estado documentado, no una verificación automática en tiempo real.**
