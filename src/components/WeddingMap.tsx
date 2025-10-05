'use client'

import { useEffect, useState } from 'react'
import { Map as MapGL, Marker, Popup } from 'react-map-gl/mapbox'
import 'mapbox-gl/dist/mapbox-gl.css'
import { WeddingTable, GuestCheckin, UserPreferences } from '@/types/database'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface WeddingMapProps {
  tables: WeddingTable[]
  checkins: GuestCheckin[]
  userPreferences: UserPreferences[]
}

interface TableWithCheckins extends WeddingTable {
  checkins: GuestCheckin[]
}

export default function WeddingMap({ tables, checkins, userPreferences }: WeddingMapProps) {
  const [selectedTable, setSelectedTable] = useState<TableWithCheckins | null>(null)
  const [viewState, setViewState] = useState({
    longitude: -74.0, // Default to NYC area (most locations)
    latitude: 40.7,
    zoom: 4 // Lower zoom to see multiple locations across US
  })

  // Create a map of email -> avatar_seed for quick lookup
  const avatarMap = new Map(
    userPreferences.map(pref => [pref.email, pref.avatar_seed])
  )

  // Helper to get avatar URL for a user
  const getAvatarUrl = (email: string) => {
    const seed = avatarMap.get(email) || email
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}`
  }

  // Group check-ins by table
  const tablesWithCheckins: TableWithCheckins[] = tables.map(table => ({
    ...table,
    checkins: checkins.filter(c => c.table_id === table.id)
  }))

  // Calculate center point and zoom to fit all tables
  useEffect(() => {
    if (tables.length > 0) {
      const lats = tables.map(t => Number(t.latitude))
      const lons = tables.map(t => Number(t.longitude))

      const avgLat = lats.reduce((sum, lat) => sum + lat, 0) / lats.length
      const avgLon = lons.reduce((sum, lon) => sum + lon, 0) / lons.length

      // Calculate bounds to determine appropriate zoom
      const latRange = Math.max(...lats) - Math.min(...lats)
      const lonRange = Math.max(...lons) - Math.min(...lons)
      const maxRange = Math.max(latRange, lonRange)

      // Rough zoom calculation (adjust as needed)
      let zoom = 4
      if (maxRange < 1) zoom = 10
      else if (maxRange < 5) zoom = 7
      else if (maxRange < 20) zoom = 5
      else if (maxRange < 50) zoom = 4
      else zoom = 3

      setViewState({
        latitude: avgLat,
        longitude: avgLon,
        zoom: zoom,
      })
    }
  }, [tables])

  return (
    <div className="w-full h-screen">
      <MapGL
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      >
        {/* Markers for each table */}
        {tablesWithCheckins.map((table) => (
          <Marker
            key={table.id}
            longitude={Number(table.longitude)}
            latitude={Number(table.latitude)}
            anchor="bottom"
            onClick={e => {
              e.originalEvent.stopPropagation()
              setSelectedTable(table)
            }}
          >
            <div className="relative cursor-pointer">
              {/* Location pin with guest count */}
              <div className="bg-rose-500 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:bg-rose-600 transition-colors border-2 border-white">
                <span className="font-bold text-sm">{table.checkins.length}</span>
              </div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-rose-500" />
            </div>
          </Marker>
        ))}

        {/* Popup when a table is selected */}
        {selectedTable && (
          <Popup
            longitude={Number(selectedTable.longitude)}
            latitude={Number(selectedTable.latitude)}
            anchor="top"
            onClose={() => setSelectedTable(null)}
            closeButton={true}
            closeOnClick={false}
            className="max-w-sm"
          >
            <Card className="border-0 shadow-none">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{selectedTable.name}</CardTitle>
                <p className="text-sm text-gray-600">{selectedTable.address}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-700">
                    {selectedTable.checkins.length} guest{selectedTable.checkins.length !== 1 ? 's' : ''} visited
                  </p>

                  {selectedTable.checkins.length > 0 && (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {selectedTable.checkins.map((checkin) => (
                        <div key={checkin.id} className="flex items-start gap-2 p-2 bg-gray-50 rounded">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={getAvatarUrl(checkin.guest_email)} />
                            <AvatarFallback>{checkin.guest_name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">{checkin.guest_name}</p>
                            {checkin.message && (
                              <p className="text-xs text-gray-600 italic mt-1">"{checkin.message}"</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </Popup>
        )}
      </MapGL>
    </div>
  )
}
