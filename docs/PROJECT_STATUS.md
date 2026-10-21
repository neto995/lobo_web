# LOBO — Project Status

**Proyecto:** LOBO Digital Platform  
**Repositorio:** `neto995/lobo_web`  
**Última actualización:** 21 de octubre de 2026
**Estado general:** Desarrollo activo  
**Producción:** `main` — https://eatlikeawolf.mx

> Este documento es la referencia del estado actual del desarrollo digital de LOBO. Distingue entre funcionalidades en producción, implementaciones en desarrollo, pruebas realizadas y trabajo pendiente. Debe actualizarse después de cada cambio relevante.

**Preparación de Preview Sprint 2A:** persistencia aprobada en `609e97f`; protección
comercial adicional validada localmente (63 unitarias y 23 pruebas Playwright en
dev, repetidas 23/23 en build optimizado). Mercado Pago restringido en Vercel a
Production para futuros despliegues; pagos bloqueados en código fuera de ese
entorno. Publicación controlada autorizada: primer Preview sin Auth, configuración
posterior exclusiva de la rama con `lobo-dev` y nueva validación remota pendiente.
No hay autorización de producción ni migraciones remotas. Evidencia y límites en
[Sprint 2A Persistence](sprint2a-persistence.md#aislamiento-comercial-autorizado-21-de-octubre-de-2026).

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
| Expedientes en PostgreSQL | Perfiles y pesos implementados en rama local | Sprint 2A, revisión y migraciones remotas pendientes |
| Row Level Security de expedientes | Esquema y 16 políticas integrados mediante PR #5 | Verificación local real; no aplicado a producción |
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
- La continuación Sprint 2A permite persistencia de perfiles y pesos; se ha probado
  en Supabase local, sin aplicar migraciones a proyectos remotos.
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
| `feature/sprint2a-persistence` | Integración local de perfiles y pesos, sin commit ni PR todavía |

**Integración verificada:** PR #2 y PR #1 integrados con los commits indicados
arriba; PR #5 (esquema/RLS) integrado en `feature/expediente-v2` mediante
`3362f92aa0e9c713901c82dad28fa96e764d21ee`, base de la rama actual.
Próximo paso: revisar el diff de persistencia antes de autorizar commit, push o PR.
El destino futuro será `feature/expediente-v2`, nunca `main`.

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

**Estado:** implementado en `feature/sprint2a-persistence`, pendiente de revisión.
Esquema, RPC e integración se aplicaron/probaron solo en Supabase local desechable.
Sin Storage, cartilla, IA, importación o borrado de perfiles. Sin commit, push, PR,
migraciones remotas o despliegues en esta tarea. Evidencia reproducible, incidencias
y verificaciones pendientes en [el informe de la entrega](sprint2a-persistence.md).

---

## 8. Riesgos y pendientes relevantes

| Pendiente | Prioridad |
|---|---|
| Dar seguimiento a los avisos residuales de dependencias | Alta |
| Revisar el diff de persistencia antes de commit y PR | Alta |
| Autorizar por separado migraciones y validación remota de desarrollo | Alta |
| Revisar el aviso de privacidad y completar información pendiente | Alta, antes de publicar funcionalidades que traten datos personales |
| Mantener pruebas de checkout para cambios futuros | Media |
| Resolver lint global preexistente de WhatsApp | Media |
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
