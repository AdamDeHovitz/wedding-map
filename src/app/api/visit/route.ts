import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { createClient } from '@supabase/supabase-js'

// Use service role key to bypass RLS for updates
const supabase = createClient(
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
    const { tableId } = body

    if (!tableId) {
      return NextResponse.json(
        { error: 'Table ID is required' },
        { status: 400 }
      )
    }

    // Verify the table exists
    const { data: table, error: tableError } = await supabase
      .from('wedding_tables')
      .select('*')
      .eq('id', tableId)
      .single()

    if (tableError || !table) {
      return NextResponse.json(
        { error: 'Table not found' },
        { status: 404 }
      )
    }

    // Verify user has checked in to this location before
    const { data: existingCheckin } = await supabase
      .from('guest_checkins')
      .select('*')
      .eq('guest_email', session.user.email!)
      .eq('table_id', tableId)
      .single()

    if (!existingCheckin) {
      return NextResponse.json(
        { error: 'You must check in to a location before you can visit it' },
        { status: 403 }
      )
    }

    // Get user's current location (before the visit)
    const { data: userPrefs } = await supabase
      .from('user_preferences')
      .select('*, wedding_tables!user_preferences_current_location_id_fkey(*)')
      .eq('email', session.user.email!)
      .single()

    const previousLocation = userPrefs?.wedding_tables || null

    // Update the user's current location
    const { error: updateError } = await supabase
      .from('user_preferences')
      .update({ current_location_id: tableId })
      .eq('email', session.user.email!)

    if (updateError) {
      console.error('Error updating current location:', updateError)
      return NextResponse.json(
        { error: 'Failed to update location' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      newLocation: table,
      previousLocation: previousLocation,
      meepleColor: userPrefs?.meeple_color || null,
    })
  } catch (error) {
    console.error('Visit error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
