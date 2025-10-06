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
  const [pathPoints, setPathPoints] = useState<[number, number][]>([])
  const [isLoadingPath, setIsLoadingPath] = useState(true)
  const startTimeRef = useRef<number>(Date.now())
  const animationFrameRef = useRef<number>()

  // Calculate distance and transport mode
  const distance = calculateDistance(startLat, startLon, endLat, endLon)
  const mode = getTransportMode(distance)
  const duration = getAnimationDuration(distance, mode)
  const icon = getTransportIcon(mode)

  // Fetch path points asynchronously
  useEffect(() => {
    let isMounted = true

    const fetchPath = async () => {
      const points = await generatePathPoints(startLon, startLat, endLon, endLat, mode)
      if (isMounted) {
        setPathPoints(points)
        setIsLoadingPath(false)
      }
    }

    fetchPath()

    return () => {
      isMounted = false
    }
  }, [startLon, startLat, endLon, endLat, mode])

  useEffect(() => {
    // Don't start animation until path is loaded
    if (isLoadingPath || pathPoints.length === 0) return

    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current
      let progress = Math.min(elapsed / duration, 1)

      // Apply easing function for smoother animation (ease-in-out)
      progress = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2

      if (progress < 1) {
        // Interpolate between path points for smoother movement
        const exactIndex = progress * (pathPoints.length - 1)
        const lowerIndex = Math.floor(exactIndex)
        const upperIndex = Math.min(lowerIndex + 1, pathPoints.length - 1)
        const t = exactIndex - lowerIndex

        const [lon1, lat1] = pathPoints[lowerIndex]
        const [lon2, lat2] = pathPoints[upperIndex]

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
  }, [duration, endLat, endLon, onComplete, pathPoints, isLoadingPath])

  // Show loading or nothing if not ready
  if (!isAnimating || isLoadingPath || pathPoints.length === 0) {
    return null
  }

  // Create GeoJSON for the route line
  const routeGeoJSON = {
    type: 'Feature' as const,
    properties: {},
    geometry: {
      type: 'LineString' as const,
      coordinates: pathPoints,
    },
  }

  // Get color based on transport mode
  const routeColor = mode === 'bike' ? '#3b82f6' : mode === 'train' ? '#8b5cf6' : '#f59e0b'

  return (
    <>
      {/* Route line */}
      <Source id="travel-route" type="geojson" data={routeGeoJSON}>
        <Layer
          id="travel-route-line"
          type="line"
          paint={{
            'line-color': routeColor,
            'line-width': 4,
            'line-opacity': 0.8,
          }}
        />
        {/* Animated dashed line overlay for movement effect */}
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
