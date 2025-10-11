import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import WeddingMap from '@/components/WeddingMap'
import { WeddingTable } from '@/types/database'

interface CheckinPageProps {
  params: Promise<{
    code: string
  }>
}

export default async function CheckinPage({ params }: CheckinPageProps) {
  const { code } = await params

  // Fetch the wedding table by unique code
  const { data: table, error } = await supabase
    .from('wedding_tables')
    .select('*')
    .eq('unique_code', code)
    .single()

  if (error || !table) {
    notFound()
  }

  // Fetch all tables for the map
  const { data: tables } = await supabase
    .from('wedding_tables')
    .select('*')
    .order('name')

  // Fetch all check-ins
  const { data: checkins } = await supabase
    .from('guest_checkins')
    .select('*')
    .order('checked_in_at', { ascending: false })

  // Fetch all user preferences
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
    created_at: new Date().toISOString()
  }

  const allTables = [...(tables || []), ruleOfThirdsVenue]

  return (
    <div className="relative">
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] px-4 w-full max-w-md pointer-events-none">
        <div className="bg-white/90 backdrop-blur-sm px-4 sm:px-6 py-3 sm:py-4 rounded-full shadow-lg pointer-events-auto">
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#7B2D26] text-center">{table.name}</h1>
        </div>
      </div>

      <WeddingMap
        tables={allTables}
        checkins={checkins || []}
        userPreferences={userPreferences || []}
        initialTable={table}
        showCheckinDialog={true}
      />
    </div>
  )
}
