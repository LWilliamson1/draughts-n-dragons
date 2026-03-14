"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { enqueueEmail } from "@/lib/email/queue";
import { EmailType } from "@/app/generated/prisma/client";

export async function createRsvp({
  eventId,
  userId,
  name,
  email,
  quantity,
}: {
  eventId: string;
  userId?: string | null;
  name: string;
  email: string;
  quantity: number;
}): Promise<{ success?: true; error?: string }> {
  // Prevent duplicate RSVP for signed-in users
  if (userId) {
    const existing = await prisma.rsvp.findUnique({
      where: { userId_eventId: { userId, eventId } },
    });
    if (existing) return { error: "You have already RSVPed to this event." };
  }

  // Check capacity + fetch event details for the confirmation email
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: {
      capacity: true, signups: true,
      title: true, date: true, dayOfWeek: true, month: true, year: true,
      time: true, description: true, price: true,
    },
  });
  if (!event) return { error: "Event not found." };
  if (event.capacity !== null && event.signups + quantity > event.capacity) {
    return { error: "Not enough spots remaining." };
  }

  const isFree = !event.price || event.price.toLowerCase() === "free" || event.price === "£0" || event.price === "$0";

  // Create RSVP + increment signups atomically
  const [rsvp] = await prisma.$transaction([
    prisma.rsvp.create({
      data: { eventId, userId: userId ?? null, name, email, quantity },
    }),
    prisma.event.update({
      where: { id: eventId },
      data: { signups: { increment: quantity } },
    }),
  ]);

  // Enqueue confirmation email (fire-and-forget — does not block the response)
  const appUrl = process.env.NEXTAUTH_URL ?? "https://draughtsndragons.com";
  const dateLabel = `${event.dayOfWeek}, ${event.date} ${event.month} ${event.year}`;

  await enqueueEmail({
    to: email,
    type: EmailType.RSVP_CONFIRMATION,
    payload: {
      name,
      eventTitle: event.title,
      eventDate: dateLabel,
      eventTime: event.time,
      eventDescription: event.description,
      quantity,
      price: event.price,
      isFree,
      eventId,
      appUrl,
    },
    idempotencyKey: `rsvp-confirm:${rsvp.id}`,
  });

  revalidatePath(`/events/${eventId}/rsvp`);
  revalidatePath("/events");
  revalidatePath("/account");

  return { success: true };
}
