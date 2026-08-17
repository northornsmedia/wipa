-- Create events table
CREATE TABLE public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    event_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ,
    location TEXT,
    is_virtual BOOLEAN DEFAULT false,
    cover_image_url TEXT,
    organizer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    max_attendees INTEGER,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create event_registrations table
CREATE TABLE public.event_registrations (
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    registered_at TIMESTAMPTZ DEFAULT now(),
    PRIMARY KEY (event_id, user_id)
);

-- Enable RLS
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

-- Policies for events
CREATE POLICY "Events are viewable by everyone"
    ON public.events FOR SELECT
    USING (true);

CREATE POLICY "Users can create events"
    ON public.events FOR INSERT
    WITH CHECK (auth.uid() = organizer_id);

CREATE POLICY "Organizers can update their own events"
    ON public.events FOR UPDATE
    USING (auth.uid() = organizer_id);

CREATE POLICY "Organizers can delete their own events"
    ON public.events FOR DELETE
    USING (auth.uid() = organizer_id);

-- Policies for event_registrations
CREATE POLICY "Registrations are viewable by everyone"
    ON public.event_registrations FOR SELECT
    USING (true);

CREATE POLICY "Users can register themselves for events"
    ON public.event_registrations FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unregister themselves"
    ON public.event_registrations FOR DELETE
    USING (auth.uid() = user_id);
