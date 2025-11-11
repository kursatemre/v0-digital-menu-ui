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

async function updateImages() {
  try {
    console.log('🚀 Starting to update images for fast-food-demo...\n')

    // Get tenant ID
    const { data: tenant, error: tenantError } = await supabase
      .from('tenants')
      .select('id')
      .eq('slug', 'fast-food-demo')
      .single()

    if (tenantError || !tenant) {
      console.error('❌ Tenant "fast-food-demo" not found!')
      process.exit(1)
    }

    const tenantId = tenant.id
    console.log('✅ Found tenant ID:', tenantId, '\n')

    // ============================================
    // 1. UPDATE PRODUCT IMAGES
    // ============================================
    console.log('📸 Updating product images...\n')

    const productUpdates = [
      {
        name: 'Baharatlı Patates',
        newImage: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=800&q=80'
      },
      {
        name: 'Limonata (Ev Yapımı)',
        newImage: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=800&q=80'
      },
      {
        name: 'Acı Sos (Jalapeño)',
        newImage: 'https://images.unsplash.com/photo-1608877907149-a206d75ba011?w=800&q=80'
      }
    ]

    for (const prod of productUpdates) {
      const { data, error } = await supabase
        .from('products')
        .update({ image: prod.newImage })
        .eq('tenant_id', tenantId)
        .eq('name', prod.name)
        .select()

      if (error) {
        console.error(`❌ Error updating ${prod.name}:`, error)
      } else if (data && data.length > 0) {
        console.log(`✅ Updated image for: ${prod.name}`)
      } else {
        console.log(`⚠️  Product not found: ${prod.name}`)
      }
    }

    // ============================================
    // 2. ADD CATEGORY IMAGES
    // ============================================
    console.log('\n📁 Adding category images...\n')

    const categoryImages = [
      {
        name: 'Ana Yemekler: Klasik Burgerler',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80'
      },
      {
        name: 'Ana Yemekler: Özel Burgerler',
        image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&q=80'
      },
      {
        name: 'Tavuk Lezzetleri',
        image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=800&q=80'
      },
      {
        name: 'Yan Lezzetler ve Ekstralar',
        image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&q=80'
      },
      {
        name: 'Salatalar',
        image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800&q=80'
      },
      {
        name: 'Soslar',
        image: 'https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=800&q=80'
      },
      {
        name: 'İçecekler',
        image: 'https://images.unsplash.com/photo-1437418747212-8d9709afab22?w=800&q=80'
      },
      {
        name: 'Tatlı ve Kapanış İçecekleri',
        image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=800&q=80'
      }
    ]

    for (const cat of categoryImages) {
      const { data, error } = await supabase
        .from('categories')
        .update({ image: cat.image })
        .eq('tenant_id', tenantId)
        .eq('name', cat.name)
        .select()

      if (error) {
        console.error(`❌ Error updating category ${cat.name}:`, error)
      } else if (data && data.length > 0) {
        console.log(`✅ Added image to category: ${cat.name}`)
      } else {
        console.log(`⚠️  Category not found: ${cat.name}`)
      }
    }

    console.log('\n🎉 All images updated successfully!')

  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

updateImages()
