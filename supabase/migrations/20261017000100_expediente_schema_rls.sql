-- REVIEW ONLY: do not apply until the owner approves this migration and tests.
-- Storage buckets/policies, legacy imports and application adapters are excluded.
begin;

create table public.dogs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id),
  name text not null check (length(btrim(name)) > 0),
  breed text,
  birth_date date,
  age_months_estimate integer check (age_months_estimate >= 0),
  age_estimated_at date,
  sex text not null default 'unknown' check (sex in ('male', 'female', 'unknown')),
  is_sterilized boolean,
  target_weight_kg numeric(5,1),
  legacy_photo_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint dogs_age_source_check check (
    (birth_date is null or (age_months_estimate is null and age_estimated_at is null))
    and ((age_months_estimate is null) = (age_estimated_at is null))
  )
);

create index dogs_user_created_idx on public.dogs (user_id, created_at);

create table public.weight_entries (
  id uuid primary key default gen_random_uuid(),
  dog_id uuid not null references public.dogs (id),
  weight_kg numeric(5,1) not null check (weight_kg between 1 and 150),
  recorded_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index weight_entries_dog_recorded_idx
  on public.weight_entries (dog_id, recorded_at desc);

create table public.health_records (
  id uuid primary key default gen_random_uuid(),
  dog_id uuid not null references public.dogs (id),
  record_type text not null check (record_type in (
    'vaccination', 'deworming', 'flea_tick_control', 'consultation',
    'prescription', 'lab_result', 'surgery', 'other'
  )),
  title text not null check (length(btrim(title)) > 0),
  event_date date,
  next_due_date date,
  clinic_name text,
  veterinarian text,
  -- Per-type JSON rules are pending owner approval.
  details jsonb,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint health_records_id_dog_unique unique (id, dog_id)
);

create index health_records_dog_event_idx
  on public.health_records (dog_id, event_date desc);

create table public.attachments (
  id uuid primary key default gen_random_uuid(),
  dog_id uuid not null references public.dogs (id),
  health_record_id uuid,
  uploaded_by uuid not null references auth.users (id),
  storage_path text not null unique,
  -- File limits, MIME allowlist and purpose literals are not yet approved.
  original_name text,
  mime_type text,
  file_size_bytes bigint,
  purpose text,
  created_at timestamptz not null default now(),
  constraint attachments_health_record_dog_fk
    foreign key (health_record_id, dog_id)
    references public.health_records (id, dog_id)
);

create index attachments_dog_created_idx
  on public.attachments (dog_id, created_at desc);

-- An absent event date stays NULL. Only technical timestamps get defaults.
create function public.set_expediente_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke all on function public.set_expediente_updated_at() from public, anon, authenticated;

create trigger dogs_updated_at
  before update on public.dogs
  for each row execute function public.set_expediente_updated_at();

create trigger health_records_updated_at
  before update on public.health_records
  for each row execute function public.set_expediente_updated_at();

alter table public.dogs enable row level security;
alter table public.weight_entries enable row level security;
alter table public.health_records enable row level security;
alter table public.attachments enable row level security;

-- Supabase projects can have default grants. Remove excess client privileges.
revoke all on table public.dogs, public.weight_entries, public.health_records,
  public.attachments from public, anon, authenticated;
grant select, insert, update, delete on table public.dogs, public.weight_entries,
  public.health_records, public.attachments to authenticated;

create policy dogs_select_owner on public.dogs
  for select to authenticated
  using (user_id = (select auth.uid()));

create policy dogs_insert_owner on public.dogs
  for insert to authenticated
  with check (user_id = (select auth.uid()));

create policy dogs_update_owner on public.dogs
  for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy dogs_delete_owner on public.dogs
  for delete to authenticated
  using (user_id = (select auth.uid()));

create policy weight_entries_select_owner on public.weight_entries
  for select to authenticated
  using (exists (
    select 1 from public.dogs d
    where d.id = weight_entries.dog_id and d.user_id = (select auth.uid())
  ));

create policy weight_entries_insert_owner on public.weight_entries
  for insert to authenticated
  with check (exists (
    select 1 from public.dogs d
    where d.id = weight_entries.dog_id and d.user_id = (select auth.uid())
  ));

create policy weight_entries_update_owner on public.weight_entries
  for update to authenticated
  using (exists (
    select 1 from public.dogs d
    where d.id = weight_entries.dog_id and d.user_id = (select auth.uid())
  ))
  with check (exists (
    select 1 from public.dogs d
    where d.id = weight_entries.dog_id and d.user_id = (select auth.uid())
  ));

create policy weight_entries_delete_owner on public.weight_entries
  for delete to authenticated
  using (exists (
    select 1 from public.dogs d
    where d.id = weight_entries.dog_id and d.user_id = (select auth.uid())
  ));

create policy health_records_select_owner on public.health_records
  for select to authenticated
  using (exists (
    select 1 from public.dogs d
    where d.id = health_records.dog_id and d.user_id = (select auth.uid())
  ));

create policy health_records_insert_owner on public.health_records
  for insert to authenticated
  with check (exists (
    select 1 from public.dogs d
    where d.id = health_records.dog_id and d.user_id = (select auth.uid())
  ));

create policy health_records_update_owner on public.health_records
  for update to authenticated
  using (exists (
    select 1 from public.dogs d
    where d.id = health_records.dog_id and d.user_id = (select auth.uid())
  ))
  with check (exists (
    select 1 from public.dogs d
    where d.id = health_records.dog_id and d.user_id = (select auth.uid())
  ));

create policy health_records_delete_owner on public.health_records
  for delete to authenticated
  using (exists (
    select 1 from public.dogs d
    where d.id = health_records.dog_id and d.user_id = (select auth.uid())
  ));

create policy attachments_select_owner on public.attachments
  for select to authenticated
  using (uploaded_by = (select auth.uid()) and exists (
    select 1 from public.dogs d
    where d.id = attachments.dog_id and d.user_id = (select auth.uid())
  ));

create policy attachments_insert_owner on public.attachments
  for insert to authenticated
  with check (uploaded_by = (select auth.uid()) and exists (
    select 1 from public.dogs d
    where d.id = attachments.dog_id and d.user_id = (select auth.uid())
  ));

create policy attachments_update_owner on public.attachments
  for update to authenticated
  using (uploaded_by = (select auth.uid()) and exists (
    select 1 from public.dogs d
    where d.id = attachments.dog_id and d.user_id = (select auth.uid())
  ))
  with check (uploaded_by = (select auth.uid()) and exists (
    select 1 from public.dogs d
    where d.id = attachments.dog_id and d.user_id = (select auth.uid())
  ));

create policy attachments_delete_owner on public.attachments
  for delete to authenticated
  using (uploaded_by = (select auth.uid()) and exists (
    select 1 from public.dogs d
    where d.id = attachments.dog_id and d.user_id = (select auth.uid())
  ));

commit;
