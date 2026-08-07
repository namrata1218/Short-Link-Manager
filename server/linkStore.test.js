import test from 'node:test';
import assert from 'node:assert/strict';
import os from 'node:os';
import path from 'node:path';
import { createLinkStore } from './linkStore.js';

test('creates links, records clicks, and stops at the cap', () => {
  const dbPath = path.join(os.tmpdir(), `short-link-store-${Date.now()}.db`);
  const store = createLinkStore(dbPath);

  const created = store.createLink({
    destinationUrl: 'https://example.com/blog',
    slug: 'launch',
    cap: 1,
  });

  assert.equal(created.slug, 'launch');

  const firstClick = store.recordClick('launch', 'https://newsletter.example');
  assert.equal(firstClick.status, 'redirect');
  assert.equal(firstClick.destinationUrl, 'https://example.com/blog');

  const secondClick = store.recordClick('launch', 'https://newsletter.example');
  assert.equal(secondClick.status, 'capped');

  const link = store.getLinkBySlug('launch');
  assert.equal(link.clickCount, 1);
});

test('rejects duplicate slugs', () => {
  const dbPath = path.join(os.tmpdir(), `short-link-store-${Date.now() + 1}.db`);
  const store = createLinkStore(dbPath);

  store.createLink({ destinationUrl: 'https://example.com/a', slug: 'duplicate' });

  assert.throws(() => {
    store.createLink({ destinationUrl: 'https://example.com/b', slug: 'duplicate' });
  }, /already exists/i);
});
