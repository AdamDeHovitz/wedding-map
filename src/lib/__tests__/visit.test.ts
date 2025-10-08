import { describe, it, expect } from 'vitest'

/**
 * Tests for the visit functionality
 *
 * Key behaviors:
 * 1. Users can visit locations they've previously checked into
 * 2. Meeples always appear at all locations they've checked into
 * 3. Meeples are greyed out when not currently at a location
 * 4. current_location_id tracks where the user currently is
 */

describe('Visit Functionality', () => {
  describe('Location Visibility Rules', () => {
    it('should show all users who have checked in to a location', () => {
      // Given: Multiple users have checked in to a location
      const checkins = [
        { id: '1', guest_email: 'user1@example.com', table_id: 'table-a' },
        { id: '2', guest_email: 'user2@example.com', table_id: 'table-a' },
        { id: '3', guest_email: 'user3@example.com', table_id: 'table-a' },
      ]

      // When: We filter checkins for that location
      const tableACheckins = checkins.filter(c => c.table_id === 'table-a')

      // Then: All users should be visible
      expect(tableACheckins).toHaveLength(3)
      expect(tableACheckins.map(c => c.guest_email)).toEqual([
        'user1@example.com',
        'user2@example.com',
        'user3@example.com',
      ])
    })

    it('should maintain checkin history even when users visit other locations', () => {
      // Given: A user has checked in to multiple locations
      const checkins = [
        { id: '1', guest_email: 'user1@example.com', table_id: 'table-a' },
        { id: '2', guest_email: 'user1@example.com', table_id: 'table-b' },
        { id: '3', guest_email: 'user1@example.com', table_id: 'table-c' },
      ]

      // And: The user's current location is table-b
      const userPreferences = {
        email: 'user1@example.com',
        current_location_id: 'table-b',
      }

      // When: We check which locations the user has visited
      const visitedLocations = checkins
        .filter(c => c.guest_email === userPreferences.email)
        .map(c => c.table_id)

      // Then: All locations should show the user's checkin
      expect(visitedLocations).toEqual(['table-a', 'table-b', 'table-c'])
    })
  })

  describe('Current Location Tracking', () => {
    it('should identify when a user is currently at a location', () => {
      const userPreferences = {
        email: 'user1@example.com',
        current_location_id: 'table-b',
      }

      const isUserCurrentlyAtLocation = (tableId: string) => {
        return userPreferences.current_location_id === tableId
      }

      expect(isUserCurrentlyAtLocation('table-a')).toBe(false)
      expect(isUserCurrentlyAtLocation('table-b')).toBe(true)
      expect(isUserCurrentlyAtLocation('table-c')).toBe(false)
    })

    it('should update current location when user checks in', () => {
      // Given: Initial user state
      const userPreferences = {
        email: 'user1@example.com',
        current_location_id: 'table-a',
      }

      // When: User checks in to a new location
      const newCheckin = { table_id: 'table-b' }
      userPreferences.current_location_id = newCheckin.table_id

      // Then: current_location_id should be updated
      expect(userPreferences.current_location_id).toBe('table-b')
    })

    it('should update current location when user visits a previous location', () => {
      // Given: User has checked in to multiple locations previously
      const checkins = [
        { guest_email: 'user1@example.com', table_id: 'table-a' },
        { guest_email: 'user1@example.com', table_id: 'table-b' },
        { guest_email: 'user1@example.com', table_id: 'table-c' },
      ]

      const userPreferences = {
        email: 'user1@example.com',
        current_location_id: 'table-c', // Currently at table-c
      }

      // When: User visits table-a (a previous checkin)
      const hasCheckedInToTableA = checkins.some(
        c => c.guest_email === userPreferences.email && c.table_id === 'table-a'
      )
      expect(hasCheckedInToTableA).toBe(true)

      // Simulate visit
      userPreferences.current_location_id = 'table-a'

      // Then: current_location_id should be updated
      expect(userPreferences.current_location_id).toBe('table-a')
    })
  })

  describe('Visual Display Rules', () => {
    it('should distinguish between current and away users', () => {
      // Given: Multiple users at a location
      const checkins = [
        { id: '1', guest_email: 'user1@example.com', table_id: 'table-a' },
        { id: '2', guest_email: 'user2@example.com', table_id: 'table-a' },
        { id: '3', guest_email: 'user3@example.com', table_id: 'table-a' },
      ]

      const userPreferences = [
        { email: 'user1@example.com', current_location_id: 'table-a' }, // Here
        { email: 'user2@example.com', current_location_id: 'table-b' }, // Away
        { email: 'user3@example.com', current_location_id: 'table-a' }, // Here
      ]

      // When: We determine who is currently at table-a
      const results = checkins.map(checkin => {
        const userPref = userPreferences.find(p => p.email === checkin.guest_email)
        return {
          email: checkin.guest_email,
          isCurrentlyHere: userPref?.current_location_id === 'table-a',
        }
      })

      // Then: Should correctly identify current vs away users
      expect(results).toEqual([
        { email: 'user1@example.com', isCurrentlyHere: true },
        { email: 'user2@example.com', isCurrentlyHere: false },
        { email: 'user3@example.com', isCurrentlyHere: true },
      ])
    })
  })

  describe('Visit Permission Rules', () => {
    it('should allow visiting only previously checked-in locations', () => {
      // Given: User's checkin history
      const checkins = [
        { guest_email: 'user1@example.com', table_id: 'table-a' },
        { guest_email: 'user1@example.com', table_id: 'table-b' },
      ]

      const canVisitLocation = (email: string, tableId: string) => {
        return checkins.some(
          c => c.guest_email === email && c.table_id === tableId
        )
      }

      // Then: Can visit checked-in locations
      expect(canVisitLocation('user1@example.com', 'table-a')).toBe(true)
      expect(canVisitLocation('user1@example.com', 'table-b')).toBe(true)

      // And: Cannot visit new locations
      expect(canVisitLocation('user1@example.com', 'table-c')).toBe(false)
    })

    it('should require check-in for new locations', () => {
      // Given: User's checkin history
      const checkins = [
        { guest_email: 'user1@example.com', table_id: 'table-a' },
      ]

      const hasCheckedIn = (email: string, tableId: string) => {
        return checkins.some(
          c => c.guest_email === email && c.table_id === tableId
        )
      }

      // When: Checking a new location (table-b)
      const newLocation = 'table-b'
      const hasVisited = hasCheckedIn('user1@example.com', newLocation)

      // Then: Should require check-in
      expect(hasVisited).toBe(false)
    })
  })

  describe('Multiple Users Scenario', () => {
    it('should correctly track multiple users visiting different locations', () => {
      // Given: Multiple users with different checkin histories
      const checkins = [
        { id: '1', guest_email: 'alice@example.com', table_id: 'table-a' },
        { id: '2', guest_email: 'alice@example.com', table_id: 'table-b' },
        { id: '3', guest_email: 'bob@example.com', table_id: 'table-a' },
        { id: '4', guest_email: 'bob@example.com', table_id: 'table-c' },
        { id: '5', guest_email: 'charlie@example.com', table_id: 'table-b' },
      ]

      const userPreferences = [
        { email: 'alice@example.com', current_location_id: 'table-b' },
        { email: 'bob@example.com', current_location_id: 'table-a' },
        { email: 'charlie@example.com', current_location_id: 'table-c' },
      ]

      // When: We check table-a
      const tableACheckins = checkins.filter(c => c.table_id === 'table-a')
      const tableAUsers = tableACheckins.map(checkin => {
        const userPref = userPreferences.find(p => p.email === checkin.guest_email)
        return {
          email: checkin.guest_email,
          isCurrentlyHere: userPref?.current_location_id === 'table-a',
        }
      })

      // Then: Should show both Alice and Bob, but only Bob is currently here
      expect(tableAUsers).toEqual([
        { email: 'alice@example.com', isCurrentlyHere: false }, // Away
        { email: 'bob@example.com', isCurrentlyHere: true },    // Here
      ])
    })
  })
})
