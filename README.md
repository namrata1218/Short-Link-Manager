# Short Link Manager

A full-stack short link manager for creating, tracking, searching, enabling, disabling, deleting, and analyzing short URLs.

## GitHub Repository

https://github.com/namrata1218/Short-Link-Manager_

## Clone and run

```bash
git clone https://github.com/namrata1218/Short-Link-Manager_.git
cd Short-Link-Manager_
npm install
node server/index.js
npm run dev
```

Open the app at http://localhost:5173.

## What this app does

- Create a short link from a destination URL with an optional custom slug and click cap.
- Redirect users through the short slug route and record each click.
- Enforce click-cap behavior so links stop working once the configured cap is reached.
- Enable or disable a link and delete it from the list.
- Search links by slug or destination URL.
- Paginate through links from the API.
- View detail statistics such as slug, destination URL, status, click count, cap, and recent activity.


## Tech stack

- React + Vite frontend
- Express API server
- JSON file data persistence
- Node.js runtime

## How to run locally

1. Install dependencies:

```bash
npm install
```

2. Start the API server:

```bash
node server/index.js
```

3. Start the Vite frontend:

```bash
npm run dev
```

4. Open the Vite app in the browser at:

http://localhost:5173

## API

The API runs on the backend at:

http://localhost:3001/api

Key routes include:

- GET /api/links
- POST /api/links
- GET /api/links/:slug
- PATCH /api/links/:slug
- DELETE /api/links/:slug
- GET /r/:slug

## Testing

The store test suite can be run with:

```bash
node --test server/linkStore.test.js
```
