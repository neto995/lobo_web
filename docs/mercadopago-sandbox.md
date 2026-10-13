# Mercado Pago: entorno aislado, sin transacciones

Preparado el 2026-10-12 en `fix/security-dependencies`. No se modificaron checkout,
planes, suscripciones, WhatsApp, Auth, dependencias ni configuracion productiva.
No se crearon preferencias ni pagos, ni se configuraron Webhooks/IPN remotos.

## Limites y aislamiento

- Receptor Node independiente en `127.0.0.1:3199`, no dentro de Next.js.
- Un Quick Tunnel de Cloudflare expone solamente ese puerto; nunca el 3101.
- No hay rutas para crear preferencias, cobrar, reembolsar o cancelar.
- El receptor no realiza solicitudes salientes ni carga el token de vendedor.
- La herramienta de consultas solamente admite GET a recursos fijos de Mercado
  Pago/Mercado Libre. No sigue redirecciones ni acepta hosts proporcionados por eventos.
- `run.sh` elimina todo el entorno heredado, incluidos tokens, proxies,
  `NODE_OPTIONS` y variables de Vercel/Supabase. No carga `.env.local` ni otros `.env`.
- El tunel recibe un HOME privado con configuracion vacia, sin cuenta/token de
  Cloudflare ni configuracion del usuario. Su unica conexion operativa es Cloudflare.
- Archivos privados en `.mp-sandbox/`, ignorado por Git: directorio 0700,
  configuracion y secretos 0600. No hay secretos en argumentos ni reportes.
- Esto es aislamiento de procesos/configuracion, NO una VM ni una barrera frente
  a otro proceso comprometido del mismo usuario. Cloudflare termina TLS y puede
  transportar/ver los datos; no usar informacion de clientes reales.

## Preparacion local (ya inicializada en este worktree)

Ejecutar desde la raiz de `lobo-auth-v1`, comprobando primero la rama:

```sh
git branch --show-current
sh scripts/mp-sandbox/run.sh isolation
git check-ignore .mp-sandbox/config.json .mp-sandbox/seller-token.txt .mp-sandbox/webhook-secret.txt
```

Debe indicar `fix/security-dependencies`, `inheritedCredentials: false`,
`envFilesLoaded: false`, `transactionsEnabled: false`. Las tres rutas deben estar
ignoradas. En otro checkout limpio, `sh scripts/mp-sandbox/run.sh init` crea los
archivos vacios; falla si el directorio ya existe, sin sobrescribir secretos.

El binario local `.mp-sandbox/cloudflared` es 2026.10.0, macOS arm64, descargado
de la release oficial. No se instalo globalmente ni se agregaron paquetes npm.
SHA256 del tgz: `a2f79ff7b9420aa537d74af239f376da170bbabeb529aec416002adac6a72e70`.
SHA256 del ejecutable: `72edfd3eea463aef4d5cb89e2e209cecb048cc756c2b01915de2e0ad7cb39830`.
Se contrastaron respectivamente con el digest del asset en GitHub y el checksum
publicado en la release. No son el mismo archivo.

## Colocar credenciales sin exponerlas

1. Abrir `.mp-sandbox/seller-token.txt` en un editor LOCAL confiable. Pegar desde
   Bitwarden exclusivamente el Access Token del vendedor de LOBO Sandbox, sin
   comillas ni `NOMBRE=`. No usar comandos con el token literal, chat, capturas,
   editores web ni sincronizacion de archivos. No modificar `.env.local`.
2. Editar `.mp-sandbox/config.json`: `sellerId` y `buyerId` son strings con los
   identificadores de las cuentas de prueba mexicanas. Mantener `country: "MX"`
   y poner `sandboxConfirmed: true` solo tras comprobarlos en Developers.
   `origin` se completa despues de iniciar el tunel. No agregar secretos a este JSON.
3. Dejar `.mp-sandbox/webhook-secret.txt` vacio por ahora. Se utiliza posteriormente
   para la clave de firma de la aplicacion de pruebas, NO el Access Token.
4. Las contrasenas/codigos de vendedor y comprador permanecen en Bitwarden.
   El comprador solo los utilizara en una sesion de navegador separada cuando
   se autoricen compras. No hace falta Public Key para esta herramienta.
