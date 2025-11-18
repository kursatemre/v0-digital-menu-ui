-- ============================================
-- QUICK TEST: Standard Plan Restrictions
-- ============================================
-- This script helps you quickly test the standard plan implementation

-- Step 1: Add standard to subscription_plan enum
SELECT 'Step 1: Adding standard plan to enum...' as status;

ALTER TABLE tenants
DROP CONSTRAINT IF EXISTS check_subscription_plan;

ALTER TABLE tenants
ADD CONSTRAINT check_subscription_plan
CHECK (subscription_plan IN ('trial', 'standard', 'premium'));

SELECT '✓ Standard plan added to enum' as status;

-- Step 2: Show current subscription plans
SELECT 'Step 2: Current subscription plans:' as status;

SELECT
  subscription_plan,
  COUNT(*) as tenant_count,
  ARRAY_AGG(slug) as slugs
FROM tenants
GROUP BY subscription_plan
ORDER BY subscription_plan;

-- Step 3: Find a tenant to convert to standard
SELECT 'Step 3: Finding tenants to test with...' as status;

SELECT
  id,
  slug,
  business_name,
  subscription_plan,
  subscription_status
FROM tenants
WHERE subscription_plan IN ('trial', 'premium')
LIMIT 5;

-- Step 4: Instructions for manual testing
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'STANDARD PLAN TEST INSTRUCTIONS';
  RAISE NOTICE '========================================';
  RAISE NOTICE '';
  RAISE NOTICE 'To convert a tenant to standard plan, run:';
  RAISE NOTICE '';
  RAISE NOTICE '  UPDATE tenants';
  RAISE NOTICE '  SET subscription_plan = ''standard'',';
  RAISE NOTICE '      subscription_status = ''active'',';
  RAISE NOTICE '      subscription_end_date = NOW() + INTERVAL ''30 days''';
  RAISE NOTICE '  WHERE slug = ''YOUR_SLUG_HERE'';';
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'EXPECTED BEHAVIOR';
  RAISE NOTICE '========================================';
  RAISE NOTICE '';
  RAISE NOTICE 'When logged in as standard plan user:';
  RAISE NOTICE '';
  RAISE NOTICE '✓ ALLOWED:';
  RAISE NOTICE '  - Products management';
  RAISE NOTICE '  - Categories management';
  RAISE NOTICE '  - Appearance settings';
  RAISE NOTICE '  - Admin settings';
  RAISE NOTICE '';
  RAISE NOTICE '✗ RESTRICTED (show upgrade dialog):';
  RAISE NOTICE '  - Orders management';
  RAISE NOTICE '  - Waiter calls';
  RAISE NOTICE '  - QR code generation';
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'PAYMENT PAGE';
  RAISE NOTICE '========================================';
  RAISE NOTICE '';
  RAISE NOTICE 'Should show 3 plan options:';
  RAISE NOTICE '  1. Standard (50% of premium)';
  RAISE NOTICE '  2. Premium Monthly (first month 50% off)';
  RAISE NOTICE '  3. Premium Yearly (2 months free)';
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
END $$;

-- Step 5: Verify constraint
SELECT 'Step 5: Verifying constraint...' as status;

SELECT
  conname as constraint_name,
  pg_get_constraintdef(oid) as definition
FROM pg_constraint
WHERE conname = 'check_subscription_plan';

SELECT '✓ Test script completed!' as status;
