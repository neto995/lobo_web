import type { Metadata } from "next";
import type { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import { HomeFooter } from "@/components/HomeEditorial";

export const metadata: Metadata = {
  title: "Términos y Condiciones | LOBO",
  description:
    "Consulta los Términos y Condiciones aplicables a productos, suscripciones, entregas, herramientas y servicios de LOBO.",
};

const sectionTitles = [
  "Sobre LOBO",
  "Productos LOBO",
  "Mix feeding y alimentación",
  "Calculadora LOBO",
  "Seguimiento personalizado",
  "Mi Expediente",
  "Compras y pagos",
  "Precios",
  "Suscripciones y precio congelado",
  "Pausas y cancelaciones",
  "Entregas",
  "Recepción y conservación",
  "Incidencias, cambios y reembolsos",
  "Aceptación, transición y condiciones individuales",
  "Contenido informativo",
  "Servicios y plataformas de terceros",
  "Uso del sitio y propiedad intelectual",
  "Responsabilidad",
  "Datos personales",
  "Cambios a estos términos",
  "Legislación y contacto",
];

function LegalSection({ number, title, children }: {
  number: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <section aria-labelledby={`seccion-${number}`} className="border-t border-carbon/15 py-9 sm:py-12">
      <h2 id={`seccion-${number}`} className="scroll-mt-28 break-words text-xl leading-snug text-carbon sm:text-2xl">
        {number}. {title}
      </h2>
      <div className="mt-5 space-y-5 text-base leading-8 text-carbon/90 sm:text-lg sm:leading-8">
        {children}
      </div>
    </section>
  );
}

export default function TerminosYCondicionesPage() {
  return (
    <div className="min-h-screen bg-hueso text-carbon">
      <Navbar />
      <main className="px-5 pb-16 pt-32 sm:px-6 sm:pb-24 sm:pt-40">
        <article aria-labelledby="terminos-title" className="mx-auto max-w-[54rem] break-words">
          <header className="pb-10 sm:pb-14">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-rojo">LOBO</p>
            <h1 id="terminos-title" className="mt-5 text-3xl uppercase leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
              Términos y Condiciones
            </h1>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm leading-6 text-ceniza">
              <p>Última actualización: <time dateTime="2026-09-26">26 de septiembre de 2026</time></p>
              <p>Versión 1.0</p>
            </div>
            <nav aria-labelledby="indice-title" className="mt-8 border-y border-carbon/15 py-5 sm:py-6">
              <h2 id="indice-title" className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-rojo">
                Índice
              </h2>
              <ol className="columns-2 gap-x-5 text-xs leading-5 text-carbon sm:gap-x-8 sm:text-sm lg:columns-3">
                {sectionTitles.map((title, index) => (
                  <li key={title} className="break-inside-avoid pb-2">
                    <a href={`#seccion-${index + 1}`} className="flex gap-2 py-0.5 underline-offset-4 transition hover:text-rojo hover:underline">
                      <span className="shrink-0 font-mono text-rojo">{index + 1}.</span>
                      <span>{title}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
            <div className="mt-8 space-y-5 text-base leading-8 text-carbon/90 sm:text-lg sm:leading-8">
              <p>{"Estos Términos y Condiciones regulan la compra y uso de productos, planes, suscripciones, herramientas y servicios ofrecidos bajo la marca LOBO, incluyendo el sitio "}<a href="https://eatlikeawolf.mx" className="underline decoration-rojo/50 underline-offset-4 transition hover:text-rojo">eatlikeawolf.mx</a>{", la Calculadora LOBO, Mi Expediente, formularios, WhatsApp y otros canales oficiales."}</p>
              <p>{"Al realizar una compra, contratar un plan o utilizar nuestras herramientas, el usuario acepta estos Términos y Condiciones."}</p>
            </div>
          </header>

          <LegalSection number={1} title="Sobre LOBO">
            <p>{"LOBO es un emprendimiento dedicado a la elaboración y comercialización de alimento cocinado para perros y servicios relacionados."}</p>
            <p>{"Para dudas, pedidos, cancelaciones, incidencias o aclaraciones:"}</p>
            <p>{"Correo: "}<a href="mailto:ernestom95@gmail.com" className="underline decoration-rojo/50 underline-offset-4 transition hover:text-rojo">ernestom95@gmail.com</a></p>
            <p>{"Teléfono / WhatsApp: "}<a href="tel:+523330626243" className="underline decoration-rojo/50 underline-offset-4 transition hover:text-rojo">+52 33 3062 6243</a></p>
            <p>{"Sitio: "}<a href="https://eatlikeawolf.mx" className="underline decoration-rojo/50 underline-offset-4 transition hover:text-rojo">eatlikeawolf.mx</a></p>
          </LegalSection>

          <LegalSection number={2} title="Productos LOBO">
            <p>{"Los productos LOBO están destinados exclusivamente a la alimentación de perros."}</p>
            <p>{"No son medicamentos y no están destinados a diagnosticar, prevenir, tratar o curar enfermedades."}</p>
            <p>{"LOBO puede actualizar ingredientes, formulaciones, presentación o información nutricional cuando sea necesario. La información aplicable será la correspondiente al producto o formulación vigente al momento de la compra."}</p>
          </LegalSection>

          <LegalSection number={3} title="Mix feeding y alimentación">
            <p>{"LOBO está pensado principalmente para utilizarse como parte de esquemas de mix feeding o alimentación complementaria, salvo que una formulación específica indique expresamente lo contrario."}</p>
            <p>{"Las necesidades de cada perro pueden variar por peso, edad, actividad, condición corporal, metabolismo, estado fisiológico, alimentación adicional y condiciones médicas."}</p>
            <p>{"Las cantidades mostradas por LOBO son orientativas y no garantizan un resultado específico."}</p>
            <p>{"Cuando un perro tenga una enfermedad, alergia, intolerancia, dieta especial o cualquier condición médica conocida o sospechada, recomendamos consultar con un médico veterinario antes de realizar cambios importantes en su alimentación."}</p>
          </LegalSection>

          <LegalSection number={4} title="Calculadora LOBO">
            <p>{"La Calculadora LOBO es una herramienta informativa que estima cantidades y proporciones de alimentación utilizando los datos proporcionados por el usuario y los parámetros vigentes de LOBO."}</p>
            <p>{"Sus resultados:"}</p>
            <ul className="list-disc space-y-2 pl-6 marker:text-rojo">
              <li>{"son estimaciones;"}</li>
              <li>{"no constituyen diagnóstico o prescripción;"}</li>
              <li>{"no sustituyen una consulta veterinaria;"}</li>
              <li>{"no garantizan cambios específicos de peso o salud."}</li>
            </ul>
            <p>{"LOBO puede actualizar la metodología, parámetros o formulación utilizados por la calculadora."}</p>
            <p>{"También puede establecer límites comerciales en el número de porciones disponibles. Estos límites no representan por sí mismos límites médicos o nutricionales."}</p>
            <p>{"El usuario es responsable de proporcionar información correcta."}</p>
          </LegalSection>

          <LegalSection number={5} title="Seguimiento personalizado">
            <p>{"Algunos planes pueden incluir seguimiento personalizado relacionado con el uso de LOBO, adaptación alimentaria, mix feeding, peso, evolución registrada y preferencias del perro."}</p>
            <p>{"Actualmente, parte de este acompañamiento puede ser brindado por una estudiante de Medicina Veterinaria."}</p>
            <p>{"Este acompañamiento constituye orientación general y no es una consulta médico-veterinaria."}</p>
            <p>{"No incluye diagnóstico, prescripción de medicamentos, tratamiento de enfermedades, atención de urgencias ni actos profesionales reservados a un médico veterinario legalmente facultado."}</p>
            <p>{"Cuando una situación requiera atención clínica, el cliente deberá acudir con su médico veterinario."}</p>
            <p>{"El alcance de este servicio podrá actualizarse en el futuro conforme cambien las credenciales profesionales de quienes lo proporcionan."}</p>
          </LegalSection>

          <LegalSection number={6} title="Mi Expediente">
            <p>{"Mi Expediente permite organizar información relacionada con el perro, su alimentación y su experiencia con LOBO."}</p>
            <p>{"Puede incluir datos como peso, edad, alimentación, objetivos, historial de consumo y seguimiento."}</p>
            <p>{"Mi Expediente no constituye un expediente clínico veterinario ni sustituye una consulta, diagnóstico, prescripción o historia clínica profesional."}</p>
            <p>{"El tratamiento de datos personales estará sujeto al Aviso de Privacidad de LOBO."}</p>
          </LegalSection>

          <LegalSection number={7} title="Compras y pagos">
            <p>{"Al realizar una compra, el cliente acepta el producto, cantidad, precio y condiciones mostradas antes del pago."}</p>
            <p>{"Una orden se considera confirmada cuando LOBO recibe la confirmación correspondiente del pago."}</p>
            <p>{"Los pagos pueden procesarse mediante plataformas externas como Mercado Pago u otros medios disponibles. Dichos proveedores pueden aplicar sus propios términos y políticas."}</p>
            <p>{"LOBO podrá contactar al cliente cuando sea necesario verificar información relacionada con un pedido."}</p>
          </LegalSection>

          <LegalSection number={8} title="Precios">
            <p>{"El precio aplicable será el mostrado al cliente al momento de la compra."}</p>
            <p>{"LOBO puede modificar sus precios para compras futuras."}</p>
            <p>{"Los cambios posteriores no afectarán una compra previamente confirmada, salvo acuerdo con el cliente o los casos permitidos por la legislación aplicable."}</p>
          </LegalSection>

          <LegalSection number={9} title="Suscripciones y precio congelado">
            <p>{"LOBO puede ofrecer planes recurrentes con diferentes cantidades, frecuencias y beneficios."}</p>
            <p>{"Cuando un plan indique “Precio congelado por 12 meses”, el precio contratado se mantendrá durante los primeros doce meses mientras se conserve el mismo plan, cantidad y periodicidad."}</p>
            <p>{"Si el cliente cambia de plan, cantidad o frecuencia, podrá aplicarse el precio vigente de la nueva modalidad."}</p>
            <p>{"Al terminar los doce meses, la renovación podrá realizarse al precio vigente de LOBO."}</p>
            <p>{"Precio congelado por 12 meses no significa precio garantizado de forma indefinida."}</p>
          </LegalSection>

          <LegalSection number={10} title="Pausas y cancelaciones">
            <p>{"Cuando un plan permita pausa o cancelación, el cliente podrá solicitarla mediante los canales de contacto de LOBO."}</p>
            <p>{"La cancelación aplicará a futuras entregas o cobros."}</p>
            <p>{"Si un pedido ya fue producido, preparado, procesado o enviado antes de recibir la solicitud, podrá no ser posible detenerlo."}</p>
            <p>{"LOBO procurará informar claramente al cliente cuando esto ocurra."}</p>
          </LegalSection>

          <LegalSection number={11} title="Entregas">
            <p>{"Las entregas se realizarán dentro de las zonas de cobertura disponibles."}</p>
            <p>{"Las fechas y horarios pueden ajustarse debido a tráfico, clima, alta demanda, fallas vehiculares, ausencia del cliente, información incorrecta u otras circunstancias razonables."}</p>
            <p>{"El cliente es responsable de proporcionar una dirección correcta y condiciones adecuadas para recibir el pedido."}</p>
            <p>{"Si una entrega no puede completarse por causas atribuibles al cliente, podrá programarse un nuevo intento. Cualquier costo adicional se comunicará previamente."}</p>
          </LegalSection>

          <LegalSection number={12} title="Recepción y conservación">
            <p>{"El cliente deberá revisar el pedido al recibirlo."}</p>
            <p>{"Una vez entregado correctamente, es responsable de seguir las instrucciones de almacenamiento, refrigeración, congelación, descongelación, calentamiento e higiene proporcionadas por LOBO."}</p>
            <p>{"LOBO no será responsable por deterioro causado exclusivamente por almacenamiento o manipulación incorrecta después de la entrega, sin perjuicio de las responsabilidades que legalmente correspondan."}</p>
          </LegalSection>

          <LegalSection number={13} title="Incidencias, cambios y reembolsos">
            <p>{"Si existe un producto incorrecto, pedido incompleto, empaque dañado o alguna condición anormal, el cliente deberá contactar a LOBO tan pronto como sea razonablemente posible."}</p>
            <p>{"LOBO podrá solicitar fotografías o información del pedido para revisar el caso."}</p>
            <p>{"Por tratarse de alimentos perecederos, algunas devoluciones físicas pueden estar limitadas por razones de higiene e inocuidad."}</p>
            <p>{"Esto no elimina los derechos que correspondan al consumidor cuando exista un defecto, incumplimiento o situación legalmente atribuible a LOBO."}</p>
          </LegalSection>

          <LegalSection number={14} title="Aceptación, transición y condiciones individuales">
            <p>{"Cada perro puede responder de forma diferente a un cambio de alimentación."}</p>
            <p>{"LOBO no garantiza que todos los perros acepten el producto ni que tengan la misma respuesta digestiva o de apetito."}</p>
            <p>{"El cliente deberá observar al perro durante la transición y consultar a un médico veterinario cuando aparezcan signos persistentes, graves o preocupantes."}</p>
            <p>{"El cliente también es responsable de revisar los ingredientes cuando existan alergias, intolerancias o restricciones alimentarias conocidas."}</p>
          </LegalSection>

          <LegalSection number={15} title="Contenido informativo">
            <p>{"Los artículos, videos, publicaciones, mensajes, gráficas, recomendaciones generales y demás contenidos de LOBO tienen fines principalmente informativos y educativos."}</p>
            <p>{"No constituyen asesoría veterinaria individualizada."}</p>
            <p>{"Los testimonios y experiencias de otros clientes representan casos individuales y no garantizan resultados equivalentes."}</p>
          </LegalSection>

          <LegalSection number={16} title="Servicios y plataformas de terceros">
            <p>{"LOBO puede apoyarse en proveedores externos como plataformas de pago, WhatsApp, servicios de hosting, mapas, analítica, redes sociales o herramientas tecnológicas."}</p>
            <p>{"Estos terceros operan bajo sus propias condiciones."}</p>
            <p>{"LOBO no controla la disponibilidad permanente de dichas plataformas, aunque procurará mantener operativos sus propios servicios."}</p>
          </LegalSection>

          <LegalSection number={17} title="Uso del sitio y propiedad intelectual">
            <p>{"Los contenidos originales de LOBO, incluyendo nombre, marca, diseños, fotografías, textos, videos, gráficos, software, calculadoras e identidad visual, pertenecen a LOBO o a sus respectivos titulares."}</p>
            <p>{"Su acceso no autoriza la reproducción o explotación comercial sin permiso."}</p>
            <p>{"El usuario no deberá intentar vulnerar, interferir o utilizar de manera fraudulenta los sistemas o herramientas de LOBO."}</p>
          </LegalSection>

          <LegalSection number={18} title="Responsabilidad">
            <p>{"LOBO será responsable por aquellas acciones u omisiones que legalmente le sean imputables."}</p>
            <p>{"En la máxima medida permitida por la ley, LOBO no será responsable por consecuencias causadas exclusivamente por:"}</p>
            <ul className="list-disc space-y-2 pl-6 marker:text-rojo">
              <li>{"uso contrario a las instrucciones;"}</li>
              <li>{"almacenamiento o manipulación incorrecta;"}</li>
              <li>{"información falsa o incorrecta proporcionada por el cliente;"}</li>
              <li>{"uso del producto pese a una contraindicación conocida;"}</li>
              <li>{"decisiones médicas tomadas únicamente a partir de contenido general;"}</li>
              <li>{"uso de herramientas informativas como sustituto de atención veterinaria;"}</li>
              <li>{"actos de terceros fuera del control razonable de LOBO;"}</li>
              <li>{"fuerza mayor o caso fortuito cuando legalmente corresponda."}</li>
            </ul>
            <p>{"Las protecciones legítimamente aplicables a LOBO se entenderán también, cuando jurídicamente proceda, respecto de sus propietarios, empleados, colaboradores, contratistas y personas autorizadas para actuar en su nombre."}</p>
            <p>{"Nada de esta sección pretende eliminar derechos del consumidor ni responsabilidades que la legislación mexicana establezca como irrenunciables."}</p>
          </LegalSection>

          <LegalSection number={19} title="Datos personales">
            <p>{"LOBO puede recopilar información mediante compras, formularios, comunicaciones y Mi Expediente."}</p>
            <p>{"El uso de datos personales estará regulado por el Aviso de Privacidad de LOBO, documento independiente de estos Términos."}</p>
            <p>{"Tener ese aviso separado es importante porque un aviso de privacidad debe explicar, entre otras cosas, quién trata los datos, con qué finalidades y cómo puede el titular ejercer sus derechos. Distintivo Digital"}</p>
          </LegalSection>

          <LegalSection number={20} title="Cambios a estos términos">
            <p>{"LOBO puede actualizar estos Términos para reflejar cambios en productos, servicios, operación, tecnología o requisitos legales."}</p>
            <p>{"La versión vigente mostrará su fecha de actualización."}</p>
            <p>{"Las modificaciones se aplicarán hacia el futuro y no pretenden eliminar derechos previamente adquiridos por el consumidor."}</p>
          </LegalSection>

          <LegalSection number={21} title="Legislación y contacto">
            <p>{"Estos Términos se regirán por las leyes aplicables de los Estados Unidos Mexicanos."}</p>
            <p>{"Nada contenido en ellos limita los derechos irrenunciables reconocidos al consumidor."}</p>
            <p>{"Cuando corresponda, las controversias podrán presentarse ante las autoridades competentes, incluyendo PROFECO."}</p>
            <p>{"Para cualquier duda o aclaración:"}</p>
            <p>{"LOBO"}</p>
            <p>{"Correo: "}<a href="mailto:ernestom95@gmail.com" className="underline decoration-rojo/50 underline-offset-4 transition hover:text-rojo">ernestom95@gmail.com</a></p>
            <p>{"Teléfono / WhatsApp: "}<a href="tel:+523330626243" className="underline decoration-rojo/50 underline-offset-4 transition hover:text-rojo">+52 33 3062 6243</a></p>
            <p>{"Sitio: "}<a href="https://eatlikeawolf.mx" className="underline decoration-rojo/50 underline-offset-4 transition hover:text-rojo">eatlikeawolf.mx</a></p>
          </LegalSection>

        </article>
      </main>
      <HomeFooter />
    </div>
  );
}
