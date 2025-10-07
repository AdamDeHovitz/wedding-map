import { describe, it, expect } from 'vitest'
import {
  calculateDistance,
  getTransportMode,
  getAnimationDuration,
  getTransportIcon,
} from '../travel'

describe('calculateDistance', () => {
  it('calculates distance between two close points correctly', () => {
    // NYC Times Square to Central Park (about 2 miles)
    const distance = calculateDistance(40.7580, -73.9855, 40.7829, -73.9654)
    expect(distance).toBeGreaterThan(1.8)
    expect(distance).toBeLessThan(2.2)
  })

  it('calculates distance between two far points correctly', () => {
    // NYC to LA (about 2450 miles)
    const distance = calculateDistance(40.7128, -74.0060, 34.0522, -118.2437)
    expect(distance).toBeGreaterThan(2400)
    expect(distance).toBeLessThan(2500)
  })

  it('returns 0 for same location', () => {
    const distance = calculateDistance(40.7128, -74.0060, 40.7128, -74.0060)
    expect(distance).toBe(0)
  })

  it('handles negative coordinates', () => {
    const distance = calculateDistance(-33.8688, 151.2093, -37.8136, 144.9631)
    expect(distance).toBeGreaterThan(0)
  })
})

describe('getTransportMode', () => {
  it('returns bike for distances under 3 miles', () => {
    expect(getTransportMode(0.5)).toBe('bike')
    expect(getTransportMode(2.9)).toBe('bike')
  })

  it('returns train for distances between 3 and 15 miles', () => {
    expect(getTransportMode(3)).toBe('train')
    expect(getTransportMode(10)).toBe('train')
    expect(getTransportMode(14.9)).toBe('train')
  })

  it('returns plane for distances over 15 miles', () => {
    expect(getTransportMode(15)).toBe('plane')
    expect(getTransportMode(100)).toBe('plane')
    expect(getTransportMode(2500)).toBe('plane')
  })
})

describe('getAnimationDuration', () => {
  it('returns correct base duration for bike', () => {
    const duration = getAnimationDuration(1, 'bike')
    expect(duration).toBe(4000) // 4 seconds
  })

  it('returns correct base duration for train', () => {
    const duration = getAnimationDuration(10, 'train')
    expect(duration).toBe(6000) // 6 seconds
  })

  it('returns correct base duration for plane', () => {
    const duration = getAnimationDuration(20, 'plane')
    expect(duration).toBeGreaterThanOrEqual(8000) // 8 seconds base, may scale up
    expect(duration).toBeLessThanOrEqual(12000) // capped at 12 seconds
  })

  it('scales plane duration for very long distances', () => {
    const shortDuration = getAnimationDuration(20, 'plane')
    const longDuration = getAnimationDuration(2000, 'plane')
    expect(longDuration).toBeGreaterThan(shortDuration)
  })

  it('caps duration at 12 seconds', () => {
    const duration = getAnimationDuration(10000, 'plane')
    expect(duration).toBeLessThanOrEqual(12000)
  })
})

describe('getTransportIcon', () => {
  it('returns correct icon for bike', () => {
    expect(getTransportIcon('bike')).toBe('🚴')
  })

  it('returns correct icon for train', () => {
    expect(getTransportIcon('train')).toBe('🚂')
  })

  it('returns correct icon for plane', () => {
    expect(getTransportIcon('plane')).toBe('✈️')
  })
})
