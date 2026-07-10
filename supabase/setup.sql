-- Run this in Supabase: SQL Editor > New query > paste > Run.
-- It keeps public booking creation, restricts the full job list to authenticated staff,
-- and exposes a limited secure tracking lookup requiring job number + mobile number.

alter table public.bookings enable row level security;

-- Add the expanded statuses if your table currently has a restrictive status check.
do $$
declare r record;
begin
  for r in
    select conname from pg_constraint
    where conrelid='public.bookings'::regclass and contype='c'
      and pg_get_constraintdef(oid) ilike '%status%'
  loop
    execute format('alter table public.bookings drop constraint %I',r.conname);
  end loop;
end $$;

alter table public.bookings
  add constraint bookings_status_check check (status in (
    'booking-requested','booking-confirmed','vehicle-received','diagnosis',
    'awaiting-approval','parts-ordered','repair-in-progress','quality-check',
    'ready','collected','cancelled'
  ));

drop policy if exists "Public can read bookings" on public.bookings;
drop policy if exists "Public can insert bookings" on public.bookings;
drop policy if exists "Public can update bookings" on public.bookings;
drop policy if exists "Public can delete bookings" on public.bookings;
drop policy if exists "anon_insert_booking_request" on public.bookings;
drop policy if exists "staff_read_bookings" on public.bookings;
drop policy if exists "staff_update_bookings" on public.bookings;
drop policy if exists "staff_delete_bookings" on public.bookings;

create policy "anon_insert_booking_request"
on public.bookings for insert to anon
with check (
  status='booking-requested'
  and est_cost is null and actual_cost is null and parts_cost is null
);

create policy "staff_read_bookings"
on public.bookings for select to authenticated
using (true);

create policy "staff_update_bookings"
on public.bookings for update to authenticated
using (true) with check (true);

create policy "staff_delete_bookings"
on public.bookings for delete to authenticated
using (true);

create or replace function public.track_booking(p_job_id text,p_phone text)
returns table(
  id text, car_make text, plate text, service text, preferred_date date,
  status text, est_cost numeric, actual_cost numeric, deadline date
)
language sql
security definer
stable
set search_path=public
as $$
  select b.id,b.car_make,b.plate,b.service,b.preferred_date,b.status,
         b.est_cost,b.actual_cost,b.deadline
  from public.bookings b
  where upper(b.id)=upper(trim(p_job_id))
    and regexp_replace(coalesce(b.phone,''),'[^0-9]','','g')=
        regexp_replace(coalesce(p_phone,''),'[^0-9]','','g')
  limit 1;
$$;

revoke all on function public.track_booking(text,text) from public;
grant execute on function public.track_booking(text,text) to anon,authenticated;
