import type { Metadata } from "next";
import { PageHeader } from "@/components/sections/page-header";
import { LegalDocument, type LegalSection } from "@/components/sections/legal/legal-document";
import { site } from "@/lib/site";

// [Placeholder] legal copy — must be reviewed by a qualified lawyer before launch.
const LAST_UPDATED = "2026-11-17";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `[Placeholder] How ${site.name} collects, uses and protects personal data.`,
  alternates: { canonical: "/privacy" },
};

const sections: LegalSection[] = [
  {
    id: "who-we-are",
    title: "Who we are",
    body: (
      <p>
        [Placeholder] {site.name} (“we”, “us”) is [legal entity name], registered at [registered address], company number
        [number]. We are the controller of the personal data described in this policy. Contact:{" "}
        <a className="text-highlight underline underline-offset-4" href={`mailto:${site.contact.email}`}>
          {site.contact.email}
        </a>
        .
      </p>
    ),
  },
  {
    id: "data-we-collect",
    title: "Data we collect",
    body: (
      <>
        <p>[Placeholder] We collect only what we need:</p>
        <ul>
          <li>
            <strong>Contact form:</strong> name, email, company, budget range, service of interest and your message.
          </li>
          <li>
            <strong>Bookings:</strong> details you give when booking a call through our scheduling provider (Cal.com).
          </li>
          <li>
            <strong>Usage data:</strong> privacy-friendly, aggregated analytics (Vercel Analytics) without cookies for
            tracking across sites.
          </li>
          <li>
            <strong>Technical data:</strong> IP address and request metadata in server logs, kept briefly for security and
            abuse prevention.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "how-we-use-it",
    title: "How we use your data",
    body: (
      <>
        <p>[Placeholder] We use personal data to reply to enquiries, schedule and hold calls, deliver contracted services,
          improve our website and keep it secure.</p>
        <p>[Placeholder] Legal bases (GDPR): legitimate interests, steps prior to entering a contract, contract
          performance and legal obligations. We do not sell personal data.</p>
      </>
    ),
  },
  {
    id: "sharing",
    title: "Who we share it with",
    body: (
      <>
        <p>[Placeholder] Trusted processors that help us run the business, under data processing agreements:</p>
        <ul>
          <li>Hosting and analytics — Vercel Inc.</li>
          <li>Email delivery — Resend</li>
          <li>Scheduling — Cal.com</li>
          <li>[Placeholder] Any other processors (CRM, accounting, …)</li>
        </ul>
      </>
    ),
  },
  {
    id: "transfers",
    title: "International transfers",
    body: (
      <p>
        [Placeholder] Some processors are located outside your country. Where required, transfers are protected by
        appropriate safeguards such as Standard Contractual Clauses.
      </p>
    ),
  },
  {
    id: "retention",
    title: "How long we keep it",
    body: (
      <p>
        [Placeholder] Enquiries that don’t become projects are deleted after [12] months. Client records are kept for as
        long as required by law (e.g. [7] years for accounting).
      </p>
    ),
  },
  {
    id: "your-rights",
    title: "Your rights",
    body: (
      <p>
        [Placeholder] You can ask to access, correct, delete, restrict or port your data, and object to processing, by
        emailing {site.contact.email}. You may also complain to your local data-protection authority ([authority name]).
      </p>
    ),
  },
  {
    id: "cookies",
    title: "Cookies",
    body: (
      <p>
        [Placeholder] We use only strictly necessary storage (for example, remembering your light/dark theme). If that
        changes, we will ask for consent first.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes to this policy",
    body: <p>[Placeholder] We will post any changes on this page and update the “last updated” date above.</p>,
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Privacy Policy"
        intro="[Placeholder] What we collect, why, and the choices you have. Plain language first; legal detail where it matters."
      />
      <LegalDocument lastUpdated={LAST_UPDATED} sections={sections} />
    </>
  );
}
