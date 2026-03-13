import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import EventForm from "../../../_components/EventForm";
import { updateEvent } from "@/app/actions/events";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditEventPage({ params }: Props) {
  const { id } = await params;
  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) notFound();

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/events" className="font-cinzel text-xs text-parchment-dark opacity-40 hover:opacity-70 transition-opacity">
          ← Events
        </Link>
        <span className="text-dungeon-purple">/</span>
        <h1 className="font-cinzel text-gold-rune text-xl font-bold">Edit Event</h1>
      </div>
      <div className="bg-dungeon-dark border border-dungeon-purple rounded-xl p-6">
        <EventForm event={event} action={updateEvent.bind(null, id)} />
      </div>
    </div>
  );
}
