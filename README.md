# Local Meetup RSVP Tracker

A full-stack local meetup application built with Next.js, Express, and
MySQL.

Authenticated users can browse meetups, create events, edit or delete
their own events, RSVP as Going/Maybe/Declined, and view meetup
attendees.

## Tech Stack

-   **Frontend:** Next.js, React
-   **Backend:** Node.js, Express
-   **Database:** MySQL 8.4
-   **Authentication:** JWT + bcrypt
-   **Containerization:** Docker, Docker Compose

## Run the Application

From the repository root:

``` bash
docker compose up --build
```

This starts the complete application, including the MySQL database, seed
service, backend API, and frontend.

No manual database setup or registration is required.

### Application URLs

  Service        URL
  -------------- ----------------------------------
  Frontend       http://localhost:3000
  API            http://localhost:5000
  Health Check   http://localhost:5000/api/health

### Reset the Database

To remove the local MySQL volume and recreate the database with seeded
users:

``` bash
docker compose down -v
docker compose up --build
```

## Demo Accounts

All seeded users use:

`password123`

-   `raju@example.com`
-   `ahmed@example.com`
-   `sara@example.com`

## Architecture

-   `frontend/` --- Next.js App Router application.
-   `backend/` --- Express REST API organized into routes, controllers,
    middleware, and database configuration.
-   `backend/database/schema.sql` --- normalized relational schema for
    users, meetups, and RSVPs.

Users and meetups have a many-to-many relationship through the `rsvps`
table. A composite unique constraint on `(user_id, meetup_id)` prevents
duplicate RSVPs.

Foreign keys enforce referential integrity and prevent orphaned records.

JWT middleware authenticates protected requests. Meetup ownership is
enforced server-side using the authenticated user's ID rather than
relying on frontend checks.

## API Routes

### Authentication

``` text
POST /api/auth/login
```

### Meetups

``` text
GET    /api/meetups
POST   /api/meetups
GET    /api/meetups/:id
PUT    /api/meetups/:id
DELETE /api/meetups/:id
```

### RSVPs

``` text
POST /api/rsvps/:meetupId
PUT  /api/rsvps/:meetupId
GET  /api/rsvps/:meetupId/attendees
```

`POST` creates an RSVP. `PUT` updates the authenticated user's existing
RSVP.

## Security

-   Passwords are hashed with bcrypt.
-   JWTs are verified server-side for protected routes.
-   Meetup ownership is enforced by the backend.
-   SQL queries use parameterized values.
-   Foreign keys and database constraints enforce data integrity.
