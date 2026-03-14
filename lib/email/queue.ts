import { prisma } from "@/lib/prisma";
import { EmailType, EmailStatus, Prisma } from "@/app/generated/prisma/client";
import { sendEmail } from "./index";
import { renderTemplate } from "./templates";

const MAX_ATTEMPTS = 3;
const BATCH_SIZE = 50;

/**
 * Add an email to the outbound queue.
 *
 * Supply an `idempotencyKey` to safely call this multiple times for the same
 * logical email (e.g. event reminders keyed by "reminder:{cadenceId}:{rsvpId}").
 * Duplicate keys are silently ignored.
 */
export async function enqueueEmail({
  to,
  type,
  payload,
  scheduledAt,
  idempotencyKey,
}: {
  to: string;
  type: EmailType;
  payload: Record<string, unknown>;
  scheduledAt?: Date;
  idempotencyKey?: string;
}) {
  return prisma.emailQueue.upsert({
    where: { idempotencyKey: idempotencyKey ?? `__none__${Date.now()}` },
    create: {
      to,
      subject: renderTemplate(type, payload).subject,
      type,
      payload: payload as Prisma.InputJsonValue,
      scheduledAt: scheduledAt ?? new Date(),
      idempotencyKey,
    },
    // Already exists — leave it untouched (idempotent)
    update: {},
  });
}

/**
 * Claim and send a batch of due emails.
 * Called by the /api/jobs/process-emails cron endpoint.
 *
 * Returns a summary: { sent, failed, skipped }
 */
export async function processEmailQueue(): Promise<{
  sent: number;
  failed: number;
  skipped: number;
}> {
  const now = new Date();
  let sent = 0, failed = 0, skipped = 0;

  // Claim a batch: mark as PROCESSING to prevent double-processing
  const claimed = await prisma.$transaction(async (tx) => {
    const items = await tx.emailQueue.findMany({
      where: {
        status: EmailStatus.PENDING,
        scheduledAt: { lte: now },
        attempts: { lt: MAX_ATTEMPTS },
      },
      take: BATCH_SIZE,
      orderBy: { scheduledAt: "asc" },
    });

    if (items.length === 0) return [];

    const ids = items.map((i) => i.id);
    await tx.emailQueue.updateMany({
      where: { id: { in: ids } },
      data: { status: EmailStatus.PROCESSING },
    });

    return items;
  });

  if (claimed.length === 0) return { sent: 0, failed: 0, skipped: 0 };

  // Send each email, then update its final status
  await Promise.all(
    claimed.map(async (item) => {
      const { error } = await sendEmail({
        to: item.to,
        type: item.type,
        payload: item.payload as Record<string, unknown>,
      });

      const newAttempts = item.attempts + 1;

      if (!error) {
        await prisma.emailQueue.update({
          where: { id: item.id },
          data: { status: EmailStatus.SENT, sentAt: new Date(), attempts: newAttempts },
        });
        sent++;
      } else {
        const exhausted = newAttempts >= MAX_ATTEMPTS;
        await prisma.emailQueue.update({
          where: { id: item.id },
          data: {
            status: exhausted ? EmailStatus.FAILED : EmailStatus.PENDING,
            attempts: newAttempts,
            error,
          },
        });
        exhausted ? failed++ : skipped++;
      }
    }),
  );

  return { sent, failed, skipped };
}
