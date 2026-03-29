# Issue Tracker (Next.js + Prisma + NextAuth)

A small issue-tracking app built with Next.js App Router, Prisma (MariaDB/MySQL), and NextAuth credentials login. It includes an issues table, issue detail/edit/delete, and a public dashboard chart showing how many issues belong to each user email.

## Screenshots
Screenshots (stored in `public/`):

![Screenshot 1](public/Screenshot%20From%202026-03-30%2000-04-37.png)
![Screenshot 2](public/Screenshot%20From%202026-03-30%2000-04-53.png)

## Features

- Public dashboard (`/`) with “Issues by user” chart (Recharts).
- Auth-required pages: issues list, issue details, create issue.
- Credentials login (`/login`) using email + password stored in DB.
- Issue CRUD via API routes (mutations are protected by session).
- Navbar shows user email + logout dropdown when signed in.

## Routes

- `/` Dashboard (public)
- `/login` Login (public)
- `/issues` Issues list (requires login)
- `/issue/[id]` Issue detail + edit/delete (requires login)
- `/newIssue` Create new issue (requires login)

## Tech Stack

- Next.js (App Router)
- Prisma Client + MariaDB adapter
- NextAuth (Credentials provider)
- Recharts (charts)
- Radix UI Themes + Tailwind CSS (styling)

## Project Structure (high level)

- `app/` Next.js App Router (pages, components, API routes)
- `app/api/` API routes (mutations + reads require auth)
- `app/lib/issueData.ts` cached Prisma queries (React `cache()`)
- `prisma/` Prisma schema + migrations
- `public/` static assets (`lion.png` is used for logo + favicon)

## Setup

1) Install dependencies:

```bash
npm i
```

2) Create `.env` from the example:

```bash
cp .env.example .env
```

3) Fill in `.env`:

- `DATABASE_URL` – your MySQL/MariaDB connection string
- `AUTH_SECRET` – secret for NextAuth
- `NEXTAUTH_URL` – app URL (dev: `http://localhost:3000`, prod: your deployed URL)

## Database (Prisma)

- Schema: `prisma/schema.prisma`
- Migrations: `prisma/migrations/`

Common commands:

```bash
npx prisma migrate dev
npx prisma studio
```

## Development

```bash
npm run dev
```

Open `http://localhost:3000`.

## Production build

```bash
npm run build
npm run start
```

## Lint

```bash
npm run lint
```

## Auth rules (important)

- The dashboard chart (`/`) is public.
- `/issues`, `/issue/[id]`, `/newIssue` redirect to `/login` when not authenticated.
- API routes require auth:
  - `GET /api`, `GET /api/[id]`
  - `POST /api`
  - `PATCH /api/[id]`, `DELETE /api/[id]`

## Caching (Prisma request reduction)

To reduce repeated DB calls during a single server render, common queries are wrapped with React `cache()`:

- `getRecentIssues()`, `getIssueById()`, `getIssuesByUserEmailChart()` in `app/lib/issueData.ts`
- `auth()` is cached in `auth.ts`

## Deploy notes

- Set `NEXTAUTH_URL` to your real production URL to avoid NextAuth warnings.
- Make sure your deploy environment can reach your database host (and `DATABASE_URL` is correct).
- Run `npm run build` in CI/CD to catch type/build issues.

## Troubleshooting

- **NextAuth warning about `NEXTAUTH_URL`**: set `NEXTAUTH_URL` in `.env`.
- **Database connection errors**: verify `DATABASE_URL`, DB is running, and networking/firewall rules allow access.
