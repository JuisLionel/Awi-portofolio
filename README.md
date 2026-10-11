# Awi Portfolio

A portfolio website powered by React + Vite, now configured to read portfolio content from Supabase.

## Setup

1. Copy `.env.example` to `.env` and add your Supabase values.
2. Create the tables in Supabase using `supabase/schema.sql`.
3. Run the app:

```bash
npm install
npm run dev
```

## Supabase configuration

Create a new project in Supabase and paste these values into your `.env` file:

```bash
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Fill in the URL and anon key from your Supabase project's API settings. The Supabase `profile` table stores the availability flag, email, phone, country, and social links. The badge labels remain defined locally in `Data/profile.js`. Project titles, descriptions, images, and detail content are loaded from the `projects` table. The schema seeds the Login and Registration, To-Do List, and Typing Test projects from the provided repositories.

## Included schema

The SQL in `supabase/schema.sql` creates:

- `public.profile`
- `public.projects`

This keeps the portfolio contact and project content editable from your Supabase dashboard without changing code.
