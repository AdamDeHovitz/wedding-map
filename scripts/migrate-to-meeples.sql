-- Migration: Update user_preferences from avatar_seed to meeple_color
-- Run this in your Supabase SQL Editor to migrate existing data

-- Step 1: Add the new column
ALTER TABLE user_preferences ADD COLUMN IF NOT EXISTS meeple_color TEXT;

-- Step 2: Migrate existing data (assign random colors to existing users)
-- Using a simple hash function to assign consistent colors based on avatar_seed
UPDATE user_preferences
SET meeple_color = CASE
  WHEN meeple_color IS NULL THEN
    CASE (hashtext(avatar_seed) % 12)
      WHEN 0 THEN '#7B2D26'  -- Burgundy
      WHEN 1 THEN '#2D5016'  -- Forest Green
      WHEN 2 THEN '#1E3A8A'  -- Royal Blue
      WHEN 3 THEN '#F59E0B'  -- Golden Yellow
      WHEN 4 THEN '#6B21A8'  -- Deep Purple
      WHEN 5 THEN '#DC2626'  -- Coral Red
      WHEN 6 THEN '#0D9488'  -- Teal
      WHEN 7 THEN '#EA580C'  -- Burnt Orange
      WHEN 8 THEN '#1E293B'  -- Navy
      WHEN 9 THEN '#84A98C'  -- Sage Green
      WHEN 10 THEN '#86198F' -- Plum
      ELSE '#0EA5E9'         -- Sky Blue
    END
  ELSE meeple_color
END;

-- Step 3: Make meeple_color NOT NULL
ALTER TABLE user_preferences ALTER COLUMN meeple_color SET NOT NULL;

-- Step 4: Drop the old avatar_seed column (optional - comment out if you want to keep it)
ALTER TABLE user_preferences DROP COLUMN IF EXISTS avatar_seed;
