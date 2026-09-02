-- Bring the jobs board schema in line with the fields used by the product UI.
-- Every statement is additive/idempotent so this can safely run against environments
-- that already received some of these columns manually.

ALTER TABLE public.jobs
  ADD COLUMN IF NOT EXISTS practice_area TEXT,
  ADD COLUMN IF NOT EXISTS experience_level TEXT,
  ADD COLUMN IF NOT EXISTS requirements JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS benefits JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS company_logo_url TEXT,
  ADD COLUMN IF NOT EXISTS application_email TEXT,
  ADD COLUMN IF NOT EXISTS is_featured BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS applicants_count INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS views_count INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

ALTER TABLE public.job_applications
  ADD COLUMN IF NOT EXISTS full_name TEXT,
  ADD COLUMN IF NOT EXISTS email TEXT,
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS linkedin_url TEXT,
  ADD COLUMN IF NOT EXISTS cover_note TEXT;

CREATE INDEX IF NOT EXISTS idx_jobs_active_created_at
  ON public.jobs (created_at DESC)
  WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_jobs_practice_area
  ON public.jobs (practice_area)
  WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_jobs_posted_by
  ON public.jobs (posted_by);

CREATE INDEX IF NOT EXISTS idx_job_applications_job_id
  ON public.job_applications (job_id);

-- Employers need to see applications to roles they own. Applicant access remains
-- governed by the existing "Applicants view their applications" policy.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'job_applications'
      AND policyname = 'Job owners view applications'
  ) THEN
    CREATE POLICY "Job owners view applications"
      ON public.job_applications FOR SELECT
      USING (
        EXISTS (
          SELECT 1
          FROM public.jobs
          WHERE jobs.id = job_applications.job_id
            AND jobs.posted_by = auth.uid()
        )
      );
  END IF;
END
$$;

CREATE OR REPLACE FUNCTION public.set_jobs_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_jobs_updated_at ON public.jobs;
CREATE TRIGGER set_jobs_updated_at
  BEFORE UPDATE ON public.jobs
  FOR EACH ROW
  EXECUTE FUNCTION public.set_jobs_updated_at();

CREATE OR REPLACE FUNCTION public.sync_job_applicants_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  affected_job_id UUID;
BEGIN
  affected_job_id := COALESCE(NEW.job_id, OLD.job_id);

  UPDATE public.jobs
  SET applicants_count = (
    SELECT count(*)::integer
    FROM public.job_applications
    WHERE job_id = affected_job_id
  )
  WHERE id = affected_job_id;

  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS sync_job_applicants_count ON public.job_applications;
CREATE TRIGGER sync_job_applicants_count
  AFTER INSERT OR DELETE ON public.job_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_job_applicants_count();

-- Backfill counters for applications created before this migration.
UPDATE public.jobs AS job
SET applicants_count = (
  SELECT count(*)::integer
  FROM public.job_applications AS application
  WHERE application.job_id = job.id
);
