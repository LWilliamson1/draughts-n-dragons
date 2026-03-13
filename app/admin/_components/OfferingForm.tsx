"use client";

import { useState, useTransition } from "react";
import type { OfferingFormData } from "@/app/actions/offerings";
import type { Offering } from "@/app/generated/prisma/client";

const ICON_TYPES = [
  { value: "dragon", label: "🐉 Dragon (Minis & Terrain)" },
  { value: "goblet", label: "🍺 Goblet (Bar)" },
  { value: "paintbrush", label: "🎨 Paintbrush (Paints)" },
  { value: "card", label: "🃏 Card (TCG)" },
  { value: "shield", label: "🛡️ Shield (Board Games)" },
  { value: "magic", label: "✨ Magic Star (Events)" },
];

const BADGE_COLORS = [
  { value: "bg-gold-rune text-dungeon-dark", label: "Gold" },
  { value: "bg-dragon-red text-parchment", label: "Red" },
  { value: "bg-arcane-purple text-parchment", label: "Purple" },
  { value: "bg-dungeon-purple text-parchment", label: "Dark Purple" },
  { value: "bg-tavern-brown text-parchment", label: "Brown" },
];

interface Props {
  offering?: Offering;
  action: (data: OfferingFormData) => Promise<void>;
}

export default function OfferingForm({ offering, action }: Props) {
  const [pending, startTransition] = useTransition();
  const [form, setForm] = useState<OfferingFormData>({
    iconType: offering?.iconType ?? "dragon",
    title: offering?.title ?? "",
    subtitle: offering?.subtitle ?? "",
    tagline: offering?.tagline ?? "",
    description: offering?.description ?? "",
    features: offering?.features.join("\n") ?? "",
    cta: offering?.cta ?? "",
    ctaHref: offering?.ctaHref ?? "#",
    badge: offering?.badge ?? "",
    badgeColor: offering?.badgeColor ?? "bg-gold-rune text-dungeon-dark",
    accentColor: offering?.accentColor ?? "#d4af37",
    displayOrder: String(offering?.displayOrder ?? 0),
    published: offering?.published ?? true,
  });

  function set(key: keyof OfferingFormData, value: string | boolean) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        startTransition(() => action(form));
      }}
      className="space-y-5 max-w-2xl"
    >
      <div className="grid grid-cols-2 gap-4">
        <Field label="Icon Type">
          <select value={form.iconType} onChange={(e) => set("iconType", e.target.value)} className={inputCls}>
            {ICON_TYPES.map((i) => <option key={i.value} value={i.value}>{i.label}</option>)}
          </select>
        </Field>
        <Field label="Display Order">
          <input type="number" value={form.displayOrder} onChange={(e) => set("displayOrder", e.target.value)} className={inputCls} />
        </Field>
      </div>

      <Field label="Title">
        <input value={form.title} onChange={(e) => set("title", e.target.value)} required className={inputCls} />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Subtitle">
          <input value={form.subtitle} onChange={(e) => set("subtitle", e.target.value)} placeholder="The Armoury" className={inputCls} />
        </Field>
        <Field label="Tagline">
          <input value={form.tagline} onChange={(e) => set("tagline", e.target.value)} placeholder="Forge Your Legend" className={inputCls} />
        </Field>
      </div>

      <Field label="Description">
        <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={3} required className={`${inputCls} resize-y`} />
      </Field>

      <Field label="Features" hint="one per line">
        <textarea value={form.features} onChange={(e) => set("features", e.target.value)} rows={6} className={`${inputCls} resize-y`} placeholder={"Reaper Miniatures\nGames Workshop range\n3D printed pieces"} />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="CTA Button Text">
          <input value={form.cta} onChange={(e) => set("cta", e.target.value)} placeholder="Browse the Armoury" className={inputCls} />
        </Field>
        <Field label="CTA Link">
          <input value={form.ctaHref} onChange={(e) => set("ctaHref", e.target.value)} placeholder="#minis" className={inputCls} />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Badge Text">
          <input value={form.badge} onChange={(e) => set("badge", e.target.value)} placeholder="IN STORE" className={inputCls} />
        </Field>
        <Field label="Badge Colour">
          <select value={form.badgeColor} onChange={(e) => set("badgeColor", e.target.value)} className={inputCls}>
            {BADGE_COLORS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </Field>
      </div>

      <Field label="Accent Colour (hex)" hint="used for borders and hover effects">
        <div className="flex gap-2 items-center">
          <input type="color" value={form.accentColor} onChange={(e) => set("accentColor", e.target.value)} className="w-10 h-10 rounded border border-dungeon-purple bg-dungeon-black cursor-pointer" />
          <input value={form.accentColor} onChange={(e) => set("accentColor", e.target.value)} className={`${inputCls} flex-1`} placeholder="#d4af37" />
        </div>
      </Field>

      <div className="flex items-center gap-3">
        <input type="checkbox" id="pub" checked={form.published} onChange={(e) => set("published", e.target.checked)} className="accent-gold-rune w-4 h-4" />
        <label htmlFor="pub" className="font-cinzel text-xs text-parchment-dark opacity-70 tracking-wide uppercase cursor-pointer">Published</label>
      </div>

      <div className="flex gap-4 pt-2">
        <button type="submit" disabled={pending}
          className="font-cinzel text-sm tracking-wider uppercase px-6 py-2.5 rounded-lg bg-gold-rune text-dungeon-dark font-bold hover:bg-gold-bright disabled:opacity-50 transition-all">
          {pending ? "Saving…" : "Save Offering"}
        </button>
        <a href="/admin/offerings" className="font-cinzel text-sm tracking-wide uppercase px-6 py-2.5 rounded-lg border border-dungeon-purple text-parchment-dark opacity-60 hover:opacity-100 transition-opacity">
          Cancel
        </a>
      </div>
    </form>
  );
}

const inputCls = "w-full bg-dungeon-black border border-dungeon-purple rounded-lg px-4 py-2.5 text-parchment font-im-fell focus:outline-none focus:border-gold-rune transition-colors";

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block font-cinzel text-xs tracking-widest text-parchment-dark opacity-60 uppercase mb-1.5">
        {label} {hint && <span className="normal-case opacity-50 font-im-fell italic">— {hint}</span>}
      </label>
      {children}
    </div>
  );
}
