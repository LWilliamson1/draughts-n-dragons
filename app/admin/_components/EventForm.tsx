"use client";

import { useState, useTransition } from "react";
import type { EventFormData } from "@/app/actions/events";
import type { Event } from "@/app/generated/prisma/client";

const CATEGORIES = ["WORKSHOP", "TOURNAMENT", "PINT NIGHT", "CAMPAIGN", "COMMUNITY"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

interface Props {
  event?: Event;
  action: (data: EventFormData) => Promise<void>;
}

export default function EventForm({ event, action }: Props) {
  const [pending, startTransition] = useTransition();
  const [form, setForm] = useState<EventFormData>({
    date: event?.date ?? "",
    dayOfWeek: event?.dayOfWeek ?? "",
    month: event?.month ?? "March",
    year: String(event?.year ?? 2026),
    title: event?.title ?? "",
    time: event?.time ?? "",
    category: event?.category ?? "WORKSHOP",
    description: event?.description ?? "",
    icon: event?.icon ?? "🎲",
    price: event?.price ?? "FREE",
    capacity: event?.capacity != null ? String(event.capacity) : "",
    signups: String(event?.signups ?? 0),
    featured: event?.featured ?? false,
    published: event?.published ?? true,
    displayOrder: String(event?.displayOrder ?? 0),
  });

  function set(key: keyof EventFormData, value: string | boolean) {
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
        <Field label="Day Number" hint="e.g. 21">
          <input value={form.date} onChange={(e) => set("date", e.target.value)} required className={inputCls} />
        </Field>
        <Field label="Day of Week">
          <input value={form.dayOfWeek} onChange={(e) => set("dayOfWeek", e.target.value)} required placeholder="Saturday" className={inputCls} />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Month">
          <select value={form.month} onChange={(e) => set("month", e.target.value)} className={inputCls}>
            {MONTHS.map((m) => <option key={m}>{m}</option>)}
          </select>
        </Field>
        <Field label="Year">
          <input type="number" value={form.year} onChange={(e) => set("year", e.target.value)} className={inputCls} />
        </Field>
      </div>

      <Field label="Title">
        <input value={form.title} onChange={(e) => set("title", e.target.value)} required className={inputCls} />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Time">
          <input value={form.time} onChange={(e) => set("time", e.target.value)} placeholder="7:00 PM – 11:00 PM" className={inputCls} />
        </Field>
        <Field label="Category">
          <select value={form.category} onChange={(e) => set("category", e.target.value)} className={inputCls}>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </Field>
      </div>

      <Field label="Description">
        <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={4} required className={`${inputCls} resize-y`} />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Icon (emoji)">
          <input value={form.icon} onChange={(e) => set("icon", e.target.value)} className={inputCls} />
        </Field>
        <Field label="Price">
          <input value={form.price} onChange={(e) => set("price", e.target.value)} placeholder="$5 Entry" className={inputCls} />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Capacity" hint="leave blank for unlimited">
          <input type="number" min="1" value={form.capacity} onChange={(e) => set("capacity", e.target.value)} placeholder="—" className={inputCls} />
        </Field>
        <Field label="Current Signups">
          <input type="number" min="0" value={form.signups} onChange={(e) => set("signups", e.target.value)} className={inputCls} />
        </Field>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Field label="Display Order">
          <input type="number" value={form.displayOrder} onChange={(e) => set("displayOrder", e.target.value)} className={inputCls} />
        </Field>
        <div className="flex items-center gap-3 pt-6">
          <input type="checkbox" id="featured" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} className="accent-gold-rune w-4 h-4" />
          <label htmlFor="featured" className="font-cinzel text-xs text-parchment-dark opacity-70 tracking-wide uppercase cursor-pointer">Featured</label>
        </div>
        <div className="flex items-center gap-3 pt-6">
          <input type="checkbox" id="published" checked={form.published} onChange={(e) => set("published", e.target.checked)} className="accent-gold-rune w-4 h-4" />
          <label htmlFor="published" className="font-cinzel text-xs text-parchment-dark opacity-70 tracking-wide uppercase cursor-pointer">Published</label>
        </div>
      </div>

      <div className="flex gap-4 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="font-cinzel text-sm tracking-wider uppercase px-6 py-2.5 rounded-lg
            bg-gold-rune text-dungeon-dark font-bold hover:bg-gold-bright
            disabled:opacity-50 transition-all"
        >
          {pending ? "Saving…" : "Save Event"}
        </button>
        <a href="/admin/events" className="font-cinzel text-sm tracking-wide uppercase px-6 py-2.5 rounded-lg border border-dungeon-purple text-parchment-dark opacity-60 hover:opacity-100 transition-opacity">
          Cancel
        </a>
      </div>
    </form>
  );
}

const inputCls =
  "w-full bg-dungeon-black border border-dungeon-purple rounded-lg px-4 py-2.5 text-parchment font-im-fell focus:outline-none focus:border-gold-rune transition-colors";

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
