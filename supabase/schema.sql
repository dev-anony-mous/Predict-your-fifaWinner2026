-- Run this in your Supabase SQL Editor before starting the app.

-- ── Predictions ─────────────────────────────────────────────────────────────
create table if not exists public.predictions (
  id            uuid        primary key default gen_random_uuid(),
  user_name     text        not null,
  approach      text,
  champion      text,
  finalist      text,
  bronze        text,
  group_winners jsonb       default '{}',
  group_top3    jsonb       default '{}',
  bracket       jsonb       default '{}',
  match_picks   jsonb       default '{}',
  ranks         jsonb       default '{}',
  thirds        jsonb       default '[]',
  submitted_at  timestamptz default now()
);

alter table public.predictions enable row level security;

create policy "predictions_insert" on public.predictions
  for insert with check (true);

create policy "predictions_select" on public.predictions
  for select using (true);

-- ── Official results ─────────────────────────────────────────────────────────
-- match_id examples: group stage "A-0" .. "L-5", bracket "R32-0" .. "F-0", "TP-0"
create table if not exists public.official_results (
  match_id    text        primary key,
  winner      text        not null,
  match_label text,
  updated_at  timestamptz default now()
);

alter table public.official_results enable row level security;

create policy "official_results_select" on public.official_results
  for select using (true);

-- Note: inserts/updates to official_results are done via the admin API route
-- which uses the anon key + server-side password check. Alternatively, add an
-- authenticated-user policy here if you prefer Supabase Auth for admin access.

-- Enable realtime for official_results so the app auto-updates when you post results:
-- Go to Supabase Dashboard → Database → Replication → enable official_results
-- Or run:
-- alter publication supabase_realtime add table public.official_results;
