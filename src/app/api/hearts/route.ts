import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { auth } from '@/auth'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * POST /api/hearts - Toggle a heart on a message
 * Adds a heart if user hasn't hearted, removes if they have
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'You must be signed in to heart messages' },
        { status: 401 }
      )
    }

    const { checkinId } = await request.json()

    if (!checkinId) {
      return NextResponse.json(
        { error: 'Checkin ID is required' },
        { status: 400 }
      )
    }

    const userEmail = session.user.email

    // Check if user has already hearted this message
    const { data: existingHeart } = await supabase
      .from('message_hearts')
      .select('id')
      .eq('checkin_id', checkinId)
      .eq('user_email', userEmail)
      .single()

    if (existingHeart) {
      // Remove the heart (unheart)
      const { error: deleteError } = await supabase
        .from('message_hearts')
        .delete()
        .eq('id', existingHeart.id)

      if (deleteError) {
        console.error('Error removing heart:', deleteError)
        return NextResponse.json(
          { error: 'Failed to remove heart' },
          { status: 500 }
        )
      }

      return NextResponse.json({ hearted: false })
    } else {
      // Add a heart
      const { error: insertError } = await supabase
        .from('message_hearts')
        .insert({
          checkin_id: checkinId,
          user_email: userEmail,
        })

      if (insertError) {
        console.error('Error adding heart:', insertError)
        return NextResponse.json(
          { error: 'Failed to add heart' },
          { status: 500 }
        )
      }

      return NextResponse.json({ hearted: true })
    }
  } catch (error) {
    console.error('Error toggling heart:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}
