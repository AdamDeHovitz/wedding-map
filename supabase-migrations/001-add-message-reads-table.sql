-- Migration: Add message_reads table
-- Purpose: Track which check-in messages each user has read

-- Table: message_reads
-- Tracks when a user reads another user's check-in message
CREATE TABLE message_reads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reader_email TEXT NOT NULL, -- The user who read the message (references user_preferences.email)
  checkin_id UUID NOT NULL REFERENCES guest_checkins(id) ON DELETE CASCADE,
  read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(reader_email, checkin_id) -- Each user can only mark a message as read once
);

-- Create indexes for better query performance
CREATE INDEX idx_message_reads_reader ON message_reads(reader_email);
CREATE INDEX idx_message_reads_checkin ON message_reads(checkin_id);
CREATE INDEX idx_message_reads_reader_checkin ON message_reads(reader_email, checkin_id);

-- Enable Row Level Security
ALTER TABLE message_reads ENABLE ROW LEVEL SECURITY;

-- RLS Policies for message_reads
-- Users can view their own read status
CREATE POLICY "Users can view their own read status"
  ON message_reads FOR SELECT
  TO authenticated
  USING (reader_email = auth.jwt() ->> 'email');

-- Users can mark messages as read
CREATE POLICY "Users can mark messages as read"
  ON message_reads FOR INSERT
  TO authenticated
  WITH CHECK (reader_email = auth.jwt() ->> 'email');

-- Add a function to automatically mark messages as unread when they're edited
-- This ensures users see updated messages
CREATE OR REPLACE FUNCTION mark_message_as_unread_on_edit()
RETURNS TRIGGER AS $$
BEGIN
  -- If the message field changed, delete all read records for this checkin
  IF OLD.message IS DISTINCT FROM NEW.message THEN
    DELETE FROM message_reads WHERE checkin_id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to run the function when a checkin is updated
CREATE TRIGGER trigger_mark_unread_on_edit
  AFTER UPDATE ON guest_checkins
  FOR EACH ROW
  EXECUTE FUNCTION mark_message_as_unread_on_edit();
