'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  GraduationCap, 
  Calendar, 
  Star, 
  CheckCircle2, 
  MessageSquare, 
  Briefcase, 
  ArrowRight, 
  Search, 
  Users, 
  ShieldCheck, 
  Clock, 
  ChevronRight, 
  X, 
  Send, 
  MapPin, 
  SlidersHorizontal,
  Video,
  Award,
  Sparkles as _, // strict rule reminder: never use Sparkles in UI
  HelpCircle,
  BookOpen
} from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/store/useAppStore';
import AdSlot from '@/components/AdSlot';

interface MentorProfile {
  id: string;
  full_name: string;
  avatar_url?: string;
  role?: string;
  company?: string;
  country?: string;
  bio?: string;
  skills?: string;
  practice_area?: string;
  experience_years?: number;
  education?: string;
  is_wipa_recommended?: boolean;
}

interface MentorshipBooking {
  id: string;
  mentorId: string;
  mentorName: string;
  mentorAvatar?: string;
  mentorRole?: string;
  mentorCompany?: string;
  objective: string;
  format: string;
  scheduledDate: string;
  status: 'Confirmed' | 'Pending Mentor Review';
}

// Curated 13 Elite Senior Mentors
const CURATED_13_MENTORS: MentorProfile[] = [
  {
    id: "37e1b565-de5d-4ea8-81f8-e4cb47199b59",
    full_name: "Katherine Pierce",
    avatar_url: "https://images.unsplash.com/photo-1598550874175-4d0ef436c909?auto=format&fit=crop&w=400&h=400&q=80",
    role: "Chief Trademark Counsel",
    company: "The Coca-Cola Company",
    country: "Atlanta, Georgia, USA",
    bio: "Safeguarding some of the planet's most recognized brand marks, signature bottle silhouettes, and advertising slogans across 200+ territories.",
    skills: "Contour Bottle Trade Dress, Famous Mark Protection, 200+ Country Portfolio Maintenance",
    practice_area: "Global Beverage Trademarks & Trade Dress",
    experience_years: 22,
    education: "Emory University School of Law",
    is_wipa_recommended: true
  },
  {
    id: "c22686be-0417-4395-b8ce-4976d08e274a",
    full_name: "Dr. Yoko Takahashi",
    avatar_url: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=400&h=400&q=80",
    role: "General Manager - Global IP",
    company: "Canon Inc. Global IP Headquarters",
    country: "Tokyo, Japan",
    bio: "Pioneering Japanese Benrishi leading high-volume USPTO and JPO patent creation across nanoimprint lithography, medical optical scanners, and cameras.",
    skills: "Nanoimprint Lithography Patents, Inkjet Fluidics, JPO Board of Appeals Trials",
    practice_area: "Optoelectronic Sensors & Printing Technologies",
    experience_years: 22,
    education: "University of Tokyo (Ph.D. Applied Physics), Registered Benrishi",
    is_wipa_recommended: true
  },
  {
    id: "6a623700-1cfa-4ebf-a185-1d41bcbf16b9",
    full_name: "Nandita Das",
    avatar_url: "https://images.unsplash.com/photo-1573497019236-17f8177b81e8?auto=format&fit=crop&w=400&h=400&q=80",
    role: "Senior Patent Examiner (Ex-IPO) & Consultant",
    company: "Kolkata IP Advisory",
    country: "Kolkata, India",
    bio: "Decades of public service insight into Indian Patent Office examination standards, helping enterprises streamline prosecution timelines.",
    skills: "Patent Office Procedures, First Examination Reports (FER), Section 8 Compliance",
    practice_area: "IPO Office Practice & Patent Audits",
    experience_years: 21,
    education: "Jadavpur University (M.Tech), ILS Pune",
    is_wipa_recommended: true
  },
  {
    id: "9f8d304a-0be6-4aad-b2eb-376e3c596f93",
    full_name: "Dr. Ingrid Weber",
    avatar_url: "https://images.unsplash.com/photo-1573496358961-3c82861ab8f4?auto=format&fit=crop&w=400&h=400&q=80",
    role: "VP of Global Patents",
    company: "Siemens AG",
    country: "Munich, Germany",
    bio: "Overseeing 15,000+ active patent families covering cyber-physical production systems, smart grid distribution, and train traction electronics.",
    skills: "Digital Twin Systems, Factory Automation Protocols, SCADA Security Inventions",
    practice_area: "Industrial Automation & Digital Twins",
    experience_years: 21,
    education: "Technical University of Munich (Dr.-Ing.), German & European Patent Bar",
    is_wipa_recommended: true
  },
  {
    id: "2c42bd60-73ea-4d70-8dbf-7f8d6118b371",
    full_name: "Anjali Mukherjee",
    avatar_url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&h=400&q=80",
    role: "Founding Partner",
    company: "Mukherjee & Associates IP",
    country: "Kolkata, India",
    bio: "Dedicated champion for community-owned intellectual property, GI registrations for artisan collectives, and preservation of indigenous crafts.",
    skills: "Geographical Indications (GI), Traditional Knowledge Digital Library (TKDL), Handicrafts IP",
    practice_area: "Geographical Indications & Heritage IP",
    experience_years: 20,
    education: "Calcutta University",
    is_wipa_recommended: true
  },
  {
    id: "68337cdb-0d7c-4e9a-a770-1ab0daed9830",
    full_name: "Victoria Montgomery",
    avatar_url: "https://images.unsplash.com/photo-1507152832244-10d45c7eda57?auto=format&fit=crop&w=400&h=400&q=80",
    role: "Partner & Head of Trademarks",
    company: "DLA Piper LLP",
    country: "New York, USA",
    bio: "Advisor to Fortune 50 media conglomerates, social networks, and streaming giants on international trademark clearance and brand enforcement.",
    skills: "Worldwide Trademark Prosecution, Dilution Claims, Metaverse Branding Strategies",
    practice_area: "Global Brand Management & Media",
    experience_years: 20,
    education: "Columbia Law School",
    is_wipa_recommended: true
  },
  {
    id: "2d2901bc-b2fc-4e07-9e84-fa5526829c6e",
    full_name: "Dr. Kimberly Adams",
    avatar_url: "https://images.unsplash.com/photo-1573496799515-eebbb63814f2?auto=format&fit=crop&w=400&h=400&q=80",
    role: "Chief Patent Counsel",
    company: "Genentech / Roche Group",
    country: "South San Francisco, USA",
    bio: "Veteran biotech patent strategist managing multi-billion dollar biological franchises, chimeric antigen receptor therapies, and pioneer drug exclusivities.",
    skills: "CAR-T Cell Patents, Biologic Exclusivity Extensions, Federal Circuit Oral Arguments",
    practice_area: "Therapeutic Antibodies & Targeted Cell Therapy",
    experience_years: 20,
    education: "Stanford University (Ph.D. Immunology), Harvard Law School",
    is_wipa_recommended: true
  },
  {
    id: "687f8714-d06c-47e9-8b69-b3a2ea8d7f06",
    full_name: "Dr. Eleanor Vance",
    avatar_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&h=400&q=80",
    role: "Senior Patent Partner",
    company: "Bird & Bird LLP",
    country: "London, United Kingdom",
    bio: "Top-ranked European Patent Attorney specializing in quantum algorithms, superconducting qubits, and multi-jurisdictional UPC enforcement.",
    skills: "EPO Opposition, Quantum Computing Patents, Unified Patent Court (UPC) Litigation",
    practice_area: "European Patent Prosecution (EPO)",
    experience_years: 19,
    education: "University of Oxford (Ph.D. Quantum Physics), BPP Law School",
    is_wipa_recommended: true
  },
  {
    id: "57f66f44-b042-4ac2-9154-9561db84fdaf",
    full_name: "Malini Sundaram",
    avatar_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&h=400&q=80",
    role: "Director of IP Strategy",
    company: "Ashok Leyland Defense Systems",
    country: "Chennai, India",
    bio: "Managing mission-critical engineering patent portfolios, tactical mobility systems, and electric propulsion technologies.",
    skills: "Powertrain Inventions, Dual-Use Tech Export Controls, Defense Inventions Licensing",
    practice_area: "Aerospace & Automotive IP",
    experience_years: 19,
    education: "IIT Madras (B.Tech Mechanical), NLSIU (MBL)",
    is_wipa_recommended: true
  },
  {
    id: "251be9ea-1bc3-49a7-96e0-766ed8755152",
    full_name: "Freja Møller",
    avatar_url: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=400&h=400&q=80",
    role: "Chief IP Officer",
    company: "Vestas Wind Systems",
    country: "Aarhus, Denmark",
    bio: "Directing the global patent strategy for modular wind turbine blades, advanced carbon composite structures, and predictive yaw controllers.",
    skills: "Composite Blade Aerodynamics, Pitch Bearings IP, Grid Compatibility Controls",
    practice_area: "Clean Energy & Mechanical Patents",
    experience_years: 19,
    education: "Aarhus University (Mechanical Eng & Law)",
    is_wipa_recommended: true
  },
  {
    id: "82e2a4b8-4a82-49a2-841f-fbdef36d92e8",
    full_name: "Leela Namboodiri",
    avatar_url: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=400&h=400&q=80",
    role: "Chief Trademark Counsel",
    company: "Dabur India Limited",
    country: "New Delhi, India",
    bio: "Protecting iconic Indian FMCG trademarks, defending herbal formulations against predatory imitators in over 60 export markets.",
    skills: "Traditional Formulation Protection, Passing Off Litigation, Trade Dress Safeguards",
    practice_area: "Ayurvedic Products & Consumer IP",
    experience_years: 19,
    education: "Kerala Law Academy",
    is_wipa_recommended: true
  },
  {
    id: "ce99c3f0-abf7-4993-a91d-480b2c7adf0b",
    full_name: "Brooke Kensington",
    avatar_url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&h=400&q=80",
    role: "Senior Partner",
    company: "Clifford Chance LLP",
    country: "London, United Kingdom",
    bio: "Advising tier-1 investment banks on intellectual property joint ventures, quantitative trading software licenses, and clearinghouse proprietary systems.",
    skills: "Algorithmic Trading Systems, ISDA Standard Tech Terms, Bank Consortium IP",
    practice_area: "Fintech, Derivatives & AI Licensing",
    experience_years: 19,
    education: "University of Cambridge (MA Law)",
    is_wipa_recommended: true
  },
  {
    id: "59da0825-4875-4f4f-bfb9-da51dbb95196",
    full_name: "Grace Kelly",
    avatar_url: "https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&w=400&h=400&q=80",
    role: "Senior Director - Brand Legal",
    company: "Warner Bros. Discovery",
    country: "Burbank, California, USA",
    bio: "Preserving multi-billion dollar cinematic franchises, defending comic character trademarks, and supervising worldwide merchandise licensing deals.",
    skills: "Iconic Character Trademarks, Theme Park Ride Licensing, Global Merchandising Monopolies",
    practice_area: "Franchise IP & Character Licensing",
    experience_years: 18,
    education: "USC Gould School of Law",
    is_wipa_recommended: true
  }
];

