import { supabase } from '@/lib/supabase'
import WeddingMap from '@/components/WeddingMap'

export default async function Home() {
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

  return (
    <div className="relative">
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
        <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
          <h1 className="text-xl font-bold text-gray-900">Our Special Places</h1>
        </div>
      </div>

      <WeddingMap
        tables={tables || []}
        checkins={checkins || []}
        userPreferences={userPreferences || []}
      />
    </div>
  )
}
