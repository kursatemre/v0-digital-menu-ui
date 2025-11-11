-- Fix settings table for multi-tenant support
-- Add tenant_id column
ALTER TABLE settings ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;

-- Drop the old UNIQUE constraint on key alone
ALTER TABLE settings DROP CONSTRAINT IF EXISTS settings_key_key;

-- Create a new UNIQUE constraint on (tenant_id, key) combination
-- This allows multiple tenants to have the same key, but each tenant can only have one record per key
ALTER TABLE settings ADD CONSTRAINT settings_tenant_key_unique UNIQUE (tenant_id, key);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_settings_tenant_id ON settings(tenant_id);
CREATE INDEX IF NOT EXISTS idx_settings_tenant_key ON settings(tenant_id, key);

-- Update RLS policies
DROP POLICY IF EXISTS "Allow public to read settings" ON settings;
DROP POLICY IF EXISTS "Allow public to update settings" ON settings;
DROP POLICY IF EXISTS "Allow public to insert settings" ON settings;

-- New tenant-aware policies
CREATE POLICY "Public can read all settings"
  ON settings FOR SELECT
  USING (true);

CREATE POLICY "Public can insert settings"
  ON settings FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public can update settings"
  ON settings FOR UPDATE
  USING (true);

CREATE POLICY "Public can delete settings"
  ON settings FOR DELETE
  USING (true);

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Settings table updated successfully for multi-tenant support!';
  RAISE NOTICE 'Now settings are unique per (tenant_id, key) combination';
END $$;
