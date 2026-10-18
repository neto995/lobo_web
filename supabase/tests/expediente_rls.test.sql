-- PREPARED, NOT EXECUTED. Run only on a disposable local Supabase after approval.
-- Fixtures use the administrative SQL test connection, never service-role API keys.
begin;
create extension if not exists pgtap with schema extensions;
set local search_path = public, extensions, pg_catalog;
select no_plan();

insert into auth.users (id, email) values
  ('11111111-1111-4111-8111-111111111111', 'sprint2a-a@example.invalid'),
  ('22222222-2222-4222-8222-222222222222', 'sprint2a-b@example.invalid');

insert into public.dogs (id, user_id, name) values
  ('10000000-0000-4000-8000-000000000001', '11111111-1111-4111-8111-111111111111', 'A'),
  ('20000000-0000-4000-8000-000000000001', '22222222-2222-4222-8222-222222222222', 'B');
insert into public.weight_entries (id, dog_id, weight_kg, recorded_at) values
  ('10000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000001', 10, '2026-10-16T12:00:00Z'),
  ('20000000-0000-4000-8000-000000000002', '20000000-0000-4000-8000-000000000001', 20, '2026-10-16T12:00:00Z');
insert into public.health_records (id, dog_id, record_type, title) values
  ('10000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000001', 'other', 'A'),
  ('20000000-0000-4000-8000-000000000003', '20000000-0000-4000-8000-000000000001', 'other', 'B');
insert into public.attachments (id, dog_id, health_record_id, uploaded_by, storage_path, original_name) values
  ('10000000-0000-4000-8000-000000000004', '10000000-0000-4000-8000-000000000001',
   '10000000-0000-4000-8000-000000000003', '11111111-1111-4111-8111-111111111111', 'fixture-a', 'A'),
  ('20000000-0000-4000-8000-000000000004', '20000000-0000-4000-8000-000000000001',
   '20000000-0000-4000-8000-000000000003', '22222222-2222-4222-8222-222222222222', 'fixture-b', 'B');

select ok(c.relrowsecurity, c.relname || ': RLS enabled')
from pg_class c join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public' and c.relname in ('dogs', 'weight_entries', 'health_records', 'attachments');

select is((select count(*)::integer from pg_policies
  where schemaname = 'public' and tablename = t.name), 4, t.name || ': four policies')
from (values ('dogs'), ('weight_entries'), ('health_records'), ('attachments')) t(name);

select ok(not has_table_privilege('authenticated', 'public.' || t.name, p.privilege),
  t.name || ': authenticated has no ' || p.privilege)
from (values ('dogs'), ('weight_entries'), ('health_records'), ('attachments')) t(name)
cross join (values ('TRUNCATE'), ('REFERENCES'), ('TRIGGER')) p(privilege);

-- A exercises real policy evaluation, including old/new rows during UPDATE.
set local role authenticated;
set local request.jwt.claim.sub = '11111111-1111-4111-8111-111111111111';
set local request.jwt.claims = '{"sub":"11111111-1111-4111-8111-111111111111","role":"authenticated"}';
select is(current_user::text, 'authenticated', 'A tests are not privileged');
select is(auth.uid(), '11111111-1111-4111-8111-111111111111'::uuid, 'A identity');

select results_eq(format('select id from public.%I order by id', t.name), array[t.id::uuid],
  'A reads only own ' || t.name)
from (values
  ('dogs', '10000000-0000-4000-8000-000000000001'),
  ('weight_entries', '10000000-0000-4000-8000-000000000002'),
  ('health_records', '10000000-0000-4000-8000-000000000003'),
  ('attachments', '10000000-0000-4000-8000-000000000004')
) t(name, id);

-- Top-level CTEs measure affected rows; results_eq cursors only accept SELECT.
with changed as (update public.dogs set name = 'attack'
  where id = '20000000-0000-4000-8000-000000000001' returning id)
select is((select count(*)::integer from changed), 0, 'A cannot update B dog');
with changed as (update public.weight_entries set weight_kg = 99
  where id = '20000000-0000-4000-8000-000000000002' returning id)
select is((select count(*)::integer from changed), 0, 'A cannot update B weight');
with changed as (update public.health_records set title = 'attack'
  where id = '20000000-0000-4000-8000-000000000003' returning id)
