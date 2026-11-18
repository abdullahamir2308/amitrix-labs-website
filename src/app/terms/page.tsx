import type { Metadata } from "next";
import { PageHeader } from "@/components/sections/page-header";
import { LegalDocument, type LegalSection } from "@/components/sections/legal/legal-document";
import { createMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

// [Placeholder] legal copy — must be reviewed by a qualified lawyer before launch.
const LAST_UPDATED = "2026-11-17";

export const metadata: Metadata = createMetadata({
  title: "Terms of Service",
  description: `[Placeholder] The terms that apply when you use the ${site.name} website.`,
  path: "/terms",
});

const sections: LegalSection[] = [
  {
    id: "agreement",
    title: "Agreement to these terms",
    body: (
      <p>
        [Placeholder] By using {site.domain} (the “site”) you agree to these terms. If you don’t agree, please don’t use
        the site. These terms cover the website only; client projects are governed by a separate signed agreement.
      </p>
    ),
  },
  {
    id: "use-of-site",
    title: "Using the site",
    body: (
      <>
        <p>[Placeholder] You may browse and share the site for lawful purposes. You agree not to:</p>
        <ul>
          <li>attempt to disrupt, overload or gain unauthorised access to the site or its infrastructure;</li>
          <li>submit spam, malware or unlawful content through our forms;</li>
          <li>scrape the site in a way that degrades it for others.</li>
        </ul>
      </>
    ),
  },
  {
    id: "intellectual-property",
    title: "Intellectual property",
    body: (
      <p>
        [Placeholder] The site’s content, design, logos and code are owned by {site.name} or its licensors. Product names
        and trademarks of third parties belong to their owners.
      </p>
    ),
  },
  {
    id: "products",
    title: "Our products",
    body: (
      <p>
        [Placeholder] Use of {site.name} products (for example, beta software) is governed by each product’s own terms,
        presented when you sign up.
      </p>
    ),
  },
  {
    id: "no-warranty",
    title: "No warranty",
    body: (
      <p>
        [Placeholder] Content on the site, including articles in Insights, is provided “as is” for general information and
        is not professional advice.
      </p>
    ),
  },
  {
    id: "liability",
    title: "Limitation of liability",
    body: (
      <p>
        [Placeholder] To the extent permitted by law, {site.name} is not liable for indirect or consequential losses
        arising from use of the site. Nothing limits liability that cannot be limited by law.
      </p>
    ),
  },
  {
    id: "governing-law",
    title: "Governing law",
    body: <p>[Placeholder] These terms are governed by the laws of [jurisdiction], and the courts of [venue] have jurisdiction.</p>,
  },
  {
    id: "contact",
    title: "Contact",
    body: (
      <p>
        [Placeholder] Questions about these terms:{" "}
        <a className="text-highlight underline underline-offset-4" href={`mailto:${site.contact.email}`}>
          {site.contact.email}
        </a>
        .
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Terms of Service"
        intro="[Placeholder] The ground rules for using this website."
      />
      <LegalDocument lastUpdated={LAST_UPDATED} sections={sections} />
    </>
  );
}
