-- Migration: Wedding Day Cleanup
-- Purpose: Clear all user and check-in data while preserving location information
-- ⚠️ WARNING: This is IRREVERSIBLE. Back up your database first if needed!
--
-- What this deletes:
--   ✗ All guest check-ins and messages
--   ✗ All user preferences (colors, display names, etc.)
--   ✗ All message read tracking
--   ✗ All message hearts/reactions
--
-- What this preserves:
--   ✓ All wedding_tables (locations, addresses, coordinates, descriptions)
--   ✓ Database schema and structure
--   ✓ RLS policies and indexes

-- Step 1: Delete message hearts (reactions)
-- No foreign key dependencies
DELETE FROM message_hearts;

-- Step 2: Delete message read tracking
-- References guest_checkins but has ON DELETE CASCADE, so order doesn't matter
-- But we'll delete it first to be explicit
DELETE FROM message_reads;

-- Step 3: Delete all guest check-ins and messages
-- References wedding_tables and user_preferences, but we're keeping tables
DELETE FROM guest_checkins;

-- Step 4: Delete all user preferences
-- No foreign key dependencies (is referenced by guest_checkins but those are gone)
DELETE FROM user_preferences;

-- Verification queries (optional - run these separately to confirm cleanup)
-- SELECT COUNT(*) as remaining_hearts FROM message_hearts;       -- Should be 0
-- SELECT COUNT(*) as remaining_reads FROM message_reads;         -- Should be 0
-- SELECT COUNT(*) as remaining_checkins FROM guest_checkins;     -- Should be 0
-- SELECT COUNT(*) as remaining_users FROM user_preferences;      -- Should be 0
-- SELECT COUNT(*) as preserved_tables FROM wedding_tables;       -- Should be 15 (or your count)

-- Success! Your database is now ready for the wedding day with a clean slate.
-- All location data has been preserved, and guests can start checking in fresh.
