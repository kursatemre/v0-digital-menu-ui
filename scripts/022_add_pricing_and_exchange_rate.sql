-- Platform ayarlarına döviz kuru ve fiyatlandırma alanları ekle
alter table public.platform_settings
add column if not exists usd_to_try_rate numeric(10, 4) default 34.50,
add column if not exists premium_price_usd numeric(10, 2) default 9.99,
add column if not exists last_rate_update timestamptz default now();

-- Mevcut kaydı güncelle
update public.platform_settings
set 
  usd_to_try_rate = 34.50,
  premium_price_usd = 9.99,
  last_rate_update = now()
where id is not null;

-- Trigger: updated_at otomatik güncelleme
create or replace function update_platform_settings_timestamp()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists platform_settings_updated_at on public.platform_settings;
create trigger platform_settings_updated_at
  before update on public.platform_settings
  for each row
  execute function update_platform_settings_timestamp();

-- Döviz kuru değişikliğinde last_rate_update güncelleme
create or replace function update_exchange_rate_timestamp()
returns trigger as $$
begin
  if new.usd_to_try_rate is distinct from old.usd_to_try_rate then
    new.last_rate_update = now();
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists exchange_rate_updated on public.platform_settings;
create trigger exchange_rate_updated
  before update on public.platform_settings
  for each row
  execute function update_exchange_rate_timestamp();

-- View: Hesaplanmış TL fiyatları
create or replace view public.pricing_view as
select 
  id,
  premium_price_usd,
  usd_to_try_rate,
  round(premium_price_usd * usd_to_try_rate, 2) as premium_price_try,
  last_rate_update,
  created_at,
  updated_at
from public.platform_settings;

-- Public read access for pricing view
grant select on public.pricing_view to anon, authenticated;
