-- ============================================
-- Create Test User with Standard Plan
-- ============================================
-- This script creates a test restaurant with standard subscription plan
-- for testing the feature restrictions

-- Create test tenant with standard plan
INSERT INTO tenants (
  slug,
  business_name,
  owner_name,
  owner_email,
  password_hash,
  subscription_status,
  subscription_plan,
  subscription_start_date,
  subscription_end_date,
  is_active
) VALUES (
  'standard-test-restaurant',
  'Standart Test Restaurant',
  'Test Owner',
  'standard@test.com',
  '$2a$10$test.hash.for.testing.only.here.dummy',  -- Dummy hash, use real Supabase auth
  'active',
  'standard',
  NOW(),
  NOW() + INTERVAL '30 days',
  true
) ON CONFLICT (slug) DO UPDATE SET
  subscription_plan = 'standard',
  subscription_status = 'active',
  subscription_end_date = NOW() + INTERVAL '30 days';

-- Get the tenant ID
DO $$
DECLARE
  test_tenant_id UUID;
BEGIN
  SELECT id INTO test_tenant_id FROM tenants WHERE slug = 'standard-test-restaurant';

  -- Create some sample categories for testing
  INSERT INTO categories (tenant_id, name, image, display_order) VALUES
    (test_tenant_id, 'Ana Yemekler', '', 1),
    (test_tenant_id, 'İçecekler', '', 2),
    (test_tenant_id, 'Tatlılar', '', 3)
  ON CONFLICT DO NOTHING;

  -- Create some sample products
  INSERT INTO products (tenant_id, name, description, price, image, display_order, category_id)
  SELECT
    test_tenant_id,
    'Test Ürün ' || i,
    'Test açıklaması ' || i,
    50.00 + (i * 10),
    '',
    i,
    (SELECT id FROM categories WHERE tenant_id = test_tenant_id LIMIT 1)
  FROM generate_series(1, 5) AS i
  ON CONFLICT DO NOTHING;

  RAISE NOTICE '✓ Standard plan test user created successfully!';
  RAISE NOTICE '  Slug: standard-test-restaurant';
  RAISE NOTICE '  Email: standard@test.com';
  RAISE NOTICE '  Plan: standard (active)';
  RAISE NOTICE '  Categories: 3 created';
  RAISE NOTICE '  Products: 5 created';
  RAISE NOTICE '';
  RAISE NOTICE 'Test Instructions:';
  RAISE NOTICE '1. Create a Supabase auth user with email: standard@test.com';
  RAISE NOTICE '2. Update the tenant auth_user_id with the new user ID';
  RAISE NOTICE '3. Login to /admin with this user';
  RAISE NOTICE '4. Try to access Orders, Waiter Calls, or QR Code tabs';
  RAISE NOTICE '5. You should see the upgrade dialog';
END $$;
