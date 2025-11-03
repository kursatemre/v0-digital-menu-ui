-- ============================================
-- SaaS Multi-Tenant Architecture Migration
-- ============================================

-- 1. Create tenants (restaurants) table
CREATE TABLE IF NOT EXISTS tenants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL, -- URL slug: /lezzetkulesi
  business_name TEXT NOT NULL,
  owner_name TEXT NOT NULL,
  owner_email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,

  -- Trial and subscription
  trial_start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  trial_end_date TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '3 days'),
  subscription_status TEXT DEFAULT 'trial' CHECK (subscription_status IN ('trial', 'active', 'expired', 'cancelled')),
  subscription_plan TEXT, -- 'basic', 'premium', etc.
  subscription_start_date TIMESTAMP WITH TIME ZONE,
  subscription_end_date TIMESTAMP WITH TIME ZONE,

  -- Metadata
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_tenants_slug ON tenants(slug);
CREATE INDEX IF NOT EXISTS idx_tenants_email ON tenants(owner_email);
CREATE INDEX IF NOT EXISTS idx_tenants_status ON tenants(subscription_status);
CREATE INDEX IF NOT EXISTS idx_tenants_trial_end ON tenants(trial_end_date);

-- 3. Enable RLS
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies for tenants
CREATE POLICY "Public can read active tenants" ON tenants
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Public can insert tenants (registration)" ON tenants
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Tenants can update own data" ON tenants
  FOR UPDATE
  USING (true);

-- 5. Add tenant_id to existing tables
ALTER TABLE categories ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;
ALTER TABLE products ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;
ALTER TABLE waiter_calls ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;

-- 6. Create indexes on tenant_id for performance
CREATE INDEX IF NOT EXISTS idx_categories_tenant ON categories(tenant_id);
CREATE INDEX IF NOT EXISTS idx_products_tenant ON products(tenant_id);
CREATE INDEX IF NOT EXISTS idx_orders_tenant ON orders(tenant_id);
CREATE INDEX IF NOT EXISTS idx_waiter_calls_tenant ON waiter_calls(tenant_id);
CREATE INDEX IF NOT EXISTS idx_settings_tenant ON settings(tenant_id);
CREATE INDEX IF NOT EXISTS idx_admin_users_tenant ON admin_users(tenant_id);

-- 7. Update RLS policies to be tenant-aware
-- Drop old policies
DROP POLICY IF EXISTS "Allow public to read categories" ON categories;
DROP POLICY IF EXISTS "Allow public to create categories" ON categories;
DROP POLICY IF EXISTS "Allow public to update categories" ON categories;
DROP POLICY IF EXISTS "Allow public to delete categories" ON categories;

DROP POLICY IF EXISTS "Allow public to read products" ON products;
DROP POLICY IF EXISTS "Allow public to create products" ON products;
DROP POLICY IF EXISTS "Allow public to update products" ON products;
DROP POLICY IF EXISTS "Allow public to delete products" ON products;

-- New tenant-aware policies (temporarily permissive for ease of use)
CREATE POLICY "Tenants can read own categories" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Tenants can manage own categories" ON categories
  FOR ALL USING (true);

CREATE POLICY "Tenants can read own products" ON products
  FOR SELECT USING (true);

CREATE POLICY "Tenants can manage own products" ON products
  FOR ALL USING (true);

-- 8. Create function to check trial status
CREATE OR REPLACE FUNCTION is_trial_active(tenant_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM tenants
    WHERE id = tenant_uuid
    AND (
      (subscription_status = 'trial' AND trial_end_date > NOW())
      OR subscription_status = 'active'
    )
    AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Create function to get tenant by slug
CREATE OR REPLACE FUNCTION get_tenant_by_slug(slug_param TEXT)
RETURNS TABLE (
  id UUID,
  slug TEXT,
  business_name TEXT,
  subscription_status TEXT,
  trial_end_date TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT t.id, t.slug, t.business_name, t.subscription_status, t.trial_end_date, t.is_active
  FROM tenants t
  WHERE t.slug = slug_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. Create trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_tenants_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_tenants_updated_at
  BEFORE UPDATE ON tenants
  FOR EACH ROW
  EXECUTE FUNCTION update_tenants_updated_at();

-- 11. Create sample tenant for testing (optional)
INSERT INTO tenants (
  slug,
  business_name,
  owner_name,
  owner_email,
  password_hash,
  subscription_status
) VALUES (
  'demo-restaurant',
  'Demo Restaurant',
  'Demo Owner',
  'demo@example.com',
  'demo123',
  'trial'
) ON CONFLICT (slug) DO NOTHING;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'SaaS architecture created successfully!';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '1. Update application code to use tenant_id';
  RAISE NOTICE '2. Create landing page';
  RAISE NOTICE '3. Implement registration flow';
  RAISE NOTICE '4. Add trial expiration checks';
END $$;
