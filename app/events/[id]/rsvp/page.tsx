import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import RsvpForm from "./RsvpForm";

const categoryColors: Record<string, string> = {
  WORKSHOP: "bg-arcane-purple text-parchment",
  TOURNAMENT: "bg-gold-rune text-dungeon-dark",
  "PINT NIGHT": "bg-tavern-brown text-parchment",
  CAMPAIGN: "bg-dragon-red text-parchment",
  COMMUNITY: "bg-dungeon-purple text-parchment",
};

export default async function RsvpPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const event = await prisma.event.findUnique({ where: { id, published: true } }).catch(() => null);

  if (!event) notFound();

  const isFull = event.capacity !== null && event.signups >= event.capacity;
  const spotsRemaining = event.capacity !== null ? event.capacity - event.signups : null;
  const isFree =
    event.price.toLowerCase().includes("free") || event.price.toLowerCase().includes("pint");

  return (
    <main className="min-h-screen bg-dungeon-dark text-parchment py-16 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Back link */}
        <Link
          href="/events"
          className="inline-flex items-center gap-1 font-cinzel text-xs tracking-widest uppercase
            text-parchment-dark opacity-50 hover:opacity-100 hover:text-arcane-violet transition-all mb-8"
        >
          ← Back to Events
        </Link>

        <div className="grid md:grid-cols-[1fr_380px] gap-8 items-start">

          {/* ── Event summary ───────────────────────────────────── */}
          <div className="bg-dungeon-mid border border-dungeon-purple rounded-2xl p-6 flex flex-col gap-4">

            <div className="flex items-start justify-between gap-4">
              <div className="text-4xl">{event.icon}</div>
              <span
                className={`font-cinzel text-xs tracking-widest uppercase px-2 py-1 rounded ${
                  categoryColors[event.category] ?? "bg-dungeon-purple text-parchment"
                }`}
              >
                {event.category}
              </span>
            </div>

            <div>
              <h1 className="font-cinzel text-parchment text-xl md:text-2xl font-bold leading-snug mb-1">
                {event.title}
              </h1>
              {event.featured && (
                <span className="font-im-fell text-gold-rune text-sm italic">★ Featured Event</span>
              )}
            </div>

            <div className="flex flex-col gap-1.5 text-sm font-im-fell text-parchment-dark opacity-70">
              <div className="flex items-center gap-2">
                <span className="opacity-50">📅</span>
                {event.dayOfWeek}, {event.month} {event.date}
              </div>
              <div className="flex items-center gap-2">
                <span className="opacity-50">🕐</span>
                {event.time}
              </div>
              <div className="flex items-center gap-2">
                <span className="opacity-50">💰</span>
                <span className="text-gold-rune font-bold">{event.price}</span>
              </div>
              {spotsRemaining !== null && (
                <div className="flex items-center gap-2">
                  <span className="opacity-50">🎟</span>
                  {isFull ? (
                    <span className="text-dragon-red font-bold">FULL — no spots remaining</span>
                  ) : (
                    <span>
                      {spotsRemaining} spot{spotsRemaining === 1 ? "" : "s"} remaining (of {event.capacity})
                    </span>
                  )}
                </div>
              )}
            </div>

            <p className="font-im-fell text-parchment-dark opacity-70 text-sm leading-relaxed border-t border-dungeon-purple pt-4">
              {event.description}
            </p>
          </div>

          {/* ── Checkout panel ──────────────────────────────────── */}
          <div className="bg-dungeon-mid border border-dungeon-purple rounded-2xl p-6">
            <h2 className="font-cinzel text-gold-rune text-lg font-bold mb-5">
              {isFull ? "Event Full" : "Reserve Your Spot"}
            </h2>

            {isFull ? (
              <div className="text-center py-6 flex flex-col items-center gap-3">
                <div className="text-4xl">⚔️</div>
                <p className="font-im-fell text-parchment-dark opacity-60 text-sm italic">
                  The adventuring party is full. Check back — cancellations sometimes open spots.
                </p>
                <Link
                  href="/events"
                  className="mt-2 font-cinzel text-xs tracking-wider uppercase px-5 py-2.5 rounded-lg
                    border border-arcane-violet text-arcane-violet
                    hover:bg-arcane-violet hover:text-parchment transition-all"
                >
                  Browse Other Events
                </Link>
              </div>
            ) : (
              <RsvpForm
                eventId={event.id}
                price={event.price}
                isFree={isFree}
                spotsRemaining={spotsRemaining}
              />
            )}
          </div>

        </div>
      </div>
    </main>
  );
}
