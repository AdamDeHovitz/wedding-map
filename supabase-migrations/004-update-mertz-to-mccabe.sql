-- Migration: Update unique code for Swarthmore table
-- Date: 2025-01-13
-- Description: Updates table code from 'mertz' to 'mccabe' while maintaining backward compatibility through app-level redirects

-- Update Swarthmore code from 'mertz' to 'mccabe'
UPDATE wedding_tables
SET unique_code = 'mccabe'
WHERE unique_code = 'mertz';

-- Verify update (optional - for manual review)
-- SELECT name, unique_code, address FROM wedding_tables WHERE address LIKE '%Swarthmore%';
