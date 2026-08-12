import fs from 'node:fs';
import path from 'node:path';
import { randomBytes } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// A small in-process store that reads and writes the app's JSON persistence file.
function createLinkStore(dbPath = path.join(__dirname, 'data.sqlite')) {
  const dataDir = path.dirname(dbPath);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const links = new Map();
  const clickHistory = new Map();

  function load() {
    if (fs.existsSync(dbPath)) {
      const raw = fs.readFileSync(dbPath, 'utf8');
      if (!raw) return;
      const parsed = JSON.parse(raw);
      for (const link of parsed.links || []) {
        links.set(link.slug, { ...link });
      }
      for (const [slug, clicks] of Object.entries(parsed.clicks || {})) {
        clickHistory.set(slug, [...clicks]);
      }
    }
  }

  function persist() {
    const payload = {
      links: Array.from(links.values()),
      clicks: Object.fromEntries(clickHistory.entries()),
    };
    fs.writeFileSync(dbPath, JSON.stringify(payload, null, 2));
  }

  // Creates one link record and stores the initial link metadata plus empty click history.
  function generateSlug() {
    let slug;
    do {
      slug = randomBytes(5).toString('base64url');
    } while (links.has(slug));
    return slug;
  }

  function createLink({ destinationUrl, slug, cap = null }) {
    if (!destinationUrl) {
      throw new Error('Destination URL is required');
    }

    try {
      const parsedUrl = new URL(destinationUrl);
      if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
        throw new Error();
      }
    } catch {
      throw new Error('Destination URL must be a valid http or https URL');
    }

    const normalizedSlug = slug?.trim() || generateSlug();
    if (!/^[A-Za-z0-9_-]{3,64}$/.test(normalizedSlug)) {
      throw new Error('Slug must contain 3-64 letters, numbers, hyphens, or underscores');
    }
    if (links.has(normalizedSlug)) {
      throw new Error(`Slug "${normalizedSlug}" already exists`);
    }

    const normalizedCap = cap === null || cap === '' || cap === undefined ? null : Number(cap);
    if (normalizedCap !== null && (!Number.isInteger(normalizedCap) || normalizedCap < 1)) {
      throw new Error('Click cap must be a positive whole number');
    }

    const link = {
      slug: normalizedSlug,
      destinationUrl: destinationUrl.trim(),
      cap: normalizedCap,
      enabled: true,
      clickCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      disabledAt: null,
    };

    links.set(normalizedSlug, link);
    clickHistory.set(normalizedSlug, []);
    persist();
    return link;
  }

  function getLinkBySlug(slug) {
    const link = links.get(slug);
    return link ? { ...link } : null;
  }

  function listLinks({ search = '', page = 1, limit = 10 } = {}) {
    const normalizedSearch = search.toLowerCase();
    const filtered = Array.from(links.values()).filter((link) => {
      return [link.slug, link.destinationUrl].some((value) => value.toLowerCase().includes(normalizedSearch));
    });

    const sorted = filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const start = (page - 1) * limit;
    const pageItems = sorted.slice(start, start + limit).map((link) => ({ ...link }));

    return {
      items: pageItems,
      total: sorted.length,
      page,
      limit,
    };
  }

  // Records a redirect visit, updates clickCount, appends click metadata, and enforces cap rules.
  function recordClick(slug, referrer = '') {
    const link = links.get(slug);
    if (!link) {
      return { status: 'missing', destinationUrl: null };
    }
    if (link.cap !== null && link.clickCount >= link.cap) {
      return { status: 'capped', destinationUrl: null };
    }
    if (!link.enabled) {
      return { status: 'disabled', destinationUrl: null };
    }

    link.clickCount += 1;
    link.updatedAt = new Date().toISOString();
    const clicks = clickHistory.get(slug) || [];
    clicks.push({
      timestamp: new Date().toISOString(),
      referrer,
    });
    clickHistory.set(slug, clicks);
    // Writes are synchronous in this single Node process, so only one request can consume the final click.
    if (link.cap !== null && link.clickCount >= link.cap) {
      link.enabled = false;
      link.disabledAt = new Date().toISOString();
    }
    persist();
    return { status: 'redirect', destinationUrl: link.destinationUrl };
  }

  function getClicks(slug) {
    return (clickHistory.get(slug) || []).slice();
  }

  function getDailyClickCounts(slug, days = 7) {
    const utcToday = new Date();
    const start = new Date(Date.UTC(utcToday.getUTCFullYear(), utcToday.getUTCMonth(), utcToday.getUTCDate()));
    start.setUTCDate(start.getUTCDate() - (days - 1));
    const counts = new Map();

    for (let offset = 0; offset < days; offset += 1) {
      const day = new Date(start);
      day.setUTCDate(start.getUTCDate() + offset);
      counts.set(day.toISOString().slice(0, 10), 0);
    }

    for (const click of getClicks(slug)) {
      const day = new Date(click.timestamp).toISOString().slice(0, 10);
      if (counts.has(day)) counts.set(day, counts.get(day) + 1);
    }

    return Array.from(counts, ([date, count]) => ({ date, count }));
  }

  function updateLink(slug, updates) {
    const link = links.get(slug);
    if (!link) {
      throw new Error('Link not found');
    }
    Object.assign(link, updates, {
      updatedAt: new Date().toISOString(),
    });
    persist();
    return { ...link };
  }

  function deleteLink(slug) {
    const link = links.get(slug);
    if (!link) {
      throw new Error('Link not found');
    }
    links.delete(slug);
    clickHistory.delete(slug);
    persist();
    return true;
  }

  load();

  return {
    createLink,
    getLinkBySlug,
    listLinks,
    recordClick,
    getClicks,
    getDailyClickCounts,
    updateLink,
    deleteLink,
  };
}

export { createLinkStore };