5. Si el editor cambia permisos, restaurarlos antes de continuar:

```sh
chmod 700 .mp-sandbox
chmod 600 .mp-sandbox/config.json .mp-sandbox/seller-token.txt .mp-sandbox/webhook-secret.txt
sh scripts/mp-sandbox/run.sh seller
```

`seller` hace solo una consulta autenticada de identidad a
`https://api.mercadolibre.com/users/me`. Requiere ID esperado, `country_id: MX`,
`site_id: MLM` y etiqueta `test_user`. Solo imprime coincidencia/pais/cuenta de
prueba. Si faltan campos o hay un error, se detiene; no asumir que es seguro,
no quitar comprobaciones y no mostrar la respuesta completa. Esta consulta real
queda pendiente hasta que el usuario coloque el token. `APP_USR` tambien puede
ser un token de pruebas: el prefijo NO distingue de forma segura el entorno.

## Iniciar receptor y HTTPS temporal

En una terminal:

```sh
sh scripts/mp-sandbox/run.sh serve
```

En otra terminal, desde el mismo worktree:

```sh
sh scripts/mp-sandbox/run.sh tunnel
```

El segundo comando muestra `https://...trycloudflare.com`. Copiar ese origen
exacto, sin barra final, a `origin` en el JSON privado. No usar `eatlikeawolf.mx`,
Vercel, localhost, query strings, credenciales en URL ni dominios personalizados.
Despues de cambiar configuracion/clave de firma, reiniciar SOLO el receptor.

```sh
sh scripts/mp-sandbox/run.sh destinations
```

Imprime los unicos destinos admitidos para la sesion:

- `back_urls.success`: ORIGEN + `/return/success`
- `back_urls.failure`: ORIGEN + `/return/failure`
- `back_urls.pending`: ORIGEN + `/return/pending`
- `notification_url`: ORIGEN + `/webhooks/mercadopago`

Abrir ORIGEN + `/health`: debe mostrar `lobo-mp-sandbox` y transacciones
deshabilitadas. Los tres retornos deben responder sin redirigir y con
`paymentVerified: false`, incluso si se agrega `?status=approved`.
`/api/checkout`, `/api/webhooks/whatsapp` y archivos privados deben devolver 404.
El webhook devuelve 503 hasta cargar su clave; despues rechaza firmas invalidas.
No usar la proteccion de email del tunel: bloquearia los POST de Mercado Pago.

Ctrl+C en ambas terminales cierra el receptor y el tunel. La URL cambia en cada
inicio del tunel; repetir la comprobacion y actualizar SOLO los destinos de
pruebas cuando corresponda. No hay garantia de disponibilidad del tunel.

## Webhooks: configuracion manual FUTURA, no realizada

Despues de autorizar esa fase y con el receptor activo:

1. Developers > Tus integraciones > **LOBO Sandbox** > Webhooks > Configurar.
2. En el destino de **prueba**, colocar exactamente `notification_url` emitida
   por `destinations`. Si la interfaz no ofrece destino de prueba o solo muestra
   modo productivo, detenerse y revisar esa pantalla antes de guardar. No tocar
   la aplicacion comercial ni asumir equivalencia entre modos.
3. Seleccionar solamente **Pagos (payment)**. No suscripciones ni eventos de
   planes. Mantener IPN sin configurar y no reutilizar endpoints comerciales.
4. Guardar unicamente esa configuracion de pruebas. Obtener su clave de firma
   y colocarla localmente en `webhook-secret.txt`; mantenerla tambien en Bitwarden.
5. Reiniciar `serve`. Debe indicar `webhookEnabled: true`. El secreto nunca se
   incluye en las URLs. No activar simulaciones ni pagos sin autorizacion.

El receptor valida HMAC SHA256 con `x-signature`, `x-request-id` y `data.id`,
limita cuerpos a 16 KiB y acepta timestamps dentro de cinco minutos. Requiere
evento `payment.created`/`payment.updated`, vendedor esperado y `live_mode: false`.
Deduplica las ultimas 500 firmas en memoria; no conserva un historial durable.
Solo registra tipo de evento, ID de pago y resultado de firma, no cuerpos completos.
La firma NO certifica todos los campos del cuerpo: consultar siempre el pago.
Eventos viejos/reintentos con firma antigua o simulaciones con vendedor ficticio
pueden rechazarse. No relajar los controles para hacerlos pasar.

