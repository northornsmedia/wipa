'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Calendar,
  CalendarDays,
  Check,
  Clock3,
  ExternalLink,
  Globe,
  Globe2,
  MapPin,
  MonitorPlay,
  Share2,
  Ticket,
  UserRound,
  UsersRound,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Building,
  Navigation,
  Copy,
  Mail,
  ArrowRight,
  Handshake,
  Award,
  ChevronDown,
  DollarSign
} from 'lucide-react';
import { DotmCircular7 } from '@/components/ui/dotm-circular-7';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/store/useAppStore';

type Organizer = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string | null;
  headline?: string | null;
  is_wipa_recommended?: boolean | null;
  is_verified?: boolean | null;
};

type EventRecord = {
  id: string;
  slug?: string | null;
  title: string;
  description: string | null;
  event_date: string;
  end_date: string | null;
  location: string | null;
  is_virtual: boolean | null;
  cover_image_url: string | null;
  organizer_id: string | null;
  organizer_name?: string | null;
  organizer_logo_url?: string | null;
  organizer_role?: string | null;
  category?: string | null;
  timezone?: string | null;
  meeting_url?: string | null;
  registration_url?: string | null;
  price?: string | number | null;
  currency?: string | null;
  current_attendees?: number | null;
  max_attendees: number | null;
  is_featured?: boolean | null;
  organizer?: Organizer | Organizer[] | null;
};

type Sponsor = {
  id: string;
  sponsor_name: string;
  sponsor_logo_url: string | null;
  sponsor_website_url: string | null;
  sponsor_tagline: string | null;
};

const CURRENCIES = [
  { code: 'USD', symbol: '$', rate: 1.0, label: 'USD ($)' },
  { code: 'EUR', symbol: '€', rate: 0.92, label: 'EUR (€)' },
  { code: 'GBP', symbol: '£', rate: 0.79, label: 'GBP (£)' },
  { code: 'CHF', symbol: 'CHF ', rate: 0.88, label: 'CHF (CHF)' },
  { code: 'SGD', symbol: 'S$', rate: 1.34, label: 'SGD (S$)' },
  { code: 'AED', symbol: 'AED ', rate: 3.67, label: 'AED (AED)' }
] as const;

type CurrencyCode = typeof CURRENCIES[number]['code'];

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

const timeFormatter = new Intl.DateTimeFormat('en-US', {
  hour: '2-digit',
  minute: '2-digit',
});

function safeDate(value: string | null | undefined) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

// Convert plaintext URLs to clickable anchors
function renderFormattedDescription(text: string | null) {
  if (!text) return <p className="text-gray-500 italic">No description provided.</p>;

  // Regex to match URLs
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const paragraphs = text.split('\n\n');

  return (
    <div className="space-y-4 text-base md:text-lg leading-relaxed text-gray-700 dark:text-gray-300 font-normal">
      {paragraphs.map((para, pIdx) => {
        const parts = para.split(urlRegex);
        return (
          <p key={pIdx}>
            {parts.map((part, i) => {
              if (part.match(urlRegex)) {
                return (
                  <a
                    key={i}
                    href={part}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#5a32fa] dark:text-[#a78bfa] font-bold underline inline-flex items-center gap-1 hover:text-[#4a24db] break-all"
                  >
                    {part}
                    <ExternalLink size={13} className="inline shrink-0" />
                  </a>
                );
              }
              return part;
            })}
          </p>
        );
      })}
    </div>
  );
}

