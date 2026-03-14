"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { sendEmail } from "@/lib/email";
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

  const isFree =
    !event.price ||
    event.price.toLowerCase() === "free" ||
    event.price === "£0" ||
    event.price === "$0";

  // Create RSVP + increment signups atomically
  await prisma.$transaction([
    prisma.rsvp.create({
      data: { eventId, userId: userId ?? null, name, email, quantity },
    }),
    prisma.event.update({
      where: { id: eventId },
      data: { signups: { increment: quantity } },
    }),
  ]);

  // Send confirmation immediately — transactional emails should not wait for
  // the daily cron. Errors are logged but do not fail the RSVP.
  const appUrl = process.env.NEXTAUTH_URL ?? "https://draughtsndragons.com";
  const dateLabel = `${event.dayOfWeek}, ${event.date} ${event.month} ${event.year}`;

  const { error: emailError } = await sendEmail({
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
  });
  if (emailError) console.error("[rsvp] confirmation email failed:", emailError);

  revalidatePath(`/events/${eventId}/rsvp`);
  revalidatePath("/events");
  revalidatePath("/account");

  return { success: true };
}
