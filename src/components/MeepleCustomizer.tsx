'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { Meeple, MEEPLE_COLORS, type MeepleStyle } from '@/components/Meeple'
import { useTranslations } from 'next-intl'

interface MeepleCustomizerProps {
  currentColor: string
  currentStyle?: MeepleStyle
}

export default function MeepleCustomizer({
  currentColor,
}: MeepleCustomizerProps) {
  const t = useTranslations('settings')
  const tCommon = useTranslations('common')
  const router = useRouter()
  const [selectedColor, setSelectedColor] = useState(currentColor)
  const selectedStyle: MeepleStyle = '3d' // Always use 3D style
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<string | null>(null)

  const handleSave = async () => {
    setIsSaving(true)
    setSaveMessage(null)

    try {
      // Update user preferences via API route
      const response = await fetch('/api/preferences', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          meepleColor: selectedColor,
          meepleStyle: '3d', // Always save as 3D
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        setSaveMessage(error.error || t('colorFailed'))
        setIsSaving(false)
        return
      }

      setSaveMessage(t('colorSaved'))
      setIsSaving(false)

      // Refresh the page to show updated meeple everywhere
      setTimeout(() => {
        router.refresh()
      }, 1000)
    } catch {
      setSaveMessage(t('colorFailed'))
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Current Meeple Preview */}
      <div className="flex flex-col items-center gap-4 p-6 bg-gray-50 rounded-lg">
        <Meeple color={selectedColor} size={120} style={selectedStyle} />
        <p className="text-sm text-gray-600">Your Meeple</p>
        <p className="text-xs text-gray-500">
          {MEEPLE_COLORS.find(c => c.value === selectedColor)?.name || 'Custom Color'}
        </p>
      </div>

      {/* Color Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          {t('meepleColor')}
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
              <Meeple color={colorOption.value} size={48} style={selectedStyle} />
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
          {isSaving ? tCommon('saving') : t('saveColor')}
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
        <p>{t('colorTip')}</p>
        <p>{t('colorUpdate')}</p>
      </div>
    </div>
  )
}
