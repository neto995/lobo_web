-- PREPARED, NOT EXECUTED. Run only on a disposable local Supabase after approval.
begin;
create extension if not exists pgtap with schema extensions;
set local search_path = public, extensions, pg_catalog;
select no_plan();

insert into auth.users (id, email) values
  ('11111111-1111-4111-8111-111111111111', 'sprint2a-a@example.invalid');

set local role authenticated;
set local request.jwt.claim.sub = '11111111-1111-4111-8111-111111111111';
set local request.jwt.claims = '{"sub":"11111111-1111-4111-8111-111111111111","role":"authenticated"}';
select is(current_user::text, 'authenticated', 'Constraint operations are not privileged');

insert into public.dogs (id, user_id, name) values
  ('10000000-0000-4000-8000-000000000001', auth.uid(), 'Unknown age'),
  ('10000000-0000-4000-8000-000000000002', auth.uid(), 'Second dog');

select ok((select birth_date is null and age_months_estimate is null and age_estimated_at is null
  from public.dogs where id = '10000000-0000-4000-8000-000000000001'), 'Unknown age stays unknown');
select is((select sex from public.dogs where id = '10000000-0000-4000-8000-000000000001'),
  'unknown', 'Missing sex is explicitly unknown');
select ok((select is_sterilized is null and target_weight_kg is null and legacy_photo_url is null
  from public.dogs where id = '10000000-0000-4000-8000-000000000001'), 'Optional dog data stays NULL');

with changed as (update public.dogs set birth_date = '2020-02-29'
  where id = '10000000-0000-4000-8000-000000000001' returning birth_date)
select is((select birth_date from changed), '2020-02-29'::date, 'Known birth date retained');
select throws_ok($$update public.dogs set age_months_estimate = 12, age_estimated_at = '2026-10-16'
  where id = '10000000-0000-4000-8000-000000000001'$$, '23514', null, 'Cannot mix birth date and estimate');
with changed as (update public.dogs set birth_date = null, age_months_estimate = 12, age_estimated_at = '2026-10-16'
  where id = '10000000-0000-4000-8000-000000000001' returning age_months_estimate, age_estimated_at)
select ok((select age_months_estimate = 12 and age_estimated_at = '2026-10-16'::date from changed),
  'Estimate retains its reference date');
select throws_ok($$update public.dogs set age_estimated_at = null
  where id = '10000000-0000-4000-8000-000000000001'$$, '23514', null, 'Estimate requires a reference date');
select throws_ok($$update public.dogs set age_months_estimate = null
  where id = '10000000-0000-4000-8000-000000000001'$$, '23514', null, 'Reference date requires an estimate');
select throws_ok($$update public.dogs set age_months_estimate = -1
  where id = '10000000-0000-4000-8000-000000000001'$$, '23514', null, 'Negative estimate rejected');
select throws_ok($$update public.dogs set sex = 'unsupported'
  where id = '10000000-0000-4000-8000-000000000001'$$, '23514', null, 'Unapproved sex rejected');
select throws_ok($$insert into public.dogs (user_id, name) values (auth.uid(), '   ')$$,
  '23514', null, 'Empty dog name rejected');
select throws_ok($$insert into public.dogs (user_id, name) values (auth.uid(), null)$$,
  '23502', null, 'Missing dog name rejected');

with changed as (insert into public.weight_entries (dog_id, weight_kg, recorded_at) values
  ('10000000-0000-4000-8000-000000000001', 1, '2026-10-16T12:00:00Z'),
  ('10000000-0000-4000-8000-000000000001', 150, '2026-10-16T12:00:00Z') returning id)
select is((select count(*)::integer from changed), 2, 'Both inclusive weight bounds accepted');
select results_eq('select weight_kg from public.weight_entries order by weight_kg',
  array[1::numeric, 150::numeric], 'Accepted weight bounds stored');
select ok((select bool_and(recorded_at = '2026-10-16T12:00:00Z'::timestamptz)
  from public.weight_entries), 'Recorded time retained rather than replaced with now');
select throws_ok(format('insert into public.weight_entries (dog_id, weight_kg, recorded_at) values (%L, %L, now())',
  '10000000-0000-4000-8000-000000000001', t.weight), '23514', null, 'Invalid weight rejected: ' || t.weight)
from (values ('0'), ('150.1'), ('NaN')) t(weight);
select throws_ok($$insert into public.weight_entries (dog_id, weight_kg)
  values ('10000000-0000-4000-8000-000000000001', 10)$$, '23502', null, 'No fabricated recorded_at default');
select throws_ok($$insert into public.weight_entries (dog_id, weight_kg, recorded_at)
  values ('10000000-0000-4000-8000-000000000001', null, now())$$, '23502', null, 'Missing weight rejected');

with changed as (insert into public.health_records (dog_id, record_type, title)
  select '10000000-0000-4000-8000-000000000001', t.record_type, t.record_type
  from (values ('vaccination'), ('deworming'), ('flea_tick_control'), ('consultation'),
    ('prescription'), ('lab_result'), ('surgery'), ('other')) t(record_type)
  returning id)
select is((select count(*)::integer from changed), 8, 'All eight approved record types accepted');
select results_eq('select record_type from public.health_records order by record_type',
  array['consultation', 'deworming', 'flea_tick_control', 'lab_result', 'other',
    'prescription', 'surgery', 'vaccination'], 'Exactly the approved record types stored');
select ok((select bool_and(event_date is null and next_due_date is null and details is null)
  from public.health_records), 'Unknown dates and unspecified details remain NULL');
