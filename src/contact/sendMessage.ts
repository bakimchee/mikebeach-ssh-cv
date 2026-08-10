import { Resend } from "resend";

export interface ContactMessage {
  name: string;
  message: string;
  visitorIp: string;
}

/** Throws if RESEND_API_KEY / CONTACT_TO_EMAIL / CONTACT_FROM_EMAIL aren't configured, or on send failure. */
export async function sendContactMessage({ name, message, visitorIp }: ContactMessage): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !to || !from) {
    throw new Error("Contact form is not configured (RESEND_API_KEY / CONTACT_TO_EMAIL / CONTACT_FROM_EMAIL)");
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    to,
    from,
    subject: `mikbeach.co.uk contact form: ${name}`,
    text: `From: ${name}\nIP: ${visitorIp}\n\n${message}`,
  });

  if (error) {
    throw new Error(`Resend send failed: ${error.message}`);
  }
}
