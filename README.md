# Short Link Manager

A small local-first short link manager built with React, Express, and a JSON file store.

## Run it

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the API server:
   ```bash
   node server/index.js
   ```
3. In a second terminal, start the frontend:
   ```bash
   npm run dev
   ```
4. Open http://localhost:5173

## Notes

- The API runs on http://localhost:3001
- Redirects are served from /r/:slug
- Links can be disabled, deleted, and capped