select is((select count(*)::integer from changed), 0, 'A cannot update B health');
with changed as (update public.attachments set original_name = 'attack'
  where id = '20000000-0000-4000-8000-000000000004' returning id)
select is((select count(*)::integer from changed), 0, 'A cannot update B attachment');

with changed as (delete from public.attachments
  where id = '20000000-0000-4000-8000-000000000004' returning id)
select is((select count(*)::integer from changed), 0, 'A cannot delete B attachment');
with changed as (delete from public.health_records
  where id = '20000000-0000-4000-8000-000000000003' returning id)
select is((select count(*)::integer from changed), 0, 'A cannot delete B health');
with changed as (delete from public.weight_entries
  where id = '20000000-0000-4000-8000-000000000002' returning id)
select is((select count(*)::integer from changed), 0, 'A cannot delete B weight');
with changed as (delete from public.dogs
  where id = '20000000-0000-4000-8000-000000000001' returning id)
select is((select count(*)::integer from changed), 0, 'A cannot delete B dog');

select throws_ok($$insert into public.dogs (user_id, name)
  values ('22222222-2222-4222-8222-222222222222', 'attack')$$, '42501', null, 'A cannot insert B dog');
select throws_ok($$insert into public.weight_entries (dog_id, weight_kg, recorded_at)
  values ('20000000-0000-4000-8000-000000000001', 10, now())$$, '42501', null, 'A cannot insert B weight');
select throws_ok($$insert into public.health_records (dog_id, record_type, title)
  values ('20000000-0000-4000-8000-000000000001', 'other', 'attack')$$, '42501', null, 'A cannot insert B health');
select throws_ok($$insert into public.attachments (dog_id, uploaded_by, storage_path)
  values ('20000000-0000-4000-8000-000000000001', auth.uid(), 'attack-a')$$, '42501', null, 'A cannot insert B attachment');

select throws_ok($$update public.dogs set user_id = '22222222-2222-4222-8222-222222222222'
  where id = '10000000-0000-4000-8000-000000000001'$$, '42501', null, 'A cannot transfer dog ownership');
select throws_ok(format('update public.%I set dog_id = %L where id = %L',
  t.name, '20000000-0000-4000-8000-000000000001', t.id),
  '42501', null, 'A cannot reassign ' || t.name || ' to B')
from (values
  ('weight_entries', '10000000-0000-4000-8000-000000000002'),
  ('health_records', '10000000-0000-4000-8000-000000000003'),
  ('attachments', '10000000-0000-4000-8000-000000000004')
) t(name, id);
select throws_ok($$update public.attachments set uploaded_by = '22222222-2222-4222-8222-222222222222'
  where id = '10000000-0000-4000-8000-000000000004'$$, '42501', null, 'A cannot forge uploader on update');
select throws_ok($$insert into public.attachments (dog_id, uploaded_by, storage_path)
  values ('10000000-0000-4000-8000-000000000001', '22222222-2222-4222-8222-222222222222', 'wrong-uploader')$$,
  '42501', null, 'A cannot forge uploader on insert');
select throws_ok($$insert into public.attachments (dog_id, health_record_id, uploaded_by, storage_path)
  values ('10000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000003', auth.uid(), 'wrong-health')$$,
  '23503', null, 'A cannot attach B health record to A dog');

with changed as (insert into public.dogs (id, user_id, name)
  values ('10000000-0000-4000-8000-000000000011', auth.uid(), 'A new') returning id)
select is((select id from changed), '10000000-0000-4000-8000-000000000011'::uuid, 'A inserts own dog');
with changed as (insert into public.weight_entries (id, dog_id, weight_kg, recorded_at)
  values ('10000000-0000-4000-8000-000000000012', '10000000-0000-4000-8000-000000000011', 1, now()) returning id)
select is((select id from changed), '10000000-0000-4000-8000-000000000012'::uuid, 'A inserts own weight');
with changed as (insert into public.health_records (id, dog_id, record_type, title)
  values ('10000000-0000-4000-8000-000000000013', '10000000-0000-4000-8000-000000000011', 'other', 'A new') returning id)
select is((select id from changed), '10000000-0000-4000-8000-000000000013'::uuid, 'A inserts own health record');
with changed as (insert into public.attachments (id, dog_id, health_record_id, uploaded_by, storage_path)
  values ('10000000-0000-4000-8000-000000000014', '10000000-0000-4000-8000-000000000011',
    '10000000-0000-4000-8000-000000000013', auth.uid(), 'new-a') returning id)
