-- Create the strava_activities table
create table if not exists public.strava_activities (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    strava_id bigint not null,
    name text not null,
    distance float not null,
    moving_time integer not null,
    elapsed_time integer not null,
    total_elevation_gain float not null,
    activity_type text not null,
    sport_type text not null,
    start_date timestamp with time zone not null,
    start_date_local timestamp with time zone not null,
    average_speed float not null,
    max_speed float not null,
    average_heartrate float,
    max_heartrate float,
    created_at timestamp with time zone default now() not null,
    updated_at timestamp with time zone default now() not null,
    unique(user_id, strava_id)
);

-- Enable RLS
alter table public.strava_activities enable row level security;

-- Create policies
create policy "Users can view their own Strava activities"
    on public.strava_activities for select
    using (auth.uid() = user_id);

create policy "Users can insert their own Strava activities"
    on public.strava_activities for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own Strava activities"
    on public.strava_activities for update
    using (auth.uid() = user_id);

create policy "Users can delete their own Strava activities"
    on public.strava_activities for delete
    using (auth.uid() = user_id);

-- Create updated_at trigger
create trigger handle_strava_activities_updated_at
    before update on public.strava_activities
    for each row
    execute procedure public.handle_updated_at(); 