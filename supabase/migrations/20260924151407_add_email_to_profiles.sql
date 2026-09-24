-- Store email on profiles so it's visible alongside other profile fields
-- without joining auth.users (which isn't reachable from the client anyway).
alter table public.profiles
  add column if not exists email text;

update public.profiles p
set email = u.email
from auth.users u
where p.id = u.id
  and p.email is null;

alter table public.profiles
  alter column email set not null;

-- Keep email populated automatically on insert, sourced from auth.users,
-- so callers never need to pass it explicitly (and it can't drift from the
-- authoritative value Supabase Auth holds at creation time).
create or replace function public.set_profile_email()
returns trigger
language plpgsql
as $$
begin
  if new.email is null then
    select email into new.email from auth.users where id = new.id;
  end if;
  return new;
end;
$$;

create trigger profiles_set_email
  before insert on public.profiles
  for each row
  execute function public.set_profile_email();
