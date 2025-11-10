-- Add tenant_id to waiter_calls table for multi-tenant support
-- (This may already exist from the SaaS architecture migration)
ALTER TABLE waiter_calls ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;

-- Create an index on tenant_id for faster queries
CREATE INDEX IF NOT EXISTS idx_waiter_calls_tenant_id ON waiter_calls(tenant_id);

-- Update the RLS policy to be tenant-aware
DROP POLICY IF EXISTS "Enable all operations for waiter_calls" ON waiter_calls;

-- Create a permissive policy for all operations
-- This allows both public (customers) to create calls and admins to manage them
CREATE POLICY "Enable all operations for waiter_calls" ON waiter_calls
  FOR ALL
  USING (true)
  WITH CHECK (true);