export default function EventDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const eventParam = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const { user } = useAppStore();

  const [event, setEvent] = useState<EventRecord | null>(null);
  const [organizer, setOrganizer] = useState<Organizer | null>(null);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [otherEvents, setOtherEvents] = useState<any[]>([]);
  const [registrationCount, setRegistrationCount] = useState<number>(0);
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>('USD');
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);

  const loadEvent = useCallback(async () => {
    if (!eventParam) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(eventParam);

      let query = supabase.from('events').select('*');
      if (isUuid) {
        query = query.eq('id', eventParam);
      } else {
        query = query.or(`slug.eq.${eventParam},id.eq.${eventParam}`);
      }

      const { data: eventData, error: eventError } = await query.maybeSingle();

      if (eventError || !eventData) {
        // Fallback: search by slug or ID
        const { data: fallbackData } = await supabase
          .from('events')
          .select('*')
          .ilike('slug', `%${eventParam}%`)
          .maybeSingle();

        if (fallbackData) {
          setupEventData(fallbackData);
        } else {
          setEvent(null);
        }
      } else {
        setupEventData(eventData);
      }
    } catch (err) {
      console.error('Error loading event:', err);
      setEvent(null);
    } finally {
      setLoading(false);
    }
  }, [eventParam, user?.id]);

  const setupEventData = async (data: any) => {
    const isInta = data.slug === 'inta-annual-meeting-2027' || data.id === '36810299-1062-48c6-9691-da1e6d311b17';

    // Enhance record with specific overrides if it's the INTA event
    const enhancedData: EventRecord = {
      ...data,
      organizer_name: isInta ? (data.organizer_name || 'International Trademark Association') : data.organizer_name,
      organizer_logo_url: isInta ? (data.organizer_logo_url || '/inta-logo.png') : data.organizer_logo_url,
      organizer_role: isInta ? (data.organizer_role || 'Global Association of Brand Owners & IP Professionals') : data.organizer_role,
      price: isInta ? (data.price && Number(data.price) > 0 ? data.price : 1800) : data.price,
      registration_url: isInta ? (data.registration_url || 'https://www.inta.org/meetings/2027-annual-meeting/registration/') : data.registration_url,
      meeting_url: isInta ? (data.meeting_url || 'https://www.inta.org/meetings/2027-annual-meeting/registration/') : data.meeting_url,
    };

    setEvent(enhancedData);

    // Fetch Registrations Count & User Registration Status
    const [{ count }, sponsorResult, registrationResult, otherEventsResult] = await Promise.all([
      supabase.from('event_registrations').select('*', { count: 'exact', head: true }).eq('event_id', data.id),
      supabase.from('event_sponsorships').select('id, sponsor_name, sponsor_logo_url, sponsor_website_url, sponsor_tagline').eq('event_id', data.id).in('status', ['approved', 'paid']),
      user?.id
        ? supabase.from('event_registrations').select('event_id').eq('event_id', data.id).eq('user_id', user.id).maybeSingle()
        : Promise.resolve({ data: null, error: null }),
      supabase.from('events').select('id, title, event_date, is_virtual, location, cover_image_url').neq('id', data.id).order('event_date', { ascending: true }).limit(3)
    ]);

    const baseCount = Number(data.current_attendees) || 0;
    const dbCount = count || 0;
    setRegistrationCount(Math.max(baseCount, dbCount));
    setSponsors((sponsorResult.data as Sponsor[] | null) ?? []);
    setIsRegistered(Boolean(registrationResult.data));
    setOtherEvents(otherEventsResult.data || []);

    // Set Organizer
    if (isInta || enhancedData.organizer_name) {
      setOrganizer({
        id: 'inta-org',
        full_name: enhancedData.organizer_name || 'International Trademark Association',
        avatar_url: enhancedData.organizer_logo_url || '/inta-logo.png',
        role: enhancedData.organizer_role || 'Global Association of Brand Owners & IP Professionals',
        is_wipa_recommended: true,
        is_verified: true
      });
    } else if (data.organizer_id) {
      const { data: prof } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, role, headline, is_wipa_recommended')
        .eq('id', data.organizer_id)
        .maybeSingle();

      if (prof) {
        setOrganizer(prof);
      } else {
        setOrganizer({
          id: 'wipa-global',
          full_name: 'WIPA Global Community',
          avatar_url: '/wipaoffm.png',
          role: "Official Women's IP Alliance Organization",
          is_wipa_recommended: true
        });
      }
    } else {
      setOrganizer({
        id: 'wipa-global',
        full_name: 'WIPA Global Community',
        avatar_url: '/wipaoffm.png',
        role: "Official Women's IP Alliance Organization",
        is_wipa_recommended: true
      });
    }
  };

  useEffect(() => {
    void loadEvent();
  }, [loadEvent]);

  const start = useMemo(() => safeDate(event?.event_date ?? null), [event?.event_date]);
  const end = useMemo(() => safeDate(event?.end_date ?? null), [event?.end_date]);

  const toggleRegistration = async () => {
    if (!event) return;

    const externalUrl = event.registration_url || event.meeting_url;
    const isInta = event.slug === 'inta-annual-meeting-2027' || event.id === '36810299-1062-48c6-9691-da1e6d311b17';

    // If there is an external registration redirect URL (e.g. INTA official registration)
    if (isInta || (externalUrl && externalUrl.startsWith('http') && !externalUrl.includes('meetn.com'))) {
      if (user?.id) {
        // Register locally in background if not already
        if (!isRegistered) {
          await supabase.from('event_registrations').insert({ event_id: event.id, user_id: user.id });
          setIsRegistered(true);
          setRegistrationCount((c) => c + 1);
        }
      }
      // Redirect to official registration page
      window.open(externalUrl || 'https://www.inta.org/meetings/2027-annual-meeting/registration/', '_blank');
      return;
    }

    if (!user?.id) {
      router.push('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }
    if (saving) return;

    setSaving(true);
    try {
      if (isRegistered) {
        await supabase.from('event_registrations').delete().match({ event_id: event.id, user_id: user.id });
        setIsRegistered(false);
        setRegistrationCount((c) => Math.max(0, c - 1));
      } else {
        await supabase.from('event_registrations').insert({ event_id: event.id, user_id: user.id });
        setIsRegistered(true);
        setRegistrationCount((c) => c + 1);
      }
    } catch (err) {
      console.error('Registration toggle error:', err);
    }
    setSaving(false);
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleAddToCalendar = (type: 'google' | 'outlook' | 'ics') => {
    if (!event || !start) return;

    const title = event.title;
    const desc = event.description || "WIPA Global IP Event";
    const loc = event.location || (event.is_virtual ? "Virtual (Online)" : "Global Venue");
    
    const startTimeStr = start.toISOString().replace(/-|:|\.\d\d\d/g, "");
    const endTimeStr = end ? end.toISOString().replace(/-|:|\.\d\d\d/g, "") : startTimeStr;

    if (type === 'google') {
      const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&details=${encodeURIComponent(desc)}&location=${encodeURIComponent(loc)}&dates=${startTimeStr}/${endTimeStr}`;
      window.open(gcalUrl, '_blank');
    } else if (type === 'outlook') {
      const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(desc)}&location=${encodeURIComponent(loc)}&startdt=${start.toISOString()}&enddt=${(end || start).toISOString()}`;
      window.open(outlookUrl, '_blank');
    } else {
      // Direct iCal download
      const icsData = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "BEGIN:VEVENT",
        `SUMMARY:${title}`,
        `DESCRIPTION:${desc.replace(/\n/g, '\\n')}`,
        `LOCATION:${loc}`,
        `DTSTART:${startTimeStr}`,
        `DTEND:${endTimeStr}`,
        "END:VEVENT",
        "END:VCALENDAR"
      ].join("\r\n");

      const blob = new Blob([icsData], { type: "text/calendar;charset=utf-8" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute("download", `${event.slug || "wipa-event"}.ics`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Calculate formatted price based on active currency
  const isFree = !event?.price || String(event.price) === '0';
  const basePriceNum = Number(event?.price) || 0;

  const currentCurrencyObj = CURRENCIES.find(c => c.code === selectedCurrency) || CURRENCIES[0];
  const convertedPrice = Math.round(basePriceNum * currentCurrencyObj.rate);
  const formattedConvertedPrice = convertedPrice.toLocaleString();

  const priceDisplay = isFree 
    ? 'Free for Members' 
    : `${currentCurrencyObj.symbol}${formattedConvertedPrice} ${currentCurrencyObj.code}`;

  if (loading) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center bg-slate-50 dark:bg-[#080b13] gap-4">
        <DotmCircular7 size={54} className="text-[#5a32fa]" />
        <p className="text-sm font-bold text-gray-500 dark:text-gray-400 animate-pulse">Loading Event Details...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <main className="flex min-h-[80vh] items-center justify-center bg-slate-50 px-5 dark:bg-[#080b13]">
        <div className="max-w-md rounded-[2.5rem] border border-slate-200 bg-white p-10 text-center shadow-xl dark:border-white/10 dark:bg-[#111725]">
          <div className="w-16 h-16 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-[#5a32fa] mx-auto mb-4">
            <CalendarDays size={32} />
          </div>
          <h1 className="text-2xl font-black text-slate-950 dark:text-white">Event Not Found</h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400 text-sm">
            The event you are looking for may have concluded or is no longer available.
          </p>
          <Link
            href="/platform/events"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#5a32fa] hover:bg-[#4a24db] px-6 py-3.5 font-black text-white transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-purple-600/30"
          >
            <ArrowLeft size={18} /> Back to All Events
          </Link>
        </div>
      </main>
    );
  }

  const isVirtual = Boolean(event.is_virtual);
  const eventCategory = event.category || 'Summit';
  const hasPhysicalLocation = Boolean(event.location && event.location.trim().length > 0 && !isVirtual);
  const isIntaEvent = event.slug === 'inta-annual-meeting-2027' || event.id === '36810299-1062-48c6-9691-da1e6d311b17';

  return (
    <main className="min-h-screen bg-[#f8f9fc] pb-24 dark:bg-[#080b13] transition-colors">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/platform/events"
            className="inline-flex items-center gap-2 rounded-xl bg-white dark:bg-[#121624] px-4 py-2 text-xs font-black text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/10 shadow-sm transition hover:border-[#5a32fa] hover:text-[#5a32fa]"
          >
            <ArrowLeft size={16} /> Back to Events
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 rounded-xl bg-white dark:bg-[#121624] px-4 py-2 text-xs font-bold text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/10 shadow-sm transition hover:border-purple-500"
            >
              {copiedLink ? <Check size={14} className="text-emerald-500" /> : <Share2 size={14} />}
              {copiedLink ? 'Link Copied!' : 'Share Event'}
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* HERO BANNER SECTION (LIGHT / DARK ALIGNED) */}
        {/* ========================================================================= */}
        <section className="relative overflow-hidden rounded-[2.5rem] bg-white dark:bg-[#0c1020] text-slate-900 dark:text-white shadow-xl dark:shadow-2xl border border-slate-200 dark:border-white/10 mb-8 transition-colors">
          {/* Glowing Ambient Lights */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-purple-500/10 dark:from-purple-600/30 via-indigo-500/5 dark:via-indigo-600/20 to-transparent blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-sky-500/10 dark:from-sky-600/20 to-transparent blur-[100px] rounded-full pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-10 lg:p-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-6">
              
              {/* Badges Bar */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-200 dark:border-purple-500/40 bg-purple-50 dark:bg-purple-500/20 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-purple-700 dark:text-purple-300 shadow-sm">
                  <Sparkles size={13} className="text-purple-600 dark:text-purple-400" /> {eventCategory}
                </span>

                <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 dark:border-white/15 bg-slate-100 dark:bg-white/10 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-200 shadow-sm">
                  {isVirtual ? <MonitorPlay size={13} className="text-sky-500 dark:text-sky-400" /> : <MapPin size={13} className="text-rose-500 dark:text-rose-400" />}
                  {isVirtual ? 'Virtual Online Event' : 'In-Person Global Summit'}
                </span>

                {event.is_featured && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-500/30 px-3 py-1 text-xs font-black uppercase shadow-sm">
                    ⭐ Featured Summit
                  </span>
                )}
              </div>

              {/* Event Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-[1.15] tracking-tight text-slate-900 dark:text-white">
                {event.title}
              </h1>

              {/* Organizer Byline (International Trademark Association for INTA) */}
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl border-2 border-slate-200 dark:border-white/20 overflow-hidden bg-white dark:bg-slate-800 shrink-0 p-1 flex items-center justify-center shadow-sm">
                  {organizer?.avatar_url ? (
                    <img 
                      src={organizer.avatar_url} 
                      alt={organizer.full_name || "Organizer"} 
                      className="max-h-full max-w-full object-contain" 
                    />
                  ) : (
                    <Building size={20} className="text-[#5a32fa] dark:text-purple-400" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                    By {organizer?.full_name || (isIntaEvent ? 'International Trademark Association' : 'WIPA Global Community')}
                    <span className="text-[10px] bg-amber-100 dark:bg-amber-400/20 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-400/30 px-2 py-0.5 rounded-full font-black">
                      {isIntaEvent ? '⭐ INTA Official' : '⭐ WIPA Verified'}
                    </span>
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {organizer?.role || (isIntaEvent ? 'Global Association of Brand Owners & IP Professionals' : "Women's IP Alliance Leader")}
                  </p>
                </div>
              </div>

              {/* Quick Details Chips */}
              <div className="flex flex-wrap items-center gap-y-3 gap-x-6 pt-3 border-t border-slate-100 dark:border-white/10 text-sm font-bold text-slate-700 dark:text-slate-200">
                <div className="flex items-center gap-2">
                  <CalendarDays size={16} className="text-[#5a32fa] dark:text-[#a78bfa]" />
                  <span>{start ? dateFormatter.format(start) : 'Date to be announced'}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock3 size={16} className="text-[#5a32fa] dark:text-[#a78bfa]" />
                  <span>
                    {start ? timeFormatter.format(start) : '08:00 AM'}
                    {end ? ` – ${timeFormatter.format(end)}` : ''}
                    {event.timezone ? ` (${event.timezone})` : ''}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-[#5a32fa] dark:text-[#a78bfa]" />
                  <span className="line-clamp-1">{event.location || (isVirtual ? 'Virtual (Online)' : 'Global Venue')}</span>
                </div>
              </div>

              {/* Action Buttons Bar */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <button
                  onClick={toggleRegistration}
                  disabled={saving}
                  className={`px-8 py-4 rounded-2xl font-black text-sm transition-all flex items-center gap-2.5 shadow-xl hover:scale-105 active:scale-95 disabled:opacity-50 ${
                    isRegistered
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
                      : 'bg-[#5a32fa] hover:bg-[#4a24db] text-white shadow-purple-600/40 ring-2 ring-purple-400/30'
                  }`}
                >
                  {isRegistered ? <CheckCircle2 size={18} /> : <Ticket size={18} />}
                  {saving ? 'Processing...' : isIntaEvent ? 'Register on Official INTA Site ↗' : isRegistered ? '✓ You Are Registered' : 'RSVP / Register Now'}
                </button>

                {event.meeting_url && isRegistered && !isIntaEvent && (
                  <a
                    href={event.meeting_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-4 rounded-2xl font-black text-sm bg-sky-600 hover:bg-sky-500 text-white transition-all flex items-center gap-2 shadow-lg shadow-sky-600/30"
                  >
                    <MonitorPlay size={18} /> Join Live Session
                  </a>
                )}

                {/* Calendar Dropdown */}
                <div className="flex items-center gap-2 bg-slate-100 dark:bg-white/10 rounded-2xl p-1 border border-slate-200 dark:border-white/15">
                  <button
                    onClick={() => handleAddToCalendar('google')}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold hover:bg-white dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 transition-all flex items-center gap-1.5 shadow-sm"
                    title="Add to Google Calendar"
                  >
                    <Calendar size={13} className="text-[#5a32fa] dark:text-purple-400" /> Google Cal
                  </button>
                  <button
                    onClick={() => handleAddToCalendar('ics')}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold hover:bg-white dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 transition-all flex items-center gap-1.5 shadow-sm"
                    title="Download Apple iCal (.ics)"
                  >
                    <CalendarDays size={13} className="text-[#5a32fa] dark:text-purple-400" /> Apple / iCal
                  </button>
                </div>
              </div>

            </div>

            {/* Right Ticket Preview Card with Dynamic Currency Switcher */}
            <div className="lg:col-span-5 xl:col-span-4">
              <div className="rounded-3xl border border-slate-200 dark:border-white/15 bg-slate-50/80 dark:bg-white/5 backdrop-blur-xl p-6 shadow-xl space-y-5">
                
                {/* Event Cover Image */}
                {event.cover_image_url ? (
                  <div className="w-full h-52 rounded-2xl overflow-hidden bg-slate-200 dark:bg-black/40 border border-slate-200 dark:border-white/10 relative shadow-inner">
                    <img
                      src={event.cover_image_url}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Price Tag with Currency Switcher Badge */}
                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full text-[11px] font-black text-white border border-white/20 shadow-md">
                      <span>{priceDisplay}</span>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-44 rounded-2xl bg-gradient-to-br from-purple-100 to-indigo-50 dark:from-purple-900/40 dark:to-slate-900 border border-purple-200 dark:border-white/10 flex flex-col items-center justify-center text-[#5a32fa] dark:text-purple-300">
                    <CalendarDays size={48} className="mb-2 opacity-80" />
                    <span className="text-xs font-black uppercase tracking-widest">{eventCategory}</span>
                  </div>
                )}

                {/* Currency Switcher Control Pill */}
                {!isFree && (
                  <div className="p-3 rounded-2xl bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 flex items-center justify-between shadow-sm">
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                      <DollarSign size={14} className="text-[#5a32fa]" /> Currency:
                    </span>

                    <div className="flex items-center gap-1">
                      {CURRENCIES.map((c) => (
                        <button
                          key={c.code}
                          type="button"
                          onClick={() => setSelectedCurrency(c.code)}
                          className={`px-2 py-1 rounded-lg text-[10px] font-black transition-all ${
                            selectedCurrency === c.code
                              ? 'bg-[#5a32fa] text-white shadow-sm scale-105'
                              : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/20'
                          }`}
                        >
                          {c.code}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Attendee Statistics Box */}
                <div className="p-4 rounded-2xl bg-white dark:bg-black/30 border border-slate-200 dark:border-white/10 flex items-center justify-between shadow-sm">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 block">Total Attending</span>
                    <span className="text-2xl font-black text-slate-900 dark:text-white">+{registrationCount}</span>
                  </div>

                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-purple-500 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[10px] font-black text-white shadow-sm">W</div>
                    <div className="w-8 h-8 rounded-full bg-indigo-500 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[10px] font-black text-white shadow-sm">I</div>
                    <div className="w-8 h-8 rounded-full bg-pink-500 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[10px] font-black text-white shadow-sm">P</div>
                    <div className="w-8 h-8 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[10px] font-black text-white shadow-sm">A</div>
                  </div>
                </div>

                {/* Quick Registration Status */}
                <div className="text-center pt-1">
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                    {isIntaEvent
                      ? '🎟️ Official registration is open on inta.org.'
                      : isRegistered
                      ? '🎉 You have a confirmed spot for this event!'
                      : 'Spots are available. Register now to secure your pass.'}
                  </p>
                </div>

              </div>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* MAIN BODY: 2-COLUMN GRID */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column (8 cols): Description, Key Takeaways, Sponsors */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* About the Event */}
            <section className="rounded-[2rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0f1422] p-8 sm:p-10 shadow-sm space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-100 dark:border-white/5">
                <div className="w-10 h-10 rounded-2xl bg-purple-500/10 dark:bg-purple-500/20 text-[#5a32fa] dark:text-purple-300 flex items-center justify-center font-bold">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900 dark:text-white">About This Event</h2>
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400">Comprehensive overview, schedule, and insights</p>
                </div>
              </div>

              {/* Formatted Narrative Description */}
              <div className="prose dark:prose-invert max-w-none">
                {renderFormattedDescription(event.description)}
              </div>

              {/* Official Registration Action Banner for INTA */}
              {isIntaEvent && (
                <div className="p-6 rounded-2xl bg-gradient-to-r from-orange-500/10 via-purple-500/10 to-indigo-500/10 border border-orange-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white p-1 border border-orange-200 shrink-0 flex items-center justify-center">
                      <img src="/inta-logo.png" alt="INTA Logo" className="max-h-full max-w-full object-contain" />
                    </div>
                    <div>
                      <h4 className="font-black text-sm text-gray-900 dark:text-white">Official INTA 2027 Portal</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-300">Complete your delegate badge and hotel booking on the official INTA website.</p>
                    </div>
                  </div>

                  <a
                    href="https://www.inta.org/meetings/2027-annual-meeting/registration/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-xl bg-[#e35205] hover:bg-[#c94500] text-white font-black text-xs shadow-md transition-all shrink-0 flex items-center gap-1.5"
                  >
                    Visit inta.org Registration <ExternalLink size={13} />
                  </a>
                </div>
              )}
            </section>

            {/* Event Sponsors & Partners */}
            {sponsors.length > 0 && (
              <section className="rounded-[2rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0f1422] p-8 sm:p-10 shadow-sm space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
                      <Handshake size={20} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-gray-900 dark:text-white">Event Sponsors</h2>
                      <p className="text-xs font-bold text-gray-500 dark:text-gray-400">Supported by premier industry organizations</p>
                    </div>
                  </div>

                  <Link
                    href={`/platform/events/${event.id}/sponsor`}
                    className="text-xs font-black text-[#5a32fa] dark:text-purple-400 hover:underline flex items-center gap-1"
                  >
                    Become a Sponsor <ArrowRight size={14} />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {sponsors.map((sp) => (
                    <div
                      key={sp.id}
                      className="p-5 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/5 flex items-center gap-4 hover:border-purple-500/50 transition-all"
                    >
                      <div className="w-14 h-14 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 p-2 flex items-center justify-center shrink-0">
                        {sp.sponsor_logo_url ? (
                          <img src={sp.sponsor_logo_url} alt={sp.sponsor_name} className="max-h-full max-w-full object-contain" />
                        ) : (
                          <Building size={24} className="text-purple-500" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-black text-sm text-gray-900 dark:text-white truncate">{sp.sponsor_name}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{sp.sponsor_tagline || 'Official Sponsor'}</p>
                        {sp.sponsor_website_url && (
                          <a
                            href={sp.sponsor_website_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] font-bold text-[#5a32fa] dark:text-purple-400 inline-flex items-center gap-1 mt-1 hover:underline"
                          >
                            Visit Partner Website <ExternalLink size={11} />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Other Upcoming Events Carousel / Grid */}
            {otherEvents.length > 0 && (
              <section className="rounded-[2rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0f1422] p-8 sm:p-10 shadow-sm space-y-6">
                <h3 className="text-xl font-black text-gray-900 dark:text-white">Explore More WIPA Events</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {otherEvents.map((oe) => {
                    const oeDate = safeDate(oe.event_date);
                    return (
                      <Link
                        key={oe.id}
                        href={`/platform/events/${oe.id}`}
                        className="group p-4 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/5 hover:border-[#5a32fa] transition-all flex flex-col justify-between"
                      >
                        <div>
                          {oe.cover_image_url && (
                            <div className="w-full h-24 rounded-xl overflow-hidden mb-3 bg-black/20">
                              <img src={oe.cover_image_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                            </div>
                          )}
                          <span className="text-[10px] font-black uppercase text-purple-600 dark:text-purple-400 block mb-1">
                            {oeDate ? dateFormatter.format(oeDate) : 'Upcoming'}
                          </span>
                          <h5 className="font-black text-sm text-gray-900 dark:text-white line-clamp-2 group-hover:text-[#5a32fa] transition-colors">
                            {oe.title}
                          </h5>
                        </div>
                        <span className="text-xs font-bold text-gray-500 mt-4 flex items-center gap-1">
                          View Event <ArrowRight size={12} />
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </section>
            )}

          </div>

          {/* Right Sidebar (4 cols): Ticket, Location, Organizer, Help */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* 1. Ticket Action Box with Live Currency Switcher */}
            <div className="rounded-[2rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0f1422] p-6 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-white/5">
                <span className="text-xs font-black uppercase tracking-wider text-gray-400">Pass / Ticket</span>
                <span className="text-xl font-black text-[#5a32fa] dark:text-purple-300">{priceDisplay}</span>
              </div>

              {/* Currency Selector Buttons */}
              {!isFree && (
                <div className="flex items-center justify-between bg-slate-50 dark:bg-white/5 p-2 rounded-xl border border-slate-200 dark:border-white/10">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Select Currency:</span>
                  <div className="flex items-center gap-1">
                    {CURRENCIES.map((c) => (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() => setSelectedCurrency(c.code)}
                        className={`px-2 py-1 rounded-md text-[10px] font-black transition-all ${
                          selectedCurrency === c.code
                            ? 'bg-[#5a32fa] text-white shadow-sm'
                            : 'bg-white dark:bg-black/40 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                        }`}
                      >
                        {c.code}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={toggleRegistration}
                disabled={saving}
                className={`w-full py-4 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 shadow-lg ${
                  isIntaEvent
                    ? 'bg-[#e35205] hover:bg-[#c94500] text-white shadow-orange-600/30'
                    : isRegistered
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
                    : 'bg-[#5a32fa] hover:bg-[#4a24db] text-white shadow-purple-600/30'
                }`}
              >
                {isIntaEvent ? <ExternalLink size={18} /> : isRegistered ? <Check size={18} /> : <Ticket size={18} />}
                {saving ? 'Processing...' : isIntaEvent ? 'Register on INTA.org ↗' : isRegistered ? 'You Are Attending' : 'Register for Event'}
              </button>

              <div className="text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  {isIntaEvent
                    ? 'Official INTA Annual Meeting registration pass.'
                    : isRegistered
                    ? 'Need to cancel? Click above to withdraw your RSVP.'
                    : 'Free access for registered Women’s IP Alliance members.'}
                </p>
              </div>
            </div>

            {/* 2. Venue & Location Card */}
            <div className="rounded-[2rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0f1422] p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-gray-400 flex items-center gap-2">
                <MapPin size={16} className="text-[#5a32fa]" /> Venue & Location
              </h3>

              <div className="space-y-2">
                <p className="font-bold text-sm text-gray-900 dark:text-white">
                  {event.location || (isVirtual ? 'Virtual Online Platform (Zoom / Meetn)' : 'Global Conference Centre')}
                </p>

                {hasPhysicalLocation && (
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location || '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-black text-[#5a32fa] dark:text-purple-400 hover:underline pt-2"
                  >
                    <Navigation size={13} /> Open in Google Maps <ExternalLink size={11} />
                  </a>
                )}
              </div>
            </div>

            {/* 3. Organizer Card */}
            <div className="rounded-[2rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0f1422] p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-gray-400 flex items-center gap-2">
                <UserRound size={16} className="text-[#5a32fa]" /> Event Organizer
              </h3>

              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 overflow-hidden shrink-0 p-1 flex items-center justify-center shadow-sm">
                  {organizer?.avatar_url ? (
                    <img src={organizer.avatar_url} alt="Organizer" className="max-h-full max-w-full object-contain" />
                  ) : (
                    <Building size={24} className="text-[#5a32fa]" />
                  )}
                </div>

                <div className="space-y-1">
                  <h4 className="font-black text-sm text-gray-900 dark:text-white">
                    {organizer?.full_name || (isIntaEvent ? 'International Trademark Association' : 'WIPA Global Community')}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-tight">
                    {organizer?.role || (isIntaEvent ? 'Global Association of Brand Owners & IP Professionals' : "Women's IP Alliance Host")}
                  </p>
                  <span className="inline-block mt-1 text-[10px] font-black uppercase text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md">
                    {isIntaEvent ? 'Official Organizer' : 'Verified Host'}
                  </span>
                </div>
              </div>
            </div>

            {/* 4. Sponsorship Invitation Card */}
            <div className="rounded-[2rem] border border-purple-500/20 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent p-6 space-y-3">
              <h4 className="text-sm font-black text-gray-900 dark:text-white flex items-center gap-2">
                <Award size={16} className="text-[#5a32fa]" /> Want to Sponsor this Event?
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                Gain brand visibility with 10,000+ intellectual property executives and brand counsel.
              </p>
              <Link
                href={`/platform/events/${event.id}/sponsor`}
                className="inline-block w-full text-center py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-colors"
              >
                Explore Sponsorship Tiers
              </Link>
            </div>

          </div>

        </div>

      </div>
    </main>
  );
}
