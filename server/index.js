import express from 'express';
import cors from 'cors';
import { createLinkStore } from './linkStore.js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;
const store = createLinkStore(path.join(__dirname, 'data.json'));

app.use(cors());
app.use(express.json());

app.get('/api/links', (req, res) => {
  const { search = '', page = 1, limit = 10 } = req.query;
  const result = store.listLinks({
    search,
    page: Number(page),
    limit: Number(limit),
  });
  res.json(result);
});

app.post('/api/links', (req, res) => {
  try {
    const { destinationUrl, slug, cap } = req.body;
    const created = store.createLink({ destinationUrl, slug, cap });
    res.status(201).json(created);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/links/:slug', (req, res) => {
  const link = store.getLinkBySlug(req.params.slug);
  if (!link) {
    return res.status(404).json({ error: 'Link not found' });
  }
  const clicks = store.getClicks(req.params.slug);
  return res.json({ ...link, clicks });
});

app.patch('/api/links/:slug', (req, res) => {
  try {
    const updated = store.updateLink(req.params.slug, req.body);
    res.json(updated);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

app.delete('/api/links/:slug', (req, res) => {
  try {
    store.deleteLink(req.params.slug);
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

app.get('/r/:slug', (req, res) => {
  const result = store.recordClick(req.params.slug, req.get('referrer') || '');
  if (result.status === 'redirect') {
    return res.redirect(302, result.destinationUrl);
  }
  return res.status(410).send('Link is no longer available.');
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
