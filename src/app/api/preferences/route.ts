import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { createClient } from '@supabase/supabase-js'

// Use service role key to bypass RLS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function PATCH(request: Request) {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { meepleColor, meepleStyle } = body

    // Validate inputs
    if (!meepleColor || typeof meepleColor !== 'string') {
      return NextResponse.json(
        { error: 'Invalid meeple color' },
        { status: 400 }
      )
    }

    if (meepleStyle && !['3d', 'flat'].includes(meepleStyle)) {
      return NextResponse.json(
        { error: 'Invalid meeple style. Must be "3d" or "flat"' },
        { status: 400 }
      )
    }

    // Update user preferences
    const { error } = await supabase
      .from('user_preferences')
      .upsert({
        email: session.user.email,
        meeple_color: meepleColor,
        meeple_style: meepleStyle || '3d',
        updated_at: new Date().toISOString(),
      })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to update preferences' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Preferences update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
