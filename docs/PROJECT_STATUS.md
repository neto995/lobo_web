# LOBO — Project Status

**Proyecto:** LOBO Digital Platform  
**Repositorio:** `neto995/lobo_web`  
**Última actualización:** 13 de octubre de 2026  
**Estado general:** Desarrollo activo  
**Producción:** `main` — https://eatlikeawolf.mx

> Este documento es la referencia del estado actual del desarrollo digital de LOBO. Distingue entre funcionalidades en producción, implementaciones en desarrollo, pruebas realizadas y trabajo pendiente. Debe actualizarse después de cada cambio relevante.

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
| Autenticación con Supabase | Implementada y probada en desarrollo | PR #1; no integrada a producción |
| Seguridad de dependencias | Correcciones en desarrollo | PR #2; vulnerabilidades residuales pendientes |
| Expedientes en PostgreSQL | No implementado | Objetivo de Sprint 2 |
| Row Level Security de expedientes | No implementado | Requisito previo a usar datos reales |
| Registro automático de pedidos | No implementado | Etapa futura |
| CRM de clientes | No implementado | Etapa futura |
| IA en WhatsApp para ventas | Pendiente | No confundir con el flujo de WhatsApp existente |

**Regla:** implementado, probado e integrado a producción son estados distintos.

---

## 3. Sprint 1 — Autenticación

**Estado:** funcional en desarrollo, pendiente de integración.

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
- La autenticación todavía no está publicada en producción.

**Referencia:** [PR #1 — Auth V1](https://github.com/neto995/lobo_web/pull/1)

---

## 4. Seguridad de dependencias

**Estado:** correcciones implementadas, pendientes de integración y seguimiento.

- Rama: `fix/security-dependencies`.
- Actualización de Next.js a 16.4.0 en desarrollo.
- Pruebas de regresión realizadas.
- Auditoría de dependencias documentada.
- Persisten vulnerabilidades residuales que requieren seguimiento.
- Revisar el anuncio de seguridad de Next.js del 14 de octubre de 2026 antes de cerrar la integración.

**Última verificación comunicada por Codex:**
- 53/53 pruebas unitarias.
- 11/11 pruebas Playwright con Supabase simulado.
- TypeScript y build correctos.
- Lint de archivos afectados correcto.
- Dos errores globales de lint preexistentes en WhatsApp.

Estas pruebas corresponden al estado reportado durante la preparación del sandbox. Deben repetirse cuando cambien las ramas integradas.

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

**Integración propuesta:**

1. Revisar parches y riesgos de seguridad.
2. Integrar PR #2 hacia `feature/auth-v1`.
3. Repetir las pruebas de autenticación.
4. Integrar PR #1 hacia `feature/expediente-v2`.
5. Preparar la rama de Sprint 2.

Estos pasos son una propuesta, no integraciones realizadas.

**Despliegues:** Vercel usa `main` como rama de producción. Las ramas de desarrollo examinadas generan despliegues Preview. No desplegar cambios productivos sin autorización.

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

**Estado:** diseño pendiente de aprobación. No hay tablas de expedientes creadas como parte de este sprint.

---

## 8. Riesgos y pendientes relevantes

| Pendiente | Prioridad |
|---|---|
| Revisar nueva actualización de seguridad de Next.js | Alta |
| Integrar PR #2 y posteriormente PR #1 | Alta |
| Definir esquema PostgreSQL y políticas RLS | Alta |
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
