import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

  function createLink({ destinationUrl, slug, cap = null }) {
    if (!destinationUrl || !slug) {
      throw new Error('Destination URL and slug are required');
    }
    if (links.has(slug)) {
      throw new Error(`Slug "${slug}" already exists`);
    }

    const link = {
      slug,
      destinationUrl,
      cap: cap === null || cap === '' ? null : Number(cap),
      enabled: true,
      clickCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      disabledAt: null,
    };

    links.set(slug, link);
    clickHistory.set(slug, []);
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

  function recordClick(slug, referrer = '') {
    const link = links.get(slug);
    if (!link) {
      return { status: 'missing', destinationUrl: null };
    }
    if (!link.enabled) {
      return { status: 'disabled', destinationUrl: null };
    }
    if (link.cap !== null && link.clickCount >= link.cap) {
      link.enabled = false;
      link.disabledAt = new Date().toISOString();
      link.updatedAt = new Date().toISOString();
      persist();
      return { status: 'capped', destinationUrl: null };
    }

    link.clickCount += 1;
    link.updatedAt = new Date().toISOString();
    const clicks = clickHistory.get(slug) || [];
    clicks.push({
      timestamp: new Date().toISOString(),
      referrer,
    });
    clickHistory.set(slug, clicks);
    persist();
    return { status: 'redirect', destinationUrl: link.destinationUrl };
  }

  function getClicks(slug) {
    return (clickHistory.get(slug) || []).slice();
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
    updateLink,
    deleteLink,
  };
}

export { createLinkStore };
