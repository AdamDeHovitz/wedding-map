import { describe, it, expect } from 'vitest'
import { createClient } from '@supabase/supabase-js'

/**
 * CRITICAL: Seating Chart Table Name Validation
 *
 * This test ensures that ALL table names in SeatingChart.tsx EXACTLY match
 * the table names in the database. This is essential because:
 *
 * 1. The seating chart checks if tables are visited by matching names
 * 2. Even small differences (e.g., "Ave" vs "Avenue", "W" vs "West") break the matching
 * 3. This bug has occurred multiple times and causes confusion for users
 *
 * HOW TO FIX IF THIS TEST FAILS:
 * 1. Run: npx tsx scripts/check-table-names.ts
 * 2. Copy the EXACT names from the database output
 * 3. Update SeatingChart.tsx with the exact names (case-sensitive!)
 * 4. Pay special attention to:
 *    - "Avenue" vs "Ave"
 *    - "Road" vs no suffix
 *    - "West" vs "W"
 *    - Spacing and capitalization
 */

describe('SeatingChart Table Names', () => {
  // All table names hardcoded in SeatingChart.tsx
  // IMPORTANT: Update this list whenever you modify SeatingChart.tsx
  const seatingChartTableNames = [
    'Seaview Terrace',
    'State Street',
    'Baltic Street',
    'Connecticut Avenue',
    'Boerum Place',
    'River Heights Road',
    'Lakewood Drive',
    'College Avenue',
    'Nerudova Street',
    'Topping Drive',
    'West 115th Street',
    'Waterman Street',
    'John Street',
    'Clark Street',
    'West 53rd Street',
  ]

  it('should have all SeatingChart table names match database table names exactly', async () => {
    // Fetch actual table names from database
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: tables, error } = await supabase
      .from('wedding_tables')
      .select('name')
      .order('name')

    expect(error).toBeNull()
    expect(tables).toBeDefined()

    const databaseTableNames = tables!.map(t => t.name).sort()

    // Sort both arrays for comparison
    const sortedSeatingChartNames = [...seatingChartTableNames].sort()

    // Check if all seating chart names exist in database
    sortedSeatingChartNames.forEach(name => {
      expect(databaseTableNames).toContain(name)
    })

    // Check if we have the right count (excluding Rule of Thirds which is hardcoded separately)
    expect(sortedSeatingChartNames).toHaveLength(databaseTableNames.length)

    // Provide helpful error message if there's a mismatch
    const missingInDatabase = sortedSeatingChartNames.filter(
      name => !databaseTableNames.includes(name)
    )
    const missingInSeatingChart = databaseTableNames.filter(
      name => !sortedSeatingChartNames.includes(name)
    )

    if (missingInDatabase.length > 0) {
      console.error('❌ Names in SeatingChart but NOT in database:')
      missingInDatabase.forEach(name => console.error(`   "${name}"`))
    }

    if (missingInSeatingChart.length > 0) {
      console.error('❌ Names in database but NOT in SeatingChart:')
      missingInSeatingChart.forEach(name => console.error(`   "${name}"`))
    }

    expect(missingInDatabase).toHaveLength(0)
    expect(missingInSeatingChart).toHaveLength(0)
  })

  it('should document the importance of exact name matching', () => {
    // This test documents why exact matching is critical

    const example = {
      seatingChartName: 'College Ave',
      databaseName: 'College Avenue',
      result: 'College Ave' === 'College Avenue', // false!
    }

    expect(example.result).toBe(false)

    // When names don't match, the isVisited check in SeatingChart.tsx
    // returns false even though the user HAS visited that table
    // This breaks the UI and confuses users

    // The fix: ALWAYS use the exact database name in SeatingChart.tsx
  })
})
