import { notFound, redirect } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface CheckinPageProps {
  params: Promise<{
    code: string
  }>
}

export default async function CheckinPage({ params }: CheckinPageProps) {
  const { code } = await params

  // Code redirect mapping - keeps old QR codes working after code changes
  const codeRedirects: Record<string, string> = {
    'cannabispinoy': 'promenade',      // Clark Street old -> new
    'hoyt-schermerhorn': 'lovelove',   // State Street old -> new
    'mertz': 'mccabe',                 // Swarthmore old -> new
  }

  // If this is an old code, redirect to the new code
  const actualCode = codeRedirects[code] || code

  // Fetch the wedding table by unique code
  const { data: table, error } = await supabase
    .from('wedding_tables')
    .select('*')
    .eq('unique_code', actualCode)
    .single()

  if (error || !table) {
    notFound()
  }

  // Redirect to main page with checkin query parameter
  redirect(`/?checkin=${table.id}`)
}
