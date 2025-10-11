'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { signIn, useSession } from 'next-auth/react'
import { WeddingTable, GuestCheckin, UserPreferences } from '@/types/database'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Meeple } from '@/components/Meeple'
import { supabase } from '@/lib/supabase'

interface CheckinFormProps {
  table: WeddingTable
  existingCheckins: GuestCheckin[]
}

export default function CheckinForm({ table, existingCheckins }: CheckinFormProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [userPreferences, setUserPreferences] = useState<UserPreferences[]>([])

  // Username login state
  const [username, setUsername] = useState('')
  const [usernameError, setUsernameError] = useState('')

  // Fetch user preferences for displaying avatars
  useEffect(() => {
    async function fetchPreferences() {
      const { data } = await supabase
        .from('user_preferences')
        .select('*')

      if (data) {
        setUserPreferences(data)
      }
    }
    fetchPreferences()
  }, [])

  // Create a map of email -> meeple_color for quick lookup
  const meepleColorMap = new Map(
    userPreferences.map(pref => [pref.email, pref.meeple_color])
  )

  const getMeepleColor = (email: string) => {
    return meepleColorMap.get(email) || '#7B2D26' // Default to burgundy
  }

  const handleSignIn = async () => {
    await signIn('google', { callbackUrl: window.location.href })
  }

  /**
   * Handle username-based sign-in
   *
   * IMPORTANT: Usernames are stored in the 'email' field in the database.
   * This allows users without Gmail to participate. See src/auth.ts for details.
   */
  const handleUsernameSignIn = async () => {
    setUsernameError('')

    // Client-side validation (server validates too)
    const trimmedUsername = username.trim()

    if (!trimmedUsername) {
      setUsernameError('Username is required')
      return
    }

    if (trimmedUsername.includes('@')) {
      setUsernameError('Username cannot contain @ symbol')
      return
    }

    if (trimmedUsername.length < 3) {
      setUsernameError('Username must be at least 3 characters')
      return
    }

    if (trimmedUsername.length > 30) {
      setUsernameError('Username must be 30 characters or less')
      return
    }

    const validPattern = /^[a-zA-Z0-9_-]+$/
    if (!validPattern.test(trimmedUsername)) {
      setUsernameError('Username can only contain letters, numbers, underscores, and dashes')
      return
    }

    try {
      await signIn('credentials', {
        username: trimmedUsername,
        callbackUrl: window.location.href
      })
    } catch (err) {
      setUsernameError('Sign in failed. Please try again.')
      console.error('Username sign in error:', err)
    }
  }

  const handleCheckin = async () => {
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tableId: table.id,
          message: message.trim() || null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to check in')
        setIsSubmitting(false)
        return
      }

      setSuccess(true)

      // Redirect to main map after successful check-in
      setTimeout(() => {
        router.push('/')
      }, 2000)
    } catch {
      setError('Something went wrong. Please try again.')
      setIsSubmitting(false)
    }
  }

  // Check if current user has already checked in
  const hasCheckedIn = existingCheckins.some(
    checkin => checkin.guest_email === session?.user?.email
  )

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-600">Loading...</p>
      </div>
    )
  }

  if (success) {
    return (
      <Card className="border-2 border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="text-green-800">Successfully Checked In!</CardTitle>
          <CardDescription>
            Your meeple has been placed at {table.address}. Redirecting to the map...
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (!session) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sign In to Check In</CardTitle>
          <CardDescription>
            Sign in with Google or choose a username to leave your mark at this location
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleSignIn} className="w-full" size="lg">
            Sign In with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium">
              Choose a Username
            </label>
            <Input
              id="username"
              type="text"
              placeholder="your_username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleUsernameSignIn()
                }
              }}
              className={usernameError ? 'border-red-500' : ''}
            />
            {usernameError && (
              <p className="text-sm text-red-600">{usernameError}</p>
            )}
            <p className="text-xs text-gray-500">
              3-30 characters. Letters, numbers, dashes, and underscores only. No @ symbol.
            </p>
          </div>

          <Button
            onClick={handleUsernameSignIn}
            variant="outline"
            className="w-full"
            size="lg"
            disabled={!username.trim()}
          >
            Continue as {username.trim() || 'username'}
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (hasCheckedIn) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Already Checked In</CardTitle>
          <CardDescription>
            You&apos;ve already checked in to this location!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => router.push('/')} className="w-full">
            View All Locations on Map
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Check In</CardTitle>
          <CardDescription>
            Leave an optional message and place your meeple at this special location
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
              Message (Optional)
            </label>
            <Textarea
              id="message"
              placeholder="Share a memory or thought about this place..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={280}
              rows={3}
              className="resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">{message.length}/280 characters</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded">
            <div className="flex-shrink-0">
              <Meeple color={getMeepleColor(session.user?.email || '')} size={40} />
            </div>
            <div>
              <p className="font-medium text-sm">{session.user?.name}</p>
              <p className="text-xs text-gray-600">{session.user?.email}</p>
            </div>
          </div>

          <Button
            onClick={handleCheckin}
            disabled={isSubmitting}
            className="w-full"
            size="lg"
          >
            {isSubmitting ? 'Checking in...' : 'Check In'}
          </Button>
        </CardContent>
      </Card>

      {/* Show existing check-ins */}
      {existingCheckins.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {existingCheckins.length} Guest{existingCheckins.length !== 1 ? 's' : ''} Visited
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {existingCheckins.slice(0, 5).map((checkin) => (
                <div key={checkin.id} className="flex items-start gap-3 p-2 bg-gray-50 rounded">
                  <div className="flex-shrink-0">
                    <Meeple color={getMeepleColor(checkin.guest_email)} size={32} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{checkin.guest_name}</p>
                    {checkin.message && (
                      <p className="text-sm text-gray-600 italic mt-1">&quot;{checkin.message}&quot;</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(checkin.checked_in_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
              {existingCheckins.length > 5 && (
                <p className="text-sm text-gray-500 text-center">
                  And {existingCheckins.length - 5} more...
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
