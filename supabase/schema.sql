-- Tally veritabani semasi.
-- Supabase Dashboard > SQL Editor icine yapistirip "Run" ile calistir.

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  price numeric not null check (price > 0),
  cycle text not null check (cycle in ('monthly', 'yearly', 'installment')),
  payment_method text,
  installment_months integer,
  created_at timestamptz not null default now()
);

create table if not exists public.focus_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  minutes integer not null check (minutes > 0),
  completed_at timestamptz not null default now()
);

create index if not exists subscriptions_user_id_idx on public.subscriptions (user_id);
create index if not exists focus_sessions_user_id_idx on public.focus_sessions (user_id);

alter table public.subscriptions enable row level security;
alter table public.focus_sessions enable row level security;

drop policy if exists "Users manage their own subscriptions" on public.subscriptions;
create policy "Users manage their own subscriptions"
  on public.subscriptions
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users manage their own focus sessions" on public.focus_sessions;
create policy "Users manage their own focus sessions"
  on public.focus_sessions
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
