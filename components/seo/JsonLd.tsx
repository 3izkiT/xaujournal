import { jsonLdSoftwareApplication, jsonLdWebSite } from "@/lib/seo";

export function JsonLd() {
  const payload = [jsonLdWebSite(), jsonLdSoftwareApplication()];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}
