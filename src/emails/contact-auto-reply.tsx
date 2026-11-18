/**
 * Optional auto-reply sent to the visitor after a successful /contact submission.
 * Sending failures are logged but never fail the request (the notification is what matters).
 */
import { Button, Text } from "@react-email/components";
import { site } from "@/lib/site";
import { EmailLayout, brand, styles } from "./email-layout";

export type ContactAutoReplyProps = {
  name: string;
  service: string;
};

export function ContactAutoReply({ name, service }: ContactAutoReplyProps) {
  const firstName = name.split(/\s+/)[0] || name;
  return (
    <EmailLayout preview={`Thanks, ${firstName} — we got your message.`}>
      <Text style={styles.eyebrow}>{"// Message received"}</Text>
      <Text style={styles.heading}>Thanks, {firstName}. We&apos;re on it.</Text>
      <Text style={styles.text}>
        We received your note about <strong>{service}</strong>. A real person on our team will read it and reply
        with honest next steps. {site.contact.responseTime}
      </Text>
      <Text style={styles.text}>
        Prefer to talk it through? You can pick a time that suits you and we&apos;ll come prepared.
      </Text>
      <Button
        href={`${site.url}/contact`}
        style={{
          backgroundColor: brand.indigo,
          color: "#FFFFFF",
          fontSize: "14px",
          fontWeight: 600,
          borderRadius: "8px",
          padding: "12px 18px",
          textDecoration: "none",
        }}
      >
        {site.ctaLabels.bookCall}
      </Button>
      <Text style={{ ...styles.muted, marginTop: "24px" }}>
        You&apos;re receiving this because you contacted {site.name} at {site.domain}. If that wasn&apos;t you, you
        can ignore this email.
      </Text>
    </EmailLayout>
  );
}

ContactAutoReply.PreviewProps = { name: "Ada Example", service: "AI Agents & Automation" } satisfies ContactAutoReplyProps;

export default ContactAutoReply;
