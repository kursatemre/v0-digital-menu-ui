-- Platform Ayarları Tablosu
create table platform_settings (
  id text primary key,
  settings jsonb not null default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Varsayılan ayarları ekle
insert into platform_settings (id, settings) values (
  'global',
  '{
    "logo": "",
    "favicon": "",
    "site_title": "MenuMGO - Dijital Menü Çözümü",
    "site_description": "MenuMGO ile dijital menünüzü oluşturun, QR kodla müşterilerinize ulaşın.",
    "meta_keywords": ["dijital menü", "qr menü", "restoran menüsü", "cafe menüsü"],
    "google_verification": ""
  }'::jsonb
);