select is((select id from changed), '10000000-0000-4000-8000-000000000014'::uuid, 'A inserts own attachment');

with changed as (update public.dogs set name = 'A changed'
  where id = '10000000-0000-4000-8000-000000000011' returning name)
select is((select name from changed), 'A changed', 'A updates own dog');
with changed as (update public.weight_entries set weight_kg = 150
  where id = '10000000-0000-4000-8000-000000000012' returning weight_kg)
select is((select weight_kg from changed), 150::numeric, 'A updates own weight');
with changed as (update public.health_records set title = 'A changed'
  where id = '10000000-0000-4000-8000-000000000013' returning title)
select is((select title from changed), 'A changed', 'A updates own health record');
with changed as (update public.attachments set original_name = 'A changed'
  where id = '10000000-0000-4000-8000-000000000014' returning original_name)
select is((select original_name from changed), 'A changed', 'A updates own attachment');

with changed as (delete from public.attachments where storage_path = 'new-a' returning id)
select is((select id from changed), '10000000-0000-4000-8000-000000000014'::uuid, 'A deletes own attachment');
with changed as (delete from public.health_records where id = '10000000-0000-4000-8000-000000000013' returning id)
select is((select id from changed), '10000000-0000-4000-8000-000000000013'::uuid, 'A deletes own health record');
with changed as (delete from public.weight_entries where id = '10000000-0000-4000-8000-000000000012' returning id)
select is((select id from changed), '10000000-0000-4000-8000-000000000012'::uuid, 'A deletes own weight');
with changed as (delete from public.dogs where id = '10000000-0000-4000-8000-000000000011' returning id)
select is((select id from changed), '10000000-0000-4000-8000-000000000011'::uuid, 'A deletes own dog');

-- Repeat the boundary in the opposite direction, without changing SQL role.
set local request.jwt.claim.sub = '22222222-2222-4222-8222-222222222222';
set local request.jwt.claims = '{"sub":"22222222-2222-4222-8222-222222222222","role":"authenticated"}';
select is(current_user::text, 'authenticated', 'B tests are not privileged');
select is(auth.uid(), '22222222-2222-4222-8222-222222222222'::uuid, 'B identity');

select results_eq(format('select id from public.%I order by id', t.name), array[t.id::uuid],
  'B reads only own ' || t.name)
from (values
  ('dogs', '20000000-0000-4000-8000-000000000001'),
  ('weight_entries', '20000000-0000-4000-8000-000000000002'),
  ('health_records', '20000000-0000-4000-8000-000000000003'),
  ('attachments', '20000000-0000-4000-8000-000000000004')
) t(name, id);

with changed as (update public.dogs set name = 'attack'
  where id = '10000000-0000-4000-8000-000000000001' returning id)
select is((select count(*)::integer from changed), 0, 'B cannot update A dog');
with changed as (update public.weight_entries set weight_kg = 99
  where id = '10000000-0000-4000-8000-000000000002' returning id)
select is((select count(*)::integer from changed), 0, 'B cannot update A weight');
with changed as (update public.health_records set title = 'attack'
  where id = '10000000-0000-4000-8000-000000000003' returning id)
select is((select count(*)::integer from changed), 0, 'B cannot update A health');
with changed as (update public.attachments set original_name = 'attack'
  where id = '10000000-0000-4000-8000-000000000004' returning id)
select is((select count(*)::integer from changed), 0, 'B cannot update A attachment');

with changed as (delete from public.attachments
  where id = '10000000-0000-4000-8000-000000000004' returning id)
select is((select count(*)::integer from changed), 0, 'B cannot delete A attachment');
with changed as (delete from public.health_records
  where id = '10000000-0000-4000-8000-000000000003' returning id)
select is((select count(*)::integer from changed), 0, 'B cannot delete A health');
with changed as (delete from public.weight_entries
  where id = '10000000-0000-4000-8000-000000000002' returning id)
select is((select count(*)::integer from changed), 0, 'B cannot delete A weight');
with changed as (delete from public.dogs
  where id = '10000000-0000-4000-8000-000000000001' returning id)
select is((select count(*)::integer from changed), 0, 'B cannot delete A dog');

select throws_ok($$insert into public.dogs (user_id, name)
  values ('11111111-1111-4111-8111-111111111111', 'attack')$$, '42501', null, 'B cannot insert A dog');
