-- ============================================
-- Add 'standard' Subscription Plan
-- ============================================
-- This migration adds the 'standard' plan to the subscription system
-- Standard plan restrictions:
-- - No order management
-- - No waiter calls
-- - No QR code generation

-- 1. Drop existing check constraint
ALTER TABLE tenants
DROP CONSTRAINT IF EXISTS check_subscription_plan;

-- 2. Add new check constraint with 'standard' plan
ALTER TABLE tenants
ADD CONSTRAINT check_subscription_plan
CHECK (subscription_plan IN ('trial', 'standard', 'premium'));

-- 3. Update comment
COMMENT ON COLUMN tenants.subscription_plan IS 'Subscription plan type: trial, standard, or premium. Always set, never NULL.';

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Standard subscription plan added successfully!';
  RAISE NOTICE 'Available plans: trial, standard, premium';
  RAISE NOTICE 'Standard plan restrictions apply to: orders, waiter_calls, qr code generation';
END $$;
