import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AnnouncementForm from "../../../_components/AnnouncementForm";
import { updateAnnouncement } from "@/app/actions/announcements";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditAnnouncementPage({ params }: Props) {
  const { id } = await params;
  const announcement = await prisma.announcement.findUnique({ where: { id } });
  if (!announcement) notFound();

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/announcements" className="font-cinzel text-xs text-parchment-dark opacity-40 hover:opacity-70 transition-opacity">
          ← Announcements
        </Link>
        <span className="text-dungeon-purple">/</span>
        <h1 className="font-cinzel text-gold-rune text-xl font-bold">Edit Announcement</h1>
      </div>
      <div className="bg-dungeon-dark border border-dungeon-purple rounded-xl p-6">
        <AnnouncementForm announcement={announcement} action={updateAnnouncement.bind(null, id)} />
      </div>
    </div>
  );
}
