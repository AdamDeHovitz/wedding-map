'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
}

export function CheckinDialog({ open, onOpenChange, table, requireCode = true }: CheckinDialogProps) {
  const router = useRouter()
  const [step, setStep] = useState<'code' | 'message'>(requireCode ? 'code' : 'message')
  const [code, setCode] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [codeError, setCodeError] = useState('')

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

      // Success! Close dialog and refresh
      onOpenChange(false)
      router.refresh()

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

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Reset state when closing
      setMessage('')
      setCode('')
      setCodeError('')
      setError('')
      setStep(requireCode ? 'code' : 'message')
    }
    onOpenChange(newOpen)
  }

  if (!table) return null

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
