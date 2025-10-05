import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { supabase } from '@/lib/supabase'
import AvatarCustomizer from '@/components/AvatarCustomizer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function SettingsPage() {
  const session = await auth()

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
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/">
            <Button variant="outline">← Back to Map</Button>
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Customize your profile and avatar</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Your details from Google account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Name</label>
                <p className="text-gray-900">{session.user.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Email</label>
                <p className="text-gray-900">{session.user.email}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Avatar Customization</CardTitle>
              <CardDescription>
                Choose your avatar style. This will update across all your check-ins.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AvatarCustomizer
                userEmail={session.user.email!}
                currentSeed={preferences?.avatar_seed || session.user.email!}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
