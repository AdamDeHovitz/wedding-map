'use client'

import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

interface AvatarCustomizerProps {
  userEmail: string
  currentSeed: string
}

// Available avatar styles from DiceBear
const AVATAR_STYLES = [
  { id: 'avataaars', name: 'Avataaars (Cartoon)' },
  { id: 'adventurer', name: 'Adventurer' },
  { id: 'bottts', name: 'Robots' },
  { id: 'fun-emoji', name: 'Fun Emoji' },
  { id: 'lorelei', name: 'Lorelei (Female)' },
  { id: 'micah', name: 'Micah (Simple)' },
  { id: 'miniavs', name: 'Mini Avatars' },
  { id: 'pixel-art', name: 'Pixel Art' },
]

export default function AvatarCustomizer({ userEmail, currentSeed }: AvatarCustomizerProps) {
  const router = useRouter()
  const [avatarSeed, setAvatarSeed] = useState(currentSeed)
  const [selectedStyle, setSelectedStyle] = useState('avataaars')
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<string | null>(null)

  const getAvatarUrl = (seed: string, style: string = selectedStyle) => {
    return `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(seed)}`
  }

  const randomizeAvatar = () => {
    const randomSeed = Math.random().toString(36).substring(7)
    setAvatarSeed(randomSeed)
  }

  const handleSave = async () => {
    setIsSaving(true)
    setSaveMessage(null)

    try {
      // Update user preferences
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          email: userEmail,
          avatar_seed: avatarSeed,
          updated_at: new Date().toISOString(),
        })

      if (error) {
        setSaveMessage('Failed to save avatar. Please try again.')
        setIsSaving(false)
        return
      }

      setSaveMessage('Avatar saved successfully!')
      setIsSaving(false)

      // Refresh the page to show updated avatar everywhere
      setTimeout(() => {
        router.refresh()
      }, 1000)
    } catch (err) {
      setSaveMessage('Something went wrong. Please try again.')
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Current Avatar Preview */}
      <div className="flex flex-col items-center gap-4 p-6 bg-gray-50 rounded-lg">
        <Avatar className="w-32 h-32">
          <AvatarImage src={getAvatarUrl(avatarSeed)} />
          <AvatarFallback>Avatar</AvatarFallback>
        </Avatar>
        <p className="text-sm text-gray-600">Current Avatar</p>
      </div>

      {/* Avatar Style Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Avatar Style
        </label>
        <div className="grid grid-cols-2 gap-2">
          {AVATAR_STYLES.map((style) => (
            <button
              key={style.id}
              onClick={() => setSelectedStyle(style.id)}
              className={`p-3 text-sm rounded border-2 transition-colors ${
                selectedStyle === style.id
                  ? 'border-rose-500 bg-rose-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {style.name}
            </button>
          ))}
        </div>
      </div>

      {/* Style Preview Grid */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Preview in Selected Style
        </label>
        <div className="grid grid-cols-4 gap-3 p-4 bg-gray-50 rounded-lg">
          {[avatarSeed, `${avatarSeed}-1`, `${avatarSeed}-2`, `${avatarSeed}-3`].map((seed, idx) => (
            <button
              key={idx}
              onClick={() => setAvatarSeed(seed)}
              className={`p-2 rounded-lg transition-all ${
                avatarSeed === seed
                  ? 'ring-2 ring-rose-500 bg-white'
                  : 'hover:bg-white'
              }`}
            >
              <Avatar className="w-16 h-16">
                <AvatarImage src={getAvatarUrl(seed)} />
                <AvatarFallback>?</AvatarFallback>
              </Avatar>
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          onClick={randomizeAvatar}
          variant="outline"
          className="flex-1"
        >
          🎲 Randomize
        </Button>
        <Button
          onClick={handleSave}
          disabled={isSaving || avatarSeed === currentSeed}
          className="flex-1"
        >
          {isSaving ? 'Saving...' : 'Save Avatar'}
        </Button>
      </div>

      {saveMessage && (
        <div
          className={`p-3 rounded ${
            saveMessage.includes('success')
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {saveMessage}
        </div>
      )}

      <div className="text-xs text-gray-500 space-y-1">
        <p>💡 Tip: Click "Randomize" multiple times until you find an avatar you like!</p>
        <p>✨ Your avatar will update across all your past and future check-ins.</p>
      </div>
    </div>
  )
}
