/**
 * Shared utility for parsing an Event's string date fields into a JS Date.
 * The Event model stores date/month/year/time as strings for display flexibility;
 * this converts them to a proper DateTime for scheduling and reminder logic.
 */

const MONTH_NUMS: Record<string, number> = {
  january: 1, february: 2, march: 3, april: 4, may: 5, june: 6,
  july: 7, august: 8, september: 9, october: 10, november: 11, december: 12,
  jan: 1, feb: 2, mar: 3, apr: 4, jun: 6, jul: 7, aug: 8,
  sep: 9, oct: 10, nov: 11, dec: 12,
};

/** Parse "7:00 PM" or "7:00 PM – 10:00 PM" → 24-hour { h, m } */
function parseHourMinute(timeStr: string): { h: number; m: number } | null {
  const first = timeStr.split(/[–—-]/)[0].trim();
  const match = first.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);
  if (!match) return null;
  let h = parseInt(match[1]);
  const m = parseInt(match[2] ?? "0");
  const meridiem = match[3]?.toLowerCase();
  if (meridiem === "pm" && h !== 12) h += 12;
  if (meridiem === "am" && h === 12) h = 0;
  return { h, m };
}

/**
 * Convert Event string fields into a UTC Date, or null if unparseable.
 *
 * @param date      Day of month as a string, e.g. "15"
 * @param month     Month name, e.g. "March"
 * @param year      Full year number, e.g. 2026
 * @param time      Time string, e.g. "7:00 PM" or "7:00 PM – 10:00 PM"
 */
export function parseEventDateTime(
  date: string,
  month: string,
  year: number,
  time: string,
): Date | null {
  const monthNum = MONTH_NUMS[month.toLowerCase()];
  if (!monthNum) return null;

  const day = parseInt(date);
  if (isNaN(day) || day < 1 || day > 31) return null;

  const hm = parseHourMinute(time);
  if (!hm) return null;

  // Construct as local time (the venue is in one timezone; UTC drift is acceptable
  // for reminder scheduling which has hour-level granularity)
  return new Date(year, monthNum - 1, day, hm.h, hm.m, 0, 0);
}
