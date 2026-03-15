import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database…");

  // ── Admin user ──────────────────────────────────────────────
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@draughtsndragons.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "changeme123";

  const hashed = await bcrypt.hash(adminPassword, 12);
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: { email: adminEmail, password: hashed, name: "Admin", role: "admin" },
  });
  console.log(`✅ Admin user: ${adminEmail}`);

  // ── Events ──────────────────────────────────────────────────
  const eventsCount = await prisma.event.count();
  if (eventsCount === 0) {
    await prisma.event.createMany({
      data: [
        { date: "21", dayOfWeek: "Saturday", month: "March", year: 2026, title: "Grand Opening — Spring Equinox Pint Night", time: "6:00 PM – Close", category: "PINT NIGHT", description: "Celebrate our grand opening with half-price pints, live bardic performances, and a special welcome from our tiefling bartender. First 50 guests receive an exclusive commemorative stein.", icon: "🐉", price: "FREE ENTRY", featured: true, displayOrder: 0 },
        { date: "22", dayOfWeek: "Sunday", month: "March", year: 2026, title: "Painting Tutorial: Citadel Contrast Paints", time: "2:00 PM – 5:00 PM", category: "WORKSHOP", description: "Master the art of Contrast paints with our in-house painter. Perfect for beginners and veterans looking to speed up their workflow. All materials provided.", icon: "🎨", price: "$15", capacity: 10, displayOrder: 1 },
        { date: "27", dayOfWeek: "Friday", month: "March", year: 2026, title: "Friday Night Magic — Modern Format", time: "7:00 PM – 11:00 PM", category: "TOURNAMENT", description: "Weekly FNM tournament running Modern format. Entry fee includes prize store credit. Pre-registration required.", icon: "🃏", price: "$5 Entry", capacity: 16, displayOrder: 2 },
        { date: "28", dayOfWeek: "Saturday", month: "March", year: 2026, title: "D&D One-Shot: The Sunken Tavern", time: "1:00 PM – 6:00 PM", category: "CAMPAIGN", description: "A self-contained one-shot adventure for 4–6 players. Pre-generated characters provided. No experience necessary!", icon: "⚔️", price: "$20", capacity: 6, displayOrder: 3 },
        { date: "3", dayOfWeek: "Friday", month: "April", year: 2026, title: "Friday Night Magic — Pioneer Format", time: "7:00 PM – 11:00 PM", category: "TOURNAMENT", description: "FNM shifts to Pioneer this week! All players welcome. Entry includes 1 promo pack.", icon: "🃏", price: "$5 Entry", capacity: 16, displayOrder: 4 },
        { date: "5", dayOfWeek: "Sunday", month: "April", year: 2026, title: "Pint Night: Local Brewery Tap Takeover", time: "5:00 PM – 10:00 PM", category: "PINT NIGHT", description: "Misty Mountain Brewery takes over our 6 guest taps for one legendary night. Tasters available.", icon: "🍺", price: "Pay per pint", displayOrder: 5 },
        { date: "16", dayOfWeek: "Saturday", month: "May", year: 2026, title: "Magic: The Gathering — Regional Qualifier", time: "10:00 AM – 8:00 PM", category: "TOURNAMENT", description: "Compete for a regional qualifier slot! Standard format. Top 8 earn invites to the regional championship.", icon: "🃏", price: "$25 Entry", capacity: 32, featured: true, displayOrder: 6 },
      ],
    });
    console.log("✅ Events seeded");
  }

  // ── Offerings ───────────────────────────────────────────────
  const offeringsCount = await prisma.offering.count();
  if (offeringsCount === 0) {
    await prisma.offering.createMany({
      data: [
        { iconType: "magic", title: "Private Event Space", subtitle: "The Dragon's Den", tagline: "Where Legends Are Made", description: "Rent our enchanted private rooms for campaigns, birthday quests, corporate team-building adventures, or any celebration worthy of a bard's tale.", features: ["Up to 12 adventurers per room", "Dedicated dungeon master screen & accessories", "Built-in terrain and atmosphere lighting", "Custom ale & food packages", "AV setup for digital maps & campaign tools", "2–8 hour booking slots available"], cta: "Reserve Your Space", ctaHref: "/events#book", badge: "PREMIUM", badgeColor: "bg-gold-rune text-dungeon-dark", accentColor: "#d4af37", displayOrder: 0 },
        { iconType: "dragon", title: "Miniatures & Terrain", subtitle: "The Armoury", tagline: "Forge Your Legend", description: "Discover our curated selection of high-end resin miniatures, hand-painted display pieces, and immersive terrain kits.", features: ["Reaper Miniatures (Bones & Metal lines)", "Games Workshop Warhammer range", "3D printed custom pieces on request", "Pre-painted display miniatures", "Modular dungeon & wilderness terrain sets", "Basing materials & scenic supplies"], cta: "Browse the Armoury", ctaHref: "#minis", badge: "IN STORE", badgeColor: "bg-dragon-red text-parchment", accentColor: "#c0392b", displayOrder: 1 },
        { iconType: "paintbrush", title: "Paints & Supplies", subtitle: "The Alchemist's Bench", tagline: "Master Your Palette", description: "Stock your paint station with the finest pigments in the realm.", features: ["Citadel / Games Workshop full range", "Vallejo Model & Game Colour", "Scale75 Artist & Fantasy series", "Reaper Learn to Paint kits", "Contrast & Speed paints", "Airbrush supplies & compressors", "Wet palettes, brushes & hobby tools"], cta: "Stock Your Palette", ctaHref: "#paints", badge: "RESTOCKED", badgeColor: "bg-arcane-purple text-parchment", accentColor: "#9b4dca", displayOrder: 2 },
        { iconType: "shield", title: "Board Games", subtitle: "The Game Vault", tagline: "Roll. Strategise. Conquer.", description: "Explore our ever-growing library of board games spanning strategy, co-op, horror, and fantasy.", features: ["1,000+ titles in stock", "In-store play lending library", "Strategy, co-op, party & family games", "TTRPG core books & campaign supplements", "New releases every Tuesday", "Pre-order service available"], cta: "Explore the Vault", ctaHref: "#board-games", badge: "1000+ TITLES", badgeColor: "bg-dungeon-purple text-parchment", accentColor: "#7b2d8b", displayOrder: 3 },
        { iconType: "card", title: "Trading Card Games", subtitle: "The Card Sanctum", tagline: "Shuffle. Draw. Dominate.", description: "For the collectors and competitors — our TCG section carries the widest selection of sealed product, singles, and accessories.", features: ["Magic: The Gathering — all sets", "Pokémon TCG — current & vintage", "Yu-Gi-Oh! booster & structure decks", "Flesh & Blood competitive singles", "One Piece & Lorcana", "Card sleeves, binders & deck boxes", "Buylist available — sell us your cards!"], cta: "Enter the Sanctum", ctaHref: "#tcg", badge: "FNM HOST", badgeColor: "bg-gold-rune text-dungeon-dark", accentColor: "#d4af37", displayOrder: 4 },
        { iconType: "goblet", title: "The Enchanted Bar", subtitle: "Brews & Potions", tagline: "A Drink for Every Class", description: "Our tiefling bartender has brewed a potion for every alignment. Craft ales, cocktails named after legendary spells, and a rotating local brewery tap.", features: ["24 rotating craft ales on draught", "Cocktails themed by D&D class & spell", "Local brewery rotating tap takeovers", "Non-alcoholic & zero-proof options", "Tavern bites & sharing platters", "Custom brew pairings for events"], cta: "See the Menu", ctaHref: "#bar", badge: "24 ON TAP", badgeColor: "bg-tavern-brown text-parchment", accentColor: "#8b5e3c", displayOrder: 5 },
      ],
    });
    console.log("✅ Offerings seeded");
  }

  // ── Announcements ───────────────────────────────────────────
  const announcementsCount = await prisma.announcement.count();
  if (announcementsCount === 0) {
    await prisma.announcement.createMany({
      data: [
        { type: "EVENT", typeColor: "bg-arcane-purple text-parchment", date: "March 21, 2026", title: "Grand Opening: Spring Equinox Celebration!", body: "The dragons have spoken — our doors open to all adventurers this Spring Equinox! Enjoy half-price pints, live bardic music, and a special mini-painting session. First 50 guests receive an exclusive Draughts & Dragons stein.", icon: "🐉", pinned: true, displayOrder: 0 },
        { type: "NEW ARRIVAL", typeColor: "bg-gold-rune text-dungeon-dark", date: "March 18, 2026", title: "New Stock: Reaper Bones Black & Citadel Contrast Paints", body: "Fresh off the wagon! We've restocked our Reaper Bones Black line and received the full range of Citadel Contrast 2.0 paints.", icon: "🎨", displayOrder: 1 },
        { type: "ANNOUNCEMENT", typeColor: "bg-dungeon-purple text-parchment", date: "March 15, 2026", title: "Friday Night Magic Returns — Modern Format", body: "Your favourite weekly tournament is back! FNM runs every Friday at 7pm. Entry is 5 gold (or $5). Prizes include store credit and exclusive alternate-art promo cards.", icon: "🃏", displayOrder: 2 },
        { type: "COMMUNITY", typeColor: "bg-dragon-red text-parchment", date: "March 10, 2026", title: "Pint Night Results: The Ale of Enchantment Wins!", body: "After a fierce brew-off between six local craft breweries, the crowd has spoken. The Ale of Enchantment from Misty Mountain Brewery takes the crown!", icon: "🍺", displayOrder: 3 },
      ],
    });
    console.log("✅ Announcements seeded");
  }

  // ── Default reminder cadences ────────────────────────────────
  for (const cadence of [
    { label: "7 days before",  hoursBefore: 168 },
    { label: "1 day before",   hoursBefore: 24  },
    { label: "2 hours before", hoursBefore: 2   },
  ]) {
    await prisma.reminderCadence.upsert({
      where: { hoursBefore: cadence.hoursBefore },
      update: {},
      create: cadence,
    });
  }
  console.log("✅ Reminder cadences seeded");

  console.log("🎉 Seed complete!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
