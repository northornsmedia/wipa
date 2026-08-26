// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Headphones, 
  Heart, 
  Activity, 
  Play, 
  Sparkles, 
  Smile, 
  Coffee, 
  Sun, 
  Moon, 
  ArrowRight, 
  ArrowLeft, 
  ExternalLink, 
  Globe, 
  Award, 
  CheckCircle2, 
  BrainCircuit, 
  Zap, 
  Plane, 
  Building2, 
  Calendar,
  Star,
  Clock,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase-browser';

function InstagramIcon({ size = 16, className = '' }: { size?: number; className?: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

const FOCUS_AREAS = [
  { id: 'all', name: 'All Wellness' },
  { id: 'gut-hormone', name: 'Gut & Hormone Health' },
  { id: 'nervous-system', name: 'Nervous System & Stress' },
  { id: 'nutrition', name: 'Nutritional Therapy' },
  { id: 'mental-health', name: 'Mental Health' },
  { id: 'mental-wellbeing', name: 'Mental Wellbeing' },
  { id: 'work-life', name: 'Work-Life Balance' },
  { id: 'physical', name: 'Physical Wellbeing' }
];

const CONTENT_TYPES = [
  "All Types",
  "Service",
  "Workshop",
  "Event",
  "Retreat",
  "Wellness Guide",
  "Wellness Webinar",
  "Video",
  "Podcast",
  "Article"
];

const SEED_WELLNESS_RESOURCES = [
  {
    id: 'jel-1to1',
    title: "1:1 Nutrition & Lifestyle Support with Jel",
    type: "Service",
    topic: "Gut & Hormone Health",
    subcategory: "gut-hormone",
    expert: "Jel · Budding Minds",
    time: "1:1 Consultations",
    featured: true,
    image: "/jel.jpg",
    tags: ["Partner Offer", "Personalised", "1:1 Support"],
    description: "Tailored 1:1 nutritional therapy and nervous system support exploring root causes of gut, hormone, and fatigue symptoms."
  },
  {
    id: 'budding-minds-workshops',
    title: "Workshops & Corporate Wellbeing for Teams",
    type: "Workshop",
    topic: "Stress Management & Team Energy",
    subcategory: "nervous-system",
    expert: "Jel · Budding Minds",
    time: "Interactive Sessions",
    featured: true,
    image: "/jel.jpg",
    tags: ["Corporate", "Workplace", "Teams"],
    description: "Interactive wellbeing workshops covering gut health, hormonal transitions, stress regulation, and sustainable habits."
  },
  {
    id: 'burnout-guide',
    title: "Navigating Burnout: A Practical Guide for IP Professionals",
    type: "Wellness Webinar",
    topic: "Mental Health & Burnout",
    subcategory: "mental-health",
    expert: "Dr. Elena Rostova",
    time: "45 min watch",
    featured: true,
    image: "/resourceimg2.jpg",
    tags: ["Webinar", "Mental Health"],
    description: "Explore the psychological and somatic cues of workplace burnout with practical recovery toolkits."
  },
  {
    id: 'cf6448e8-c620-4df9-baf4-16bbcca326d6',
    title: "The Mindful IP Practitioner: Sustaining Peak Cognitive Performance & Resilience",
    type: "Wellness Guide",
    topic: "Mental Wellbeing",
    subcategory: "mental-wellbeing",
    expert: "Dr. Claire Laurent",
    time: "20 min read",
    featured: true,
    image: "https://bepavczocyvaegkfxtvd.supabase.co/storage/v1/object/public/resources/wellbeing.jpg",
    tags: ["Wellness", "Mental Health", "Performance"],
    description: "Evidence-based strategies for preventing legal burnout and sustaining high-stakes cognitive clarity."
  },
  {
    id: 'budding-minds-events',
    title: "Budding Minds Sensory & Wellness Events",
    type: "Event",
    topic: "Nervous System Regulation",
    subcategory: "nervous-system",
    expert: "Jel · Budding Minds",
    time: "In-Person & Virtual",
    featured: false,
    image: "/jel.jpg",
    tags: ["Community", "Sensory", "Breathwork"],
    description: "Connecting education, nervous system resets, and somatic wellbeing through immersive sensory experiences."
  },
  {
    id: 'budding-minds-retreats',
    title: "International Women's Wellness Retreats",
    type: "Retreat",
    topic: "Holistic Rest & Nutrition",
    subcategory: "nutrition",
    expert: "Jel · Budding Minds",
    time: "Immersive Experiences",
    featured: false,
    image: "/jel.jpg",
    tags: ["Retreats", "Recharge", "International"],
    description: "All-inclusive international wellness retreats combining nourishing nutrition, movement, somatic practices, and relaxation."
  },
  {
    id: 'desk-yoga',
    title: "The 10-Minute Desk Yoga & Posture Routine",
    type: "Video",
    topic: "Physical Wellbeing",
    subcategory: "physical",
    expert: "Sarah Jenkins",
    time: "10 min watch",
    featured: false,
    image: "/resourceimg1.jpg",
    tags: ["Quick Reset", "Ergonomics"],
    description: "Gentle stretches and mobility exercises designed to relieve neck and back strain during long drafting sessions."
  },
  {
    id: 'client-boundaries',
    title: "Setting Boundaries with Demanding Clients",
    type: "Guide",
    topic: "Work-Life Balance",
    subcategory: "work-life",
    expert: "Marcus Thorne",
    time: "15 min read",
    featured: false,
    image: "/resourceimg3.jpg",
    tags: ["Career", "Boundaries"],
    description: "Scripts and mental frameworks for protecting personal time and managing client expectations without compromising reputation."
  }
];

export default function WellnessPage() {
  const [resources, setResources] = useState<any[]>(SEED_WELLNESS_RESOURCES);
  const [partnerBanner, setPartnerBanner] = useState<any>({
    is_active: true,
    partner_name: "Budding Minds",
    expert_name: "Jel",
    badge_text: "⭐ Featured Wellbeing Partner",
    specialty_badge: "Nutritional Therapy · Gut & Hormone Health",
    subheadline: "QUALIFIED NUTRITIONAL THERAPIST · POLYVAGAL & SOMATIC NERVOUS SYSTEM SUPPORT",
    description: "Budding Minds supports women with practical, personalized nutrition, gut health, hormone balance, stress management, and nervous system regulation. Taking a whole-person approach that looks beyond symptoms to make realistic, sustainable changes around demanding careers and life.",
    image_url: "/jel.jpg",
    features: [
      "1:1 Nutritional Therapy",
      "Gut & Microbiome Health",
      "Hormone & PMS Support",
      "Nervous System Somatics",
      "Corporate Workshops",
      "International Retreats"
    ],
    primary_button_text: "Explore Budding Minds Hub",
    primary_button_url: "/platform/resources/wellness/budding-minds",
    secondary_button_text: "Book 1:1 Discovery Call",
    secondary_button_url: "https://www.budding-minds.com/copy-of-services",
    instagram_handle: "@buddingminds__",
    instagram_url: "https://www.instagram.com/buddingminds__"
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSub, setActiveSub] = useState('all');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  // Fetch live from database
  useEffect(() => {
    async function loadWellness() {
      try {
        const [resQuery, bannerQuery] = await Promise.all([
          supabase
            .from('resources')
            .select('*')
            .eq('category', 'wellness')
            .order('created_at', { ascending: false }),
          supabase
            .from('wellness_partner_banner')
            .select('*')
            .eq('id', 'default')
            .maybeSingle()
        ]);

        if (bannerQuery.data) {
          setPartnerBanner(bannerQuery.data);
        }

        const { data, error } = resQuery;
        if (error) {
          console.error("Supabase fetch wellness error:", error);
          setResources(SEED_WELLNESS_RESOURCES);
        } else if (data && data.length > 0) {
          // Normalize DB columns to frontend format
          const formatted = data.map((item: any) => ({
            id: item.id,
            slug: item.slug,
            title: item.title,
            type: item.resource_type || item.type || "Wellness Guide",
            topic: item.subcategory ? item.subcategory.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()) : "General Wellbeing",
            subcategory: item.subcategory || "general",
            expert: item.author_name || "Budding Minds · Jel",
            expertRole: item.author_title || item.organization || "Wellness Specialist",
            time: item.read_time || item.duration || "15 min read",
            featured: Boolean(item.is_featured),
            image: item.cover_image_url || "/jel.jpg",
            tags: Array.isArray(item.tags) && item.tags.length > 0 ? item.tags : ["Wellness"],
            description: item.summary || item.description || (item.content ? item.content.slice(0, 180) + "..." : "")
          }));
          setResources(formatted);
        } else {
          setResources(SEED_WELLNESS_RESOURCES);
        }
      } catch (e) {
        console.error("Failed to load wellness:", e);
        setResources(SEED_WELLNESS_RESOURCES);
      } finally {
        setLoading(false);
      }
    }
    loadWellness();
  }, []);

  const filteredResources = resources.filter(res => {
    const matchesSearch = 
      (res.title && res.title.toLowerCase().includes(searchQuery.toLowerCase())) || 
      (res.topic && res.topic.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (res.expert && res.expert.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (res.description && res.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (res.tags && res.tags.some((t: string) => t.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesSub = activeSub === 'all' || res.subcategory === activeSub || (activeSub === 'mental-health' && res.subcategory === 'mental-wellbeing');
    const matchesType = typeFilter === 'All Types' || res.type === typeFilter;
    return matchesSearch && matchesSub && matchesType;
  });

  // Maximum 4 featured offerings
  const featuredOfferings = filteredResources.filter(r => r.featured).slice(0, 4);
  const regularResources = filteredResources.filter(r => !r.featured || !featuredOfferings.some(f => f.id === r.id));

  return (
    <div className="min-h-screen bg-[#f4f6f9] dark:bg-[#0a0a0f] text-slate-900 dark:text-white font-sans transition-colors duration-300 pb-20">
      
      {/* Top Banner */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#00d26a]/15 via-emerald-500/5 to-transparent pt-8 pb-14 border-b border-gray-200 dark:border-white/5">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          
          <div className="flex items-center justify-between gap-4 mb-6">
            <Link href="/platform/resources" className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-[#00d26a] font-bold text-sm transition-colors">
              <ArrowLeft size={16} />
              Back to Resources
            </Link>

            <Link 
              href="/platform/resources/wellness/budding-minds" 
              className="inline-flex items-center gap-2 bg-[#00d26a]/10 hover:bg-[#00d26a]/20 text-[#00d26a] px-3.5 py-1.5 rounded-full font-bold text-xs border border-[#00d26a]/20 transition-all shadow-sm"
            >
              <Sparkles size={13} /> Partner Hub: Budding Minds <ArrowRight size={13} />
            </Link>
          </div>

          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-[#00d26a]/10 dark:bg-[#00d26a]/20 text-[#00d26a] px-4 py-2 rounded-full font-black text-xs uppercase tracking-widest mb-4 border border-[#00d26a]/20 shadow-sm">
              <Sparkles size={14} /> Prioritize Your Whole-Person Peace
            </div>
            
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tight mb-4 leading-tight">
              Wellness & <span className="text-[#00d26a] bg-clip-text text-transparent bg-gradient-to-r from-[#00d26a] via-teal-400 to-[#20c997]">Wellbeing</span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 font-medium leading-relaxed max-w-2xl mx-auto">
              Curated evidence-based resources, nutritional therapy, hormone & gut health support, and nervous system regulation to help women thrive.
            </p>
          </div>

        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 pt-10">
        
        {/* Featured Partner Section: Dynamic from database */}
        {partnerBanner && partnerBanner.is_active !== false && (
          <div className="w-full bg-gradient-to-br from-white/90 via-white/70 to-emerald-50/40 dark:from-[#161622]/90 dark:via-[#13131c]/80 dark:to-emerald-950/20 backdrop-blur-2xl rounded-[2.5rem] md:rounded-[3rem] border border-gray-200 dark:border-white/10 p-6 sm:p-10 md:p-12 shadow-xl mb-14 relative overflow-hidden flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            <div className="absolute top-[-80px] left-[-80px] w-80 h-80 bg-[#00d26a]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-[-80px] right-[-80px] w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="w-40 h-40 sm:w-52 sm:h-52 md:w-60 md:h-60 rounded-full overflow-hidden shrink-0 border-4 border-white dark:border-[#2a2a38] shadow-2xl relative z-10 bg-emerald-500/10 flex items-center justify-center">
              <img 
                src={partnerBanner.image_url || "/jel.jpg"} 
                alt={partnerBanner.partner_name || "Wellbeing Partner"} 
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/jel.jpg"; }}
                className="w-full h-full object-cover object-top" 
              />
            </div>

            <div className="flex-1 text-center lg:text-left relative z-10">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-3">
                {partnerBanner.badge_text && (
                  <span className="inline-block bg-[#00d26a]/15 text-[#00d26a] font-black text-xs px-3.5 py-1 rounded-full border border-[#00d26a]/20">
                    {partnerBanner.badge_text}
                  </span>
                )}
                {partnerBanner.specialty_badge && (
                  <span className="inline-block bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold text-xs px-3 py-1 rounded-full border border-teal-500/20">
                    {partnerBanner.specialty_badge}
                  </span>
                )}
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-2">
                {partnerBanner.partner_name} {partnerBanner.expert_name && <span className="text-gray-400 font-normal">· with {partnerBanner.expert_name}</span>}
              </h2>
              
              {partnerBanner.subheadline && (
                <p className="text-xs sm:text-sm font-bold text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wider">
                  {partnerBanner.subheadline}
                </p>
              )}
              
              {partnerBanner.description && (
                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-medium leading-relaxed mb-6 max-w-2xl whitespace-pre-line">
                  {partnerBanner.description}
                </p>
              )}

              {Array.isArray(partnerBanner.features) && partnerBanner.features.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-8 max-w-xl mx-auto lg:mx-0 text-left">
                  {partnerBanner.features.map((item: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-1.5 text-xs font-bold text-gray-700 dark:text-gray-300">
                      <CheckCircle2 size={14} className="text-[#00d26a] shrink-0" />
                      <span className="truncate">{item}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                {partnerBanner.primary_button_text && (
                  <Link 
                    href={partnerBanner.primary_button_url || "/platform/resources/wellness/budding-minds"} 
                    className="bg-[#00d26a] hover:bg-[#00c060] text-white px-7 py-3.5 rounded-2xl font-black text-sm shadow-lg shadow-[#00d26a]/25 hover:shadow-xl hover:shadow-[#00d26a]/40 hover:-translate-y-0.5 transition-all inline-flex items-center gap-2"
                  >
                    {partnerBanner.primary_button_text} <ArrowRight size={16} />
                  </Link>
                )}
                {partnerBanner.secondary_button_text && (
                  <a 
                    href={partnerBanner.secondary_button_url || "https://www.budding-minds.com/copy-of-services"} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-white dark:bg-[#20202e] hover:bg-gray-100 dark:hover:bg-[#28283a] text-gray-900 dark:text-white px-6 py-3.5 rounded-2xl font-bold text-sm border border-gray-200 dark:border-white/10 transition-all inline-flex items-center gap-2 shadow-sm"
                  >
                    {partnerBanner.secondary_button_text} <ExternalLink size={15} className="text-[#00d26a]" />
                  </a>
                )}
                {partnerBanner.instagram_handle && (
                  <a 
                    href={partnerBanner.instagram_url || "https://www.instagram.com/buddingminds__"} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-pink-500 hover:text-pink-600 font-bold text-sm px-4 py-3.5 transition-colors inline-flex items-center gap-1.5"
                  >
                    <InstagramIcon size={16} /> {partnerBanner.instagram_handle}
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
          
          {/* Daily Check-in Module */}
          <div className="col-span-1 lg:col-span-2 bg-white/70 dark:bg-[#161622]/70 backdrop-blur-xl rounded-[2.5rem] border border-gray-200 dark:border-white/10 p-6 sm:p-8 shadow-sm flex flex-col justify-center">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">How are you feeling today?</h3>
              <span className="text-xs font-bold text-gray-400">Daily Pulse</span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-medium text-sm mb-6">Take 5 seconds to tune into your body and energy levels.</p>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {[
                { id: 'great', icon: Sun, label: 'Energised', color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-500/10', border: 'border-yellow-200 dark:border-yellow-500/20' },
                { id: 'good', icon: Smile, label: 'Balanced', color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-500/10', border: 'border-green-200 dark:border-green-500/20' },
                { id: 'tired', icon: Coffee, label: 'Fatigued', color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-600/10', border: 'border-amber-200 dark:border-amber-600/20' },
                { id: 'stressed', icon: Moon, label: 'Overwhelmed', color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-500/10', border: 'border-indigo-200 dark:border-indigo-500/20' },
              ].map(mood => (
                <button 
                  key={mood.id}
                  onClick={() => setSelectedMood(mood.id)}
                  className={`flex flex-col items-center justify-center p-5 sm:p-6 rounded-3xl border-2 transition-all duration-300 cursor-pointer ${
                    selectedMood === mood.id 
                      ? `${mood.border} ${mood.bg} shadow-lg transform -translate-y-1` 
                      : 'border-gray-100 dark:border-white/5 bg-white dark:bg-[#1e1e2c] hover:border-gray-200 dark:hover:border-white/10 hover:-translate-y-0.5'
                  }`}
                >
                  <mood.icon size={28} className={`${mood.color} mb-2.5`} />
                  <span className={`text-xs sm:text-sm font-bold ${selectedMood === mood.id ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                    {mood.label}
                  </span>
                </button>
              ))}
            </div>

            {selectedMood && (
              <div className="mt-5 p-4 rounded-2xl bg-[#00d26a]/10 border border-[#00d26a]/20 flex items-center justify-between text-xs font-bold text-gray-800 dark:text-white animate-fadeIn">
                <span>
                  {selectedMood === 'tired' || selectedMood === 'stressed' 
                    ? '💡 Check out Budding Minds nervous system tools and gut health advice to replenish depleted energy.' 
                    : '✨ Keep up the momentum with nourishing nutrition and balanced hydration today!'}
                </span>
                <Link href="/platform/resources/wellness/budding-minds" className="text-[#00d26a] underline ml-3 shrink-0">
                  Explore Guidance
                </Link>
              </div>
            )}
          </div>

          {/* Featured Audio Module */}
          <div className="col-span-1 bg-gradient-to-br from-[#00d26a] to-[#12b886] rounded-[2.5rem] p-6 sm:p-8 shadow-xl shadow-[#00d26a]/20 text-white relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-white/20 rounded-full blur-3xl pointer-events-none" />
            
            <div>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md mb-6">
                <Headphones size={24} className="text-white" />
              </div>
              <h3 className="text-2xl font-black mb-2 leading-tight">Daily Somatic Reset</h3>
              <p className="text-white/90 font-medium text-xs sm:text-sm">A 3-minute polyvagal breathing exercise for instant vagal nerve calming.</p>
            </div>
            
            <a 
              href="https://www.budding-minds.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full mt-8 bg-white text-[#00d26a] hover:bg-gray-50 py-3.5 rounded-2xl font-black flex items-center justify-center gap-2 transition-transform hover:scale-105 shadow-md text-sm"
            >
              <Play size={16} fill="currentColor" /> Listen / Learn More
            </a>
          </div>
          
        </div>

        {/* Explore Resources Section */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
          
          {/* Enhanced Filters Sidebar */}
          <div className="w-full lg:w-72 shrink-0">
            <div className="sticky top-20 bg-white/70 dark:bg-[#161622]/70 backdrop-blur-xl rounded-[2rem] p-6 shadow-sm border border-gray-200 dark:border-white/10 space-y-6">
              
              <div className="flex items-center justify-between">
                <h3 className="font-black text-gray-900 dark:text-white text-lg flex items-center gap-2">
                  <Filter className="text-[#00d26a]" size={18} /> Filters
                </h3>
                {(searchQuery || activeSub !== 'all' || typeFilter !== 'All Types') && (
                  <button 
                    onClick={() => { setSearchQuery(''); setActiveSub('all'); setTypeFilter('All Types'); }}
                    className="text-xs font-bold text-gray-400 hover:text-[#00d26a] cursor-pointer"
                  >
                    Reset
                  </button>
                )}
              </div>

              {/* Search Bar */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Search className="w-4 h-4 text-gray-400 group-focus-within:text-[#00d26a]" />
                </div>
                <input 
                  type="text" 
                  placeholder="Search topics, Jel, gut health..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white dark:bg-[#1e1e2c] border border-gray-200 dark:border-white/10 rounded-xl py-2.5 pl-10 pr-3 text-xs font-medium focus:ring-2 focus:ring-[#00d26a]/20 outline-none transition-all shadow-inner text-gray-900 dark:text-white"
                />
              </div>

              {/* Focus Areas */}
              <div>
                <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-wider mb-3">Focus Area</h4>
                <div className="flex flex-col gap-1.5">
                  {FOCUS_AREAS.map(sub => (
                    <button
                      key={sub.id}
                      onClick={() => setActiveSub(sub.id)}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        activeSub === sub.id
                          ? 'bg-[#00d26a] text-white shadow-md shadow-[#00d26a]/20'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
                      }`}
                    >
                      {sub.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content Type */}
              <div>
                <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-wider mb-3">Content Type</h4>
                <select 
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full bg-white dark:bg-[#1e1e2c] border border-gray-200 dark:border-white/10 rounded-xl py-2.5 px-3 text-xs font-bold text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-[#00d26a]/20 outline-none cursor-pointer"
                >
                  {CONTENT_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Partner Quick Link Box */}
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-500/20 text-center">
                <p className="text-xs font-black text-gray-900 dark:text-white mb-1">Budding Minds Portal</p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-3">Read complete bio, expertise & retreat details.</p>
                <Link 
                  href="/platform/resources/wellness/budding-minds" 
                  className="w-full bg-[#00d26a] text-white py-2 rounded-xl text-xs font-bold inline-flex items-center justify-center gap-1 shadow-sm hover:opacity-95"
                >
                  Visit Dedicated Hub <ArrowRight size={13} />
                </Link>
              </div>

            </div>
          </div>

          {/* Grid Area */}
          <div className="flex-1 min-w-0">
            
            {/* Top Featured Offerings Spotlight (Max 4 Items) */}
            {featuredOfferings.length > 0 && (
              <div className="mb-12">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                    <Heart className="text-pink-500" fill="currentColor" size={20} /> Featured Offerings
                  </h2>
                  <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1">
                    <Star size={11} className="fill-emerald-500" /> {featuredOfferings.length} Spotlighted Offerings
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {featuredOfferings.map(resource => (
                    <Link 
                      key={resource.id} 
                      href={`/platform/resources/wellness/${resource.id}`} 
                      className="group block relative rounded-[2.5rem] overflow-hidden aspect-[4/3] shadow-md hover:shadow-2xl hover:shadow-[#00d26a]/20 transition-all duration-500 border border-gray-200 dark:border-white/10"
                    >
                      <img 
                        src={resource.image} 
                        alt={resource.title} 
                        className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/60 to-transparent" />
                      
                      <div className="absolute top-5 left-5 right-5 flex items-center justify-between">
                        <span className="bg-black/50 backdrop-blur-md text-white text-xs font-black px-3.5 py-1.5 rounded-full border border-white/20 flex items-center gap-1.5">
                          <Star size={11} className="fill-amber-400 text-amber-400" /> {resource.type}
                        </span>
                        <div className="flex flex-wrap gap-1.5 justify-end">
                          {resource.tags && resource.tags.slice(0, 2).map((tag: string) => (
                            <span key={tag} className="bg-pink-500/80 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full border border-pink-500/30 shadow-md">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="absolute bottom-5 left-5 right-5">
                        <h3 className={`${
                          (resource.title || '').length > 60
                            ? 'text-base sm:text-lg'
                            : (resource.title || '').length > 40
                            ? 'text-lg sm:text-xl'
                            : 'text-xl sm:text-2xl'
                        } font-black text-white mb-2 leading-tight group-hover:text-[#00d26a] transition-colors line-clamp-2`}>
                          {resource.title}
                        </h3>
                        <div className="flex items-center justify-between text-xs text-white/90 font-medium">
                          <span className="bg-[#00d26a]/30 px-2.5 py-1 rounded-lg text-emerald-300 font-bold backdrop-blur-md">
                            {resource.topic}
                          </span>
                          <span className="font-bold flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-md">
                            <Clock size={11} /> {resource.time}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* All Resources Grid */}
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                All Resources & Offerings
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {regularResources.map(resource => (
                  <Link 
                    key={resource.id} 
                    href={`/platform/resources/wellness/${resource.id}`} 
                    className="group bg-white/70 dark:bg-[#161622]/70 backdrop-blur-xl p-6 rounded-[2rem] border border-gray-200 dark:border-white/10 hover:border-[#00d26a]/50 transition-all duration-300 hover:shadow-xl hover:shadow-[#00d26a]/10 flex flex-col justify-between h-full relative overflow-hidden"
                  >
                    <div>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex flex-wrap gap-1.5 items-center">
                          <span className="inline-block bg-[#00d26a]/10 text-[#00d26a] text-xs font-bold px-3 py-1 rounded-xl border border-[#00d26a]/20">
                            {resource.type}
                          </span>
                          {resource.tags && resource.tags.slice(0, 2).map((tag: string) => (
                            <span key={tag} className="inline-block bg-pink-50 dark:bg-pink-950/40 text-pink-500 text-[11px] font-bold px-2.5 py-1 rounded-xl border border-pink-100 dark:border-pink-500/20">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <span className="text-xs font-bold text-gray-500 bg-gray-100 dark:bg-white/5 px-2.5 py-1 rounded-lg">
                          {resource.time}
                        </span>
                      </div>

                      <h3 className="text-lg font-black text-gray-900 dark:text-white mb-2 leading-snug group-hover:text-[#00d26a] transition-colors">
                        {resource.title}
                      </h3>

                      {resource.description && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium line-clamp-2 mb-4 leading-relaxed">
                          {resource.description}
                        </p>
                      )}
                    </div>
                    
                    <div className="pt-4 flex items-center justify-between border-t border-gray-100 dark:border-white/5 mt-auto">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#00d26a] to-[#20c997] flex items-center justify-center text-white font-bold text-xs shadow-md shadow-[#00d26a]/20">
                          {resource.expert ? resource.expert.charAt(0) : "W"}
                        </div>
                        <span className="text-xs font-bold text-gray-600 dark:text-gray-300 truncate max-w-[150px]">{resource.expert}</span>
                      </div>
                      <span className="text-xs font-bold text-[#00d26a] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                        View Details <ArrowRight size={13} />
                      </span>
                    </div>
                  </Link>
                ))}

                {filteredResources.length === 0 && (
                  <div className="col-span-full py-16 text-center bg-white/70 dark:bg-[#161622]/70 backdrop-blur-xl rounded-[2.5rem] border border-dashed border-gray-200 dark:border-white/10">
                    <Activity size={44} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                    <h3 className="text-lg font-black text-gray-900 dark:text-white mb-1">No resources found</h3>
                    <p className="text-xs text-gray-500">Try adjusting your filters or search keywords.</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
