CREATE TABLE firm_claim_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_slug TEXT,
  firm_name TEXT,
  requester_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT,
  proof TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE firm_claim_requests ENABLE ROW LEVEL SECURITY;

-- Admins can do everything
CREATE POLICY "Admins full access on firm_claim_requests"
ON firm_claim_requests FOR ALL TO authenticated
USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
);

-- Users can insert and read their own
CREATE POLICY "Users can insert their own claim requests"
ON firm_claim_requests FOR INSERT TO authenticated
WITH CHECK (requester_id = auth.uid());

CREATE POLICY "Users can read their own claim requests"
ON firm_claim_requests FOR SELECT TO authenticated
USING (requester_id = auth.uid());
