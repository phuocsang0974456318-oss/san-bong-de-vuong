create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text not null default '',
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.booking_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  customer_name text not null,
  customer_phone text not null,
  court_type text not null check (court_type in ('5', '7')),
  booking_date date not null,
  time_slot text not null,
  notes text,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled')),
  created_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id boolean primary key default true check (id),
  hero_title text not null default 'Tìm sân bóng phù hợp. Sẵn sàng cho trận đấu.',
  hero_description text not null default 'Chọn loại sân và thời gian bạn muốn. Chúng tôi sẽ hỗ trợ bạn kiểm tra lịch và đặt sân nhanh chóng.',
  address text not null default '206/9 Trệt Trần Hưng Đạo, Phường Chợ Lớn, TP. Hồ Chí Minh',
  phone text not null default '0373860221',
  updated_at timestamptz not null default now()
);

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null check (length(trim(title)) between 1 and 150),
  excerpt text not null check (length(trim(excerpt)) between 1 and 350),
  content text not null check (length(trim(content)) between 1 and 10000),
  created_at timestamptz not null default now()
);

insert into public.site_settings (id)
values (true)
on conflict (id) do nothing;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role = 'admin'
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    lower(new.email),
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''), ''),
    'customer'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.booking_requests enable row level security;
alter table public.site_settings enable row level security;
alter table public.blog_posts enable row level security;

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
  on public.profiles for select to authenticated
  using (id = (select auth.uid()));

drop policy if exists "Admins can read all profiles" on public.profiles;
create policy "Admins can read all profiles"
  on public.profiles for select to authenticated
  using ((select public.is_admin()));

drop policy if exists "Users can update own customer profile" on public.profiles;
create policy "Users can update own customer profile"
  on public.profiles for update to authenticated
  using (id = (select auth.uid()) and role = 'customer')
  with check (id = (select auth.uid()) and role = 'customer');

drop policy if exists "Admins can update profiles" on public.profiles;
create policy "Admins can update profiles"
  on public.profiles for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

drop policy if exists "Customers can create own booking requests" on public.booking_requests;
create policy "Customers can create own booking requests"
  on public.booking_requests for insert to authenticated
  with check (
    user_id = (select auth.uid())
    and status = 'pending'
  );

drop policy if exists "Admins can create booking requests" on public.booking_requests;
create policy "Admins can create booking requests"
  on public.booking_requests for insert to authenticated
  with check (
    user_id = (select auth.uid())
    and (select public.is_admin())
  );

drop policy if exists "Users can read own bookings and admins all bookings" on public.booking_requests;
create policy "Users can read own bookings and admins all bookings"
  on public.booking_requests for select to authenticated
  using (user_id = (select auth.uid()) or (select public.is_admin()));

drop policy if exists "Admins can update booking requests" on public.booking_requests;
create policy "Admins can update booking requests"
  on public.booking_requests for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

drop policy if exists "Admins can delete booking requests" on public.booking_requests;
create policy "Admins can delete booking requests"
  on public.booking_requests for delete to authenticated
  using ((select public.is_admin()));

drop policy if exists "Anyone can read site settings" on public.site_settings;
create policy "Anyone can read site settings"
  on public.site_settings for select to anon, authenticated
  using (true);

drop policy if exists "Admins can insert site settings" on public.site_settings;
create policy "Admins can insert site settings"
  on public.site_settings for insert to authenticated
  with check ((select public.is_admin()));

drop policy if exists "Admins can update site settings" on public.site_settings;
create policy "Admins can update site settings"
  on public.site_settings for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

drop policy if exists "Anyone can read blog posts" on public.blog_posts;
create policy "Anyone can read blog posts"
  on public.blog_posts for select to anon, authenticated
  using (true);

drop policy if exists "Admins can insert blog posts" on public.blog_posts;
create policy "Admins can insert blog posts"
  on public.blog_posts for insert to authenticated
  with check ((select public.is_admin()));

drop policy if exists "Admins can update blog posts" on public.blog_posts;
create policy "Admins can update blog posts"
  on public.blog_posts for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

drop policy if exists "Admins can delete blog posts" on public.blog_posts;
create policy "Admins can delete blog posts"
  on public.blog_posts for delete to authenticated
  using ((select public.is_admin()));

grant select on public.profiles to authenticated;
grant update (full_name) on public.profiles to authenticated;
grant select, insert, update, delete on public.booking_requests to authenticated;
grant select on public.site_settings to anon, authenticated;
grant insert, update on public.site_settings to authenticated;
grant select on public.blog_posts to anon, authenticated;
grant insert, update, delete on public.blog_posts to authenticated;
