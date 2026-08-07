# Decisions

- Duplicate slugs are rejected with an error.
- The redirect checks the remaining clicks before redirecting; if a link reaches the cap, subsequent visits return 410.
- Once a link is capped, it stays visible in the list but is marked disabled.
- Clicks-per-day are reported in the browser's local timezone.

## Tradeoff to revisit

The current data store uses a JSON file for simplicity. With more time, I would switch to SQLite for safer concurrent writes and better querying.

## AI usage

I used AI assistance to scaffold the project structure and implement the backend/frontend integration quickly.
