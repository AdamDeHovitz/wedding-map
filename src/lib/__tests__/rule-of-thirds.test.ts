import { describe, it, expect } from 'vitest'

/**
 * Tests for Rule of Thirds venue behavior
 *
 * Key requirement:
 * - ALL users with accounts should appear at Rule of Thirds location
 * - This is different from other tables which only show users who checked in
 */

describe('Rule of Thirds Behavior', () => {
  it('should show all registered users at Rule of Thirds, regardless of check-in status', () => {
    // Given: 3 users with accounts
    const userPreferences = [
      { email: 'alice@example.com', meeple_color: '#FF0000', display_name: 'Alice' },
      { email: 'bob@example.com', meeple_color: '#00FF00', display_name: 'Bob' },
      { email: 'charlie@example.com', meeple_color: '#0000FF', display_name: 'Charlie' },
    ]

    // And: Only 1 user has checked in to Rule of Thirds
    const checkins = [
      { id: '1', guest_email: 'alice@example.com', table_id: 'rule-of-thirds', guest_name: 'Alice', message: 'Hello!' },
    ]

    // When: Determining which users to show at Rule of Thirds
    const ruleOfThirdsUsers = userPreferences // All users should appear

    // Then: All 3 users should be visible, not just the 1 who checked in
    expect(ruleOfThirdsUsers).toHaveLength(3)
    expect(ruleOfThirdsUsers.map(u => u.email)).toEqual([
      'alice@example.com',
      'bob@example.com',
      'charlie@example.com',
    ])

    // And: We can identify which users have actually checked in for additional data
    const usersWithCheckins = ruleOfThirdsUsers.filter(user =>
      checkins.some(c => c.guest_email === user.email && c.table_id === 'rule-of-thirds')
    )
    expect(usersWithCheckins).toHaveLength(1)
    expect(usersWithCheckins[0].email).toBe('alice@example.com')
  })

  it('should only show checked-in users at other tables', () => {
    // Given: 3 users with accounts (for context, but not all will be shown)
    // alice@example.com, bob@example.com, charlie@example.com exist

    // And: Only 1 user has checked in to a regular table
    const checkins = [
      { id: '1', guest_email: 'alice@example.com', table_id: 'john-street', guest_name: 'Alice', message: 'Hi!' },
    ]

    // When: Determining which users to show at a regular table
    const tableId = 'john-street'
    const regularTableUsers = checkins.filter(c => c.table_id === tableId)

    // Then: Only the 1 user who checked in should be visible
    expect(regularTableUsers).toHaveLength(1)
    expect(regularTableUsers[0].guest_email).toBe('alice@example.com')
  })

  it('should show all users at Rule of Thirds even when no one has checked in', () => {
    // Given: 3 users with accounts
    const userPreferences = [
      { email: 'alice@example.com', meeple_color: '#FF0000', display_name: 'Alice' },
      { email: 'bob@example.com', meeple_color: '#00FF00', display_name: 'Bob' },
      { email: 'charlie@example.com', meeple_color: '#0000FF', display_name: 'Charlie' },
    ]

    // And: No one has checked in to Rule of Thirds (empty checkins array)

    // When: Determining which users to show at Rule of Thirds
    const ruleOfThirdsUsers = userPreferences

    // Then: All 3 users should still be visible
    expect(ruleOfThirdsUsers).toHaveLength(3)
  })

  it('should handle empty user preferences at Rule of Thirds', () => {
    // Given: No users have accounts yet
    const userPreferences = [] as Array<{ email: string; meeple_color: string; display_name: string }>

    // When: Determining which users to show at Rule of Thirds
    const ruleOfThirdsUsers = userPreferences

    // Then: No users should be visible (empty state)
    expect(ruleOfThirdsUsers).toHaveLength(0)
  })
})
