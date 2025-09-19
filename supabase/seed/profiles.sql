insert into public.profiles (id, role)
values
  ('00000000-0000-4000-8000-000000000001', 'admin'),
  ('00000000-0000-4000-8000-000000000002', 'client')
  on conflict (id) do update set role = excluded.role;
