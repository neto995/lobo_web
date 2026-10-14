# LOBO — Product & Development Roadmap

**Producto:** LOBO Digital Platform  
**Repositorio:** `neto995/lobo_web`  
**Versión del roadmap:** 1.0  
**Fecha de referencia:** Octubre 2026  
**Estado:** Propuesta inicial, sujeta a revisión

---

## 1. Visión

Construir una plataforma digital para LOBO que permita vender alimento para perros, ayudar a los clientes a tomar mejores decisiones de alimentación y administrar la relación comercial con cada cliente de manera escalable.

La plataforma debe permitir que LOBO crezca sin depender de procesos manuales para cada venta, pedido o interacción.

**Principios:**

- Experiencia de compra simple y rápida.
- No exigir registro para comprar.
- Seguridad y privacidad desde el diseño.
- Automatizar procesos repetitivos.
- Conservar el funcionamiento comercial existente.
- Priorizar funcionalidades con impacto real para clientes y operaciones.
- Evitar complejidad tecnológica innecesaria.

---

## 2. Áreas del producto

El desarrollo digital de LOBO se organiza en cinco áreas:

| Área | Propósito |
|---|---|
| Commerce | Compras únicas, checkout, planes y conversión |
| Mi Expediente | Información, seguimiento de cada perro, recordatorios automáticos de consultas veterinarias |
| Customer Management | Clientes, pedidos e historial comercial |
| Automation & AI | WhatsApp, seguimiento, marketing y recompra |
| Platform & Security | Autenticación, infraestructura, privacidad y mantenimiento |

Estas áreas pueden desarrollarse en paralelo, respetando sus dependencias técnicas.

---

## 3. Etapas de desarrollo

### Etapa 0 — Plataforma comercial existente

**Estado: En producción**

Componentes:
- Sitio web de LOBO.
- Presentación de productos y planes.
- Calculadora de alimentación.
- Integración comercial existente con Mercado Pago.
- Funcionalidades actuales de contacto y WhatsApp.

**Objetivo permanente:** preservar el funcionamiento de estos componentes durante futuros desarrollos.

No se considera terminada una integración simplemente porque el checkout redirige correctamente. Los estados de pago deben verificarse mediante mecanismos confiables cuando sea necesario.

### Etapa 1 — Identidad y seguridad

**Estado: Implementada en desarrollo; integración pendiente**

Funcionalidades:
- Registro de usuarios.
- Confirmación de correo electrónico.
- Login y logout.
- Recuperación de contraseña.
- Sesiones autenticadas.
- Protección de rutas.
- Separación de datos locales por usuario.
- Actualización y auditoría de dependencias.

**Dependencias pendientes:**
- Integrar los cambios de seguridad y autenticación.
- Revisar vulnerabilidades residuales.
- Completar requisitos de privacidad.
- Aprobar despliegue cuando corresponda.

**Referencias:**
- PR #1 — Auth V1.
- PR #2 — Seguridad.

### Etapa 2 — Mi Expediente LOBO en la nube

**Estado: Próximo desarrollo prioritario**

**Objetivo:** permitir que cada cliente cree y administre expedientes de sus perros con información persistente y privada.

Alcance:
- Diseñar la estructura de datos en Supabase PostgreSQL.
- Asociar expedientes con usuarios autenticados.
- Implementar Row Level Security.
- Guardar y recuperar expedientes desde la nube.
- Permitir crear, consultar, editar y eliminar expedientes.
- Sincronizar información entre dispositivos.
- Gestionar datos existentes de localStorage mediante una migración explícita y segura.
- Probar el aislamiento entre usuarios.

**Criterios de finalización:**
- Los datos permanecen disponibles después de cerrar sesión.
- El mismo usuario puede acceder a sus expedientes desde otro dispositivo.
- Ningún usuario puede acceder a expedientes ajenos.
- Las operaciones relevantes tienen pruebas automatizadas.
- Privacidad y permisos revisados antes de producción.

**Fuera de alcance:** cambios al checkout, automatizaciones de pedidos y rediseño comercial general.

### Etapa 3 — Customer Management y pedidos

**Estado: Planeada**

**Objetivo:** transformar cada compra en un registro comercial estructurado que LOBO pueda administrar.

Posibles funcionalidades:
- Base de datos de clientes.
- Historial de pedidos.
- Registro automático de compras.
- Estados de pago verificados.
- Estados de preparación y entrega.
- Asociación opcional de pedidos con cuentas de usuario.
- Compras como invitado.
- Historial comercial consultable.
- Identificación de clientes recurrentes.

**Dependencias:**
- Diseño del modelo de clientes y pedidos.
- Integración segura con notificaciones de Mercado Pago.
- Verificación del estado real de los pagos.
- Prevención de registros duplicados.
- Revisión de los flujos existentes de suscripciones.

