-- Create the strava_connections table
create table if not exists public.strava_connections (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    athlete_id bigint not null,
    access_token text not null,
    refresh_token text not null,
    expires_at timestamp with time zone not null,
    scope text not null,
    created_at timestamp with time zone default now() not null,
    updated_at timestamp with time zone default now() not null,
    unique(user_id),
    unique(athlete_id)
);

-- Enable RLS
alter table public.strava_connections enable row level security;

-- Create policies
create policy "Users can view their own Strava connections"
    on public.strava_connections for select
    using (auth.uid() = user_id);

create policy "Users can insert their own Strava connections"
    on public.strava_connections for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own Strava connections"
    on public.strava_connections for update
    using (auth.uid() = user_id);

create policy "Users can delete their own Strava connections"
    on public.strava_connections for delete
    using (auth.uid() = user_id);

-- Create updated_at trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger handle_strava_connections_updated_at
    before update on public.strava_connections
    for each row
    execute procedure public.handle_updated_at(); 