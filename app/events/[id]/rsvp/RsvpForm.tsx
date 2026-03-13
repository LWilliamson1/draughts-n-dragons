"use client";

import { useState } from "react";

interface RsvpFormProps {
  eventId: string;
  price: string;
  isFree: boolean;
  spotsRemaining: number | null; // null = unlimited
}

export default function RsvpForm({ price, isFree, spotsRemaining }: RsvpFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [tickets, setTickets] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  const maxTickets = spotsRemaining !== null ? Math.min(spotsRemaining, 4) : 4;

  // Parse a numeric price like "$15" or "$25 Entry" → 15 / 25
  const numericPrice = parseFloat(price.replace(/[^0-9.]/g, "")) || 0;
  const total = (numericPrice * tickets).toFixed(2);

  if (submitted) {
    return (
      <div className="text-center py-10 flex flex-col items-center gap-4">
        <div className="text-5xl">🎉</div>
        <h2 className="font-cinzel text-gold-rune text-xl font-bold">You&apos;re on the list!</h2>
        <p className="font-im-fell text-parchment-dark opacity-70 text-sm max-w-xs">
          A confirmation will be sent to <span className="text-parchment">{email}</span> once
          payment processing is live. We&apos;ll hold your {tickets > 1 ? `${tickets} spots` : "spot"} in
          the meantime.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
      className="flex flex-col gap-5"
    >
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
              {spotsRemaining !== null ? `${spotsRemaining} spot${spotsRemaining === 1 ? "" : "s"} remaining` : ""}
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

      {/* CTA */}
      <div className="flex flex-col gap-2">
        <button
          type="submit"
          className="w-full font-cinzel text-sm tracking-wider uppercase py-3 rounded-xl
            bg-gold-rune text-dungeon-dark font-bold
            hover:bg-gold-bright transition-colors"
        >
          {isFree ? "Reserve My Spot" : `Pay $${total}`}
        </button>
        <p className="font-im-fell text-parchment-dark opacity-40 text-xs italic text-center">
          Stripe payment integration coming soon — your spot will be held automatically.
        </p>
      </div>
    </form>
  );
}