select throws_ok($$insert into public.weight_entries (dog_id, weight_kg, recorded_at)
  values ('10000000-0000-4000-8000-000000000001', 20, now())$$, '42501', null, 'B cannot insert A weight');
select throws_ok($$insert into public.health_records (dog_id, record_type, title)
  values ('10000000-0000-4000-8000-000000000001', 'other', 'attack')$$, '42501', null, 'B cannot insert A health');
select throws_ok($$insert into public.attachments (dog_id, uploaded_by, storage_path)
  values ('10000000-0000-4000-8000-000000000001', auth.uid(), 'attack-b')$$, '42501', null, 'B cannot insert A attachment');
select throws_ok($$update public.dogs set user_id = '11111111-1111-4111-8111-111111111111'
  where id = '20000000-0000-4000-8000-000000000001'$$, '42501', null, 'B cannot transfer dog ownership');
select throws_ok(format('update public.%I set dog_id = %L where id = %L',
  t.name, '10000000-0000-4000-8000-000000000001', t.id),
  '42501', null, 'B cannot reassign ' || t.name || ' to A')
from (values
  ('weight_entries', '20000000-0000-4000-8000-000000000002'),
  ('health_records', '20000000-0000-4000-8000-000000000003'),
  ('attachments', '20000000-0000-4000-8000-000000000004')
) t(name, id);
select throws_ok($$update public.attachments set uploaded_by = '11111111-1111-4111-8111-111111111111'
  where id = '20000000-0000-4000-8000-000000000004'$$, '42501', null, 'B cannot forge uploader');
select throws_ok($$update public.attachments set health_record_id = '10000000-0000-4000-8000-000000000003'
  where id = '20000000-0000-4000-8000-000000000004'$$, '23503', null, 'B cannot attach A health record');

with changed as (insert into public.dogs (id, user_id, name)
  values ('20000000-0000-4000-8000-000000000011', auth.uid(), 'B new') returning id)
select is((select id from changed), '20000000-0000-4000-8000-000000000011'::uuid, 'B inserts own dog');
with changed as (insert into public.weight_entries (id, dog_id, weight_kg, recorded_at)
  values ('20000000-0000-4000-8000-000000000012', '20000000-0000-4000-8000-000000000011', 150, now()) returning id)
select is((select id from changed), '20000000-0000-4000-8000-000000000012'::uuid, 'B inserts own weight');
with changed as (insert into public.health_records (id, dog_id, record_type, title)
  values ('20000000-0000-4000-8000-000000000013', '20000000-0000-4000-8000-000000000011', 'other', 'B new') returning id)
select is((select id from changed), '20000000-0000-4000-8000-000000000013'::uuid, 'B inserts own health record');
with changed as (insert into public.attachments (id, dog_id, health_record_id, uploaded_by, storage_path)
  values ('20000000-0000-4000-8000-000000000014', '20000000-0000-4000-8000-000000000011',
    '20000000-0000-4000-8000-000000000013', auth.uid(), 'new-b') returning id)
select is((select id from changed), '20000000-0000-4000-8000-000000000014'::uuid, 'B inserts own attachment');

with changed as (update public.dogs set name = 'B changed'
  where id = '20000000-0000-4000-8000-000000000011' returning name)
select is((select name from changed), 'B changed', 'B updates own dog');
with changed as (update public.weight_entries set weight_kg = 1
  where id = '20000000-0000-4000-8000-000000000012' returning weight_kg)
select is((select weight_kg from changed), 1::numeric, 'B updates own weight');
with changed as (update public.health_records set title = 'B changed'
  where id = '20000000-0000-4000-8000-000000000013' returning title)
select is((select title from changed), 'B changed', 'B updates own health record');
with changed as (update public.attachments set original_name = 'B changed'
  where id = '20000000-0000-4000-8000-000000000014' returning original_name)
select is((select original_name from changed), 'B changed', 'B updates own attachment');

