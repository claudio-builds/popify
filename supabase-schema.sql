-- Popify Database Schema

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Sites table
create table if not exists sites (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  domain text not null,
  api_key text unique not null,
  settings jsonb default '{"position": "bottom-left", "theme": "light", "showAvatar": true, "duration": 5000, "delay": 3000}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Notifications table
create table if not exists notifications (
  id uuid default uuid_generate_v4() primary key,
  site_id uuid references sites(id) on delete cascade not null,
  type text check (type in ('purchase', 'signup', 'review', 'custom')) default 'custom',
  name text not null,
  location text,
  action text not null,
  item text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Analytics table
create table if not exists analytics (
  id uuid default uuid_generate_v4() primary key,
  site_id uuid references sites(id) on delete cascade not null,
  impressions integer default 0,
  clicks integer default 0,
  date date default current_date not null,
  unique(site_id, date)
);

-- Row Level Security
alter table sites enable row level security;
alter table notifications enable row level security;
alter table analytics enable row level security;

-- Sites policies
create policy "Users can view their own sites"
  on sites for select
  using (auth.uid() = user_id);

create policy "Users can create their own sites"
  on sites for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own sites"
  on sites for update
  using (auth.uid() = user_id);

create policy "Users can delete their own sites"
  on sites for delete
  using (auth.uid() = user_id);

-- Notifications policies
create policy "Users can view notifications for their sites"
  on notifications for select
  using (
    site_id in (
      select id from sites where user_id = auth.uid()
    )
  );

create policy "Users can create notifications for their sites"
  on notifications for insert
  with check (
    site_id in (
      select id from sites where user_id = auth.uid()
    )
  );

create policy "Users can delete notifications for their sites"
  on notifications for delete
  using (
    site_id in (
      select id from sites where user_id = auth.uid()
    )
  );

-- Analytics policies
create policy "Users can view analytics for their sites"
  on analytics for select
  using (
    site_id in (
      select id from sites where user_id = auth.uid()
    )
  );

-- Service role can do anything (for API endpoints)
create policy "Service role can select all sites"
  on sites for select
  using (true);

create policy "Service role can select all notifications"
  on notifications for select
  using (true);

create policy "Service role can insert analytics"
  on analytics for insert
  with check (true);

create policy "Service role can update analytics"
  on analytics for update
  using (true);

-- Indexes for performance
create index if not exists idx_sites_user_id on sites(user_id);
create index if not exists idx_sites_api_key on sites(api_key);
create index if not exists idx_notifications_site_id on notifications(site_id);
create index if not exists idx_analytics_site_id_date on analytics(site_id, date);
