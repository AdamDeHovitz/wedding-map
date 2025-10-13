-- Migration: Update unique codes for Clark Street and State Street
-- Date: 2025-01-13
-- Description: Updates table codes while maintaining backward compatibility through app-level redirects

-- Update Clark Street code from 'cannabispinoy' to 'promenade'
UPDATE wedding_tables
SET unique_code = 'promenade'
WHERE unique_code = 'cannabispinoy';

-- Update State Street code from 'hoyt-schermerhorn' to 'lovelove'
UPDATE wedding_tables
SET unique_code = 'lovelove'
WHERE unique_code = 'hoyt-schermerhorn';

-- Verify updates (optional - for manual review)
-- SELECT name, unique_code FROM wedding_tables WHERE name IN ('Clark Street', 'State Street');
