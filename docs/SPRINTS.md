# LOBO — Sprints de desarrollo

**Proyecto:** LOBO Digital Platform  
**Repositorio:** `neto995/lobo_web`  
**Actualizado:** 16 de octubre de 2026\
**Planificación:** progresiva (*Rolling Wave Planning*)

## 1. Propósito

Este archivo organiza los entregables de desarrollo por sprint y los relaciona con las etapas del producto. No sustituye:

- [`ROADMAP.md`](ROADMAP.md): visión y etapas del producto.
- [`PROJECT_STATUS.md`](PROJECT_STATUS.md): estado general y evidencia de avances.
- [`DECISIONS.md`](DECISIONS.md): decisiones aprobadas y su fundamento.

**Etapa** = objetivo amplio del producto. **Sprint** = bloque de trabajo con alcance y criterios de aceptación concretos. Una etapa puede ocupar varios sprints; la numeración de etapas no determina la de sprints.

## 2. Resumen de sprints

| Sprint | Etapa relacionada | Entregable principal | Estado documentado |
|---|---|---|---|
| 1 — Auth V1 | Etapa 1: Identidad y seguridad | Autenticación y protección de acceso a Mi Expediente | Integrado en desarrollo; smoke test final de la rama integrada pendiente, sin cierre técnico ni publicación |
| 2 — Expedientes en la nube | Etapa 2: Mi Expediente en la nube | Persistencia privada de expedientes en Supabase | Diseño pendiente; implementación no iniciada |
| 3 en adelante | Por asignar según prioridades | Se define al planificar cada sprint | No planificado |

> Los estados se basan en la última documentación disponible. Antes de trabajar, verificar ramas, commits, PR y pruebas en GitHub. Que un sprint esté técnicamente cerrado no implica que esté publicado en producción.

## 3. Sprint 1 — Autenticación (Auth V1)

**Objetivo:** permitir que una persona cree una cuenta, confirme su correo, inicie y cierre sesión, recupere su contraseña y acceda únicamente a sus rutas privadas de Mi Expediente.

**Estado:** Auth V1 y la remediación de seguridad están integrados en `feature/expediente-v2` en el commit `89573ca`. El Preview integrado compiló correctamente. **Sprint 1 aún no está técnicamente cerrado y Auth no está publicado en producción.**

**Implementado y validado antes del merge final:**

- Registro, confirmación por correo, login, logout y recuperación de contraseña.
- Sesiones del lado del servidor y protección de rutas.
- Separación de datos locales (`localStorage`) por usuario autenticado, sin importar automáticamente registros anteriores.

La separación local no ofrece aislamiento seguro entre personas que comparten navegador. Los expedientes siguen guardados únicamente en ese navegador, sin PostgreSQL, RLS ni sincronización entre dispositivos.

### Integración y evidencia

