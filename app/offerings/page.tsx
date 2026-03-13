import Link from "next/link";
import { D20Icon, MagicStarIcon } from "@/components/Icons";
import { prisma } from "@/lib/prisma";
import OfferingsGrid, { type OfferingData } from "./OfferingsGrid";

const fallbackOfferings: OfferingData[] = [
  {
    id: "event-space",
    iconType: "magic",
    title: "Private Event Space",
    subtitle: "The Dragon's Den",
    tagline: "Where Legends Are Made",
    description:
      "Rent our enchanted private rooms for campaigns, birthday quests, corporate team-building adventures, or any celebration worthy of a bard's tale. Each space is fully equipped for immersive gaming experiences.",
    features: [
      "Up to 12 adventurers per room",
      "Dedicated dungeon master screen & accessories",
      "Built-in terrain and atmosphere lighting",
      "Custom ale & food packages",
      "AV setup for digital maps & campaign tools",
      "2–8 hour booking slots available",
    ],
    cta: "Reserve Your Space",
    ctaHref: "/events#book",
    badge: "PREMIUM",
    badgeColor: "bg-gold-rune text-dungeon-dark",
    accentColor: "#d4af37",
  },
  {
    id: "minis",
    iconType: "dragon",
    title: "Miniatures & Terrain",
    subtitle: "The Armoury",
    tagline: "Forge Your Legend",
    description:
      "Discover our curated selection of high-end resin miniatures, hand-painted display pieces, and immersive terrain kits. From dungeon corridors to dragon lairs — we stock the finest for tabletop adventurers.",
    features: [
      "Reaper Miniatures (Bones & Metal lines)",
      "Games Workshop Warhammer range",
      "3D printed custom pieces on request",
      "Pre-painted display miniatures",
      "Modular dungeon & wilderness terrain sets",
      "Basing materials & scenic supplies",
    ],
    cta: "Browse the Armoury",
    ctaHref: "#minis",
    badge: "IN STORE",
    badgeColor: "bg-dragon-red text-parchment",
    accentColor: "#c0392b",
  },
  {
    id: "paints",
    iconType: "paintbrush",
    title: "Paints & Supplies",
    subtitle: "The Alchemist's Bench",
    tagline: "Master Your Palette",
    description:
      "Stock your paint station with the finest pigments in the realm. We carry all major brands and offer expert advice from our in-house painting champions.",
    features: [
      "Citadel / Games Workshop full range",
      "Vallejo Model & Game Colour",
      "Scale75 Artist & Fantasy series",
      "Reaper Learn to Paint kits",
      "Contrast & Speed paints",
      "Airbrush supplies & compressors",
      "Wet palettes, brushes & hobby tools",
    ],
    cta: "Stock Your Palette",
    ctaHref: "#paints",
    badge: "RESTOCKED",
    badgeColor: "bg-arcane-purple text-parchment",
    accentColor: "#9b4dca",
  },
  {
    id: "board-games",
    iconType: "shield",
    title: "Board Games",
    subtitle: "The Game Vault",
    tagline: "Roll. Strategise. Conquer.",
    description:
      "Explore our ever-growing library of board games spanning strategy, co-op, horror, and fantasy. Purchase to own or rent a copy for your session at the tavern.",
    features: [
      "1,000+ titles in stock",
      "In-store play lending library",
      "Strategy, co-op, party & family games",
      "TTRPG core books & campaign supplements",
      "New releases every Tuesday",
      "Staff picks & curated collections",
      "Pre-order service available",
    ],
    cta: "Explore the Vault",
    ctaHref: "#board-games",
    badge: "1000+ TITLES",
    badgeColor: "bg-dungeon-purple text-parchment",
    accentColor: "#7b2d8b",
  },
  {
    id: "tcg",
    iconType: "card",
    title: "Trading Card Games",
    subtitle: "The Card Sanctum",
    tagline: "Shuffle. Draw. Dominate.",
    description:
      "For the collectors and competitors — our TCG section carries the widest selection of sealed product, singles, and accessories.",
    features: [
      "Magic: The Gathering — all sets",
      "Pokémon TCG — current & vintage",
      "Yu-Gi-Oh! booster & structure decks",
      "Flesh & Blood competitive singles",
      "One Piece & Lorcana",
      "Card sleeves, binders & deck boxes",
      "Buylist available — sell us your cards!",
    ],
    cta: "Enter the Sanctum",
    ctaHref: "#tcg",
    badge: "FNM HOST",
    badgeColor: "bg-gold-rune text-dungeon-dark",
    accentColor: "#d4af37",
  },
  {
    id: "bar",
    iconType: "goblet",
    title: "The Enchanted Bar",
    subtitle: "Brews & Potions",
    tagline: "A Drink for Every Class",
    description:
      "Our tiefling bartender has brewed a potion for every alignment. From hoppy IPAs to dark stouts, craft cocktails named after legendary spells, and a rotating selection from local breweries.",
    features: [
      "24 rotating craft ales on draught",
      "Cocktails themed by D&D class & spell",
      "Local brewery rotating tap takeovers",
      "Non-alcoholic & zero-proof options",
      "Tavern bites & sharing platters",
      "Custom brew pairings for events",
    ],
    cta: "See the Menu",
    ctaHref: "#bar",
    badge: "24 ON TAP",
    badgeColor: "bg-tavern-brown text-parchment",
    accentColor: "#8b5e3c",
  },
];

