-- Run only against a disposable local Supabase. Fixtures are rolled back.
begin;
create extension if not exists pgtap with schema extensions;
set local search_path = public, extensions, pg_catalog;
select no_plan();

select has_function('public', 'create_dog_with_initial_weight',
  array['text', 'text', 'text', 'numeric', 'date', 'integer', 'date', 'numeric'],
  'RPC has the explicit approved arguments, without a caller-supplied owner');
select ok(not p.prosecdef, 'RPC is SECURITY INVOKER')
from pg_proc p where p.oid = 'public.create_dog_with_initial_weight(text,text,text,numeric,date,integer,date,numeric)'::regprocedure;
select ok(p.proconfig @> array['search_path=""'], 'RPC has an empty search_path')
from pg_proc p where p.oid = 'public.create_dog_with_initial_weight(text,text,text,numeric,date,integer,date,numeric)'::regprocedure;
select ok(not exists (
  select 1 from pg_proc p cross join lateral aclexplode(p.proacl) a
  where p.oid = 'public.create_dog_with_initial_weight(text,text,text,numeric,date,integer,date,numeric)'::regprocedure
    and a.grantee = 0 and a.privilege_type = 'EXECUTE'
), 'PUBLIC has no EXECUTE grant');
select ok(not has_function_privilege('anon',
  'public.create_dog_with_initial_weight(text,text,text,numeric,date,integer,date,numeric)', 'EXECUTE'),
  'anon cannot execute RPC');
select ok(not has_function_privilege('service_role',
  'public.create_dog_with_initial_weight(text,text,text,numeric,date,integer,date,numeric)', 'EXECUTE'),
  'No default service_role EXECUTE grant remains');
select ok(has_function_privilege('authenticated',
  'public.create_dog_with_initial_weight(text,text,text,numeric,date,integer,date,numeric)', 'EXECUTE'),
  'authenticated can execute RPC');

insert into auth.users (id, email) values
  ('11111111-1111-4111-8111-111111111111', 'sprint2a-rpc-a@example.invalid'),
  ('22222222-2222-4222-8222-222222222222', 'sprint2a-rpc-b@example.invalid');
create temporary table rpc_results (label text primary key, payload jsonb);
grant select, insert on rpc_results to authenticated;

set local role authenticated;
set local request.jwt.claim.sub = '11111111-1111-4111-8111-111111111111';
set local request.jwt.claims = '{"sub":"11111111-1111-4111-8111-111111111111","role":"authenticated"}';
select is(current_user::text, 'authenticated', 'RPC exercise does not use an administrative role');
insert into rpc_results values ('a', public.create_dog_with_initial_weight(
  'RPC A', 'Fixture breed', 'female', 12.5, null, 18, '2026-10-18', 10.5));
select is((select payload->'dog'->>'user_id' from rpc_results where label = 'a'),
  auth.uid()::text, 'Owner comes from authenticated identity');
select is((select payload->'weight'->>'dog_id' from rpc_results where label = 'a'),
  (select payload->'dog'->>'id' from rpc_results where label = 'a'), 'Weight references the newly created dog');
select is((select count(*)::integer from public.dogs), 1, 'A has exactly one created dog');
select is((select count(*)::integer from public.weight_entries), 1, 'A has exactly one initial weight');
select is((select weight_kg from public.weight_entries), 10.5::numeric, 'Initial weight is stored');
select is((select recorded_at from public.weight_entries), now(), 'Initial weight is recorded at this transaction time');
select ok((select birth_date is null and age_months_estimate = 18 and age_estimated_at = '2026-10-18'::date
  from public.dogs), 'Estimate and original reference date are retained');
select ok((select is_sterilized is null and legacy_photo_url is null from public.dogs),
  'RPC does not invent sterilization or a legacy photo');
select is((select payload->'dog' from rpc_results where label = 'a'),
  (select to_jsonb(d) from public.dogs d), 'Confirmed dog row is returned');
select is((select payload->'weight' from rpc_results where label = 'a'),
  (select to_jsonb(w) from public.weight_entries w), 'Confirmed weight row is returned');

select throws_ok(format($call$select public.create_dog_with_initial_weight(
  'Invalid initial weight', null, 'unknown', null, null, null, null, %L::numeric)$call$, t.weight),
  '23514', null, 'Invalid initial weight rejected: ' || t.weight)
from (values ('0'), ('150.1'), ('NaN')) t(weight);
select throws_ok($call$select public.create_dog_with_initial_weight(
  'Missing initial weight', null, 'unknown', null, null, null, null, null)$call$,
  '23502', null, 'Missing initial weight rejected');
select is((select count(*)::integer from public.dogs), 1, 'Failed weights rolled back every inserted dog');
select is((select count(*)::integer from public.weight_entries), 1, 'Failed calls left no extra weight');
select throws_ok($call$select public.create_dog_with_initial_weight(
  'Conflicting age', null, 'unknown', null, '2020-01-01', 12, '2026-10-18', 10)$call$,
  '23514', null, 'RPC retains the mutually exclusive age constraint');
select throws_ok($call$select public.create_dog_with_initial_weight(
  'Unpaired age', null, 'unknown', null, null, 12, null, 10)$call$,
  '23514', null, 'RPC retains the estimate/reference pairing constraint');
