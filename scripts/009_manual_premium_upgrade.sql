-- ============================================
-- Manuel Premium Upgrade Tool
-- ============================================
-- Ödeme altyapısı olmadığı için manuel olarak
-- restoran premium'a yükseltilebilir.

-- KULLANIM:
-- 1. Aşağıdaki fonksiyonu çalıştır
-- 2. Sonra upgrade_to_premium('slug-adi', ay_sayisi) çağır

-- Fonksiyon: Tenant'ı premium'a yükselt
CREATE OR REPLACE FUNCTION upgrade_to_premium(
  tenant_slug TEXT,
  months INTEGER DEFAULT 1
)
RETURNS TEXT AS $$
DECLARE
  tenant_record RECORD;
  new_end_date TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Tenant'ı bul
  SELECT * INTO tenant_record
  FROM tenants
  WHERE slug = tenant_slug;

  -- Tenant bulunamadıysa hata
  IF NOT FOUND THEN
    RETURN 'HATA: ' || tenant_slug || ' bulunamadı!';
  END IF;

  -- Yeni bitiş tarihini hesapla
  new_end_date := NOW() + (months || ' months')::INTERVAL;

  -- Tenant'ı güncelle
  UPDATE tenants
  SET
    subscription_status = 'active',
    subscription_plan = 'premium',
    subscription_start_date = NOW(),
    subscription_end_date = new_end_date,
    trial_end_date = NOW(), -- Trial'ı bitir
    updated_at = NOW()
  WHERE slug = tenant_slug;

  RETURN 'BAŞARILI: ' || tenant_record.business_name || ' (' || tenant_slug || ') premium oldu! Bitiş: ' || new_end_date::DATE;
END;
$$ LANGUAGE plpgsql;

-- Fonksiyon: Trial süresini uzat
CREATE OR REPLACE FUNCTION extend_trial(
  tenant_slug TEXT,
  days INTEGER DEFAULT 7
)
RETURNS TEXT AS $$
DECLARE
  tenant_record RECORD;
  new_trial_end TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Tenant'ı bul
  SELECT * INTO tenant_record
  FROM tenants
  WHERE slug = tenant_slug;

  IF NOT FOUND THEN
    RETURN 'HATA: ' || tenant_slug || ' bulunamadı!';
  END IF;

  -- Mevcut trial'dan devam et veya şimdiden başlat
  IF tenant_record.trial_end_date > NOW() THEN
    new_trial_end := tenant_record.trial_end_date + (days || ' days')::INTERVAL;
  ELSE
    new_trial_end := NOW() + (days || ' days')::INTERVAL;
  END IF;

  UPDATE tenants
  SET
    trial_end_date = new_trial_end,
    subscription_status = 'trial',
    updated_at = NOW()
  WHERE slug = tenant_slug;

  RETURN 'BAŞARILI: ' || tenant_record.business_name || ' trial uzatıldı! Yeni bitiş: ' || new_trial_end::DATE;
END;
$$ LANGUAGE plpgsql;

-- Fonksiyon: Subscription'ı iptal et
CREATE OR REPLACE FUNCTION cancel_subscription(tenant_slug TEXT)
RETURNS TEXT AS $$
DECLARE
  tenant_record RECORD;
BEGIN
  SELECT * INTO tenant_record
  FROM tenants
  WHERE slug = tenant_slug;

  IF NOT FOUND THEN
    RETURN 'HATA: ' || tenant_slug || ' bulunamadı!';
  END IF;

  UPDATE tenants
  SET
    subscription_status = 'cancelled',
    updated_at = NOW()
  WHERE slug = tenant_slug;

  RETURN 'BAŞARILI: ' || tenant_record.business_name || ' subscription iptal edildi.';
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- KULLANIM ÖRNEKLERİ:
-- ============================================

-- 1. Bir restoran 1 ay premium yap:
-- SELECT upgrade_to_premium('test-restaurant', 1);

-- 2. Bir restoran 12 ay premium yap:
-- SELECT upgrade_to_premium('kursat', 12);

-- 3. Trial süresini 7 gün uzat:
-- SELECT extend_trial('test-restaurant', 7);

-- 4. Subscription iptal et:
-- SELECT cancel_subscription('test-restaurant');

-- ============================================
-- TÜM TENANT'LARI GÖRÜNTÜLE:
-- ============================================
SELECT
  slug,
  business_name,
  subscription_status,
  CASE
    WHEN subscription_status = 'trial' THEN
      'Kalan: ' || EXTRACT(DAY FROM (trial_end_date - NOW()))::TEXT || ' gün'
    WHEN subscription_status = 'active' THEN
      'Bitiş: ' || subscription_end_date::DATE::TEXT
    ELSE subscription_status
  END as durum,
  created_at::DATE as kayit_tarihi
FROM tenants
ORDER BY created_at DESC;

-- Başarılı mesajı
DO $$
BEGIN
  RAISE NOTICE '✅ Premium upgrade fonksiyonları oluşturuldu!';
  RAISE NOTICE '📝 Kullanım: SELECT upgrade_to_premium(''slug-adi'', 12);';
END $$;
