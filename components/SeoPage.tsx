import Link from "next/link";
import type { ArticleContent, SeoPageContent } from "@/app/seo-content";

type SeoPageProps = {
  content: SeoPageContent | ArticleContent;
  breadcrumbs: {
    label: string;
    href: string;
  }[];
  children?: React.ReactNode;
};

function isSeoLanding(
  content: SeoPageContent | ArticleContent
): content is SeoPageContent {
  return "cta" in content;
}

function hasFaqs(content: SeoPageContent | ArticleContent) {
  return "faqs" in content && content.faqs && content.faqs.length > 0;
}

export default function SeoPage({
  content,
  breadcrumbs,
  children,
}: SeoPageProps) {
  const related = isSeoLanding(content)
    ? content.related
    : [
        { label: "Calculadora LOBO", href: "/calculadora" },
        { label: "Premium Box", href: "/#planes" },
        {
          label: "Comida real cocinada para perros",
          href: "/comida-real-cocinada-para-perros",
        },
      ];

  return (
    <main className="min-h-screen bg-[#F4EFE3] text-[#14110F]">
      <header className="border-b border-black/10 bg-[#14110F] px-4 py-4 text-[#F4EFE3] sm:px-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <Link
            href="/"
            className="text-sm font-black uppercase tracking-[0.35em] transition hover:text-white"
          >
            LOBO
          </Link>

          <nav className="hidden items-center gap-5 text-xs font-bold uppercase tracking-wide text-[#C9BDAA] md:flex">
            <Link href="/calculadora" className="transition hover:text-white">
              Calculadora
            </Link>
            <Link
              href="/mix-feeding-para-perros"
              className="transition hover:text-white"
            >
              Mix feeding
            </Link>
            <Link href="/#planes" className="transition hover:text-white">
              Premium Box
            </Link>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:py-12">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.14em] text-black/45"
        >
          {breadcrumbs.map((crumb, index) => (
            <span key={crumb.href} className="flex items-center gap-2">
              {index > 0 && <span aria-hidden="true">/</span>}
              <Link href={crumb.href} className="transition hover:text-black">
                {crumb.label}
              </Link>
            </span>
          ))}
        </nav>

        <section className="grid gap-10 py-12 md:grid-cols-[1.1fr_0.9fr] md:items-end md:py-20">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#A93622]">
              {content.eyebrow}
            </p>
            <h1 className="mt-5 max-w-4xl text-4xl font-black uppercase leading-[0.92] tracking-tight sm:text-6xl md:text-7xl">
              {content.h1}
            </h1>
          </div>

          <div className="border-l-4 border-[#A93622] pl-5">
            <p className="text-lg leading-8 text-black/68 md:text-xl md:leading-9">
              {content.intro}
            </p>
          </div>
        </section>

        <section className="grid gap-5">
          {content.sections.map((section, index) => (
            <article
              key={section.title}
              className="grid gap-5 border-t border-black/10 py-8 md:grid-cols-[0.28fr_0.72fr] md:gap-10 md:py-10"
            >
              <div>
                <p className="text-xs font-black uppercase tracking-[0.28em] text-[#A93622]">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h2 className="mt-3 text-2xl font-black uppercase leading-tight md:text-3xl">
                  {section.title}
                </h2>
              </div>
              <div className="grid gap-4 text-base leading-8 text-black/68 md:text-lg md:leading-9">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </article>
          ))}
        </section>

        {isSeoLanding(content) && (
          <section className="my-10 border-y border-black/10 bg-white/45 px-5 py-8 md:my-14 md:px-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#A93622]">
                  Siguiente paso
                </p>
                <p className="mt-3 max-w-2xl text-2xl font-black uppercase leading-tight md:text-4xl">
                  Empieza con una porción clara, no con una promesa enorme.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row md:flex-col lg:flex-row">
                <Link
                  href={content.cta.href}
                  className="inline-flex justify-center rounded-full bg-[#14110F] px-6 py-4 text-xs font-black uppercase tracking-wide text-[#F4EFE3] transition hover:bg-[#A93622]"
                  target={content.cta.href.startsWith("http") ? "_blank" : undefined}
                >
                  {content.cta.label}
                </Link>
                {content.cta.secondaryHref && content.cta.secondaryLabel && (
                  <Link
                    href={content.cta.secondaryHref}
                    className="inline-flex justify-center rounded-full border border-black/15 px-6 py-4 text-xs font-black uppercase tracking-wide text-[#14110F] transition hover:bg-white"
                    target={
                      content.cta.secondaryHref.startsWith("http")
                        ? "_blank"
                        : undefined
                    }
                  >
                    {content.cta.secondaryLabel}
                  </Link>
                )}
              </div>
            </div>
          </section>
        )}

        {children}

        {hasFaqs(content) && (
          <section className="border-t border-black/10 py-10 md:py-14">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#A93622]">
                FAQ
              </p>
              <h2 className="mt-3 text-3xl font-black uppercase leading-tight md:text-5xl">
                Preguntas frecuentes
              </h2>
            </div>

            <div className="mt-7 grid gap-3">
              {content.faqs?.map((faq) => (
                <details
                  key={faq.question}
                  className="group border border-black/10 bg-white/55"
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
          </section>
        )}

        <section className="border-t border-black/10 py-10">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#A93622]">
            Enlaces internos
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            {related.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full border border-black/10 bg-white/55 px-4 py-3 text-xs font-bold uppercase tracking-wide text-black/70 transition hover:bg-white hover:text-black"
                target={item.href.startsWith("http") ? "_blank" : undefined}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
