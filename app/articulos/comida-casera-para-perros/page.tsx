import SeoPage from "@/components/SeoPage";
import { articles, faqJsonLd, pageMetadata } from "@/app/seo-content";

const content = articles.find(
  (article) => article.slug === "/articulos/comida-casera-para-perros"
)!;

export const metadata = pageMetadata(content);

export default function ComidaCaseraParaPerrosPage() {
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
            label: "Comida casera para perros",
            href: "/articulos/comida-casera-para-perros",
          },
        ]}
      />
    </>
  );
}