select throws_ok($call$select public.create_dog_with_initial_weight(
  '   ', null, 'unknown', null, null, null, null, 10)$call$,
  '23514', null, 'RPC retains the nonempty name constraint');
select throws_ok($call$select public.create_dog_with_initial_weight(
  'Invalid sex', null, 'invalid', null, null, null, null, 10)$call$,
  '23514', null, 'RPC retains the sex constraint');
select is((select count(*)::integer from public.dogs), 1, 'Invalid profiles leave no partial records');

set local request.jwt.claim.sub = '22222222-2222-4222-8222-222222222222';
set local request.jwt.claims = '{"sub":"22222222-2222-4222-8222-222222222222","role":"authenticated"}';
select is((select count(*)::integer from public.dogs), 0, 'B cannot read the RPC-created A dog');
select is((select count(*)::integer from public.weight_entries), 0, 'B cannot read the RPC-created A weight');
with changed as (update public.dogs set name = 'attack'
  where id = (select (payload->'dog'->>'id')::uuid from rpc_results where label = 'a') returning id)
select is((select count(*)::integer from changed), 0, 'B cannot update the RPC-created A dog');
with changed as (delete from public.weight_entries
  where id = (select (payload->'weight'->>'id')::uuid from rpc_results where label = 'a') returning id)
select is((select count(*)::integer from changed), 0, 'B cannot delete the RPC-created A weight');
insert into rpc_results values ('b', public.create_dog_with_initial_weight(
  'RPC B', null, 'unknown', null, null, null, null, 1));
select is((select payload->'dog'->>'user_id' from rpc_results where label = 'b'),
  auth.uid()::text, 'B can create only a dog owned by B');
select ok((select birth_date is null and age_months_estimate is null and age_estimated_at is null
  and target_weight_kg is null from public.dogs), 'Unknown data remains SQL NULL');
select is((select count(*)::integer from public.dogs), 1, 'B sees only its own new dog');

set local request.jwt.claim.sub = '11111111-1111-4111-8111-111111111111';
set local request.jwt.claims = '{"sub":"11111111-1111-4111-8111-111111111111","role":"authenticated"}';
select is((select count(*)::integer from public.dogs where name = 'RPC B'), 0, 'A cannot read the RPC-created B dog');
with changed as (update public.weight_entries set weight_kg = 99
  where dog_id = (select (payload->'dog'->>'id')::uuid from rpc_results where label = 'b') returning id)
select is((select count(*)::integer from changed), 0, 'A cannot update the RPC-created B weight');
insert into rpc_results values ('known', public.create_dog_with_initial_weight(
  'Known birth', null, 'male', 20, '2020-02-29', null, null, 150));
select ok((select birth_date = '2020-02-29'::date and age_months_estimate is null and age_estimated_at is null
  from public.dogs where name = 'Known birth'), 'Known birth date remains exact');
select is((select weight_kg from public.weight_entries where dog_id =
  (select (payload->'dog'->>'id')::uuid from rpc_results where label = 'known')),
  150::numeric, 'Upper inclusive weight bound accepted by RPC');

-- A restrictive policy proves that INVOKER does not bypass the weight RLS check.
reset role;
create policy rpc_test_deny_weight on public.weight_entries as restrictive
  for insert to authenticated with check (false);
set local role authenticated;
select throws_ok($call$select public.create_dog_with_initial_weight(
  'RLS denied weight', null, 'unknown', null, null, null, null, 10)$call$,
  '42501', null, 'RLS remains active for the second insert');
select is((select count(*)::integer from public.dogs where name = 'RLS denied weight'), 0,
  'A weight RLS failure also rolls back the first insert');
reset role;
drop policy rpc_test_deny_weight on public.weight_entries;
create policy rpc_test_deny_dog on public.dogs as restrictive
  for insert to authenticated with check (false);
set local role authenticated;
select throws_ok($call$select public.create_dog_with_initial_weight(
  'RLS denied dog', null, 'unknown', null, null, null, null, 10)$call$,
  '42501', null, 'RLS remains active for the first insert');
reset role;
drop policy rpc_test_deny_dog on public.dogs;

set local role authenticated;
set local request.jwt.claim.sub = '';
set local request.jwt.claims = '{"role":"authenticated"}';
select throws_ok($call$select public.create_dog_with_initial_weight(
  'Missing identity', null, 'unknown', null, null, null, null, 10)$call$,
  '42501', 'Authentication required', 'Authenticated role without identity cannot create');
reset role;
set local role anon;
select throws_ok($call$select public.create_dog_with_initial_weight(
  'Anonymous', null, 'unknown', null, null, null, null, 10)$call$,
  '42501', null, 'Anonymous execution is denied');

reset role;
select is((select count(*)::integer from public.dogs), 3, 'Only the three successful calls persisted');
select is((select count(*)::integer from public.weight_entries), 3, 'Every successful call has exactly one weight');
select is((select name from public.dogs where user_id = '22222222-2222-4222-8222-222222222222'),
  'RPC B', 'B victim profile remains intact');
select is((select weight_kg from public.weight_entries where dog_id =
  (select (payload->'dog'->>'id')::uuid from rpc_results where label = 'b')),
  1::numeric, 'B victim weight remains intact');
select * from finish();
rollback;
