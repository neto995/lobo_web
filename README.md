# LOBO — Guía del proyecto y manual básico de desarrollo

**LOBO — Más comida. Menos marketing.**  
Sitio web: https://eatlikeawolf.mx  
Repositorio: https://github.com/neto995/lobo_web

Este documento explica, en lenguaje sencillo, **cómo está construido LOBO**, para qué sirve cada herramienta y cuáles son los comandos que usamos al desarrollar. La idea es que puedas retomar el proyecto sin depender de recordar cada paso.

> **Estado actual (16 de octubre de 2026):** Auth V1 y los parches de seguridad están integrados en `feature/expediente-v2`, sin publicación en producción. El Preview integrado compiló correctamente, pero su smoke test final de Auth sigue pendiente. Los expedientes todavía utilizan `localStorage`, sin sincronización entre dispositivos, y persisten avisos de dependencias y errores globales de lint. Consulta [PROJECT_STATUS.md](docs/PROJECT_STATUS.md) para la evidencia y [SPRINTS.md](docs/SPRINTS.md) para los criterios de cierre.

---
## Documentación central del proyecto

Para continuar el desarrollo de LOBO, consulta estos documentos:

| Documento | ¿Para qué sirve? |
|---|---|
| [Product Roadmap](docs/ROADMAP.md) | Visión del producto, funcionalidades, prioridades y dependencias. |
| [Project Status](docs/PROJECT_STATUS.md) | Estado real del desarrollo, ramas, PR, pruebas, riesgos y próximos pasos. |
| [Sprints](docs/SPRINTS.md) | Alcance, criterios de aceptación y seguimiento del cierre de cada sprint. |
| [Decision Log](docs/DECISIONS.md) | Decisiones técnicas y de producto, motivos y consecuencias. |
| [AGENTS.md](AGENTS.md) | Instrucciones que deben seguir los agentes de desarrollo. |

### Cómo retomar el proyecto

1. Leer `PROJECT_STATUS.md` para conocer la última situación documentada.
2. Consultar `ROADMAP.md` para entender los objetivos y prioridades.
3. Consultar `DECISIONS.md` antes de cambiar decisiones existentes.
4. Consultar [SPRINTS.md](docs/SPRINTS.md) para distinguir trabajo integrado, validación pendiente y próximos sprints.
5. Verificar en GitHub el estado actual de ramas, commits y Pull Requests.

**Importante:** la documentación registra el contexto y las decisiones, pero el estado real debe verificarse en GitHub y en el entorno correspondiente.

---
## 1. Arquitectura: ¿qué hace cada servicio?

```text
             CLIENTE (navegador)
                      |
                      v
       NEXT.JS — interfaz y lógica de LOBO
                      |
         +------------+------------------+
         |            |                  |
         v            v                  v
      VERCEL       SUPABASE           MERCADO PAGO
   publica la web  autenticación       pagos/checkout
                  + base de datos       (flujo existente)
                      |
                      v
                   RESEND
              entrega los correos
            de confirmación y reset

 GITHUB  = historial y colaboración del código
 BITWARDEN = contraseñas, claves y accesos privados
 PORKBUN = administración del dominio y sus DNS
```

| Servicio | ¿Para qué lo usamos? | Estado |
|---|---|---|
| **Next.js** | Construir las páginas, rutas y lógica del sitio. | En uso |
| **Git + GitHub** | Guardar versiones del código, trabajar en ramas y revisar cambios con Pull Requests. | En uso |
| **Vercel** | Alojar y desplegar la web de LOBO. | Producción activa |
| **Supabase Auth** | Crear cuentas, verificar correos, iniciar/cerrar sesión y recuperar contraseñas. | Probado en local y Preview de seguridad; smoke integrado pendiente |
| **Supabase PostgreSQL** | Guardar expedientes y datos de clientes en la nube. | **Pendiente** para expedientes |
| **RLS (Row Level Security)** | Restringir cada expediente a su propietario dentro de la base de datos. | **Pendiente** |
| **Resend** | Enviar los correos de autenticación mediante SMTP conectado a Supabase. | Probado con Auth V1 |
| **Porkbun** | Administrar `eatlikeawolf.mx` y sus registros DNS. | En uso |
| **Bitwarden** | Guardar contraseñas, tokens y credenciales en una bóveda privada. | Gestor de secretos; nunca Git |
| **Mercado Pago** | Procesar pagos del checkout existente. | En uso, no modificar sin necesidad |

