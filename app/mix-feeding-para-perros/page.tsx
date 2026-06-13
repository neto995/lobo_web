import SeoPage from "@/components/SeoPage";
import { faqJsonLd, pageMetadata, seoPages } from "@/app/seo-content";

const content = seoPages["/mix-feeding-para-perros"];

export const metadata = pageMetadata(content);

export default function MixFeedingPage() {
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
          { label: "Mix feeding", href: "/mix-feeding-para-perros" },
        ]}
      />
    </>
  );
}
