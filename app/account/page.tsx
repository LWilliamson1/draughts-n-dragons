import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import SignOutButton from "./SignOutButton";

// ── Small stat card ──────────────────────────────────────────────────────────

function StatCard({
  icon,
  label,
  value,
  coming,
}: {
  icon: string;
  label: string;
  value?: string;
  coming?: boolean;
}) {
  return (
    <div className="bg-dungeon-mid rounded-xl border border-dungeon-purple/30 p-6">
      <div className="text-3xl mb-2">{icon}</div>
      <p className="font-cinzel text-xs tracking-widest uppercase text-parchment-dark/50 mb-1">{label}</p>
      {coming ? (
        <span className="font-cinzel text-[10px] tracking-widest uppercase px-2 py-0.5 rounded bg-dungeon-purple/40 text-parchment-dark/50">
          Coming soon
        </span>
      ) : (
        <p className="font-cinzel-decorative text-gold-rune text-2xl font-bold">{value}</p>
      )}
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function AccountPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/signin");

  const { name, email, image, role } = session.user;
  const initials = name
    ? name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : email?.[0]?.toUpperCase() ?? "?";

  const isGoogle = !!(image);

  return (
    <div className="min-h-screen bg-dungeon-black text-parchment">

      {/* ── Hero banner ─────────────────────────────────────────── */}
      <div
        className="relative py-16 px-4 overflow-hidden"
        style={{ background: "linear-gradient(180deg, #2d1f3d 0%, #1a1020 100%)" }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{ background: "radial-gradient(ellipse 60% 80% at 20% 50%, #d4af37, transparent)" }}
        />
        <div className="relative z-10 max-w-4xl mx-auto flex items-center gap-6">
          {/* Avatar */}
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt={name ?? "Avatar"} width={72} height={72}
              className="rounded-full border-2 border-gold-rune/60 flex-shrink-0" />
          ) : (
            <div className="w-[72px] h-[72px] rounded-full bg-dungeon-purple border-2 border-gold-rune/40 flex-shrink-0
              flex items-center justify-center font-cinzel-decorative text-gold-rune text-2xl font-bold">
              {initials}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <p className="font-cinzel text-xs tracking-[0.3em] uppercase text-gold-rune/60 mb-1">
              My Account
            </p>
            <h1 className="font-cinzel-decorative text-3xl md:text-4xl font-black text-parchment truncate">
              {name ?? "Adventurer"}
            </h1>
            <p className="font-im-fell italic text-parchment-dark/60 mt-0.5">{email}</p>
          </div>

          <div className="flex-shrink-0 hidden sm:flex flex-col items-end gap-2">
            <span className="font-cinzel text-[10px] tracking-widest uppercase px-3 py-1 rounded-full
              bg-dungeon-purple/60 border border-dungeon-purple text-parchment-dark capitalize">
              {role}
            </span>
            {isGoogle && (
              <span className="font-cinzel text-[9px] tracking-widest uppercase px-2.5 py-0.5 rounded-full
                bg-white/10 border border-white/20 text-parchment-dark/60">
                Google account
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Content ─────────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">

        {/* Quick stats */}
        <section>
          <h2 className="font-cinzel text-xs tracking-[0.3em] uppercase text-parchment-dark/50 mb-4">
            Your Adventure
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard icon="🎲" label="Events RSVPed" coming />
            <StatCard icon="📦" label="Orders" coming />
            <StatCard icon="🛒" label="Wishlist" coming />
            <StatCard icon="⚔️" label="Member since" value={new Date().getFullYear().toString()} />
          </div>
        </section>

        {/* Profile section */}
        <section className="bg-dungeon-mid rounded-xl border border-dungeon-purple/30 p-6">
          <h2 className="font-cinzel text-sm tracking-widest uppercase text-parchment-dark/70 mb-6 pb-3
            border-b border-dungeon-purple/20">
            Profile
          </h2>
          <dl className="space-y-4">
            <div className="flex justify-between items-center">
              <dt className="font-cinzel text-xs tracking-wider uppercase text-parchment-dark/50">Name</dt>
              <dd className="font-im-fell text-parchment">{name ?? "—"}</dd>
            </div>
            <div className="flex justify-between items-center">
              <dt className="font-cinzel text-xs tracking-wider uppercase text-parchment-dark/50">Email</dt>
              <dd className="font-im-fell text-parchment">{email}</dd>
            </div>
            <div className="flex justify-between items-center">
              <dt className="font-cinzel text-xs tracking-wider uppercase text-parchment-dark/50">Sign-in method</dt>
              <dd className="font-im-fell text-parchment capitalize">{isGoogle ? "Google" : "Email & Password"}</dd>
            </div>
          </dl>
        </section>

        {/* Quick links */}
        <section>
          <h2 className="font-cinzel text-xs tracking-[0.3em] uppercase text-parchment-dark/50 mb-4">
            Quick Links
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { href: "/events", label: "Browse Events", icon: "🎲" },
              { href: "/shop",   label: "Visit the Shop",  icon: "🛍️" },
              { href: "/menu",   label: "See the Menu",    icon: "🍺" },
            ].map(({ href, label, icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 px-5 py-4 rounded-xl bg-dungeon-mid border border-dungeon-purple/30
                  hover:border-gold-rune/40 hover:bg-dungeon-purple/20 transition-all duration-200 group"
              >
                <span className="text-2xl">{icon}</span>
                <span className="font-cinzel text-sm tracking-wider uppercase text-parchment-dark/80
                  group-hover:text-parchment transition-colors">
                  {label}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Sign out */}
        <div className="pt-2">
          <SignOutButton />
        </div>
      </div>
    </div>
  );
}
