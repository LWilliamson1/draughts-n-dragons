"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createRsvp(
  eventId: string,
  name: string,
  email: string,
  tickets: number,
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("You must be signed in to RSVP.");

  const userId = session.user.id;

  const event = await prisma.event.findUnique({ where: { id: eventId, published: true } });
  if (!event) throw new Error("Event not found.");

  if (event.capacity !== null && event.signups + tickets > event.capacity) {
    throw new Error("Not enough spots remaining.");
  }

  const existing = await prisma.rsvp.findUnique({
    where: { userId_eventId: { userId, eventId } },
  });
  if (existing) throw new Error("You have already RSVPed to this event.");

  await prisma.$transaction([
    prisma.rsvp.create({ data: { userId, eventId, name, email, tickets } }),
    prisma.event.update({
      where: { id: eventId },
      data: { signups: { increment: tickets } },
    }),
  ]);

  revalidatePath(`/events/${eventId}/rsvp`);
  revalidatePath("/events");
  revalidatePath("/account");
}
