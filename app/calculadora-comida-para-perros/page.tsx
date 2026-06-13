import SeoPage from "@/components/SeoPage";
import { faqJsonLd, pageMetadata, seoPages } from "@/app/seo-content";

const content = seoPages["/calculadora-comida-para-perros"];

export const metadata = pageMetadata(content);

export default function CalculadoraComidaParaPerrosPage() {
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
            label: "Calculadora de comida",
            href: "/calculadora-comida-para-perros",
          },
        ]}
      />
    </>
  );
}
