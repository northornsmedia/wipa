CREATE TABLE public.podcasts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    content_type TEXT NOT NULL,
    subcategory TEXT,
    host_name TEXT,
    guest_names TEXT,
    topic_tag TEXT,
    custom_topic TEXT,
    duration TEXT,
    is_featured BOOLEAN DEFAULT false,
    cover_image_url TEXT,
    media_file_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.podcasts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on podcasts" ON public.podcasts FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert access on podcasts" ON public.podcasts FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update access on podcasts" ON public.podcasts FOR UPDATE USING (auth.role() = 'authenticated');

INSERT INTO storage.buckets (id, name, public) VALUES ('podcasts', 'podcasts', true) ON CONFLICT DO NOTHING;

CREATE POLICY "Public read access on podcasts bucket" ON storage.objects FOR SELECT USING (bucket_id = 'podcasts');
CREATE POLICY "Authenticated insert access on podcasts bucket" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'podcasts' AND auth.role() = 'authenticated');
