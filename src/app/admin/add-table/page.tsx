import AddTableForm from '@/components/AddTableForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function AddTablePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/admin">
            <Button variant="outline">← Back to Admin</Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Add New Wedding Table</CardTitle>
            <CardDescription>
              Create a new location with a unique check-in link for your guests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AddTableForm />
          </CardContent>
        </Card>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">Tips:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Use a descriptive table name (e.g., "Table 1", "The Brooklyn Bridge")</li>
            <li>• The unique code will be used in the URL (e.g., /checkin/table-1)</li>
            <li>• You can find coordinates by searching the address on Google Maps and copying the lat/long from the URL</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
