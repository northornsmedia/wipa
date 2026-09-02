'use client';

import { useMemo, useState, type FormEvent, type ReactNode } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  Check,
  CheckCircle2,
  CircleDollarSign,
  FileCheck2,
  Globe2,
  Lightbulb,
  LoaderCircle,
  Mail,
  MapPin,
  Send,
  ShieldCheck,
  Sparkles,
  Target,
  UsersRound,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/store/useAppStore';

interface JobForm {
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  practiceArea: string;
  experienceLevel: string;
  description: string;
  applicationUrl: string;
  applicationEmail: string;
  requirements: string;
  benefits: string;
}

const EMPTY_FORM: JobForm = {
  title: '',
  company: '',
  location: '',
  type: 'Hybrid',
  salary: '',
  practiceArea: 'patent',
  experienceLevel: 'Mid-level (3–5 years)',
  description: '',
  applicationUrl: '',
  applicationEmail: '',
  requirements: '',
  benefits: '',
};

const inputClass = 'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition placeholder:font-medium placeholder:text-slate-400 focus:border-[#5a32fa] focus:ring-4 focus:ring-[#5a32fa]/10 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:placeholder:text-slate-500';

function FieldLabel({ children, optional = false }: { children: ReactNode; optional?: boolean }) {
  return (
    <label className="mb-2 block text-[11px] font-extrabold uppercase tracking-[0.13em] text-slate-500 dark:text-slate-400">
      {children}
      {optional && <span className="ml-1 font-semibold normal-case tracking-normal text-slate-400">(optional)</span>}
    </label>
  );
}

