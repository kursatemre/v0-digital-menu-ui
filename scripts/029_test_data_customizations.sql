-- Test Data for Product Customizations
-- This script creates sample customization groups, options, variants and assigns them to products

-- First, you need to replace these placeholder values with actual IDs from your database:
-- 1. Get your tenant_id from the 'tenants' table
-- 2. Get a product_id from the 'products' table (preferably a coffee or drink product)

-- Example: 
-- SELECT id, slug FROM tenants; -- Get your tenant_id
-- SELECT id, name FROM products WHERE tenant_id = 'YOUR_TENANT_ID' LIMIT 5; -- Get a product_id

-- IMPORTANT: Replace 'YOUR_TENANT_ID' and 'YOUR_PRODUCT_ID' below with actual UUIDs

DO $$
DECLARE
  v_tenant_id UUID := 'YOUR_TENANT_ID'; -- Replace with your actual tenant_id
  v_product_id UUID := 'YOUR_PRODUCT_ID'; -- Replace with your actual product_id
  v_group_size UUID;
  v_group_milk UUID;
  v_group_syrup UUID;
BEGIN
  -- Create Size Variants (Beden/Boy)
  INSERT INTO product_variants (tenant_id, product_id, name, name_en, price_modifier, display_order, is_default)
  VALUES
    (v_tenant_id, v_product_id, 'Küçük', 'Small', 0, 1, true),
    (v_tenant_id, v_product_id, 'Orta', 'Medium', 10, 2, false),
    (v_tenant_id, v_product_id, 'Büyük', 'Large', 20, 3, false);

  -- Create Milk Type Customization Group
  INSERT INTO customization_groups (tenant_id, name, name_en, display_order, is_required)
  VALUES (v_tenant_id, 'Süt Tipi', 'Milk Type', 1, false)
  RETURNING id INTO v_group_milk;

  -- Create Milk Type Options
  INSERT INTO customization_options (tenant_id, group_id, name, name_en, price_modifier, display_order, is_default)
  VALUES
    (v_tenant_id, v_group_milk, 'İnek Sütü', 'Cow Milk', 0, 1, true),
    (v_tenant_id, v_group_milk, 'Yulaf Sütü', 'Oat Milk', 8, 2, false),
    (v_tenant_id, v_group_milk, 'Badem Sütü', 'Almond Milk', 10, 3, false),
    (v_tenant_id, v_group_milk, 'Soya Sütü', 'Soy Milk', 8, 4, false);

  -- Create Syrup Customization Group
  INSERT INTO customization_groups (tenant_id, name, name_en, display_order, is_required)
  VALUES (v_tenant_id, 'Şurup', 'Syrup', 2, false)
  RETURNING id INTO v_group_syrup;

  -- Create Syrup Options
  INSERT INTO customization_options (tenant_id, group_id, name, name_en, price_modifier, display_order, is_default)
  VALUES
    (v_tenant_id, v_group_syrup, 'Şurupsuz', 'No Syrup', 0, 1, true),
    (v_tenant_id, v_group_syrup, 'Vanilya', 'Vanilla', 12, 2, false),
    (v_tenant_id, v_group_syrup, 'Karamel', 'Caramel', 12, 3, false),
    (v_tenant_id, v_group_syrup, 'Fındık', 'Hazelnut', 12, 4, false);

  -- Assign customization groups to the product
  INSERT INTO product_customization_groups (tenant_id, product_id, group_id)
  VALUES
    (v_tenant_id, v_product_id, v_group_milk),
    (v_tenant_id, v_product_id, v_group_syrup);

  RAISE NOTICE 'Test data created successfully!';
  RAISE NOTICE 'Created 3 variants, 2 customization groups with 8 options total';
  RAISE NOTICE 'Milk Type Group ID: %', v_group_milk;
  RAISE NOTICE 'Syrup Group ID: %', v_group_syrup;
END $$;