**Una diferencia clave:** Supabase **Auth** ya funciona, pero Supabase **Database** todavía no guarda los perros. `localStorage` significa que la información se queda en ese navegador; no se sincroniza entre dispositivos.

---

## 2. Cómo abrir LOBO y trabajar en local

Abre la Terminal en la carpeta del proyecto (en el **worktree/rama correctos**):

```bash
pwd                 # ¿En qué carpeta estoy?
git branch --show-current  # ¿En qué rama estoy?
git status          # ¿Qué cambios tengo?
npm install         # Instala dependencias (normalmente la primera vez)
npm run dev         # Inicia el servidor de desarrollo
```

`npm run dev` **no publica el sitio**: ejecuta una versión local de Next.js para probar cambios. Normalmente abre `http://localhost:3000`, aunque el puerto se puede cambiar y puede estar ocupado. Para nuestra prueba de Auth V1 se usó **`http://127.0.0.1:3101`**.

Si necesitas arrancarlo en el puerto de Auth V1:

```bash
npm run dev -- --hostname 127.0.0.1 --port 3101
```

Usa el mismo host y puerto configurados en `APP_URL` y en las URLs permitidas de Supabase. `localhost` y `127.0.0.1` **no son intercambiables** en enlaces de autenticación/cookies.

Para detener el servidor: **Ctrl + C** en la terminal donde está corriendo.

Otros comandos útiles:

```bash
npm run build       # Prueba que el proyecto pueda compilar para producción
npm run lint        # Ejecuta lint, si el script existe en package.json
npm audit           # Consulta vulnerabilidades conocidas en dependencias
```

> `npm run ...` ejecuta un script definido en **`package.json`**. Si un comando falla por «Missing script», revisa ese archivo. No ejecutes `npm audit fix --force` a ciegas: puede introducir cambios incompatibles.

---

## 3. Git en palabras sencillas

Piensa en Git como un historial de puntos de guardado:

- **Repositorio:** carpeta cuyo historial administra Git.
- **Branch / rama:** línea de trabajo independiente para desarrollar sin tocar `main`.
- **Working tree:** archivos que estás editando ahora.
- **Staging:** cambios seleccionados para el siguiente commit.
- **Commit:** fotografía de los cambios seleccionados.
- **Push:** subir commits de tu computadora a GitHub.
- **Pull:** traer cambios remotos de GitHub a tu rama local.
- **Pull Request (PR):** propuesta para revisar y fusionar una rama con otra.
- **Merge:** integrar cambios de una rama a otra.
- **Worktree:** segunda carpeta del mismo repositorio para trabajar en otra rama al mismo tiempo. **No es una rama adicional**.

### El flujo normal de trabajo

**A. Revisar dónde estás**

```bash
pwd
git status
git branch --show-current
git branch -a
```

**B. Crear una rama nueva** (desde la rama correcta)

```bash
git switch feature/expediente-v2
git pull --ff-only
git switch -c feature/nueva-funcionalidad
```

`git switch -c` **crea y abre** una rama. `git switch nombre-rama` solo **cambia** a una existente. Si tienes cambios sin guardar, revisa `git status` antes de cambiar.

**C. Editar y guardar un punto de control**

```bash
git status                     # Revisar archivos cambiados
git diff                       # Ver qué modificaste
git add .                      # Preparar todos los cambios de ESTA carpeta
git diff --cached              # Revisar exactamente qué se va a guardar
git commit -m "feat: descripción corta del cambio"
```

**Importante:** el comando correcto es `git add .` (**sin punto después de `git`**). `git add .` no sube nada a GitHub; solo prepara archivos para el commit. Si quieres seleccionar uno solo: `git add ruta/del/archivo`.

**D. Subir la rama a GitHub**

```bash
git push -u origin feature/nueva-funcionalidad
```

Después, crea un **Pull Request** en GitHub eligiendo cuidadosamente **base** (rama de destino) y **compare** (rama con tus cambios). Abre el PR como *Draft* si todavía falta revisar algo.

**E. Actualizar una rama sin sorpresas**

