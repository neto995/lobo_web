import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

const pageUrl =
  "https://eatlikeawolf.mx/comida-cocinada-para-perros-guadalajara";

const faqs = [
  {
    question: "¿Dónde comprar comida cocinada para perros en Guadalajara?",
    answer:
      "Puedes pedir LOBO en Guadalajara por plan, prueba o recomendación personalizada. Te orientamos según peso, edad y lo que come hoy.",
  },
  {
    question: "¿LOBO entrega en Zapopan?",
    answer:
      "Sí. LOBO trabaja entregas en Guadalajara y Zapopan. Si tienes duda de cobertura, mándanos tu zona y revisamos la entrega.",
  },
  {
    question: "¿Puedo mezclar LOBO con croquetas?",
    answer:
      "Sí. LOBO está pensado para usarse con mix feeding cuando conviene: una parte de comida real y una parte de su alimento actual, con proporciones claras.",
  },
  {
    question: "¿Qué diferencia hay entre comida cocinada y BARF?",
    answer:
      "LOBO es comida cocinada y porcionada. BARF suele servirse crudo y requiere otro tipo de manejo. La diferencia práctica está en cocción, logística y criterio.",
  },
  {
    question: "¿LOBO reemplaza las croquetas?",
    answer:
      "Puede formar una parte importante del plato, pero no tienes que reemplazar todo de golpe. Para muchos perros, empezar con mezcla gradual es más realista.",
  },
  {
    question: "¿Cómo sé cuánto LOBO darle a mi perro?",
    answer:
      "Usa la calculadora LOBO o mándanos su peso, edad y alimentación actual. La idea es empezar con una porción clara y ajustar con observación.",
  },
];

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Comida real cocinada para perros en Guadalajara | LOBO",
    url: pageUrl,
    description:
      "LOBO entrega comida real cocinada para perros en Guadalajara y Zapopan. Porciones listas para mezclar con croquetas, planes mensuales y calculadora de mix feeding.",
    inLanguage: "es-MX",
    isPartOf: {
      "@type": "WebSite",
      name: "LOBO",
      url: "https://eatlikeawolf.mx",
    },
    about: {
      "@type": "Service",
      name: "Comida real cocinada para perros",
      areaServed: ["Guadalajara", "Zapopan", "Jalisco"],
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  },
  {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "LOBO",
    url: "https://eatlikeawolf.mx",
    slogan: "Más comida. Menos marketing.",
    description:
      "Comida real cocinada para perros, porcionada y lista para servir o mezclar con croquetas.",
    areaServed: [
      {
        "@type": "City",
        name: "Guadalajara",
      },
      {
        "@type": "City",
        name: "Zapopan",
      },
      {
        "@type": "AdministrativeArea",
        name: "Jalisco",
      },
    ],
  },
];

const planStarts = [
  {
    title: "Premium Box",
    copy: "Para probar LOBO sin comprar todo el mes. Sirve para observar apetito, tolerancia y rutina.",
  },
  {
    title: "Plan mensual",
    copy: "Para hacerlo constante cuando LOBO ya forma parte del plato diario o del mix de la semana.",
  },
  {
    title: "Plan personalizado",
    copy: "Para perros grandes, varios perros o familias que necesitan una recomendación más medida.",
  },
];

const internalLinks = [
  { label: "Inicio", href: "/" },
  { label: "Calculadora", href: "/calculadora" },
  { label: "Planes", href: "/#planes" },
  { label: "Mix feeding", href: "/mix-feeding-para-perros" },
  {
    label: "Comida real cocinada",
    href: "/comida-real-cocinada-para-perros",
  },
  { label: "Ingredientes", href: "/#ingredientes" },
  { label: "FAQ", href: "/#faq" },
];

