"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { createRsvp } from "@/app/actions/rsvp";

// ── Calendar helpers ──────────────────────────────────────────────────────────

interface CalendarEvent {
  title: string;
  date: string;   // day of month, e.g. "15"
  month: string;  // month name, e.g. "March"
  year: number;
  time: string;   // e.g. "7:00 PM" or "7:00 PM – 10:00 PM"
  description: string;
}

const MONTH_NUMS: Record<string, number> = {
  january: 1, february: 2, march: 3, april: 4, may: 5, june: 6,
  july: 7, august: 8, september: 9, october: 10, november: 11, december: 12,
  jan: 1, feb: 2, mar: 3, apr: 4, jun: 6, jul: 7, aug: 8,
  sep: 9, oct: 10, nov: 11, dec: 12,
};

function parseTime(timeStr: string): { h: number; m: number } {
  const first = timeStr.split(/[–—-]/)[0].trim();
  const match = first.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);
  if (!match) return { h: 18, m: 0 };
  let h = parseInt(match[1]);
  const m = parseInt(match[2] ?? "0");
  const meridiem = match[3]?.toLowerCase();
  if (meridiem === "pm" && h !== 12) h += 12;
  if (meridiem === "am" && h === 12) h = 0;
  return { h, m };
}

function toIcsDateTime(year: number, month: number, day: number, h: number, m: number) {
  return `${year}${String(month).padStart(2, "0")}${String(day).padStart(2, "0")}T${String(h).padStart(2, "0")}${String(m).padStart(2, "0")}00`;
}

function buildTimes(ev: CalendarEvent) {
  const monthNum = MONTH_NUMS[ev.month.toLowerCase()] ?? 1;
  const day = parseInt(ev.date);
  const { h, m } = parseTime(ev.time);
  const start = toIcsDateTime(ev.year, monthNum, day, h, m);
  const end = toIcsDateTime(ev.year, monthNum, day, Math.min(h + 2, 23), m);
  return { start, end };
}

function googleCalendarUrl(ev: CalendarEvent) {
  const { start, end } = buildTimes(ev);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: ev.title,
    dates: `${start}/${end}`,
    details: ev.description,
    location: "Draughts & Dragons",
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}

// ── Component ─────────────────────────────────────────────────────────────────

interface RsvpFormProps {
  eventId: string;
  price: string;
  isFree: boolean;
  spotsRemaining: number | null;
  /** Passed from server when the visitor is signed in */
  userId?: string | null;
  defaultName?: string | null;
  defaultEmail?: string | null;
  /** True when a signed-in user already has an RSVP for this event */
  alreadyRsvped?: boolean;
  calendarEvent: CalendarEvent;
}

