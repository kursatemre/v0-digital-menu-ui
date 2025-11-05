create table public.platform_settings (
  id uuid default uuid_generate_v4() primary key,
  logo text,
  favicon text,
  site_title text not null default 'MenuMGO - Dijital Menü Çözümü',
  site_description text not null default 'MenuMGO ile dijital menünüzü oluşturun, QR kodla müşterilerinize ulaşın.',
  meta_keywords text[] not null default '{"dijital menü", "qr menü", "restoran menüsü", "cafe menüsü"}',
  google_verification text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- RLS politikalarını ekle
alter table public.platform_settings enable row level security;

-- Süper adminlere tam yetki ver
create policy "Süper adminler platform ayarlarını yönetebilir"
  on platform_settings
  as permissive
  for all
  to authenticated
  using (
    -- Sadece süper admin rolündeki kullanıcılar
    exists (
      select 1 from auth.users
      where auth.users.id = auth.uid() and raw_user_meta_data->>'role' = 'super_admin'
    )
  )
  with check (
    exists (
      select 1 from auth.users
      where auth.users.id = auth.uid() and raw_user_meta_data->>'role' = 'super_admin'
    )
  );

-- Varsayılan platform ayarlarını ekle
insert into public.platform_settings (
  site_title,
  site_description,
  meta_keywords,
  google_verification
) values (
  'MenuMGO - Dijital Menü Çözümü',
  'MenuMGO ile dijital menünüzü oluşturun, QR kodla müşterilerinize ulaşın.',
  '{
    "dijital menü",
    "qr menü",
    "restoran menüsü",
    "cafe menüsü",
    "online menü",
    "restoran qr kod",
    "dijital sipariş sistemi"
  }',
  null
);