export const metadata: Metadata = {
  title: "Comida real cocinada para perros en Guadalajara | LOBO",
  description:
    "LOBO entrega comida real cocinada para perros en Guadalajara y Zapopan. Porciones listas para mezclar con croquetas, planes mensuales y calculadora de mix feeding.",
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: "Comida real cocinada para perros en Guadalajara | LOBO",
    description:
      "LOBO entrega comida real cocinada para perros en Guadalajara y Zapopan. Porciones listas para mezclar con croquetas, planes mensuales y calculadora de mix feeding.",
    url: pageUrl,
    siteName: "LOBO",
    locale: "es_MX",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Comida real cocinada para perros en Guadalajara | LOBO",
    description:
      "LOBO entrega comida real cocinada para perros en Guadalajara y Zapopan. Porciones listas para mezclar con croquetas, planes mensuales y calculadora de mix feeding.",
  },
};

function PrimaryCta({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex justify-center rounded-full bg-[#F4EFE3] px-7 py-4 text-xs font-black uppercase tracking-wide text-black transition hover:bg-white"
    >
      {children}
    </Link>
  );
}

function SecondaryCta({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex justify-center rounded-full border border-white/20 px-7 py-4 text-xs font-black uppercase tracking-wide text-[#F4EFE3] transition hover:bg-white/10"
    >
      {children}
    </Link>
  );
}

export default function ComidaCocinadaParaPerrosGuadalajaraPage() {
  return (
    <main className="min-h-screen bg-[#F4EFE3] text-[#14110F]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <header className="border-b border-white/10 bg-[#14110F] px-4 py-4 text-[#F4EFE3] sm:px-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <Link
            href="/"
            className="text-sm font-black uppercase tracking-[0.34em] transition hover:text-white"
          >
            LOBO
          </Link>
          <nav className="hidden items-center gap-6 text-xs font-bold uppercase tracking-wide text-[#C9BDAA] md:flex">
            <Link href="/calculadora" className="transition hover:text-white">
              Calculadora
            </Link>
            <Link href="/#planes" className="transition hover:text-white">
              Planes
            </Link>
            <Link href="/#ingredientes" className="transition hover:text-white">
              Ingredientes
            </Link>
          </nav>
        </div>
      </header>

      <section className="bg-[#14110F] px-4 pb-16 pt-10 text-[#F4EFE3] sm:px-6 md:pb-24 md:pt-16">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.05fr_0.95fr] md:items-end">
          <div>
            <nav
              aria-label="Breadcrumb"
              className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#C9BDAA]"
            >
              <Link href="/" className="transition hover:text-white">
                Inicio
              </Link>
              <span aria-hidden="true">/</span>
              <span>Guadalajara</span>
            </nav>

            <p className="mt-10 text-xs font-bold uppercase tracking-[0.32em] text-[#C9BDAA]">
              Guadalajara y Zapopan
            </p>
            <h1 className="mt-5 max-w-4xl text-4xl font-black uppercase leading-[0.9] tracking-normal sm:text-6xl md:text-7xl">
              Comida real cocinada para perros en Guadalajara
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#DED4C4] md:text-xl md:leading-9">
              Porciones listas para mezclar con croquetas o servir como parte
              de un plan gradual. Sin cambiar todo de golpe.
            </p>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-[#C9BDAA] md:text-base">
              LOBO entrega comida real cocinada para perros en Guadalajara y
              Zapopan: porciones listas para servir o usar en mix feeding con
              croquetas, con recomendación según la rutina de cada perro.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <PrimaryCta href="/calculadora">Ir a calculadora</PrimaryCta>
              <SecondaryCta href="/#planes">Ver planes</SecondaryCta>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-sm md:max-w-md">
            <div
              aria-hidden="true"
              className="absolute inset-x-8 bottom-0 h-20 rounded-full bg-black/35 blur-2xl"
            />
            <Image
              src="/lobo_brutal.png"
              alt="Bolsa LOBO de comida real cocinada para perros"
              width={1122}
              height={1402}
              priority
              sizes="(min-width: 768px) 28rem, 82vw"
              className="relative h-auto w-full drop-shadow-[0_34px_70px_rgba(0,0,0,0.42)]"
            />
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 md:py-20">
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[0.9fr_1.1fr] md:items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-[#A93622]">
              Qué es LOBO
            </p>
            <h2 className="mt-4 text-4xl font-black uppercase leading-[0.92] sm:text-5xl md:text-6xl">
              Comida real. Lista para servir.
            </h2>
          </div>

          <div className="grid gap-5 text-base leading-8 text-black/68 md:text-lg md:leading-9">
            <p>
              LOBO es comida real cocinada para perros: porcionada, congelada y
              lista para servir cuando toca comer.
            </p>
            <p>
              No es croqueta maquillada. No es BARF improvisado. Es una forma
              práctica de sumar humedad, proteína real e ingredientes
              reconocibles al plato diario.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-14 sm:px-6 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-[1fr_1fr] md:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.32em] text-[#A93622]">
                Mix feeding
              </p>
              <h2 className="mt-4 text-4xl font-black uppercase leading-[0.92] sm:text-5xl md:text-6xl">
                No tienes que cambiar todo.
              </h2>
            </div>
            <p className="text-base leading-8 text-black/68 md:text-xl md:leading-9">
              El problema no es mezclar. Es hacerlo sin criterio. LOBO ayuda a
              mejorar el plato con comida real, humedad y una transición que
              puedes sostener.
            </p>
          </div>

          <div className="mt-10 grid gap-px overflow-hidden bg-black/10 md:grid-cols-3">
            {[
              ["01", "Calcula", "Peso, etapa, silueta y porcentaje de mix."],
              ["02", "Sirve", "Una porción clara junto con su alimento actual."],
              ["03", "Observa", "Apetito, popó, peso, saciedad y tolerancia."],
            ].map(([number, title, copy]) => (
              <article key={title} className="bg-white p-6 md:p-8">
                <p className="text-xs font-black tracking-[0.28em] text-[#A93622]">
                  {number}
                </p>
                <h3 className="mt-4 text-2xl font-black uppercase leading-tight">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-black/62">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 md:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-[#A93622]">
              Entrega local
            </p>
            <h2 className="mt-4 text-4xl font-black uppercase leading-[0.92] sm:text-5xl md:text-6xl">
              Guadalajara y Zapopan.
            </h2>
          </div>
          <div className="grid gap-5 text-base leading-8 text-black/68 md:text-lg md:leading-9">
            <p>
              Entregamos en Guadalajara y Zapopan. Puedes empezar con prueba o
              con plan, según el tamaño de tu perro y cuánto LOBO quieres sumar
              al plato.
            </p>
            <p>
              La recomendación parte de peso, edad aproximada, alimentación
              actual y objetivo. Más comida. Menos marketing.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#14110F] px-4 py-14 text-[#F4EFE3] sm:px-6 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-[0.95fr_1.05fr] md:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.32em] text-[#C9BDAA]">
                Cómo empezar
              </p>
              <h2 className="mt-4 text-4xl font-black uppercase leading-[0.92] sm:text-5xl md:text-6xl">
                Prueba, plan o recomendación.
              </h2>
            </div>
            <p className="text-base leading-8 text-[#DED4C4] md:text-xl md:leading-9">
              Elige una entrada realista. LOBO puede ser una mejora puntual, un
              mix constante o parte de un plan mensual.
            </p>
          </div>

          <div className="mt-10 grid gap-px overflow-hidden bg-white/10 md:grid-cols-3">
            {planStarts.map((plan) => (
              <article key={plan.title} className="bg-[#14110F] p-6 md:p-8">
                <h3 className="text-2xl font-black uppercase leading-tight">
                  {plan.title}
                </h3>
                <p className="mt-4 text-sm leading-6 text-[#C9BDAA]">
                  {plan.copy}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <PrimaryCta href="/#planes">Ver planes</PrimaryCta>
            <SecondaryCta href="/calculadora">Mándanos su peso o calcula</SecondaryCta>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-14 sm:px-6 md:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-[#A93622]">
              Calculadora LOBO
            </p>
            <h2 className="mt-4 text-4xl font-black uppercase leading-[0.92] sm:text-5xl md:text-6xl">
              Calcula antes de servir.
            </h2>
          </div>
          <div>
            <p className="text-base leading-8 text-black/68 md:text-xl md:leading-9">
              La calculadora traduce peso, etapa, silueta, movimiento real y
              porcentaje de mix feeding en una porción inicial. Mándanos su
              peso o calcula su mix.
            </p>
            <div className="mt-8">
              <Link
                href="/calculadora"
                className="inline-flex justify-center rounded-full bg-[#14110F] px-7 py-4 text-xs font-black uppercase tracking-wide text-[#F4EFE3] transition hover:bg-[#A93622]"
              >
                Usar calculadora
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 md:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-[#A93622]">
              Ingredientes y criterio
            </p>
            <h2 className="mt-4 text-4xl font-black uppercase leading-[0.92] sm:text-5xl md:text-6xl">
              Ingredientes que reconoces.
            </h2>
            <p className="mt-6 text-base leading-8 text-black/68 md:text-lg md:leading-9">
              Comida real con cantidades claras. Sin claims médicos, sin
              prometer curas y sin vender una etiqueta inflada.
            </p>
            <div className="mt-7 flex flex-wrap gap-2">
              {[
                "Proteína real",
                "Humedad",
                "Porciones claras",
                "Transición gradual",
              ].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-[#8A6632]/20 bg-[#8A6632]/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.12em] text-[#6F4D21]"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="relative mx-auto grid min-h-[24rem] w-full max-w-[19rem] place-items-center sm:max-w-[23rem]">
            <div
              aria-hidden="true"
              className="absolute inset-x-8 bottom-8 h-16 rounded-full bg-black/16 blur-2xl"
            />
            <Image
              src="/ingredientes_3.png"
              alt="Ingredientes reconocibles de comida LOBO para perros"
              width={1152}
              height={2048}
              sizes="(min-width: 1024px) 23rem, 78vw"
              className="relative h-auto w-full drop-shadow-[0_30px_64px_rgba(20,17,15,0.18)]"
            />
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-14 sm:px-6 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-[#A93622]">
              FAQs locales
            </p>
            <h2 className="mt-4 text-4xl font-black uppercase leading-[0.92] sm:text-5xl md:text-6xl">
              Preguntas frecuentes
            </h2>
          </div>

          <div className="mt-8 grid gap-3">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group border border-black/10 bg-[#F4EFE3]/60"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-5 [&::-webkit-details-marker]:hidden">
                  <h3 className="text-base font-black uppercase leading-tight md:text-xl">
                    {faq.question}
                  </h3>
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-black/10 text-xl leading-none transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="border-t border-black/10 px-5 py-5 text-sm leading-7 text-black/65 md:text-base">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#14110F] px-4 py-14 text-[#F4EFE3] sm:px-6 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.32em] text-[#C9BDAA]">
                Más comida. Menos marketing.
              </p>
              <h2 className="mt-4 max-w-3xl text-4xl font-black uppercase leading-[0.92] sm:text-5xl md:text-6xl">
                Empieza con una mejora que sí cabe en la rutina.
              </h2>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
              <PrimaryCta href="/calculadora">Ir a calculadora</PrimaryCta>
              <SecondaryCta href="/#planes">Ver planes</SecondaryCta>
            </div>
          </div>

          <nav
            aria-label="Enlaces internos"
            className="mt-12 flex flex-wrap gap-3 border-t border-white/10 pt-8"
          >
            {internalLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full border border-white/15 px-4 py-3 text-xs font-bold uppercase tracking-wide text-[#C9BDAA] transition hover:bg-white/10 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </section>
    </main>
  );
}
