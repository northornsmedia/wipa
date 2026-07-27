-- 1. Add Onboarding Fields to Profiles Table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS mobile_number TEXT,
ADD COLUMN IF NOT EXISTS linkedin_url TEXT,
ADD COLUMN IF NOT EXISTS website_url TEXT,
ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS verification_document_url TEXT,
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false;

-- 2. Create Storage Bucket for Verification Documents
INSERT INTO storage.buckets (id, name, public) 
VALUES ('verifications', 'verifications', false)
ON CONFLICT (id) DO NOTHING;

-- 3. Storage Policies for Verifications
CREATE POLICY "Users can upload their own verification docs."
  ON storage.objects FOR INSERT
  WITH CHECK ( bucket_id = 'verifications' AND auth.uid()::text = (storage.foldername(name))[1] );

CREATE POLICY "Users can view their own verification docs."
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'verifications' AND auth.uid()::text = (storage.foldername(name))[1] );

-- Only admins should view all, but for now we'll allow users to view their own.