with changed as (delete from public.attachments where storage_path = 'new-b' returning id)
select is((select id from changed), '20000000-0000-4000-8000-000000000014'::uuid, 'B deletes own attachment');
with changed as (delete from public.health_records where id = '20000000-0000-4000-8000-000000000013' returning id)
select is((select id from changed), '20000000-0000-4000-8000-000000000013'::uuid, 'B deletes own health record');
with changed as (delete from public.weight_entries where id = '20000000-0000-4000-8000-000000000012' returning id)
select is((select id from changed), '20000000-0000-4000-8000-000000000012'::uuid, 'B deletes own weight');
with changed as (delete from public.dogs where id = '20000000-0000-4000-8000-000000000011' returning id)
select is((select id from changed), '20000000-0000-4000-8000-000000000011'::uuid, 'B deletes own dog');

-- A role name without an authenticated subject is insufficient.
set local request.jwt.claim.sub = '';
set local request.jwt.claims = '{"role":"authenticated"}';
select ok(auth.uid() is null, 'Missing JWT subject yields no identity');
select results_eq(format('select id from public.%I', t.name), array[]::uuid[],
  'No identity cannot read ' || t.name)
from (values ('dogs'), ('weight_entries'), ('health_records'), ('attachments')) t(name);
with changed as (update public.dogs set name = 'attack' returning id)
select is((select count(*)::integer from changed), 0, 'No identity cannot update dogs');
with changed as (update public.weight_entries set weight_kg = 99 returning id)
select is((select count(*)::integer from changed), 0, 'No identity cannot update weights');
with changed as (update public.health_records set title = 'attack' returning id)
select is((select count(*)::integer from changed), 0, 'No identity cannot update health');
with changed as (update public.attachments set original_name = 'attack' returning id)
select is((select count(*)::integer from changed), 0, 'No identity cannot update attachments');
with changed as (delete from public.attachments returning id)
select is((select count(*)::integer from changed), 0, 'No identity cannot delete attachments');
with changed as (delete from public.health_records returning id)
select is((select count(*)::integer from changed), 0, 'No identity cannot delete health');
with changed as (delete from public.weight_entries returning id)
select is((select count(*)::integer from changed), 0, 'No identity cannot delete weights');
with changed as (delete from public.dogs returning id)
select is((select count(*)::integer from changed), 0, 'No identity cannot delete dogs');
select throws_ok($$insert into public.dogs (user_id, name)
  values ('11111111-1111-4111-8111-111111111111', 'attack')$$, '42501', null, 'No identity cannot insert dog');
select throws_ok($$insert into public.weight_entries (dog_id, weight_kg, recorded_at)
  values ('10000000-0000-4000-8000-000000000001', 10, now())$$, '42501', null, 'No identity cannot insert weight');
select throws_ok($$insert into public.health_records (dog_id, record_type, title)
  values ('10000000-0000-4000-8000-000000000001', 'other', 'attack')$$, '42501', null, 'No identity cannot insert health');
select throws_ok($$insert into public.attachments (dog_id, uploaded_by, storage_path)
  values ('10000000-0000-4000-8000-000000000001', '11111111-1111-4111-8111-111111111111', 'no-identity')$$,
  '42501', null, 'No identity cannot insert attachment');

reset role;
set local role anon;
select throws_ok(format('select * from public.%I', t.name), '42501', null,
  'anon cannot select ' || t.name)
from (values ('dogs'), ('weight_entries'), ('health_records'), ('attachments')) t(name);
select throws_ok(format('insert into public.%I default values', t.name), '42501', null,
  'anon cannot insert ' || t.name)
from (values ('dogs'), ('weight_entries'), ('health_records'), ('attachments')) t(name);
select throws_ok(format('update public.%I set %I = %I', t.name, t.field, t.field),
  '42501', null, 'anon cannot update ' || t.name)
from (values ('dogs', 'name'), ('weight_entries', 'weight_kg'),
  ('health_records', 'title'), ('attachments', 'original_name')) t(name, field);
select throws_ok(format('delete from public.%I', t.name), '42501', null,
  'anon cannot delete ' || t.name)
from (values ('dogs'), ('weight_entries'), ('health_records'), ('attachments')) t(name);

-- Privileged verification only after all user operations: victims stayed intact.
reset role;
select results_eq('select name from public.dogs order by id', array['A', 'B'], 'Both dogs unchanged');
select results_eq('select weight_kg::text from public.weight_entries order by id', array['10.0', '20.0'], 'Both weights unchanged');
select results_eq('select title from public.health_records order by id', array['A', 'B'], 'Both health records unchanged');
select results_eq('select original_name from public.attachments order by id', array['A', 'B'], 'Both attachments unchanged');
select * from finish();
rollback;
