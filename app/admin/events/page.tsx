import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DeleteButton from "../_components/DeleteButton";
import { deleteEvent } from "@/app/actions/events";

const MONTH_INDEX: Record<string, number> = {
  January: 1, February: 2, March: 3, April: 4, May: 5, June: 6,
  July: 7, August: 8, September: 9, October: 10, November: 11, December: 12,
};

export default async function AdminEventsPage() {
  const unsorted = await prisma.event.findMany();
  const events = unsorted.sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    const mDiff = (MONTH_INDEX[a.month] ?? 0) - (MONTH_INDEX[b.month] ?? 0);
    if (mDiff !== 0) return mDiff;
    return parseInt(a.date) - parseInt(b.date);
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-cinzel text-gold-rune text-2xl font-bold">Events</h1>
          <p className="font-im-fell text-parchment-dark opacity-50 text-sm mt-0.5">
            {events.length} event{events.length !== 1 ? "s" : ""} in the calendar
          </p>
        </div>
        <Link
          href="/admin/events/new"
          className="font-cinzel text-xs tracking-wider uppercase px-5 py-2.5 rounded-lg
            bg-gold-rune text-dungeon-dark font-bold hover:bg-gold-bright transition-colors"
        >
          + New Event
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-20 border border-dungeon-purple rounded-xl bg-dungeon-dark">
          <p className="font-im-fell text-parchment-dark opacity-50 text-lg italic">
            No events yet. Create your first event above.
          </p>
        </div>
      ) : (
        <div className="bg-dungeon-dark border border-dungeon-purple rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dungeon-purple">
                <th className="font-cinzel text-xs text-parchment-dark opacity-50 tracking-widest text-left px-4 py-3 uppercase">Date</th>
                <th className="font-cinzel text-xs text-parchment-dark opacity-50 tracking-widest text-left px-4 py-3 uppercase">Title</th>
                <th className="font-cinzel text-xs text-parchment-dark opacity-50 tracking-widest text-left px-4 py-3 uppercase hidden md:table-cell">Category</th>
                <th className="font-cinzel text-xs text-parchment-dark opacity-50 tracking-widest text-left px-4 py-3 uppercase hidden lg:table-cell">Price</th>
                <th className="font-cinzel text-xs text-parchment-dark opacity-50 tracking-widest text-left px-4 py-3 uppercase hidden lg:table-cell">Signups</th>
                <th className="font-cinzel text-xs text-parchment-dark opacity-50 tracking-widest text-left px-4 py-3 uppercase">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {events.map((event, i) => (
                <tr
                  key={event.id}
                  className={`border-b border-dungeon-purple last:border-0 hover:bg-dungeon-mid transition-colors ${
                    i % 2 === 0 ? "" : "bg-dungeon-black bg-opacity-30"
                  }`}
                >
                  <td className="px-4 py-3 font-cinzel text-gold-rune text-sm whitespace-nowrap">
                    {event.month} {event.date}, {event.year}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-cinzel text-parchment text-sm">{event.title}</div>
                    {event.featured && (
                      <span className="text-gold-rune text-xs font-im-fell italic">★ Featured</span>
                    )}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="font-cinzel text-xs text-arcane-violet">{event.category}</span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell font-im-fell text-parchment-dark opacity-60 text-sm">
                    {event.price}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell font-im-fell text-parchment-dark opacity-60 text-sm">
                    {event.capacity ? `${event.signups} / ${event.capacity}` : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block w-2 h-2 rounded-full mr-2 ${event.published ? "bg-green-500" : "bg-gray-500"}`} />
                    <span className="font-im-fell text-parchment-dark opacity-60 text-xs">
                      {event.published ? "Live" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3 justify-end">
                      <Link
                        href={`/admin/events/${event.id}/edit`}
                        className="font-cinzel text-xs text-arcane-violet hover:text-parchment transition-colors"
                      >
                        Edit
                      </Link>
                      <DeleteButton id={event.id} deleteAction={deleteEvent} label="event" />
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
