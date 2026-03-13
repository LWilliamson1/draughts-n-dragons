import { GobletIcon } from "@/components/Icons";

// ── Types ────────────────────────────────────────────────────────────────────

interface MenuItem {
  name: string;
  description: string;
  price: string;
  tags?: string[];
  badge?: string;
}

interface MenuSection {
  id: string;
  heading: string;
  subheading: string;
  icon: string;
  items: MenuItem[];
}

// ── Menu Data ────────────────────────────────────────────────────────────────

const BEERS_ON_TAP: MenuItem[] = [
  {
    name: "Pale Rider Pilsner",
    description: "Crisp, clean, and sessionable. Light golden lager with a subtle hop finish. Our most popular pour.",
    price: "$6",
    tags: ["Lager", "4.5% ABV"],
  },
  {
    name: "Ironforge IPA",
    description: "Bold citrus and pine notes from double-dry-hopped Cascade and Citra hops. Bitterness that bites back.",
    price: "$7",
    tags: ["IPA", "6.8% ABV"],
  },
  {
    name: "Midnight Stout",
    description: "Rich roasted coffee and dark chocolate. Smooth, full-bodied, and dangerously drinkable.",
    price: "$7",
    tags: ["Stout", "5.9% ABV"],
  },
  {
    name: "Dungeon Wheat",
    description: "Hazy and refreshing with hints of clove and banana. Unfiltered Bavarian hefeweizen.",
    price: "$6",
    tags: ["Wheat Beer", "5.2% ABV"],
  },
  {
    name: "Dragon's Amber",
    description: "Malty caramel backbone with a clean finish. Easy-drinking amber ale for long campaign nights.",
    price: "$6",
    tags: ["Amber Ale", "5.4% ABV"],
  },
  {
    name: "Rotating Local Tap",
    description: "We partner with a new local brewery each month. Ask your bartender what's on — it's always a surprise worth rolling for.",
    price: "$7",
    tags: ["Seasonal", "Varies"],
    badge: "ASK US",
  },
];

const HOUSE_COCKTAILS: MenuItem[] = [
  {
    name: "Fireball Elixir",
    description: "Bourbon, cinnamon honey syrup, fresh orange juice, and a smoked cherry. A sorcerer's favourite — warm, sweet, and impossible to resist.",
    price: "$12",
    tags: ["Bourbon", "Warm & Spiced"],
  },
  {
    name: "Healing Potion",
    description: "Gin, elderflower cordial, fresh cucumber, lime juice, and a dash of blue butterfly pea flower. Bright green and genuinely restorative.",
    price: "$12",
    tags: ["Gin", "Light & Floral"],
  },
  {
    name: "Shadow Step",
    description: "Dark rum, blackberry shrub, fresh lime, ginger beer, and a float of absinthe mist. The rogue's drink — arrives before you notice it.",
    price: "$13",
    tags: ["Dark Rum", "Bold & Mysterious"],
  },
  {
    name: "Bardic Inspiration",
    description: "Prosecco, lavender syrup, lemon juice, and blueberry. Sparkling, light, and guaranteed to raise your Charisma by 2.",
    price: "$11",
    tags: ["Prosecco", "Light & Bubbly"],
  },
  {
    name: "Dragon's Breath",
    description: "Jalapeño-infused tequila, mango purée, fresh lime, and a tajín rim. Breathe fire. Roll initiative.",
    price: "$13",
    tags: ["Tequila", "Spicy & Tropical"],
  },
];

const SEASONAL_COCKTAIL: MenuItem[] = [
  {
    name: "Spring Equinox Bloom",
    description: "St-Germain elderflower liqueur, white wine, fresh strawberry, basil, and a splash of pink lemonade. Our Spring equinox special — light, fragrant, and only around until the summer solstice.",
    price: "$13",
    tags: ["Seasonal", "Spring 2026"],
    badge: "SEASONAL",
  },
];

const ZERO_PROOF: MenuItem[] = [
  {
    name: "Paladin's Pledge",
    description: "Sparkling water, fresh mint, cucumber ribbon, and a squeeze of lime. Clean, virtuous, and surprisingly refreshing.",
    price: "$5",
    tags: ["Non-Alcoholic"],
  },
  {
    name: "The Oracle",
    description: "Hibiscus tea, pomegranate juice, ginger syrup, and soda water. Mystical in colour, balanced in flavour.",
    price: "$5",
    tags: ["Non-Alcoholic"],
  },
  {
    name: "Druid's Draft",
    description: "Cold-brew green tea, honey, fresh lemon, and mint. Earthy and grounding — perfect for long sessions.",
    price: "$5",
    tags: ["Non-Alcoholic"],
  },
];

