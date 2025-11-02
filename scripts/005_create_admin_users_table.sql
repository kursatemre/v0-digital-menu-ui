-- Create admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  display_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default admin user (password: admin123)
-- Note: In production, use proper password hashing
INSERT INTO admin_users (username, password_hash, display_name)
VALUES ('admin', 'admin123', 'Administrator')
ON CONFLICT (username) DO NOTHING;

-- Add RLS policies
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Allow public read access (for login)
CREATE POLICY "Public read access for admin users" ON admin_users
  FOR SELECT
  USING (true);

-- Allow public insert (for creating new users via admin panel)
CREATE POLICY "Public insert access for admin users" ON admin_users
  FOR INSERT
  WITH CHECK (true);

-- Allow public update (for password changes)
CREATE POLICY "Public update access for admin users" ON admin_users
  FOR UPDATE
  USING (true);

-- Allow public delete (for user management)
CREATE POLICY "Public delete access for admin users" ON admin_users
  FOR DELETE
  USING (true);
