'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function AdminPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [tables, setTables] = useState<any[]>([])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [allCheckins, setAllCheckins] = useState<any[]>([])

  useEffect(() => {
    async function fetchData() {
      const { data: tablesData } = await supabase
        .from('wedding_tables')
        .select('*, guest_checkins(count)')
        .order('name')

      const { data: checkinsData } = await supabase
        .from('guest_checkins')
        .select('*')
        .order('checked_in_at', { ascending: false })

      setTables(tablesData || [])
      setAllCheckins(checkinsData || [])
    }
    fetchData()
  }, [])

  const totalGuests = new Set(allCheckins?.map(c => c.guest_email)).size

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage wedding tables and view all guest check-ins</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Tables</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{tables?.length || 0}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Check-ins</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{allCheckins?.length || 0}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Unique Guests</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{totalGuests}</p>
            </CardContent>
          </Card>
        </div>

        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Wedding Tables</h2>
          <Link href="/admin/add-table">
            <Button>Add New Table</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {tables?.map((table) => {
            const checkinCount = Array.isArray(table.guest_checkins)
              ? table.guest_checkins[0]?.count || 0
              : 0

            return (
              <Card key={table.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{table.name}</CardTitle>
                      <CardDescription className="mt-1">{table.address}</CardDescription>
                      <p className="text-sm text-gray-500 mt-2">
                        Code: <code className="bg-gray-100 px-2 py-1 rounded">{table.unique_code}</code>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-rose-600">{checkinCount}</p>
                      <p className="text-sm text-gray-600">check-ins</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Link href={`/checkin/${table.unique_code}`} className="flex-1">
                      <Button variant="outline" className="w-full">View Check-in Page</Button>
                    </Link>
                    <Button
                      variant="outline"
                      onClick={() => {
                        const url = `${window.location.origin}/checkin/${table.unique_code}`
                        navigator.clipboard.writeText(url)
                      }}
                    >
                      Copy Link
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {(!tables || tables.length === 0) && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-600 mb-4">No tables created yet</p>
              <Link href="/admin/add-table">
                <Button>Create Your First Table</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Check-ins</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-3">
                {allCheckins?.slice(0, 10).map((checkin) => {
                  const table = tables?.find(t => t.id === checkin.table_id)
                  return (
                    <div key={checkin.id} className="flex justify-between items-start p-3 bg-gray-50 rounded">
                      <div>
                        <p className="font-medium">{checkin.guest_name}</p>
                        <p className="text-sm text-gray-600">{checkin.guest_email}</p>
                        {checkin.message && (
                          <p className="text-sm text-gray-700 italic mt-1">&quot;{checkin.message}&quot;</p>
                        )}
                      </div>
                      <div className="text-right text-sm">
                        <p className="font-medium text-gray-700">{table?.name}</p>
                        <p className="text-gray-500">
                          {new Date(checkin.checked_in_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <Link href="/">
            <Button variant="outline">View Public Map</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
