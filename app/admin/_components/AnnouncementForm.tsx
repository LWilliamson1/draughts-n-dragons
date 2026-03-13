"use client";

import { useState, useTransition } from "react";
import type { AnnouncementFormData } from "@/app/actions/announcements";
import type { Announcement } from "@/app/generated/prisma/client";

const TYPE_OPTIONS = [
  { value: "EVENT", color: "bg-arcane-purple text-parchment" },
  { value: "NEW ARRIVAL", color: "bg-gold-rune text-dungeon-dark" },
  { value: "ANNOUNCEMENT", color: "bg-dungeon-purple text-parchment" },
  { value: "COMMUNITY", color: "bg-dragon-red text-parchment" },
];

interface Props {
  announcement?: Announcement;
  action: (data: AnnouncementFormData) => Promise<void>;
}

export default function AnnouncementForm({ announcement, action }: Props) {
  const [pending, startTransition] = useTransition();
  const defaultType = TYPE_OPTIONS[0];
  const [form, setForm] = useState<AnnouncementFormData>({
    type: announcement?.type ?? defaultType.value,
    typeColor: announcement?.typeColor ?? defaultType.color,
    date: announcement?.date ?? "",
    title: announcement?.title ?? "",
    body: announcement?.body ?? "",
    icon: announcement?.icon ?? "📢",
    pinned: announcement?.pinned ?? false,
    published: announcement?.published ?? true,
    displayOrder: String(announcement?.displayOrder ?? 0),
  });

  function set(key: keyof AnnouncementFormData, value: string | boolean) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleTypeChange(value: string) {
    const match = TYPE_OPTIONS.find((t) => t.value === value);
    setForm((prev) => ({ ...prev, type: value, typeColor: match?.color ?? prev.typeColor }));
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
        <Field label="Type">
          <select value={form.type} onChange={(e) => handleTypeChange(e.target.value)} className={inputCls}>
            {TYPE_OPTIONS.map((t) => <option key={t.value} value={t.value}>{t.value}</option>)}
          </select>
        </Field>
        <Field label="Date" hint='e.g. "March 21, 2026"'>
          <input value={form.date} onChange={(e) => set("date", e.target.value)} required placeholder="March 21, 2026" className={inputCls} />
        </Field>
      </div>

      <Field label="Title">
        <input value={form.title} onChange={(e) => set("title", e.target.value)} required className={inputCls} />
      </Field>

      <Field label="Body">
        <textarea value={form.body} onChange={(e) => set("body", e.target.value)} rows={4} required className={`${inputCls} resize-y`} />
      </Field>

      <div className="grid grid-cols-3 gap-4">
        <Field label="Icon (emoji)">
          <input value={form.icon} onChange={(e) => set("icon", e.target.value)} className={inputCls} />
        </Field>
        <Field label="Display Order">
          <input type="number" value={form.displayOrder} onChange={(e) => set("displayOrder", e.target.value)} className={inputCls} />
        </Field>
        <div className="space-y-3 pt-6">
          <div className="flex items-center gap-3">
            <input type="checkbox" id="pinned" checked={form.pinned} onChange={(e) => set("pinned", e.target.checked)} className="accent-gold-rune w-4 h-4" />
            <label htmlFor="pinned" className="font-cinzel text-xs text-parchment-dark opacity-70 tracking-wide uppercase cursor-pointer">Pinned</label>
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="pub" checked={form.published} onChange={(e) => set("published", e.target.checked)} className="accent-gold-rune w-4 h-4" />
            <label htmlFor="pub" className="font-cinzel text-xs text-parchment-dark opacity-70 tracking-wide uppercase cursor-pointer">Published</label>
          </div>
        </div>
      </div>

      <div className="flex gap-4 pt-2">
        <button type="submit" disabled={pending}
          className="font-cinzel text-sm tracking-wider uppercase px-6 py-2.5 rounded-lg bg-gold-rune text-dungeon-dark font-bold hover:bg-gold-bright disabled:opacity-50 transition-all">
          {pending ? "Saving…" : "Save Announcement"}
        </button>
        <a href="/admin/announcements" className="font-cinzel text-sm tracking-wide uppercase px-6 py-2.5 rounded-lg border border-dungeon-purple text-parchment-dark opacity-60 hover:opacity-100 transition-opacity">
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
