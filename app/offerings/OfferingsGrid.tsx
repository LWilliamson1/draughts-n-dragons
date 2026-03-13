"use client";

import Link from "next/link";
import { DragonIcon, GobletIcon, PaintbrushIcon, CardIcon, ShieldIcon, MagicStarIcon } from "@/components/Icons";

export interface OfferingData {
  id: string;
  iconType: string;
  title: string;
  subtitle: string;
  tagline: string;
  description: string;
  features: string[];
  cta: string;
  ctaHref: string;
  badge: string;
  badgeColor: string;
  accentColor: string;
}

const iconMap: Record<string, React.ReactNode> = {
  dragon: <DragonIcon size={56} />,
  goblet: <GobletIcon size={56} />,
  paintbrush: <PaintbrushIcon size={56} />,
  card: <CardIcon size={56} />,
  shield: <ShieldIcon size={56} />,
  magic: <MagicStarIcon size={56} />,
};

export default function OfferingsGrid({ offerings }: { offerings: OfferingData[] }) {
  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {offerings.map((item, idx) => (
        <div
          key={item.id}
          id={item.id}
          className={`offering-card flex flex-col ${
            idx % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"
          } overflow-hidden`}
        >
          {/* Icon panel */}
          <div
            className="md:w-72 flex-shrink-0 flex flex-col items-center justify-center p-10 gap-4"
            style={{
              background: "linear-gradient(135deg, rgba(74,45,110,0.4), rgba(13,10,14,0.6))",
              borderRight: idx % 2 === 0 ? `1px solid ${item.accentColor}30` : "none",
              borderLeft: idx % 2 === 1 ? `1px solid ${item.accentColor}30` : "none",
            }}
          >
            <div
              className="rounded-full p-5 border-2"
              style={{
                borderColor: item.accentColor,
                boxShadow: `0 0 30px ${item.accentColor}40`,
                background: "rgba(13,10,14,0.5)",
              }}
            >
              {iconMap[item.iconType] ?? <MagicStarIcon size={56} />}
            </div>
            <span className={`event-tag font-cinzel text-xs ${item.badgeColor}`}>{item.badge}</span>
            <div className="font-im-fell italic text-parchment-dark opacity-50 text-sm text-center">
              {item.subtitle}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-8 md:p-10">
            <p className="font-im-fell italic text-sm mb-1 tracking-widest" style={{ color: item.accentColor }}>
              {item.tagline}
            </p>
            <h2 className="font-cinzel text-parchment text-2xl md:text-3xl font-bold mb-3">{item.title}</h2>
            <p className="font-im-fell text-parchment-dark opacity-70 text-base leading-relaxed mb-6">
              {item.description}
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-8">
              {item.features.map((feat) => (
                <li key={feat} className="flex items-start gap-2 font-im-fell text-parchment-dark opacity-70 text-sm">
                  <span style={{ color: item.accentColor }} className="mt-0.5 flex-shrink-0">✦</span>
                  {feat}
                </li>
              ))}
            </ul>
            <Link
              href={item.ctaHref}
              className="inline-block font-cinzel text-sm tracking-wider uppercase px-6 py-2.5 rounded border transition-all duration-300"
              style={{ borderColor: item.accentColor, color: item.accentColor }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = item.accentColor;
                (e.currentTarget as HTMLElement).style.color = "#0d0a0e";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                (e.currentTarget as HTMLElement).style.color = item.accentColor;
              }}
            >
              {item.cta} →
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
