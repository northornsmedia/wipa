-- Add Meetn integration fields and webinar scheduling fields to resources table
ALTER TABLE resources 
ADD COLUMN IF NOT EXISTS meetn_room_id TEXT,
ADD COLUMN IF NOT EXISTS meetn_room_url TEXT,
ADD COLUMN IF NOT EXISTS meetn_host_url TEXT,
ADD COLUMN IF NOT EXISTS webinar_status TEXT DEFAULT 'scheduled',
ADD COLUMN IF NOT EXISTS webinar_platform TEXT DEFAULT 'meetn',
ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS duration_minutes INTEGER,
ADD COLUMN IF NOT EXISTS max_attendees INTEGER,
ADD COLUMN IF NOT EXISTS author_id UUID REFERENCES profiles(id);
