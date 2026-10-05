// Firefox exposes the promise-based API as `browser`; Chrome as `chrome`.
const ext = globalThis.browser ?? globalThis.chrome;

const SITE_URL = 'https://boardroomlist.com';

const TAB_COPY = {
  open: { empty: 'No open roles match right now.', timeLabel: 'posted' },
  today: { empty: 'Nothing new today yet — check back soon.', timeLabel: 'posted' },
  new: { empty: 'Nothing new this week yet.', timeLabel: 'posted' },
  closed: { empty: 'Nothing filled this week yet.', timeLabel: 'filled' },
};

const tabButtons = document.querySelectorAll('.tab');
const feedList = document.getElementById('feed-list');

let activeWindow = 'open';
let requestId = 0;

function timeAgo(iso) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function formatSalary(min, max) {
  const fmt = (n) => (n >= 1000 ? `$${Math.round(n / 1000)}K` : `$${n}`);
  if (min && max && min !== max) return `${fmt(min)}–${fmt(max)}`;
  if (min || max) return fmt(min || max);
  return null;
}

function renderCards(window, items) {
  const copy = TAB_COPY[window];
  feedList.innerHTML = '';

  if (!items.length) {
    const empty = document.createElement('div');
    empty.className = 'feed-empty';
    empty.textContent = copy.empty;
    feedList.appendChild(empty);
    return;
  }

  for (const role of items) {
    const a = document.createElement('a');
    a.className = 'card';
    a.href = role.url;
    a.target = '_blank';
    a.rel = 'noopener';

    const top = document.createElement('div');
    top.className = 'card-top';
    const badge = document.createElement('span');
    badge.className = 'badge';
    badge.textContent = role.level;
    const time = document.createElement('span');
    time.className = 'card-time';
    const when = window === 'closed' ? role.closedAt : role.firstSeen;
    time.textContent = when ? `${copy.timeLabel} ${timeAgo(when)}` : '';
    top.append(badge, time);

    const title = document.createElement('div');
    title.className = 'card-title';
    title.textContent = role.title;

    const meta = document.createElement('div');
    meta.className = 'card-meta';
    meta.textContent = [role.function, role.location].filter(Boolean).join(' · ');

    a.append(top, title, meta);

    const salary = formatSalary(role.salaryMin, role.salaryMax);
    if (salary) {
      const comp = document.createElement('div');
      comp.className = 'card-comp';
      comp.textContent = salary;
      a.appendChild(comp);
    }

    if (role.teaser) {
      const teaser = document.createElement('div');
      teaser.className = 'card-teaser';
      teaser.textContent = role.teaser;
      a.appendChild(teaser);
    }

    feedList.appendChild(a);
  }

  const more = document.createElement('div');
  more.className = 'feed-more';
  const moreLink = document.createElement('a');
  moreLink.href = `${SITE_URL}/roles?tab=${window}`;
  moreLink.target = '_blank';
  moreLink.rel = 'noopener';
  moreLink.textContent = 'View more roles on BoardroomList.com';
  more.appendChild(moreLink);
  feedList.appendChild(more);
}

async function loadWindow(window) {
  const thisRequest = ++requestId;
  feedList.innerHTML = '<div class="feed-loading">Loading…</div>';
  try {
    const resp = await fetch(`${SITE_URL}/api/public/feed?window=${window}&limit=6`);
    if (!resp.ok) throw new Error('bad response');
    const data = await resp.json();
    if (thisRequest !== requestId) return; // a newer tab click already superseded this one
    renderCards(window, data.items || []);
  } catch {
    if (thisRequest !== requestId) return;
    feedList.innerHTML = '<div class="feed-empty">Couldn’t reach BoardroomList.com. Try again later.</div>';
  }
}

tabButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    if (btn.dataset.window === activeWindow) return;
    activeWindow = btn.dataset.window;
    tabButtons.forEach((b) => b.classList.toggle('active', b === btn));
    ext.storage.local.set({ lastTab: activeWindow });
    loadWindow(activeWindow);
  });
});

(async () => {
  const { lastTab } = await ext.storage.local.get('lastTab');
  const initial = lastTab && TAB_COPY[lastTab] ? lastTab : 'open';
  activeWindow = initial;
  tabButtons.forEach((b) => b.classList.toggle('active', b.dataset.window === initial));
  loadWindow(initial);
})();
