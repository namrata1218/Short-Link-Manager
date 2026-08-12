# Decisions

1.Duplicate custom slugs are not allowed and return an error.
2.Before redirecting, the app checks if the click limit has been reached. If it has, the link returns a 410 (Gone) response. Click recording and persistence are synchronous in the single Node.js process, so when two users request the final remaining click, one request records and redirects; the other sees the cap and receives 410.
3.Links that reach their click limit remain visible in the dashboard but are marked as Disabled.
4.Daily click analytics are calculated in UTC, so all users see the same seven-day buckets.

## Tradeoff to revisit

The project currently uses a JSON file to store data because it is simple and easy to set up. If I were building this for production, I would replace it with SQLite (or another database) to handle concurrent writes safely and improve query performance.

## AI usage

I used AI to speed up the initial project setup and to help connect the React frontend with the Express backend. All features were reviewed, integrated, and tested before finalizing the project.

## Implementation summary

The application is built as a React single-page application (SPA) with an Express.js backend. Users can create and manage short links, enable or disable them, track click analytics, search through links, and view detailed statistics for each short URL. The implementation focuses on being simple, lightweight, and easy to run locally without requiring external services.

## Project decision rationale

Using a JSON file for storage made development faster and kept the project easy to understand. However, this approach is not suitable for larger applications because it does not handle multiple users or frequent writes efficiently. For a production-ready version, I would use a database like SQLite to improve reliability, scalability, and data management.
