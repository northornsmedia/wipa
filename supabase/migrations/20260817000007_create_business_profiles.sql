CREATE TABLE business_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  type TEXT,
  logo_url TEXT,
  cover_image_url TEXT,
  tagline TEXT,
  description TEXT,
  website_url TEXT,
  linkedin_url TEXT,
  founded_year INT,
  company_size TEXT,
  headquarters TEXT,
  specializations TEXT[],
  contact_email TEXT,
  phone TEXT,
  is_verified BOOLEAN DEFAULT false,
  membership_tier TEXT DEFAULT 'free',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE business_team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES business_profiles(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT,
  is_admin BOOLEAN DEFAULT false,
  joined_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(business_id, profile_id)
);

-- RLS for business_profiles
ALTER TABLE business_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for business_profiles"
ON business_profiles FOR SELECT TO public
USING (true);

CREATE POLICY "Users can insert business_profiles"
ON business_profiles FOR INSERT TO authenticated
WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Admins or owners can update business_profiles"
ON business_profiles FOR UPDATE TO authenticated
USING (
  owner_id = auth.uid() OR
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
);

-- RLS for business_team_members
ALTER TABLE business_team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for business_team_members"
ON business_team_members FOR SELECT TO public
USING (true);

CREATE POLICY "Business admins can manage team"
ON business_team_members FOR ALL TO authenticated
USING (
  EXISTS (SELECT 1 FROM business_profiles WHERE id = business_team_members.business_id AND owner_id = auth.uid()) OR
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
);
