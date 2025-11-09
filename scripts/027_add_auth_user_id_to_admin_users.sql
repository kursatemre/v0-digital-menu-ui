-- Add auth_user_id to admin_users table for Supabase Auth integration
-- This allows admin users to authenticate via Supabase Auth instead of plain text passwords

-- Add auth_user_id column
ALTER TABLE admin_users
ADD COLUMN IF NOT EXISTS auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_admin_users_auth_user_id ON admin_users(auth_user_id);

-- Make password_hash nullable since it won't be used with Supabase Auth
ALTER TABLE admin_users
ALTER COLUMN password_hash DROP NOT NULL;

COMMENT ON COLUMN admin_users.auth_user_id IS 'Reference to Supabase Auth user - used for secure authentication';
COMMENT ON COLUMN admin_users.password_hash IS 'Deprecated - kept for backward compatibility, use Supabase Auth instead';
