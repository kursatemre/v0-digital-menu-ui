-- Create super_admins table for platform administrators
CREATE TABLE IF NOT EXISTS super_admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_super_admins_username ON super_admins(username);
CREATE INDEX IF NOT EXISTS idx_super_admins_email ON super_admins(email);

-- Insert default super admin (you should change this password immediately after first login!)
-- Default username: superadmin
-- Default password: changeme123!
-- Password hash for 'changeme123!' (you should update this with your own secure password)
INSERT INTO super_admins (username, password_hash, email, full_name)
VALUES (
  'superadmin',
  '$2a$10$YourHashHere', -- This needs to be replaced with actual bcrypt hash
  'admin@menumgo.com',
  'Super Administrator'
) ON CONFLICT (username) DO NOTHING;

COMMENT ON TABLE super_admins IS 'Platform super administrators who can manage all tenants';
