'use client';

import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import {
  ArrowRight,
  BadgeCheck,
  Bookmark,
  BriefcaseBusiness,
  Building2,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleDollarSign,
  Clock3,
  Cpu,
  ExternalLink,
  FileText,
  Gavel,
  Handshake,
  Layers3,
  LoaderCircle,
  MapPin,
  Plus,
  Search,
  Send,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Tags,
  X,
} from 'lucide-react';
import AdSlot from '@/components/AdSlot';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/store/useAppStore';

type JobsTab = 'discover' | 'saved' | 'applied';
type SortMode = 'newest' | 'salary';

interface JobRecord {
  id: string;
  title: string;
  company?: string | null;
  company_name?: string | null;
  location?: string | null;
  job_type?: string | null;
  salary_range?: string | null;
  description?: string | null;
  application_url?: string | null;
  application_email?: string | null;
  posted_by?: string | null;
  is_active?: boolean | null;
  created_at?: string | null;
  practice_area?: string | null;
  experience_level?: string | null;
  requirements?: unknown;
  benefits?: unknown;
  company_logo_url?: string | null;
  applicants_count?: number | null;
  is_featured?: boolean | null;
  poster?: { is_wipa_recommended?: boolean | null } | null;
}

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  applicationUrl: string;
  applicationEmail: string;
  postedBy: string;
  createdAt: string;
  practiceArea: string;
  experienceLevel: string;
  requirements: string[];
  benefits: string[];
  applicantsCount: number;
  isFeatured: boolean;
  isVerified: boolean;
  isSaved: boolean;
  hasApplied: boolean;
  accent: string;
}

const PRACTICE_AREAS: Array<{ id: string; label: string; Icon: LucideIcon }> = [
  { id: 'all', label: 'All disciplines', Icon: Layers3 },
  { id: 'patent', label: 'Patents', Icon: ShieldCheck },
  { id: 'trademark', label: 'Trademarks', Icon: Tags },
  { id: 'litigation', label: 'Litigation', Icon: Gavel },
  { id: 'legaltech', label: 'Legal tech', Icon: Cpu },
  { id: 'licensing', label: 'Licensing', Icon: Handshake },
];

const JOB_ACCENTS = ['#5a32fa', '#ec4899', '#0f9f8f', '#2563eb', '#d97706', '#7c3aed'];

function stringList(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((item): item is string => typeof item === 'string' && Boolean(item.trim()));
  if (typeof value !== 'string' || !value.trim()) return [];
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed.filter((item): item is string => typeof item === 'string');
  } catch {
    return value.split('\n').map((item) => item.trim()).filter(Boolean);
  }
  return [];
}

function inferPracticeArea(job: JobRecord) {
  if (job.practice_area) return job.practice_area;
  const source = `${job.title || ''} ${job.description || ''}`.toLowerCase();
  if (source.includes('trademark') || source.includes('brand')) return 'trademark';
  if (source.includes('litigat') || source.includes('dispute')) return 'litigation';
  if (source.includes('licens') || source.includes('commercial')) return 'licensing';
  if (source.includes('software') || source.includes(' ai ') || source.includes('technology')) return 'legaltech';
  return 'patent';
}

function accentFor(value: string) {
  const score = value.split('').reduce((total, character) => total + character.charCodeAt(0), 0);
  return JOB_ACCENTS[score % JOB_ACCENTS.length];
}

function salaryScore(value: string) {
  const match = value.replace(/,/g, '').match(/(\d+(?:\.\d+)?)\s*(k)?/i);
  if (!match) return 0;
  const amount = Number(match[1]);
  return match[2] ? amount * 1000 : amount;
}

function displayDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Recently';
  return formatDistanceToNow(date, { addSuffix: true });
}

