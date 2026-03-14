"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { createRsvp } from "@/app/actions/rsvp";
import "add-to-calendar-button";

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

function toAtcbDate(ev: CalendarEvent) {
  const monthNum = MONTH_NUMS[ev.month.toLowerCase()] ?? 1;
  const { h, m } = parseTime(ev.time);
  const pad2 = (n: number) => String(n).padStart(2, "0");
  return {
    startDate: `${ev.year}-${pad2(monthNum)}-${pad2(parseInt(ev.date))}`,
    startTime: `${pad2(h)}:${pad2(m)}`,
    endTime: `${pad2(Math.min(h + 2, 23))}:${pad2(m)}`,
  };
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
    const { startDate, startTime, endTime } = toAtcbDate(calendarEvent);

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
        <div className="w-full pt-1">
          <p className="font-cinzel text-[10px] tracking-widest uppercase text-parchment-dark/40 mb-3">
            Add to Calendar
          </p>
          <add-to-calendar-button
            name={calendarEvent.title}
            description={calendarEvent.description}
            location="Draughts &amp; Dragons"
            startDate={startDate}
            startTime={startTime}
            endTime={endTime}
            timeZone="currentBrowser"
            options="'Apple','Google','iCal'"
            buttonStyle="flat"
            lightMode="dark"
            hideBranding="true"
            size="4"
            label="Add to Calendar"
          ></add-to-calendar-button>
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
