import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import CheckinForm from '@/components/CheckinForm'

interface CheckinPageProps {
  params: {
    code: string
  }
}

export default async function CheckinPage({ params }: CheckinPageProps) {
  const { code } = params

  // Fetch the wedding table by unique code
  const { data: table, error } = await supabase
    .from('wedding_tables')
    .select('*')
    .eq('unique_code', code)
    .single()

  if (error || !table) {
    notFound()
  }

  // Fetch existing check-ins for this table
  const { data: checkins } = await supabase
    .from('guest_checkins')
    .select('*')
    .eq('table_id', table.id)
    .order('checked_in_at', { ascending: false })

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white p-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{table.name}</h1>
          <p className="text-lg text-gray-600">{table.address}</p>
        </div>

        <CheckinForm table={table} existingCheckins={checkins || []} />
      </div>
    </div>
  )
}