function normalizeJob(record: JobRecord, savedIds: Set<string>, appliedIds: Set<string>): Job {
  const company = record.company || record.company_name || 'Confidential employer';
  return {
    id: record.id,
    title: record.title,
    company,
    location: record.location || 'Flexible location',
    type: record.job_type || 'Flexible',
    salary: record.salary_range || 'Compensation shared on application',
    description: record.description || 'Connect with the hiring team to learn more about this opportunity.',
    applicationUrl: record.application_url || '',
    applicationEmail: record.application_email || '',
    postedBy: record.posted_by || '',
    createdAt: record.created_at || new Date().toISOString(),
    practiceArea: inferPracticeArea(record),
    experienceLevel: record.experience_level || 'Experience open',
    requirements: stringList(record.requirements),
    benefits: stringList(record.benefits),
    applicantsCount: record.applicants_count || 0,
    isFeatured: Boolean(record.is_featured),
    isVerified: Boolean(record.poster?.is_wipa_recommended),
    isSaved: savedIds.has(record.id),
    hasApplied: appliedIds.has(record.id),
    accent: accentFor(company),
  };
}

const inputClass = 'w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#6d4aff] focus:ring-4 focus:ring-[#6d4aff]/10 dark:border-white/10 dark:bg-white/[0.05] dark:text-white dark:placeholder:text-slate-500';

