import SeoPage from "@/components/SeoPage";
import { articles, faqJsonLd, pageMetadata } from "@/app/seo-content";

const content = articles.find(
  (article) => article.slug === "/articulos/comida-humeda-vs-croquetas"
)!;

export const metadata = pageMetadata(content);

export default function ComidaHumedaVsCroquetasPage() {
  const jsonLd = faqJsonLd(content.faqs ?? []);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <SeoPage
        content={content}
        breadcrumbs={[
          { label: "Inicio", href: "/" },
          { label: "Artículos", href: "/articulos" },
          {
            label: "Comida húmeda vs croquetas",
            href: "/articulos/comida-humeda-vs-croquetas",
          },
        ]}
      />
    </>
  );
}
