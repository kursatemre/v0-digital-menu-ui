-- Add user roles to admin_users table
-- Roles: admin, garson, kasa, mutfak

-- Add role column
ALTER TABLE admin_users
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'admin';

-- Add check constraint for valid roles
ALTER TABLE admin_users
DROP CONSTRAINT IF EXISTS admin_users_role_check;

ALTER TABLE admin_users
ADD CONSTRAINT admin_users_role_check
CHECK (role IN ('admin', 'garson', 'kasa', 'mutfak'));

-- Update existing users to admin role
UPDATE admin_users
SET role = 'admin'
WHERE role IS NULL;

-- Create index for role queries
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users(role);

-- Comments for roles:
-- admin: Full access to all features
-- garson: Orders and waiter calls only
-- kasa: Orders, reports, products (cash register role)
-- mutfak: Orders only (kitchen role)

COMMENT ON COLUMN admin_users.role IS 'User role: admin (full), garson (waiter), kasa (cashier), mutfak (kitchen)';