const PRACTICE_AREAS = [
  'All Focus Areas',
  'Patents & Claim Drafting',
  'Trademarks & Brand Security',
  'IP Litigation & Disputes',
  'Life Sciences & Biologics',
  'Artificial Intelligence & Tech',
  'In-House Transition & Counsel',
  'Trade Secrets & Licensing'
];

function MentorshipPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const user = useAppStore((state) => state.user);

  const [activeTab, setActiveTab] = useState<'find' | 'my-mentors' | 'how-it-works'>('find');
  const [mentors, setMentors] = useState<MentorProfile[]>(CURATED_13_MENTORS);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPracticeArea, setSelectedPracticeArea] = useState('All Focus Areas');
  const [selectedExperience, setSelectedExperience] = useState('all');

  // Booking Modal State
  const [bookingMentor, setBookingMentor] = useState<MentorProfile | null>(null);
  const [bookingObjective, setBookingObjective] = useState('Career Transition to In-House');
  const [bookingFormat, setBookingFormat] = useState('30-Min Strategy Call');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingMessage, setBookingMessage] = useState('');
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Active User Mentorships (Simulated & DB Linked)
  const [myBookings, setMyBookings] = useState<MentorshipBooking[]>([
    {
      id: 'book_1',
      mentorId: '687f8714-d06c-47e9-8b69-b3a2ea8d7f06',
      mentorName: 'Dr. Eleanor Vance',
      mentorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&h=400&q=80',
      mentorRole: 'Senior Patent Partner',
      mentorCompany: 'Bird & Bird LLP',
      objective: 'Patent Claim Drafting & Prosecution Review',
      format: '45-Min Deep Dive',
      scheduledDate: 'Thursday at 4:00 PM BST',
      status: 'Confirmed'
    },
    {
      id: 'book_2',
      mentorId: '37e1b565-de5d-4ea8-81f8-e4cb47199b59',
      mentorName: 'Katherine Pierce',
      mentorAvatar: 'https://images.unsplash.com/photo-1598550874175-4d0ef436c909?auto=format&fit=crop&w=400&h=400&q=80',
      mentorRole: 'Chief Trademark Counsel',
      mentorCompany: 'The Coca-Cola Company',
      objective: 'Career Transition to In-House',
      format: '30-Min Strategy Call',
      scheduledDate: 'Next Tuesday at 5:30 PM EST',
      status: 'Confirmed'
    }
  ]);

  // Read URL query params on load
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'my-mentors') {
      setActiveTab('my-mentors');
    }
  }, [searchParams]);

  // Fetch real senior practitioners from Supabase (strictly limited to 13 elite mentors)
  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url, role, company, country, bio, skills, practice_area, experience_years, education, is_wipa_recommended')
          .not('role', 'is', null)
          .not('company', 'is', null)
          .order('experience_years', { ascending: false, nullsFirst: false })
          .limit(30);

        if (data && data.length > 0) {
          // Filter to high quality senior mentor profiles and cap strictly at 13
          const filtered = data.filter(p => p.full_name && p.company && p.role !== 'admin' && p.role !== 'subadmin');
          if (filtered.length >= 13) {
            setMentors(filtered.slice(0, 13));
          } else if (filtered.length > 0) {
            // Merge with curated defaults to always guarantee 13 mentors
            const ids = new Set(filtered.map(f => f.id));
            const remainder = CURATED_13_MENTORS.filter(c => !ids.has(c.id));
            setMentors([...filtered, ...remainder].slice(0, 13));
          }
        }
      } catch (err) {
        console.error('Error fetching mentors, using curated 13 mentors:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMentors();
  }, []);

  // Filtered Mentors List (searches & filters within the 13 mentors)
  const filteredMentors = useMemo(() => {
    return mentors.filter(m => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = m.full_name?.toLowerCase().includes(q);
        const matchesRole = m.role?.toLowerCase().includes(q);
        const matchesCompany = m.company?.toLowerCase().includes(q);
        const matchesSkills = m.skills?.toLowerCase().includes(q);
        const matchesArea = m.practice_area?.toLowerCase().includes(q);
        if (!matchesName && !matchesRole && !matchesCompany && !matchesSkills && !matchesArea) {
          return false;
        }
      }

      // Practice Area
      if (selectedPracticeArea !== 'All Focus Areas') {
        const areaStr = `${m.practice_area || ''} ${m.skills || ''} ${m.role || ''} ${m.bio || ''}`.toLowerCase();
        if (selectedPracticeArea.includes('Patent') && !areaStr.includes('patent')) return false;
        if (selectedPracticeArea.includes('Trademark') && !areaStr.includes('trademark') && !areaStr.includes('brand')) return false;
        if (selectedPracticeArea.includes('Litigation') && !areaStr.includes('litigat') && !areaStr.includes('dispute') && !areaStr.includes('enforcement') && !areaStr.includes('court') && !areaStr.includes('opposition')) return false;
        if (selectedPracticeArea.includes('Life Sciences') && !areaStr.includes('bio') && !areaStr.includes('pharma') && !areaStr.includes('cell') && !areaStr.includes('health') && !areaStr.includes('ayurved')) return false;
        if (selectedPracticeArea.includes('Intelligence') && !areaStr.includes('ai') && !areaStr.includes('tech') && !areaStr.includes('software') && !areaStr.includes('digital') && !areaStr.includes('quantum') && !areaStr.includes('lithography') && !areaStr.includes('sensor')) return false;
        if (selectedPracticeArea.includes('In-House') && !areaStr.includes('in-house') && !areaStr.includes('counsel') && !areaStr.includes('head') && !areaStr.includes('officer') && !areaStr.includes('director') && !areaStr.includes('general manager')) return false;
        if (selectedPracticeArea.includes('Trade Secrets') && !areaStr.includes('secret') && !areaStr.includes('licens') && !areaStr.includes('trade dress') && !areaStr.includes('commercial')) return false;
      }

      // Experience
      if (selectedExperience !== 'all') {
        const yrs = m.experience_years || 8;
        if (selectedExperience === '10' && yrs < 10) return false;
        if (selectedExperience === '15' && yrs < 15) return false;
        if (selectedExperience === '20' && yrs < 20) return false;
      }

      return true;
    });
  }, [mentors, searchQuery, selectedPracticeArea, selectedExperience]);

  // Handle Mentorship Booking Submission
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingMentor || !bookingMessage.trim() || isSubmittingBooking) return;
    setIsSubmittingBooking(true);

    try {
      const res = await fetch('/api/mentorship/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mentorId: bookingMentor.id,
          menteeId: user?.id,
          objective: bookingObjective,
          format: bookingFormat,
          preferredDate: bookingDate || undefined,
          message: bookingMessage.trim()
        })
      });

      const result = await res.json();
      if (result.success) {
        setBookingSuccess(true);
        // Add to active user mentorships
        const newBooking: MentorshipBooking = {
          id: result.requestId || `book_${Date.now()}`,
          mentorId: bookingMentor.id,
          mentorName: bookingMentor.full_name,
          mentorAvatar: bookingMentor.avatar_url,
          mentorRole: bookingMentor.role,
          mentorCompany: bookingMentor.company,
          objective: bookingObjective,
          format: bookingFormat,
          scheduledDate: bookingDate ? new Date(bookingDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : 'Next Week (To be confirmed)',
          status: 'Pending Mentor Review'
        };

        setMyBookings(prev => [newBooking, ...prev]);

        setTimeout(() => {
          setBookingMentor(null);
          setBookingSuccess(false);
          setBookingMessage('');
          setActiveTab('my-mentors');
        }, 1800);
      }
    } catch (err) {
      console.error('Error booking mentorship:', err);
    } finally {
      setIsSubmittingBooking(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#070b14] text-slate-900 dark:text-white font-sans pb-24">
      
      {/* ============================================================ */}
      {/* ULTRA-SEXY FULL-WIDTH AMBIENT MENTORSHIP HERO                 */}
      {/* ============================================================ */}
      <section className="w-full relative overflow-hidden border-b border-slate-200/90 dark:border-white/10 bg-gradient-to-br from-white via-slate-50/95 to-purple-50/50 dark:from-[#131b2e] dark:via-[#101627] dark:to-[#1e1333] shadow-xs">
        
        {/* Full-Bleed Ambient Lighting & Blueprint Grid */}
        <div className="pointer-events-none absolute left-1/2 -top-40 -translate-x-1/2 h-[500px] w-[720px] rounded-full bg-gradient-to-b from-[#5a32fa]/20 via-[#7c3aed]/10 to-transparent blur-3xl animate-pulse" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-[360px] w-[360px] rounded-full bg-gradient-to-tr from-[#ff2a5f]/10 via-purple-500/5 to-transparent blur-3xl" />
        <div className="pointer-events-none absolute -right-20 bottom-0 h-[360px] w-[360px] rounded-full bg-gradient-to-tl from-cyan-500/10 via-purple-500/5 to-transparent blur-3xl" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#5a32fa_1px,transparent_1px)] [background-size:28px_28px] opacity-[0.035] dark:opacity-[0.07]" />

        <div className="w-full px-5 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 py-14 md:py-20 relative z-10 flex flex-col items-center justify-center text-center">
          
          {/* Centered Content Column */}
          <div className="max-w-3xl lg:max-w-4xl space-y-6 flex flex-col items-center text-center">
            
            {/* Top Pill Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#5a32fa]/30 bg-gradient-to-r from-[#5a32fa]/15 via-purple-500/10 to-transparent px-3.5 py-1 text-xs font-black uppercase tracking-[0.2em] text-[#5a32fa] dark:text-violet-300 shadow-2xs">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                WIPA Career Acceleration
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 px-3 py-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Verified 1:1 Executive Advisory
              </span>
            </div>

            {/* Sexy High-Impact Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-[1.08] tracking-[-0.03em] text-slate-900 dark:text-white text-center max-w-3xl">
              Connect 1:1 with executive{' '}
              <span className="relative inline-block bg-gradient-to-r from-[#5a32fa] via-[#9055ff] to-[#ff2a5f] bg-clip-text text-transparent">
                mentors in IP law.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base md:text-lg font-normal leading-relaxed text-slate-600 dark:text-slate-300 max-w-2xl mx-auto text-center">
              Receive private strategic advisory from seasoned patent partners, Chief IP Counsels, and trademark directors. Navigate equity partnership tracks, lead in-house committees, and master complex prosecution strategies.
            </p>

            {/* Value Props Chips */}
            <div className="pt-1 flex flex-wrap items-center justify-center gap-2.5">
              <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-2xs">
                <ShieldCheck size={15} className="text-[#5a32fa]" />
                <span>13 Executive Advisory Fellows</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-2xs">
                <Award size={15} className="text-amber-500" />
                <span>1:1 Confidential Advisory</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-2xs">
                <CheckCircle2 size={15} className="text-emerald-500" />
                <span>Included in Membership (£0)</span>
              </div>
            </div>

            {/* Interactive CTA Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3.5">
              <button
                onClick={() => {
                  setActiveTab('find');
                  window.scrollTo({ top: 520, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-[#5a32fa] via-[#7c3aed] to-[#ff2a5f] hover:opacity-95 shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 hover:-translate-y-0.5 transition-all cursor-pointer group"
              >
                <Search size={16} />
                <span>Find Your Mentor</span>
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </button>

              <Link
                href="/platform/mentorship/apply"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-sm text-slate-700 dark:text-slate-200 bg-white/80 dark:bg-white/10 hover:bg-slate-100 dark:hover:bg-white/15 border border-slate-200/90 dark:border-white/10 transition-all cursor-pointer shadow-2xs"
              >
                <GraduationCap size={16} />
                <span>Become a Mentor</span>
              </Link>
            </div>

            {/* Metric Ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-10 pt-8 border-t border-slate-200/80 dark:border-white/10 w-full max-w-2xl mx-auto text-center">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">13</div>
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-0.5 uppercase tracking-wider">Executive Mentors</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">1:1</div>
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-0.5 uppercase tracking-wider">Confidential Calls</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">4.9 ★</div>
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-0.5 uppercase tracking-wider">Mentee Rating</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">£0</div>
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-0.5 uppercase tracking-wider">Included in WIPA</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* FULL-WIDTH CONTENT BODY                                      */}
      {/* ============================================================ */}
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 py-8 sm:py-10">

        {/* Tab Navigation - Apple Segmented Pill */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto no-scrollbar pb-1">
          <div className="p-1.5 rounded-full bg-slate-200/80 dark:bg-slate-800/80 border border-slate-300/60 dark:border-slate-700/60 inline-flex items-center gap-1 shrink-0">
            <button
              onClick={() => setActiveTab('find')}
              className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'find'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Users size={14} />
              <span>Mentor Directory ({filteredMentors.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('my-mentors')}
              className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'my-mentors'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Calendar size={14} />
              <span>My Mentorships ({myBookings.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('how-it-works')}
              className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'how-it-works'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <HelpCircle size={14} />
              <span>How It Works</span>
            </button>
          </div>
        </div>

        {/* Dynamic Ad Placement */}
        <div className="mb-8">
          <AdSlot slotId="mentorship_sidebar" />
        </div>

        {/* ============================================================ */}
        {/* TAB 1: FIND A MENTOR DIRECTORY                               */}
        {/* ============================================================ */}
        {activeTab === 'find' && (
          <div>
            {/* Filter Chips Bar */}
            <div className="mb-6 overflow-x-auto no-scrollbar pb-1">
              <div className="flex items-center gap-2.5 min-w-max">
                {PRACTICE_AREAS.map((area) => (
                  <button
                    key={area}
                    onClick={() => setSelectedPracticeArea(area)}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                      selectedPracticeArea === area
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent shadow-xs'
                        : 'bg-white dark:bg-[#0c1020] text-slate-600 dark:text-slate-400 border-slate-200/80 dark:border-white/10 hover:border-slate-300'
                    }`}
                  >
                    {area}
                  </button>
                ))}
              </div>
            </div>

            {/* Search & Experience Dropdown */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search mentors by name, firm, industry, or technical expertise..."
                  className="w-full bg-white dark:bg-[#0c1020] border border-slate-200/80 dark:border-white/10 rounded-full py-3.5 pl-11 pr-5 text-xs sm:text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#5a32fa] transition-colors shadow-xs"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={selectedExperience}
                  onChange={(e) => setSelectedExperience(e.target.value)}
                  className="bg-white dark:bg-[#0c1020] border border-slate-200/80 dark:border-white/10 rounded-full py-3.5 px-6 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 focus:outline-none focus:border-[#5a32fa] cursor-pointer shadow-xs w-full sm:w-auto"
                >
                  <option value="all">All Experience Levels</option>
                  <option value="10">10+ Years Experience</option>
                  <option value="15">15+ Years (Partners & Directors)</option>
                  <option value="20">20+ Years (Executive Leaders)</option>
                </select>
              </div>
            </div>

            {/* Mentors Grid - Responsive High-Impact Grid */}
            {isLoading ? (
              <div className="p-16 rounded-3xl bg-white dark:bg-[#0c1020] border border-slate-200 dark:border-slate-800 text-center">
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-[#5a32fa] mb-3" />
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Loading WIPA mentor directory...</p>
              </div>
            ) : filteredMentors.length === 0 ? (
              <div className="p-16 rounded-3xl bg-white dark:bg-[#0c1020] border border-slate-200 dark:border-slate-800 text-center">
                <Users size={28} className="mx-auto text-slate-400 mb-2" />
                <h3 className="text-sm font-black text-slate-900 dark:text-white">No mentors matching criteria</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">Try clearing filters to view all active mentors.</p>
                <button
                  onClick={() => { setSelectedPracticeArea('All Focus Areas'); setSearchQuery(''); setSelectedExperience('all'); }}
                  className="py-2.5 px-6 rounded-full bg-slate-900 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                {filteredMentors.map((mentor) => {
                  const skills = (mentor.skills || mentor.practice_area || 'Patent Prosecution, IP Strategy')
                    .split(',')
                    .slice(0, 3)
                    .map(s => s.trim());

                  return (
                    <div
                      key={mentor.id}
                      className="group relative flex flex-col justify-between rounded-3xl bg-white dark:bg-[#0c1020] border border-slate-200/90 dark:border-slate-800 hover:border-[#5a32fa] dark:hover:border-purple-500 shadow-xs hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1.5 transition-all duration-300 overflow-hidden"
                    >
                      {/* Top Brand Accent Strip */}
                      <div className="h-1.5 w-full bg-gradient-to-r from-[#5a32fa] via-[#7c3aed] to-[#ff2a5f]" />

                      <div className="p-6 flex flex-col h-full justify-between">
                        <div>
                          {/* Card Status Badges */}
                          <div className="flex items-center justify-between gap-2 mb-4">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-purple-50 dark:bg-purple-950/60 text-[#5a32fa] dark:text-purple-300 border border-purple-200 dark:border-purple-800/60">
                              <ShieldCheck size={12} className="text-[#5a32fa] dark:text-purple-400 shrink-0" />
                              <span>Executive Fellow</span>
                            </span>

                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              <span>Available 1:1</span>
                            </span>
                          </div>

                          {/* Avatar & Identity Row */}
                          <div className="flex items-start gap-3.5 mb-4">
                            <Link href={`/platform/profile/${mentor.id}`} className="relative shrink-0 group/avatar">
                              {mentor.avatar_url ? (
                                <img
                                  src={mentor.avatar_url}
                                  alt={mentor.full_name}
                                  className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-100 dark:border-slate-800 shadow-sm group-hover/avatar:border-[#5a32fa] dark:group-hover/avatar:border-purple-400 transition-colors"
                                />
                              ) : (
                                <div className="w-16 h-16 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-[#5a32fa] dark:text-purple-300 font-black text-xl flex items-center justify-center border-2 border-purple-200 dark:border-purple-800/60 shadow-sm">
                                  {mentor.full_name?.charAt(0)}
                                </div>
                              )}
                              <div className="absolute -bottom-1 -right-1 bg-white dark:bg-[#0c1020] p-0.5 rounded-full shadow-xs">
                                <div className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] font-black">
                                  <Star size={10} className="fill-white text-white" />
                                </div>
                              </div>
                            </Link>

                            <div className="min-w-0 flex-1">
                              <Link href={`/platform/profile/${mentor.id}`} className="block">
                                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white group-hover:text-[#5a32fa] dark:group-hover:text-purple-400 transition-colors truncate tracking-tight">
                                  {mentor.full_name}
                                </h3>
                              </Link>
                              <p className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate mt-0.5">
                                {mentor.role || 'IP Partner'}
                              </p>
                              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/90 text-[11px] font-semibold text-slate-700 dark:text-slate-300 mt-1.5 border border-slate-200 dark:border-slate-700 max-w-full">
                                <Briefcase size={12} className="text-[#5a32fa] dark:text-purple-400 shrink-0" />
                                <span className="truncate">{mentor.company || 'Global Practice'}</span>
                              </div>
                            </div>
                          </div>

                          {/* Location & Experience Metadata Strip */}
                          <div className="pt-3 pb-3 border-y border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs gap-2">
                            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium truncate">
                              <MapPin size={13} className="text-slate-400 shrink-0" />
                              <span className="truncate text-[11px]">{mentor.country || 'Global'}</span>
                            </div>
                            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 shrink-0">
                              <Award size={12} className="text-amber-600 dark:text-amber-400" />
                              <span>{mentor.experience_years ? `${mentor.experience_years}+ Yrs Exp` : 'Senior Leader'}</span>
                            </div>
                          </div>

                          {/* Bio Quote Card */}
                          <div className="my-3.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/70">
                            <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed italic">
                              "{mentor.bio || 'Specializing in intellectual property advisory, prosecution strategy, and career guidance for WIPA members.'}"
                            </p>
                          </div>

                          {/* Expertise Chips */}
                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {skills.map((skill, idx) => (
                              <span
                                key={idx}
                                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/80 hover:border-[#5a32fa]/40 transition-colors truncate max-w-[200px]"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          {/* Session Guarantee Info */}
                          <div className="pt-3 pb-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                            <span className="flex items-center gap-1.5">
                              <Clock size={12} className="text-[#5a32fa] dark:text-purple-400" />
                              <span>1:1 Advisory (30-45m)</span>
                            </span>
                            <span className="text-emerald-600 dark:text-emerald-400 font-black text-[11px] bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800/50">
                              Included (£0)
                            </span>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2.5 pt-1">
                            <Link
                              href={`/platform/profile/${mentor.id}`}
                              className="flex-1 py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold text-center transition-all flex items-center justify-center gap-1 group/btn"
                            >
                              <span>View Profile</span>
                              <ChevronRight size={13} className="text-slate-400 group-hover/btn:translate-x-0.5 transition-transform" />
                            </Link>
                            <button
                              onClick={() => setBookingMentor(mentor)}
                              className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#5a32fa] via-[#6e3df6] to-[#8b5cf6] hover:from-[#5026e6] hover:to-[#7c3aed] text-white text-xs font-black shadow-md shadow-purple-500/20 hover:shadow-lg hover:shadow-purple-500/30 active:scale-[0.98] text-center transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <Calendar size={13} />
                              <span>Book Session</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 2: MY MENTORSHIPS HUB                                    */}
        {/* ============================================================ */}
        {activeTab === 'my-mentors' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  My Active Mentorship Sessions
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Track your scheduled advisory meetings, past sessions, and mentee notes.
                </p>
              </div>

              <button
                onClick={() => setActiveTab('find')}
                className="py-2.5 px-6 rounded-full bg-[#5a32fa] text-white text-xs font-bold shadow-xs cursor-pointer hover:bg-purple-600 transition-colors"
              >
                + Book Another Mentor
              </button>
            </div>

            {myBookings.length === 0 ? (
              <div className="p-16 rounded-3xl bg-white dark:bg-[#0c1020] border border-slate-200/80 dark:border-white/10 text-center">
                <Calendar size={32} className="mx-auto text-slate-400 mb-3" />
                <h3 className="text-sm font-black text-slate-900 dark:text-white">No active mentorships scheduled</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
                  Browse our directory of senior IP leaders to schedule your first 1:1 advisory session.
                </p>
                <button
                  onClick={() => setActiveTab('find')}
                  className="py-2.5 px-6 rounded-full bg-slate-900 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  Explore Mentors
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {myBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="p-6 rounded-3xl bg-white dark:bg-[#0c1020] border border-slate-200/80 dark:border-white/10 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6"
                  >
                    <div className="flex items-start sm:items-center gap-4">
                      {booking.mentorAvatar ? (
                        <img
                          src={booking.mentorAvatar}
                          alt={booking.mentorName}
                          className="w-16 h-16 rounded-2xl object-cover border border-slate-200 dark:border-white/10 shadow-xs shrink-0"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-2xl bg-[#5a32fa]/10 text-[#5a32fa] font-black text-xl flex items-center justify-center shrink-0">
                          {booking.mentorName.charAt(0)}
                        </div>
                      )}

                      <div>
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Your Mentor:</span>
                          <h3 className="text-base font-black text-slate-900 dark:text-white">
                            {booking.mentorName}
                          </h3>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${
                            booking.status === 'Confirmed'
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                          }`}>
                            {booking.status}
                          </span>
                        </div>

                        <p className="text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">
                          {booking.mentorRole} {booking.mentorCompany ? `· ${booking.mentorCompany}` : ''}
                        </p>

                        <div className="flex flex-wrap gap-2 text-xs">
                          <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-700 dark:text-purple-300 font-bold flex items-center gap-1.5">
                            <Calendar size={13} /> Next Session: {booking.scheduledDate}
                          </span>
                          <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-1.5">
                            <CheckCircle2 size={13} className="text-emerald-500" /> Focus: {booking.objective}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-white/5">
                      <Link
                        href="/platform/messages"
                        className="py-2.5 px-5 rounded-full bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
                      >
                        <MessageSquare size={14} />
                        <span>Message</span>
                      </Link>

                      <a
                        href="/platform/events"
                        className="py-2.5 px-6 rounded-full bg-[#5a32fa] hover:bg-purple-600 text-white text-xs font-bold shadow-md shadow-purple-500/20 flex items-center gap-1.5 transition-colors"
                      >
                        <Video size={14} />
                        <span>Join Session Room</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 3: HOW MENTORSHIP WORKS                                  */}
        {/* ============================================================ */}
        {activeTab === 'how-it-works' && (
          <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-[#0c1020] border border-slate-200/80 dark:border-white/10 shadow-xs space-y-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
                How the WIPA Mentorship Program Works
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
                The Women in Intellectual Property Alliance connects female attorneys, technical specialists, and in-house counsel through high-impact, confidential 1:1 advisory pairings.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5">
                <span className="w-9 h-9 rounded-2xl bg-[#5a32fa]/10 text-[#5a32fa] font-black text-xs flex items-center justify-center mb-4">1</span>
                <h3 className="text-base font-black text-slate-900 dark:text-white mb-2">Select Your Mentor</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Browse senior partners, Chief IP Counsels, and licensing directors. Filter by practice area, years of experience, or specific career goals.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5">
                <span className="w-9 h-9 rounded-2xl bg-[#5a32fa]/10 text-[#5a32fa] font-black text-xs flex items-center justify-center mb-4">2</span>
                <h3 className="text-base font-black text-slate-900 dark:text-white mb-2">Define Your Goals</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Submit a structured session request. Specify your objective—from partnership track negotiations to patent committee leadership.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5">
                <span className="w-9 h-9 rounded-2xl bg-[#5a32fa]/10 text-[#5a32fa] font-black text-xs flex items-center justify-center mb-4">3</span>
                <h3 className="text-base font-black text-slate-900 dark:text-white mb-2">1:1 Video Advisory</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Meet in the secure WIPA video room. Receive tactical advice, document drafting feedback, and executive perspective.
                </p>
              </div>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-[#5a32fa]/5 border border-[#5a32fa]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-black text-slate-900 dark:text-white mb-1">
                  Are you a senior IP practitioner with 7+ years of experience?
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Give back to the alliance and inspire emerging female practitioners.
                </p>
              </div>

              <Link
                href="/platform/mentorship/apply"
                className="py-3 px-8 rounded-full bg-[#5a32fa] text-white text-xs font-bold hover:bg-purple-600 transition-colors shrink-0 shadow-md shadow-purple-500/20"
              >
                Apply as a Mentor
              </Link>
            </div>
          </div>
        )}

      </div>

      {/* ============================================================ */}
      {/* 1:1 MENTORSHIP REQUEST MODAL                                 */}
      {/* ============================================================ */}
      {bookingMentor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 animate-in fade-in duration-200">
          <div 
            className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#0c1020] border border-slate-200/80 dark:border-white/10 shadow-2xl p-6 sm:p-7 relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {bookingSuccess ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
                  <CheckCircle2 size={24} />
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Mentorship Request Sent!
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  Your request has been forwarded to {bookingMentor.full_name}. A calendar confirmation has been added to your WIPA schedule.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100 dark:border-white/10">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#5a32fa] dark:text-purple-400">
                      1:1 Advisory Session
                    </span>
                    <h2 className="text-lg font-black text-slate-900 dark:text-white">
                      Request Mentorship with {bookingMentor.full_name}
                    </h2>
                  </div>
                  <button
                    onClick={() => setBookingMentor(null)}
                    className="h-8 w-8 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-400 hover:text-slate-600 dark:hover:text-white flex items-center justify-center cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                </div>

                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-black uppercase text-slate-700 dark:text-slate-300 mb-1.5">
                      Mentorship Focus / Objective
                    </label>
                    <select
                      value={bookingObjective}
                      onChange={(e) => setBookingObjective(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-[#12182c] border border-slate-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#5a32fa]"
                    >
                      <option value="Career Transition to In-House">Career Transition (Firm to In-House)</option>
                      <option value="Patent Claim Drafting & Prosecution Review">Patent Claim Drafting & Prosecution Review</option>
                      <option value="Partnership Track Navigation">Partnership Track Navigation</option>
                      <option value="Executive Leadership & Department Management">Executive Leadership & Management</option>
                      <option value="Specific Legal Strategy & Licensing">Specific Legal Strategy & Licensing</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-black uppercase text-slate-700 dark:text-slate-300 mb-1.5">
                        Session Format
                      </label>
                      <select
                        value={bookingFormat}
                        onChange={(e) => setBookingFormat(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-[#12182c] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#5a32fa]"
                      >
                        <option value="30-Min Strategy Call">30-Min Strategy Call</option>
                        <option value="45-Min Portfolio Review">45-Min Deep Dive</option>
                        <option value="Monthly Ongoing Check-in">Monthly Ongoing Check-in</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase text-slate-700 dark:text-slate-300 mb-1.5">
                        Preferred Date
                      </label>
                      <input
                        type="date"
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-[#12182c] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#5a32fa]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase text-slate-700 dark:text-slate-300 mb-1.5">
                      Context & Specific Questions for {bookingMentor.full_name.split(' ')[0]}
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={bookingMessage}
                      onChange={(e) => setBookingMessage(e.target.value)}
                      placeholder="Briefly describe your current role, your goals for this session, and any specific questions you want to cover..."
                      className="w-full bg-slate-50 dark:bg-[#12182c] border border-slate-200 dark:border-white/10 rounded-xl p-3 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#5a32fa] resize-none"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setBookingMentor(null)}
                      className="py-2.5 px-4 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-600 dark:text-slate-400 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmittingBooking || !bookingMessage.trim()}
                      className="py-2.5 px-6 rounded-xl bg-[#5a32fa] hover:bg-purple-600 disabled:opacity-50 text-white text-xs font-black shadow-md shadow-purple-500/25 cursor-pointer flex items-center gap-2"
                    >
                      {isSubmittingBooking ? (
                        <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      ) : (
                        <Send size={13} />
                      )}
                      <span>{isSubmittingBooking ? 'Sending Request...' : 'Send Request'}</span>
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

export default function MentorshipPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#070b14] flex items-center justify-center font-bold text-slate-500">
        <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-[#5a32fa] mr-3" />
        <span>Loading Mentorship Program...</span>
      </div>
    }>
      <MentorshipPageContent />
    </Suspense>
  );
}
