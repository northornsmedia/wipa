-- Add WIPA Recommended fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_wipa_recommended BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS recommended_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS recommended_by UUID REFERENCES public.profiles(id);

-- Update RLS policy to allow admins to modify these fields
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
