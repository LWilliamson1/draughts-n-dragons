"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { parseEventDateTime } from "@/lib/event-datetime";

export interface EventFormData {
  date: string;
  dayOfWeek: string;
  month: string;
  year: string;
  title: string;
  time: string;
  category: string;
  description: string;
  icon: string;
  price: string;
  capacity: string;
  signups: string;
  featured: boolean;
  published: boolean;
  displayOrder: string;
}

function buildEventData(data: EventFormData) {
  const year = parseInt(data.year) || 2026;
  return {
    date: data.date,
    dayOfWeek: data.dayOfWeek,
    month: data.month,
    year,
    title: data.title,
    time: data.time,
    eventAt: parseEventDateTime(data.date, data.month, year, data.time),
    category: data.category,
    description: data.description,
    icon: data.icon,
    price: data.price,
    capacity: data.capacity ? parseInt(data.capacity) : null,
    signups: parseInt(data.signups) || 0,
    featured: data.featured,
    published: data.published,
    displayOrder: parseInt(data.displayOrder) || 0,
  };
}

export async function createEvent(data: EventFormData) {
  await prisma.event.create({ data: buildEventData(data) });
  revalidatePath("/events");
  revalidatePath("/admin/events");
  redirect("/admin/events");
}

export async function updateEvent(id: string, data: EventFormData) {
  await prisma.event.update({ where: { id }, data: buildEventData(data) });
  revalidatePath("/events");
  revalidatePath("/admin/events");
  redirect("/admin/events");
}

export async function deleteEvent(id: string) {
  await prisma.event.delete({ where: { id } });
  revalidatePath("/events");
  revalidatePath("/admin/events");
}
