'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Meeple, MEEPLE_COLORS } from '@/components/Meeple'

interface MeepleCustomizerProps {
  userEmail: string
  currentColor: string
}

export default function MeepleCustomizer({ userEmail, currentColor }: MeepleCustomizerProps) {
  const router = useRouter()
  const [selectedColor, setSelectedColor] = useState(currentColor)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<string | null>(null)

  const handleSave = async () => {
    setIsSaving(true)
    setSaveMessage(null)

    try {
      // Update user preferences
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          email: userEmail,
          meeple_color: selectedColor,
          updated_at: new Date().toISOString(),
        })

      if (error) {
        setSaveMessage('Failed to save meeple color. Please try again.')
        setIsSaving(false)
        return
      }

      setSaveMessage('Meeple color saved successfully!')
      setIsSaving(false)

      // Refresh the page to show updated meeple everywhere
      setTimeout(() => {
        router.refresh()
      }, 1000)
    } catch {
      setSaveMessage('Something went wrong. Please try again.')
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Current Meeple Preview */}
      <div className="flex flex-col items-center gap-4 p-6 bg-gray-50 rounded-lg">
        <Meeple color={selectedColor} size={120} />
        <p className="text-sm text-gray-600">Your Meeple</p>
        <p className="text-xs text-gray-500">
          {MEEPLE_COLORS.find(c => c.value === selectedColor)?.name || 'Custom Color'}
        </p>
      </div>

      {/* Color Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Choose Your Meeple Color
        </label>
        <div className="grid grid-cols-3 gap-3">
          {MEEPLE_COLORS.map((colorOption) => (
            <button
              key={colorOption.value}
              onClick={() => setSelectedColor(colorOption.value)}
              className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                selectedColor === colorOption.value
                  ? 'border-primary bg-secondary scale-105'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Meeple color={colorOption.value} size={48} />
              <span className="text-xs font-medium text-center">
                {colorOption.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          onClick={handleSave}
          disabled={isSaving || selectedColor === currentColor}
          className="flex-1"
        >
          {isSaving ? 'Saving...' : 'Save Meeple Color'}
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
        <p>💡 Choose a color that represents you!</p>
        <p>✨ Your meeple will update across all your past and future check-ins.</p>
      </div>
    </div>
  )
}
