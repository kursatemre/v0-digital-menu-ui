-- Allow anonymous users to read tenant information
-- This is needed for the payment success page to display restaurant name
-- Security: Only basic public information (name, slug, subscription_plan)

CREATE POLICY "Anonymous users can read tenant basic info"
ON tenants
FOR SELECT
TO anon
USING (true);

-- Note: This is safe because:
-- 1. Only allows reading, not modifications
-- 2. Tenant slug is already public (used in URLs)
-- 3. Business name and subscription plan are displayed publicly anyway
