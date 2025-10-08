import { createClient } from '@supabase/supabase-js'
import WeddingMap from '@/components/WeddingMap'
import { WeddingTable } from '@/types/database'
import { auth } from '@/auth'

// Use service role key to bypass RLS for reading all data
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function Home() {
  // Get current user session
  const session = await auth()

  // Fetch all wedding tables
  const { data: tables } = await supabase
    .from('wedding_tables')
    .select('*')
    .order('name')

  // Fetch all check-ins
  const { data: checkins } = await supabase
    .from('guest_checkins')
    .select('*')
    .order('checked_in_at', { ascending: false })

  // Fetch all user preferences for avatars
  const { data: userPreferences } = await supabase
    .from('user_preferences')
    .select('*')

  // Add hardcoded Rule of Thirds venue
  const ruleOfThirdsVenue: WeddingTable = {
    id: 'rule-of-thirds',
    name: 'Rule of Thirds',
    address: '171 Banker St, Brooklyn, NY 11222',
    unique_code: 'rule-of-thirds',
    latitude: 40.7292,
    longitude: -73.9586,
    created_at: new Date().toISOString()
  }

  const allTables = [...(tables || []), ruleOfThirdsVenue]

  return (
    <div className="relative">
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 px-4 w-full max-w-md">
        <div className="bg-white/90 backdrop-blur-sm px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-lg">
          <h1 className="text-lg sm:text-xl font-bold text-gray-900 text-center">Our Special Places</h1>
        </div>
      </div>

      <WeddingMap
        tables={allTables}
        checkins={checkins || []}
        userPreferences={userPreferences || []}
        currentUserEmail={session?.user?.email || null}
      />
    </div>
  )
}
