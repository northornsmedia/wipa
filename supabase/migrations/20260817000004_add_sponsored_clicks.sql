CREATE TABLE sponsored_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID REFERENCES resources(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  clicked_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE sponsored_clicks ENABLE ROW LEVEL SECURITY;

-- Anyone can insert
CREATE POLICY "Anyone can insert sponsored clicks"
ON sponsored_clicks FOR INSERT TO public
WITH CHECK (true);

-- Only admins can view
CREATE POLICY "Only admins can view sponsored clicks"
ON sponsored_clicks FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.is_admin = true
  )
);
