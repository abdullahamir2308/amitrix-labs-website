/**
 * Internal notification sent to CONTACT_TO_EMAIL when someone submits /contact.
 * Reply-To is set to the visitor, so "Reply" in the inbox answers them directly.
 */
import { Link, Section, Text } from "@react-email/components";
import { EmailLayout, brand, styles } from "./email-layout";

export type ContactNotificationProps = {
  name: string;
  email: string;
  company?: string;
  budget: string;
  /** Human-readable service title (not the slug). */
  service: string;
  message: string;
  /** ISO timestamp of the submission. */
  submittedAt: string;
};

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <tr>
      <td
        style={{
          ...styles.eyebrow,
          margin: 0,
          padding: "10px 16px 10px 0",
          width: "110px",
          verticalAlign: "top",
          borderBottom: `1px solid ${brand.line}`,
        }}
      >
        {label}
      </td>
      <td
        style={{
          fontSize: "14px",
          lineHeight: "1.5",
          color: brand.ink,
          padding: "10px 0",
          verticalAlign: "top",
          borderBottom: `1px solid ${brand.line}`,
        }}
      >
        {children}
      </td>
    </tr>
  );
}

export function ContactNotification({
  name,
  email,
  company,
  budget,
  service,
  message,
  submittedAt,
}: ContactNotificationProps) {
  return (
    <EmailLayout preview={`New enquiry from ${name}${company ? ` (${company})` : ""} — ${service}`}>
      <Text style={styles.eyebrow}>{"// New enquiry — amitrixlabs.com/contact"}</Text>
      <Text style={styles.heading}>
        {name}
        {company ? ` · ${company}` : ""}
      </Text>
      <table role="presentation" width="100%" cellPadding={0} cellSpacing={0} style={{ borderCollapse: "collapse" }}>
        <tbody>
          <Row label="Email">
            <Link href={`mailto:${email}`} style={{ color: brand.indigo }}>
              {email}
            </Link>
          </Row>
          {company ? <Row label="Company">{company}</Row> : null}
          <Row label="Service">{service}</Row>
          <Row label="Budget">{budget}</Row>
          <Row label="Received">{submittedAt}</Row>
        </tbody>
      </table>
      <Section
        style={{
          marginTop: "24px",
          padding: "16px 18px",
          backgroundColor: brand.paper,
          border: `1px solid ${brand.line}`,
          borderLeft: `3px solid ${brand.indigo}`,
          borderRadius: "8px",
        }}
      >
        <Text style={{ ...styles.text, margin: 0, whiteSpace: "pre-wrap" }}>{message}</Text>
      </Section>
      <Text style={{ ...styles.muted, marginTop: "20px" }}>Reply to this email to answer {name} directly.</Text>
    </EmailLayout>
  );
}

ContactNotification.PreviewProps = {
  name: "Ada Example",
  email: "ada@example.com",
  company: "Example Co",
  budget: "$25k – $50k",
  service: "AI Agents & Automation",
  message: "We'd like to automate our intake process and connect it to our CRM.",
  submittedAt: "2026-11-17T10:00:00.000Z",
} satisfies ContactNotificationProps;

export default ContactNotification;
