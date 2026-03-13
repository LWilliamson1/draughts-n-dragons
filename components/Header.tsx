"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import TieflingLogo from "./TieflingLogo";
import { useCart } from "@/contexts/CartContext";

// ── Account button (signed-in / signed-out) ──────────────────────────────────

function AccountMenu() {
  const { data: session, status } = useSession() ?? { data: null, status: "loading" as const };
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  if (status === "loading") {
    return <div className="w-8 h-8 rounded-full bg-dungeon-purple/40 animate-pulse" />;
  }

  if (!session) {
    return (
      <Link
        href="/auth/signin"
        className="font-cinzel text-xs tracking-widest uppercase text-parchment-dark/70
          hover:text-gold-rune transition-colors duration-200 hidden md:inline"
      >
        Sign In
      </Link>
    );
  }

  const { name, email, image } = session.user;
  const initials = name
    ? name.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase()
    : email?.[0]?.toUpperCase() ?? "?";

  return (
    <div ref={ref} className="relative hidden md:block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Account menu"
        className="flex items-center gap-2 group"
      >
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt={name ?? "Avatar"} width={32} height={32}
            className="rounded-full border border-gold-rune/40 group-hover:border-gold-rune transition-colors" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-dungeon-purple border border-gold-rune/30
            group-hover:border-gold-rune/60 transition-colors
            flex items-center justify-center font-cinzel text-gold-rune text-xs font-bold">
            {initials}
          </div>
        )}
        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"
          className={`text-parchment-dark/50 transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
          <path d="M6 8L1 3h10z" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-44 rounded-xl border border-dungeon-purple/40
          bg-dungeon-dark shadow-[0_8px_30px_rgba(0,0,0,0.5)] overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-dungeon-purple/20">
            <p className="font-cinzel text-xs text-gold-rune/80 truncate">{name ?? "Adventurer"}</p>
            <p className="font-im-fell text-[11px] text-parchment-dark/50 truncate mt-0.5">{email}</p>
          </div>
          <Link
            href="/account"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-3 font-cinzel text-xs tracking-wider uppercase
              text-parchment-dark/70 hover:text-parchment hover:bg-dungeon-purple/20 transition-colors"
          >
            <span>⚔️</span> My Account
          </Link>
          <button
            type="button"
            onClick={() => { setOpen(false); signOut({ callbackUrl: "/" }); }}
            className="w-full flex items-center gap-2.5 px-4 py-3 font-cinzel text-xs tracking-wider uppercase
              text-parchment-dark/50 hover:text-dragon-crimson hover:bg-dungeon-purple/20 transition-colors"
          >
            <span>🚪</span> Sign Out
          </button>
        </div>
      )}
    </div>
  );
}

// ── Header ───────────────────────────────────────────────────────────────────

export default function Header() {
  const pathname = usePathname();
  const { totalItems } = useCart();

  const navLinks = [
    { href: "/", label: "The Tavern" },
    { href: "/offerings", label: "Our Wares" },
    { href: "/menu", label: "Menu" },
    { href: "/shop", label: "Shop" },
    { href: "/events", label: "Events" },
  ];

  return (
    <header className="relative z-50">
      {/* Top decorative bar */}
      <div className="h-1 bg-gradient-to-r from-transparent via-gold-rune to-transparent" />

      <div
        className="bg-dungeon-dark border-b border-dungeon-purple"
        style={{ boxShadow: "0 4px 20px rgba(74,45,110,0.5)" }}
      >
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-6">

            {/* Logo + Title */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-arcane-violet opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl" />
                <TieflingLogo size={80} className="relative z-10 transition-transform duration-300 group-hover:scale-105" />
              </div>
              <div>
                <h1
                  className="font-cinzel-decorative font-black text-2xl md:text-3xl leading-tight"
                  style={{
                    background: "linear-gradient(135deg, #f0c040, #d4af37, #8b6914)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    textShadow: "none",
                  }}
                >
                  Draughts &amp;
                </h1>
                <h1
                  className="font-cinzel-decorative font-black text-2xl md:text-3xl leading-tight"
                  style={{
                    background: "linear-gradient(135deg, #c0392b, #8b1a1a, #c0392b)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Dragons
                </h1>
                <p className="font-im-fell text-xs text-parchment-dark opacity-70 italic tracking-widest mt-0.5">
                  Tavern &amp; Tomes
                </p>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`nav-link font-cinzel text-sm tracking-widest uppercase transition-all duration-200 ${
                    pathname === link.href
                      ? "text-gold-rune"
                      : "text-parchment-dark hover:text-gold-rune"
                  }`}
                >
                  {link.href === pathname && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gold-rune rounded" />
                  )}
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right-side actions */}
            <div className="flex items-center gap-3">
              {/* Cart icon */}
              <Link
                href="/cart"
                aria-label="View cart"
                className="relative flex items-center gap-1.5 text-parchment-dark hover:text-gold-rune transition-colors duration-200 group"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                {totalItems > 0 ? (
                  <span
                    data-testid="cart-count"
                    className="font-cinzel font-bold text-xs bg-gold-rune text-dungeon-dark px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center leading-none"
                  >
                    {totalItems}
                  </span>
                ) : (
                  <span className="font-cinzel text-xs tracking-wider uppercase opacity-60 hidden md:inline">Cart</span>
                )}
              </Link>

              {/* Account */}
              <AccountMenu />

              {/* Book an Event — desktop only */}
              <Link
                href="/events"
                className="hidden md:inline-block font-cinzel text-sm tracking-wider uppercase px-5 py-2.5 rounded border border-gold-rune text-gold-rune
                  hover:bg-gold-rune hover:text-dungeon-dark transition-all duration-300
                  shadow-[0_0_10px_rgba(212,175,55,0.2)] hover:shadow-[0_0_20px_rgba(212,175,55,0.5)]"
              >
                Book an Event
              </Link>

              {/* Mobile menu icon */}
              <button className="md:hidden text-parchment-dark hover:text-gold-rune transition-colors" aria-label="Menu">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile nav */}
          <nav className="md:hidden flex gap-6 mt-4 pt-4 border-t border-dungeon-purple">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-cinzel text-xs tracking-widest uppercase ${
                  pathname === link.href ? "text-gold-rune" : "text-parchment-dark"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Bottom decorative bar */}
      <div className="h-px bg-gradient-to-r from-transparent via-arcane-violet to-transparent opacity-50" />
    </header>
  );
}
