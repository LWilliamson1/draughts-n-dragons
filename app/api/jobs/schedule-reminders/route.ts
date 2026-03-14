import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { enqueueEmail } from "@/lib/email/queue";
import { EmailType } from "@/app/generated/prisma/client";

/**
 * GET /api/jobs/schedule-reminders
 *
 * For every enabled ReminderCadence, finds events whose eventAt falls within
 * the cadence's window and enqueues EVENT_REMINDER emails for all RSVPs.
 *
 * Uses idempotency keys ("reminder:{cadenceId}:{rsvpId}") so this endpoint
 * can run repeatedly (e.g. every hour) without sending duplicate reminders.
 *
 * Protected by CRON_SECRET — the caller must send:
 *   Authorization: Bearer <CRON_SECRET>
 */
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers.get("authorization") ?? "";
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const appUrl = process.env.NEXTAUTH_URL ?? "https://draughtsndragons.com";

  try {
    const cadences = await prisma.reminderCadence.findMany({
      where: { enabled: true },
    });

    let totalQueued = 0;

    for (const cadence of cadences) {
      const now = new Date();
      // Window: events starting between (now + hoursBefore - 1h) and (now + hoursBefore)
      // Running hourly means each event×cadence pair is caught exactly once.
      const windowStart = new Date(now.getTime() + (cadence.hoursBefore - 1) * 60 * 60 * 1000);
      const windowEnd   = new Date(now.getTime() +  cadence.hoursBefore      * 60 * 60 * 1000);

      const events = await prisma.event.findMany({
        where: {
          published: true,
          eventAt: { gte: windowStart, lt: windowEnd },
        },
        include: { rsvps: true },
      });

      for (const event of events) {
        const dateLabel = event.eventAt
          ? event.eventAt.toLocaleDateString("en-GB", {
              weekday: "long", day: "numeric", month: "long", year: "numeric",
            })
          : `${event.dayOfWeek}, ${event.date} ${event.month} ${event.year}`;

        for (const rsvp of event.rsvps) {
          await enqueueEmail({
            to: rsvp.email,
            type: EmailType.EVENT_REMINDER,
            payload: {
              name: rsvp.name,
              eventTitle: event.title,
              eventDate: dateLabel,
              eventTime: event.time,
              eventDescription: event.description,
              quantity: rsvp.quantity,
              hoursUntil: cadence.hoursBefore,
              eventId: event.id,
              appUrl,
            },
            // Schedule the email to go out immediately (the queue processor sends it)
            scheduledAt: new Date(),
            // Idempotency key prevents duplicate reminders for this cadence+rsvp pair
            idempotencyKey: `reminder:${cadence.id}:${rsvp.id}`,
          });
          totalQueued++;
        }
      }
    }

    return NextResponse.json({ ok: true, queued: totalQueued });
  } catch (err) {
    console.error("[schedule-reminders] error:", err);
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}
