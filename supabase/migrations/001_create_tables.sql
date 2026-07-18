-- Enable required extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm";

-- Products table
create table if not exists products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  price numeric not null,
  serial text not null,
  image_url text not null,
  car_model text,
  year integer,
  stock integer not null default 0,
  created_at timestamptz default now()
);

-- Sales log table
create table if not exists sales_log (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid references products(id) on delete cascade,
  quantity integer default 1,
  sold_at timestamptz default now(),
  snapshot_name text,
  snapshot_price numeric,
  snapshot_serial text
);

-- GIN trigram index for blazing-fast text search
create index if not exists idx_products_search on products
  using gin (
    (name || ' ' || serial || ' ' || coalesce(car_model, '') || ' ' || coalesce(year::text, ''))
    gin_trgm_ops
  );

-- Standard indexes for common queries
create index if not exists idx_products_created_at on products (created_at desc);
create index if not exists idx_sales_log_product_id on sales_log (product_id);
create index if not exists idx_sales_log_sold_at on sales_log (sold_at desc);
