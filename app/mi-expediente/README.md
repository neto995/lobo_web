# Mi LOBO: expediente persistente

Sprint 2A, solo desarrollo. La sesion SSR sigue siendo obligatoria aqui, no para
comprar. Auth permanece bloqueado en produccion. Las migraciones remotas necesitan
autorizacion: la aplicacion no crea ni modifica el esquema automaticamente.

## Recorrido de datos

Componentes -> usePack -> PackRepository -> remoteRepository -> API Next -> Supabase/RLS.

- page.tsx verifica al usuario; SessionBoundary se remonta por identidad.
- repository.ts selecciona el adaptador remoto sin recibir un propietario.
- types.ts define perfiles remotos; age.ts calcula edad por calendario.
- lib/expediente/model.ts valida y normaliza; lib/expediente/server.ts usa la
  sesion SSR y el JWT del usuario para RLS, nunca service role.
- Rutas bajo /api/mi-expediente/dogs: GET listado/detalle, POST alta/peso,
  PATCH perfil. No se agrega eliminacion.
- Crear perfil y primer peso usa create_dog_with_initial_weight, transaccional.
  Editar el perfil no escribe sobre weight_entries.
- Se recuperan todas las paginas de pesos, ordenadas por fecha e ID. La grafica
  muestra los ultimos seis; el desplegable permite consultar todo el historial.
- El estado cambia con la respuesta confirmada de la mutacion; lecturas antiguas
  no la sustituyen. No hay Realtime: otro dispositivo consulta al entrar/recargar.

## Formulario

Edad exacta, aproximada o desconocida. La estimacion inicial usa la fecha de
America/Mexico_City; editar otro campo conserva su referencia original. No se
infiere nacimiento. Desconocidos permanecen NULL, nunca peso cero.
El peso inicial es obligatorio. El peso objetivo es opcional al crear y editar:
vacio se guarda como NULL, sin inventar una meta. La API acepta pesos entre 1 y
150 kg representables a una decimal y rechaza los que requieren redondeo.

Sin porcion diaria ni URL de fotografia. Avatar local y enlace a la calculadora
existente, sin Storage ni modelo nuevo de alimentacion.

## Datos heredados

data.ts, legacyTypes.ts y localStorageRepository.ts conservan el formato v1
original para pruebas y una futura importacion expresamente autorizada.
No estan conectados a la interfaz nueva. No se lee ni escribe automaticamente:

- lobo.mi-expediente.v1
- lobo.mi-expediente.auth-v1.<user.id>

Se conservan edad textual, porcion, URLs e historial. Ninguna clave demuestra
propiedad ni ofrece aislamiento entre personas que comparten navegador.
El aviso visible explica que no hubo importacion automatica y que los datos pueden
conservarse en el navegador si su almacenamiento no fue eliminado. No comprueba su
existencia ni hay fallback a localStorage ante un error remoto.

## Errores y pruebas

Ante un fallo se conserva el formulario, sin anunciar exito. Si se pierde la
respuesta de una escritura, puede haberse guardado: se bloquea otro intento hasta
volver a consultar. Revisar antes de repetir; no es una garantia de idempotencia
entre recargas o dispositivos.

Ejecutar npm test, TypeScript y lint dirigido desde la raiz. Las suites de navegador
se ejecutan en una copia sin archivos privados. Procedimiento y distincion entre
pruebas simuladas/reales: [Sprint 2A persistencia](../../docs/sprint2a-persistence.md).
