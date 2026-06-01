alter table public.properties
add column if not exists area_has_plus boolean not null default false;
