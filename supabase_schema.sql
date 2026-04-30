-- ═══════════════════════════════════════════════════════
-- LINKE — Supabase Database Schema
-- Run this in your Supabase SQL Editor
-- ═══════════════════════════════════════════════════════

-- 1. Create Tables

-- Folders
create table public.folders (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    name text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Links
create table public.links (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    folder_id uuid references public.folders(id) on delete set null,
    url text not null,
    title text,
    description text,
    favicon text,
    preview text,
    tags text[] default '{}'::text[],
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable Row Level Security (RLS)
alter table public.folders enable row level security;
alter table public.links enable row level security;

-- 3. Create RLS Policies

-- Folders Policies
create policy "Users can view their own folders" 
    on public.folders for select 
    using (auth.uid() = user_id);

create policy "Users can insert their own folders" 
    on public.folders for insert 
    with check (auth.uid() = user_id);

create policy "Users can update their own folders" 
    on public.folders for update 
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

create policy "Users can delete their own folders" 
    on public.folders for delete 
    using (auth.uid() = user_id);

-- Links Policies
create policy "Users can view their own links" 
    on public.links for select 
    using (auth.uid() = user_id);

create policy "Users can insert their own links" 
    on public.links for insert 
    with check (auth.uid() = user_id);

create policy "Users can update their own links" 
    on public.links for update 
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

create policy "Users can delete their own links" 
    on public.links for delete 
    using (auth.uid() = user_id);

-- 4. Create Indexes for performance
create index idx_links_user_id on public.links(user_id);
create index idx_folders_user_id on public.folders(user_id);
create index idx_links_folder_id on public.links(folder_id);

-- 5. Triggers for updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

create trigger handle_folders_updated_at
    before update on public.folders
    for each row execute function public.handle_updated_at();

create trigger handle_links_updated_at
    before update on public.links
    for each row execute function public.handle_updated_at();
