import SeoPage from "@/components/SeoPage";
import { faqJsonLd, pageMetadata, seoPages } from "@/app/seo-content";

const content = seoPages["/comida-para-perros-guadalajara"];

export const metadata = pageMetadata(content);

export default function ComidaParaPerrosGuadalajaraPage() {
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
          {
            label: "Comida para perros Guadalajara",
            href: "/comida-para-perros-guadalajara",
          },
        ]}
      />
    </>
  );
}
