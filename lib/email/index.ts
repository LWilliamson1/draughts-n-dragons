import { Resend } from "resend";
import { EmailType } from "@/app/generated/prisma/client";
import { renderTemplate } from "./templates";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM =
  process.env.EMAIL_FROM ?? "Draughts & Dragons <noreply@draughtsndragons.com>";

/**
 * Render and send a single email via Resend.
 * Returns { error } if sending failed, or {} on success.
 */
export async function sendEmail({
  to,
  type,
  payload,
}: {
  to: string;
  type: EmailType;
  payload: Record<string, unknown>;
}): Promise<{ error?: string }> {
  const { subject, html } = renderTemplate(type, payload);

  try {
    const { error } = await resend.emails.send({ from: FROM, to, subject, html });
    if (error) return { error: error.message };
    return {};
  } catch (err) {
    return { error: err instanceof Error ? err.message : String(err) };
  }
}
