import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const startLat = searchParams.get('startLat')
  const startLon = searchParams.get('startLon')
  const endLat = searchParams.get('endLat')
  const endLon = searchParams.get('endLon')

  if (!startLat || !startLon || !endLat || !endLon) {
    return NextResponse.json(
      { error: 'Missing coordinates' },
      { status: 400 }
    )
  }

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Google Maps API key not configured' },
      { status: 500 }
    )
  }

  try {
    // Use current time for departure
    const departureTime = Math.floor(Date.now() / 1000)

    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${startLat},${startLon}&destination=${endLat},${endLon}&mode=transit&departure_time=${departureTime}&key=${apiKey}`

    const response = await fetch(url)
    const data = await response.json()

    if (data.status !== 'OK') {
      console.error('Google Maps API error:', data)
      return NextResponse.json(
        { error: `Google Maps API error: ${data.status}`, details: data },
        { status: 400 }
      )
    }

    const route = data.routes[0]
    if (!route) {
      return NextResponse.json(
        { error: 'No route found' },
        { status: 404 }
      )
    }

    // Parse individual steps to get transit line colors and walking sections
    const segments = []
    for (const leg of route.legs) {
      for (const step of leg.steps) {
        const polyline = step.polyline.points

        if (step.travel_mode === 'WALKING') {
          segments.push({
            polyline,
            type: 'walking',
            color: '#6B7280' // Gray for walking
          })
        } else if (step.travel_mode === 'TRANSIT') {
          const transitDetails = step.transit_details
          // Get the line color from Google's transit data
          const lineColor = transitDetails?.line?.color ? `#${transitDetails.line.color}` : '#8b5cf6' // Default purple
          const lineName = transitDetails?.line?.short_name || transitDetails?.line?.name || 'Transit'

          segments.push({
            polyline,
            type: 'transit',
            color: lineColor,
            lineName
          })
        }
      }
    }

    // Return detailed segment data
    return NextResponse.json({
      segments,
      status: data.status
    })
  } catch (error) {
    console.error('Failed to fetch transit route:', error)
    return NextResponse.json(
      { error: 'Failed to fetch transit route' },
      { status: 500 }
    )
  }
}
