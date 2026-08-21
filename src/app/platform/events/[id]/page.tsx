'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft, CalendarDays, Check, Clock3, ExternalLink, Globe2,
  MapPin, MonitorPlay, Ticket, UserRound, UsersRound,
} from 'lucide-react';
import { DotmCircular7 } from '@/components/ui/dotm-circular-7';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/store/useAppStore';

type Organizer = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string | null;
};

type EventRecord = {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  end_date: string | null;
  location: string | null;
  is_virtual: boolean | null;
  cover_image_url: string | null;
  organizer_id: string | null;
  max_attendees: number | null;
  organizer: Organizer | Organizer[] | null;
};

type Sponsor = {
  id: string;
  sponsor_name: string;
  sponsor_logo_url: string | null;
  sponsor_website_url: string | null;
  sponsor_tagline: string | null;
};

const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
});
const timeFormatter = new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit', minute: '2-digit', timeZoneName: 'short',
});

function safeDate(value: string | null) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function EmptyValue() {
  return <span className="text-slate-400">No data available</span>;
}

export default function EventDetailsPage() {
  const params = useParams<{ id: string }>();
  const eventId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const { user } = useAppStore();
  const [event, setEvent] = useState<EventRecord | null>(null);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [registrationCount, setRegistrationCount] = useState<number | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadEvent = useCallback(async () => {
    if (!eventId) {
      setError('Event unavailable');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    const { data, error: eventError } = await supabase
      .from('events')
      .select('*, organizer:profiles(id, full_name, avatar_url, role)')
      .eq('id', eventId)
      .maybeSingle();

    if (eventError || !data) {
      console.error('Unable to load event', eventError);
      setEvent(null);
      setError('Event unavailable');
      setLoading(false);
      return;
    }

    const [{ count }, sponsorResult, registrationResult] = await Promise.all([
      supabase.from('event_registrations').select('*', { count: 'exact', head: true }).eq('event_id', eventId),
      supabase.from('event_sponsorships').select('id, sponsor_name, sponsor_logo_url, sponsor_website_url, sponsor_tagline').eq('event_id', eventId).in('status', ['approved', 'paid']),
      user?.id
        ? supabase.from('event_registrations').select('event_id').eq('event_id', eventId).eq('user_id', user.id).maybeSingle()
        : Promise.resolve({ data: null, error: null }),
    ]);

    setEvent(data as EventRecord);
    setRegistrationCount(count ?? null);
    setSponsors((sponsorResult.data as Sponsor[] | null) ?? []);
    setIsRegistered(Boolean(registrationResult.data));
    setLoading(false);
  }, [eventId, user?.id]);

  useEffect(() => { void loadEvent(); }, [loadEvent]);

  const start = useMemo(() => safeDate(event?.event_date ?? null), [event?.event_date]);
  const end = useMemo(() => safeDate(event?.end_date ?? null), [event?.end_date]);
  const organizer = useMemo(() => {
    if (!event?.organizer) return null;
    return Array.isArray(event.organizer) ? event.organizer[0] ?? null : event.organizer;
  }, [event?.organizer]);

  const toggleRegistration = async () => {
    if (!event || !user?.id || saving) return;
    setSaving(true);
    const request = isRegistered
      ? supabase.from('event_registrations').delete().match({ event_id: event.id, user_id: user.id })
      : supabase.from('event_registrations').insert({ event_id: event.id, user_id: user.id });
    const { error: saveError } = await request;
    if (!saveError) {
      setIsRegistered((value) => !value);
      setRegistrationCount((value) => value === null ? null : Math.max(0, value + (isRegistered ? -1 : 1)));
    }
    setSaving(false);
  };

  if (loading) {
    return <div className="flex min-h-[70vh] items-center justify-center bg-slate-50 dark:bg-[#080b13]"><DotmCircular7 size={54} className="text-[#6600ff]" /></div>;
  }

  if (error || !event) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-5 dark:bg-[#080b13]">
        <div className="max-w-md rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm dark:border-white/10 dark:bg-[#111725]">
          <CalendarDays className="mx-auto mb-4 text-slate-300" size={48} />
          <h1 className="text-2xl font-black text-slate-950 dark:text-white">Event unavailable</h1>
          <p className="mt-2 text-slate-500">No data available for this event.</p>
          <Link href="/platform/events" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#6600ff] px-5 py-3 font-bold text-white"><ArrowLeft size={17} /> Back to events</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f5f8] pb-20 dark:bg-[#080b13]">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <Link href="/platform/events" className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-slate-600 transition hover:text-[#6600ff] dark:text-slate-300"><ArrowLeft size={18} /> All events</Link>

        <section className="overflow-hidden rounded-[2rem] bg-[#111425] text-white shadow-xl shadow-indigo-950/10">
          {event.cover_image_url ? (
            <div className="relative flex min-h-64 items-center justify-center bg-white sm:min-h-80">
              <Image src={event.cover_image_url} alt={event.title} fill priority sizes="(max-width: 768px) 100vw, 1152px" className="object-contain" />
            </div>
          ) : null}
          <div className="relative overflow-hidden p-6 sm:p-10 lg:p-12">
            <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[#6600ff]/40 blur-3xl" />
            <div className="relative max-w-4xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-black uppercase tracking-[0.16em]">
                {event.is_virtual ? <MonitorPlay size={14} /> : <MapPin size={14} />}
                {event.is_virtual === null ? 'No data available' : event.is_virtual ? 'Virtual event' : 'In-person event'}
              </span>
              <h1 className="mt-5 text-3xl font-black leading-tight sm:text-5xl lg:text-6xl">{event.title}</h1>
              <p className="mt-5 max-w-3xl whitespace-pre-wrap text-base leading-7 text-slate-300 sm:text-lg">{event.description || 'No data available'}</p>
            </div>
          </div>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="space-y-6">
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#111725] sm:p-8">
              <h2 className="text-xl font-black text-slate-950 dark:text-white">Event details</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Detail icon={<CalendarDays size={20} />} label="Date" value={start ? dateFormatter.format(start) : null} />
                <Detail icon={<Clock3 size={20} />} label="Time" value={start ? `${timeFormatter.format(start)}${end ? ` – ${timeFormatter.format(end)}` : ''}` : null} />
                <Detail icon={event.is_virtual ? <Globe2 size={20} /> : <MapPin size={20} />} label="Location" value={event.location} />
                <Detail icon={<UsersRound size={20} />} label="Registered" value={registrationCount === null ? null : `${registrationCount}${event.max_attendees ? ` of ${event.max_attendees}` : ''}`} />
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#111725] sm:p-8">
              <h2 className="text-xl font-black text-slate-950 dark:text-white">About this event</h2>
              <p className="mt-4 whitespace-pre-wrap leading-7 text-slate-600 dark:text-slate-300">{event.description || 'No data available'}</p>
            </section>

            {sponsors.length > 0 && (
              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#111725] sm:p-8">
                <h2 className="text-xl font-black text-slate-950 dark:text-white">Event sponsors</h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {sponsors.map((sponsor) => {
                    const content = <><div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-white/10">{sponsor.sponsor_logo_url ? <Image src={sponsor.sponsor_logo_url} alt="" fill sizes="48px" className="object-contain" /> : <span className="flex h-full items-center justify-center font-black text-slate-500">{sponsor.sponsor_name.charAt(0)}</span>}</div><div><p className="font-bold text-slate-900 dark:text-white">{sponsor.sponsor_name}</p><p className="line-clamp-2 text-sm text-slate-500">{sponsor.sponsor_tagline || 'No data available'}</p></div>{sponsor.sponsor_website_url && <ExternalLink className="ml-auto text-slate-400" size={16} />}</>;
                    return sponsor.sponsor_website_url ? <a key={sponsor.id} href={sponsor.sponsor_website_url} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-2xl border border-slate-200 p-4 transition hover:border-[#6600ff] dark:border-white/10">{content}</a> : <div key={sponsor.id} className="flex items-center gap-3 rounded-2xl border border-slate-200 p-4 dark:border-white/10">{content}</div>;
                  })}
                </div>
              </section>
            )}
          </div>

          <aside className="space-y-6">
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#111725]">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-500"><Ticket size={18} className="text-[#6600ff]" /> Registration</div>
              {user?.id ? (
                <button onClick={toggleRegistration} disabled={saving} className={`mt-5 flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3.5 font-black text-white transition disabled:opacity-60 ${isRegistered ? 'bg-emerald-600' : 'bg-[#6600ff] hover:bg-[#5700d9]'}`}>
                  {isRegistered && <Check size={18} />}{saving ? 'Updating…' : isRegistered ? 'Registered' : 'Register now'}
                </button>
              ) : <p className="mt-4 text-sm text-slate-500">Sign in to register for this event.</p>}
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#111725]">
              <h2 className="text-sm font-black uppercase tracking-wider text-slate-500">Organizer</h2>
              {organizer ? <div className="mt-5 flex items-center gap-3"><div className="relative h-12 w-12 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">{organizer.avatar_url ? <Image src={organizer.avatar_url} alt="" fill sizes="48px" className="object-cover" /> : <UserRound className="m-3 text-slate-400" />}</div><div><p className="font-black text-slate-950 dark:text-white">{organizer.full_name || 'No data available'}</p><p className="text-sm text-slate-500">{organizer.role || 'No data available'}</p></div></div> : <p className="mt-4 text-slate-400">No data available</p>}
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}

function Detail({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | null }) {
  return <div className="flex gap-3 rounded-2xl bg-slate-50 p-4 dark:bg-white/5"><div className="mt-0.5 text-[#6600ff]">{icon}</div><div><p className="text-xs font-black uppercase tracking-wider text-slate-400">{label}</p><p className="mt-1 font-bold text-slate-800 dark:text-slate-100">{value || <EmptyValue />}</p></div></div>;
}
