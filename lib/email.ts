/**
 * Email sending abstraction.
 * Default: Resend. Switch to SendGrid by swapping the provider.
 *
 * Set RESEND_API_KEY in your .env
 */

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
}

interface EmailResult {
  success: boolean;
  id?: string;
  error?: string;
}

const DEFAULT_FROM = process.env.EMAIL_FROM ?? "noreply@pantyhub.com";

export async function sendEmail(options: SendEmailOptions): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.warn("[email] RESEND_API_KEY not set — email not sent");
    return { success: false, error: "RESEND_API_KEY not configured" };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: options.from ?? DEFAULT_FROM,
        to: Array.isArray(options.to) ? options.to : [options.to],
        subject: options.subject,
        html: options.html,
        text: options.text,
        reply_to: options.replyTo,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error("[email] Resend error:", err);
      return { success: false, error: err.message ?? "Failed to send email" };
    }

    const data = await res.json();
    return { success: true, id: data.id };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[email] Send failed:", message);
    return { success: false, error: message };
  }
}
