import { createClient } from '@supabase/supabase-js'
import WeddingMap from '@/components/WeddingMap'
import { WeddingTable } from '@/types/database'
import { auth } from '@/auth'
import Link from 'next/link'
import { Settings, MessageCircleHeart } from 'lucide-react'

// Use service role key to bypass RLS for reading all data
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface HomeProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Home({ searchParams }: HomeProps) {
  // Get current user session
  const session = await auth()

  // Get search params
  const params = searchParams ? await searchParams : {}
  const checkinTableId = params?.checkin as string | undefined

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
    icon_filename: 'rule-of-thirds',
    description: 'The venue where Anna & Adam are getting married and celebrating with all of you!',
    created_at: new Date().toISOString()
  }

  const allTables = [...(tables || []), ruleOfThirdsVenue]

  // Find the initial table if checkin parameter is provided
  const initialTable = checkinTableId
    ? allTables.find(t => t.id === checkinTableId) || null
    : null

  // Determine the header title
  const headerTitle = initialTable ? initialTable.name : 'Our Special Places'

  return (
    <div className="relative">
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] px-4 w-full max-w-md pointer-events-none">
        <div className="bg-white/90 backdrop-blur-sm px-4 sm:px-6 py-3 sm:py-4 rounded-full shadow-lg relative pointer-events-auto">
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#7B2D26] text-center">{headerTitle}</h1>
          {session?.user && (
            <>
              <Link
                href="/settings"
                className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 p-2 hover:bg-[#7B2D26]/10 rounded-full transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Settings"
              >
                <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-[#7B2D26]" />
              </Link>
              <Link
                href="/messages"
                className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-[#7B2D26]/10 rounded-full transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Messages"
              >
                <MessageCircleHeart className="w-5 h-5 sm:w-6 sm:h-6 text-[#7B2D26]" />
              </Link>
            </>
          )}
        </div>
      </div>

      <WeddingMap
        tables={allTables}
        checkins={checkins || []}
        userPreferences={userPreferences || []}
        currentUserEmail={session?.user?.email || null}
        initialTable={initialTable}
        showCheckinDialog={!!initialTable}
      />
    </div>
  )
}
