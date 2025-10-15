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
    const { meepleColor, meepleStyle, preferredLanguage } = body

    // Fetch existing preferences
    const { data: existingPrefs } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('email', session.user.email)
      .single()

    // Build update object - merge with existing data
    const updateData: {
      email: string
      meeple_color: string
      meeple_style?: string
      preferred_language?: 'en' | 'cs'
      updated_at: string
    } = {
      email: session.user.email,
      meeple_color: existingPrefs?.meeple_color || '#7B2D26', // Use existing or default
      updated_at: new Date().toISOString(),
    }

    // Validate and add meeple color if provided
    if (meepleColor !== undefined) {
      if (typeof meepleColor !== 'string') {
        return NextResponse.json(
          { error: 'Invalid meeple color' },
          { status: 400 }
        )
      }
      updateData.meeple_color = meepleColor
    }

    // Validate and add meeple style if provided
    if (meepleStyle !== undefined) {
      if (!['3d', 'bride', 'groom'].includes(meepleStyle)) {
        return NextResponse.json(
          { error: 'Invalid meeple style' },
          { status: 400 }
        )
      }
      updateData.meeple_style = meepleStyle
    } else if (existingPrefs?.meeple_style) {
      // Preserve existing style
      updateData.meeple_style = existingPrefs.meeple_style
    }

    // Validate and add language preference if provided
    if (preferredLanguage !== undefined) {
      if (!['en', 'cs'].includes(preferredLanguage)) {
        return NextResponse.json(
          { error: 'Invalid language. Must be "en" or "cs"' },
          { status: 400 }
        )
      }
      updateData.preferred_language = preferredLanguage
    } else if (existingPrefs?.preferred_language) {
      // Preserve existing language
      updateData.preferred_language = existingPrefs.preferred_language
    }

    // Update user preferences
    const { error } = await supabase
      .from('user_preferences')
      .upsert(updateData)

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
