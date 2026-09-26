# Mi LOBO · Expediente vivo

Adaptación del código original del ChatGPT Site **Mi LOBO** a la ruta
`/mi-expediente` de este proyecto Next.js. Todos los componentes, estilos,
lógica y pruebas están dentro de esta carpeta; no requiere nuevas dependencias.

- `page.tsx`: entrada de servidor y metadatos de la ruta.
- `MiExpediente.tsx`: navegación y coordinación de los formularios.
- `components/`: menú, cabecera, lista de perros, plan, gráfica y formularios.
- `expediente.module.css`: estilos del Site original, aislados con CSS Modules.
- `data.ts`, `types.ts`: modelo, validación y operaciones sobre expedientes.
- `repository.ts`: contrato asíncrono `PackRepository` y selección del adaptador.
- `localStorageRepository.ts`: adaptador de localStorage y eventos entre pestañas.
- `usePack.ts`: carga, actualización y errores de la interfaz, independientes del almacenamiento.

## Almacenamiento

La primera visita comienza sin perros. Los perfiles y todos sus registros de
peso se guardan en la clave `lobo.mi-expediente.v1`, con el formato
`{ version: 1, dogs: [...] }`. La gráfica muestra los seis registros más recientes;
los anteriores se conservan. Las ediciones de perfil no reemplazan el historial.

Los datos pertenecen al navegador y al origen de la página. No se sincronizan
con el ChatGPT Site ni entre dispositivos, y se pierden al borrar los datos del
sitio. No se importan expedientes privados del Site original. La autenticación
y la base de datos D1 originales se sustituyen por el almacenamiento local
solicitado. Los errores de lectura o guardado se muestran sin sobrescribir
silenciosamente los datos existentes.

Las fotos son URLs opcionales. Si no se proporciona una, se utilizan las
imágenes de referencia de Unsplash del diseño original.

## Sustituir LocalStorage por una API

La dependencia sigue esta dirección:

`Componentes → usePack → PackRepository → adaptador`

`PackRepository` define `list()`, `create(values)`, `update(id, values)` y
`recordWeight(id, value)`. Todas las operaciones devuelven promesas; las
mutaciones devuelven el perro completo, incluido su historial, y rechazan con
un `Error` legible si fallan. El contrato no expone `Storage`, JSON, eventos
del navegador ni funciones para reescribir toda la colección.

Para conectar una API:

1. Implementar `PackRepository` en un adaptador de API, usando `fetch` y
   normalizando las respuestas a `Dog` / `Dog[]`. Los endpoints deben validar
   los datos y preservar el historial al editar un perfil.
2. Cambiar únicamente la importación y la instancia exportada como
   `packRepository` en `repository.ts` para seleccionar ese adaptador.
3. Definir `storageDescription` con el texto que corresponda al almacenamiento
   remoto. `subscribe` es opcional: una API puede omitirlo o implementarlo
   mediante notificaciones de cambios. La interfaz vuelve a consultar después
   de cada mutación aunque no haya suscripción.

No es necesario cambiar `usePack` ni los componentes. Estos ya esperan las
promesas, muestran el estado de guardado, impiden envíos duplicados y mantienen
abierto el formulario cuando una mutación falla. Las respuestas de consultas
anteriores se descartan si ya comenzó una consulta más reciente. No se ha
implementado todavía una API ni una migración de los datos locales a un servidor.

El adaptador local mantiene la clave y el formato v1 existentes. Puede recibir
`getStorage` y `events` como dependencias para pruebas sin navegador. No accede
a `window` durante la importación ni el renderizado de servidor.

## Verificación

Desde la raíz del proyecto (las pruebas de datos usan Node.js 22.18 o posterior):

```sh
node --test app/mi-expediente/tests/*.test.mjs
npx eslint app/mi-expediente
npx tsc --noEmit --incremental false
npm run build
```
