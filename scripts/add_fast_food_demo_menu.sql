-- Add menu items for fast-food-demo restaurant
-- First, get the tenant_id for fast-food-demo
DO $$
DECLARE
  v_tenant_id UUID;
BEGIN
  -- Get tenant ID
  SELECT id INTO v_tenant_id FROM tenants WHERE slug = 'fast-food-demo';

  IF v_tenant_id IS NULL THEN
    RAISE EXCEPTION 'Tenant with slug "fast-food-demo" not found!';
  END IF;

  -- Delete existing categories and products for this tenant (clean slate)
  DELETE FROM products WHERE tenant_id = v_tenant_id;
  DELETE FROM categories WHERE tenant_id = v_tenant_id;

  -- ============================================
  -- CATEGORY 1: ANA YEMEKLER: KLASİK BURGERLER
  -- ============================================
  INSERT INTO categories (id, tenant_id, name, name_en, display_order)
  VALUES (
    gen_random_uuid(),
    v_tenant_id,
    'Ana Yemekler: Klasik Burgerler',
    'Main Dishes: Classic Burgers',
    1
  );

  -- Products for Classic Burgers
  INSERT INTO products (tenant_id, category_id, name, name_en, description, description_en, price, image, display_order)
  VALUES
  (
    v_tenant_id,
    (SELECT id FROM categories WHERE tenant_id = v_tenant_id AND name = 'Ana Yemekler: Klasik Burgerler'),
    'Klasik Hamburger',
    'Classic Hamburger',
    'Taze 120 gr dana köftesi, marul, domates, soğan ve özel hamburger sosu ile.',
    'Fresh 120g beef patty with lettuce, tomato, onion, and our special burger sauce.',
    85.00,
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80',
    1
  ),
  (
    v_tenant_id,
    (SELECT id FROM categories WHERE tenant_id = v_tenant_id AND name = 'Ana Yemekler: Klasik Burgerler'),
    'Cheeseburger',
    'Cheeseburger',
    '120 gr dana köftesi, eritilmiş çedar peyniri, turşu, soğan ve ketçap/hardal ikilisi.',
    '120g beef patty with melted cheddar cheese, pickles, onion, and a mix of ketchup/mustard.',
    95.00,
    'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=800&q=80',
    2
  ),
  (
    v_tenant_id,
    (SELECT id FROM categories WHERE tenant_id = v_tenant_id AND name = 'Ana Yemekler: Klasik Burgerler'),
    'Tavuk Burger (Izgara)',
    'Grilled Chicken Burger',
    'Marine edilmiş ızgara tavuk filetosu, marul, domates ve hafif mayonezli sos ile.',
    'Marinated grilled chicken fillet with lettuce, tomato, and a light mayonnaise sauce.',
    90.00,
    'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=800&q=80',
    3
  );

  -- ============================================
  -- CATEGORY 2: ANA YEMEKLER: ÖZEL BURGERLER
  -- ============================================
  INSERT INTO categories (id, tenant_id, name, name_en, display_order)
  VALUES (
    gen_random_uuid(),
    v_tenant_id,
    'Ana Yemekler: Özel Burgerler',
    'Main Dishes: Specialty Burgers',
    2
  );

  -- Products for Specialty Burgers
  INSERT INTO products (tenant_id, category_id, name, name_en, description, description_en, price, image, badge, display_order)
  VALUES
  (
    v_tenant_id,
    (SELECT id FROM categories WHERE tenant_id = v_tenant_id AND name = 'Ana Yemekler: Özel Burgerler'),
    'Barbekü Canavarı',
    'BBQ Monster Burger',
    '150 gr büyük boy dana köftesi, bol füme et parçaları, eritilmiş isli peynir ve tütsülenmiş barbekü sosu.',
    'Large 150g beef patty, generous smoked meat chunks, melted smoked cheese, and smoky BBQ sauce.',
    135.00,
    'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&q=80',
    'ŞEF ÖNERİSİ',
    1
  ),
  (
    v_tenant_id,
    (SELECT id FROM categories WHERE tenant_id = v_tenant_id AND name = 'Ana Yemekler: Özel Burgerler'),
    'Mantar Ziyafeti',
    'Mushroom Feast Burger',
    '120 gr dana köftesi, sotelenmiş taze mantarlar, kremalı sarımsaklı sos ve İsviçre peyniri.',
    '120g beef patty, sautéed fresh mushrooms, creamy garlic sauce, and Swiss cheese.',
    120.00,
    'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=800&q=80',
    NULL,
    2
  ),
  (
    v_tenant_id,
    (SELECT id FROM categories WHERE tenant_id = v_tenant_id AND name = 'Ana Yemekler: Özel Burgerler'),
    'Acı Biber Rüyası',
    'Spicy Pepper Dream',
    'Acı baharatlarla tatlandırılmış dana köftesi, jalapeño biberleri, acı sos ve acı biberli peynir.',
    'Beef patty seasoned with hot spices, jalapeño peppers, spicy sauce, and chili cheese.',
    125.00,
    'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=800&q=80',
    'ACI',
    3
  );

  -- ============================================
  -- CATEGORY 3: TAVUK LEZZETLERİ
  -- ============================================
  INSERT INTO categories (id, tenant_id, name, name_en, display_order)
  VALUES (
    gen_random_uuid(),
    v_tenant_id,
    'Tavuk Lezzetleri',
    'Chicken Delights',
    3
  );

  -- Products for Chicken Delights
  INSERT INTO products (tenant_id, category_id, name, name_en, description, description_en, price, image, display_order)
  VALUES
  (
    v_tenant_id,
    (SELECT id FROM categories WHERE tenant_id = v_tenant_id AND name = 'Tavuk Lezzetleri'),
    'Çıtır Tavuk Sandviç',
    'Crispy Chicken Sandwich',
    'Özenle panelenmiş ve kızartılmış çıtır tavuk filetosu, marul ve ranch sosu ile.',
    'Carefully breaded and fried crispy chicken fillet with lettuce and ranch sauce.',
    95.00,
    'https://images.unsplash.com/photo-1606755456206-b25206cde27e?w=800&q=80',
    1
  ),
  (
    v_tenant_id,
    (SELECT id FROM categories WHERE tenant_id = v_tenant_id AND name = 'Tavuk Lezzetleri'),
    'Tavuk Dürüm (Wrap)',
    'Chicken Wrap',
    'Marine edilmiş ızgara tavuk parçaları, mevsim yeşillikleri ve lavaş içinde özel sos.',
    'Marinated grilled chicken pieces, seasonal greens, and a special sauce, wrapped in flatbread.',
    85.00,
    'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=800&q=80',
    2
  );

  -- ============================================
  -- CATEGORY 4: YAN LEZZETLER VE EKSTRALAR
  -- ============================================
  INSERT INTO categories (id, tenant_id, name, name_en, display_order)
  VALUES (
    gen_random_uuid(),
    v_tenant_id,
    'Yan Lezzetler ve Ekstralar',
    'Sides and Extras',
    4
  );

  -- Products for Sides
  INSERT INTO products (tenant_id, category_id, name, name_en, description, description_en, price, image, display_order)
  VALUES
  (
    v_tenant_id,
    (SELECT id FROM categories WHERE tenant_id = v_tenant_id AND name = 'Yan Lezzetler ve Ekstralar'),
    'Parmak Patates',
    'French Fries',
    'Çıtır çıtır, ince kesilmiş kızarmış patates. (Küçük/Orta/Büyük)',
    'Crispy, thin-cut fried potatoes. (Small/Medium/Large)',
    35.00,
    'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&q=80',
    1
  ),
  (
    v_tenant_id,
    (SELECT id FROM categories WHERE tenant_id = v_tenant_id AND name = 'Yan Lezzetler ve Ekstralar'),
    'Baharatlı Patates',
    'Seasoned/Spicy Fries',
    'Kalın kesilmiş, özel baharat karışımı ile lezzetlendirilmiş kızarmış patates.',
    'Thick-cut fried potatoes seasoned with a special spice blend.',
    40.00,
    'https://images.unsplash.com/photo-1630431341973-02e1b66c5b0b?w=800&q=80',
    2
  ),
  (
    v_tenant_id,
    (SELECT id FROM categories WHERE tenant_id = v_tenant_id AND name = 'Yan Lezzetler ve Ekstralar'),
    'Soğan Halkası',
    'Onion Rings',
    'Altın rengi kızarmış, çıtır soğan halkaları.',
    'Golden-fried, crispy onion rings.',
    45.00,
    'https://images.unsplash.com/photo-1639024471283-03518883512d?w=800&q=80',
    3
  ),
  (
    v_tenant_id,
    (SELECT id FROM categories WHERE tenant_id = v_tenant_id AND name = 'Yan Lezzetler ve Ekstralar'),
    'Mozzarella Çubukları',
    'Mozzarella Sticks',
    'Altın rengi kızarana kadar panelenmiş, uzayan mozzarella peynir çubukları (5 adet).',
    'Breaded mozzarella cheese sticks, fried until golden, with a gooey center (5 pieces).',
    55.00,
    'https://images.unsplash.com/photo-1531749668029-2db88e4276c7?w=800&q=80',
    4
  );

  -- ============================================
  -- CATEGORY 5: SALATALAR
  -- ============================================
  INSERT INTO categories (id, tenant_id, name, name_en, display_order)
  VALUES (
    gen_random_uuid(),
    v_tenant_id,
    'Salatalar',
    'Salads',
    5
  );

  -- Products for Salads
  INSERT INTO products (tenant_id, category_id, name, name_en, description, description_en, price, image, badge, display_order)
  VALUES
  (
    v_tenant_id,
    (SELECT id FROM categories WHERE tenant_id = v_tenant_id AND name = 'Salatalar'),
    'Sezar Salata (Tavuklu)',
    'Chicken Caesar Salad',
    'Romaine marulu, parmesan peyniri, kruton ve ızgara tavuk parçaları ile Sezar sos.',
    'Romaine lettuce, Parmesan cheese, croutons, and grilled chicken pieces with Caesar dressing.',
    85.00,
    'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800&q=80',
    'HAFIF',
    1
  ),
  (
    v_tenant_id,
    (SELECT id FROM categories WHERE tenant_id = v_tenant_id AND name = 'Salatalar'),
    'Mevsim Yeşillikleri Salata',
    'Seasonal Green Salad',
    'Taze mevsim yeşillikleri, cherry domates ve salatalık ile hafif limon sos.',
    'Fresh seasonal greens, cherry tomatoes, and cucumber with a light lemon dressing.',
    65.00,
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80',
    'VEGAN',
    2
  );

  -- ============================================
  -- CATEGORY 6: SOSLAR
  -- ============================================
  INSERT INTO categories (id, tenant_id, name, name_en, display_order)
  VALUES (
    gen_random_uuid(),
    v_tenant_id,
    'Soslar',
    'Sauces',
    6
  );

  -- Products for Sauces
  INSERT INTO products (tenant_id, category_id, name, name_en, description, description_en, price, image, display_order)
  VALUES
  (
    v_tenant_id,
    (SELECT id FROM categories WHERE tenant_id = v_tenant_id AND name = 'Soslar'),
    'Özel Hamburger Sosu',
    'Signature Burger Sauce',
    'Burgerinize özel olarak hazırlanan, hafif tatlı ve kremsi sos.',
    'A slightly sweet and creamy sauce prepared specially for your burger.',
    10.00,
    'https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=800&q=80',
    1
  ),
  (
    v_tenant_id,
    (SELECT id FROM categories WHERE tenant_id = v_tenant_id AND name = 'Soslar'),
    'Ranch Sos',
    'Ranch Sauce',
    'Otlarla zenginleştirilmiş, soğuk ve kremsi sos.',
    'A cold and creamy sauce enriched with herbs.',
    10.00,
    'https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?w=800&q=80',
    2
  ),
  (
    v_tenant_id,
    (SELECT id FROM categories WHERE tenant_id = v_tenant_id AND name = 'Soslar'),
    'Acı Sos (Jalapeño)',
    'Spicy Sauce (Jalapeño)',
    'Ekstra acı sevenler için yoğun ve baharatlı sos.',
    'An intense and spicy sauce for those who love extra heat.',
    12.00,
    'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=800&q=80',
    3
  );

  -- ============================================
  -- CATEGORY 7: İÇECEKLER
  -- ============================================
  INSERT INTO categories (id, tenant_id, name, name_en, display_order)
  VALUES (
    gen_random_uuid(),
    v_tenant_id,
    'İçecekler',
    'Drinks',
    7
  );

  -- Products for Drinks
  INSERT INTO products (tenant_id, category_id, name, name_en, description, description_en, price, image, display_order)
  VALUES
  (
    v_tenant_id,
    (SELECT id FROM categories WHERE tenant_id = v_tenant_id AND name = 'İçecekler'),
    'Kola/Fanta/Sprite',
    'Soda/Soft Drinks',
    'Soğuk ve gazlı içecek seçenekleri. (Kutu/Büyük Boy)',
    'Cold and carbonated drink options. (Can/Large Size)',
    25.00,
    'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=800&q=80',
    1
  ),
  (
    v_tenant_id,
    (SELECT id FROM categories WHERE tenant_id = v_tenant_id AND name = 'İçecekler'),
    'Ayran',
    'Ayran',
    'Soğuk ve geleneksel Türk içeceği.',
    'Cold and traditional Turkish yogurt drink.',
    20.00,
    'https://images.unsplash.com/photo-1523473827533-2a64d0d36748?w=800&q=80',
    2
  ),
  (
    v_tenant_id,
    (SELECT id FROM categories WHERE tenant_id = v_tenant_id AND name = 'İçecekler'),
    'Limonata (Ev Yapımı)',
    'Homemade Lemonade',
    'Taze sıkılmış limonlardan hazırlanan özel yapım serinletici limonata.',
    'A special refreshing lemonade made from freshly squeezed lemons.',
    35.00,
    'https://images.unsplash.com/photo-1523677011781-c91d1bbe1c80?w=800&q=80',
    3
  );

  -- ============================================
  -- CATEGORY 8: TATLI VE KAPAN İÇECEKLERİ
  -- ============================================
  INSERT INTO categories (id, tenant_id, name, name_en, display_order)
  VALUES (
    gen_random_uuid(),
    v_tenant_id,
    'Tatlı ve Kapanış İçecekleri',
    'Desserts and Finishers',
    8
  );

  -- Products for Desserts
  INSERT INTO products (tenant_id, category_id, name, name_en, description, description_en, price, image, badge, display_order)
  VALUES
  (
    v_tenant_id,
    (SELECT id FROM categories WHERE tenant_id = v_tenant_id AND name = 'Tatlı ve Kapanış İçecekleri'),
    'Sıcak Çikolatalı Sufle',
    'Hot Chocolate Souffle',
    'İçi akışkan çikolata dolgulu, yanında vanilyalı dondurma ile servis edilir.',
    'Chocolate-filled with a runny center, served with vanilla ice cream.',
    75.00,
    'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=800&q=80',
    'ŞEF ÖNERİSİ',
    1
  ),
  (
    v_tenant_id,
    (SELECT id FROM categories WHERE tenant_id = v_tenant_id AND name = 'Tatlı ve Kapanış İçecekleri'),
    'Klasik Milkshake',
    'Classic Milkshake',
    'Çikolata, Çilek veya Vanilya aromalı, soğuk ve kremalı içecek.',
    'Cold and creamy beverage with Chocolate, Strawberry, or Vanilla flavor.',
    55.00,
    'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&q=80',
    NULL,
    2
  );

  RAISE NOTICE 'Successfully added all categories and products for fast-food-demo restaurant!';
END $$;
