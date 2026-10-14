# LOBO — Decision Log

**Proyecto:** LOBO Digital Platform  
**Repositorio:** `neto995/lobo_web`  
**Versión:** 1.0  
**Fecha de referencia:** Octubre 2026

---

## 1. Propósito

Este documento conserva las decisiones relevantes para el desarrollo del producto digital LOBO.

Su objetivo es evitar que futuras implementaciones, cambios de agente o nuevas conversaciones pierdan el razonamiento detrás de la arquitectura, las prioridades y las restricciones del proyecto.

No sustituye al código ni a la documentación técnica detallada.

**Estados de decisión:**

- **Adoptada:** decisión que guía el trabajo actual.
- **Propuesta:** opción planteada que todavía requiere aprobación.
- **Sustituida:** decisión reemplazada por otra; se conserva su historial.

Las decisiones adoptadas no implican necesariamente que su implementación esté terminada ni publicada en producción.

---

## DEC-001 — GitHub como fuente principal del desarrollo

**Estado:** Adoptada  
**Área:** Documentación y gestión del proyecto

### Contexto
El proyecto acumula múltiples ramas, Pull Requests, implementaciones, pruebas y decisiones tomadas a través de conversaciones con IA.

Depender exclusivamente del contexto de ChatGPT o Codex representa un riesgo de pérdida de conocimiento.

### Decisión
Utilizar GitHub como fuente principal de documentación y seguimiento técnico del producto digital LOBO.

Mantener inicialmente:
- `README.md`: introducción y navegación.
- `AGENTS.md`: instrucciones para agentes de desarrollo.
- `docs/ROADMAP.md`: dirección y prioridades.
- `docs/PROJECT_STATUS.md`: estado real.
- `docs/DECISIONS.md`: decisiones y fundamentos.

Conservar la documentación técnica especializada existente.

### Motivo
La documentación versionada junto al código permite consultar su historial y facilita la continuidad entre desarrolladores, agentes y conversaciones.

### Consecuencias
- Los cambios relevantes deberán reflejarse en la documentación correspondiente.
- No se implementarán GitHub Projects ni herramientas adicionales de gestión por ahora.
- Los documentos no reemplazan la verificación del estado real del repositorio.

---

## DEC-002 — Desarrollo mediante ramas y Pull Requests

**Estado:** Adoptada  
**Área:** Git y despliegues

### Contexto
LOBO tiene un sitio comercial activo y diferentes funcionalidades en desarrollo.

### Decisión
Desarrollar cambios relevantes en ramas separadas y revisar su integración mediante Pull Requests.

Mantener `main` como rama de producción.

Los merges a otras ramas de desarrollo no equivalen a publicar en producción.

### Motivo
Separar cambios permite revisar, probar y corregir funcionalidades antes de afectar el sitio comercial.

### Consecuencias
- Evitar commits directos a `main` durante el desarrollo habitual.
- Revisar rama de origen y destino antes de cada merge.
- Verificar pruebas y despliegues antes de publicar.
- Los cambios productivos requieren autorización explícita.

---

## DEC-003 — Supabase como plataforma de autenticación

**Estado:** Adoptada  
**Área:** Identidad y seguridad

### Contexto
Mi Expediente necesita identificar a los usuarios y separar su información de la de otras cuentas.

### Decisión
Utilizar Supabase Auth para la primera versión de autenticación, integrado con Next.js.

El alcance de Auth V1 incluye:
- Registro con correo y contraseña.
- Confirmación de correo.
- Inicio y cierre de sesión.
- Recuperación de contraseña.
- Sesiones del lado del servidor.
- Protección de rutas privadas.

Utilizar Resend para el envío de correos de autenticación en la configuración de desarrollo.

### Motivo
Aprovechar un servicio de autenticación existente en lugar de implementar internamente el manejo de contraseñas y sesiones.

### Consecuencias
- Mantener las claves privadas fuera del repositorio.
- Validar correctamente sesiones y acceso a recursos.
- Distinguir autenticación de autorización sobre los datos.
- No habilitar Auth V1 en producción hasta completar los requisitos correspondientes.

**Referencia:** PR #1 — Auth V1.

---

## DEC-004 — Aislamiento de datos heredados de Mi Expediente

