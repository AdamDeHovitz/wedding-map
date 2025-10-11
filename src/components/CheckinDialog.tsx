'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn, useSession } from 'next-auth/react'
import { WeddingTable } from '@/types/database'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

interface CheckinDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  table: WeddingTable | null
  requireCode?: boolean // If false, skip code verification (for QR code flow)
  onCheckinSuccess?: (data: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    checkin: any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    previousCheckin: any | null
    meepleColor: string | null
  }) => void
}

export function CheckinDialog({ open, onOpenChange, table, requireCode = true, onCheckinSuccess }: CheckinDialogProps) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [step, setStep] = useState<'code' | 'message'>(requireCode ? 'code' : 'message')
  const [code, setCode] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [codeError, setCodeError] = useState('')

  // Username login state
  const [username, setUsername] = useState('')
  const [usernameError, setUsernameError] = useState('')

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setCodeError('')

    if (!table) return

    // Verify the code matches the table's unique code
    if (code.toLowerCase().trim() === table.unique_code.toLowerCase()) {
      setStep('message')
    } else {
      setCodeError('Invalid code. Please try again.')
    }
  }

  const handleMessageSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    if (!table) return

    try {
      const response = await fetch('/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tableId: table.id,
          message: message.trim(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to check in')
      }

      // Success! Trigger animation if callback provided
      if (onCheckinSuccess) {
        onCheckinSuccess({
          checkin: data.checkin,
          previousCheckin: data.previousCheckin,
          meepleColor: data.meepleColor,
        })
      }

      // Close dialog
      onOpenChange(false)

      // Delay refresh to allow animation to play
      // If there's travel animation, wait longer
      const hasTravel = data.previousCheckin && data.previousCheckin.wedding_tables
      const delay = hasTravel ? 13000 : 1000 // 13 seconds for travel (max 12s animation + 1s buffer), 1 second for drop

      setTimeout(() => {
        router.refresh()
      }, delay)

      // Reset state
      setMessage('')
      setCode('')
      setStep(requireCode ? 'code' : 'message')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
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

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Reset state when closing
      setMessage('')
      setCode('')
      setCodeError('')
      setError('')
      setUsername('')
      setUsernameError('')
      setStep(requireCode ? 'code' : 'message')
    }
    onOpenChange(newOpen)
  }

  if (!table) return null

  // Show loading state while checking authentication
  if (status === 'loading') {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          <div className="flex items-center justify-center p-8">
            <p className="text-gray-600">Loading...</p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  // Show sign-in prompt if not authenticated
  if (!session) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif">Sign In to Check In</DialogTitle>
            <DialogDescription>
              Sign in with Google or choose a username to leave your mark at {table.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <Button
              onClick={() => signIn('google', { callbackUrl: window.location.href })}
              className="w-full"
              size="lg"
            >
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
              <label htmlFor="username-dialog" className="text-sm font-medium">
                Choose a Username
              </label>
              <Input
                id="username-dialog"
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
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif">
            {step === 'code' ? 'Verify Location' : table.name}
          </DialogTitle>
          <DialogDescription>
            {step === 'code'
              ? 'Enter the code from this location to check in'
              : table.address
            }
          </DialogDescription>
        </DialogHeader>

        {step === 'code' ? (
          <form onSubmit={handleCodeSubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Enter location code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="text-lg"
                autoFocus
              />
              {codeError && (
                <p className="text-sm text-red-600">{codeError}</p>
              )}
            </div>
            <Button type="submit" className="w-full" size="lg">
              Verify Code
            </Button>
          </form>
        ) : (
          <form onSubmit={handleMessageSubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Textarea
                placeholder="Leave a message about your visit... (optional)"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="resize-none"
                autoFocus
              />
              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Checking in...' : 'Check In'}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
