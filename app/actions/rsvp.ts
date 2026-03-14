"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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

  // Check capacity
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: { capacity: true, signups: true },
  });
  if (!event) return { error: "Event not found." };
  if (event.capacity !== null && event.signups + quantity > event.capacity) {
    return { error: "Not enough spots remaining." };
  }

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

  revalidatePath(`/events/${eventId}/rsvp`);
  revalidatePath("/events");
  revalidatePath("/account");

  return { success: true };
}
