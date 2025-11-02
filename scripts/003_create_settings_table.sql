-- Create settings table for restaurant configuration
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Allow public to read settings
CREATE POLICY "Allow public to read settings" ON settings
  FOR SELECT USING (true);

-- Allow public to update settings
CREATE POLICY "Allow public to update settings" ON settings
  FOR UPDATE USING (true);

-- Allow public to insert settings
CREATE POLICY "Allow public to insert settings" ON settings
  FOR INSERT WITH CHECK (true);
