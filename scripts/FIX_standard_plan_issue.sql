-- =============================================
-- ACIL FIX: Standard Plan Sorunu Düzeltme
-- =============================================
-- Bu script yeni kayıtların düzgün çalışması için gerekli

-- 1. Önce constraint'i ekle (eğer yoksa)
ALTER TABLE tenants
DROP CONSTRAINT IF EXISTS check_subscription_plan;

ALTER TABLE tenants
ADD CONSTRAINT check_subscription_plan
CHECK (subscription_plan IN ('trial', 'standard', 'premium'));

-- 2. Yeni kayıtları kontrol et ve düzelt
SELECT
  id,
  slug,
  business_name,
  subscription_plan,
  subscription_status,
  created_at
FROM tenants
ORDER BY created_at DESC
LIMIT 10;

-- 3. Eğer yeni kayıtlar 'trial' veya başka bir şey ise, standart'a çevir
-- NOT: Bu sadece bugün oluşturulan kayıtlar için
UPDATE tenants
SET
  subscription_plan = 'standard',
  subscription_status = 'active',
  trial_end_date = NULL,
  subscription_end_date = NULL
WHERE
  created_at >= CURRENT_DATE
  AND subscription_plan != 'standard'
  AND subscription_plan != 'premium';

-- 4. Düzeltilen kayıtları göster
SELECT
  id,
  slug,
  business_name,
  subscription_plan,
  subscription_status,
  'UPDATED TO STANDARD' as note
FROM tenants
WHERE created_at >= CURRENT_DATE;

-- 5. Verification
DO $$
BEGIN
  RAISE NOTICE '=============================================';
  RAISE NOTICE 'Standard Plan Fix Completed!';
  RAISE NOTICE '=============================================';
  RAISE NOTICE '';
  RAISE NOTICE 'Next Steps:';
  RAISE NOTICE '1. Check the output above';
  RAISE NOTICE '2. Logout from admin panel';
  RAISE NOTICE '3. Login again';
  RAISE NOTICE '4. You should now see standard plan restrictions';
  RAISE NOTICE '';
  RAISE NOTICE 'Standard Plan = FREE (no restrictions)';
  RAISE NOTICE 'Premium = PAID (all features)';
END $$;
