# Short Link Manager

A full-stack short link manager for creating, tracking, searching, enabling, disabling, deleting, and analyzing short URLs.

## GitHub Repository

https://github.com/namrata1218/Short-Link-Manager_

## Run locally

### Requirements

- Node.js 18 or newer
- npm

### Installation

```bash
git clone https://github.com/namrata1218/Short-Link-Manager_.git
cd Short-Link-Manager_
npm install
npm run dev
```

`npm run dev` starts both services:

- Website: http://localhost:5173
- API and short-link redirects: http://localhost:3001

Open http://localhost:5173 in your browser. Stop both services with `Ctrl + C` in the terminal.

## What this app does

- Create a short link from a destination URL with an optional custom slug and click cap.
- Redirect users through the short slug route and record each click.
- Enforce click-cap behavior so links stop working once the configured cap is reached.
- Enable or disable a link and delete it from the list.
- Search links by slug or destination URL.
- Paginate through links from the API.
- View detail statistics such as slug, destination URL, status, click count, cap, recent activity, and UTC clicks-per-day for the last seven days.


## Tech stack

- React + Vite frontend
- Express API server
- JSON file data persistence
- Node.js runtime

## How to use the website

1. In **Destination URL**, paste a valid `http` or `https` link.
2. Optionally enter a **Custom slug**. Leave it blank to generate a unique short slug automatically.
3. Optionally set a **Click cap**. Once the cap is reached, later visits receive `410 Gone`.
4. Select **Create link**. Copy or open the short URL shown below the form.
5. Select a link in the list to view its destination, status, total clicks, the last seven days of daily clicks, and recent referrers.
6. Use the search field to search by slug or destination URL. Use **Prev** and **Next** to move through result pages.
7. In the detail panel, select **Disable** to stop redirects, **Enable** to restore an uncapped link, or **Delete** to remove it permanently.

## Run services separately

If needed, run the frontend and backend in different terminals:

```bash
npm run server
```

```bash
npm run client
```


The frontend requires the backend to be running on port `3001`.

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