## Bloqueo de back_urls productivas

`app/api/checkout/route.ts` sigue intacto y fija retornos productivos.
**NO llamar POST /api/checkout, ni abrir los botones comerciales o suscripciones.**
No cargar el token de pruebas en el servidor Next.js. Cambiar solo el token no
aislaria el checkout. Configurar Webhooks tampoco cambia `back_urls`.

Esta fase no contiene una funcion para crear o editar preferencias. En una fase
posterior autorizada debera crearse una preferencia EXCLUSIVA de pruebas con los
destinos aislados desde el inicio, usando un ejecutor separado. No crear primero
una preferencia con retornos productivos para corregirla despues. Tal prueba
validara la integracion de pagos, no el flujo completo del boton productivo.

Para una preferencia futura existente, consulta de solo lectura:

```sh
sh scripts/mp-sandbox/run.sh preference ID_PREFERENCIA plan-chico-unico
sh scripts/mp-sandbox/run.sh payment ID_PAGO ID_PREFERENCIA plan-chico-unico
```

No ejecutar estos comandos con recursos productivos. Antes de consultar recursos,
ambos verifican la identidad del vendedor. No imprimen `init_point` ni abren checkout.

Validaciones obligatorias:

- Preferencia: vendedor esperado, un item, ID del plan, cantidad 1, moneda MXN,
  precio exacto 630 (chico) o 945 (mediano), tres retornos y notificacion exactos.
- Referencia exclusiva `lobo-sandbox-` seguida de 8 a 80 caracteres alfanumericos
  o guiones, generada por prueba futura; misma referencia en el pago.
- Modo binario desactivado para permitir pendientes. Si la preferencia devuelve
  `live_mode: true`, se rechaza; ausencia de ese campo NO acredita un pago sandbox.
- Pago: `live_mode === false` obligatorio, vendedor y comprador esperados,
  importe/moneda exactos, referencia coincidente y estado/detalle reconocidos.
- Estados se reportan, no se convierten todos en exito. Aprobado, rechazado,
  pendiente/en proceso se contrastaran con el escenario de prueba solicitado.
  Ninguno genera entrega, pedido, suscripcion, correo o mensaje.
- IDs ausentes, diferencias de importe, redirecciones o respuestas inesperadas
  detienen la validacion. No confiar en parametros de retorno o solo el webhook.

## Evidencia y pendientes

- `npm test`: 53/53, incluyendo 10 pruebas nuevas sin credenciales reales.
- Lint de scripts/pruebas y TypeScript sin emision: correctos.
- HTTPS `/health` comprobado contra un Quick Tunnel real, sin token de vendedor.
- Entorno heredado vacio salvo PATH/LC_ALL; archivos privados ignorados por Git.
- Pendientes: identidad con el token real de PRUEBA, configuracion remota de
  Webhooks, firmas de notificaciones reales y todas las transacciones.
- No se repitio build/Playwright de Next.js: no se cambio la aplicacion ni sus
  dependencias. Las pruebas HTTP del receptor cubren rutas, firmas y aislamiento.
- El receptor y tunel se cierran despues de la comprobacion de preparacion.

## Referencias oficiales

- [Cuentas de prueba](https://www.mercadopago.com.mx/developers/es/docs/checkout-pro-preferences/test-accounts)
- [Credenciales y consulta de identidad](https://www.mercadopago.com.mx/developers/es/docs/your-integrations/credentials)
- [Notificaciones y firmas](https://www.mercadopago.com.mx/developers/es/docs/checkout-pro-preferences/payment-notifications)
- [Consulta de preferencias](https://www.mercadopago.com.mx/developers/es/reference/online-payments/checkout-pro-preferences/get-preference/get)
- [Consulta de pagos](https://www.mercadopago.com.mx/developers/es/reference/online-payments/checkout-pro-preferences/get-payment/get)
- [Quick Tunnels](https://developers.cloudflare.com/tunnel/get-started/quick-tunnels/)
- [cloudflared 2026.10.0](https://github.com/cloudflare/cloudflared/releases/tag/2026.10.0)
