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

async function runFix() {
  try {
    console.log('🔧 Fixing settings table for multi-tenant support...\n')

    // Read the SQL file
    const sqlPath = path.join(__dirname, 'fix_settings_table.sql')
    const sql = fs.readFileSync(sqlPath, 'utf-8')

    // Execute using Supabase RPC or direct SQL
    // Note: This is a workaround since Supabase JS doesn't directly support raw SQL execution
    // You'll need to run this SQL manually in Supabase SQL Editor OR use a PostgreSQL client

    console.log('📝 SQL Script to run:')
    console.log('='.repeat(60))
    console.log(sql)
    console.log('='.repeat(60))
    console.log('\n⚠️  Please run this SQL in your Supabase SQL Editor:\n')
    console.log('1. Go to https://supabase.com/dashboard/project/qkinoffxqrthktwxzejs/sql')
    console.log('2. Copy and paste the SQL script above')
    console.log('3. Click "Run"\n')

  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

runFix()
