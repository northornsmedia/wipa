CREATE TABLE IF NOT EXISTS public.service_listing_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  provider_name TEXT NOT NULL,
  service_name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  website_url TEXT,
  contact_email TEXT NOT NULL,
  proof_of_association TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES public.profiles(id)
);

ALTER TABLE public.service_listing_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can submit service listing requests"
  ON public.service_listing_requests FOR INSERT
  WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Users can view their service listing requests"
  ON public.service_listing_requests FOR SELECT
  USING (auth.uid() = requester_id);

CREATE POLICY "Admins can review service listing requests"
  ON public.service_listing_requests FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ));

CREATE INDEX IF NOT EXISTS service_listing_requests_requester_idx
  ON public.service_listing_requests(requester_id, created_at DESC);
