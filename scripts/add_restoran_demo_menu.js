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

async function addRestoranDemoMenu() {
  try {
    console.log('🚀 Starting to add menu items for restoran-demo...\n')

    // Get tenant ID
    const { data: tenant, error: tenantError } = await supabase
      .from('tenants')
      .select('id, slug, business_name')
      .eq('slug', 'restoran-demo')
      .single()

    if (tenantError || !tenant) {
      console.error('❌ Tenant "restoran-demo" not found!')
      console.log('Please create the tenant first or check the slug name.')
      process.exit(1)
    }

    console.log('✅ Found tenant:', tenant.business_name, `(${tenant.slug})`)
    const tenantId = tenant.id

    console.log(`\n📝 Adding menu items for tenant ID: ${tenantId}\n`)

    // Categories and products data
    const categories = [
      {
        name: 'Başlangıçlar',
        name_en: 'Appetizers',
        order: 1,
        image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80'
      },
      {
        name: 'Çorba ve Salatalar',
        name_en: 'Soup & Salads',
        order: 2,
        image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80'
      },
      {
        name: 'Ana Yemekler: Deniz',
        name_en: 'Main Courses: Seafood',
        order: 3,
        image: 'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=800&q=80'
      },
      {
        name: 'Ana Yemekler: Et',
        name_en: 'Main Courses: Meat',
        order: 4,
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80'
      },
      {
        name: 'Garnitürler',
        name_en: 'Sides',
        order: 5,
        image: 'https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?w=800&q=80'
      },
      {
        name: 'Şarap Listesi',
        name_en: 'Wine List',
        order: 6,
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80'
      },
      {
        name: 'Diğer İçecekler',
        name_en: 'Other Drinks',
        order: 7,
        image: 'https://images.unsplash.com/photo-1437418747212-8d9709afab22?w=800&q=80'
      },
      {
        name: 'Tatlı Ziyafeti',
        name_en: 'Dessert Feast',
        order: 8,
        image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&q=80'
      }
    ]

    const products = {
      'Başlangıçlar': [
        {
          name: 'Deniz Tarağı Ceviche',
          name_en: 'Scallop Ceviche',
          desc: 'Taze deniz tarağı, narenciye sosu ve mikro yeşillikler ile hafifçe marine edilmiştir.',
          desc_en: 'Fresh scallops lightly marinated with a citrus dressing and micro greens.',
          price: 185,
          badge: 'ŞEF ÖNERİSİ'
        },
        {
          name: 'Dana Carpaccio',
          name_en: 'Beef Carpaccio',
          desc: 'İnce dilimlenmiş bonfile, özel roka yaprakları, kapari ve 24 ay dinlendirilmiş Parmesan peyniri.',
          desc_en: 'Thinly sliced tenderloin, wild rocket leaves, capers, and 24-month aged Parmesan cheese.',
          price: 165
        }
      ],
      'Çorba ve Salatalar': [
        {
          name: 'Istakoz Bisque',
          name_en: 'Lobster Bisque',
          desc: 'Kremsi, zengin ve aromatik, taze ıstakoz parçacıkları ile zenginleştirilmiş Fransız usulü bisque çorbası.',
          desc_en: 'Creamy, rich, and aromatic French bisque soup, enriched with fresh lobster pieces.',
          price: 125,
          badge: 'ŞEF ÖNERİSİ'
        },
        {
          name: 'Organik Yeşil Salata',
          name_en: 'Organic Green Salad',
          desc: 'Mevsiminde toplanmış organik yeşillikler, trüf yağında sotelenmiş mantarlar ve balzamik glaze.',
          desc_en: 'Organically grown seasonal greens, mushrooms sautéed in truffle oil, and balsamic glaze.',
          price: 95,
          badge: 'VEGAN'
        }
      ],
      'Ana Yemekler: Deniz': [
        {
          name: 'Izgara Lagos Fileto',
          name_en: 'Grilled Grouper Fillet',
          desc: 'Limon ve taze otlarla marine edilmiş, ızgarada mükemmel kıvamda pişirilmiş Lagos balığı filetosu.',
          desc_en: 'Grouper fillet marinated with lemon and fresh herbs, grilled to perfect tenderness.',
          price: 295
        },
        {
          name: 'Atlantik Somon Konfi',
          name_en: 'Atlantic Salmon Confit',
          desc: 'Düşük ısıda zeytinyağında pişirilmiş (konfi) Atlantik somonu, yanında kuşkonmaz ve Hollandez sos.',
          desc_en: 'Atlantic salmon slow-cooked in olive oil (confit), served with asparagus and Hollandaise sauce.',
          price: 275,
          badge: 'ŞEF ÖNERİSİ'
        }
      ],
      'Ana Yemekler: Et': [
        {
          name: 'Dry-Aged Ribeye (400 gr)',
          name_en: 'Dry-Aged Ribeye (400 gr)',
          desc: 'En az 30 gün kuru dinlendirilmiş, yüksek mermerli, aromatik Ribeye (Antrikot) bifteği.',
          desc_en: 'Highly marbled and aromatic Ribeye steak, dry-aged for a minimum of 30 days.',
          price: 485,
          badge: 'ŞEF ÖNERİSİ'
        },
        {
          name: 'Bonfile Mignon',
          name_en: 'Fillet Mignon',
          desc: 'Yağsız ve en yumuşak kesim olan Bonfile Mignon, kırmızı şarap sosu ve kremalı patates püresi ile.',
          desc_en: 'The leanest and most tender cut, Fillet Mignon, served with a red wine reduction and creamy mashed potatoes.',
          price: 425
        }
      ],
      'Garnitürler': [
        {
          name: 'Trüflü Patates Püresi',
          name_en: 'Truffle Mashed Potatoes',
          desc: 'İnce elenmiş patates püresi, taze krema ve siyah İtalyan trüf mantarı yağı ile.',
          desc_en: 'Finely sifted mashed potatoes with fresh cream and black Italian truffle oil.',
          price: 65
        },
        {
          name: 'Izgara Kuşkonmaz',
          name_en: 'Grilled Asparagus',
          desc: 'Tereyağında hafifçe sotelenmiş, deniz tuzu ile tatlandırılmış çıtır kuşkonmaz.',
          desc_en: 'Crunchy asparagus lightly sautéed in butter and seasoned with sea salt.',
          price: 55
        }
      ],
      'Şarap Listesi': [
        {
          name: 'Kırmızı Şarap (Özel Seçki)',
          name_en: 'Red Wine (Special Selection)',
          desc: 'Kalın gövdeli, meşe fıçıda dinlenmiş Merlot ve Cabernet Sauvignon kupajı. (Et yemekleri için önerilir.)',
          desc_en: 'Full-bodied Merlot and Cabernet Sauvignon blend, aged in oak barrels. (Recommended for meat courses.)',
          price: 350
        },
        {
          name: 'Beyaz Şarap (Fermente)',
          name_en: 'White Wine (Fermented)',
          desc: 'Canlı, minerali yüksek ve kompleks tatlara sahip, meşe fıçıda fermente edilmiş Chardonnay. (Balık için önerilir.)',
          desc_en: 'Vibrant, high-mineral, and complex Chardonnay fermented in oak. (Recommended for fish.)',
          price: 320
        },
        {
          name: 'Rose Şarap (Yazlık)',
          name_en: 'Rose Wine (Summer)',
          desc: 'Taze çilek ve nar notaları taşıyan, zarif ve dengeli Rose şarap.',
          desc_en: 'Elegant and balanced Rose wine with notes of fresh strawberry and pomegranate.',
          price: 280
        }
      ],
      'Diğer İçecekler': [
        {
          name: 'Ev Yapımı Limonata',
          name_en: 'Homemade Lemonade',
          desc: 'Taze nane ve limonla hazırlanan geleneksel serinletici.',
          desc_en: 'Traditional refreshing beverage made with fresh mint and lemon.',
          price: 45
        },
        {
          name: 'Premium Su Seçkisi',
          name_en: 'Premium Water Selection',
          desc: "Fransa'dan doğal kaynak suyu (Still ve Sparkling seçenekleriyle).",
          desc_en: 'Natural spring water from France (Still and Sparkling options).',
          price: 35
        }
      ],
      'Tatlı Ziyafeti': [
        {
          name: 'Lava Kek (Valrhona Çikolatalı)',
          name_en: 'Lava Cake (Valrhona Chocolate)',
          desc: 'Dışı çıtır, içi akışkan Valrhona çikolatası ile yapılmış lava kek, vanilyalı dondurma eşliğinde.',
          desc_en: 'Valrhona chocolate lava cake with a crispy shell and a flowing center, served with vanilla ice cream.',
          price: 95,
          badge: 'ŞEF ÖNERİSİ'
        },
        {
          name: 'Panna Cotta',
          name_en: 'Panna Cotta',
          desc: 'Taze orman meyveleri sosu ile servis edilen geleneksel İtalyan kremalı tatlısı.',
          desc_en: 'Traditional Italian cream dessert served with fresh forest fruit sauce.',
          price: 75
        },
        {
          name: 'Şefin Peynir Tabağı',
          name_en: "Chef's Cheese Platter",
          desc: 'Olgunlaştırılmış peynirler, özel ev yapımı reçeller ve kuru meyveler ile.',
          desc_en: 'Aged cheeses served with specialty homemade jams and dried fruits.',
          price: 145
        }
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
          image: cat.image,
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
    console.log(`\n🔗 Visit: http://localhost:3000/restoran-demo`)

  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

addRestoranDemoMenu()