**Resultado esperado:** dejar de depender de capturar manualmente cada pedido y su estado.

### Etapa 4 — WhatsApp e inteligencia artificial

**Estado: Prioridad comercial, implementación pendiente**

**Objetivo:** automatizar parte de la atención y las ventas de LOBO sin perder el control humano de la operación.

Posibles funcionalidades:
- Asistente para preguntas frecuentes.
- Recomendación de productos y planes.
- Orientación sobre mix feeding.
- Ayuda para utilizar la calculadora.
- Consulta de información comercial autorizada.
- Recordatorios de recompra.
- Seguimiento de clientes.
- Transferencia a atención humana cuando sea necesario.

**Condiciones:**
- No inventar información nutricional o veterinaria.
- Mantener mecanismos para intervención humana.
- Respetar consentimiento y privacidad.
- Evitar automatizar decisiones sensibles sin supervisión.

**Nota de prioridad:** esta etapa puede dividirse en una versión inicial de ventas, independiente de los pedidos automáticos, y una versión posterior conectada al CRM.

### Etapa 5 — Optimización de conversión y experiencia de compra

**Estado: Planeada; prioridad comercial alta**

**Objetivo:** aumentar la facilidad con la que un visitante entiende LOBO y completa su compra.

Líneas de trabajo:
- Revisar el recorrido desde la página inicial hasta la compra.
- Mejorar presentación de planes.
- Reducir fricción en checkout.
- Mejorar experiencia móvil.
- Hacer más claros los beneficios y diferencias del producto.
- Medir el comportamiento del embudo.
- Evaluar oportunidades de recompra y suscripciones.

**Regla:** cualquier modificación al checkout exige pruebas de regresión y validación del funcionamiento de Mercado Pago.

---

## 4. Prioridades actuales

| Prioridad | Iniciativa | Motivo |
|---|---|---|
| P0 | Seguridad, privacidad y correcta integración de Auth | Dependencia para habilitar cuentas reales |
| P1 | Mi Expediente con persistencia en Supabase | Objetivo de desarrollo inmediato |
| P1 | WhatsApp AI para ventas — diseño/MVP | Alto potencial de ahorro operativo |
| P1 | Optimización de compra — diagnóstico | Impacto directo en conversión |
| P2 | Base de clientes y registro automático de pedidos | Escalabilidad operativa |
| P2 | Recordatorios y automatización de recompra | Retención |
| P3 | Funcionalidades avanzadas del expediente y personalización | Evolución futura |

**Las prioridades no son una promesa de orden estricto de implementación.** Se revisarán según valor comercial, esfuerzo, riesgos y dependencias.

---

## 5. Dependencias principales

- Auth y privacidad deben estar preparadas antes de publicar expedientes asociados a usuarios.
- Los expedientes en PostgreSQL requieren RLS y pruebas de aislamiento.
- El registro automático de pedidos requiere validar notificaciones y estados reales de Mercado Pago.
- Las automatizaciones comerciales avanzadas dependen de contar con datos confiables de clientes y pedidos.
- Las mejoras de checkout no deben modificar producción sin pruebas y aprobación.

---

## 6. Reglas del desarrollo

1. Desarrollar funcionalidades en ramas separadas.
2. Usar Pull Requests para revisar integraciones importantes.
3. No considerar una función en producción hasta verificar su despliegue.
4. No mezclar correcciones de seguridad con funcionalidades nuevas innecesariamente.
5. Mantener credenciales y datos sensibles fuera de Git.
6. Registrar decisiones técnicas significativas en `DECISIONS.md`.
7. Registrar avances reales en `PROJECT_STATUS.md`.
8. Actualizar este roadmap cuando cambien prioridades o alcances.
9. Definir criterios de aceptación antes de implementar funcionalidades importantes.
10. No confundir una prueba simulada con una validación real.

---

## 7. Cómo mantener este roadmap

Este documento indica **qué queremos construir y por qué**.

Para consultar el estado real del desarrollo, utilizar `PROJECT_STATUS.md`.

Para consultar decisiones técnicas y sus fundamentos, utilizar `DECISIONS.md`.

Para procedimientos técnicos específicos, consultar los documentos especializados de `docs/`.

**Regla de continuidad:** antes de iniciar una nueva etapa, revisar los tres documentos y verificar el estado real del repositorio.

---

## 8. Próxima decisión

Definir y aprobar la arquitectura de datos de Sprint 2: Mi Expediente LOBO en Supabase PostgreSQL.

No comenzar implementación de nuevas tablas hasta revisar esquema, políticas RLS, migración de datos y pruebas previstas.
