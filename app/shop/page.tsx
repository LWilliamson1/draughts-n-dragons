"use client";

import { useState } from "react";
import { useCart } from "@/contexts/CartContext";

type Category =
  | "ALL"
  | "GW PAINTS"
  | "ARMY PAINTER"
  | "WARHAMMER"
  | "D&D BOOKS"
  | "BOARD GAMES";

type Stock = "In Stock" | "Low Stock" | "Out of Stock";

interface Product {
  id: string;
  name: string;
  brand: string;
  category: Exclude<Category, "ALL">;
  description: string;
  price: number;
  icon: string;
  stock: Stock;
}

const products: Product[] = [
  // ── Games Workshop / Citadel Paints ─────────────────────────
  {
    id: "gw-1",
    name: "Contrast — Blood Angels Red",
    brand: "Citadel",
    category: "GW PAINTS",
    description: "One-coat contrast paint that shades and highlights in a single layer. Perfect over a white or light grey primer.",
    price: 9.99,
    icon: "🔴",
    stock: "In Stock",
  },
  {
    id: "gw-2",
    name: "Base — Abaddon Black",
    brand: "Citadel",
    category: "GW PAINTS",
    description: "The definitive black base coat. Excellent coverage in a single coat, ideal for dark armour and robes.",
    price: 5.49,
    icon: "⚫",
    stock: "In Stock",
  },
  {
    id: "gw-3",
    name: "Shade — Agrax Earthshade",
    brand: "Citadel",
    category: "GW PAINTS",
    description: "The legendary 'liquid talent'. Flows into recesses to create instant depth on metals, skin, and leather.",
    price: 7.99,
    icon: "🟤",
    stock: "Low Stock",
  },
  {
    id: "gw-4",
    name: "Layer — Ushabti Bone",
    brand: "Citadel",
    category: "GW PAINTS",
    description: "A warm off-white for highlighting bone, parchment, and weathered surfaces. Classic highlight for undead armies.",
    price: 5.49,
    icon: "🦴",
    stock: "In Stock",
  },
  {
    id: "gw-5",
    name: "Technical — Typhus Corrosion",
    brand: "Citadel",
    category: "GW PAINTS",
    description: "Textured technical paint that creates a gritty, rusted, corroded finish. Pairs beautifully with Ryza Rust.",
    price: 7.99,
    icon: "🟤",
    stock: "In Stock",
  },
  {
    id: "gw-6",
    name: "Dry — Necron Compound",
    brand: "Citadel",
    category: "GW PAINTS",
    description: "A bright silver dry paint for quick edge highlights on metallic armour and mechanical models.",
    price: 6.49,
    icon: "⚪",
    stock: "In Stock",
  },

  // ── Army Painter ─────────────────────────────────────────────
  {
    id: "ap-1",
    name: "Speedpaint 2.0 — Angel Green",
    brand: "Army Painter",
    category: "ARMY PAINTER",
    description: "Next-generation speed paint that self-levels and doesn't reactivate when layered. Ideal for Ork skin and foliage.",
    price: 7.49,
    icon: "🟢",
    stock: "In Stock",
  },
  {
    id: "ap-2",
    name: "Warpaint — Plate Mail Metal",
    brand: "Army Painter",
    category: "ARMY PAINTER",
    description: "A versatile mid-tone silver for armour plating, weapons, and mechanical details. Excellent pigment load.",
    price: 4.99,
    icon: "🪨",
    stock: "In Stock",
  },
  {
    id: "ap-3",
    name: "Quickshade Wash — Strong Tone",
    brand: "Army Painter",
    category: "ARMY PAINTER",
    description: "A warm brown wash that adds depth and definition to any model. A staple for painting armies quickly.",
    price: 5.49,
    icon: "🟫",
    stock: "In Stock",
  },
  {
    id: "ap-4",
    name: "Colour Primer Spray — Matt Black",
    brand: "Army Painter",
    category: "ARMY PAINTER",
    description: "Fine-grain rattle-can primer in a flat black. Gives excellent tooth for subsequent paint layers.",
    price: 16.99,
    icon: "🖤",
    stock: "In Stock",
  },
  {
    id: "ap-5",
    name: "Colour Primer Spray — Skeleton Bone",
    brand: "Army Painter",
    category: "ARMY PAINTER",
    description: "Pre-shaded bone-coloured primer — spray on and your undead are halfway done before a brush touches them.",
    price: 16.99,
    icon: "🦴",
    stock: "Low Stock",
  },

  // ── Warhammer Miniatures ─────────────────────────────────────
  {
    id: "wh-1",
    name: "Space Marine Intercessors",
    brand: "Games Workshop",
    category: "WARHAMMER",
    description: "10-model kit. The backbone of any Space Marine force. Push-fit assembly with no glue required.",
    price: 60.00,
    icon: "🪖",
    stock: "In Stock",
  },
  {
    id: "wh-2",
    name: "Chaos Space Marines",
    brand: "Games Workshop",
    category: "WARHAMMER",
    description: "10-model multipart kit with extensive customisation. Corrupted warriors dripping with heretical iconography.",
    price: 55.00,
    icon: "💀",
    stock: "In Stock",
  },
  {
    id: "wh-3",
    name: "Skaven Clanrats",
    brand: "Games Workshop",
    category: "WARHAMMER",
    description: "20-model Age of Sigmar kit. The teeming core of every Skaven army — quick to build and satisfying to paint en masse.",
    price: 45.00,
    icon: "🐀",
    stock: "In Stock",
  },
  {
    id: "wh-4",
    name: "Stormcast Eternals Vindictors",
    brand: "Games Workshop",
    category: "WARHAMMER",
    description: "10-model Age of Sigmar infantry box. Heavily armoured sigmarite warriors, ideal for beginners.",
    price: 50.00,
    icon: "⚡",
    stock: "Low Stock",
  },
  {
    id: "wh-5",
    name: "Tyranid Termagants",
    brand: "Games Workshop",
    category: "WARHAMMER",
    description: "20-model Tyranid swarm infantry. Fast to assemble and terrifying on the tabletop in large numbers.",
    price: 40.00,
    icon: "👾",
    stock: "In Stock",
  },
  {
    id: "wh-6",
    name: "Ork Boyz",
    brand: "Games Workshop",
    category: "WARHAMMER",
    description: "10-model kit packed with Orky character. Highly customisable with tonnes of extra bitz included.",
    price: 35.00,
    icon: "💪",
    stock: "Out of Stock",
  },

  // ── D&D Books ────────────────────────────────────────────────
  {
    id: "dnd-1",
    name: "Player's Handbook (2024)",
    brand: "Wizards of the Coast",
    category: "D&D BOOKS",
    description: "The definitive 2024 revised PHB. Rebuilt classes, updated spells, and the One D&D ruleset. Essential for every player.",
    price: 49.99,
    icon: "📖",
    stock: "In Stock",
  },
  {
    id: "dnd-2",
    name: "Dungeon Master's Guide (2024)",
    brand: "Wizards of the Coast",
    category: "D&D BOOKS",
    description: "The 2024 revised DMG. Includes a full sample setting, tools for every DM from beginner to veteran.",
    price: 49.99,
    icon: "📜",
    stock: "In Stock",
  },
  {
    id: "dnd-3",
    name: "Monster Manual (2024)",
    brand: "Wizards of the Coast",
    category: "D&D BOOKS",
    description: "Over 500 monsters, redesigned stat blocks, and stunning new art. The 2024 edition is the most comprehensive yet.",
    price: 49.99,
    icon: "🐉",
    stock: "In Stock",
  },
  {
    id: "dnd-4",
    name: "Planescape: Adventures in the Multiverse",
    brand: "Wizards of the Coast",
    category: "D&D BOOKS",
    description: "Three-book set covering Sigil and the Outer Planes. Includes campaign setting, bestiary, and adventure.",
    price: 59.99,
    icon: "🌀",
    stock: "In Stock",
  },
  {
    id: "dnd-5",
    name: "Bigby Presents: Glory of the Giants",
    brand: "Wizards of the Coast",
    category: "D&D BOOKS",
    description: "Deep-dive into giant lore, new giant-themed subclasses, and 70+ new monsters. A must-have for high-level campaigns.",
    price: 49.99,
    icon: "🏔️",
    stock: "Low Stock",
  },
  {
    id: "dnd-6",
    name: "The Book of Many Things",
    brand: "Wizards of the Coast",
    category: "D&D BOOKS",
    description: "Full expansion of the Deck of Many Things lore plus a physical card deck. A legendary chaos item for your table.",
    price: 59.99,
    icon: "🃏",
    stock: "In Stock",
  },

  // ── Board Games ──────────────────────────────────────────────
  {
    id: "bg-1",
    name: "Catan",
    brand: "Kosmos",
    category: "BOARD GAMES",
    description: "The classic resource-trading game. Build settlements, cities, and roads while outsmarting your rivals. 3–4 players.",
    price: 45.00,
    icon: "🏝️",
    stock: "In Stock",
  },
  {
    id: "bg-2",
    name: "Wingspan",
    brand: "Stonemaier Games",
    category: "BOARD GAMES",
    description: "Award-winning engine-builder about attracting birds to your wildlife preserve. Stunning artwork and design.",
    price: 60.00,
    icon: "🦅",
    stock: "In Stock",
  },
  {
    id: "bg-3",
    name: "Ticket to Ride",
    brand: "Days of Wonder",
    category: "BOARD GAMES",
    description: "Collect train cards and claim railway routes across a map. Easy to learn, endlessly replayable. 2–5 players.",
    price: 55.00,
    icon: "🚂",
    stock: "In Stock",
  },
  {
    id: "bg-4",
    name: "Pandemic",
    brand: "Z-Man Games",
    category: "BOARD GAMES",
    description: "Cooperative game where players race to cure four diseases before outbreaks overwhelm the world. 2–4 players.",
    price: 40.00,
    icon: "🧫",
    stock: "In Stock",
  },
  {
    id: "bg-5",
    name: "Gloomhaven: Jaws of the Lion",
    brand: "Cephalofair Games",
    category: "BOARD GAMES",
    description: "Standalone entry point into the Gloomhaven universe. 25 scenarios of dungeon-crawling tactical combat.",
    price: 50.00,
    icon: "🦁",
    stock: "Low Stock",
  },
  {
    id: "bg-6",
    name: "Codenames",
    brand: "Czech Games Edition",
    category: "BOARD GAMES",
    description: "Party word game for 2–8 players. Two spymasters give one-word clues to guide their team to secret agents.",
    price: 20.00,
    icon: "🕵️",
    stock: "In Stock",
  },
  {
    id: "bg-7",
    name: "Arkham Horror: The Card Game",
    brand: "Fantasy Flight Games",
    category: "BOARD GAMES",
    description: "Cooperative living card game of Lovecraftian investigation. Build custom decks and unravel eldritch mysteries.",
    price: 45.00,
    icon: "🐙",
    stock: "In Stock",
  },
  {
    id: "bg-8",
    name: "Terraforming Mars",
    brand: "FryxGames",
    category: "BOARD GAMES",
    description: "Engine-building strategy game where corporations compete to terraform the Red Planet. 1–5 players.",
    price: 60.00,
    icon: "🔴",
    stock: "In Stock",
  },
  {
    id: "bg-9",
    name: "Spirit Island",
    brand: "Greater Than Games",
    category: "BOARD GAMES",
    description: "Cooperative game where nature spirits defend their island from colonial invaders. Deep and asymmetric.",
    price: 80.00,
    icon: "🌿",
    stock: "Low Stock",
  },
  {
    id: "bg-10",
    name: "Betrayal at House on the Hill",
    brand: "Avalon Hill",
    category: "BOARD GAMES",
    description: "Explore a haunted house together — until one player becomes the traitor. 50 unique haunt scenarios. 3–6 players.",
    price: 45.00,
    icon: "👻",
    stock: "In Stock",
  },
];

