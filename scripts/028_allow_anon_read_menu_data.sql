-- Allow anonymous read access to menu data for TV display mode
-- This is safe because:
-- 1. Only public-facing menu data is exposed
-- 2. No sensitive information (payments, admin data) is accessible
-- 3. RLS still protects write operations

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow anonymous read access to tenants" ON tenants;
DROP POLICY IF EXISTS "Allow anonymous read access to settings" ON settings;
DROP POLICY IF EXISTS "Allow anonymous read access to categories" ON categories;
DROP POLICY IF EXISTS "Allow anonymous read access to products" ON products;

-- Allow anonymous users to read tenants (needed to find restaurant by slug)
CREATE POLICY "Allow anonymous read access to tenants"
ON tenants FOR SELECT
TO anon
USING (true);

-- Allow anonymous users to read settings (restaurant name, logo, currency)
CREATE POLICY "Allow anonymous read access to settings"
ON settings FOR SELECT
TO anon
USING (true);

-- Allow anonymous users to read categories
CREATE POLICY "Allow anonymous read access to categories"
ON categories FOR SELECT
TO anon
USING (true);

-- Allow anonymous users to read available products
CREATE POLICY "Allow anonymous read access to products"
ON products FOR SELECT
TO anon
USING (is_available = true);

COMMENT ON POLICY "Allow anonymous read access to tenants" ON tenants IS 'TV display mode and public menu pages need to find restaurants by slug';
COMMENT ON POLICY "Allow anonymous read access to settings" ON settings IS 'TV display mode needs restaurant branding information';
COMMENT ON POLICY "Allow anonymous read access to categories" ON categories IS 'TV display mode needs category structure';
COMMENT ON POLICY "Allow anonymous read access to products" ON products IS 'TV display mode needs product information (only available items)';