select throws_ok($$insert into public.health_records (dog_id, record_type, title)
  values ('10000000-0000-4000-8000-000000000001', 'unsupported', 'Fixture')$$,
  '23514', null, 'Unapproved record type rejected');
select throws_ok($$insert into public.health_records (dog_id, record_type, title)
  values ('10000000-0000-4000-8000-000000000001', null, 'Fixture')$$,
  '23502', null, 'Record type is mandatory');
select throws_ok($$insert into public.health_records (dog_id, record_type, title)
  values ('10000000-0000-4000-8000-000000000001', 'other', null)$$,
  '23502', null, 'Title is mandatory');
select throws_ok($$insert into public.health_records (dog_id, record_type, title)
  values ('10000000-0000-4000-8000-000000000001', 'other', '   ')$$,
  '23514', null, 'Empty title rejected');
with changed as (update public.health_records set event_date = '2026-10-16', next_due_date = null
  where record_type = 'consultation' returning event_date)
select is((select event_date from changed), '2026-10-16'::date, 'Event date stored without an invented time');

-- This fixture shape is not a required JSON schema or clinical recommendation.
with changed as (update public.health_records
  set details = '{"medications":[{"fixture":"a"},{"fixture":"b"}]}'::jsonb
  where record_type = 'prescription' returning details)
select is((select details from changed), '{"medications":[{"fixture":"a"},{"fixture":"b"}]}'::jsonb,
  'Multiple items in a prescription JSON are preserved without invented required fields');

insert into public.health_records (id, dog_id, record_type, title) values
  ('10000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000001', 'other', 'Linked'),
  ('10000000-0000-4000-8000-000000000004', '10000000-0000-4000-8000-000000000002', 'other', 'Second dog record');
with changed as (insert into public.attachments (id, dog_id, uploaded_by, storage_path)
  values ('10000000-0000-4000-8000-000000000005', '10000000-0000-4000-8000-000000000001', auth.uid(), 'unlinked-fixture')
  returning id, health_record_id)
select ok((select id is not null and health_record_id is null from changed), 'Attachment can have no health record');
with changed as (insert into public.attachments (id, dog_id, health_record_id, uploaded_by, storage_path)
  values ('10000000-0000-4000-8000-000000000006', '10000000-0000-4000-8000-000000000001',
    '10000000-0000-4000-8000-000000000003', auth.uid(), 'linked-fixture') returning id)
select is((select id from changed), '10000000-0000-4000-8000-000000000006'::uuid, 'Matching dog and health record accepted');
select throws_ok($$insert into public.attachments (dog_id, health_record_id, uploaded_by, storage_path)
  values ('10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000004', auth.uid(), 'mismatch-fixture')$$,
  '23503', null, 'Composite FK rejects different dogs even with the same owner');
select throws_ok($$update public.attachments set dog_id = '10000000-0000-4000-8000-000000000002'
  where id = '10000000-0000-4000-8000-000000000006'$$,
  '23503', null, 'Changing attachment dog cannot break its health record association');
select throws_ok($$update public.health_records set dog_id = '10000000-0000-4000-8000-000000000002'
  where id = '10000000-0000-4000-8000-000000000003'$$,
  '23503', null, 'Changing health record dog cannot orphan its attachment');
select throws_ok($$insert into public.attachments (dog_id, health_record_id, uploaded_by, storage_path)
  values ('10000000-0000-4000-8000-000000000001', '99999999-9999-4999-8999-999999999999', auth.uid(), 'missing-health')$$,
  '23503', null, 'Nonexistent health record rejected');
select throws_ok($$insert into public.attachments (dog_id, uploaded_by, storage_path)
  values ('10000000-0000-4000-8000-000000000002', auth.uid(), 'linked-fixture')$$,
  '23505', null, 'Duplicate storage path rejected');
select throws_ok($$insert into public.attachments (dog_id, uploaded_by, storage_path)
  values ('10000000-0000-4000-8000-000000000001', auth.uid(), null)$$,
  '23502', null, 'Missing storage path rejected');
select throws_ok($$delete from public.health_records where id = '10000000-0000-4000-8000-000000000003'$$,
  '23503', null, 'Deleting linked health record does not silently cascade');
select throws_ok($$delete from public.dogs where id = '10000000-0000-4000-8000-000000000001'$$,
  '23503', null, 'Deleting dog with children does not silently cascade');

-- Backdate technical timestamps to observe trigger behavior within one transaction.
reset role;
update public.dogs set created_at = '2020-01-01T00:00:00Z' where id = '10000000-0000-4000-8000-000000000001';
update public.health_records set created_at = '2020-01-01T00:00:00Z' where id = '10000000-0000-4000-8000-000000000003';
set local role authenticated;
with changed as (update public.dogs set name = 'Renamed', updated_at = '2020-01-01T00:00:00Z'
  where id = '10000000-0000-4000-8000-000000000001' returning created_at, updated_at)
select ok((select created_at = '2020-01-01T00:00:00Z'::timestamptz and updated_at = now() from changed),
  'Dog trigger sets updated_at and preserves created_at');
with changed as (update public.health_records set title = 'Renamed', updated_at = '2020-01-01T00:00:00Z'
  where id = '10000000-0000-4000-8000-000000000003' returning created_at, updated_at)
select ok((select created_at = '2020-01-01T00:00:00Z'::timestamptz and updated_at = now() from changed),
  'Health trigger sets updated_at and preserves created_at');

select * from finish();
rollback;
