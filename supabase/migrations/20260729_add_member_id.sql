-- 1. Add the column without constraints first
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS member_id TEXT;

-- 2. Create the function
CREATE OR REPLACE FUNCTION public.generate_member_id()
RETURNS TEXT AS $$
DECLARE
  new_id TEXT;
  done bool;
BEGIN
  done := false;
  WHILE NOT done LOOP
    new_id := 'WP-' || lpad(cast(floor(random() * 1000000) as text), 6, '0');
    done := NOT exists(SELECT 1 FROM public.profiles WHERE member_id = new_id);
  END LOOP;
  RETURN new_id;
END;
$$ LANGUAGE plpgsql VOLATILE;

-- 3. Update existing rows one by one
DO $$ 
DECLARE
  r RECORD;
BEGIN
  FOR r IN SELECT id FROM public.profiles WHERE member_id IS NULL LOOP
    UPDATE public.profiles SET member_id = public.generate_member_id() WHERE id = r.id;
  END LOOP;
END $$;

-- 4. Make it unique
ALTER TABLE public.profiles ADD CONSTRAINT profiles_member_id_key UNIQUE (member_id);

-- 5. Set default for future inserts
ALTER TABLE public.profiles ALTER COLUMN member_id SET DEFAULT public.generate_member_id();
