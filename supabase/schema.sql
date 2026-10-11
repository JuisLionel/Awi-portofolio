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
  challenge text,
  highlights jsonb not null default '[]'::jsonb,
  stack text[] not null default '{}',
  image text,
  images text[] not null default '{}',
  live_url text,
  repo_url text,
  status text not null default 'Live',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.projects
  add column if not exists images text[] not null default '{}',
  add column if not exists live_url text,
  add column if not exists repo_url text;

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
  challenge,
  highlights,
  stack,
  image,
  live_url,
  repo_url,
  status,
  sort_order
)
values
  (
    'login-and-registration',
    'Login and Registration',
    'A React login and registration page created to explore browser local storage and basic account form flows.',
    'Personal project',
    'The project explores saving and reading registration data with browser local storage. It is a learning demo, not production-grade authentication.',
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
    1
  ),
  (
    'todo-list',
    'To-Do List',
    'A PERN-stack task manager for creating, editing, completing, and deleting tasks with PostgreSQL persistence.',
    'Personal project',
    'The app connects a React interface to an Express and Node.js backend backed by PostgreSQL for persistent task data.',
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
    2
  ),
  (
    'typing-test',
    'Typing Test',
    'A customizable typing practice app with live typing feedback, speed and accuracy statistics, themes, and adjustable word counts.',
    'Personal project',
    'The app tracks typing performance in real time while keeping practice sessions customizable and lightweight.',
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
    3
  )
on conflict (slug) do update set
  title = excluded.title,
  description = excluded.description,
  role = excluded.role,
  challenge = excluded.challenge,
  highlights = excluded.highlights,
  stack = excluded.stack,
  image = excluded.image,
  live_url = excluded.live_url,
  repo_url = excluded.repo_url,
  status = excluded.status,
  sort_order = excluded.sort_order;
