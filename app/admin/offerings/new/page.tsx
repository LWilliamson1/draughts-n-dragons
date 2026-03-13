import Link from "next/link";
import OfferingForm from "../../_components/OfferingForm";
import { createOffering } from "@/app/actions/offerings";

export default function NewOfferingPage() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/offerings" className="font-cinzel text-xs text-parchment-dark opacity-40 hover:opacity-70 transition-opacity">
          ← Offerings
        </Link>
        <span className="text-dungeon-purple">/</span>
        <h1 className="font-cinzel text-gold-rune text-xl font-bold">New Offering</h1>
      </div>
      <div className="bg-dungeon-dark border border-dungeon-purple rounded-xl p-6">
        <OfferingForm action={createOffering} />
      </div>
    </div>
  );
}
