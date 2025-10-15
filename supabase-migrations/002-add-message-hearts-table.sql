-- Migration: Add message_hearts table for reactions
-- Allows guests to heart/like messages from other guests

-- Create message_hearts table
CREATE TABLE message_hearts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  checkin_id UUID REFERENCES guest_checkins(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL, -- Email or username of person giving the heart
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(checkin_id, user_email) -- Each user can only heart a message once
);

-- Create index for performance
CREATE INDEX idx_message_hearts_checkin_id ON message_hearts(checkin_id);
CREATE INDEX idx_message_hearts_user_email ON message_hearts(user_email);

-- Enable Row Level Security
ALTER TABLE message_hearts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for message_hearts
-- Everyone can view hearts (to see counts)
CREATE POLICY "Anyone can view message hearts"
  ON message_hearts FOR SELECT
  TO public
  USING (true);

-- Authenticated users can add hearts
CREATE POLICY "Authenticated users can add hearts"
  ON message_hearts FOR INSERT
  TO authenticated
  WITH CHECK (user_email = auth.jwt() ->> 'email');

-- Users can remove their own hearts
CREATE POLICY "Users can remove their own hearts"
  ON message_hearts FOR DELETE
  TO authenticated
  USING (user_email = auth.jwt() ->> 'email');
