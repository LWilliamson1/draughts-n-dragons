import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { enqueueEmail, processEmailQueue } from "@/lib/email/queue";
import { EmailType } from "@/app/generated/prisma/client";

/**
 * GET /api/jobs/schedule-reminders
 *
 * Daily email job — runs once a day at 11 am EST (16:00 UTC, see vercel.json).
 *
 * For each enabled ReminderCadence it converts hoursBefore to a day offset
 * (e.g. 168 h → 7 days, 24 h → 1 day, 2 h → 0 days / same day) and finds
 * events whose eventAt falls on that target calendar day.
 *
 * Same-day RSVP rule: if an attendee booked their spot on the same calendar
 * day as the event they do NOT receive a reminder — they just signed up and
 * already know about it.
 *
 * After queueing all reminders the handler drains the full EmailQueue so
 * there is no need for a separate process-emails cron job.
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
    // ── 1. Determine today's boundaries in UTC ────────────────────────────────
    // The server runs in UTC; eventAt is stored as local venue time without an
    // explicit timezone. Using UTC midnight boundaries is close enough for the
    // hour-level precision needed for reminder scheduling.
    const now = new Date();
    const todayStart = new Date(now);
    todayStart.setUTCHours(0, 0, 0, 0);

    const cadences = await prisma.reminderCadence.findMany({
      where: { enabled: true },
    });

    let totalQueued = 0;

    // ── 2. For each cadence, queue reminders for the matching day ─────────────
    for (const cadence of cadences) {
      // Convert hoursBefore to a whole-day offset
      // 168 h → 7 days, 24 h → 1 day, 2 h → 0 days (same day)
      const dayOffset = Math.round(cadence.hoursBefore / 24);

      const windowStart = new Date(todayStart.getTime() + dayOffset * 86_400_000);
      const windowEnd   = new Date(windowStart.getTime() + 86_400_000);

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
          // Same-day RSVP rule: skip attendees who booked today for a today event
          if (dayOffset === 0 && rsvp.createdAt >= todayStart) continue;

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
            scheduledAt: now,
            // Idempotency key: safe to re-run without sending duplicates
            idempotencyKey: `reminder:${cadence.id}:${rsvp.id}`,
          });
          totalQueued++;
        }
      }
    }

    // ── 3. Drain the full queue (reminders just added + any other pending) ────
    const { sent, failed, skipped } = await processEmailQueue();

    return NextResponse.json({ ok: true, queued: totalQueued, sent, failed, skipped });
  } catch (err) {
    console.error("[schedule-reminders] error:", err);
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}
