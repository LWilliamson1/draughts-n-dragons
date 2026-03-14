import { Resend } from "resend";
import { EmailType } from "@/app/generated/prisma/client";
import { renderTemplate } from "./templates";

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
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const from = process.env.EMAIL_FROM ?? "Draughts & Dragons <noreply@draughtsndragons.com>";
    const { subject, html } = renderTemplate(type, payload);
    const { error } = await resend.emails.send({ from, to, subject, html });
    if (error) return { error: error.message };
    return {};
  } catch (err) {
    return { error: err instanceof Error ? err.message : String(err) };
  }
}