async function getOfferings(): Promise<OfferingData[]> {
  try {
    const rows = await prisma.offering.findMany({
      where: { published: true },
      orderBy: { displayOrder: "asc" },
    });
    if (rows.length > 0) return rows;
  } catch {}
  return fallbackOfferings;
}

export default async function OfferingsPage() {
  const offerings = await getOfferings();

  return (
    <div className="relative overflow-hidden">

      {/* ─── PAGE HERO ──────────────────────────────────────────── */}
      <section className="relative py-24 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-dungeon-black" />
        <div className="absolute inset-0 opacity-25"
          style={{ background: "radial-gradient(ellipse 70% 50% at 50% 30%, #4a2d6e, transparent)" }} />

        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="flex justify-center mb-4">
            <D20Icon size={70} className="animate-float" />
          </div>
          <h1 className="font-cinzel-decorative text-gold-rune text-4xl md:text-6xl font-black mb-4">
            Our Wares
          </h1>
          <div className="divider-rune mb-4">
            <span className="text-gold-rune opacity-60">⚜</span>
          </div>
          <p className="font-im-fell italic text-parchment-dark opacity-70 text-lg md:text-xl leading-relaxed">
            From the finest miniatures and arcane pigments to legendary ales and spell-binding card games —
            everything the discerning adventurer requires under one enchanted roof.
          </p>
        </div>
      </section>

      {/* ─── OFFERINGS GRID ─────────────────────────────────────── */}
      <section className="py-10 pb-24 px-4">
        <OfferingsGrid offerings={offerings} />
      </section>

      {/* ─── BOOKING BANNER ─────────────────────────────────────── */}
      <section id="book" className="py-16 px-4 bg-dungeon-mid border-y border-dungeon-purple">
        <div className="max-w-3xl mx-auto text-center">
          <MagicStarIcon size={60} className="mx-auto mb-6 animate-float" />
          <h2 className="font-cinzel-decorative text-gold-rune text-3xl font-bold mb-4">
            Book the Dragon&apos;s Den
          </h2>
          <p className="font-im-fell text-parchment-dark opacity-70 text-lg leading-relaxed mb-8">
            Planning a campaign night, birthday quest, or corporate adventure? Our event spaces are
            available for booking. Contact our innkeeper to discuss packages and availability.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/events#book"
              className="font-cinzel text-sm tracking-wider uppercase px-8 py-3.5 rounded
                bg-gold-rune text-dungeon-dark font-bold
                hover:bg-gold-bright transition-all duration-300
                shadow-[0_0_20px_rgba(212,175,55,0.4)]"
            >
              Check Availability
            </Link>
            <a
              href="mailto:hello@draughtsndragons.com"
              className="font-cinzel text-sm tracking-wider uppercase px-8 py-3.5 rounded
                border border-parchment text-parchment-dark
                hover:bg-parchment hover:text-dungeon-dark transition-all duration-300"
            >
              Send a Raven
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
