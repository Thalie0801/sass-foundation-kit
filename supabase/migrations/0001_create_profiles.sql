create extension if not exists "uuid-ossp";

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null check (role in ('admin', 'client')) default 'client',
  created_at timestamp with time zone default timezone('utc', now())
);

alter table public.profiles enable row level security;

create policy if not exists "profiles_read_own" on public.profiles
  for select using (auth.uid() = id);

create policy if not exists "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

create policy if not exists "profiles_admin_full_access" on public.profiles
  for all using (exists (
    select 1 from public.profiles as p
    where p.id = auth.uid() and p.role = 'admin'
  ));
