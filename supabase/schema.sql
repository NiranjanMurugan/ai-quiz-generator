-- Run in Supabase: SQL Editor → New query → Run
-- Stores generated flashcard sets and quizzes

create table if not exists study_sets (
  id          text primary key,
  topic       text not null default 'Untitled',
  flashcards  jsonb not null default '[]'::jsonb,
  quiz        jsonb,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists study_sets_created_at_idx on study_sets (created_at desc);

-- Optional: auto-update updated_at
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists study_sets_updated_at on study_sets;
create trigger study_sets_updated_at
  before update on study_sets
  for each row execute function set_updated_at();
