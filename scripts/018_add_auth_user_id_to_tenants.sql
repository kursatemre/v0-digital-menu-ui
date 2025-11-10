-- Add auth_user_id column to tenants table for Supabase Auth integration
-- This links each tenant to their Supabase Auth user for email verification

-- Add auth_user_id column
ALTER TABLE tenants
ADD COLUMN IF NOT EXISTS auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add unique constraint to ensure one tenant per auth user
ALTER TABLE tenants
ADD CONSTRAINT unique_auth_user_id UNIQUE (auth_user_id);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_tenants_auth_user_id ON tenants(auth_user_id);

COMMENT ON COLUMN tenants.auth_user_id IS 'Reference to Supabase Auth user - used for email verification and authentication';
