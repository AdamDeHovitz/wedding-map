import { notFound, redirect } from 'next/navigation'
import { supabase } from '@/lib/supabase'

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

  // Redirect to main page with checkin query parameter
  redirect(`/?checkin=${table.id}`)
}