**Estado:** Adoptada para Auth V1  
**Área:** Privacidad y expedientes

### Contexto
La implementación inicial de Mi Expediente utiliza almacenamiento local del navegador.

La autenticación introduce identidades de usuario que antes no existían.

### Decisión
Separar los datos locales por usuario autenticado y no importar automáticamente los registros heredados.

### Motivo
No existe una forma confiable de determinar automáticamente la propiedad de todos los registros creados antes de la autenticación.

### Consecuencias
- Los datos heredados requieren un proceso de migración explícito.
- No se deben asignar expedientes antiguos a una cuenta únicamente porque alguien inició sesión en ese navegador.
- La estrategia definitiva de migración se diseñará durante Sprint 2.

---

## DEC-005 — PostgreSQL y RLS para expedientes persistentes

**Estado:** Dirección de producto adoptada; diseño técnico pendiente  
**Área:** Base de datos y privacidad

### Contexto
El almacenamiento local no permite que un usuario consulte sus expedientes de manera consistente desde diferentes dispositivos.

### Decisión
Desarrollar la persistencia de Mi Expediente mediante Supabase PostgreSQL.

Exigir Row Level Security (RLS) y pruebas de aislamiento entre usuarios antes de publicar datos privados.

### Motivo
Necesitamos persistencia centralizada y mecanismos de autorización que impidan el acceso a expedientes ajenos.

### Consecuencias
- El modelo de datos y las políticas SQL requieren aprobación.
- Las operaciones de crear, consultar, editar y eliminar deben respetar la propiedad de cada registro.
- Deben probarse intentos de acceso entre cuentas diferentes.
- Todavía no están aprobadas las tablas concretas ni las reglas SQL.

**Referencia:** Etapa 2 del ROADMAP.

---

## DEC-006 — Proteger el checkout existente

**Estado:** Adoptada  
**Área:** Commerce

### Contexto
LOBO ya cuenta con un flujo comercial funcional mediante Mercado Pago.

Las nuevas funcionalidades no deben interrumpir las compras existentes.

### Decisión
No modificar checkout, calculadora, planes, suscripciones ni flujos comerciales existentes como efecto secundario de otros desarrollos.

Todo cambio relacionado con pagos deberá incluir pruebas de regresión.

### Motivo
Proteger la continuidad de ventas y reducir el riesgo de errores en pagos.

### Consecuencias
- No utilizar una página de retorno como única confirmación de un pago.
- Verificar los estados de pago desde una fuente confiable cuando implementemos pedidos automáticos.
- Separar pruebas de sandbox de transacciones productivas.
- Solicitar autorización antes de modificar componentes comerciales.

---

## DEC-007 — Preservar y pausar Mercado Pago Sandbox

**Estado:** Adoptada  
**Área:** Pruebas e integraciones

### Contexto
Durante la actualización de dependencias se prepararon herramientas de prueba para Mercado Pago.

Las verificaciones de aislamiento, identidad del vendedor y rutas temporales fueron satisfactorias, pero la prueba completa de pagos no se ejecutó.

### Decisión
Conservar el trabajo de sandbox en una rama separada y pausar las pruebas adicionales para priorizar Mi Expediente.

**Referencia:** `chore/mercadopago-sandbox`, commit `8561926`.

### Motivo
La preparación realizada es reutilizable, pero completar la integración de webhooks no es una dependencia inmediata de la persistencia de expedientes.

### Consecuencias
- Mantener los secretos de prueba fuera de Git.
- No considerar validado un ciclo completo de compra de sandbox.
- Retomar las pruebas cuando se modifique el checkout o se implemente el registro automático de pedidos.
- No mezclar este trabajo con el PR de actualización de dependencias.

---

## DEC-008 — Compras sin registro obligatorio

**Estado:** Adoptada como principio de producto  
**Área:** Experiencia de compra

### Contexto
Obligar a crear una cuenta antes de comprar introduce pasos adicionales en el recorrido del cliente.

### Decisión
Mantener la compra como invitado como principio de diseño.

Mi Expediente puede requerir autenticación sin convertirla en un requisito para comprar LOBO.

### Motivo
Priorizar una experiencia de compra sencilla y reducir fricción innecesaria.

