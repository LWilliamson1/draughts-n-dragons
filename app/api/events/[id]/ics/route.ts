import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const MONTH_NUMS: Record<string, number> = {
  january: 1, february: 2, march: 3, april: 4, may: 5, june: 6,
  july: 7, august: 8, september: 9, october: 10, november: 11, december: 12,
  jan: 1, feb: 2, mar: 3, apr: 4, jun: 6, jul: 7, aug: 8,
  sep: 9, oct: 10, nov: 11, dec: 12,
};

function parseTime(timeStr: string): { h: number; m: number } {
  const first = timeStr.split(/[–—-]/)[0].trim();
  const match = first.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);
  if (!match) return { h: 18, m: 0 };
  let h = parseInt(match[1]);
  const m = parseInt(match[2] ?? "0");
  const meridiem = match[3]?.toLowerCase();
  if (meridiem === "pm" && h !== 12) h += 12;
  if (meridiem === "am" && h === 12) h = 0;
  return { h, m };
}

function toIcsDateTime(year: number, month: number, day: number, h: number, m: number) {
  return `${year}${String(month).padStart(2, "0")}${String(day).padStart(2, "0")}T${String(h).padStart(2, "0")}${String(m).padStart(2, "0")}00`;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const event = await prisma.event.findUnique({
    where: { id, published: true },
    select: { title: true, date: true, month: true, year: true, time: true, description: true },
  }).catch(() => null);

  if (!event) return new NextResponse("Not Found", { status: 404 });

  const monthNum = MONTH_NUMS[event.month.toLowerCase()] ?? 1;
  const day = parseInt(event.date);
  const { h, m } = parseTime(event.time);
  const start = toIcsDateTime(event.year, monthNum, day, h, m);
  const end = toIcsDateTime(event.year, monthNum, day, Math.min(h + 2, 23), m);

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Draughts & Dragons//EN",
    "BEGIN:VEVENT",
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.description.replace(/\n/g, "\\n")}`,
    "LOCATION:Draughts & Dragons",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const filename = event.title.replace(/[^a-z0-9]/gi, "-");
  return new NextResponse(ics, {
    headers: {
      "Content-Type": "text/calendar;charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}.ics"`,
    },
  });
}
