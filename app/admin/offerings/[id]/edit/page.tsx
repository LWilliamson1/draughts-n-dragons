import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import OfferingForm from "../../../_components/OfferingForm";
import { updateOffering } from "@/app/actions/offerings";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditOfferingPage({ params }: Props) {
  const { id } = await params;
  const offering = await prisma.offering.findUnique({ where: { id } });
  if (!offering) notFound();

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/offerings" className="font-cinzel text-xs text-parchment-dark opacity-40 hover:opacity-70 transition-opacity">
          ← Offerings
        </Link>
        <span className="text-dungeon-purple">/</span>
        <h1 className="font-cinzel text-gold-rune text-xl font-bold">Edit Offering</h1>
      </div>
      <div className="bg-dungeon-dark border border-dungeon-purple rounded-xl p-6">
        <OfferingForm offering={offering} action={(data) => updateOffering(id, data)} />
      </div>
    </div>
  );
}
