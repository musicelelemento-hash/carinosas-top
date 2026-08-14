-- Apply this migration to an existing Supabase project. It never drops data.
begin;

alter table public.models
  add constraint models_adult_age_check check (age >= 18) not valid;

alter table public.models
  validate constraint models_adult_age_check;

create index if not exists models_city_plan_created_at_idx
  on public.models (city, plan_type, created_at desc);

commit;
