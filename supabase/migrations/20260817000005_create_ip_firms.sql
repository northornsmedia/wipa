CREATE TABLE ip_firms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  cover_image_url TEXT,
  description TEXT,
  website_url TEXT,
  linkedin_url TEXT,
  headquarters TEXT,
  offices JSONB,
  size_range TEXT,
  founded_year INT,
  specializations TEXT[],
  jurisdictions TEXT[],
  is_verified BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  is_claimed BOOLEAN DEFAULT false,
  claimed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  claimed_at TIMESTAMPTZ,
  contact_email TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE ip_firm_team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id UUID REFERENCES ip_firms(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT,
  is_primary_contact BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE ip_firm_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id UUID REFERENCES ip_firms(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS for ip_firms
ALTER TABLE ip_firms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "IP firms are viewable by everyone"
ON ip_firms FOR SELECT TO public
USING (true);

CREATE POLICY "IP firms can be updated by admin or claimed owner"
ON ip_firms FOR UPDATE TO authenticated
USING (
  claimed_by = auth.uid() OR 
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
);

CREATE POLICY "IP firms can be inserted by admin"
ON ip_firms FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
);

-- RLS for ip_firm_team_members
ALTER TABLE ip_firm_team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Team members viewable by everyone"
ON ip_firm_team_members FOR SELECT TO public
USING (true);

-- RLS for ip_firm_reviews
ALTER TABLE ip_firm_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviews viewable by everyone"
ON ip_firm_reviews FOR SELECT TO public
USING (true);

CREATE POLICY "Authenticated users can insert reviews"
ON ip_firm_reviews FOR INSERT TO authenticated
WITH CHECK (true);
