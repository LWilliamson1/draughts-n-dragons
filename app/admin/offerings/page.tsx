import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DeleteButton from "../_components/DeleteButton";
import { deleteOffering } from "@/app/actions/offerings";

export default async function AdminOfferingsPage() {
  const offerings = await prisma.offering.findMany({
    orderBy: { displayOrder: "asc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-cinzel text-gold-rune text-2xl font-bold">Offerings</h1>
          <p className="font-im-fell text-parchment-dark opacity-50 text-sm mt-0.5">
            {offerings.length} item{offerings.length !== 1 ? "s" : ""} in the wares catalogue
          </p>
        </div>
        <Link href="/admin/offerings/new"
          className="font-cinzel text-xs tracking-wider uppercase px-5 py-2.5 rounded-lg bg-gold-rune text-dungeon-dark font-bold hover:bg-gold-bright transition-colors">
          + New Offering
        </Link>
      </div>

      {offerings.length === 0 ? (
        <div className="text-center py-20 border border-dungeon-purple rounded-xl bg-dungeon-dark">
          <p className="font-im-fell text-parchment-dark opacity-50 text-lg italic">No offerings yet.</p>
        </div>
      ) : (
        <div className="bg-dungeon-dark border border-dungeon-purple rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dungeon-purple">
                <th className="font-cinzel text-xs text-parchment-dark opacity-50 tracking-widest text-left px-4 py-3 uppercase">Order</th>
                <th className="font-cinzel text-xs text-parchment-dark opacity-50 tracking-widest text-left px-4 py-3 uppercase">Title</th>
                <th className="font-cinzel text-xs text-parchment-dark opacity-50 tracking-widest text-left px-4 py-3 uppercase hidden md:table-cell">Badge</th>
                <th className="font-cinzel text-xs text-parchment-dark opacity-50 tracking-widest text-left px-4 py-3 uppercase">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {offerings.map((o, i) => (
                <tr key={o.id} className={`border-b border-dungeon-purple last:border-0 hover:bg-dungeon-mid transition-colors ${i % 2 === 0 ? "" : "bg-dungeon-black bg-opacity-30"}`}>
                  <td className="px-4 py-3 font-cinzel text-parchment-dark opacity-40 text-sm">{o.displayOrder}</td>
                  <td className="px-4 py-3">
                    <div className="font-cinzel text-parchment text-sm">{o.title}</div>
                    <div className="font-im-fell text-parchment-dark opacity-40 text-xs italic">{o.subtitle}</div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className={`event-tag font-cinzel text-xs ${o.badgeColor}`}>{o.badge}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block w-2 h-2 rounded-full mr-2 ${o.published ? "bg-green-500" : "bg-gray-500"}`} />
                    <span className="font-im-fell text-parchment-dark opacity-60 text-xs">{o.published ? "Live" : "Draft"}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3 justify-end">
                      <Link href={`/admin/offerings/${o.id}/edit`} className="font-cinzel text-xs text-arcane-violet hover:text-parchment transition-colors">Edit</Link>
                      <DeleteButton id={o.id} deleteAction={deleteOffering} label="offering" />
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
