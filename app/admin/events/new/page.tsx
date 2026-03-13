import Link from "next/link";
import EventForm from "../../_components/EventForm";
import { createEvent } from "@/app/actions/events";

export default function NewEventPage() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/events" className="font-cinzel text-xs text-parchment-dark opacity-40 hover:opacity-70 transition-opacity">
          ← Events
        </Link>
        <span className="text-dungeon-purple">/</span>
        <h1 className="font-cinzel text-gold-rune text-xl font-bold">New Event</h1>
      </div>
      <div className="bg-dungeon-dark border border-dungeon-purple rounded-xl p-6">
        <EventForm action={createEvent} />
      </div>
    </div>
  );
}
