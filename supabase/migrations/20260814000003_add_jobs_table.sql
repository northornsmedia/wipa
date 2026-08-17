-- Create jobs table
CREATE TABLE public.jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT,
    job_type TEXT,
    salary_range TEXT,
    description TEXT,
    application_url TEXT,
    posted_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- Policies for jobs
CREATE POLICY "Active jobs are viewable by everyone"
    ON public.jobs FOR SELECT
    USING (is_active = true);

-- Allow admins to see all jobs (this will work once is_admin is added, for now anyone can see their own)
CREATE POLICY "Users can see all their own posted jobs"
    ON public.jobs FOR SELECT
    USING (auth.uid() = posted_by);

CREATE POLICY "Users can post jobs"
    ON public.jobs FOR INSERT
    WITH CHECK (auth.uid() = posted_by);

CREATE POLICY "Users can update their own jobs"
    ON public.jobs FOR UPDATE
    USING (auth.uid() = posted_by);

CREATE POLICY "Users can delete their own jobs"
    ON public.jobs FOR DELETE
    USING (auth.uid() = posted_by);
