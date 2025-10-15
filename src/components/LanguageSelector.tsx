'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'

interface LanguageSelectorProps {
  currentLanguage?: 'en' | 'cs'
}

export default function LanguageSelector({ currentLanguage = 'en' }: LanguageSelectorProps) {
  const t = useTranslations('settings')
  const router = useRouter()
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'cs'>(currentLanguage)
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
          preferredLanguage: selectedLanguage,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        setSaveMessage(error.error || 'Failed to save language preference.')
        setIsSaving(false)
        return
      }

      // Set cookie for immediate language change
      document.cookie = `NEXT_LOCALE=${selectedLanguage}; path=/; max-age=31536000`

      // Refresh to apply new language
      router.refresh()
    } catch {
      setSaveMessage('Something went wrong. Please try again.')
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          {t('language')}
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setSelectedLanguage('en')}
            className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
              selectedLanguage === 'en'
                ? 'border-[#7B2D26] bg-[#F5E6D3] scale-105'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <span className="text-2xl">🇺🇸</span>
            <span className="text-sm font-medium text-center">
              {t('english')}
            </span>
          </button>
          <button
            onClick={() => setSelectedLanguage('cs')}
            className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
              selectedLanguage === 'cs'
                ? 'border-[#7B2D26] bg-[#F5E6D3] scale-105'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <span className="text-2xl">🇨🇿</span>
            <span className="text-sm font-medium text-center">
              {t('czech')}
            </span>
          </button>
        </div>
      </div>

      {selectedLanguage !== currentLanguage && (
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full bg-[#7B2D26] hover:bg-[#6B1D16] text-[#F5E6D3]"
        >
          {isSaving ? t('saving') : t('save')}
        </Button>
      )}

      {saveMessage && (
        <div className="p-3 rounded bg-red-50 text-red-800 border border-red-200">
          {saveMessage}
        </div>
      )}
    </div>
  )
}
