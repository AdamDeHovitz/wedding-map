import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

// Use service role key to bypass RLS for insertions
const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { tableId, message } = body

    if (!tableId) {
      return NextResponse.json(
        { error: 'Table ID is required' },
        { status: 400 }
      )
    }

    // Check if user preferences exist, create if not
    const { data: existingPrefs } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('email', session.user.email!)
      .single()

    if (!existingPrefs) {
      // Create user preferences with random meeple color
      const meepleColors = [
        '#7B2D26', '#2D5016', '#1E3A8A', '#F59E0B', '#6B21A8', '#DC2626',
        '#0D9488', '#EA580C', '#1E293B', '#84A98C', '#86198F', '#0EA5E9'
      ]
      const randomColor = meepleColors[Math.floor(Math.random() * meepleColors.length)]

      await supabase
        .from('user_preferences')
        .insert({
          email: session.user.email!,
          meeple_color: randomColor,
          display_name: session.user.name || null,
        })
    }

    // Get user's previous check-in (before this one)
    const { data: previousCheckins } = await supabase
      .from('guest_checkins')
      .select('*, wedding_tables(*)')
      .eq('guest_email', session.user.email!)
      .order('checked_in_at', { ascending: false })
      .limit(1)

    const previousCheckin = previousCheckins?.[0] || null

    // Insert the check-in
    const { data, error } = await supabase
      .from('guest_checkins')
      .insert({
        table_id: tableId,
        guest_email: session.user.email!,
        guest_name: session.user.name || 'Guest',
        message: message || null,
      })
      .select('*, wedding_tables(*)')
      .single()

    if (error) {
      // Handle duplicate check-in (unique constraint violation)
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'You have already checked in to this location' },
          { status: 409 }
        )
      }

      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to check in' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      checkin: data,
      previousCheckin: previousCheckin,
      meepleColor: existingPrefs?.meeple_color || null,
    })
  } catch (error) {
    console.error('Check-in error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
