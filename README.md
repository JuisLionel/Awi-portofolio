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

Fill in the URL and anon key from your Supabase project's API settings. The Supabase `profile` table stores the availability flag, email, phone, country, and social links. Project titles, descriptions, images, and detail content are loaded from the `projects` table.

## Languages

The interface supports English and Indonesian. The selected language is saved in the browser. Supabase project rows can provide Indonesian versions in the `translations` JSONB column, using language code `id`; untranslated fields fall back to the existing project columns (English).

For an existing Supabase database, run `supabase/translations.sql` in the SQL Editor. It adds the `translations` column and fills translations for the current portfolio project slugs without changing their other fields. For a fresh database, `supabase/schema.sql` creates the column and includes translated sample projects.

The project detail page does not use a challenge field. For an existing database, run `supabase/remove-project-challenge.sql` in the Supabase SQL Editor to permanently drop `public.projects.challenge` and remove localized challenge entries from `translations`.

For new project rows, use this structure:

```json
{
  "id": {
    "title": "Judul proyek",
    "description": "Deskripsi proyek",
    "role": "Peran",
    "highlights": ["Sorotan proyek"],
    "status": "Selesai"
  }
}
```

## Project structure

- `src/app` contains the application shell and route configuration.
- `src/pages` contains route-level pages.
- `src/features/home` contains the homepage composition and its sections.
- `src/components` contains reusable UI and animation components.
- `src/data` contains profile and project data access.
- `src/config` contains shared site configuration.
- `src/lib` contains shared utilities and service clients.
- `src/styles` contains global styles.

## Included schema

The SQL in `supabase/schema.sql` creates:

- `public.profile`
- `public.projects`

This keeps the portfolio contact and project content editable from your Supabase dashboard without changing code.
