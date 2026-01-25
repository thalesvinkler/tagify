create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  status text not null default 'pending',
  mp_payment_id text,
  email text,
  payload jsonb not null,
  created_at timestamptz default now()
);

create table if not exists downloads (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  file_path text not null,
  expires_at timestamptz not null,
  download_count integer not null default 0,
  created_at timestamptz default now()
);

create or replace function increment_download_count(order_id_input uuid)
returns void as $$
begin
  update downloads
  set download_count = download_count + 1
  where order_id = order_id_input;
end;
$$ language plpgsql;
