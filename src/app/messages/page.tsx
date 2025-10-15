import { createClient } from '@supabase/supabase-js'
import { auth } from '@/auth'
import { MessagesFeed } from '@/components/MessagesFeed'
import { WeddingTable } from '@/types/database'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function MessagesPage() {
  const session = await auth()
  const t = await getTranslations('messages')
  const tCommon = await getTranslations('common')

  // Fetch all check-ins with messages, ordered by most recent
  const { data: checkins } = await supabase
    .from('guest_checkins')
    .select('*')
    .order('checked_in_at', { ascending: false })

  // Fetch all wedding tables
  const { data: tables } = await supabase
    .from('wedding_tables')
    .select('*')

  // Add Rule of Thirds venue
  const ruleOfThirdsVenue: WeddingTable = {
    id: 'rule-of-thirds',
    name: 'Rule of Thirds',
    address: '171 Banker St, Brooklyn, NY 11222',
    unique_code: 'rule-of-thirds',
    latitude: 40.7292,
    longitude: -73.9586,
    icon_filename: 'rule-of-thirds',
    description: 'The venue where Anna & Adam are getting married and celebrating with all of you!',
    description_cs: 'Místo, kde se Anna a Adam berou a slaví s vámi všemi!',
    created_at: new Date().toISOString()
  }

  const allTables = [...(tables || []), ruleOfThirdsVenue]

  // Fetch user preferences for meeple colors
  const { data: userPreferences } = await supabase
    .from('user_preferences')
    .select('*')

  // Fetch all hearts
  const { data: hearts } = await supabase
    .from('message_hearts')
    .select('*')

  // Fetch user's hearts if logged in
  let userHearts: string[] = []
  if (session?.user?.email) {
    const { data } = await supabase
      .from('message_hearts')
      .select('checkin_id')
      .eq('user_email', session.user.email)

    userHearts = data?.map(h => h.checkin_id) || []
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9F7F4] to-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#7B2D26] to-[#6B1D16] text-[#F5E6D3] py-8 px-4 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#F5E6D3] hover:text-white transition-colors mb-4 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-sans">{tCommon('backToMap')}</span>
          </Link>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-center">
            {t('title')}
          </h1>
          <p className="text-center mt-3 font-sans text-[#E8D4BB] text-lg">
            {t('subtitle')}
          </p>
        </div>
      </div>

      {/* Messages Feed */}
      <MessagesFeed
        checkins={checkins || []}
        tables={allTables}
        userPreferences={userPreferences || []}
        hearts={hearts || []}
        userHearts={userHearts}
        currentUserEmail={session?.user?.email || null}
      />
    </div>
  )
}