export default function JobsPage() {
  const { user } = useAppStore();
  const userId = user?.id;
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [tab, setTab] = useState<JobsTab>('discover');
  const [query, setQuery] = useState('');
  const [practiceArea, setPracticeArea] = useState('all');
  const [workType, setWorkType] = useState('All types');
  const [sortMode, setSortMode] = useState<SortMode>('newest');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ tone: 'success' | 'error'; message: string } | null>(null);

  const [applicantName, setApplicantName] = useState(() => user?.name || '');
  const [applicantEmail, setApplicantEmail] = useState(() => user?.email || '');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [applicantLinkedIn, setApplicantLinkedIn] = useState('');
  const [applicantNote, setApplicantNote] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [applicationError, setApplicationError] = useState('');

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 3600);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  useEffect(() => {
    const hasModal = Boolean(selectedJob);
    document.body.style.overflow = hasModal ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [selectedJob]);

  const fetchJobs = useCallback(async () => {
    setIsLoading(true);
    setLoadError('');

    try {
      let jobsResult = await supabase
        .from('jobs')
        .select('*, poster:profiles(is_wipa_recommended)')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (jobsResult.error) {
        jobsResult = await supabase
          .from('jobs')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });
      }

      if (jobsResult.error) throw jobsResult.error;

      const savedIds = new Set<string>();
      const appliedIds = new Set<string>();

      if (userId) {
        const [savedResult, applicationsResult] = await Promise.all([
          supabase.from('saved_jobs').select('job_id').eq('user_id', userId),
          supabase.from('job_applications').select('job_id').eq('applicant_id', userId),
        ]);
        savedResult.data?.forEach((row: { job_id: string }) => savedIds.add(row.job_id));
        applicationsResult.data?.forEach((row: { job_id: string }) => appliedIds.add(row.job_id));
      }

      setJobs(((jobsResult.data || []) as JobRecord[]).map((record) => normalizeJob(record, savedIds, appliedIds)));
    } catch (error) {
      console.error('Unable to load jobs:', error);
      setLoadError('We could not reach the careers database. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => { void fetchJobs(); });
    return () => window.cancelAnimationFrame(frame);
  }, [fetchJobs]);

  const stats = useMemo(() => {
    const companies = new Set(jobs.map((job) => job.company.toLowerCase())).size;
    const remote = jobs.filter((job) => job.type.toLowerCase().includes('remote')).length;
    return { roles: jobs.length, companies, remote };
  }, [jobs]);

  const employerCounts = useMemo(() => {
    const counts = new Map<string, { company: string; count: number; accent: string }>();
    jobs.forEach((job) => {
      const key = job.company.toLowerCase();
      const current = counts.get(key);
      counts.set(key, { company: job.company, count: (current?.count || 0) + 1, accent: job.accent });
    });
    return [...counts.values()].sort((a, b) => b.count - a.count).slice(0, 4);
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return jobs
      .filter((job) => {
        if (tab === 'saved' && !job.isSaved) return false;
        if (tab === 'applied' && !job.hasApplied) return false;
        if (practiceArea !== 'all' && job.practiceArea !== practiceArea) return false;
        if (workType !== 'All types' && !job.type.toLowerCase().includes(workType.toLowerCase())) return false;
        if (!normalizedQuery) return true;
        return [job.title, job.company, job.location, job.description, job.experienceLevel]
          .some((value) => value.toLowerCase().includes(normalizedQuery));
      })
      .sort((a, b) => sortMode === 'salary'
        ? salaryScore(b.salary) - salaryScore(a.salary)
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [jobs, practiceArea, query, sortMode, tab, workType]);

  const toggleSave = async (job: Job) => {
    if (!user?.id) {
      setToast({ tone: 'error', message: 'Sign in to save opportunities.' });
      return;
    }

    const nextSaved = !job.isSaved;
    setSavingId(job.id);
    setJobs((current) => current.map((item) => item.id === job.id ? { ...item, isSaved: nextSaved } : item));
    setSelectedJob((current) => current?.id === job.id ? { ...current, isSaved: nextSaved } : current);

    const { error } = nextSaved
      ? await supabase.from('saved_jobs').upsert(
          { job_id: job.id, user_id: user.id },
          { onConflict: 'job_id,user_id', ignoreDuplicates: true },
        )
      : await supabase.from('saved_jobs').delete().match({ job_id: job.id, user_id: user.id });

    if (error) {
      setJobs((current) => current.map((item) => item.id === job.id ? { ...item, isSaved: !nextSaved } : item));
      setSelectedJob((current) => current?.id === job.id ? { ...current, isSaved: !nextSaved } : current);
      setToast({ tone: 'error', message: 'That change did not save. Please try again.' });
    } else {
      setToast({ tone: 'success', message: nextSaved ? 'Role saved to your shortlist.' : 'Role removed from your shortlist.' });
    }
    setSavingId(null);
  };

  const applyToJob = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedJob || !user?.id) {
      setApplicationError('Please sign in before submitting an application.');
      return;
    }

    setIsApplying(true);
    setApplicationError('');
    const richPayload = {
      job_id: selectedJob.id,
      applicant_id: user.id,
      status: 'pending',
      full_name: applicantName.trim(),
      email: applicantEmail.trim(),
      phone: applicantPhone.trim() || null,
      linkedin_url: applicantLinkedIn.trim() || null,
      cover_note: applicantNote.trim() || null,
    };

    try {
      let result = await supabase.from('job_applications').insert(richPayload);
      if (result.error && /(full_name|linkedin_url|cover_note|phone|email)/i.test(result.error.message || '')) {
        result = await supabase.from('job_applications').insert({
          job_id: selectedJob.id,
          applicant_id: user.id,
          status: 'pending',
        });
      }

      if (result.error && result.error.code !== '23505') throw result.error;

      setJobs((current) => current.map((job) => job.id === selectedJob.id ? { ...job, hasApplied: true } : job));
      setSelectedJob((current) => current ? { ...current, hasApplied: true } : current);
      setToast({ tone: 'success', message: 'Application sent to the hiring team.' });
    } catch (error) {
      console.error('Unable to submit application:', error);
      setApplicationError(error instanceof Error ? error.message : 'Unable to submit your application. Please try again.');
    } finally {
      setIsApplying(false);
    }
  };

  const openJob = (job: Job) => {
    setApplicantName((current) => current || user?.name || '');
    setApplicantEmail((current) => current || user?.email || '');
    setSelectedJob(job);
    setApplicationError('');
  };

  return (
    <div className="min-h-screen bg-[#f7f7fb] pb-24 text-slate-950 dark:bg-[#090b12] dark:text-white md:pb-12">
      {toast && (
        <div className="fixed bottom-24 left-1/2 z-[80] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 md:bottom-8 md:left-auto md:right-8 md:w-auto md:translate-x-0">
          <div className={`flex items-center gap-3 rounded-2xl border px-4 py-3.5 text-sm font-bold shadow-2xl backdrop-blur-xl ${toast.tone === 'success' ? 'border-emerald-300/40 bg-slate-950 text-white' : 'border-rose-300/40 bg-rose-950 text-white'}`}>
            {toast.tone === 'success' ? <CheckCircle2 className="text-emerald-400" size={19} /> : <X className="text-rose-300" size={19} />}
            {toast.message}
          </div>
        </div>
      )}

      <section className="border-b border-slate-200 bg-white dark:border-white/10 dark:bg-[#0f172a]">

        <div className="mx-auto grid max-w-7xl gap-7 px-4 py-8 sm:px-6 md:py-10 lg:grid-cols-[1fr_340px] lg:items-center lg:px-8">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 text-xs font-extrabold text-[#5a32fa] dark:text-violet-300">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#5a32fa]/10"><BriefcaseBusiness size={17} /></span>
              WIPA Jobs Board
            </div>
            <h1 className="max-w-3xl text-3xl font-extrabold leading-tight tracking-[-0.035em] text-slate-950 sm:text-4xl md:text-[42px] dark:text-white">
              Where IP careers <span className="text-[#5a32fa] dark:text-violet-300">move forward.</span>
            </h1>
            <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-slate-500 sm:text-[15px] dark:text-slate-400">
              Discover opportunities shaped for IP leaders, specialists, and innovators — curated inside the world’s most ambitious women-led IP network.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/platform/jobs/post"
                className="group inline-flex items-center gap-2 rounded-xl bg-[#5a32fa] px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-[#5a32fa]/15 transition hover:-translate-y-0.5 hover:bg-[#4b24e8]"
              >
                <Plus size={17} strokeWidth={2.8} /> Post a job
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold text-slate-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300">
                <ShieldCheck size={17} className="text-emerald-500" /> Member-led, trusted hiring
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-white/[0.04]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Career pulse</p>
                <p className="mt-1 text-sm font-bold text-slate-700 dark:text-slate-200">Live across the network</p>
              </div>
              <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-black uppercase text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" /> Live
              </span>
            </div>
            <div className="mt-5 grid grid-cols-3 divide-x divide-slate-200 dark:divide-white/10">
              <div className="pr-3"><p className="text-2xl font-black">{stats.roles}</p><p className="mt-1 text-[10px] font-bold text-slate-400">Open roles</p></div>
              <div className="px-3"><p className="text-2xl font-black">{stats.companies}</p><p className="mt-1 text-[10px] font-bold text-slate-400">Employers</p></div>
              <div className="pl-3"><p className="text-2xl font-black">{stats.remote}</p><p className="mt-1 text-[10px] font-bold text-slate-400">Remote</p></div>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 mt-6 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-[#121520]">
          <div className="grid gap-2 md:grid-cols-[1fr_180px_150px]">
            <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 dark:bg-white/[0.045]">
              <Search size={20} className="shrink-0 text-[#6d4aff]" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search roles, companies, skills, or locations"
                className="min-w-0 flex-1 bg-transparent py-3.5 text-sm font-semibold outline-none placeholder:text-slate-400"
              />
              {query && <button onClick={() => setQuery('')} aria-label="Clear search" className="rounded-full p-1 text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10"><X size={15} /></button>}
            </div>
            <div className="relative">
              <BriefcaseBusiness size={16} className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-slate-400" />
              <select value={workType} onChange={(event) => setWorkType(event.target.value)} className="h-full w-full appearance-none rounded-2xl bg-slate-50 py-3 pl-11 pr-9 text-sm font-bold outline-none dark:bg-white/[0.045]">
                <option>All types</option><option>Remote</option><option>Hybrid</option><option>On-site</option>
              </select>
              <ChevronDown size={15} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
            <div className="relative">
              <SlidersHorizontal size={16} className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-slate-400" />
              <select value={sortMode} onChange={(event) => setSortMode(event.target.value as SortMode)} className="h-full w-full appearance-none rounded-2xl bg-slate-50 py-3 pl-11 pr-8 text-sm font-bold outline-none dark:bg-white/[0.045]">
                <option value="newest">Newest</option><option value="salary">Salary</option>
              </select>
              <ChevronDown size={15} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {PRACTICE_AREAS.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setPracticeArea(id)}
              className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-xs font-extrabold transition ${practiceArea === id ? 'border-[#5a32fa] bg-[#5a32fa] text-white shadow-lg shadow-[#5a32fa]/15' : 'border-slate-200 bg-white text-slate-600 hover:border-violet-300 hover:text-[#5a32fa] dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300'}`}
            >
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>

        <div className="mt-7 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
          <section>
            <div className="mb-5 flex flex-col gap-4 border-b border-slate-200 pb-4 sm:flex-row sm:items-end sm:justify-between dark:border-white/10">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#6d4aff]">Curated for the WIPA network</p>
                <h2 className="mt-1 text-2xl font-extrabold tracking-tight">
                  {tab === 'discover' ? 'Explore opportunities' : tab === 'saved' ? 'Your shortlist' : 'Your applications'}
                </h2>
              </div>
              <div className="flex items-center gap-1 rounded-2xl bg-slate-100 p-1 dark:bg-white/[0.05]">
                {([
                  ['discover', 'Discover', jobs.length],
                  ['saved', 'Saved', jobs.filter((job) => job.isSaved).length],
                  ['applied', 'Applied', jobs.filter((job) => job.hasApplied).length],
                ] as const).map(([value, label, count]) => (
                  <button key={value} onClick={() => setTab(value)} className={`rounded-xl px-3 py-2 text-xs font-extrabold transition ${tab === value ? 'bg-white text-slate-950 shadow-sm dark:bg-[#232737] dark:text-white' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}>
                    {label} <span className="ml-1 text-[10px] opacity-60">{count}</span>
                  </button>
                ))}
              </div>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {[0, 1, 2].map((item) => <div key={item} className="h-56 animate-pulse rounded-[1.75rem] border border-slate-200 bg-white dark:border-white/10 dark:bg-white/[0.04]" />)}
              </div>
            ) : loadError ? (
              <div className="rounded-[1.75rem] border border-rose-200 bg-white p-10 text-center dark:border-rose-500/20 dark:bg-white/[0.04]">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-500 dark:bg-rose-500/10"><X size={22} /></div>
                <h3 className="mt-4 text-lg font-black">The job board is taking a breather</h3>
                <p className="mt-2 text-sm text-slate-500">{loadError}</p>
                <button onClick={() => void fetchJobs()} className="mt-5 rounded-xl bg-slate-950 px-4 py-2.5 text-xs font-black text-white dark:bg-white dark:text-slate-950">Try again</button>
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="rounded-[1.75rem] border border-dashed border-violet-200 bg-white p-12 text-center dark:border-violet-500/20 dark:bg-white/[0.035]">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-violet-50 text-[#5a32fa] dark:bg-violet-500/10"><BriefcaseBusiness size={28} /></div>
                <h3 className="mt-5 text-xl font-extrabold">No roles here yet</h3>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                  {tab === 'saved' ? 'Save a role that catches your eye and it will appear here.' : tab === 'applied' ? 'Once you apply, you can track the opportunity here.' : 'Try a broader search or switch one of your filters.'}
                </p>
                {tab === 'discover' && <button onClick={() => { setQuery(''); setPracticeArea('all'); setWorkType('All types'); }} className="mt-5 text-sm font-black text-[#5a32fa]">Clear all filters</button>}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredJobs.map((job) => (
                  <article key={job.id} className="group relative overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-xl hover:shadow-violet-950/[0.06] sm:p-6 dark:border-white/10 dark:bg-[#12151f] dark:hover:border-violet-500/40">
                    <div className="absolute bottom-0 left-0 top-0 w-1 opacity-0 transition group-hover:opacity-100" style={{ backgroundColor: job.accent }} />
                    <div className="flex items-start gap-4">
                      <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl text-xl font-black text-white shadow-lg" style={{ background: `linear-gradient(145deg, ${job.accent}, ${job.accent}bb)` }}>
                        {job.company.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-500">
                              <span className="truncate">{job.company}</span>
                              {job.isVerified && <span className="inline-flex items-center gap-1 text-[#5a32fa]"><BadgeCheck size={14} /> Verified</span>}
                              {job.isFeatured && <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">Spotlight</span>}
                            </div>
                            <button onClick={() => openJob(job)} className="mt-1.5 text-left text-lg font-extrabold leading-tight tracking-tight transition group-hover:text-[#5a32fa] sm:text-xl dark:group-hover:text-violet-300">
                              {job.title}
                            </button>
                          </div>
                          <button onClick={() => void toggleSave(job)} disabled={savingId === job.id} aria-label={job.isSaved ? 'Remove saved job' : 'Save job'} className={`shrink-0 rounded-xl border p-2.5 transition ${job.isSaved ? 'border-[#5a32fa]/30 bg-violet-50 text-[#5a32fa] dark:bg-violet-500/10' : 'border-slate-200 text-slate-400 hover:border-violet-300 hover:text-[#5a32fa] dark:border-white/10'}`}>
                            {savingId === job.id ? <LoaderCircle size={18} className="animate-spin" /> : <Bookmark size={18} className={job.isSaved ? 'fill-current' : ''} />}
                          </button>
                        </div>

                        <p className="mt-3 line-clamp-2 text-sm font-medium leading-6 text-slate-600 dark:text-slate-300">{job.description}</p>

                        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-[11px] font-bold text-slate-500 dark:text-slate-400">
                          <span className="flex items-center gap-1.5"><MapPin size={14} className="text-[#6d4aff]" /> {job.location}</span>
                          <span className="flex items-center gap-1.5"><BriefcaseBusiness size={14} className="text-[#6d4aff]" /> {job.type}</span>
                          <span className="flex items-center gap-1.5"><CircleDollarSign size={14} className="text-emerald-500" /> {job.salary}</span>
                          <span className="flex items-center gap-1.5"><Clock3 size={14} /> {displayDate(job.createdAt)}</span>
                        </div>

                        <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4 dark:border-white/[0.07]">
                          <div className="flex min-w-0 items-center gap-2">
                            <span className="truncate rounded-lg bg-slate-100 px-2.5 py-1.5 text-[10px] font-extrabold text-slate-600 dark:bg-white/[0.06] dark:text-slate-300">{job.experienceLevel}</span>
                            {job.hasApplied && <span className="flex items-center gap-1 text-[10px] font-black text-emerald-600 dark:text-emerald-400"><Check size={13} /> Applied</span>}
                          </div>
                          <button onClick={() => openJob(job)} className="flex shrink-0 items-center gap-1.5 text-xs font-black text-[#5a32fa] transition hover:gap-2.5 dark:text-violet-300">View role <ArrowRight size={14} /></button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <aside className="space-y-5 lg:sticky lg:top-24">
            <div className="overflow-hidden rounded-[1.75rem] bg-[#171126] p-5 text-white shadow-xl">
              <div className="relative">
                <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[#6d4aff]/40 blur-2xl" />
                <Sparkles size={21} className="text-pink-300" />
                <h3 className="mt-4 text-xl font-extrabold leading-tight">Hiring exceptional IP talent?</h3>
                <p className="mt-3 text-xs font-medium leading-5 text-violet-100/70">Put your opportunity in front of a focused, global community of IP professionals.</p>
                <Link href="/platform/jobs/post" className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-xs font-black text-[#2a174d] transition hover:bg-violet-50"><Plus size={16} /> Post a role</Link>
              </div>
            </div>

            <AdSlot slotId="jobs_sidebar" />

            {employerCounts.length > 0 && (
              <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-[#12151f]">
                <div className="flex items-center justify-between">
                  <div><p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">On the board</p><h3 className="mt-1 text-lg font-extrabold">Hiring now</h3></div>
                  <Building2 size={20} className="text-[#6d4aff]" />
                </div>
                <div className="mt-4 space-y-3">
                  {employerCounts.map((employer) => (
                    <button key={employer.company} onClick={() => { setQuery(employer.company); setTab('discover'); }} className="flex w-full items-center gap-3 rounded-2xl p-2 text-left transition hover:bg-slate-50 dark:hover:bg-white/[0.04]">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-black text-white" style={{ backgroundColor: employer.accent }}>{employer.company.charAt(0)}</span>
                      <span className="min-w-0 flex-1"><span className="block truncate text-xs font-extrabold">{employer.company}</span><span className="text-[10px] font-semibold text-slate-400">{employer.count} open {employer.count === 1 ? 'role' : 'roles'}</span></span>
                      <ArrowRight size={14} className="text-slate-300" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-start gap-3 rounded-2xl border border-emerald-200/70 bg-emerald-50/70 p-4 dark:border-emerald-500/15 dark:bg-emerald-500/[0.06]">
              <ShieldCheck size={19} className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <p className="text-[11px] font-semibold leading-5 text-emerald-900/70 dark:text-emerald-200/70"><strong className="font-black">A safer job search.</strong> WIPA listings are community-posted. Always verify the employer before sharing sensitive information.</p>
            </div>
          </aside>
        </div>
      </main>

      {selectedJob && (
        <div className="fixed inset-0 z-[70] flex justify-end">
          <button aria-label="Close job details" className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setSelectedJob(null)} />
          <aside className="relative flex h-full w-full max-w-2xl flex-col overflow-hidden bg-white shadow-2xl dark:bg-[#0f121b]">
            <div className="relative overflow-hidden bg-[#1d1234] px-5 pb-7 pt-5 text-white sm:px-8 sm:pt-7">
              <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full blur-3xl" style={{ backgroundColor: `${selectedJob.accent}55` }} />
              <div className="relative flex items-center justify-between">
                <button onClick={() => setSelectedJob(null)} className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs font-bold backdrop-blur hover:bg-white/15"><X size={16} /> Close</button>
                <button onClick={() => void toggleSave(selectedJob)} disabled={savingId === selectedJob.id} className="rounded-xl bg-white/10 p-2.5 hover:bg-white/15">{savingId === selectedJob.id ? <LoaderCircle size={18} className="animate-spin" /> : <Bookmark size={18} className={selectedJob.isSaved ? 'fill-current text-violet-200' : ''} />}</button>
              </div>
              <div className="relative mt-8 flex items-start gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-2xl font-black shadow-2xl" style={{ backgroundColor: selectedJob.accent }}>{selectedJob.company.charAt(0)}</div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-violet-200"><span>{selectedJob.company}</span>{selectedJob.isVerified && <BadgeCheck size={15} />}</div>
                  <h2 className="mt-1 text-2xl font-extrabold leading-tight sm:text-3xl">{selectedJob.title}</h2>
                </div>
              </div>
              <div className="relative mt-5 flex flex-wrap gap-2 text-[11px] font-bold text-violet-100/80">
                <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5"><MapPin size={13} /> {selectedJob.location}</span>
                <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5"><BriefcaseBusiness size={13} /> {selectedJob.type}</span>
                <span className="flex items-center gap-1.5 rounded-full bg-emerald-400/15 px-3 py-1.5 text-emerald-200"><CircleDollarSign size={13} /> {selectedJob.salary}</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-7 sm:px-8">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-slate-50 p-3 dark:bg-white/[0.045]"><p className="text-[9px] font-black uppercase tracking-wider text-slate-400">Experience</p><p className="mt-1 text-xs font-extrabold">{selectedJob.experienceLevel}</p></div>
                <div className="rounded-2xl bg-slate-50 p-3 dark:bg-white/[0.045]"><p className="text-[9px] font-black uppercase tracking-wider text-slate-400">Discipline</p><p className="mt-1 text-xs font-extrabold capitalize">{selectedJob.practiceArea}</p></div>
                <div className="col-span-2 rounded-2xl bg-slate-50 p-3 sm:col-span-1 dark:bg-white/[0.045]"><p className="text-[9px] font-black uppercase tracking-wider text-slate-400">Posted</p><p className="mt-1 text-xs font-extrabold">{displayDate(selectedJob.createdAt)}</p></div>
              </div>

              <section className="mt-8"><h3 className="flex items-center gap-2 text-lg font-extrabold"><FileText size={18} className="text-[#6d4aff]" /> About the role</h3><p className="mt-3 whitespace-pre-line text-sm font-medium leading-7 text-slate-600 dark:text-slate-300">{selectedJob.description}</p></section>

              {selectedJob.requirements.length > 0 && <section className="mt-8"><h3 className="text-lg font-extrabold">What you’ll bring</h3><ul className="mt-4 space-y-3">{selectedJob.requirements.map((requirement) => <li key={requirement} className="flex items-start gap-3 text-sm font-medium leading-6 text-slate-600 dark:text-slate-300"><span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-50 text-[#5a32fa] dark:bg-violet-500/10"><Check size={12} strokeWidth={3} /></span>{requirement}</li>)}</ul></section>}

              {selectedJob.benefits.length > 0 && <section className="mt-8"><h3 className="text-lg font-extrabold">Why you’ll love it</h3><div className="mt-4 grid gap-3 sm:grid-cols-2">{selectedJob.benefits.map((benefit) => <div key={benefit} className="flex items-start gap-2.5 rounded-2xl border border-slate-200 p-3 text-xs font-bold leading-5 text-slate-600 dark:border-white/10 dark:text-slate-300"><Sparkles size={15} className="mt-0.5 shrink-0 text-pink-500" />{benefit}</div>)}</div></section>}

              <section className="mt-9 rounded-[1.75rem] border border-violet-200 bg-[#f6f3ff] p-5 dark:border-violet-500/20 dark:bg-violet-500/[0.06] sm:p-6">
                <div className="flex items-start gap-3"><div className="rounded-xl bg-[#5a32fa] p-2 text-white"><Send size={17} /></div><div><h3 className="text-lg font-extrabold">Apply through WIPA</h3><p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">Your details go directly into the employer’s applicant list.</p></div></div>
                {selectedJob.hasApplied ? (
                  <div className="mt-5 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-white p-4 text-sm font-bold text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/[0.06] dark:text-emerald-300"><CheckCircle2 size={22} /> Application submitted</div>
                ) : (
                  <form onSubmit={applyToJob} className="mt-5 space-y-3">
                    <div className="grid gap-3 sm:grid-cols-2"><input required value={applicantName} onChange={(event) => setApplicantName(event.target.value)} placeholder="Full name" className={inputClass} /><input required type="email" value={applicantEmail} onChange={(event) => setApplicantEmail(event.target.value)} placeholder="Email address" className={inputClass} /></div>
                    <div className="grid gap-3 sm:grid-cols-2"><input value={applicantPhone} onChange={(event) => setApplicantPhone(event.target.value)} placeholder="Phone (optional)" className={inputClass} /><input type="url" value={applicantLinkedIn} onChange={(event) => setApplicantLinkedIn(event.target.value)} placeholder="LinkedIn URL (optional)" className={inputClass} /></div>
                    <textarea rows={3} value={applicantNote} onChange={(event) => setApplicantNote(event.target.value)} placeholder="A short note to the hiring team (optional)" className={`${inputClass} resize-none`} />
                    {applicationError && <p className="rounded-xl bg-rose-50 px-3 py-2 text-xs font-bold text-rose-600 dark:bg-rose-500/10 dark:text-rose-300">{applicationError}</p>}
                    <button disabled={isApplying} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#5a32fa] py-3.5 text-sm font-black text-white shadow-lg shadow-[#5a32fa]/20 transition hover:bg-[#4b24e8] disabled:opacity-60">{isApplying ? <LoaderCircle size={18} className="animate-spin" /> : <Send size={16} />} {isApplying ? 'Sending application…' : 'Submit application'}</button>
                  </form>
                )}
                {selectedJob.applicationUrl && <a href={selectedJob.applicationUrl} target="_blank" rel="noreferrer" className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-violet-200 bg-white py-3 text-xs font-black text-[#5a32fa] dark:border-white/10 dark:bg-white/[0.04]">Apply on employer website <ExternalLink size={14} /></a>}
              </section>
            </div>
          </aside>
        </div>
      )}

    </div>
  );
}
