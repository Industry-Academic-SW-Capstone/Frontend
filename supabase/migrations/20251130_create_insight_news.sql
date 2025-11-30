create table if not exists insight_news (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  link text not null,
  press text,
  time text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  fact_sheet_id uuid references market_fact_sheets(id) on delete cascade
);

-- Enable RLS
alter table insight_news enable row level security;

-- Policy: Public Read
create policy "Public Read News" on insight_news for select using (true);