| Hito | Rama / entorno comprobado | Resultado y límite |
|---|---|---|
| Remediación de octubre | `fix/security-dependencies`, `fe6520f` | Next.js y eslint-config-next 16.4.2; React y React DOM 19.2.9. Persisten avisos residuales. |
| Pruebas automatizadas previas al merge final | Rama de seguridad, local; Supabase simulado en integración | 43/43 unitarias y 11/11 de integración (8 Auth + 3 comerciales); TypeScript, lint acotado y build correctos. No son una ejecución sobre `89573ca`. |
| Auth con Supabase/Resend reales | Preview de la rama de seguridad, confirmado por el propietario | Registro, confirmación de correo, login, acceso protegido, logout, recuperación y nuevo login aprobados. No equivale a probar el Preview integrado. |
| [PR #2](https://github.com/neto995/lobo_web/pull/2) | `fix/security-dependencies` → `feature/auth-v1` | Fusionado, merge `50bdfc1`. |
| [PR #1](https://github.com/neto995/lobo_web/pull/1) | `feature/auth-v1` → `feature/expediente-v2` | Fusionado, merge `89573ca`, que incluye los parches. |
| Preview integrado | `feature/expediente-v2`, `89573ca` | Build exitoso en Vercel; no prueba por sí solo los flujos de Auth. |
| Aviso de privacidad | `feature/expediente-v2` | Marcador de domicilio sustituido; no equivale a aprobación integral de privacidad ni a publicación. |
| Smoke test final de Auth | Preview del commit integrado `89573ca` | **Pendiente; no verificado.** |

Fuentes, enlaces al commit/Preview y detalle de pruebas y riesgos: [`PROJECT_STATUS.md`](PROJECT_STATUS.md). Esta actualización registra evidencia previa y verifica Git/estado de Vercel; no ejecuta nuevas pruebas de aplicación.

### Checklist de cierre técnico

- [x] Integrar PR #2 hacia `feature/auth-v1` y PR #1 hacia `feature/expediente-v2`.
- [x] Documentar versiones corregidas, pruebas previas al merge y vulnerabilidades residuales.
- [x] Confirmar build exitoso del Preview integrado y la sustitución del marcador de domicilio.
- [ ] Ejecutar y registrar el smoke test sobre el Preview exacto de `feature/expediente-v2`: registro, confirmación de correo, login, acceso protegido, logout, recuperación y nuevo login; comprobar también rechazo del acceso anónimo a `/mi-expediente`.
- [ ] Registrar URL/commit probado, resultados y cualquier incidencia del smoke test, y confirmar la aceptación de los riesgos documentados antes de marcar el cierre técnico.

**Riesgos abiertos:** última auditoría documentada: 7 paquetes afectados por 2 advisories (5 high de la cadena de desarrollo de `braces`, 2 moderate de Mercado Pago/`uuid` en runtime). La auditoría solo de producción mantiene 2 moderate; ambas fallan por avisos pendientes. El lint global conserva 2 errores preexistentes `no-explicit-any` en WhatsApp. Ninguno se declara resuelto; consultar el detalle y las limitaciones de la auditoría en `PROJECT_STATUS.md`.

**Criterio de cierre técnico:** los flujos de autenticación funcionan en la rama integrada, con pruebas y riesgos documentados y aprobados. **La publicación en producción es una decisión independiente**, sujeta a seguridad, privacidad y autorización explícita.

**Fuera de alcance:** almacenamiento de expedientes en PostgreSQL, sincronización entre dispositivos y cambios al checkout.

## 4. Sprint 2 — Mi Expediente en Supabase PostgreSQL

**Objetivo:** que una persona autenticada pueda crear y gestionar expedientes de sus perros, conservarlos en la nube y consultarlos desde diferentes dispositivos sin acceder a datos ajenos.

**Estado:** planificado, no iniciado; diseño pendiente de aprobación. No hay esquema, migraciones ni políticas RLS de expedientes aprobados o implementados por este sprint. No se fija una fecha de inicio.

**Alcance propuesto:**

- Diseñar el modelo de datos y la relación entre usuario y expediente/perro.
- Definir e implementar políticas Row Level Security (RLS).
- Crear, consultar, editar y eliminar expedientes (CRUD).
- Conectar la interfaz existente con almacenamiento persistente.
- Tratar los registros anteriores de `localStorage` mediante una opción explícita y segura; **no asignarlos automáticamente** a una cuenta.
- Implementar pruebas de autorización y persistencia.

**Criterios de aceptación propuestos:**

- [ ] Un usuario puede crear, consultar, actualizar y eliminar sus expedientes.
- [ ] Sus datos persisten tras cerrar e iniciar sesión y se consultan desde otro dispositivo.
- [ ] Un segundo usuario no puede leer ni modificar expedientes ajenos, incluso intentando acceder directamente por identificador.
- [ ] Las políticas RLS y los casos principales están probados; los resultados están documentados.
- [ ] La migración de datos locales requiere acción y confirmación del propietario, sin sobrescrituras silenciosas.
- [ ] No se alteraron checkout, calculadora, planes ni flujos comerciales.

**Antes de programar:** revisar y aprobar esquema PostgreSQL, políticas RLS, estrategia de migración y plan de pruebas. Estas decisiones están pendientes en `DECISIONS.md`.

**Fuera de alcance:** CRM, registro automático de pedidos, automatización de WhatsApp, rediseño comercial y publicación sin revisión de privacidad.

## 5. Próximos sprints (sin comprometer números ni fechas)

Las iniciativas futuras viven en `ROADMAP.md`: clientes y pedidos, WhatsApp con IA, conversión, recompra y funcionalidades avanzadas de Mi Expediente. Su orden se decidirá considerando impacto comercial, complejidad, dependencias y recursos.

No asignar Sprint 3, 4, etc. ni prometer fechas hasta definir alcance y criterios de aceptación del siguiente trabajo.

## 6. Cómo abrir y cerrar un sprint

Al **abrir** un sprint, registrar: objetivo, etapa relacionada, alcance, exclusiones, dependencias, criterios de aceptación y rama/PR previstos.

Al **cerrarlo**, verificar: funcionalidad implementada, pruebas ejecutadas y resultados, riesgos pendientes, PR integrados donde corresponda y actualización de `PROJECT_STATUS.md` y `DECISIONS.md` cuando aplique.

Distinguir siempre estos hitos:

1. **Desarrollo terminado:** existe una implementación.
2. **Cierre técnico:** cumple los criterios y pruebas aprobados en la rama correspondiente.
3. **Producción:** se autorizó el merge/despliegue aplicable y se verificó en el sitio real.

**Regla de continuidad:** documentar lo comprobado, no asumir que un PR abierto o un commit significa que un sprint terminó.
