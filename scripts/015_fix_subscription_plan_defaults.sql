-- Fix subscription_plan NULL values and set proper defaults
-- This migration ensures all tenants have a subscription_plan value

-- 1. First, update ALL subscription_plan values to be either 'trial' or 'premium'
-- This includes NULL values and any other unexpected values
UPDATE tenants
SET subscription_plan = CASE
  WHEN subscription_status = 'active' THEN 'premium'
  WHEN subscription_status = 'cancelled' THEN 'premium'
  WHEN subscription_status = 'expired' THEN 'trial'
  ELSE 'trial'  -- Default to trial for 'trial' status and any other cases
END
WHERE subscription_plan IS NULL
   OR subscription_plan NOT IN ('trial', 'premium');

-- 2. Set default value for future inserts
ALTER TABLE tenants
ALTER COLUMN subscription_plan SET DEFAULT 'trial';

-- 3. Add NOT NULL constraint (now that we've fixed existing data)
ALTER TABLE tenants
ALTER COLUMN subscription_plan SET NOT NULL;

-- 4. Add check constraint to ensure valid values
ALTER TABLE tenants
DROP CONSTRAINT IF EXISTS check_subscription_plan;

ALTER TABLE tenants
ADD CONSTRAINT check_subscription_plan
CHECK (subscription_plan IN ('trial', 'premium'));

-- Success message
COMMENT ON COLUMN tenants.subscription_plan IS 'Subscription plan type: trial or premium. Always set, never NULL.';
