"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import TieflingLogo from "@/components/TieflingLogo";

const navItems = [
  { href: "/admin/events", label: "Events", icon: "📅" },
  { href: "/admin/offerings", label: "Offerings", icon: "⚔️" },
  { href: "/admin/announcements", label: "Announcements", icon: "📜" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="w-56 flex-shrink-0 bg-dungeon-dark border-r border-dungeon-purple flex flex-col"
      style={{ minHeight: "100vh" }}
    >
      {/* Logo */}
      <div className="p-5 border-b border-dungeon-purple flex items-center gap-3">
        <TieflingLogo size={40} />
        <div>
          <div className="font-cinzel text-gold-rune text-xs font-bold tracking-wide leading-tight">
            D&amp;D Admin
          </div>
          <div className="font-im-fell text-parchment-dark opacity-40 text-xs italic">
            Keep Portal
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-cinzel text-xs tracking-wide transition-all duration-200 ${
                active
                  ? "bg-dungeon-purple text-gold-rune"
                  : "text-parchment-dark opacity-70 hover:opacity-100 hover:bg-dungeon-mid"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-dungeon-purple">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 font-cinzel text-xs text-parchment-dark opacity-50 hover:opacity-80 mb-3 transition-opacity"
        >
          <span>🌐</span> View Site
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="w-full font-cinzel text-xs tracking-wide uppercase px-3 py-2 rounded-lg
            border border-dungeon-purple text-parchment-dark opacity-60 hover:opacity-100
            hover:border-dragon-red hover:text-dragon-crimson transition-all duration-200"
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
}
