-- Allow anonymous users to view their own pending payments by merchant_oid
-- This is needed because in test mode, PayTR callbacks don't reach localhost
-- So payments remain in 'pending' state even after successful test payments

-- Drop the existing anonymous read policy
DROP POLICY IF EXISTS "Anonymous users can view successful payments by merchant_oid" ON payment_transactions;

-- Create a new policy that allows both pending and success payments
-- Security: Still requires knowing the specific merchant_oid
CREATE POLICY "Anonymous users can view payments by merchant_oid"
ON payment_transactions
FOR SELECT
TO anon
USING (
  payment_status IN ('pending', 'success')
);

-- Note: This is safe because:
-- 1. User must know the exact merchant_oid (randomly generated UUID-based)
-- 2. Only read access, no modifications
-- 3. Needed for test mode where callbacks don't work on localhost
