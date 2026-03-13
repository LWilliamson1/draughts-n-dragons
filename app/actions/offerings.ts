"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export interface OfferingFormData {
  iconType: string;
  title: string;
  subtitle: string;
  tagline: string;
  description: string;
  features: string; // newline-separated
  cta: string;
  ctaHref: string;
  badge: string;
  badgeColor: string;
  accentColor: string;
  displayOrder: string;
  published: boolean;
}

function parseFeatures(raw: string): string[] {
  return raw
    .split("\n")
    .map((f) => f.trim())
    .filter(Boolean);
}

export async function createOffering(data: OfferingFormData) {
  await prisma.offering.create({
    data: {
      iconType: data.iconType,
      title: data.title,
      subtitle: data.subtitle,
      tagline: data.tagline,
      description: data.description,
      features: parseFeatures(data.features),
      cta: data.cta,
      ctaHref: data.ctaHref,
      badge: data.badge,
      badgeColor: data.badgeColor,
      accentColor: data.accentColor,
      displayOrder: parseInt(data.displayOrder) || 0,
      published: data.published,
    },
  });
  revalidatePath("/offerings");
  revalidatePath("/admin/offerings");
  redirect("/admin/offerings");
}

export async function updateOffering(id: string, data: OfferingFormData) {
  await prisma.offering.update({
    where: { id },
    data: {
      iconType: data.iconType,
      title: data.title,
      subtitle: data.subtitle,
      tagline: data.tagline,
      description: data.description,
      features: parseFeatures(data.features),
      cta: data.cta,
      ctaHref: data.ctaHref,
      badge: data.badge,
      badgeColor: data.badgeColor,
      accentColor: data.accentColor,
      displayOrder: parseInt(data.displayOrder) || 0,
      published: data.published,
    },
  });
  revalidatePath("/offerings");
  revalidatePath("/admin/offerings");
  redirect("/admin/offerings");
}

export async function deleteOffering(id: string) {
  await prisma.offering.delete({ where: { id } });
  revalidatePath("/offerings");
  revalidatePath("/admin/offerings");
}
