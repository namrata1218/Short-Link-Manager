# Short-Link-Manager
A full-stack  Short Link Manager that allows users to create, manage, track, and analyze shortened URLs with click analytics, custom slugs, click limits, search, pagination, and interactive dashboards.
# 🔗 Short Link Manager

A full-stack URL shortening application built using the MERN stack that enables users to create, manage, and analyze shortened links. The application supports custom slugs, click limits, server-side search and pagination, click analytics, and link management through an intuitive dashboard.

---

## ✨ Features

- Create shortened URLs
- Custom slug support
- Automatic unique slug generation
- Optional click limit (cap)
- Redirect using shortened URL
- Click tracking with timestamp and referrer
- 410 Gone response after click cap is reached
- Server-side search
- Server-side pagination
- Dashboard with link statistics
- Last 7 days click analytics
- Disable or delete links
- Responsive React UI

---

## 🛠 Tech Stack

### Frontend
- React
- TypeScript
- Tailwind CSS
- React Router
- Axios

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose

---

## 📂 Project Structure

```
client/
├── src/
│   ├── components
│   ├── pages
│   ├── services
│   └── App.tsx

server/
├── controllers
├── models
├── routes
├── middleware
└── server.js
```

---

## ⚙️ Installation

### Clone the repository

```bash
git clone https://github.com/namrata1218/short-link-manager.git
```

### Navigate to project

```bash
cd short-link-manager
```

### Install dependencies

Frontend

```bash
cd client
npm install
```

Backend

```bash
cd ../server
npm install
```

---

## Environment Variables

Create a `.env` file inside the server folder.

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

BASE_URL=http://localhost:5000
```

---

## Run Backend

```bash
npm run dev
```

---

## Run Frontend

```bash
npm run dev
```

---

## API Endpoints

### Create Link

```
POST /api/links
---

### Get All Links

```
GET /api/links
```

### Link Details

```
GET /api/links/:id
```

### Disable Link

```
PATCH /api/links/:id/disable
```

### Delete Link

```
DELETE /api/links/:id
```

---

## Analytics

The application records:

- Timestamp
- Referrer
- Total Clicks
- Clicks per Day (Last 7 Days)


**Namrata Shakya**

Software Developer | MERN Stack Developer
