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
      // Create user preferences with default avatar seed
      const defaultAvatarSeed = session.user.email || Math.random().toString()
      await supabase
        .from('user_preferences')
        .insert({
          email: session.user.email!,
          avatar_seed: defaultAvatarSeed,
          display_name: session.user.name || null,
        })
    }

    // Insert the check-in
    const { data, error } = await supabase
      .from('guest_checkins')
      .insert({
        table_id: tableId,
        guest_email: session.user.email!,
        guest_name: session.user.name || 'Guest',
        message: message || null,
      })
      .select()
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

    return NextResponse.json({ success: true, checkin: data })
  } catch (error) {
    console.error('Check-in error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
