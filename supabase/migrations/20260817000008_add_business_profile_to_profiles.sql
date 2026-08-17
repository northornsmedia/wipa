ALTER TABLE profiles 
ADD COLUMN business_profile_id UUID REFERENCES business_profiles(id) ON DELETE SET NULL;
