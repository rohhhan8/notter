# Notter

A note-taking app built around a simple idea: capture and organize notes without the noise. No AI-generated clutter, no bloated feature surface — just a fast, minimal place to write things down and find them again.

This repo currently covers the onboarding flow: welcome, sign up, sign in, profile setup, and the authenticated home shell.

## Stack

- **apps/web** — Next.js (App Router), Tailwind CSS, shadcn/ui, Motion
- **apps/api** — Next.js (Route Handlers only), Supabase Auth + Postgres
- **packages/** — shared types, Supabase client helpers, and a typed API client used by `apps/web` to call `apps/api`

## Setup

```bash
npm install
```

Copy the env templates and fill in your own Supabase project values:

```bash
cp apps/api/.env.local.example apps/api/.env.local
cp apps/web/.env.local.example apps/web/.env.local
```

Run the `profiles` table migration in `supabase/migrations/` against your Supabase project (via the SQL editor or the Supabase CLI).

Run both apps:

```bash
npm run dev:api   # http://localhost:3001
npm run dev:web   # http://localhost:3000
```
