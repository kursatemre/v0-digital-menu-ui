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

async function addTakeawayCoffeeDemo() {
  try {
    console.log('🚀 Starting to add menu for take-away-coffe-demo...\n')

    // Get or create tenant
    let { data: tenant, error: tenantError } = await supabase
      .from('tenants')
      .select('id, slug, business_name')
      .eq('slug', 'take-away-coffe-demo')
      .single()

    if (tenantError || !tenant) {
      console.log('📝 Creating tenant: take-away-coffe-demo')
      const { data: newTenant, error: createError } = await supabase
        .from('tenants')
        .insert({
          slug: 'take-away-coffe-demo',
          business_name: 'Take Away Coffee Demo',
          owner_name: 'Demo Owner',
          owner_email: 'coffee@demo.com',
          subscription_status: 'active'
        })
        .select()
        .single()

      if (createError) {
        console.error('❌ Error creating tenant:', createError)
        process.exit(1)
      }
      tenant = newTenant
    }

    console.log('✅ Found tenant:', tenant.business_name, `(${tenant.slug})`)
    const tenantId = tenant.id

    // Categories with products
    const menuData = [
      {
        category: { name: 'Espresso Temelli', name_en: 'Espresso-Based', order: 1, image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=800&q=80' },
        products: [
          { name: 'Espresso', name_en: 'Espresso', price: 35, image: 'https://images.unsplash.com/photo-1579992357154-faf4bde95b3d?w=800&q=80', variants: [{ name: 'Single', name_en: 'Single', price: 0, default: true }, { name: 'Double', name_en: 'Double', price: 15 }] },
          { name: 'Macchiato (Klasik)', name_en: 'Macchiato (Traditional)', price: 40, image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=800&q=80', notes: 'Süt Köpüğü ile' },
          { name: 'Ristretto', name_en: 'Ristretto', price: 38, image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80', notes: 'Yoğun Espresso' },
          { name: 'Lungo', name_en: 'Lungo', price: 38, image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80', notes: 'Uzun Çekilmiş Espresso' }
        ]
      },
      {
        category: { name: 'Klasik Sütlüler', name_en: 'Classic Milk Drinks', order: 2, image: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=800&q=80' },
        products: [
          {
            name: 'Caffè Latte',
            name_en: 'Caffè Latte',
            price: 50,
            image: 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=800&q=80',
            variants: [
              { name: 'Small', name_en: 'Small', price: 0, default: true },
              { name: 'Medium', name_en: 'Medium', price: 10 },
              { name: 'Large', name_en: 'Large', price: 20 }
            ]
          },
          {
            name: 'Cappuccino',
            name_en: 'Cappuccino',
            price: 48,
            image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=800&q=80',
            variants: [
              { name: 'Small', name_en: 'Small', price: 0, default: true },
              { name: 'Medium', name_en: 'Medium', price: 10 },
              { name: 'Large', name_en: 'Large', price: 20 }
            ]
          },
          { name: 'Flat White', name_en: 'Flat White', price: 52, image: 'https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?w=800&q=80' }
        ]
      },
      {
        category: { name: 'Soğuk Kahveler', name_en: 'Cold Coffees', order: 3, image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=800&q=80' },
        products: [
          {
            name: 'Iced Americano',
            name_en: 'Iced Americano',
            price: 45,
            image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=800&q=80',
            variants: [
              { name: 'Medium', name_en: 'Medium', price: 0, default: true },
              { name: 'Large', name_en: 'Large', price: 15 }
            ]
          },
          {
            name: 'Cold Brew (Nitro)',
            name_en: 'Cold Brew (Nitro)',
            price: 55,
            image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&q=80',
            notes: 'Az Asitli, Yumuşak',
            variants: [
              { name: 'Medium', name_en: 'Medium', price: 0, default: true },
              { name: 'Large', name_en: 'Large', price: 15 }
            ]
          },
          { name: 'Affogato', name_en: 'Affogato', price: 48, image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&q=80', notes: 'Vanilyalı Dondurma ile' },
          {
            name: 'Iced Mocha',
            name_en: 'Iced Mocha',
            price: 58,
            image: 'https://images.unsplash.com/photo-1578133671540-edad0b3d4862?w=800&q=80',
            notes: 'Çikolata Soslu',
            variants: [
              { name: 'Medium', name_en: 'Medium', price: 0, default: true },
              { name: 'Large', name_en: 'Large', price: 15 }
            ]
          }
        ]
      },
      {
        category: { name: 'Kahvesiz İçecekler', name_en: 'Non-Coffee Drinks', order: 4, image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&q=80' },
        products: [
          {
            name: 'Sıcak Çikolata',
            name_en: 'Hot Chocolate',
            price: 45,
            image: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=800&q=80',
            variants: [
              { name: 'Small', name_en: 'Small', price: 0, default: true },
              { name: 'Medium', name_en: 'Medium', price: 10 },
              { name: 'Large', name_en: 'Large', price: 20 }
            ]
          },
          {
            name: 'Matcha Latte',
            name_en: 'Matcha Latte',
            price: 52,
            image: 'https://images.unsplash.com/photo-1536013293456-e54c48455ef1?w=800&q=80',
            notes: 'Soğuk/Sıcak',
            variants: [
              { name: 'Small', name_en: 'Small', price: 0, default: true },
              { name: 'Medium', name_en: 'Medium', price: 10 },
              { name: 'Large', name_en: 'Large', price: 20 }
            ]
          },
          { name: 'Taze Sıkılmış Portakal Suyu', name_en: 'Fresh Orange Juice', price: 38, image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800&q=80' },
          { name: 'Bitkisel Çay Çeşitleri', name_en: 'Herbal Tea Varieties', price: 32, image: 'https://images.unsplash.com/photo-1597318130796-fa8b1b17d92b?w=800&q=80', notes: 'Nane, Papatya, Yeşil' }
        ]
      },
      {
        category: { name: 'Tatlı Atıştırmalıklar', name_en: 'Sweet Snacks', order: 5, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80' },
        products: [
          { name: 'Scone (Reçel/Kaymaklı)', name_en: 'Scone (w/ Jam/Clotted Cream)', price: 42, image: 'https://images.unsplash.com/photo-1603046891726-36bfd957f55f?w=800&q=80' },
          { name: 'Tiramisu (Porsiyon)', name_en: 'Tiramisu (Portion)', price: 48, image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&q=80', notes: 'Ev Yapımı' },
          { name: 'Glutensiz Brownie', name_en: 'Gluten-Free Brownie', price: 45, image: 'https://images.unsplash.com/photo-1607920591413-4ec007e70023?w=800&q=80', notes: 'Özel Diyete Uygun', badge: 'GLUTENSIZ' }
        ]
      },
      {
        category: { name: 'Tuzlu Atıştırmalıklar', name_en: 'Savory Snacks', order: 6, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80' },
        products: [
          { name: 'Peynirli Poğaça', name_en: 'Cheese Pastry', price: 35, image: 'https://images.unsplash.com/photo-1619366402379-ee40c08e9a9c?w=800&q=80', notes: 'Günlük Taze' },
          { name: 'Hindi Fümeli Sandviç', name_en: 'Smoked Turkey Sandwich', price: 55, image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&q=80', notes: 'Tam Buğday Ekmeği' },
          { name: 'Vegan Wrap', name_en: 'Vegan Wrap', price: 52, image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=800&q=80', notes: 'Mevsim Sebzeleri', badge: 'VEGAN' }
        ]
      }
    ]

    // Create global customization groups (will be reused for multiple products)
    console.log('\n📋 Creating customization groups...')

    const { data: syrupGroup, error: syrupError } = await supabase
      .from('customization_groups')
      .insert({
        tenant_id: tenantId,
        name: 'Şurup Çeşitleri',
        name_en: 'Syrup Flavors',
        display_order: 1,
        is_required: false
      })
      .select()
      .single()

    if (!syrupError) {
      console.log('✅ Created: Şurup Çeşitleri')

      // Add syrup options
      await supabase.from('customization_options').insert([
        { tenant_id: tenantId, group_id: syrupGroup.id, name: 'Vanilya', name_en: 'Vanilla', price_modifier: 8, display_order: 1 },
        { tenant_id: tenantId, group_id: syrupGroup.id, name: 'Karamel', name_en: 'Caramel', price_modifier: 8, display_order: 2 },
        { tenant_id: tenantId, group_id: syrupGroup.id, name: 'Fındık', name_en: 'Hazelnut', price_modifier: 8, display_order: 3 }
      ])
    }

    const { data: milkGroup, error: milkError } = await supabase
      .from('customization_groups')
      .insert({
        tenant_id: tenantId,
        name: 'Alternatif Sütler',
        name_en: 'Milk Alternatives',
        display_order: 2,
        is_required: false
      })
      .select()
      .single()

    if (!milkError) {
      console.log('✅ Created: Alternatif Sütler')

      // Add milk options
      await supabase.from('customization_options').insert([
        { tenant_id: tenantId, group_id: milkGroup.id, name: 'Normal Süt', name_en: 'Regular Milk', price_modifier: 0, display_order: 0, is_default: true },
        { tenant_id: tenantId, group_id: milkGroup.id, name: 'Badem Sütü', name_en: 'Almond Milk', price_modifier: 10, display_order: 1 },
        { tenant_id: tenantId, group_id: milkGroup.id, name: 'Yulaf Sütü', name_en: 'Oat Milk', price_modifier: 10, display_order: 2 },
        { tenant_id: tenantId, group_id: milkGroup.id, name: 'Laktozsuz Süt', name_en: 'Lactose-Free Milk', price_modifier: 8, display_order: 3 }
      ])
    }

    // Process each category
    for (const categoryData of menuData) {
      console.log(`\n📁 Adding category: ${categoryData.category.name}`)

      const { data: category, error: catError } = await supabase
        .from('categories')
        .insert({
          tenant_id: tenantId,
          name: categoryData.category.name,
          name_en: categoryData.category.name_en,
          image: categoryData.category.image,
          display_order: categoryData.category.order
        })
        .select()
        .single()

      if (catError) {
        console.error(`❌ Error adding category:`, catError)
        continue
      }

      console.log(`✅ Category added: ${category.name}`)

      // Add products
      for (let i = 0; i < categoryData.products.length; i++) {
        const prod = categoryData.products[i]

        const { data: product, error: prodError } = await supabase
          .from('products')
          .insert({
            tenant_id: tenantId,
            category_id: category.id,
            name: prod.name,
            name_en: prod.name_en,
            description: prod.notes || '',
            description_en: prod.notes || '',
            price: prod.price,
            image: prod.image || null,
            badge: prod.badge || null,
            display_order: i + 1
          })
          .select()
          .single()

        if (prodError) {
          console.error(`  ❌ Error adding product ${prod.name}:`, prodError)
          continue
        }

        console.log(`  ✅ Product: ${product.name} (₺${product.price})`)

        // Add variants if present
        if (prod.variants && prod.variants.length > 0) {
          for (const variant of prod.variants) {
            await supabase.from('product_variants').insert({
              tenant_id: tenantId,
              product_id: product.id,
              name: variant.name,
              name_en: variant.name_en,
              price_modifier: variant.price,
              is_default: variant.default || false,
              display_order: variant.display_order || 0
            })
          }
          console.log(`    → Added ${prod.variants.length} variants`)
        }

        // Link customization groups for milk-based drinks
        const milkBasedProducts = ['Caffè Latte', 'Cappuccino', 'Flat White', 'Sıcak Çikolata', 'Matcha Latte']
        if (milkBasedProducts.includes(prod.name_en) && milkGroup) {
          await supabase.from('product_customization_groups').insert({
            tenant_id: tenantId,
            product_id: product.id,
            group_id: milkGroup.id
          })
          console.log(`    → Linked: Milk alternatives`)
        }

        // Link syrup for relevant products
        const syrupProducts = ['Caffè Latte', 'Cappuccino', 'Iced Americano', 'Iced Mocha']
        if (syrupProducts.includes(prod.name_en) && syrupGroup) {
          await supabase.from('product_customization_groups').insert({
            tenant_id: tenantId,
            product_id: product.id,
            group_id: syrupGroup.id
          })
          console.log(`    → Linked: Syrup flavors`)
        }
      }
    }

    console.log('\n🎉 All menu items added successfully!')
    console.log(`\n🔗 Visit: http://localhost:3000/take-away-coffe-demo`)

  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

addTakeawayCoffeeDemo()