### Consecuencias
- Las cuentas y los pedidos no deben asumir que todo comprador está registrado.
- Una futura asociación entre compras y cuentas requerirá verificación de identidad.
- El modelo definitivo de clientes y pedidos queda pendiente de diseño.

---

## DEC-009 — Planificación progresiva del desarrollo

**Estado:** Adoptada  
**Área:** Metodología

### Contexto
LOBO tiene múltiples iniciativas de producto, pero algunos requisitos todavía se descubrirán durante la implementación.

### Decisión
Utilizar planificación progresiva (*Rolling Wave Planning*).

- El roadmap representa la visión de largo plazo.
- Los próximos entregables tendrán objetivos y dependencias preliminares.
- El trabajo inmediato se detallará antes de implementarlo.
- Las prioridades podrán revisarse a partir de nuevos aprendizajes.

### Motivo
Mantener dirección estratégica sin crear calendarios o compromisos artificiales.

### Consecuencias
- No diseñar todos los sprints futuros con detalle.
- Mantener visibles las ideas futuras.
- Revisar alcance y prioridades periódicamente.
- Distinguir las etapas del producto de los ciclos de implementación.

---

## DEC-010 — Customer Journey antes de decisiones técnicas adicionales

**Estado:** Adoptada como criterio de diseño  
**Área:** Producto y experiencia del cliente

### Contexto
Varias funcionalidades futuras están relacionadas: compra, calculadora, Mi Expediente, WhatsApp, recordatorios y recompra.

Diseñarlas por separado puede producir una experiencia fragmentada.

### Decisión
Documentar el recorrido actual y deseado del cliente antes de cerrar la arquitectura de nuevas integraciones importantes.

Crear posteriormente `docs/CUSTOMER_JOURNEY.md`.
**Diseño en progreso:** [Customer Journey — tldraw](https://www.tldraw.com/f/M5zMvj-gX-s0_qgB1iQZY)

### Motivo
Comprender primero qué necesita el cliente y cómo se conectan las funcionalidades.

### Consecuencias
- Distinguir experiencia actual de experiencia futura.
- Registrar ideas sin convertirlas automáticamente en tareas urgentes.
- Usar el Customer Journey como entrada para decisiones de arquitectura y prioridades.
- No asumir que una experiencia deseada ya está implementada.

---

## 2. Decisiones pendientes

| ID | Tema | Qué falta resolver |
|---|---|---|
| P-001 | Modelo de expedientes | Tablas, relaciones y campos de PostgreSQL |
| P-002 | RLS | Políticas concretas y pruebas de autorización |
| P-003 | Migración de localStorage | Proceso explícito y seguro para datos anteriores |
| P-004 | Arquitectura comercial | Modelo de clientes, pedidos, pagos y suscripciones |
| P-005 | WhatsApp AI | Alcance del MVP, proveedor, controles y transferencia humana |
| P-006 | Customer Journey | Recorrido actual, experiencia deseada y oportunidades |
| P-007 | Recordatorios veterinarios | Datos, consentimiento, canales y comportamiento |
| P-008 | Producción | Requisitos de privacidad, seguridad y despliegue de Auth y expedientes |

Estas entradas son decisiones futuras, no implementaciones autorizadas.

---

## 3. Cómo registrar nuevas decisiones

Cuando se tome una decisión relevante, añadir una entrada con:

**ID y título:** DEC-XXX — Nombre breve  
**Estado:** Adoptada / Propuesta / Sustituida  
**Área:** Componente relacionado

**Contexto:** ¿Qué problema queremos resolver?

**Decisión:** ¿Qué elegimos?

**Motivo:** ¿Por qué lo elegimos?

**Consecuencias:** ¿Qué implica, qué limita y qué trabajo genera?

**Referencias:** PR, documentación o evidencia, si existen.

Una decisión sustituida no debe borrarse: debe identificarse cuál la reemplazó y por qué.

---

## 4. Regla de continuidad

Antes de implementar algo que contradiga una decisión adoptada:

1. Identificar la decisión afectada.
2. Explicar por qué debería cambiarse.
3. Evaluar el impacto sobre funcionalidades existentes.
4. Solicitar aprobación.
5. Registrar la nueva decisión y su relación con la anterior.

**Este documento conserva decisiones y criterios, no sustituye la revisión del código ni verifica automáticamente el estado de producción.**
