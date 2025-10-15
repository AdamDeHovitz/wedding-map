'use client'

import { useState } from 'react'
import { GuestCheckin, WeddingTable, UserPreferences, MessageHeart } from '@/types/database'
import { Meeple } from '@/components/Meeple'
import { Heart, MapPin, Calendar } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface MessagesFeedProps {
  checkins: GuestCheckin[]
  tables: WeddingTable[]
  userPreferences: UserPreferences[]
  hearts: MessageHeart[]
  userHearts: string[]
  currentUserEmail: string | null
}

type SortOption = 'recent' | 'hearts'
type FilterOption = 'all' | 'with-message'

export function MessagesFeed({
  checkins,
  tables,
  userPreferences,
  hearts: initialHearts,
  userHearts: initialUserHearts,
  currentUserEmail,
}: MessagesFeedProps) {
  const [sortBy, setSortBy] = useState<SortOption>('recent')
  const [filterBy, setFilterBy] = useState<FilterOption>('all')
  const [hearts, setHearts] = useState(initialHearts)
  const [userHearts, setUserHearts] = useState<Set<string>>(new Set(initialUserHearts))
  const [animatingHearts, setAnimatingHearts] = useState<Set<string>>(new Set())

  // Create lookup maps
  const tableMap = new Map(tables.map(t => [t.id, t]))
  const userPrefMap = new Map(userPreferences.map(p => [p.email, p]))
  const heartCountMap = new Map<string, number>()

  hearts.forEach(heart => {
    heartCountMap.set(heart.checkin_id, (heartCountMap.get(heart.checkin_id) || 0) + 1)
  })

  // Get meeple color for user
  const getMeepleColor = (email: string) => {
    return userPrefMap.get(email)?.meeple_color || '#7B2D26'
  }

  // Get meeple style for user
  const getMeepleStyle = (email: string): '3d' | 'flat' | 'bride' | 'groom' => {
    if (email === 'ascheibmeir12@gmail.com') return 'bride'
    if (email === 'adam.dehovitz@gmail.com') return 'groom'
    return (userPrefMap.get(email)?.meeple_style as '3d' | 'flat') || '3d'
  }

  // Handle heart toggle
  const handleHeartToggle = async (checkinId: string) => {
    if (!currentUserEmail) {
      alert('Please sign in to heart messages')
      return
    }

    // Optimistic UI update
    const isHearted = userHearts.has(checkinId)
    const newUserHearts = new Set(userHearts)

    if (isHearted) {
      newUserHearts.delete(checkinId)
      setHearts(hearts.filter(h => !(h.checkin_id === checkinId && h.user_email === currentUserEmail)))
    } else {
      newUserHearts.add(checkinId)
      setHearts([...hearts, {
        id: `temp-${Date.now()}`,
        checkin_id: checkinId,
        user_email: currentUserEmail,
        created_at: new Date().toISOString()
      }])

      // Trigger animation
      setAnimatingHearts(new Set([...animatingHearts, checkinId]))
      setTimeout(() => {
        setAnimatingHearts(prev => {
          const next = new Set(prev)
          next.delete(checkinId)
          return next
        })
      }, 600)
    }

    setUserHearts(newUserHearts)

    // Send to API
    try {
      await fetch('/api/hearts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ checkinId }),
      })
    } catch (error) {
      console.error('Error toggling heart:', error)
      // Revert on error
      setUserHearts(userHearts)
      setHearts(initialHearts)
    }
  }

  // Filter checkins
  let filteredCheckins = checkins
  if (filterBy === 'with-message') {
    filteredCheckins = checkins.filter(c => c.message && c.message.trim())
  }

  // Sort checkins
  const sortedCheckins = [...filteredCheckins].sort((a, b) => {
    if (sortBy === 'hearts') {
      const aHearts = hearts.filter(h => h.checkin_id === a.id).length
      const bHearts = hearts.filter(h => h.checkin_id === b.id).length
      return bHearts - aHearts
    }
    // Default: recent
    return new Date(b.checked_in_at).getTime() - new Date(a.checked_in_at).getTime()
  })

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8 bg-white p-4 rounded-2xl shadow-sm border border-[#E8D4BB]">
        <div className="flex gap-2 items-center">
          <span className="text-sm font-semibold text-[#7B2D26] font-sans">Sort:</span>
          <button
            onClick={() => setSortBy('recent')}
            className={`px-4 py-2 rounded-lg font-sans text-sm transition-all ${
              sortBy === 'recent'
                ? 'bg-[#7B2D26] text-[#F5E6D3] shadow-md'
                : 'bg-[#F9F7F4] text-[#7B2D26] hover:bg-[#E8D4BB]'
            }`}
          >
            Most Recent
          </button>
          <button
            onClick={() => setSortBy('hearts')}
            className={`px-4 py-2 rounded-lg font-sans text-sm transition-all ${
              sortBy === 'hearts'
                ? 'bg-[#7B2D26] text-[#F5E6D3] shadow-md'
                : 'bg-[#F9F7F4] text-[#7B2D26] hover:bg-[#E8D4BB]'
            }`}
          >
            Most Hearts
          </button>
        </div>

        <div className="flex gap-2 items-center">
          <span className="text-sm font-semibold text-[#7B2D26] font-sans">Show:</span>
          <button
            onClick={() => setFilterBy('all')}
            className={`px-4 py-2 rounded-lg font-sans text-sm transition-all ${
              filterBy === 'all'
                ? 'bg-[#7B2D26] text-[#F5E6D3] shadow-md'
                : 'bg-[#F9F7F4] text-[#7B2D26] hover:bg-[#E8D4BB]'
            }`}
          >
            All Check-ins
          </button>
          <button
            onClick={() => setFilterBy('with-message')}
            className={`px-4 py-2 rounded-lg font-sans text-sm transition-all ${
              filterBy === 'with-message'
                ? 'bg-[#7B2D26] text-[#F5E6D3] shadow-md'
                : 'bg-[#F9F7F4] text-[#7B2D26] hover:bg-[#E8D4BB]'
            }`}
          >
            With Messages
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="space-y-4">
        {sortedCheckins.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-2xl font-serif text-[#7B2D26] mb-2">No messages yet</p>
            <p className="text-gray-600 font-sans">
              {filterBy === 'with-message'
                ? 'Try viewing all check-ins'
                : 'Be the first to check in and leave a message!'}
            </p>
          </div>
        ) : (
          sortedCheckins.map(checkin => {
            const table = tableMap.get(checkin.table_id)
            const heartCount = hearts.filter(h => h.checkin_id === checkin.id).length
            const isHearted = userHearts.has(checkin.id)
            const isAnimating = animatingHearts.has(checkin.id)

            return (
              <div
                key={checkin.id}
                className="bg-white rounded-2xl shadow-sm border border-[#E8D4BB] p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex gap-4">
                  {/* Meeple */}
                  <div className="flex-shrink-0">
                    <Meeple
                      color={getMeepleColor(checkin.guest_email)}
                      size={48}
                      style={getMeepleStyle(checkin.guest_email)}
                      className="drop-shadow-lg"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <h3 className="font-semibold text-lg text-[#7B2D26] font-sans">
                          {checkin.guest_name}
                        </h3>
                        {table && (
                          <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                            <MapPin className="w-4 h-4" />
                            <span className="font-sans">{table.name}</span>
                          </div>
                        )}
                      </div>

                      {/* Heart button */}
                      <button
                        onClick={() => handleHeartToggle(checkin.id)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all ${
                          isHearted
                            ? 'bg-red-50 text-red-600 hover:bg-red-100'
                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                        } ${isAnimating ? 'animate-bounce' : ''}`}
                        disabled={!currentUserEmail}
                      >
                        <Heart
                          className={`w-5 h-5 transition-all ${
                            isHearted ? 'fill-current' : ''
                          } ${isAnimating ? 'scale-125' : ''}`}
                        />
                        <span className="font-sans font-semibold">{heartCount}</span>
                      </button>
                    </div>

                    {/* Message */}
                    {checkin.message && (
                      <p className="text-gray-700 font-sans leading-relaxed mb-3 italic">
                        &quot;{checkin.message}&quot;
                      </p>
                    )}

                    {/* Timestamp */}
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      <span className="font-sans">
                        {formatDistanceToNow(new Date(checkin.checked_in_at), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
