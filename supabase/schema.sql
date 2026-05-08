-- ─── Run this in your Supabase SQL Editor ─────────────────────────────────────

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- ─── Memories table ───────────────────────────────────────────────────────────
create table if not exists public.memories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null check (char_length(name) between 1 and 100),
  message     text not null check (char_length(message) between 1 and 1000),
  image_url   text,
  created_at  timestamptz not null default now()
);

-- ─── Row Level Security ───────────────────────────────────────────────────────
alter table public.memories enable row level security;

-- Anyone can READ memories (public gallery)
create policy "Public read" on public.memories
  for select using (true);

-- Anyone can INSERT (anon key is enough to submit a memory)
create policy "Public insert" on public.memories
  for insert with check (true);

-- ⚠️  DELETE is handled server-side using the SERVICE ROLE key.
-- The service role bypasses RLS entirely, so no delete policy is needed here.
-- If you ever want to allow anon deletes directly (NOT recommended), add:
-- create policy "Public delete" on public.memories for delete using (true);

-- ─── Realtime ─────────────────────────────────────────────────────────────────
-- Enables live INSERT events in the gallery
alter publication supabase_realtime add table public.memories;

-- ─── Performance index ────────────────────────────────────────────────────────
create index if not exists memories_created_at_idx
  on public.memories (created_at desc);
