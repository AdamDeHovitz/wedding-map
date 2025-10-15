'use client'

import { useOnlineStatus } from '@/hooks/useOnlineStatus'
import { useEffect, useState } from 'react'

/**
 * Connection status banner
 * Shows when offline or when reconnecting
 */
export function ConnectionBanner() {
  const { isOnline, wasOffline } = useOnlineStatus()
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!isOnline) {
      setShow(true)
    } else if (wasOffline) {
      // Show "reconnected" briefly
      setShow(true)
      const timer = setTimeout(() => setShow(false), 3000)
      return () => clearTimeout(timer)
    } else {
      setShow(false)
    }
  }, [isOnline, wasOffline])

  if (!show) return null

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 px-4 py-3 text-center text-sm font-medium transition-all ${
        isOnline
          ? 'bg-green-600 text-white'
          : 'bg-amber-500 text-white'
      }`}
      role="alert"
    >
      {isOnline ? (
        <span>✓ Back online</span>
      ) : (
        <span>Connection lost - some features may not work</span>
      )}
    </div>
  )
}
