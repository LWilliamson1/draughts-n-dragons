import Link from "next/link";
import AnnouncementForm from "../../_components/AnnouncementForm";
import { createAnnouncement } from "@/app/actions/announcements";

export default function NewAnnouncementPage() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/announcements" className="font-cinzel text-xs text-parchment-dark opacity-40 hover:opacity-70 transition-opacity">
          ← Announcements
        </Link>
        <span className="text-dungeon-purple">/</span>
        <h1 className="font-cinzel text-gold-rune text-xl font-bold">New Announcement</h1>
      </div>
      <div className="bg-dungeon-dark border border-dungeon-purple rounded-xl p-6">
        <AnnouncementForm action={createAnnouncement} />
      </div>
    </div>
  );
}