function FormSection({
  number,
  icon,
  title,
  description,
  children,
}: {
  number: string;
  icon: ReactNode;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="scroll-mt-28 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7 dark:border-white/10 dark:bg-[#111827]">
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#5a32fa]/10 text-[#5a32fa] dark:bg-violet-500/10 dark:text-violet-300">
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-[0.16em] text-[#5a32fa]">Step {number}</span>
          </div>
          <h2 className="mt-0.5 text-lg font-extrabold tracking-tight text-slate-950 dark:text-white">{title}</h2>
          <p className="mt-1 text-xs font-medium leading-5 text-slate-500 dark:text-slate-400">{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function splitLines(value: string) {
  return value.split('\n').map((line) => line.trim()).filter(Boolean);
}

function getErrorMessage(error: unknown) {
  if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') return error.message;
  return 'We could not publish this job. Please check your details and try again.';
}

export default function PostJobPage() {
  const { user } = useAppStore();
  const [form, setForm] = useState<JobForm>(EMPTY_FORM);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishError, setPublishError] = useState('');
  const [publishedJob, setPublishedJob] = useState<{ id: string; title: string; company: string } | null>(null);

  const update = (field: keyof JobForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    if (publishError) setPublishError('');
  };

  const completion = useMemo(() => {
    const essentials = [form.title, form.company, form.location, form.description];
    const details = [form.salary, form.requirements, form.benefits, form.applicationEmail || form.applicationUrl];
    const essentialScore = essentials.filter((value) => value.trim()).length * 18;
    const detailScore = details.filter((value) => value.trim()).length * 7;
    return Math.min(100, essentialScore + detailScore);
  }, [form]);

  const publishJob = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPublishError('');

    if (!user?.id) {
      setPublishError('Your session has expired. Please sign in again before publishing.');
      return;
    }

    setIsPublishing(true);
    const payload = {
      title: form.title.trim(),
      company: form.company.trim(),
      location: form.location.trim(),
      job_type: form.type,
      salary_range: form.salary.trim() || null,
      practice_area: form.practiceArea,
      experience_level: form.experienceLevel,
      description: form.description.trim(),
      application_url: form.applicationUrl.trim() || null,
      application_email: form.applicationEmail.trim() || user.email || null,
      requirements: splitLines(form.requirements),
      benefits: splitLines(form.benefits),
      posted_by: user.id,
      is_active: true,
      is_featured: false,
    };

    try {
      let result = await supabase.from('jobs').insert(payload).select('id,title,company').single();

      // Keep publishing functional while the additive category migration rolls
      // through environments that still infer the discipline from the title.
      if (result.error && /practice_area/i.test(result.error.message || '')) {
        const compatiblePayload = Object.fromEntries(
          Object.entries(payload).filter(([key]) => key !== 'practice_area'),
        );
        result = await supabase.from('jobs').insert(compatiblePayload).select('id,title,company').single();
      }

      if (result.error || !result.data) throw result.error || new Error('The database did not return the published job.');
      setPublishedJob({ id: result.data.id, title: result.data.title, company: result.data.company });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Unable to publish job:', error);
      setPublishError(getErrorMessage(error));
    } finally {
      setIsPublishing(false);
    }
  };

  if (publishedJob) {
    return (
      <div className="min-h-[calc(100vh-77px)] bg-[#f8f9fa] px-4 py-10 dark:bg-[#0f172a] sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-900/[0.05] dark:border-white/10 dark:bg-[#111827]">
          <div className="relative overflow-hidden bg-[#241541] px-6 py-12 text-center text-white sm:px-10">
            <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-[#6d4aff]/40 blur-3xl" />
            <div className="absolute -bottom-24 -right-16 h-64 w-64 rounded-full bg-pink-500/20 blur-3xl" />
            <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-400 text-slate-950 shadow-xl shadow-emerald-950/20"><Check size={30} strokeWidth={3} /></div>
            <p className="relative mt-6 text-xs font-black uppercase tracking-[0.2em] text-violet-200">Published successfully</p>
            <h1 className="relative mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">Your role is live.</h1>
            <p className="relative mx-auto mt-3 max-w-lg text-sm font-medium leading-6 text-violet-100/75">{publishedJob.title} at {publishedJob.company} is now visible to the WIPA community.</p>
          </div>
          <div className="p-6 sm:p-8">
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                ['Visible now', 'Members can discover the role immediately.'],
                ['Applications ready', 'Candidates can apply directly through WIPA.'],
                ['Securely linked', 'The listing is connected to your profile.'],
              ].map(([title, text]) => <div key={title} className="rounded-2xl bg-slate-50 p-4 dark:bg-white/[0.04]"><CheckCircle2 size={18} className="text-emerald-500" /><p className="mt-3 text-xs font-extrabold">{title}</p><p className="mt-1 text-[11px] font-medium leading-5 text-slate-500">{text}</p></div>)}
            </div>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link href="/platform/jobs" className="flex items-center justify-center gap-2 rounded-xl bg-[#5a32fa] px-6 py-3 text-sm font-extrabold text-white shadow-lg shadow-[#5a32fa]/15">View jobs board <ArrowRight size={16} /></Link>
              <button onClick={() => { setForm(EMPTY_FORM); setPublishedJob(null); }} className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-extrabold text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/[0.04]">Post another job</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-24 text-slate-950 dark:bg-[#0f172a] dark:text-white md:pb-12">
      <header className="border-b border-slate-200 bg-white dark:border-white/10 dark:bg-[#111827]">
        <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
          <Link href="/platform/jobs" className="inline-flex items-center gap-2 text-xs font-extrabold text-slate-500 transition hover:text-[#5a32fa] dark:text-slate-400"><ArrowLeft size={15} /> Back to jobs</Link>
          <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-[#5a32fa]"><Sparkles size={14} /> Employer workspace</div>
              <h1 className="mt-2 text-3xl font-extrabold tracking-[-0.035em] sm:text-4xl">Post a job opportunity</h1>
              <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-slate-500 dark:text-slate-400">Create a clear, compelling listing for the global WIPA community.</p>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-white/[0.04]">
              <div className="relative h-10 w-10"><svg className="h-10 w-10 -rotate-90" viewBox="0 0 40 40"><circle cx="20" cy="20" r="17" fill="none" stroke="currentColor" strokeWidth="3" className="text-slate-200 dark:text-white/10" /><circle cx="20" cy="20" r="17" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray={`${completion * 1.068} 106.8`} className="text-[#5a32fa] transition-all duration-500" /></svg><span className="absolute inset-0 flex items-center justify-center text-[9px] font-black">{completion}%</span></div>
              <div><p className="text-xs font-extrabold">Listing strength</p><p className="mt-0.5 text-[10px] font-semibold text-slate-400">Add detail to attract better fits</p></div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl items-start gap-7 px-4 py-7 sm:px-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:px-8">
        <form onSubmit={publishJob} className="space-y-5">
          <FormSection number="01" icon={<BriefcaseBusiness size={20} />} title="The opportunity" description="Start with the essentials candidates use to decide whether a role is relevant.">
            <div className="grid gap-5 sm:grid-cols-2">
              <div><FieldLabel>Role title</FieldLabel><input required minLength={3} value={form.title} onChange={(event) => update('title', event.target.value)} placeholder="Senior Patent Counsel" className={inputClass} /></div>
              <div><FieldLabel>Company or firm</FieldLabel><div className="relative"><Building2 size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" /><input required minLength={2} value={form.company} onChange={(event) => update('company', event.target.value)} placeholder="Organisation name" className={`${inputClass} pl-11`} /></div></div>
              <div><FieldLabel>Location</FieldLabel><div className="relative"><MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" /><input required value={form.location} onChange={(event) => update('location', event.target.value)} placeholder="London, UK / Remote" className={`${inputClass} pl-11`} /></div></div>
              <div><FieldLabel optional>Compensation</FieldLabel><div className="relative"><CircleDollarSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" /><input value={form.salary} onChange={(event) => update('salary', event.target.value)} placeholder="£90k–£120k + bonus" className={`${inputClass} pl-11`} /></div></div>
            </div>
          </FormSection>

          <FormSection number="02" icon={<Target size={20} />} title="Role profile" description="Help the right professionals recognise themselves in the opportunity.">
            <div className="grid gap-5 sm:grid-cols-3">
              <div><FieldLabel>Work style</FieldLabel><select value={form.type} onChange={(event) => update('type', event.target.value)} className={inputClass}><option>Remote</option><option>Hybrid</option><option>On-site</option><option>Flexible</option></select></div>
              <div><FieldLabel>Discipline</FieldLabel><select value={form.practiceArea} onChange={(event) => update('practiceArea', event.target.value)} className={inputClass}><option value="patent">Patents</option><option value="trademark">Trademarks</option><option value="litigation">Litigation</option><option value="legaltech">Legal tech</option><option value="licensing">Licensing</option></select></div>
              <div><FieldLabel>Experience</FieldLabel><select value={form.experienceLevel} onChange={(event) => update('experienceLevel', event.target.value)} className={inputClass}><option>Entry level (0–2 years)</option><option>Mid-level (3–5 years)</option><option>Senior (6–9 years)</option><option>Leadership (10+ years)</option><option>Experience open</option></select></div>
            </div>
            <div className="mt-5"><div className="flex items-end justify-between"><FieldLabel>Role overview</FieldLabel><span className={`mb-2 text-[10px] font-bold ${form.description.length >= 40 ? 'text-emerald-500' : 'text-slate-400'}`}>{form.description.length} / 40 minimum</span></div><textarea required minLength={40} rows={7} value={form.description} onChange={(event) => update('description', event.target.value)} placeholder="Describe the mandate, the team, and the impact this person will have…" className={`${inputClass} resize-y`} /></div>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div><FieldLabel optional>Requirements · one per line</FieldLabel><textarea rows={5} value={form.requirements} onChange={(event) => update('requirements', event.target.value)} placeholder={'Qualified patent attorney\n5+ years of prosecution experience\nExcellent drafting skills'} className={`${inputClass} resize-y`} /></div>
              <div><FieldLabel optional>Benefits · one per line</FieldLabel><textarea rows={5} value={form.benefits} onChange={(event) => update('benefits', event.target.value)} placeholder={'Flexible hybrid schedule\nAnnual learning budget\nPrivate healthcare'} className={`${inputClass} resize-y`} /></div>
            </div>
          </FormSection>

          <FormSection number="03" icon={<Send size={20} />} title="Application route" description="Applications are captured in WIPA. You may also add an employer email or careers URL.">
            <div className="grid gap-5 sm:grid-cols-2">
              <div><FieldLabel optional>Application email</FieldLabel><div className="relative"><Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" /><input type="email" value={form.applicationEmail} onChange={(event) => update('applicationEmail', event.target.value)} placeholder={user?.email || 'hiring@company.com'} className={`${inputClass} pl-11`} /></div></div>
              <div><FieldLabel optional>External application URL</FieldLabel><div className="relative"><Globe2 size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" /><input type="url" value={form.applicationUrl} onChange={(event) => update('applicationUrl', event.target.value)} placeholder="https://company.com/careers/role" className={`${inputClass} pl-11`} /></div></div>
            </div>
            <div className="mt-5 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-500/15 dark:bg-emerald-500/[0.06]"><ShieldCheck size={18} className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400" /><div><p className="text-xs font-extrabold text-emerald-900 dark:text-emerald-200">Secure WIPA applications are enabled</p><p className="mt-1 text-[11px] font-medium leading-5 text-emerald-800/70 dark:text-emerald-300/70">Candidate details are stored securely and linked only to this role and its owner.</p></div></div>
          </FormSection>

          {publishError && <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-bold text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300">{publishError}</div>}

          <div className="flex flex-col-reverse gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between dark:border-white/10 dark:bg-[#111827]">
            <Link href="/platform/jobs" className="px-4 py-3 text-center text-sm font-extrabold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">Cancel</Link>
            <button disabled={isPublishing} className="flex items-center justify-center gap-2 rounded-xl bg-[#5a32fa] px-7 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-[#5a32fa]/20 transition hover:bg-[#4b24e8] disabled:cursor-not-allowed disabled:opacity-60">{isPublishing ? <LoaderCircle size={18} className="animate-spin" /> : <Sparkles size={17} />} {isPublishing ? 'Publishing job…' : 'Publish job'}</button>
          </div>
        </form>

        <aside className="space-y-5 lg:sticky lg:top-24">
          <div className="overflow-hidden rounded-2xl bg-[#21143b] text-white shadow-xl shadow-violet-950/10">
            <div className="relative p-6">
              <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-[#6d4aff]/45 blur-3xl" />
              <div className="absolute -bottom-20 -left-12 h-40 w-40 rounded-full bg-pink-500/15 blur-3xl" />
              <div className="relative flex items-center justify-between"><span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-violet-200"><Sparkles size={13} /> Live preview</span><span className="rounded-full border border-white/10 bg-white/10 px-2.5 py-1 text-[9px] font-black">WIPA JOBS</span></div>
              <div className="relative mt-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#8a69ff] to-pink-500 text-xl font-black shadow-lg">{form.company.trim().charAt(0).toUpperCase() || 'W'}</div>
              <p className="relative mt-5 text-[10px] font-black uppercase tracking-[0.12em] text-violet-200">{form.company || 'Your organisation'}</p>
              <h3 className="relative mt-1.5 text-xl font-extrabold leading-tight">{form.title || 'Your opportunity title'}</h3>
              <div className="relative mt-4 flex flex-wrap gap-2 text-[10px] font-bold text-violet-100/80"><span className="rounded-full bg-white/10 px-2.5 py-1.5">{form.type}</span><span className="rounded-full bg-white/10 px-2.5 py-1.5">{form.location || 'Location'}</span><span className="rounded-full bg-white/10 px-2.5 py-1.5 capitalize">{form.practiceArea}</span></div>
              {form.salary && <p className="relative mt-4 flex items-center gap-2 text-xs font-extrabold text-emerald-300"><CircleDollarSign size={15} /> {form.salary}</p>}
              <p className="relative mt-5 line-clamp-5 text-xs font-medium leading-5 text-violet-100/65">{form.description || 'Add a concise, inspiring overview of the role and the impact this person will make.'}</p>
              <div className="relative mt-6 flex items-center justify-between border-t border-white/10 pt-4"><span className="flex items-center gap-1.5 text-[9px] font-bold text-violet-100/55"><BadgeCheck size={13} /> WIPA community role</span><span className="flex items-center gap-1 text-[10px] font-black text-white">View role <ArrowRight size={12} /></span></div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-[#111827]">
            <div className="flex items-center gap-2"><Lightbulb size={18} className="text-amber-500" /><h3 className="text-sm font-extrabold">A stronger listing</h3></div>
            <div className="mt-4 space-y-4">
              {[
                [FileCheck2, 'Be specific', 'Describe outcomes and responsibilities, not only credentials.'],
                [UsersRound, 'Welcome the right people', 'Use inclusive language and state which requirements are flexible.'],
                [CircleDollarSign, 'Share compensation', 'Transparent ranges help qualified candidates decide faster.'],
              ].map(([Icon, title, text]) => {
                const TipIcon = Icon as typeof FileCheck2;
                return <div key={String(title)} className="flex items-start gap-3"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-white/[0.05] dark:text-slate-300"><TipIcon size={15} /></span><div><p className="text-xs font-extrabold">{String(title)}</p><p className="mt-1 text-[10px] font-medium leading-4 text-slate-500">{String(text)}</p></div></div>;
              })}
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-2xl border border-violet-200 bg-violet-50 p-4 dark:border-violet-500/15 dark:bg-violet-500/[0.06]"><ShieldCheck size={18} className="mt-0.5 shrink-0 text-[#5a32fa] dark:text-violet-300" /><p className="text-[11px] font-medium leading-5 text-violet-900/70 dark:text-violet-200/70"><strong className="font-extrabold">Connected to your profile.</strong> You remain the owner of this listing and its incoming applications.</p></div>
        </aside>
      </main>
    </div>
  );
}
