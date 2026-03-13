"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export interface AnnouncementFormData {
  type: string;
  typeColor: string;
  date: string;
  title: string;
  body: string;
  icon: string;
  pinned: boolean;
  published: boolean;
  displayOrder: string;
}

export async function createAnnouncement(data: AnnouncementFormData) {
  await prisma.announcement.create({
    data: {
      type: data.type,
      typeColor: data.typeColor,
      date: data.date,
      title: data.title,
      body: data.body,
      icon: data.icon,
      pinned: data.pinned,
      published: data.published,
      displayOrder: parseInt(data.displayOrder) || 0,
    },
  });
  revalidatePath("/");
  revalidatePath("/admin/announcements");
  redirect("/admin/announcements");
}

export async function updateAnnouncement(id: string, data: AnnouncementFormData) {
  await prisma.announcement.update({
    where: { id },
    data: {
      type: data.type,
      typeColor: data.typeColor,
      date: data.date,
      title: data.title,
      body: data.body,
      icon: data.icon,
      pinned: data.pinned,
      published: data.published,
      displayOrder: parseInt(data.displayOrder) || 0,
    },
  });
  revalidatePath("/");
  revalidatePath("/admin/announcements");
  redirect("/admin/announcements");
}

export async function deleteAnnouncement(id: string) {
  await prisma.announcement.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/announcements");
}
