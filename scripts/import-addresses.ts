/**
 * Import addresses from addresses.json into Supabase
 *
 * Usage: npm run import-addresses
 *
 * Make sure you have set up .env.local with your Supabase credentials first!
 */

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import { Database } from '../src/types/database'

// Load environment variables
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local')
  console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set')
  process.exit(1)
}

const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey)

interface Address {
  name: string
  address: string
  unique_code: string
  latitude: number
  longitude: number
}

async function importAddresses() {
  console.log('📍 Starting address import...\n')

  // Read addresses.json
  const addressesPath = path.join(process.cwd(), 'addresses.json')
  const addressesData = fs.readFileSync(addressesPath, 'utf-8')
  const addresses: Address[] = JSON.parse(addressesData)

  console.log(`Found ${addresses.length} addresses to import\n`)

  let successCount = 0
  let errorCount = 0

  for (const addr of addresses) {
    try {
      // Check if this unique_code already exists
      const { data: existing } = await supabase
        .from('wedding_tables')
        .select('id')
        .eq('unique_code', addr.unique_code)
        .single()

      if (existing) {
        console.log(`⏭️  Skipping "${addr.name}" (already exists)`)
        continue
      }

      // Insert the address
      const { error } = await supabase
        .from('wedding_tables')
        .insert({
          name: addr.name,
          address: addr.address,
          unique_code: addr.unique_code,
          latitude: addr.latitude,
          longitude: addr.longitude,
        })

      if (error) {
        throw error
      }

      console.log(`✅ Imported "${addr.name}"`)
      successCount++
    } catch (error) {
      console.error(`❌ Failed to import "${addr.name}":`, error)
      errorCount++
    }
  }

  console.log('\n📊 Import Summary:')
  console.log(`   ✅ Successfully imported: ${successCount}`)
  console.log(`   ❌ Failed: ${errorCount}`)
  console.log(`   ⏭️  Skipped (duplicates): ${addresses.length - successCount - errorCount}`)
  console.log('\n🎉 Import complete!')
}

importAddresses()
  .catch((error) => {
    console.error('💥 Fatal error:', error)
    process.exit(1)
  })
