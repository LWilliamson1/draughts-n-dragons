import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DeleteButton from "../_components/DeleteButton";
import { deleteAnnouncement } from "@/app/actions/announcements";

export default async function AdminAnnouncementsPage() {
  const announcements = await prisma.announcement.findMany({
    orderBy: [{ pinned: "desc" }, { displayOrder: "asc" }],
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-cinzel text-gold-rune text-2xl font-bold">Announcements</h1>
          <p className="font-im-fell text-parchment-dark opacity-50 text-sm mt-0.5">
            Shown on the home page news feed
          </p>
        </div>
        <Link href="/admin/announcements/new"
          className="font-cinzel text-xs tracking-wider uppercase px-5 py-2.5 rounded-lg bg-gold-rune text-dungeon-dark font-bold hover:bg-gold-bright transition-colors">
          + New Announcement
        </Link>
      </div>

      {announcements.length === 0 ? (
        <div className="text-center py-20 border border-dungeon-purple rounded-xl bg-dungeon-dark">
          <p className="font-im-fell text-parchment-dark opacity-50 text-lg italic">No announcements yet.</p>
        </div>
      ) : (
        <div className="bg-dungeon-dark border border-dungeon-purple rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dungeon-purple">
                <th className="font-cinzel text-xs text-parchment-dark opacity-50 tracking-widest text-left px-4 py-3 uppercase">Type</th>
                <th className="font-cinzel text-xs text-parchment-dark opacity-50 tracking-widest text-left px-4 py-3 uppercase">Title</th>
                <th className="font-cinzel text-xs text-parchment-dark opacity-50 tracking-widest text-left px-4 py-3 uppercase hidden md:table-cell">Date</th>
                <th className="font-cinzel text-xs text-parchment-dark opacity-50 tracking-widest text-left px-4 py-3 uppercase">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {announcements.map((a, i) => (
                <tr key={a.id} className={`border-b border-dungeon-purple last:border-0 hover:bg-dungeon-mid transition-colors ${i % 2 === 0 ? "" : "bg-dungeon-black bg-opacity-30"}`}>
                  <td className="px-4 py-3">
                    <span className={`event-tag font-cinzel text-xs ${a.typeColor}`}>{a.type}</span>
                    {a.pinned && <span className="ml-2 text-gold-rune text-xs">📌</span>}
                  </td>
                  <td className="px-4 py-3 font-cinzel text-parchment text-sm">{a.title}</td>
                  <td className="px-4 py-3 hidden md:table-cell font-im-fell text-parchment-dark opacity-50 text-sm italic">{a.date}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block w-2 h-2 rounded-full mr-2 ${a.published ? "bg-green-500" : "bg-gray-500"}`} />
                    <span className="font-im-fell text-parchment-dark opacity-60 text-xs">{a.published ? "Live" : "Draft"}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3 justify-end">
                      <Link href={`/admin/announcements/${a.id}/edit`} className="font-cinzel text-xs text-arcane-violet hover:text-parchment transition-colors">Edit</Link>
                      <DeleteButton id={a.id} deleteAction={deleteAnnouncement} label="announcement" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
