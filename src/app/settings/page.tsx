import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { supabase } from '@/lib/supabase'
import MeepleCustomizer from '@/components/MeepleCustomizer'
import LanguageSelector from '@/components/LanguageSelector'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import type { MeepleStyle } from '@/components/Meeple'
import { getTranslations } from 'next-intl/server'

export default async function SettingsPage() {
  const session = await auth()
  const t = await getTranslations('settings')
  const tCommon = await getTranslations('common')

  if (!session?.user) {
    redirect('/api/auth/signin')
  }

  // Fetch user preferences
  const { data: preferences } = await supabase
    .from('user_preferences')
    .select('*')
    .eq('email', session.user.email!)
    .single()

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white p-4 sm:p-6 pb-safe">
      <div className="max-w-2xl mx-auto">
        <div className="mb-4 sm:mb-6">
          <Link href="/">
            <Button variant="outline" className="min-h-[44px]">← {tCommon('backToMap')}</Button>
          </Link>
        </div>

        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">{t('title')}</h1>
          <p className="text-gray-600">{t('subtitle')}</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('profileInfo')}</CardTitle>
              <CardDescription>{t('profileInfoDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">{t('name')}</label>
                <p className="text-gray-900">{session.user.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">{t('email')}</label>
                <p className="text-gray-900">{session.user.email}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('languageTitle')}</CardTitle>
              <CardDescription>
                {t('languageDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LanguageSelector
                currentLanguage={(preferences?.preferred_language as 'en' | 'cs') || 'en'}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('meepleCustomization')}</CardTitle>
              <CardDescription>
                {t('meepleCustomizationDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MeepleCustomizer
                currentColor={preferences?.meeple_color || '#7B2D26'}
                currentStyle={(preferences?.meeple_style as MeepleStyle) || '3d'}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