```bash
git fetch origin
git status
git pull --ff-only
```

`fetch` consulta cambios remotos; `pull --ff-only` solo actualiza si no requiere crear un merge automático.

### ¿Qué significa cada comando?

| Comando | Traducción humana |
|---|---|
| `git status` | ¿Qué cambié? ¿Hay archivos pendientes? |
| `git diff` | ¿Qué líneas edité? |
| `git add .` | Prepara todos los cambios actuales para un commit. |
| `git commit -m "..."` | Guarda una versión local con nombre. |
| `git log --oneline -5` | Muéstrame los últimos cinco commits. |
| `git switch -c nombre` | Crea y cambia a una rama nueva. |
| `git switch nombre` | Cambia a una rama existente. |
| `git push` | Sube mis commits a GitHub. |
| `git fetch` | Descarga información de los cambios remotos, sin fusionarlos. |
| `git pull --ff-only` | Actualiza mi rama si puede hacerlo de forma directa. |

---

## 4. ¿Y si la riego? Recuperación básica

**Antes de arreglar algo:** corre `git status`, revisa la rama y, si tienes dudas, pide ayuda. No uses `git reset --hard`, `git clean -fd`, `git push --force` ni borres archivos a ciegas.

### Caso A: hice `git add .` pero incluí algo de más

```bash
git restore --staged ruta/del/archivo
```

Esto lo saca del *staging*, pero **conserva el contenido de tu archivo**.

### Caso B: quiero descartar cambios NO guardados de un archivo

```bash
git diff ruta/del/archivo
git restore ruta/del/archivo
```

⚠️ **Esto sí borra tus ediciones locales no guardadas** en ese archivo. Asegúrate antes.

### Caso C: hice un commit y quiero corregir el mensaje

```bash
git commit --amend -m "mensaje corregido"
```

Úsalo preferentemente **antes del push**. Modificar commits ya compartidos cambia su historial.

### Caso D: quiero traer un commit bueno de otra rama — `cherry-pick`

`git cherry-pick` significa **copiar el cambio de un commit específico a la rama donde estoy**, sin fusionar toda la rama. Es útil cuando el arreglo bueno quedó en otra rama; **no es un botón universal de deshacer**.

```bash
git switch feature/mi-rama
git status                     # Debe estar limpio
git log --oneline otra-rama -5 # Encontrar hash del commit
git cherry-pick ABC1234        # Aplicar ese commit en esta rama
```

Si hay conflictos:

```bash
git status                     # Identificar los archivos en conflicto
# Resolver manualmente los conflictos
git add ruta/del/archivo
git cherry-pick --continue
```

Si decides cancelar el cherry-pick:

```bash
git cherry-pick --abort
```

### Caso E: ya hice push de un error

En una rama compartida, suele ser más seguro crear un **nuevo commit que revierta el anterior**, sin borrar historial:

```bash
git revert HASH_DEL_COMMIT
git push
```

> **Regla de oro:** `revert` crea un commit nuevo que revierte; `cherry-pick` copia un commit existente a otra rama.

---

## 5. Las ramas de LOBO hoy

```text
main
  └─ Producción actual (no tocar sin revisión)

feature/expediente-v2
  └─ Mi Expediente, privacidad, Auth V1 y parches de seguridad integrados

feature/auth-v1
  └─ Autenticación Supabase (PR #1 integrado en feature/expediente-v2)
```

