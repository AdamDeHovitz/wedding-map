import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { createClient } from '@supabase/supabase-js'

// Use service role key to bypass RLS for queries
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * GET /api/message-reads
 * Fetch all checkin IDs that the current user has read
 */
export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Fetch all checkin IDs that this user has marked as read
    const { data, error } = await supabase
      .from('message_reads')
      .select('checkin_id')
      .eq('reader_email', session.user.email)

    if (error) {
      console.error('Error fetching message reads:', error)
      return NextResponse.json(
        { error: 'Failed to fetch read messages' },
        { status: 500 }
      )
    }

    // Return array of checkin IDs
    const readCheckinIds = data.map(read => read.checkin_id)

    return NextResponse.json({
      success: true,
      readCheckinIds,
    })
  } catch (error) {
    console.error('Message reads GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/message-reads
 * Mark a checkin message as read by the current user
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { checkinId } = body

    if (!checkinId) {
      return NextResponse.json(
        { error: 'Checkin ID is required' },
        { status: 400 }
      )
    }

    // Verify the checkin exists
    const { data: checkinData, error: checkinError } = await supabase
      .from('guest_checkins')
      .select('id')
      .eq('id', checkinId)
      .single()

    if (checkinError || !checkinData) {
      return NextResponse.json(
        { error: 'Checkin not found' },
        { status: 404 }
      )
    }

    // Mark as read (will be ignored if already read due to UNIQUE constraint)
    const { error: insertError } = await supabase
      .from('message_reads')
      .insert({
        reader_email: session.user.email,
        checkin_id: checkinId,
      })

    // Ignore duplicate key errors (user already marked as read)
    if (insertError && insertError.code !== '23505') {
      console.error('Error marking message as read:', insertError)
      return NextResponse.json(
        { error: 'Failed to mark message as read' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.error('Message reads POST error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
