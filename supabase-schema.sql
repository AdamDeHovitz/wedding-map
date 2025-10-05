-- Wedding Map Database Schema

-- Table: wedding_tables
-- Stores information about each wedding table and its associated address
CREATE TABLE wedding_tables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL, -- e.g., "Table 1"
  address TEXT NOT NULL, -- The physical address
  unique_code TEXT UNIQUE NOT NULL, -- Short code for the URL (e.g., "table-1")
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: user_preferences
-- Stores user settings (avatar choice, display name, etc.) once per user
CREATE TABLE user_preferences (
  email TEXT PRIMARY KEY, -- User's email from OAuth
  avatar_seed TEXT NOT NULL, -- Seed for generating consistent avatar
  display_name TEXT, -- Optional: let users customize their display name
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: guest_checkins
-- Stores each guest's check-in to a specific table/location
CREATE TABLE guest_checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_id UUID REFERENCES wedding_tables(id) ON DELETE CASCADE,
  guest_email TEXT NOT NULL, -- From Google OAuth, references user_preferences
  guest_name TEXT NOT NULL, -- From Google OAuth (or user_preferences.display_name)
  message TEXT, -- Optional message from guest
  checked_in_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(table_id, guest_email) -- Each guest can only check in once per table
);

-- Create indexes for better query performance
CREATE INDEX idx_guest_checkins_table_id ON guest_checkins(table_id);
CREATE INDEX idx_guest_checkins_email ON guest_checkins(guest_email);
CREATE INDEX idx_wedding_tables_code ON wedding_tables(unique_code);
CREATE INDEX idx_user_preferences_email ON user_preferences(email);

-- Enable Row Level Security
ALTER TABLE wedding_tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies for wedding_tables
-- Everyone can read tables
CREATE POLICY "Anyone can view wedding tables"
  ON wedding_tables FOR SELECT
  TO public
  USING (true);

-- Only authenticated users can insert (you can modify this later for admin-only)
CREATE POLICY "Authenticated users can create tables"
  ON wedding_tables FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- RLS Policies for guest_checkins
-- Everyone can read check-ins
CREATE POLICY "Anyone can view guest check-ins"
  ON guest_checkins FOR SELECT
  TO public
  USING (true);

-- Only authenticated users can check in
CREATE POLICY "Authenticated users can check in"
  ON guest_checkins FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Users can update their own check-ins (e.g., modify their message)
CREATE POLICY "Users can update their own check-ins"
  ON guest_checkins FOR UPDATE
  TO authenticated
  USING (guest_email = auth.jwt() ->> 'email')
  WITH CHECK (guest_email = auth.jwt() ->> 'email');

-- RLS Policies for user_preferences
-- Anyone can view user preferences (needed to display avatars on the map)
CREATE POLICY "Anyone can view user preferences"
  ON user_preferences FOR SELECT
  TO public
  USING (true);

-- Users can insert their own preferences
CREATE POLICY "Users can create their own preferences"
  ON user_preferences FOR INSERT
  TO authenticated
  WITH CHECK (email = auth.jwt() ->> 'email');

-- Users can update their own preferences
CREATE POLICY "Users can update their own preferences"
  ON user_preferences FOR UPDATE
  TO authenticated
  USING (email = auth.jwt() ->> 'email')
  WITH CHECK (email = auth.jwt() ->> 'email');