- [Pull Request #1 — Auth V1](https://github.com/neto995/lobo_web/pull/1)
- **Origen:** `feature/auth-v1`
- **Destino:** `feature/expediente-v2`
- **Merge:** `89573ca`, con las correcciones de seguridad de PR #2 (`50bdfc1`).
- **Estado:** integrado en desarrollo, sin deploy de Auth a producción; smoke test final pendiente. Evidencia y riesgos en [PROJECT_STATUS.md](docs/PROJECT_STATUS.md).

> La rama de Auth V1 se trabajó desde un **worktree separado** llamado `lobo-auth-v1`. Antes de editar, verifica la carpeta con `pwd` y la rama con `git branch --show-current`, especialmente si tienes más de una ventana de terminal.

---

## 6. Variables de entorno y secretos

Las configuraciones locales se guardan en **`.env.local`**, que **no debe subirse a Git**.

Ejemplo de **nombres de variables**, sin valores reales:

```env
AUTH_V1_ENABLED=true
APP_URL=http://127.0.0.1:3101
NEXT_PUBLIC_SUPABASE_URL=https://TU-PROYECTO.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_TU_CLAVE
```

- Las variables que empiezan con `NEXT_PUBLIC_` se pueden incluir en el código del navegador. La **publishable key** está diseñada para ese uso; **no sustituye RLS**.
- Las claves **secret**, **service_role**, SMTP/API Key de Resend y contraseñas privadas **nunca** van en `NEXT_PUBLIC_` ni en archivos versionados.
- La clave de Resend para enviar emails de Auth está configurada **en Supabase SMTP**, no hace falta copiarla al frontend de LOBO.
- Usa **Bitwarden** para guardar de forma privada credenciales y accesos. Evita pegarlos en chats, capturas o commits.
- `.env.example` sirve como plantilla pública **sin secretos**. `.env.local` contiene valores locales reales.
- Si una clave secreta se sube por accidente, **revócala y genera una nueva**; borrarla del último commit no garantiza que desaparezca del historial.

---

## 7. Dónde encontrar las cosas en Next.js

| Carpeta o archivo | Función |
|---|---|
| `app/` | Páginas y rutas con **App Router**. |
| `app/page.tsx` | Página principal. |
| `app/mi-expediente/` | Pantalla y lógica de Mi Expediente. |
| `app/(auth)/` | Pantallas de registro, login y recuperación. |
| `app/auth/` | Rutas técnicas de autenticación y confirmación. |
| `lib/auth/` | Configuración y lógica reutilizable de Auth V1. |
| `proxy.ts` | Gestión de sesiones y control de acceso en solicitudes. |
| `package.json` | Dependencias y comandos (`npm run ...`). |
| `package-lock.json` | Versiones exactas de las dependencias instaladas. |
| `.env.local` | Variables de entorno locales; no se versiona. |
| `docs/auth.md` | Documentación técnica y riesgos pendientes de Auth V1. |
| `README.md` | Guía principal del repositorio (este documento, si decides reemplazarla). |

---

## 8. Checklist antes de hacer un PR o merge

- [ ] Estoy en la **carpeta** y **rama** correctas (`pwd`, `git branch --show-current`).
- [ ] Revisé lo que modifiqué (`git status`, `git diff`).
- [ ] No incluí secretos, `.env.local`, contraseñas ni tokens.
- [ ] Corrí las pruebas disponibles y `npm run build`.
- [ ] Revisé `npm audit` y documenté los riesgos.
- [ ] Creé commit y subí mi rama a GitHub.
- [ ] Abrí el Pull Request hacia la **rama destino correcta**.
- [ ] No hice merge a `main` ni deploy sin la revisión correspondiente.

**Seguridad:** antes de integrar o desplegar cambios, consultar los hallazgos y pruebas más recientes en [PROJECT_STATUS.md](docs/PROJECT_STATUS.md) y revisar las dependencias afectadas. No asumir que una corrección desarrollada ya está integrada en producción.

---

## 9. Nuestro siguiente sprint

**Sprint 2 — Expedientes en la nube**

Planificado, no iniciado. Primero completar el cierre técnico de Sprint 1 y aprobar el diseño; consultar [SPRINTS.md](docs/SPRINTS.md).

Objetivo: almacenar perfiles de perros en **Supabase PostgreSQL**, vinculados al usuario autenticado y protegidos mediante **Row Level Security (RLS)**. Validar persistencia entre sesiones y dispositivos. **No migrar automáticamente expedientes viejos de `localStorage`** ni exponer datos reales sin revisión de seguridad y privacidad.

---

## 10. Para seguir aprendiendo

- [Documentación de Next.js](https://nextjs.org/docs)
- [Libro de Git (en español)](https://git-scm.com/book/es/v2)
- [Documentación de GitHub sobre Pull Requests](https://docs.github.com/es/pull-requests)
- [Documentación de Supabase](https://supabase.com/docs)
- [Documentación de Resend](https://resend.com/docs)

**Recordatorio:** *guardar en Git no es publicar en Vercel*. Primero desarrollamos, probamos y revisamos; después integramos y, cuando sea seguro, desplegamos.
