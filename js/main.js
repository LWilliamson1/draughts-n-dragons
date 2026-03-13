/* ============================================================
   DRAUGHTS & DRAGONS — Main JavaScript
   ============================================================ */

'use strict';

// ============================================================
// Navbar mobile toggle
// ============================================================
(function initNav() {
  const toggle = document.getElementById('navToggle');
  const links  = document.getElementById('navLinks');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
  });

  // Close menu when a link is clicked
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => links.classList.remove('open'));
  });
})();

// ============================================================
// Scroll fade-in animations (IntersectionObserver)
// ============================================================
(function initFadeIn() {
  const els = document.querySelectorAll('.fade-in');
  if (!els.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger siblings slightly
          const siblings = entry.target.parentElement
            ? Array.from(entry.target.parentElement.children).filter(c => c.classList.contains('fade-in'))
            : [];
          const idx = siblings.indexOf(entry.target);
          const delay = idx * 80;
          setTimeout(() => entry.target.classList.add('visible'), delay);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  els.forEach(el => observer.observe(el));
})();

// ============================================================
// Event data
// ============================================================
const EVENTS = [
  // ---- Recurring: Wednesdays = Campaign Night ----
  { name: 'Campaign Night',        type: 'ttrpg',  time: '6:00 pm',  desc: 'Open TTRPG gaming. All systems welcome. Find a group or bring your own.', weekday: 3 },
  // ---- Recurring: Thursdays = Pint Night ----
  { name: 'Pint Night',            type: 'pint',   time: '7:00 pm',  desc: 'Themed ales, trivia, and casual gaming. New seasonal brew each month.',     weekday: 4 },
  // ---- Recurring: Fridays = FNM ----
  { name: 'Friday Night Magic',    type: 'magic',  time: '6:00 pm',  desc: 'Sanctioned MTG event — draft, standard, and commander formats available.',  weekday: 5 },

  // ---- Specific dates (March / April 2026) ----
  { name: 'Painting Tutorial: Beginners',     type: 'paint', date: '2026-03-14', time: '2:00 pm',  desc: 'Introduction to priming and base-coating. All materials provided.' },
  { name: 'Grand Opening Weekend — Day 1',    type: 'sale',  date: '2026-03-21', time: '12:00 pm', desc: 'Free demos, prizes, and inaugural pint specials. Day one of three!' },
  { name: 'Grand Opening Weekend — Day 2',    type: 'sale',  date: '2026-03-22', time: '12:00 pm', desc: 'Continued grand opening celebrations. DM of Ceremonies appearance at 5pm.' },
  { name: 'Grand Opening Weekend — Day 3',    type: 'sale',  date: '2026-03-23', time: '12:00 pm', desc: 'Final day of opening weekend. Raffle draw at 8pm. Prizes galore.' },
  { name: 'Monthly Tournament: MTG Sealed',   type: 'sale',  date: '2026-04-05', time: '11:00 am', desc: '6-pack sealed MTG tournament. Entry $40. Top 4 win store credit.' },
  { name: 'Painting Tutorial: Intermediate',  type: 'paint', date: '2026-03-28', time: '2:00 pm',  desc: 'Washes, highlights, and shading. Bring a primed mini to work on.' },
  { name: 'Painting Tutorial: Advanced',      type: 'paint', date: '2026-04-11', time: '2:00 pm',  desc: 'Non-metallic metal (NMM) and source lighting techniques.' },
  { name: 'Painting Tutorial: Speed Painting',type: 'paint', date: '2026-04-25', time: '2:00 pm',  desc: 'Army painting efficiency — contrast paints and speed techniques.' },
  { name: 'Pokémon TCG League',               type: 'magic', date: '2026-03-29', time: '1:00 pm',  desc: 'Monthly Pokémon TCG league event. All skill levels. Entry $10.' },
  { name: 'D&D One-Shot: The Lost Crypt',     type: 'ttrpg', date: '2026-04-18', time: '5:00 pm',  desc: 'A single-session D&D 5e adventure for new and experienced players alike. Pre-gen characters provided.' },
];

const TYPE_LABELS = {
  magic:  'Friday Night Magic',
  paint:  'Painting Tutorial',
  pint:   'Pint Night',
  ttrpg:  'Campaign / TTRPG',
  sale:   'Special Event',
  other:  'Event',
};

// ============================================================
// Calendar rendering
// ============================================================
let calYear  = 2026;
let calMonth = 2; // 0-indexed, so 2 = March

function getDatesForMonth(year, month) {
  const first   = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInM = new Date(year, month + 1, 0).getDate();
  const daysInP = new Date(year, month, 0).getDate();
  const cells   = [];

  // Pad start with prev month days
  for (let i = first - 1; i >= 0; i--) {
    cells.push({ day: daysInP - i, month: month - 1, year, other: true });
  }
  for (let d = 1; d <= daysInM; d++) {
    cells.push({ day: d, month, year, other: false });
  }
  // Pad end
  let trailing = 1;
  while (cells.length % 7 !== 0) {
    cells.push({ day: trailing++, month: month + 1, year, other: true });
  }
  return cells;
}

function getEventsForDate(year, month, day) {
  const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const weekday = new Date(year, month, day).getDay();
  const results = [];

  EVENTS.forEach(ev => {
    if (ev.date && ev.date === dateStr) {
      results.push(ev);
    } else if (ev.weekday !== undefined && ev.weekday === weekday) {
      results.push(ev);
    }
  });
  return results;
}

function renderCalendar() {
  const bodyEl = document.getElementById('calendarBody');
  const titleEl = document.getElementById('calMonthTitle');
  if (!bodyEl || !titleEl) return;

  const monthName = new Date(calYear, calMonth, 1)
    .toLocaleString('default', { month: 'long', year: 'numeric' });
  titleEl.textContent = monthName;

  const today    = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const cells = getDatesForMonth(calYear, calMonth);
  bodyEl.innerHTML = cells.map(c => {
    const dateStr = `${c.year}-${String(c.month + 1).padStart(2, '0')}-${String(c.day).padStart(2, '0')}`;
    const isToday = !c.other && dateStr === todayStr;
    const events  = c.other ? [] : getEventsForDate(c.year, c.month, c.day);

    const eventPills = events.slice(0, 3).map(ev =>
      `<div class="cell-event event-${ev.type}" onclick="openModal(${JSON.stringify(ev).replace(/"/g, '&quot;')})" title="${ev.name}">
        ${ev.name}
      </div>`
    ).join('');

    const more = events.length > 3
      ? `<div class="cell-event event-other">+${events.length - 3} more</div>`
      : '';

    return `
      <div class="calendar-cell${c.other ? ' other-month' : ''}${isToday ? ' today' : ''}">
        <div class="cell-num">${c.day}</div>
        <div class="cell-events">${eventPills}${more}</div>
      </div>`;
  }).join('');
}

function renderUpcomingEvents() {
  const listEl = document.getElementById('upcomingEventList');
  if (!listEl) return;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Build concrete upcoming events for next 30 days
  const upcoming = [];

  for (let i = 0; i <= 30; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const y = d.getFullYear();
    const m = d.getMonth();
    const day = d.getDate();
    const events = getEventsForDate(y, m, day);
    if (events.length) {
      upcoming.push({ date: d, events });
    }
  }

  if (!upcoming.length) {
    listEl.innerHTML = '<p class="text-muted text-center">No upcoming events found. Check back soon!</p>';
    return;
  }

  listEl.innerHTML = upcoming.slice(0, 8).map(({ date, events }) => {
    const dateLabel = date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
    return events.map((ev, idx) => `
      <div class="event-item">
        <div class="event-time">${idx === 0 ? dateLabel.split(',')[0] + ',' : ''}<br/>${idx === 0 ? dateLabel.split(', ').slice(1).join(', ') : ''}<br/>${ev.time}</div>
        <div class="event-connector">
          <div class="event-dot"></div>
          <div class="event-line"></div>
        </div>
        <div class="event-card" onclick="openModal(${JSON.stringify(ev).replace(/"/g, '&quot;')})">
          <span class="announcement-tag tag-${ev.type === 'magic' ? 'event' : ev.type === 'paint' ? 'workshop' : ev.type === 'sale' ? 'sale' : 'event'}" style="margin-bottom:0.4rem; display:inline-block;">
            ${TYPE_LABELS[ev.type] || 'Event'}
          </span>
          <div class="event-name">${ev.name}</div>
          <div class="event-meta">${ev.time} &mdash; ${ev.desc.slice(0, 80)}${ev.desc.length > 80 ? '…' : ''}</div>
        </div>
      </div>`).join('');
  }).join('');
}

// Calendar navigation
document.getElementById('prevMonth')?.addEventListener('click', () => {
  calMonth--;
  if (calMonth < 0) { calMonth = 11; calYear--; }
  renderCalendar();
});

document.getElementById('nextMonth')?.addEventListener('click', () => {
  calMonth++;
  if (calMonth > 11) { calMonth = 0; calYear++; }
  renderCalendar();
});

// ============================================================
// Event modal
// ============================================================
function openModal(ev) {
  const modal = document.getElementById('eventModal');
  if (!modal) return;

  document.getElementById('modalTitle').textContent = ev.name;
  document.getElementById('modalMeta').textContent  = `${ev.time}${ev.date ? ' · ' + new Date(ev.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : ' · Recurring'}`;
  document.getElementById('modalDesc').textContent  = ev.desc;
  document.getElementById('modalTag').textContent   = TYPE_LABELS[ev.type] || 'Event';
  document.getElementById('modalTag').className     =
    `announcement-tag tag-${ev.type === 'magic' ? 'event' : ev.type === 'paint' ? 'workshop' : ev.type === 'sale' ? 'sale' : 'event'}`;

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const modal = document.getElementById('eventModal');
  if (!modal) return;
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('modalClose')?.addEventListener('click', closeModal);
document.getElementById('eventModal')?.addEventListener('click', (e) => {
  if (e.target === e.currentTarget) closeModal();
});
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

// ============================================================
// Reservation form
// ============================================================
function handleReservation(e) {
  e.preventDefault();
  const form = document.getElementById('reservationForm');
  const btn  = form.querySelector('button[type="submit"]');

  btn.disabled  = true;
  btn.textContent = '⏳ Sending scroll...';

  // Simulate async submission
  setTimeout(() => {
    form.innerHTML = `
      <div style="text-align:center; padding:var(--space-xl) 0;">
        <div style="font-size:3rem; margin-bottom:var(--space-md); filter:drop-shadow(0 0 12px rgba(212,175,55,0.6));">⚔️</div>
        <h3 style="font-family:var(--font-heading); color:var(--color-gold); font-size:1.3rem; margin-bottom:var(--space-md);">
          Your quest has been registered!
        </h3>
        <p style="color:var(--color-muted); font-style:italic; max-width:360px; margin:0 auto;">
          We'll send a confirmation scroll to your email within 24 hours.
          Prepare your party — adventure awaits!
        </p>
      </div>`;
  }, 1500);
}

// ============================================================
// Set min date on reservation form to today
// ============================================================
(function setMinDate() {
  const dateInput = document.getElementById('resDate');
  if (!dateInput) return;
  const today = new Date().toISOString().split('T')[0];
  dateInput.min = today;
})();

// ============================================================
// Init
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  renderCalendar();
  renderUpcomingEvents();
});
