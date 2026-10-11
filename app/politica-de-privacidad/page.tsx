import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aviso de privacidad | LOBO",
  description:
    "Conoce cómo LOBO utiliza y protege tus datos personales al atender consultas y pedidos.",
  alternates: { canonical: "/politica-de-privacidad" },
};

const CONTACT_EMAIL = "ernestom95@gmail.com";
const LAST_UPDATED = "11 de octubre de 2026";

// IMPORTANTE: reemplazar antes de publicar por un domicilio físico completo y válido
// para identificar al responsable. No basta indicar solamente ciudad y estado.
const RESPONSIBLE_ADDRESS = "[DOMICILIO COMPLETO PENDIENTE]";

export default function PoliticaDePrivacidadPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-12 text-neutral-900 sm:py-16">
      <header className="mb-9 border-b border-neutral-200 pb-7">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-neutral-500">
          LOBO · Más comida. Menos marketing.
        </p>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Aviso de privacidad
        </h1>
        <p className="mt-3 text-sm text-neutral-600">
          Última actualización: {LAST_UPDATED}
        </p>
      </header>

      <div className="space-y-7 leading-7 text-neutral-700 [&_h2]:mb-2 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-neutral-950">
        <section>
          <h2>1. Responsable</h2>
          <p>
            Ernesto Otaqui Martínez, persona física que opera bajo la marca
            comercial LOBO, con domicilio en {RESPONSIBLE_ADDRESS}, es responsable
            del tratamiento de tus datos personales. Contacto: {" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="font-medium text-neutral-950 underline underline-offset-4"
            >
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </section>

        <section>
          <h2>2. Datos y finalidades</h2>
          <p>
            Podemos tratar nombre, teléfono, correo electrónico, domicilio de
            entrega, historial de pedidos, referencias o estado de pago, mensajes
            y datos que nos proporciones sobre tu mascota. Utilizamos esta
            información para responder consultas, procesar pagos y pedidos,
            coordinar entregas, atender aclaraciones y cumplir obligaciones
            legales. No solicitamos datos personales sensibles ni números
            completos de tarjetas bancarias.
          </p>
          <p className="mt-3">
            <strong>Finalidad opcional:</strong> enviarte novedades y promociones
            de LOBO, cuando exista la autorización correspondiente. Puedes
            negarte o dejar de recibirlas en cualquier momento escribiendo a {" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="underline underline-offset-4">
              {CONTACT_EMAIL}
            </a>
            , sin afectar tus compras ni la atención de tus pedidos.
          </p>
        </section>

        <section>
          <h2>3. Proveedores y canales digitales</h2>
          <p>
            Utilizamos servicios de alojamiento web, pagos y comunicación, como
            WhatsApp y Mercado Pago, y podemos recurrir a proveedores de entrega.
            Solo comunicamos la información necesaria para prestar estos
            servicios o cumplir obligaciones legales. Si habilitamos asistentes
            de inteligencia artificial para atención por WhatsApp, podremos
            procesar los mensajes mediante proveedores tecnológicos para atender
            las consultas; informaremos de ello en el canal correspondiente.
            No vendemos datos personales. Cuando una transferencia de datos
            requiera tu consentimiento, lo solicitaremos antes de realizarla;
            puedes manifestar tu negativa en el correo señalado.
          </p>
        </section>

        <section>
          <h2>4. Derechos y decisiones sobre tus datos</h2>
          <p>
            Puedes solicitar acceso, rectificación, cancelación u oposición
            (derechos ARCO), revocar tu consentimiento cuando proceda o limitar
            el uso y divulgación de tus datos. Envía un correo a {" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="underline underline-offset-4">
              {CONTACT_EMAIL}
            </a>
            , indicando tu nombre, el derecho o solicitud que deseas ejercer y
            los datos relacionados. Podremos solicitar información necesaria
            para acreditar tu identidad. Responderemos en un máximo de 20 días
            hábiles y, si procede, haremos efectiva la solicitud dentro de los
            15 días hábiles siguientes, salvo ampliaciones o excepciones legales.
          </p>
        </section>

        <section>
          <h2>5. Conservación y seguridad</h2>
          <p>
            Conservamos los datos solo durante el tiempo necesario para las
            finalidades descritas o para atender obligaciones legales y posibles
            aclaraciones. Aplicamos medidas razonables para protegerlos. El
            sitio puede usar cookies técnicas necesarias para su funcionamiento;
            si incorporamos herramientas adicionales de análisis o publicidad,
            proporcionaremos la información y opciones que legalmente correspondan.
          </p>
        </section>

        <section>
          <h2>6. Cambios al aviso</h2>
          <p>
            Publicaremos cualquier modificación a este aviso en {" "}
            <a href="/politica-de-privacidad" className="underline underline-offset-4">
              eatlikeawolf.mx/politica-de-privacidad
            </a>
            , indicando la fecha de actualización. Si un cambio requiere
            consentimiento adicional, lo solicitaremos conforme a la ley.
          </p>
        </section>
      </div>
    </main>
  );
}
