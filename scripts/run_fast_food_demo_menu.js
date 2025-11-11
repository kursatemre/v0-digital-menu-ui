const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Read .env.local file manually
const envPath = path.join(__dirname, '..', '.env.local')
const envContent = fs.readFileSync(envPath, 'utf-8')
const envVars = {}
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/)
  if (match) {
    envVars[match[1].trim()] = match[2].trim()
  }
})

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = envVars.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function runScript() {
  try {
    console.log('🚀 Starting to add menu items for fast-food-demo...')

    // First, check if the tenant exists
    const { data: tenant, error: tenantError } = await supabase
      .from('tenants')
      .select('id, slug, business_name')
      .eq('slug', 'fast-food-demo')
      .single()

    if (tenantError || !tenant) {
      console.error('❌ Tenant "fast-food-demo" not found!')
      console.log('Creating tenant first...')

      const { data: newTenant, error: createError } = await supabase
        .from('tenants')
        .insert({
          slug: 'fast-food-demo',
          business_name: 'Fast Food Demo',
          owner_name: 'Demo Owner',
          owner_email: 'fastfood@demo.com',
          password_hash: 'demo123',
          subscription_status: 'active'
        })
        .select()
        .single()

      if (createError) {
        console.error('❌ Error creating tenant:', createError)
        process.exit(1)
      }

      console.log('✅ Tenant created:', newTenant)
      await runMenuScript(newTenant.id)
    } else {
      console.log('✅ Found tenant:', tenant.business_name, `(${tenant.slug})`)
      await runMenuScript(tenant.id)
    }

  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

async function runMenuScript(tenantId) {
  console.log(`\n📝 Adding menu items for tenant ID: ${tenantId}`)

  // Delete existing products and categories
  console.log('🗑️  Cleaning existing data...')
  await supabase.from('products').delete().eq('tenant_id', tenantId)
  await supabase.from('categories').delete().eq('tenant_id', tenantId)

  // Categories and products data
  const categories = [
    { name: 'Ana Yemekler: Klasik Burgerler', name_en: 'Main Dishes: Classic Burgers', order: 1 },
    { name: 'Ana Yemekler: Özel Burgerler', name_en: 'Main Dishes: Specialty Burgers', order: 2 },
    { name: 'Tavuk Lezzetleri', name_en: 'Chicken Delights', order: 3 },
    { name: 'Yan Lezzetler ve Ekstralar', name_en: 'Sides and Extras', order: 4 },
    { name: 'Salatalar', name_en: 'Salads', order: 5 },
    { name: 'Soslar', name_en: 'Sauces', order: 6 },
    { name: 'İçecekler', name_en: 'Drinks', order: 7 },
    { name: 'Tatlı ve Kapanış İçecekleri', name_en: 'Desserts and Finishers', order: 8 }
  ]

  const products = {
    'Ana Yemekler: Klasik Burgerler': [
      { name: 'Klasik Hamburger', name_en: 'Classic Hamburger', desc: 'Taze 120 gr dana köftesi, marul, domates, soğan ve özel hamburger sosu ile.', desc_en: 'Fresh 120g beef patty with lettuce, tomato, onion, and our special burger sauce.', price: 85, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80' },
      { name: 'Cheeseburger', name_en: 'Cheeseburger', desc: '120 gr dana köftesi, eritilmiş çedar peyniri, turşu, soğan ve ketçap/hardal ikilisi.', desc_en: '120g beef patty with melted cheddar cheese, pickles, onion, and a mix of ketchup/mustard.', price: 95, image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=800&q=80' },
      { name: 'Tavuk Burger (Izgara)', name_en: 'Grilled Chicken Burger', desc: 'Marine edilmiş ızgara tavuk filetosu, marul, domates ve hafif mayonezli sos ile.', desc_en: 'Marinated grilled chicken fillet with lettuce, tomato, and a light mayonnaise sauce.', price: 90, image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=800&q=80' }
    ],
    'Ana Yemekler: Özel Burgerler': [
      { name: 'Barbekü Canavarı', name_en: 'BBQ Monster Burger', desc: '150 gr büyük boy dana köftesi, bol füme et parçaları, eritilmiş isli peynir ve tütsülenmiş barbekü sosu.', desc_en: 'Large 150g beef patty, generous smoked meat chunks, melted smoked cheese, and smoky BBQ sauce.', price: 135, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&q=80', badge: 'ŞEF ÖNERİSİ' },
      { name: 'Mantar Ziyafeti', name_en: 'Mushroom Feast Burger', desc: '120 gr dana köftesi, sotelenmiş taze mantarlar, kremalı sarımsaklı sos ve İsviçre peyniri.', desc_en: '120g beef patty, sautéed fresh mushrooms, creamy garlic sauce, and Swiss cheese.', price: 120, image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=800&q=80' },
      { name: 'Acı Biber Rüyası', name_en: 'Spicy Pepper Dream', desc: 'Acı baharatlarla tatlandırılmış dana köftesi, jalapeño biberleri, acı sos ve acı biberli peynir.', desc_en: 'Beef patty seasoned with hot spices, jalapeño peppers, spicy sauce, and chili cheese.', price: 125, image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=800&q=80', badge: 'ACI' }
    ],
    'Tavuk Lezzetleri': [
      { name: 'Çıtır Tavuk Sandviç', name_en: 'Crispy Chicken Sandwich', desc: 'Özenle panelenmiş ve kızartılmış çıtır tavuk filetosu, marul ve ranch sosu ile.', desc_en: 'Carefully breaded and fried crispy chicken fillet with lettuce and ranch sauce.', price: 95, image: 'https://images.unsplash.com/photo-1606755456206-b25206cde27e?w=800&q=80' },
      { name: 'Tavuk Dürüm (Wrap)', name_en: 'Chicken Wrap', desc: 'Marine edilmiş ızgara tavuk parçaları, mevsim yeşillikleri ve lavaş içinde özel sos.', desc_en: 'Marinated grilled chicken pieces, seasonal greens, and a special sauce, wrapped in flatbread.', price: 85, image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=800&q=80' }
    ],
    'Yan Lezzetler ve Ekstralar': [
      { name: 'Parmak Patates', name_en: 'French Fries', desc: 'Çıtır çıtır, ince kesilmiş kızarmış patates. (Küçük/Orta/Büyük)', desc_en: 'Crispy, thin-cut fried potatoes. (Small/Medium/Large)', price: 35, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&q=80' },
      { name: 'Baharatlı Patates', name_en: 'Seasoned/Spicy Fries', desc: 'Kalın kesilmiş, özel baharat karışımı ile lezzetlendirilmiş kızarmış patates.', desc_en: 'Thick-cut fried potatoes seasoned with a special spice blend.', price: 40, image: 'https://images.unsplash.com/photo-1630431341973-02e1b66c5b0b?w=800&q=80' },
      { name: 'Soğan Halkası', name_en: 'Onion Rings', desc: 'Altın rengi kızarmış, çıtır soğan halkaları.', desc_en: 'Golden-fried, crispy onion rings.', price: 45, image: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=800&q=80' },
      { name: 'Mozzarella Çubukları', name_en: 'Mozzarella Sticks', desc: 'Altın rengi kızarana kadar panelenmiş, uzayan mozzarella peynir çubukları (5 adet).', desc_en: 'Breaded mozzarella cheese sticks, fried until golden, with a gooey center (5 pieces).', price: 55, image: 'https://images.unsplash.com/photo-1531749668029-2db88e4276c7?w=800&q=80' }
    ],
    'Salatalar': [
      { name: 'Sezar Salata (Tavuklu)', name_en: 'Chicken Caesar Salad', desc: 'Romaine marulu, parmesan peyniri, kruton ve ızgara tavuk parçaları ile Sezar sos.', desc_en: 'Romaine lettuce, Parmesan cheese, croutons, and grilled chicken pieces with Caesar dressing.', price: 85, image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800&q=80', badge: 'HAFIF' },
      { name: 'Mevsim Yeşillikleri Salata', name_en: 'Seasonal Green Salad', desc: 'Taze mevsim yeşillikleri, cherry domates ve salatalık ile hafif limon sos.', desc_en: 'Fresh seasonal greens, cherry tomatoes, and cucumber with a light lemon dressing.', price: 65, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80', badge: 'VEGAN' }
    ],
    'Soslar': [
      { name: 'Özel Hamburger Sosu', name_en: 'Signature Burger Sauce', desc: 'Burgerinize özel olarak hazırlanan, hafif tatlı ve kremsi sos.', desc_en: 'A slightly sweet and creamy sauce prepared specially for your burger.', price: 10, image: 'https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=800&q=80' },
      { name: 'Ranch Sos', name_en: 'Ranch Sauce', desc: 'Otlarla zenginleştirilmiş, soğuk ve kremsi sos.', desc_en: 'A cold and creamy sauce enriched with herbs.', price: 10, image: 'https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?w=800&q=80' },
      { name: 'Acı Sos (Jalapeño)', name_en: 'Spicy Sauce (Jalapeño)', desc: 'Ekstra acı sevenler için yoğun ve baharatlı sos.', desc_en: 'An intense and spicy sauce for those who love extra heat.', price: 12, image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=800&q=80' }
    ],
    'İçecekler': [
      { name: 'Kola/Fanta/Sprite', name_en: 'Soda/Soft Drinks', desc: 'Soğuk ve gazlı içecek seçenekleri. (Kutu/Büyük Boy)', desc_en: 'Cold and carbonated drink options. (Can/Large Size)', price: 25, image: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=800&q=80' },
      { name: 'Ayran', name_en: 'Ayran', desc: 'Soğuk ve geleneksel Türk içeceği.', desc_en: 'Cold and traditional Turkish yogurt drink.', price: 20, image: 'https://images.unsplash.com/photo-1523473827533-2a64d0d36748?w=800&q=80' },
      { name: 'Limonata (Ev Yapımı)', name_en: 'Homemade Lemonade', desc: 'Taze sıkılmış limonlardan hazırlanan özel yapım serinletici limonata.', desc_en: 'A special refreshing lemonade made from freshly squeezed lemons.', price: 35, image: 'https://images.unsplash.com/photo-1523677011781-c91d1bbe1c80?w=800&q=80' }
    ],
    'Tatlı ve Kapanış İçecekleri': [
      { name: 'Sıcak Çikolatalı Sufle', name_en: 'Hot Chocolate Souffle', desc: 'İçi akışkan çikolata dolgulu, yanında vanilyalı dondurma ile servis edilir.', desc_en: 'Chocolate-filled with a runny center, served with vanilla ice cream.', price: 75, image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=800&q=80', badge: 'ŞEF ÖNERİSİ' },
      { name: 'Klasik Milkshake', name_en: 'Classic Milkshake', desc: 'Çikolata, Çilek veya Vanilya aromalı, soğuk ve kremalı içecek.', desc_en: 'Cold and creamy beverage with Chocolate, Strawberry, or Vanilla flavor.', price: 55, image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&q=80' }
    ]
  }

  // Insert categories and products
  for (const cat of categories) {
    console.log(`\n📁 Adding category: ${cat.name}`)

    const { data: category, error: catError } = await supabase
      .from('categories')
      .insert({
        tenant_id: tenantId,
        name: cat.name,
        name_en: cat.name_en,
        display_order: cat.order
      })
      .select()
      .single()

    if (catError) {
      console.error(`❌ Error adding category ${cat.name}:`, catError)
      continue
    }

    console.log(`✅ Category added: ${category.name}`)

    // Add products for this category
    const categoryProducts = products[cat.name] || []
    for (let i = 0; i < categoryProducts.length; i++) {
      const prod = categoryProducts[i]
      const { data: product, error: prodError } = await supabase
        .from('products')
        .insert({
          tenant_id: tenantId,
          category_id: category.id,
          name: prod.name,
          name_en: prod.name_en,
          description: prod.desc,
          description_en: prod.desc_en,
          price: prod.price,
          image: prod.image,
          badge: prod.badge || null,
          display_order: i + 1
        })
        .select()
        .single()

      if (prodError) {
        console.error(`  ❌ Error adding product ${prod.name}:`, prodError)
      } else {
        console.log(`  ✅ Product added: ${product.name} (₺${product.price})`)
      }
    }
  }

  console.log('\n🎉 All menu items added successfully!')
  console.log(`\n🔗 Visit: http://localhost:3000/fast-food-demo`)
}

runScript()
