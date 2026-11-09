create extension if not exists pgcrypto;

create table if not exists public.profile (
  id uuid primary key default gen_random_uuid(),
  available boolean not null default true,
  email text,
  phone text,
  country text,
  socials jsonb not null default '[]'::jsonb
);

alter table public.profile
  add column if not exists email text,
  add column if not exists phone text,
  add column if not exists country text,
  add column if not exists socials jsonb not null default '[]'::jsonb;

alter table public.profile enable row level security;

drop policy if exists "Public can read profile availability" on public.profile;
create policy "Public can read profile availability"
  on public.profile
  for select
  to anon, authenticated
  using (true);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  role text,
  highlights jsonb not null default '[]'::jsonb,
  stack text[] not null default '{}',
  image text,
  images text[] not null default '{}',
  live_url text,
  repo_url text,
  status text not null default 'Live',
  translations jsonb not null default '{}'::jsonb,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.projects
  add column if not exists images text[] not null default '{}',
  add column if not exists live_url text,
  add column if not exists repo_url text,
  add column if not exists translations jsonb not null default '{}'::jsonb;

comment on column public.projects.translations is
  'Localized project fields keyed by language code, for example {"id":{"title":"..."}}.';

alter table public.projects enable row level security;

drop policy if exists "Public can read projects" on public.projects;
create policy "Public can read projects"
  on public.projects
  for select
  to anon, authenticated
  using (true);

do $$
begin
  if exists (select 1 from public.profile limit 1) then
    update public.profile
    set email = 'padcotrial@gmail.com',
        phone = null,
        country = 'Indonesia',
        socials = '[
          {"label":"Instagram","href":"https://instagram.com/JuisLionel"},
          {"label":"GitHub","href":"https://github.com/JuisLionel"},
          {"label":"Facebook","href":"https://www.facebook.com/profile.php?id=61587739286725"}
        ]'::jsonb;
  else
    insert into public.profile (available, email, country, socials)
    values (
      true,
      'padcotrial@gmail.com',
      'Indonesia',
      '[
        {"label":"Instagram","href":"https://instagram.com/JuisLionel"},
        {"label":"GitHub","href":"https://github.com/JuisLionel"},
        {"label":"Facebook","href":"https://www.facebook.com/profile.php?id=61587739286725"}
      ]'::jsonb
    );
  end if;
end
$$;

insert into public.projects (
  slug,
  title,
  description,
  role,
  highlights,
  stack,
  image,
  live_url,
  repo_url,
  status,
  translations,
  sort_order
)
values
  (
    'login-and-registration',
    'Login and Registration',
    'A React login and registration page created to explore browser local storage and basic account form flows.',
    'Personal project',
    '[
      "Created login and registration page interfaces",
      "Practiced persisting and reading data with local storage",
      "Added separate login and registration preview screens"
    ]'::jsonb,
    array['React', 'JavaScript', 'Local Storage'],
    'https://raw.githubusercontent.com/JuisLionel/Login-and-Registration/257e9be65e94646c5012aa760ab6aa734d863cde/public/img/Preview%20Login.png',
    null,
    'https://github.com/JuisLionel/Login-and-Registration',
    'Completed',
    '{
      "id": {
        "title": "Login dan Pendaftaran",
        "description": "Halaman login dan pendaftaran React untuk mempelajari local storage browser dan alur formulir akun dasar.",
        "role": "Proyek pribadi",
        "highlights": [
          "Membuat antarmuka halaman login dan pendaftaran",
          "Berlatih menyimpan dan membaca data dengan local storage",
          "Menambahkan layar pratinjau login dan pendaftaran terpisah"
        ],
        "status": "Selesai"
      }
    }'::jsonb,
    1
  ),
  (
    'todo-list',
    'To-Do List',
    'A PERN-stack task manager for creating, editing, completing, and deleting tasks with PostgreSQL persistence.',
    'Personal project',
    '[
      "Add and edit tasks",
      "Mark tasks complete or incomplete",
      "Delete tasks",
      "Persist task data in PostgreSQL"
    ]'::jsonb,
    array['React', 'Tailwind CSS', 'Node.js', 'Express', 'PostgreSQL'],
    'https://raw.githubusercontent.com/JuisLionel/Todo_list/a7d0354a8d30cdb318a83ed66d937a32cdc406bd/Picture/preview2.png',
    null,
    'https://github.com/JuisLionel/Todo_list',
    'Completed',
    '{
      "id": {
        "title": "Daftar Tugas",
        "description": "Pengelola tugas berbasis PERN untuk membuat, mengedit, menyelesaikan, dan menghapus tugas dengan penyimpanan PostgreSQL.",
        "role": "Proyek pribadi",
        "highlights": [
          "Menambahkan dan mengedit tugas",
          "Menandai tugas selesai atau belum selesai",
          "Menghapus tugas",
          "Menyimpan data tugas di PostgreSQL"
        ],
        "status": "Selesai"
      }
    }'::jsonb,
    2
  ),
  (
    'typing-test',
    'Typing Test',
    'A customizable typing practice app with live typing feedback, speed and accuracy statistics, themes, and adjustable word counts.',
    'Personal project',
    '[
      "Practice typing with word-by-word rendering",
      "Track words per minute, characters per minute, and accuracy",
      "Switch themes and choose the session word count"
    ]'::jsonb,
    array['React 19', 'Vite', 'Tailwind CSS', 'React Icons'],
    'https://raw.githubusercontent.com/JuisLionel/TypingTest/5e57afc6bac551afe51093078032373b551b1f15/public/Blue.png',
    'https://typing-test-eight-zeta.vercel.app/',
    'https://github.com/JuisLionel/TypingTest',
    'Completed',
    '{
      "id": {
        "title": "Tes Mengetik",
        "description": "Aplikasi latihan mengetik yang dapat disesuaikan dengan umpan balik langsung, statistik kecepatan dan akurasi, tema, serta jumlah kata.",
        "role": "Proyek pribadi",
        "highlights": [
          "Berlatih mengetik dengan tampilan kata demi kata",
          "Melacak kata per menit, karakter per menit, dan akurasi",
          "Mengganti tema dan memilih jumlah kata dalam sesi"
        ],
        "status": "Selesai"
      }
    }'::jsonb,
    3
  )
on conflict (slug) do update set
  title = excluded.title,
  description = excluded.description,
  role = excluded.role,
  highlights = excluded.highlights,
  stack = excluded.stack,
  image = excluded.image,
  live_url = excluded.live_url,
  repo_url = excluded.repo_url,
  status = excluded.status,
  translations = excluded.translations,
  sort_order = excluded.sort_order;
