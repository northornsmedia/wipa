-- Add token columns to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS calendar_token TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS google_access_token TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS google_refresh_token TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS outlook_access_token TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS outlook_refresh_token TEXT;
