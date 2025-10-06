import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import WeddingMap from '@/components/WeddingMap'

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

  return (
    <div className="relative">
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 px-4 w-full max-w-md">
        <div className="bg-white/90 backdrop-blur-sm px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-lg">
          <h1 className="text-lg sm:text-xl font-bold text-gray-900 text-center">{table.name}</h1>
        </div>
      </div>

      <WeddingMap
        tables={tables || []}
        checkins={checkins || []}
        userPreferences={userPreferences || []}
        initialTable={table}
        showCheckinDialog={true}
      />
    </div>
  )
}
