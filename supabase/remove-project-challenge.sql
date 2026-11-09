alter table public.projects
  add column if not exists translations jsonb not null default '{}'::jsonb,
  drop column if exists challenge;

update public.projects as project
set translations = (
  select coalesce(
    jsonb_object_agg(language, localized - 'challenge'),
    '{}'::jsonb
  )
  from jsonb_each(coalesce(project.translations, '{}'::jsonb))
    as translation(language, localized)
)
where exists (
  select 1
  from jsonb_each(coalesce(project.translations, '{}'::jsonb))
    as translation(language, localized)
  where localized ? 'challenge'
);