export default function RsvpForm({
  eventId,
  price,
  isFree,
  spotsRemaining,
  userId,
  defaultName,
  defaultEmail,
  alreadyRsvped = false,
  calendarEvent,
}: RsvpFormProps) {
  const [name, setName] = useState(defaultName ?? "");
  const [email, setEmail] = useState(defaultEmail ?? "");
  const [tickets, setTickets] = useState(1);
  const [success, setSuccess] = useState(alreadyRsvped);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const maxTickets = spotsRemaining !== null ? Math.min(spotsRemaining, 4) : 4;
  const numericPrice = parseFloat(price.replace(/[^0-9.]/g, "")) || 0;
  const total = (numericPrice * tickets).toFixed(2);

  // Not signed in — prompt login
  if (!userId) {
    return (
      <div className="text-center py-8 flex flex-col items-center gap-4">
        <div className="text-4xl">🔐</div>
        <p className="font-im-fell text-parchment-dark opacity-70 text-sm">
          You must be signed in to reserve a spot.
        </p>
        <Link
          href={`/auth/signin?callbackUrl=/events/${eventId}/rsvp`}
          className="font-cinzel text-sm tracking-wider uppercase px-6 py-2.5 rounded-xl
            bg-gold-rune text-dungeon-dark font-bold
            hover:bg-gold-bright transition-all duration-200
            shadow-[0_2px_14px_rgba(212,175,55,0.45)] hover:shadow-[0_2px_22px_rgba(212,175,55,0.65)]"
        >
          Sign In to RSVP
        </Link>
      </div>
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await createRsvp({ eventId, userId, name, email, quantity: tickets });
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(true);
      }
    });
  }

  if (success) {
    return (
      <div className="flex flex-col items-center gap-5 py-8 text-center">
        <div className="text-5xl">🎉</div>
        <div>
          <h2 className="font-cinzel text-gold-rune text-xl font-bold mb-2">You&apos;re on the list!</h2>
          <p className="font-im-fell text-parchment-dark opacity-70 text-sm max-w-xs">
            {alreadyRsvped
              ? "You've already secured your spot for this event."
              : <>
                  We&apos;ve reserved {tickets > 1 ? `${tickets} spots` : "your spot"} for{" "}
                  <span className="text-parchment">{email}</span>. Check{" "}
                  <a href="/account" className="underline hover:text-gold-rune transition-colors">
                    My Events
                  </a>{" "}
                  to manage your bookings.
                </>
            }
          </p>
        </div>

        {/* Add to calendar */}
        <div className="w-full flex flex-col gap-2 pt-1">
          <p className="font-cinzel text-[10px] tracking-widest uppercase text-parchment-dark/40 mb-1">
            Add to Calendar
          </p>
          <a
            href={googleCalendarUrl(calendarEvent)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl
              bg-[#4285F4]/20 border border-[#4285F4]/40 text-parchment
              hover:bg-[#4285F4]/30 hover:border-[#4285F4]/60
              font-cinzel text-xs tracking-wider uppercase transition-all duration-200"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google Calendar
          </a>
          <a
            href={`/api/events/${eventId}/ics`}
            download
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl
              bg-parchment/10 border border-parchment/25 text-parchment
              hover:bg-parchment/20 hover:border-parchment/40
              font-cinzel text-xs tracking-wider uppercase transition-all duration-200"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 flex-shrink-0" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
            </svg>
            Apple / iCal
          </a>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Attendee details */}
      <div>
        <h3 className="font-cinzel text-parchment text-sm tracking-wider uppercase mb-3">
          Adventurer Details
        </h3>
        <div className="flex flex-col gap-3">
          <div>
            <label className="font-cinzel text-xs text-parchment-dark opacity-60 tracking-widest uppercase block mb-1">
              Full Name
            </label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Thorin Ashrock"
              className="w-full bg-dungeon-black border border-dungeon-purple rounded-lg px-3 py-2
                font-im-fell text-parchment text-sm placeholder:opacity-30
                focus:outline-none focus:border-arcane-violet transition-colors"
            />
          </div>
          <div>
            <label className="font-cinzel text-xs text-parchment-dark opacity-60 tracking-widest uppercase block mb-1">
              Email
            </label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="thorin@dungeon.com"
              className="w-full bg-dungeon-black border border-dungeon-purple rounded-lg px-3 py-2
                font-im-fell text-parchment text-sm placeholder:opacity-30
                focus:outline-none focus:border-arcane-violet transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Ticket quantity — only for paid, capacity-limited events */}
      {!isFree && maxTickets > 1 && (
        <div>
          <h3 className="font-cinzel text-parchment text-sm tracking-wider uppercase mb-3">
            Tickets
          </h3>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setTickets((t) => Math.max(1, t - 1))}
              className="w-8 h-8 rounded-full border border-dungeon-purple text-parchment-dark
                hover:border-arcane-violet hover:text-parchment transition-colors font-cinzel text-sm"
            >
              −
            </button>
            <span className="font-cinzel text-parchment text-lg w-6 text-center">{tickets}</span>
            <button
              type="button"
              onClick={() => setTickets((t) => Math.min(maxTickets, t + 1))}
              className="w-8 h-8 rounded-full border border-dungeon-purple text-parchment-dark
                hover:border-arcane-violet hover:text-parchment transition-colors font-cinzel text-sm"
            >
              +
            </button>
            <span className="font-im-fell text-parchment-dark opacity-40 text-sm italic">
              {spotsRemaining !== null
                ? `${spotsRemaining} spot${spotsRemaining === 1 ? "" : "s"} remaining`
                : ""}
            </span>
          </div>
        </div>
      )}

      {/* Order summary */}
      <div className="bg-dungeon-black rounded-xl border border-dungeon-purple p-4 flex flex-col gap-2">
        <h3 className="font-cinzel text-parchment text-sm tracking-wider uppercase mb-1">
          Order Summary
        </h3>
        {isFree ? (
          <div className="flex justify-between font-im-fell text-sm">
            <span className="text-parchment-dark opacity-60">Entry</span>
            <span className="text-green-400 font-bold">FREE</span>
          </div>
        ) : (
          <>
            <div className="flex justify-between font-im-fell text-sm">
              <span className="text-parchment-dark opacity-60">
                {price} × {tickets}
              </span>
              <span className="text-parchment">${total}</span>
            </div>
            <div className="flex justify-between font-im-fell text-sm border-t border-dungeon-purple pt-2 mt-1">
              <span className="text-parchment font-bold">Total</span>
              <span className="text-gold-rune font-bold font-cinzel">${total}</span>
            </div>
          </>
        )}
      </div>

      {/* Error */}
      {error && (
        <p className="font-im-fell text-dragon-crimson text-sm text-center">{error}</p>
      )}

      {/* CTA */}
      <div className="flex flex-col gap-2">
        <button
          type="submit"
          disabled={isPending}
          className="w-full font-cinzel text-sm tracking-wider uppercase py-3 rounded-xl
            bg-gold-rune text-dungeon-dark font-bold
            hover:bg-gold-bright transition-all duration-200
            shadow-[0_2px_14px_rgba(212,175,55,0.4)] hover:shadow-[0_2px_22px_rgba(212,175,55,0.6)]
            disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
        >
          {isPending ? "Reserving…" : isFree ? "Reserve My Spot" : `Pay $${total}`}
        </button>
        <p className="font-im-fell text-parchment-dark opacity-40 text-xs italic text-center">
          Stripe payment integration coming soon — your spot will be held automatically.
        </p>
      </div>
    </form>
  );
}
