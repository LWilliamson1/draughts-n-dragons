/**
 * Email templates for Draughts & Dragons.
 *
 * Each template is a function that accepts a typed payload and returns
 * { subject, html }. The HTML uses table-based layout with inline styles
 * for maximum email-client compatibility.
 *
 * Brand palette (email-safe approximations):
 *   background:  #1a1025   dungeon-dark
 *   card:        #f5f0e8   warm parchment (light for email clients)
 *   gold:        #d4af37   gold-rune
 *   crimson:     #c0392b   dragon-crimson
 *   text-dark:   #2c1810   rich dark brown
 *   text-muted:  #6b5744   muted brown
 */

import { EmailType } from "@/app/generated/prisma/client";

// ── Shared layout wrapper ─────────────────────────────────────────────────────

function wrap(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background-color:#f0ebe3;font-family:Georgia,'Times New Roman',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0ebe3;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:600px;background-color:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #d4c4a8;">

          <!-- Header -->
          <tr>
            <td style="background-color:#1a1025;padding:28px 32px;text-align:center;border-bottom:3px solid #d4af37;">
              <p style="margin:0 0 4px;font-family:Georgia,serif;font-size:22px;font-weight:bold;letter-spacing:2px;color:#d4af37;">
                ⚔️ Draughts &amp; Dragons
              </p>
              <p style="margin:0;font-size:12px;color:#8b6f9e;letter-spacing:4px;font-style:italic;">
                Tavern &amp; Tomes
              </p>
            </td>
          </tr>

          <!-- Body -->
          ${body}

          <!-- Footer -->
          <tr>
            <td style="background-color:#1a1025;padding:20px 32px;text-align:center;border-top:1px solid #2d1f3d;">
              <p style="margin:0 0 6px;font-size:12px;color:#6b5090;letter-spacing:1px;">
                Draughts &amp; Dragons · 123 Dragon's Rest Lane · Adventure City, AC 12345
              </p>
              <p style="margin:0;font-size:11px;color:#4a3563;">
                hello@draughtsndragons.com
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function section(content: string, bg = "#ffffff"): string {
  return `<tr><td style="padding:32px;background-color:${bg};">${content}</td></tr>`;
}

function heading(text: string): string {
  return `<h1 style="margin:0 0 16px;font-family:Georgia,serif;font-size:24px;font-weight:bold;color:#2c1810;letter-spacing:1px;">${text}</h1>`;
}

function para(text: string, style = ""): string {
  return `<p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#3d2b1a;${style}">${text}</p>`;
}

function divider(): string {
  return `<tr><td style="padding:0 32px;"><hr style="border:none;border-top:1px solid #e8dfc8;margin:0;" /></td></tr>`;
}

function button(label: string, href: string): string {
  return `<table cellpadding="0" cellspacing="0" style="margin:20px 0 4px;">
    <tr>
      <td style="background-color:#d4af37;border-radius:6px;padding:12px 28px;">
        <a href="${href}" style="color:#1a1025;font-family:Georgia,serif;font-size:14px;font-weight:bold;text-decoration:none;letter-spacing:1px;text-transform:uppercase;">${label}</a>
      </td>
    </tr>
  </table>`;
}

function infoTable(rows: [string, string][]): string {
  const inner = rows.map(([k, v]) => `
    <tr>
      <td style="padding:8px 12px;font-size:13px;color:#6b5744;border-bottom:1px solid #ede4d3;font-weight:bold;white-space:nowrap;">${k}</td>
      <td style="padding:8px 12px;font-size:13px;color:#2c1810;border-bottom:1px solid #ede4d3;">${v}</td>
    </tr>`).join("");
  return `<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#faf6ef;border:1px solid #e0d5c0;border-radius:6px;margin:16px 0;">${inner}</table>`;
}

// ── Templates ─────────────────────────────────────────────────────────────────

export interface RsvpConfirmationPayload {
  name: string;
  eventTitle: string;
  eventDate: string;   // "Saturday, 15 March 2026"
  eventTime: string;
  eventDescription: string;
  quantity: number;
  price: string;
  isFree: boolean;
  eventId: string;
  appUrl: string;
}

function rsvpConfirmation(p: RsvpConfirmationPayload): { subject: string; html: string } {
  const subject = `Your spot is confirmed — ${p.eventTitle}`;
  const body = [
    section(`
      ${heading("Your quest awaits, " + p.name + "!")}
      ${para("We've secured your spot for the following event at the tavern. Ready your dice and prepare for adventure.")}
      ${infoTable([
        ["Event",    p.eventTitle],
        ["Date",     p.eventDate],
        ["Time",     p.eventTime],
        ["Tickets",  String(p.quantity)],
        ["Total",    p.isFree ? "FREE" : `$${p.price}`],
      ])}
      ${para(p.eventDescription, "color:#6b5744;font-style:italic;font-size:14px;")}
      ${button("View My Booking", `${p.appUrl}/account`)}
      ${para("See you at the tavern! 🍺", "margin-top:24px;color:#6b5744;")}
    `),
  ].join("");
  return { subject, html: wrap(subject, body) };
}

export interface EventReminderPayload {
  name: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventDescription: string;
  quantity: number;
  hoursUntil: number;
  eventId: string;
  appUrl: string;
}

function eventReminder(p: EventReminderPayload): { subject: string; html: string } {
  const when = p.hoursUntil >= 48
    ? `${Math.round(p.hoursUntil / 24)} days`
    : p.hoursUntil === 1
    ? "1 hour"
    : `${p.hoursUntil} hours`;
  const subject = `Reminder: ${p.eventTitle} is in ${when}!`;
  const urgency = p.hoursUntil <= 2
    ? para("⚠️ The event begins very soon — don't forget to head to the tavern!", "color:#c0392b;font-weight:bold;")
    : "";
  const body = [
    section(`
      ${heading("Your adventure begins in " + when + ", " + p.name + "!")}
      ${urgency}
      ${para("Just a friendly nudge from your tavern keepers — you have a booking coming up.")}
      ${infoTable([
        ["Event",   p.eventTitle],
        ["Date",    p.eventDate],
        ["Time",    p.eventTime],
        ["Tickets", String(p.quantity)],
      ])}
      ${para(p.eventDescription, "color:#6b5744;font-style:italic;font-size:14px;")}
      ${button("View Event Details", `${p.appUrl}/events`)}
      ${para("We look forward to seeing you — roll for initiative! 🎲", "margin-top:24px;color:#6b5744;")}
    `),
  ].join("");
  return { subject, html: wrap(subject, body) };
}

export interface OrderConfirmationPayload {
  name: string;
  orderNumber: string;
  items: { name: string; qty: number; price: string }[];
  total: string;
  appUrl: string;
}

function orderConfirmation(p: OrderConfirmationPayload): { subject: string; html: string } {
  const subject = `Order confirmed — #${p.orderNumber}`;
  const rows = p.items.map(
    (i): [string, string] => [`${i.name} × ${i.qty}`, `$${i.price}`]
  );
  rows.push(["Total", `$${p.total}`]);
  const body = [
    section(`
      ${heading("Order received, " + p.name + "!")}
      ${para("Your order has been confirmed and is being prepared. You'll receive another message when it ships.")}
      ${infoTable([["Order #", p.orderNumber], ...rows])}
      ${button("View My Orders", `${p.appUrl}/account`)}
      ${para("Thank you for supporting your local TTRPG tavern! 🐉", "margin-top:24px;color:#6b5744;")}
    `),
  ].join("");
  return { subject, html: wrap(subject, body) };
}

export interface OrderShippedPayload {
  name: string;
  orderNumber: string;
  trackingNumber?: string;
  trackingUrl?: string;
  appUrl: string;
}

function orderShipped(p: OrderShippedPayload): { subject: string; html: string } {
  const subject = `Your order #${p.orderNumber} has shipped!`;
  const tracking = p.trackingNumber
    ? infoTable([["Tracking #", p.trackingNumber]])
    : "";
  const trackBtn = p.trackingUrl ? button("Track Your Package", p.trackingUrl) : "";
  const body = [
    section(`
      ${heading("Your wares are on the way, " + p.name + "!")}
      ${para("Your order has been dispatched from the tavern. Your treasures will arrive shortly.")}
      ${tracking}
      ${trackBtn}
      ${button("View Order", `${p.appUrl}/account`)}
      ${para("May your package arrive safely! ⚔️", "margin-top:24px;color:#6b5744;")}
    `),
  ].join("");
  return { subject, html: wrap(subject, body) };
}

export interface NewsletterPayload {
  headline: string;
  previewText: string;
  sections: { title: string; body: string; ctaLabel?: string; ctaHref?: string }[];
  appUrl: string;
}

function newsletter(p: NewsletterPayload): { subject: string; html: string } {
  const subject = p.headline;
  const inner = p.sections.map((s) => `
    <h2 style="margin:0 0 10px;font-family:Georgia,serif;font-size:18px;color:#2c1810;border-bottom:2px solid #d4af37;padding-bottom:6px;">${s.title}</h2>
    ${para(s.body)}
    ${s.ctaLabel && s.ctaHref ? button(s.ctaLabel, s.ctaHref) : ""}
    <br/>
  `).join("");
  const body = [
    section(`
      ${heading(p.headline)}
      ${para(p.previewText, "color:#6b5744;font-style:italic;")}
    `),
    divider(),
    section(inner),
    divider(),
    section(para(`You're receiving this because you're a registered adventurer at Draughts &amp; Dragons. Visit <a href="${p.appUrl}/account" style="color:#d4af37;">your account</a> to manage preferences.`, "font-size:12px;color:#8b7355;")),
  ].join("");
  return { subject, html: wrap(subject, body) };
}

export interface WelcomePayload {
  name: string;
  appUrl: string;
}

function welcome(p: WelcomePayload): { subject: string; html: string } {
  const subject = "Welcome to Draughts & Dragons!";
  const body = [
    section(`
      ${heading("Welcome to the tavern, " + p.name + "!")}
      ${para("Your account has been created. You're now part of our fellowship of adventurers, miniature painters, and board game enthusiasts.")}
      ${para("Here's what you can do as a registered member:")}
      <ul style="margin:0 0 16px;padding-left:20px;color:#3d2b1a;line-height:1.9;font-size:15px;">
        <li>RSVP to events and see your upcoming bookings</li>
        <li>Browse our wares — minis, paints, board games, and TCG</li>
        <li>Get email reminders before events you've booked</li>
        <li>Stay updated with tavern news and announcements</li>
      </ul>
      ${button("Explore the Tavern", p.appUrl)}
      ${para("We can't wait to adventure with you. 🎲", "margin-top:24px;color:#6b5744;")}
    `),
  ].join("");
  return { subject, html: wrap(subject, body) };
}

// ── Dispatcher ────────────────────────────────────────────────────────────────

export function renderTemplate(
  type: EmailType,
  payload: Record<string, unknown>,
): { subject: string; html: string } {
  switch (type) {
    case EmailType.RSVP_CONFIRMATION:
      return rsvpConfirmation(payload as unknown as RsvpConfirmationPayload);
    case EmailType.EVENT_REMINDER:
      return eventReminder(payload as unknown as EventReminderPayload);
    case EmailType.ORDER_CONFIRMATION:
      return orderConfirmation(payload as unknown as OrderConfirmationPayload);
    case EmailType.ORDER_SHIPPED:
      return orderShipped(payload as unknown as OrderShippedPayload);
    case EmailType.NEWSLETTER:
      return newsletter(payload as unknown as NewsletterPayload);
    case EmailType.WELCOME:
      return welcome(payload as unknown as WelcomePayload);
    default:
      throw new Error(`Unknown email type: ${type}`);
  }
}