const SNACKS: MenuItem[] = [
  {
    name: "Soft Pretzels",
    description: "Two oven-fresh salted pretzels served with beer cheese dip and whole grain mustard.",
    price: "$9",
    tags: ["Vegetarian"],
  },
  {
    name: "Chips & Dips",
    description: "Tortilla chips with a trio of house-made dips: guacamole, salsa roja, and roasted jalapeño hummus.",
    price: "$10",
    tags: ["Vegan", "Gluten-Free Chips"],
  },
  {
    name: "Loaded Nachos",
    description: "Tortilla chips piled with cheddar, black beans, pickled jalapeños, sour cream, and pico de gallo. Add pulled pork for $3.",
    price: "$13",
    tags: ["Shareable"],
  },
  {
    name: "Tavern Spiced Nuts",
    description: "A blend of roasted almonds, cashews, and pecans tossed in smoked paprika, brown sugar, and rosemary.",
    price: "$7",
    tags: ["Vegan", "Gluten-Free"],
  },
  {
    name: "Dungeon Popcorn",
    description: "Choose your flavour: Classic Butter & Salt, White Cheddar, or Chili Lime. Comes in a shareable pail.",
    price: "$6",
    tags: ["Vegan Option", "Shareable"],
  },
  {
    name: "Adventurer's Platter",
    description: "A board built for the whole party — cured meats, artisan cheeses, pickles, olives, crackers, and honeycomb. Feeds 3–4.",
    price: "$24",
    tags: ["Shareable", "Fan Favourite"],
    badge: "POPULAR",
  },
];

const MAINS: MenuItem[] = [
  {
    name: "Quest Sliders",
    description: "Three mini smash burgers on brioche buns with American cheese, pickles, and special sauce. Comes with a side of fries.",
    price: "$16",
  },
  {
    name: "Crispy Chicken Bites",
    description: "Buttermilk-fried chicken strips with your choice of dipping sauce: honey mustard, buffalo, or ranch.",
    price: "$14",
  },
  {
    name: "Flatbread of the Day",
    description: "Ask your server for today's topping. Thin-crust, shareable, and always rotating.",
    price: "$13",
    tags: ["Vegetarian Options"],
    badge: "ASK US",
  },
];

// ── Section component ────────────────────────────────────────────────────────

function Section({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-8 mb-16">
      {children}
    </section>
  );
}

function SectionHeader({ icon, heading, subheading }: { icon: string; heading: string; subheading: string }) {
  return (
    <div className="flex items-center gap-4 mb-8 pb-4 border-b-2 border-gold-rune/30">
      <span className="text-4xl">{icon}</span>
      <div>
        <h2 className="font-cinzel text-2xl md:text-3xl font-bold text-dungeon-dark">{heading}</h2>
        <p className="font-im-fell italic text-tavern-wood text-sm mt-0.5">{subheading}</p>
      </div>
    </div>
  );
}

