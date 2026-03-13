"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/" })}
      className="font-cinzel text-sm tracking-wider uppercase px-6 py-2.5 rounded
        border border-parchment-dark/30 text-parchment-dark/60
        hover:border-dragon-red/50 hover:text-dragon-crimson transition-all duration-200"
    >
      Sign Out
    </button>
  );
}
