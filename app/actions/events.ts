"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

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

export async function createEvent(data: EventFormData) {
  await prisma.event.create({
    data: {
      date: data.date,
      dayOfWeek: data.dayOfWeek,
      month: data.month,
      year: parseInt(data.year) || 2026,
      title: data.title,
      time: data.time,
      category: data.category,
      description: data.description,
      icon: data.icon,
      price: data.price,
      capacity: data.capacity ? parseInt(data.capacity) : null,
      signups: parseInt(data.signups) || 0,
      featured: data.featured,
      published: data.published,
      displayOrder: parseInt(data.displayOrder) || 0,
    },
  });
  revalidatePath("/events");
  revalidatePath("/admin/events");
  redirect("/admin/events");
}

export async function updateEvent(id: string, data: EventFormData) {
  await prisma.event.update({
    where: { id },
    data: {
      date: data.date,
      dayOfWeek: data.dayOfWeek,
      month: data.month,
      year: parseInt(data.year) || 2026,
      title: data.title,
      time: data.time,
      category: data.category,
      description: data.description,
      icon: data.icon,
      price: data.price,
      capacity: data.capacity ? parseInt(data.capacity) : null,
      signups: parseInt(data.signups) || 0,
      featured: data.featured,
      published: data.published,
      displayOrder: parseInt(data.displayOrder) || 0,
    },
  });
  revalidatePath("/events");
  revalidatePath("/admin/events");
  redirect("/admin/events");
}

export async function deleteEvent(id: string) {
  await prisma.event.delete({ where: { id } });
  revalidatePath("/events");
  revalidatePath("/admin/events");
}