function MenuCard({ item }: { item: MenuItem }) {
  return (
    <div className="flex gap-4 py-5 border-b border-dungeon-purple/20 last:border-0 group">
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-start gap-2 mb-1">
          <span className="font-cinzel text-dungeon-dark font-bold text-base group-hover:text-tavern-wood transition-colors">
            {item.name}
          </span>
          {item.badge && (
            <span className="font-cinzel text-[9px] tracking-widest uppercase px-2 py-0.5 rounded bg-gold-rune text-dungeon-dark font-bold">
              {item.badge}
            </span>
          )}
        </div>
        <p className="font-im-fell text-dungeon-dark/70 text-sm leading-relaxed mb-2">
          {item.description}
        </p>
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="font-cinzel text-[9px] tracking-wider uppercase px-2 py-0.5 rounded-full border border-dungeon-purple/30 text-tavern-wood"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="flex-shrink-0 text-right pt-0.5">
        <span className="font-cinzel font-bold text-tavern-wood text-lg">{item.price}</span>
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function MenuPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#fdf8ee" }}>

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <div
        className="relative py-20 px-4 text-center overflow-hidden"
        style={{ backgroundColor: "#1a1020" }}
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{ background: "radial-gradient(ellipse 70% 50% at 50% 40%, #8b5e3c, transparent)" }}
        />
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="flex justify-center mb-4">
            <GobletIcon size={64} className="animate-float" />
          </div>
          <p className="font-cinzel text-gold-rune/70 text-xs tracking-[0.4em] uppercase mb-3">
            The Enchanted Bar
          </p>
          <h1 className="font-cinzel-decorative text-4xl md:text-5xl font-black text-parchment mb-4">
            Tavern Menu
          </h1>
          <div className="h-px bg-gradient-to-r from-transparent via-gold-rune to-transparent opacity-40 mb-4" />
          <p className="font-im-fell italic text-parchment-dark/70 text-lg leading-relaxed">
            Light bites and legendary pours — crafted for adventurers who game hard
            and eat well. All food is designed to be enjoyed with one hand free for rolling dice.
          </p>
        </div>
      </div>

      {/* ── Jump nav ─────────────────────────────────────────────── */}
      <div
        className="sticky top-0 z-10 border-b"
        style={{ backgroundColor: "#fdf8ee", borderColor: "#d4af3740" }}
      >
        <div className="max-w-4xl mx-auto px-4 py-3 flex flex-wrap gap-x-6 gap-y-1 text-xs font-cinzel tracking-widest uppercase">
          {[
            { href: "#on-tap",    label: "On Tap" },
            { href: "#cocktails", label: "Cocktails" },
            { href: "#seasonal",  label: "Seasonal" },
            { href: "#zero-proof",label: "Zero-Proof" },
            { href: "#snacks",    label: "Snacks" },
            { href: "#mains",     label: "Mains" },
          ].map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="text-tavern-wood hover:text-dungeon-dark transition-colors py-1 border-b-2 border-transparent hover:border-gold-rune"
            >
              {label}
            </a>
          ))}
        </div>
      </div>

      {/* ── Content ──────────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-4 py-12">

        {/* On Tap */}
        <Section id="on-tap">
          <SectionHeader icon="🍺" heading="Beers on Tap" subheading="24 lines — rotating selection, always cold" />
          <div>
            {BEERS_ON_TAP.map((item) => <MenuCard key={item.name} item={item} />)}
          </div>
          <p className="font-im-fell italic text-tavern-wood/60 text-sm mt-4">
            Cans & bottles also available. Ask your server for today's bottle list.
          </p>
        </Section>

        {/* House Cocktails */}
        <Section id="cocktails">
          <SectionHeader icon="🧪" heading="House Cocktails" subheading="Brewed by our tiefling bartender — a potion for every alignment" />
          <div>
            {HOUSE_COCKTAILS.map((item) => <MenuCard key={item.name} item={item} />)}
          </div>
        </Section>

        {/* Seasonal */}
        <Section id="seasonal">
          <SectionHeader icon="🌸" heading="Seasonal Special" subheading="Limited time — savour it while it lasts" />
          <div
            className="rounded-2xl p-6 border"
            style={{ backgroundColor: "#fdf0d5", borderColor: "#d4af3760" }}
          >
            {SEASONAL_COCKTAIL.map((item) => <MenuCard key={item.name} item={item} />)}
          </div>
        </Section>

        {/* Zero-Proof */}
        <Section id="zero-proof">
          <SectionHeader icon="✨" heading="Zero-Proof Potions" subheading="All the magic, none of the hangover" />
          <div>
            {ZERO_PROOF.map((item) => <MenuCard key={item.name} item={item} />)}
          </div>
        </Section>

        {/* Snacks */}
        <Section id="snacks">
          <SectionHeader icon="🥨" heading="Snacks & Bites" subheading="One hand for dice, one hand for food" />
          <div>
            {SNACKS.map((item) => <MenuCard key={item.name} item={item} />)}
          </div>
        </Section>

        {/* Mains */}
        <Section id="mains">
          <SectionHeader icon="🍔" heading="Mains" subheading="Something heartier for the long campaign" />
          <div>
            {MAINS.map((item) => <MenuCard key={item.name} item={item} />)}
          </div>
        </Section>

        {/* Footer note */}
        <div
          className="mt-4 pt-8 border-t text-center"
          style={{ borderColor: "#d4af3740" }}
        >
          <p className="font-im-fell italic text-tavern-wood/60 text-sm leading-relaxed">
            Allergen information available on request. Please inform your server of any dietary requirements.
            Menu items subject to availability. The innkeeper reserves the right to cut off any adventurer
            who has had one too many healing potions.
          </p>
        </div>
      </div>
    </div>
  );
}