const categories: Category[] = ["ALL", "GW PAINTS", "ARMY PAINTER", "WARHAMMER", "D&D BOOKS", "BOARD GAMES"];

const categoryColors: Record<Exclude<Category, "ALL">, string> = {
  "GW PAINTS":   "bg-dragon-red text-parchment",
  "ARMY PAINTER": "bg-arcane-purple text-parchment",
  WARHAMMER:     "bg-gold-rune text-dungeon-dark",
  "D&D BOOKS":   "bg-tavern-brown text-parchment",
  "BOARD GAMES": "bg-dungeon-purple text-parchment",
};

const stockColors: Record<Stock, string> = {
  "In Stock":     "text-green-400",
  "Low Stock":    "text-gold-rune",
  "Out of Stock": "text-dragon-red",
};

export default function ShopPage() {
  const [active, setActive] = useState<Category>("ALL");
  const [added, setAdded] = useState<string | null>(null);
  const { addItem } = useCart();

  function handleAddToCart(product: Product) {
    addItem({
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      icon: product.icon,
    });
    setAdded(product.id);
    setTimeout(() => setAdded(null), 1200);
  }

  const filtered = active === "ALL" ? products : products.filter((p) => p.category === active);

  return (
    <div className="min-h-screen bg-dungeon-dark text-parchment">
      {/* ── Hero ──────────────────────────────────────────────── */}
      <div className="relative py-16 px-4 text-center border-b border-dungeon-purple overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-dungeon-black to-dungeon-dark" />
        <div className="relative z-10 max-w-2xl mx-auto">
          <p className="font-cinzel text-arcane-violet text-xs tracking-[0.3em] uppercase mb-3">
            The Armoury & Vault
          </p>
          <h1 className="font-cinzel text-4xl md:text-5xl font-bold text-parchment mb-4">
            Our Wares
          </h1>
          <p className="font-im-fell text-parchment-dark opacity-70 text-lg italic">
            Paints, miniatures, tomes, and games — everything an adventurer needs.
            Stock changes weekly. Ask at the counter for pre-orders.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* ── Category filters ──────────────────────────────── */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`font-cinzel text-xs tracking-widest uppercase px-4 py-2 rounded-lg border transition-all duration-200 ${
                active === cat
                  ? "bg-gold-rune text-dungeon-dark border-gold-rune"
                  : "border-dungeon-purple text-parchment-dark opacity-60 hover:opacity-100 hover:border-arcane-violet"
              }`}
            >
              {cat}
              {cat !== "ALL" && (
                <span className="ml-1.5 opacity-60">
                  ({products.filter((p) => p.category === cat).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Results count ─────────────────────────────────── */}
        <p className="font-im-fell text-parchment-dark opacity-40 text-sm italic mb-6">
          {filtered.length} item{filtered.length !== 1 ? "s" : ""}
          {active !== "ALL" ? ` in ${active}` : " across all categories"}
        </p>

        {/* ── Product grid ──────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((product) => (
            <div
              key={product.id}
              className="bg-dungeon-mid border border-dungeon-purple rounded-xl p-4 flex flex-col gap-3
                hover:border-arcane-violet transition-colors duration-200"
            >
              {/* Icon + category */}
              <div className="flex items-start justify-between">
                <span className="text-3xl">{product.icon}</span>
                <span
                  className={`font-cinzel text-[10px] tracking-widest uppercase px-2 py-0.5 rounded ${
                    categoryColors[product.category]
                  }`}
                >
                  {product.category}
                </span>
              </div>

              {/* Name + brand */}
              <div>
                <div className="font-cinzel text-parchment text-sm font-bold leading-snug">
                  {product.name}
                </div>
                <div className="font-im-fell text-parchment-dark opacity-50 text-xs italic mt-0.5">
                  {product.brand}
                </div>
              </div>

              {/* Description */}
              <p className="font-im-fell text-parchment-dark opacity-60 text-sm leading-relaxed flex-1">
                {product.description}
              </p>

              {/* Price + stock + CTA */}
              <div className="border-t border-dungeon-purple pt-3 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-cinzel text-gold-rune font-bold">
                    £{product.price.toFixed(2)}
                  </span>
                  <span className={`font-im-fell text-xs italic ${stockColors[product.stock]}`}>
                    {product.stock}
                  </span>
                </div>
                <button
                  disabled={product.stock === "Out of Stock"}
                  aria-label={`Add ${product.name} to cart`}
                  onClick={() => handleAddToCart(product)}
                  className={`w-full font-cinzel text-xs tracking-wider uppercase py-2.5 rounded-lg transition-all duration-200 font-bold ${
                    product.stock === "Out of Stock"
                      ? "border border-dungeon-purple text-parchment-dark opacity-30 cursor-not-allowed"
                      : added === product.id
                      ? "bg-green-600 text-parchment border border-green-600"
                      : "bg-arcane-violet text-parchment border border-arcane-violet hover:bg-arcane-violet/80 active:scale-95"
                  }`}
                >
                  {product.stock === "Out of Stock"
                    ? "Unavailable"
                    : added === product.id
                    ? "✓ Added!"
                    : "Add to Cart"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ── Footer note ───────────────────────────────────── */}
        <p className="font-im-fell text-parchment-dark opacity-30 text-sm italic text-center mt-12">
          Online checkout coming soon — visit us in store or call ahead to reserve items.
        </p>
      </div>
    </div>
  );
}
