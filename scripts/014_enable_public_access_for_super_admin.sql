-- Disable RLS for super admin operations (temporary solution)
-- In production, you should create proper RLS policies for super_admins table

-- Allow public access to tenants table for super admin panel
-- WARNING: This is for development/demo purposes
-- In production, implement proper authentication and RLS policies

-- Check if RLS is enabled
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE landing_page_content ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations (you should restrict this in production)
-- For tenants table
DROP POLICY IF EXISTS "Allow public read access to tenants" ON tenants;
CREATE POLICY "Allow public read access to tenants"
  ON tenants FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow public update access to tenants" ON tenants;
CREATE POLICY "Allow public update access to tenants"
  ON tenants FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- For landing_page_content table
DROP POLICY IF EXISTS "Allow public read access to landing_page_content" ON landing_page_content;
CREATE POLICY "Allow public read access to landing_page_content"
  ON landing_page_content FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow public update access to landing_page_content" ON landing_page_content;
CREATE POLICY "Allow public update access to landing_page_content"
  ON landing_page_content FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- IMPORTANT SECURITY NOTE:
-- These policies allow anyone to read and update the tables.
-- In a production environment, you MUST implement proper authentication:
-- 1. Create a Supabase Auth integration
-- 2. Store super_admin users in auth.users
-- 3. Create RLS policies that check auth.uid()
-- 4. Restrict access to authenticated super admins only

COMMENT ON TABLE tenants IS 'SECURITY WARNING: Public access enabled for demo. Implement proper RLS in production!';
COMMENT ON TABLE landing_page_content IS 'SECURITY WARNING: Public access enabled for demo. Implement proper RLS in production!';
