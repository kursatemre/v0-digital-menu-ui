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

async function cleanup() {
  try {
    console.log('🧹 Cleaning up take-away-coffee-demo tenant...\n')

    // Get tenant
    const { data: tenant, error: tenantError } = await supabase
      .from('tenants')
      .select('id')
      .eq('slug', 'take-away-coffee-demo')
      .single()

    if (tenantError || !tenant) {
      console.log('✅ Tenant not found, nothing to clean up')
      return
    }

    console.log('🗑️  Deleting tenant (will cascade delete all related data)...')

    const { error: deleteError } = await supabase
      .from('tenants')
      .delete()
      .eq('id', tenant.id)

    if (deleteError) {
      console.error('❌ Error deleting tenant:', deleteError)
      process.exit(1)
    }

    console.log('✅ Cleanup complete!')

  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

cleanup()
