/**
 * Email HTML templates.
 * Returns { subject, html, text } for each template type.
 */

interface TemplateResult {
  subject: string;
  html: string;
  text: string;
}

const BRAND = "PantyHub";

export function welcomeEmail(name: string): TemplateResult {
  return {
    subject: `Welcome to ${BRAND}!`,
    html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h1 style="color: #111; font-size: 24px;">Welcome to ${BRAND}</h1>
  <p style="color: #555; font-size: 16px; line-height: 1.6;">
    Hi ${name},
  </p>
  <p style="color: #555; font-size: 16px; line-height: 1.6;">
    Thanks for signing up! We are excited to have you on board.
  </p>
  <p style="color: #555; font-size: 16px; line-height: 1.6;">
    If you have any questions, just reply to this email.
  </p>
  <p style="color: #999; font-size: 14px; margin-top: 40px;">
    — The ${BRAND} Team
  </p>
</body>
</html>`,
    text: `Welcome to ${BRAND}!\n\nHi ${name},\n\nThanks for signing up! We are excited to have you on board.\n\nIf you have any questions, just reply to this email.\n\n— The ${BRAND} Team`,
  };
}

export function notificationDigestEmail(
  name: string,
  items: Array<{ title: string; body?: string; link?: string }>
): TemplateResult {
  const itemsHtml = items
    .map(
      (item) =>
        `<li style="margin-bottom: 12px;">
          <strong>${item.title}</strong>
          ${item.body ? `<br /><span style="color: #555;">${item.body}</span>` : ""}
          ${item.link ? `<br /><a href="${item.link}" style="color: #2563eb;">View</a>` : ""}
        </li>`
    )
    .join("");

  const itemsText = items
    .map(
      (item) =>
        `- ${item.title}${item.body ? ": " + item.body : ""}${item.link ? " (" + item.link + ")" : ""}`
    )
    .join("\n");

  return {
    subject: `Your ${BRAND} notification digest`,
    html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h1 style="color: #111; font-size: 24px;">Notification Digest</h1>
  <p style="color: #555; font-size: 16px;">Hi ${name}, here is what you missed:</p>
  <ul style="color: #333; font-size: 14px; line-height: 1.8; padding-left: 20px;">
    ${itemsHtml}
  </ul>
  <p style="color: #999; font-size: 14px; margin-top: 40px;">
    — The ${BRAND} Team
  </p>
</body>
</html>`,
    text: `Notification Digest\n\nHi ${name}, here is what you missed:\n\n${itemsText}\n\n— The ${BRAND} Team`,
  };
}
