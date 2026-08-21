'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, ListPlus } from 'lucide-react';
import { DotmCircular7 } from '@/components/ui/dotm-circular-7';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/store/useAppStore';

const initialForm = { providerName: '', serviceName: '', category: '', description: '', websiteUrl: '', contactEmail: '', proof: '' };

export default function ListIPServicePage() {
  const { user } = useAppStore();
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const update = (key: keyof typeof initialForm, value: string) => setForm((current) => ({ ...current, [key]: value }));

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!user?.id) { setError('Please sign in before submitting a service.'); return; }
    setSubmitting(true); setError('');
    const { error: submitError } = await supabase.from('service_listing_requests').insert({
      requester_id: user.id,
      provider_name: form.providerName.trim(),
      service_name: form.serviceName.trim(),
      category: form.category.trim(),
      description: form.description.trim(),
      website_url: form.websiteUrl.trim() || null,
      contact_email: form.contactEmail.trim(),
      proof_of_association: form.proof.trim(),
    });
    setSubmitting(false);
    if (submitError) { setError(submitError.message); return; }
    setSubmitted(true);
  };

  if (submitted) return <main className="flex min-h-[75vh] items-center justify-center bg-slate-50 px-4 dark:bg-[#020617]"><div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-xl dark:border-white/10 dark:bg-[#0f172a]"><CheckCircle2 size={60} className="mx-auto mb-5 text-emerald-500" /><h1 className="text-3xl font-black">Service submitted</h1><p className="mt-3 text-slate-500">Your listing is pending review. It will appear in IP Services only after approval.</p><Link href="/platform/resources/ip-services" className="mt-7 inline-flex rounded-xl bg-sky-600 px-6 py-3 font-bold text-white">Return to IP Services</Link></div></main>;

  return <main className="min-h-screen bg-slate-50 px-4 py-12 dark:bg-[#020617]"><div className="mx-auto max-w-2xl"><Link href="/platform/resources/ip-services" className="mb-7 inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-sky-600"><ArrowLeft size={17} /> Back to IP Services</Link><div className="mb-8 text-center"><div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-100 text-sky-600 dark:bg-sky-900/30"><ListPlus size={32} /></div><h1 className="text-3xl font-black sm:text-4xl">List Your IP Service</h1><p className="mx-auto mt-3 max-w-xl text-slate-500">Submit a specialist IP service, technology, or solution for review by the WIPA team.</p></div><form onSubmit={submit} className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl dark:border-white/10 dark:bg-[#0f172a] sm:p-9">{error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-bold text-red-600">{error}</div>}<div className="grid gap-5 sm:grid-cols-2"><Field label="Provider or company name" value={form.providerName} onChange={(v) => update('providerName', v)} /><Field label="Service name" value={form.serviceName} onChange={(v) => update('serviceName', v)} /><Field label="Service category" value={form.category} onChange={(v) => update('category', v)} placeholder="e.g. IP valuation" /><Field label="Contact email" type="email" value={form.contactEmail} onChange={(v) => update('contactEmail', v)} /><Field label="Website (optional)" type="url" required={false} value={form.websiteUrl} onChange={(v) => update('websiteUrl', v)} wrapper="sm:col-span-2" /></div><TextField label="Service description" value={form.description} onChange={(v) => update('description', v)} /><TextField label="Proof of association" value={form.proof} onChange={(v) => update('proof', v)} placeholder="Your role, LinkedIn profile, or other verification details" /><button disabled={submitting} className="flex w-full items-center justify-center gap-2 rounded-xl bg-sky-600 py-4 text-lg font-black text-white transition hover:bg-sky-700 disabled:opacity-60">{submitting ? <DotmCircular7 size={24} /> : <><ListPlus size={20} /> Submit for Review</>}</button></form></div></main>;
}

function Field({ label, value, onChange, placeholder, type = 'text', required = true, wrapper = '' }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; type?: string; required?: boolean; wrapper?: string }) { return <label className={wrapper}><span className="mb-2 block text-sm font-bold">{label}</span><input required={required} type={type} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:ring-2 focus:ring-sky-500/40 dark:border-slate-800 dark:bg-slate-900" /></label>; }
function TextField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string }) { return <label><span className="mb-2 block text-sm font-bold">{label}</span><textarea required rows={4} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:ring-2 focus:ring-sky-500/40 dark:border-slate-800 dark:bg-slate-900" /></label>; }
