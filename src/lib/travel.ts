/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in miles
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3959 // Earth's radius in miles
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c

  return distance
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180)
}

export type TransportMode = 'bike' | 'train' | 'plane'

/**
 * Determine transport mode based on distance
 * < 3 miles: bike
 * 3-15 miles: train
 * > 15 miles: plane
 */
export function getTransportMode(distanceMiles: number): TransportMode {
  if (distanceMiles < 3) {
    return 'bike'
  } else if (distanceMiles < 15) {
    return 'train'
  } else {
    return 'plane'
  }
}

/**
 * Get duration for animation based on distance and transport mode
 * Returns duration in milliseconds
 */
export function getAnimationDuration(
  distanceMiles: number,
  mode: TransportMode
): number {
  // Base durations for each mode
  const baseDurations = {
    bike: 2000, // 2 seconds for short distances
    train: 3000, // 3 seconds for medium distances
    plane: 4000, // 4 seconds for long distances
  }

  // Scale duration slightly based on distance
  const scaleFactor = mode === 'plane' ? 1 + (distanceMiles / 1000) : 1
  return Math.min(baseDurations[mode] * scaleFactor, 6000) // Cap at 6 seconds
}

/**
 * Fetch real route from Mapbox Directions API
 * Returns null if fetch fails
 */
async function fetchMapboxRoute(
  startLon: number,
  startLat: number,
  endLon: number,
  endLat: number,
  profile: 'cycling' | 'walking' // Mapbox profiles
): Promise<[number, number][] | null> {
  try {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
    if (!token) return null

    const url = `https://api.mapbox.com/directions/v5/mapbox/${profile}/${startLon},${startLat};${endLon},${endLat}?geometries=geojson&access_token=${token}`

    const response = await fetch(url)
    if (!response.ok) return null

    const data = await response.json()
    if (!data.routes?.[0]?.geometry?.coordinates) return null

    return data.routes[0].geometry.coordinates
  } catch (error) {
    console.error('Failed to fetch Mapbox route:', error)
    return null
  }
}

/**
 * Generate intermediate points along a path for animation
 * For bike/train, fetches real routes from Mapbox
 * Returns array of [longitude, latitude] coordinates
 */
export async function generatePathPoints(
  startLon: number,
  startLat: number,
  endLon: number,
  endLat: number,
  mode: TransportMode,
  numPoints: number = 100 // For resampling the route
): Promise<[number, number][]> {
  // For bike and train, try to fetch real route from Mapbox
  if (mode === 'bike' || mode === 'train') {
    const profile = mode === 'bike' ? 'cycling' : 'walking' // Use walking for train as approximation
    const routeCoords = await fetchMapboxRoute(startLon, startLat, endLon, endLat, profile)

    if (routeCoords && routeCoords.length > 0) {
      // Resample the route to get consistent number of points for smooth animation
      return resamplePath(routeCoords, numPoints)
    }
  }

  // Fallback to arc-based path for plane or if Mapbox fetch fails
  const points: [number, number][] = []

  if (mode === 'plane') {
    // For plane, create an arc (great circle approximation)
    const midLon = (startLon + endLon) / 2
    const midLat = (startLat + endLat) / 2
    const distance = calculateDistance(startLat, startLon, endLat, endLon)

    // Arc height: higher for longer distances
    const arcHeight = Math.min(distance * 0.08, 15)

    for (let i = 0; i <= numPoints; i++) {
      const t = i / numPoints

      // Quadratic bezier curve
      const lon = (1 - t) * (1 - t) * startLon + 2 * (1 - t) * t * midLon + t * t * endLon
      const lat = (1 - t) * (1 - t) * startLat + 2 * (1 - t) * t * (midLat + arcHeight) + t * t * endLat

      points.push([lon, lat])
    }
  } else {
    // Fallback for bike/train if Mapbox fails
    const midLon = (startLon + endLon) / 2
    const midLat = (startLat + endLat) / 2
    const distance = calculateDistance(startLat, startLon, endLat, endLon)

    const arcHeight = mode === 'train' ? distance * 0.01 : distance * 0.005

    for (let i = 0; i <= numPoints; i++) {
      const t = i / numPoints

      const lon = (1 - t) * (1 - t) * startLon + 2 * (1 - t) * t * midLon + t * t * endLon
      const lat = (1 - t) * (1 - t) * startLat + 2 * (1 - t) * t * (midLat + arcHeight) + t * t * endLat

      points.push([lon, lat])
    }
  }

  return points
}

/**
 * Resample a path to have exactly numPoints points
 * Uses linear interpolation for smooth distribution
 */
function resamplePath(
  path: [number, number][],
  numPoints: number
): [number, number][] {
  if (path.length === 0) return []
  if (path.length === 1) return path

  // Calculate cumulative distances along the path
  const distances = [0]
  let totalDistance = 0

  for (let i = 1; i < path.length; i++) {
    const [lon1, lat1] = path[i - 1]
    const [lon2, lat2] = path[i]
    const segmentDist = calculateDistance(lat1, lon1, lat2, lon2)
    totalDistance += segmentDist
    distances.push(totalDistance)
  }

  // Generate evenly spaced points along the total distance
  const resampled: [number, number][] = []

  for (let i = 0; i <= numPoints; i++) {
    const targetDist = (i / numPoints) * totalDistance

    // Find the segment containing this distance
    let segmentIndex = 0
    for (let j = 0; j < distances.length - 1; j++) {
      if (targetDist >= distances[j] && targetDist <= distances[j + 1]) {
        segmentIndex = j
        break
      }
    }

    // Interpolate within the segment
    const segmentStart = distances[segmentIndex]
    const segmentEnd = distances[segmentIndex + 1]
    const segmentProgress = segmentEnd > segmentStart
      ? (targetDist - segmentStart) / (segmentEnd - segmentStart)
      : 0

    const [lon1, lat1] = path[segmentIndex]
    const [lon2, lat2] = path[segmentIndex + 1] || path[segmentIndex]

    const lon = lon1 + (lon2 - lon1) * segmentProgress
    const lat = lat1 + (lat2 - lat1) * segmentProgress

    resampled.push([lon, lat])
  }

  return resampled
}

/**
 * Get emoji icon for transport mode
 */
export function getTransportIcon(mode: TransportMode): string {
  const icons = {
    bike: '🚴',
    train: '🚂',
    plane: '✈️',
  }
  return icons[mode]
}
