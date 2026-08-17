ALTER TABLE resources
ADD COLUMN is_splash_sponsored BOOLEAN DEFAULT false,
ADD COLUMN splash_expires_at TIMESTAMPTZ,
ADD COLUMN splash_tagline TEXT,
ADD COLUMN splash_cta_text TEXT,
ADD COLUMN splash_cta_url TEXT,
ADD COLUMN splash_background_color TEXT;
