-- Create notes table for storing rich-text Tiptap JSON documents per authenticated user.
create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null default 'Untitled Note',
  document jsonb not null default '{"type":"doc","content":[{"type":"paragraph"}]}'::jsonb,
  mode text not null default 'general',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.notes enable row level security;

-- Row Level Security Policies
create policy "Users can view their own notes"
  on public.notes for select
  using (auth.uid() = user_id);

create policy "Users can insert their own notes"
  on public.notes for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own notes"
  on public.notes for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own notes"
  on public.notes for delete
  using (auth.uid() = user_id);

-- Performance Index for sorting notes by most recently updated
create index if not exists notes_user_id_updated_at_idx 
  on public.notes (user_id, updated_at desc);

-- Trigger for automatically updating updated_at timestamp
create trigger notes_set_updated_at
  before update on public.notes
  for each row
  execute function public.set_updated_at();
