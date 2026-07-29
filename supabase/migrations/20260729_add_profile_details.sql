-- Add new professional details columns to the profiles table
ALTER TABLE profiles
ADD COLUMN company text,
ADD COLUMN role text,
ADD COLUMN experience_years integer,
ADD COLUMN education text,
ADD COLUMN skills text;
