import { landingFaqs } from "@/lib/landing-faq-data";

/** Homepage FAQ only — WebSite / SoftwareApplication live in root JsonLd to avoid duplicates. */
export function HomeJsonLd() {
  const payload = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: landingFaqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }} />
  );
}
