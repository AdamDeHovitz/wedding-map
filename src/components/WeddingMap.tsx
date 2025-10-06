'use client'

import { useEffect, useState } from 'react'
import { Map as MapGL, Marker, Popup } from 'react-map-gl/mapbox'
import 'mapbox-gl/dist/mapbox-gl.css'
import { WeddingTable, GuestCheckin, UserPreferences } from '@/types/database'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Meeple } from '@/components/Meeple'

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
  const [selectedMeeple, setSelectedMeeple] = useState<GuestCheckin | null>(null)
  const [viewState, setViewState] = useState({
    longitude: -74.0, // Default to NYC area (most locations)
    latitude: 40.7,
    zoom: 4 // Lower zoom to see multiple locations across US
  })

  // Threshold for switching between table icons and individual meeples
  const ZOOM_THRESHOLD = 14
  const showMeeples = viewState.zoom >= ZOOM_THRESHOLD

  // Create a map of email -> meeple_color for quick lookup
  const meepleColorMap = new Map(
    userPreferences.map(pref => [pref.email, pref.meeple_color])
  )

  // Helper to get meeple color for a user
  const getMeepleColor = (email: string) => {
    return meepleColorMap.get(email) || '#7B2D26' // Default to burgundy
  }

  // Helper to calculate meeple positions in a circle around a location
  const getMeeplePosition = (
    centerLat: number,
    centerLon: number,
    index: number,
    total: number,
    radiusMeters: number = 30
  ) => {
    if (total === 1) {
      return { latitude: centerLat, longitude: centerLon }
    }

    // Convert meters to approximate degrees (rough approximation)
    const metersToLat = radiusMeters / 111000
    const metersToLon = radiusMeters / (111000 * Math.cos(centerLat * Math.PI / 180))

    // Distribute meeples evenly in a circle
    const angle = (2 * Math.PI * index) / total

    return {
      latitude: centerLat + metersToLat * Math.cos(angle),
      longitude: centerLon + metersToLon * Math.sin(angle)
    }
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
    <div className="w-full h-screen touch-none">
      <MapGL
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        touchZoomRotate={true}
        touchPitch={false}
        dragRotate={false}
        keyboard={false}
      >
        {/* Show table icon markers (always visible) */}
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
            <div className="relative cursor-pointer group active:scale-95 transition-all duration-300 animate-fadeIn">
              {/* Table icon bubble */}
              <div className="relative w-20 h-20 sm:w-16 sm:h-16 rounded-full overflow-hidden shadow-lg border-4 border-white bg-white group-hover:scale-110 active:scale-105 flex items-center justify-center p-0.5 transition-all duration-200">
                <img
                  src={`/table-icons/${table.unique_code}.png`}
                  alt={table.name}
                  className="w-full h-full object-contain"
                />
              </div>
              {/* Pin pointer */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[12px] border-l-transparent border-r-transparent border-t-white" />
            </div>
          </Marker>
        ))}

        {/* Show individual meeple markers when zoomed in */}
        {showMeeples && tablesWithCheckins.map((table) =>
          table.checkins.map((checkin, index) => {
            const position = getMeeplePosition(
              Number(table.latitude),
              Number(table.longitude),
              index,
              table.checkins.length
            )

            return (
              <Marker
                key={checkin.id}
                longitude={position.longitude}
                latitude={position.latitude}
                anchor="center"
                onClick={e => {
                  e.originalEvent.stopPropagation()
                  setSelectedMeeple(checkin)
                }}
              >
                <div className="cursor-pointer transform transition-all duration-300 hover:scale-125 active:scale-110 animate-fadeIn">
                  <Meeple
                    color={getMeepleColor(checkin.guest_email)}
                    size={40}
                    className="drop-shadow-lg"
                  />
                </div>
              </Marker>
            )
          })
        )}

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
                          <div className="flex-shrink-0">
                            <Meeple color={getMeepleColor(checkin.guest_email)} size={32} />
                          </div>
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

        {/* Popup when a meeple is clicked */}
        {selectedMeeple && (
          <Popup
            longitude={Number(selectedMeeple.table_id ?
              tablesWithCheckins.find(t => t.id === selectedMeeple.table_id)?.longitude : 0
            )}
            latitude={Number(selectedMeeple.table_id ?
              tablesWithCheckins.find(t => t.id === selectedMeeple.table_id)?.latitude : 0
            )}
            anchor="bottom"
            onClose={() => setSelectedMeeple(null)}
            closeButton={true}
            closeOnClick={false}
            offset={20}
          >
            <Card className="border-0 shadow-none">
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <Meeple color={getMeepleColor(selectedMeeple.guest_email)} size={48} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-base text-gray-900">{selectedMeeple.guest_name}</p>
                    {selectedMeeple.message && (
                      <p className="text-sm text-gray-600 italic mt-2">"{selectedMeeple.message}"</p>
                    )}
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(selectedMeeple.checked_in_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Popup>
        )}
      </MapGL>
    </div>
  )
}
