'use client'

import { useEffect, useState, useRef } from 'react'
import { Map as MapGL, Marker, Popup } from 'react-map-gl/mapbox'
import 'mapbox-gl/dist/mapbox-gl.css'
import { WeddingTable, GuestCheckin, UserPreferences } from '@/types/database'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Meeple } from '@/components/Meeple'
import { CheckinDialog } from '@/components/CheckinDialog'
import { TravelAnimation } from '@/components/TravelAnimation'
import { Button } from '@/components/ui/button'

interface WeddingMapProps {
  tables: WeddingTable[]
  checkins: GuestCheckin[]
  userPreferences: UserPreferences[]
  initialTable?: WeddingTable | null
  showCheckinDialog?: boolean
}

interface TableWithCheckins extends WeddingTable {
  checkins: GuestCheckin[]
}

export default function WeddingMap({
  tables,
  checkins,
  userPreferences,
  initialTable = null,
  showCheckinDialog = false
}: WeddingMapProps) {
  const [selectedTable, setSelectedTable] = useState<TableWithCheckins | null>(null)
  const [selectedMeeple, setSelectedMeeple] = useState<GuestCheckin | null>(null)
  const [checkinDialogOpen, setCheckinDialogOpen] = useState(showCheckinDialog)
  const [checkinTable, setCheckinTable] = useState<WeddingTable | null>(initialTable)
  const [newMeepleIds, setNewMeepleIds] = useState<Set<string>>(new Set())
  const previousCheckinIds = useRef<Set<string>>(new Set())
  const [travelAnimation, setTravelAnimation] = useState<{
    startLat: number
    startLon: number
    endLat: number
    endLon: number
    meepleColor: string
    newCheckinId: string
  } | null>(null)
  const [viewState, setViewState] = useState({
    longitude: initialTable ? Number(initialTable.longitude) : -74.0,
    latitude: initialTable ? Number(initialTable.latitude) : 40.7,
    zoom: initialTable ? 15 : 4 // Zoom in if showing initial table
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

  // Handle successful check-in with animation
  const handleCheckinSuccess = (data: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    checkin: any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    previousCheckin: any | null
    meepleColor: string | null
  }) => {
    // If there's a previous check-in, show travel animation
    if (data.previousCheckin && data.previousCheckin.wedding_tables) {
      const prevTable = data.previousCheckin.wedding_tables
      const newTable = data.checkin.wedding_tables

      const startLat = Number(prevTable.latitude)
      const startLon = Number(prevTable.longitude)
      const endLat = Number(newTable.latitude)
      const endLon = Number(newTable.longitude)

      // Calculate bounds to show both locations
      const minLat = Math.min(startLat, endLat)
      const maxLat = Math.max(startLat, endLat)
      const minLon = Math.min(startLon, endLon)
      const maxLon = Math.max(startLon, endLon)

      // Calculate center
      const centerLat = (minLat + maxLat) / 2
      const centerLon = (minLon + maxLon) / 2

      // Calculate zoom level to fit both points with padding
      const latDiff = maxLat - minLat
      const lonDiff = maxLon - minLon

      // Use logarithmic scaling for better zoom levels across different distances
      // This ensures both points are visible with some padding
      const maxDiff = Math.max(latDiff, lonDiff)

      // Add 30% padding to the bounds
      const paddedDiff = maxDiff * 1.3

      // Calculate zoom level based on the padded difference
      // More granular thresholds for better visibility at all distance scales
      // 1 degree ≈ 111 km at equator
      let zoom
      if (paddedDiff < 0.001) zoom = 16      // Block level (< 110 meters)
      else if (paddedDiff < 0.003) zoom = 15  // Few blocks (< 330 meters)
      else if (paddedDiff < 0.008) zoom = 14  // Neighborhood (< 880 meters)
      else if (paddedDiff < 0.02) zoom = 13   // District (< 2.2 km)
      else if (paddedDiff < 0.05) zoom = 12   // City district (< 5.5 km)
      else if (paddedDiff < 0.15) zoom = 11   // City (< 16 km)
      else if (paddedDiff < 0.5) zoom = 9     // Metro area
      else if (paddedDiff < 2) zoom = 7       // Region
      else if (paddedDiff < 5) zoom = 6       // State/Province
      else if (paddedDiff < 15) zoom = 5      // Multiple states
      else if (paddedDiff < 40) zoom = 4      // Country
      else if (paddedDiff < 90) zoom = 3      // Continent
      else zoom = 2                           // Cross-continental

      const newViewState = {
        latitude: centerLat,
        longitude: centerLon,
        zoom: zoom,
      }

      // Smoothly animate to show both points
      setViewState(newViewState)

      // Save view state before refresh
      sessionStorage.setItem('mapViewState', JSON.stringify(newViewState))

      setTravelAnimation({
        startLat,
        startLon,
        endLat,
        endLon,
        meepleColor: data.meepleColor || '#7B2D26',
        newCheckinId: data.checkin.id,
      })
    } else {
      // No previous check-in - save view state and let useEffect handle drop animation after refresh
      sessionStorage.setItem('mapViewState', JSON.stringify(viewState))

      // Store the new checkin ID so we can trigger animation after refresh
      sessionStorage.setItem('pendingDropAnimation', data.checkin.id)
    }
  }

  // Handle travel animation completion
  const handleTravelComplete = () => {
    if (travelAnimation) {
      // Just clear the travel animation - no drop needed
      setTravelAnimation(null)
    }
  }

  // Calculate center point and zoom to fit all tables (only if no initial table and no saved view)
  useEffect(() => {
    // Check if we have a saved view state (from animation)
    const savedView = sessionStorage.getItem('mapViewState')
    const pendingDrop = sessionStorage.getItem('pendingDropAnimation')

    if (savedView && !initialTable) {
      // Restore saved view state
      const parsed = JSON.parse(savedView)
      setViewState(parsed)
      sessionStorage.removeItem('mapViewState')
    } else if (tables.length > 0 && !initialTable) {
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

    // Handle pending drop animation after refresh
    if (pendingDrop) {
      setNewMeepleIds(new Set([pendingDrop]))
      setTimeout(() => setNewMeepleIds(new Set()), 600)
      sessionStorage.removeItem('pendingDropAnimation')
    }
  }, [tables, initialTable])

  // Track new check-ins for animation
  useEffect(() => {
    const currentCheckinIds = new Set(checkins.map(c => c.id))
    const previousIds = previousCheckinIds.current

    // Find check-ins that weren't in the previous render
    const newIds = new Set<string>()
    currentCheckinIds.forEach(id => {
      if (!previousIds.has(id)) {
        newIds.add(id)
      }
    })

    if (newIds.size > 0) {
      setNewMeepleIds(newIds)

      // Remove the "new" status after animation completes
      setTimeout(() => {
        setNewMeepleIds(new Set())
      }, 600) // Match animation duration
    }

    // Update the ref with current IDs for next render
    previousCheckinIds.current = currentCheckinIds
  }, [checkins])

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
                {/* eslint-disable-next-line @next/next/no-img-element */}
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

        {/* Show travel animation if active */}
        {travelAnimation && (
          <TravelAnimation
            startLat={travelAnimation.startLat}
            startLon={travelAnimation.startLon}
            endLat={travelAnimation.endLat}
            endLon={travelAnimation.endLon}
            meepleColor={travelAnimation.meepleColor}
            onComplete={handleTravelComplete}
          />
        )}

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
                <div className={`cursor-pointer transform transition-all duration-300 hover:scale-125 active:scale-110 ${newMeepleIds.has(checkin.id) ? 'animate-meepleDrop' : 'animate-fadeIn'}`}>
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
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-700">
                      {selectedTable.checkins.length} guest{selectedTable.checkins.length !== 1 ? 's' : ''} visited
                    </p>
                    <Button
                      size="sm"
                      onClick={() => {
                        setCheckinTable(selectedTable)
                        setCheckinDialogOpen(true)
                        setSelectedTable(null)
                      }}
                    >
                      Check In
                    </Button>
                  </div>

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
                              <p className="text-xs text-gray-600 italic mt-1">&quot;{checkin.message}&quot;</p>
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
                      <p className="text-sm text-gray-600 italic mt-2">&quot;{selectedMeeple.message}&quot;</p>
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

      <CheckinDialog
        open={checkinDialogOpen}
        onOpenChange={setCheckinDialogOpen}
        table={checkinTable}
        requireCode={!initialTable}
        onCheckinSuccess={handleCheckinSuccess}
      />
    </div>
  )
}
