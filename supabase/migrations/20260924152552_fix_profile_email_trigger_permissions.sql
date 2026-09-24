-- The previous trigger ran as the calling role (authenticated), which has
-- no SELECT grant on auth.users, so every profile insert failed with
-- "permission denied for table users". SECURITY DEFINER runs the function
-- as its owner (postgres) instead, which can read auth.users, without
-- granting that access to the authenticated role directly.
create or replace function public.set_profile_email()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.email is null then
    select email into new.email from auth.users where id = new.id;
  end if;
  return new;
end;
$$;
