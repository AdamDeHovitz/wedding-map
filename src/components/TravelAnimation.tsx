'use client'

import { useEffect, useState, useRef } from 'react'
import { Marker, Source, Layer } from 'react-map-gl/mapbox'
import { Meeple } from '@/components/Meeple'
import {
  calculateDistance,
  getTransportMode,
  getAnimationDuration,
  generatePathPoints,
  getTransportIcon,
  type PathData,
} from '@/lib/travel'

interface TravelAnimationProps {
  startLat: number
  startLon: number
  endLat: number
  endLon: number
  meepleColor: string
  onComplete?: () => void
}

export function TravelAnimation({
  startLat,
  startLon,
  endLat,
  endLon,
  meepleColor,
  onComplete,
}: TravelAnimationProps) {
  const [currentPosition, setCurrentPosition] = useState({ lat: startLat, lon: startLon })
  const [isAnimating, setIsAnimating] = useState(true)
  const [pathData, setPathData] = useState<PathData | null>(null)
  const [isLoadingPath, setIsLoadingPath] = useState(true)
  const startTimeRef = useRef<number>(Date.now())
  const animationFrameRef = useRef<number | undefined>(undefined)

  // Calculate distance and transport mode
  const distance = calculateDistance(startLat, startLon, endLat, endLon)
  const mode = getTransportMode(distance)

  // Fetch path data asynchronously
  useEffect(() => {
    let isMounted = true

    const fetchPath = async () => {
      const data = await generatePathPoints(startLon, startLat, endLon, endLat, mode)
      if (isMounted) {
        setPathData(data)
        setIsLoadingPath(false)
      }
    }

    fetchPath()

    return () => {
      isMounted = false
    }
  }, [startLon, startLat, endLon, endLat, mode])

  // Use actual mode from path data if available (may differ due to fallback)
  const actualMode = pathData?.actualMode || mode
  const duration = getAnimationDuration(distance, actualMode)
  const icon = getTransportIcon(actualMode)

  useEffect(() => {
    // Don't start animation until path is loaded
    if (isLoadingPath || !pathData || pathData.coordinates.length === 0) return

    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current
      let progress = Math.min(elapsed / duration, 1)

      // Apply easing function for smoother animation (ease-in-out)
      progress = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2

      if (progress < 1) {
        // Interpolate between path points for smoother movement
        const exactIndex = progress * (pathData.coordinates.length - 1)
        const lowerIndex = Math.floor(exactIndex)
        const upperIndex = Math.min(lowerIndex + 1, pathData.coordinates.length - 1)
        const t = exactIndex - lowerIndex

        const [lon1, lat1] = pathData.coordinates[lowerIndex]
        const [lon2, lat2] = pathData.coordinates[upperIndex]

        const lon = lon1 + (lon2 - lon1) * t
        const lat = lat1 + (lat2 - lat1) * t

        setCurrentPosition({ lat, lon })
        animationFrameRef.current = requestAnimationFrame(animate)
      } else {
        // Animation complete
        setCurrentPosition({ lat: endLat, lon: endLon })
        setIsAnimating(false)
        if (onComplete) {
          onComplete()
        }
      }
    }

    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [duration, endLat, endLon, onComplete, pathData, isLoadingPath])

  // Show loading or nothing if not ready
  if (!isAnimating || isLoadingPath || !pathData || pathData.coordinates.length === 0) {
    return null
  }

  // Get default color based on transport mode (fallback if no segments)
  const defaultColor = actualMode === 'bike' ? '#3b82f6' : actualMode === 'train' ? '#8b5cf6' : '#f59e0b'

  // If we have transit segments, render each one with its own color
  const hasSegments = pathData.segments && pathData.segments.length > 0

  return (
    <>
      {/* Route line(s) */}
      {hasSegments ? (
        // Render each segment with its own color (transit with subway line colors)
        pathData.segments!.map((segment, index) => {
          const segmentGeoJSON = {
            type: 'Feature' as const,
            properties: {},
            geometry: {
              type: 'LineString' as const,
              coordinates: segment.coordinates,
            },
          }

          const linePaint: Record<string, string | number | number[]> = {
            'line-color': segment.color,
            'line-width': segment.type === 'walking' ? 3 : 5,
            'line-opacity': 0.8,
          }

          // Only add dasharray for walking segments
          if (segment.type === 'walking') {
            linePaint['line-dasharray'] = [2, 2]
          }

          return (
            <Source key={`segment-${index}`} id={`travel-segment-${index}`} type="geojson" data={segmentGeoJSON}>
              <Layer
                id={`travel-segment-line-${index}`}
                type="line"
                paint={linePaint}
              />
              {/* White overlay for transit lines */}
              {segment.type === 'transit' && (
                <Layer
                  id={`travel-segment-dash-${index}`}
                  type="line"
                  paint={{
                    'line-color': '#ffffff',
                    'line-width': 2,
                    'line-dasharray': [4, 6],
                    'line-opacity': 0.4,
                  }}
                />
              )}
            </Source>
          )
        })
      ) : (
        // Fallback: single-color route
        <Source id="travel-route" type="geojson" data={{
          type: 'Feature' as const,
          properties: {},
          geometry: {
            type: 'LineString' as const,
            coordinates: pathData.coordinates,
          },
        }}>
          <Layer
            id="travel-route-line"
            type="line"
            paint={{
              'line-color': defaultColor,
              'line-width': 4,
              'line-opacity': 0.8,
            }}
          />
          <Layer
            id="travel-route-dash"
            type="line"
            paint={{
              'line-color': '#ffffff',
              'line-width': 2,
              'line-dasharray': [2, 4],
              'line-opacity': 0.6,
            }}
          />
        </Source>
      )}

      {/* Traveling meeple marker */}
      <Marker
        longitude={currentPosition.lon}
        latitude={currentPosition.lat}
        anchor="center"
      >
        <div className="relative animate-pulse">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-yellow-400 rounded-full blur-xl opacity-50 animate-ping" />

          {/* Transport icon with better animation */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 text-4xl z-10"
               style={{ animation: 'float 1s ease-in-out infinite' }}>
            {icon}
          </div>

          {/* Meeple - larger and more visible */}
          <div className="transform scale-150 relative z-20">
            <Meeple color={meepleColor} size={56} className="drop-shadow-2xl filter brightness-110" />
          </div>

          {/* Trail effect */}
          <div className="absolute inset-0 rounded-full bg-white opacity-30 blur-md animate-ping" />
        </div>
      </Marker>
    </>
  )
}
