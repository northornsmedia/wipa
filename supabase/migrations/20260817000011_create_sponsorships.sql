-- Create Sponsorship Packages Table
CREATE TABLE IF NOT EXISTS public.sponsorship_packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    price NUMERIC NOT NULL,
    currency TEXT DEFAULT 'GBP',
    benefits JSONB DEFAULT '[]'::jsonb,
    logo_placement BOOLEAN DEFAULT false,
    banner_placement BOOLEAN DEFAULT false,
    social_mention BOOLEAN DEFAULT false,
    email_mention BOOLEAN DEFAULT false,
    max_sponsors INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create Event Sponsorships Table
CREATE TABLE IF NOT EXISTS public.event_sponsorships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    business_profile_id UUID REFERENCES public.business_profiles(id) ON DELETE SET NULL,
    package_id UUID REFERENCES public.sponsorship_packages(id) ON DELETE RESTRICT,
    sponsor_name TEXT NOT NULL,
    sponsor_logo_url TEXT,
    sponsor_website_url TEXT,
    sponsor_tagline TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'paid')),
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    approved_at TIMESTAMP WITH TIME ZONE,
    approved_by UUID REFERENCES public.profiles(id),
    stripe_payment_intent_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- RLS Policies
ALTER TABLE public.sponsorship_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_sponsorships ENABLE ROW LEVEL SECURITY;

-- Sponsorship Packages are readable by everyone, modifiable by admins
CREATE POLICY "Sponsorship packages are viewable by everyone" ON public.sponsorship_packages FOR SELECT USING (true);
CREATE POLICY "Admins can manage sponsorship packages" ON public.sponsorship_packages FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- Event Sponsorships: anyone can view approved/paid, admins can view all, creators can view their own
CREATE POLICY "Approved event sponsorships are viewable by everyone" ON public.event_sponsorships FOR SELECT USING (status IN ('approved', 'paid'));
CREATE POLICY "Admins can manage all event sponsorships" ON public.event_sponsorships FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);
CREATE POLICY "Users can create event sponsorships for their business" ON public.event_sponsorships FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.business_profiles bp JOIN public.profiles p ON bp.id = p.business_profile_id WHERE p.id = auth.uid() AND bp.id = business_profile_id)
);
CREATE POLICY "Users can view their own event sponsorships" ON public.event_sponsorships FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.business_profiles bp JOIN public.profiles p ON bp.id = p.business_profile_id WHERE p.id = auth.uid() AND bp.id = business_profile_id)
);

-- Seed Packages
INSERT INTO public.sponsorship_packages (name, price, currency, benefits, logo_placement, banner_placement, social_mention, email_mention)
VALUES 
  ('Bronze Package', 500.00, 'GBP', '["Logo on event page", "1 Free Ticket"]', true, false, false, false),
  ('Silver Package', 1500.00, 'GBP', '["Premium logo placement", "Banner on event page", "2 Free Tickets", "Social media mention"]', true, true, true, false),
  ('Gold Package', 3000.00, 'GBP', '["Featured banner placement", "5 Free Tickets", "Social media mentions", "Dedicated email blast mention", "Booth at event"]', true, true, true, true);
