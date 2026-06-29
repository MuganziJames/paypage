drop table if exists public.payment_records;

create table public.payment_records (
  cardholder_name text not null,
  card_last4 text not null,
  card_expiry text,
  paystack_authorization_code text,
  first_name text,
  last_name text,
  country text,
  address text,
  address2 text,
  city text,
  state text,
  zip_code text,
  phone_number text,
  email text
);

grant usage on schema public to anon, authenticated;
grant insert on public.payment_records to anon, authenticated;

alter table public.payment_records enable row level security;

drop policy if exists "Allow payment inserts" on public.payment_records;

create policy "Allow payment inserts"
on public.payment_records
for insert
to anon, authenticated
with check (true);
