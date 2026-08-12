# Local Meetup RSVP Tracker

A full-stack RSVP tracker built with Next.js, Express, and MySQL. Logged-in users can browse meetups, create their own events, edit or delete only their own events, and RSVP as Going, Maybe, or Declined.

## Run the complete application

From the repository root:

```bash
docker compose up --build
```

This starts the frontend, backend, MySQL database, and a one-off seed service. The seed service initializes the demo accounts automatically using the Node.js seed script; it hashes each password with bcrypt before storing it.

| Service | URL |
| --- | --- |
| Frontend | http://localhost:3000 |
| API | http://localhost:5000 |
| Health check | http://localhost:5000/api/health |

To reset the local database and seed it again:

```bash
docker compose down -v
docker compose up --build
```

## Demo accounts

All seeded users use the password `password123`:

- `raju@example.com`
- `ahmed@example.com`
- `sara@example.com`

## Architecture

- `frontend/` contains the Next.js App Router UI. The browser API URL is configured with `NEXT_PUBLIC_API_URL` and is set to the backend service's published URL by Docker Compose.
- `backend/` is an Express REST API, organized into routes, controllers, database configuration, and JWT middleware.
- `backend/database/schema.sql` defines normalized `users`, `meetups`, and `rsvps` tables. The unique `(user_id, meetup_id)` constraint prevents duplicate RSVPs, and foreign keys prevent orphaned records.

JWT middleware verifies Bearer tokens for all state-changing routes. The backend, rather than the UI, enforces meetup ownership by updating and deleting only where `owner_id` matches the authenticated user's ID.

## API routes

- `POST /api/auth/login`
- `GET`, `POST /api/meetups`
- `GET`, `PUT`, `DELETE /api/meetups/:id`
- `POST /api/rsvps/:meetupId`
- `GET /api/rsvps/:meetupId/attendees`
