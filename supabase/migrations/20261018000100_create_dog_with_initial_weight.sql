-- Apply only to the explicitly approved environment. No legacy data is imported.
begin;

create function public.create_dog_with_initial_weight(
  p_name text,
  p_breed text,
  p_sex text,
  p_target_weight_kg numeric,
  p_birth_date date,
  p_age_months_estimate integer,
  p_age_estimated_at date,
  p_initial_weight_kg numeric
)
returns jsonb
language plpgsql
security invoker
set search_path = ''
as $$
declare
  actor uuid := auth.uid();
  created_dog public.dogs%rowtype;
  created_weight public.weight_entries%rowtype;
begin
  if actor is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;

  insert into public.dogs (
    user_id, name, breed, sex, target_weight_kg,
    birth_date, age_months_estimate, age_estimated_at
  ) values (
    actor, p_name, p_breed, p_sex, p_target_weight_kg,
    p_birth_date, p_age_months_estimate, p_age_estimated_at
  ) returning * into created_dog;

  -- Both inserts run with the caller's RLS; an error rolls back the entire call.
  insert into public.weight_entries (dog_id, weight_kg, recorded_at)
  values (created_dog.id, p_initial_weight_kg, pg_catalog.now())
  returning * into created_weight;

  return pg_catalog.jsonb_build_object(
    'dog', pg_catalog.to_jsonb(created_dog),
    'weight', pg_catalog.to_jsonb(created_weight)
  );
end;
$$;

revoke all on function public.create_dog_with_initial_weight(
  text, text, text, numeric, date, integer, date, numeric
) from public, anon, authenticated, service_role;
grant execute on function public.create_dog_with_initial_weight(
  text, text, text, numeric, date, integer, date, numeric
) to authenticated;

commit;
