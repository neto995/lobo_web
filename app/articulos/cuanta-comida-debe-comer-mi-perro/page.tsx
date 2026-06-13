import SeoPage from "@/components/SeoPage";
import { articles, faqJsonLd, pageMetadata } from "@/app/seo-content";

const content = articles.find(
  (article) => article.slug === "/articulos/cuanta-comida-debe-comer-mi-perro"
)!;

export const metadata = pageMetadata(content);

export default function CuantaComidaDebeComerMiPerroPage() {
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
            label: "Cuánta comida debe comer mi perro",
            href: "/articulos/cuanta-comida-debe-comer-mi-perro",
          },
        ]}
      />
    </>
  );
}
