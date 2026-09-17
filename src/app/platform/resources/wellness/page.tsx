'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Heart, 
  Activity, 
  Play, 
  Pause,
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  ExternalLink, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  Headphones, 
  Volume2, 
  RefreshCw, 
  Calendar, 
  X, 
  Send, 
  ChevronRight, 
  Wind, 
  Sun, 
  Moon, 
  Coffee, 
  Zap,
  Check
} from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

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

const WELLNESS_STATS = [
  { label: 'Women Supported in Somatic Health', value: '1,200+' },
  { label: '4-7-8 Somatic Breathing Pacer', value: 'Live Reset' },
  { label: 'Clinical 1:1 Nutritional Therapy', value: 'With Jel' },
  { label: 'Evidence-Based Wellness Protocols', value: '25+ Guides' }
];

const WELLNESS_TABS = [
  { id: 'all', name: 'All Sanctuary Resources' },
  { id: 'breathing', name: '4-7-8 Somatic Pacer & Audio' },
  { id: 'partner', name: 'Budding Minds × Jel' },
  { id: 'protocols', name: 'Gut & Hormone Health' },
  { id: 'burnout', name: 'Nervous System & Burnout' }
];

const CONTENT_TYPES = [
  "All Types",
  "Service",
  "Workshop",
  "Wellness Guide",
  "Audio Reset",
  "Event",
  "Retreat"
];

const SEED_WELLNESS_RESOURCES = [
  {
    id: 'jel-1to1',
    title: "1:1 Nutritional Therapy & Lifestyle Consultations",
    type: "Service",
    topic: "Gut & Hormone Health",
    subcategory: "protocols",
    expert: "Jel · Budding Minds",
    expertRole: "Qualified Nutritional Therapist",
    time: "1:1 Sessions",
    featured: true,
    image: "/jel.jpg",
    tags: ["Personalised Protocol", "Gut Health", "Hormones"],
    description: "Deep-dive clinical nutritional therapy addressing root causes of chronic fatigue, bloating, and hormonal fluctuations around high-pressure careers."
  },
  {
    id: 'cf6448e8-c620-4df9-baf4-16bbcca326d6',
    title: "The Mindful IP Practitioner: Sustaining Peak Cognitive Performance & Resilience",
    type: "Wellness Guide",
    topic: "Mental Wellbeing",
    subcategory: "burnout",
    expert: "Dr. Claire Laurent",
    expertRole: "Neuroscience & Legal Performance Fellow",
    time: "20 min read",
    featured: true,
    image: "/wellbeing.jpg",
    tags: ["Cognitive Clarity", "Neuroscience", "Resilience"],
    description: "Evidence-based protocols to guard against cognitive depletion, sustain focus during patent prosecution, and recover from trial fatigue."
  },
  {
    id: 'burnout-guide',
    title: "Navigating Burnout: A Practical Somatic Guide for IP Attorneys",
    type: "Wellness Guide",
    topic: "Nervous System Regulation",
    subcategory: "burnout",
    expert: "Dr. Elena Rostova",
    expertRole: "Clinical Psychologist & Executive Coach",
    time: "15 min read",
    featured: true,
    image: "/resourceimg2.jpg",
    tags: ["Polyvagal", "Stress Recovery", "Boundaries"],
    description: "Recognize the physical warning signs of sympathetic overdrive, prevent adrenal exhaustion, and implement realistic nervous system resets."
  },
  {
    id: 'gut-brain-axis',
    title: "The Gut-Brain Axis: How High-Stakes Legal Stress Alters Digestion",
    type: "Wellness Guide",
    topic: "Nutritional Science",
    subcategory: "protocols",
    expert: "Jel · Budding Minds",
    expertRole: "Nutritional Therapist",
    time: "12 min read",
    featured: false,
    image: "/jel.jpg",
    tags: ["Microbiome", "Stress", "Vagus Nerve"],
    description: "Why litigation deadlines trigger bloating and brain fog, and the exact prebiotic and lifestyle adjustments needed to restore microbial balance."
  },
  {
    id: 'budding-minds-workshops',
    title: "Corporate Wellbeing & Somatics for Legal Teams",
    type: "Workshop",
    topic: "Team Resilience",
    subcategory: "partner",
    expert: "Jel · Budding Minds",
    expertRole: "Corporate Wellbeing Consultant",
    time: "Interactive Sessions",
    featured: false,
    image: "/resource3.jpg",
    tags: ["Workplace Culture", "Team Energy", "Retention"],
    description: "Customized workshops for law firms and in-house departments covering sustainable high performance, hormonal transitions, and collective calm."
  },
  {
    id: 'desk-yoga',
    title: "10-Minute Desk Posture & Ergonomic Spine Mobility Routine",
    type: "Wellness Guide",
    topic: "Physical Wellbeing",
    subcategory: "protocols",
    expert: "Sarah Jenkins",
    expertRole: "Ergonomics & Movement Specialist",
    time: "10 min practice",
    featured: false,
    image: "/resourceimg1.jpg",
    tags: ["Mobility", "Ergonomics", "Quick Reset"],
    description: "Gentle physical mobilizations designed to release tension in the cervical spine, shoulders, and hips during 10-hour drafting days."
  },
  {
    id: 'client-boundaries',
    title: "Protecting Mental Boundaries with Demanding Clients & Partners",
    type: "Wellness Guide",
    topic: "Work-Life Integration",
    subcategory: "burnout",
    expert: "Marcus Thorne",
    expertRole: "Partner & Wellness Steering Lead",
    time: "14 min read",
    featured: false,
    image: "/resourceimg2.jpg",
    tags: ["Firm Culture", "Boundaries", "Psychological Safety"],
    description: "Battle-tested scripts and communication frameworks to preserve non-working hours and avoid out-of-scope midnight emergencies without guilt."
  },
  {
    id: 'budding-minds-retreats',
    title: "International Women's Holistic Wellness Retreats",
    type: "Retreat",
    topic: "Deep Rejuvenation",
    subcategory: "partner",
    expert: "Jel · Budding Minds",
    expertRole: "Retreat Director",
    time: "Immersive Experiences",
    featured: false,
    image: "/jel.jpg",
    tags: ["Restoration", "Nutrition", "Sensory Immersion"],
    description: "All-inclusive wellness retreats combining tailored whole-food nutrition, somatic movement, breathwork, and Mediterranean nature immersion."
  }
];

const POLYVAGAL_STATES = [
  {
    id: 'ventral',
    name: 'Ventral Vagal',
    state: 'Calm, Connected & Clear',
    color: 'emerald',
    badge: 'Optimal State',
    icon: Sun,
    tip: 'Your nervous system is grounded. Perfect time for strategic thinking, partner negotiations, and creative drafting.',
    actionText: 'Reinforce with steady hydration and nutrient-dense fuel.'
  },
  {
    id: 'sympathetic',
    name: 'Sympathetic Overdrive',
    state: 'Racing, Anxious & Tight Shoulders',
    color: 'amber',
    badge: 'High Cortisol',
    icon: Zap,
    tip: 'Your body is in fight-or-flight mode. Heart rate is elevated and shallow chest breathing is reducing oxygen to prefrontal cortex.',
    actionText: 'Do 3 cycles of the 4-7-8 Somatic Pacer below + drink 16oz room-temperature water.'
  },
  {
    id: 'dorsal',
    name: 'Dorsal Vagal Shutdown',
    state: 'Brain Fog, Numb & Exhausted',
    color: 'indigo',
    badge: 'Depleted Energy',
    icon: Moon,
    tip: 'Your system is conserving energy after prolonged overload. You may feel unmotivated, sluggish, or disconnected.',
    actionText: 'Step away from blue screens for 8 minutes. Gently shake out limbs and step outside into natural daylight.'
  },
  {
    id: 'restorative',
    name: 'Restoration Mode',
    state: 'Unwinding & Ready to Replenish',
    color: 'teal',
    badge: 'Recovery Phase',
    icon: Coffee,
    tip: 'Time to down-regulate digestive and hormonal systems for cellular repair and restorative deep sleep.',
    actionText: 'Avoid late caffeine. Sip chamomile or magnesium glycinate and disconnect work email.'
  }
];

export default function WellnessPage() {
  const [resources, setResources] = useState<any[]>(SEED_WELLNESS_RESOURCES);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [selectedState, setSelectedState] = useState('sympathetic');

  // Interactive 4-7-8 Breathing Pacer State
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathCount, setBreathCount] = useState(4);
  const timerRef = useRef<any>(null);

  // Audio Player State
  const [activeAudioId, setActiveAudioId] = useState<string | null>(null);

  // Booking / Consultation Modal
  const [isConsultModalOpen, setIsConsultModalOpen] = useState(false);
  const [consultSubmitted, setConsultSubmitted] = useState(false);
  const [consultForm, setConsultForm] = useState({
    name: '',
    email: '',
    role: '',
    interest: '1:1 Nutritional Therapy (Gut & Hormones)',
    message: ''
  });

  // Breathwork loop
  useEffect(() => {
    if (!isBreathingActive) {
      setBreathPhase('inhale');
      setBreathCount(4);
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setBreathCount(prev => {
        if (prev > 1) return prev - 1;

        // Transition phases
        setBreathPhase(current => {
          if (current === 'inhale') {
            return 'hold';
          } else if (current === 'hold') {
            return 'exhale';
          } else {
            return 'inhale';
          }
        });

        // Set duration for next phase
        setBreathPhase(nextPhase => {
          // Handled above; determine next count
          return nextPhase;
        });

        return 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isBreathingActive]);

  // Sync count on phase transition
  useEffect(() => {
    if (!isBreathingActive) return;
    if (breathPhase === 'inhale') setBreathCount(4);
    if (breathPhase === 'hold') setBreathCount(7);
    if (breathPhase === 'exhale') setBreathCount(8);
  }, [breathPhase, isBreathingActive]);

  // Fetch live resources from database
  useEffect(() => {
    async function loadWellness() {
      try {
        const { data, error } = await supabase
          .from('resources')
          .select('*')
          .eq('category', 'wellness')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          const formatted = data.map((item: any) => ({
            id: item.id,
            title: item.title,
            type: item.resource_type || item.type || "Wellness Guide",
            topic: item.subcategory ? item.subcategory.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()) : "General Wellbeing",
            subcategory: item.subcategory || "protocols",
            expert: item.author_name || "Jel · Budding Minds",
            expertRole: item.author_title || item.organization || "Wellbeing Specialist",
            time: item.read_time || item.duration || "15 min read",
            featured: Boolean(item.is_featured),
            image: item.cover_image_url || "/wellbeing.jpg",
            tags: Array.isArray(item.tags) && item.tags.length > 0 ? item.tags : ["Wellness", "Health"],
            description: item.summary || item.description || "Evidence-based wellness guidance tailored for women in high-performance careers."
          }));

          const existingIds = new Set(formatted.map(f => f.id));
          const complementary = SEED_WELLNESS_RESOURCES.filter(r => !existingIds.has(r.id));
          setResources([...formatted, ...complementary]);
        } else {
          setResources(SEED_WELLNESS_RESOURCES);
        }
      } catch (e) {
        setResources(SEED_WELLNESS_RESOURCES);
      } finally {
        setLoading(false);
      }
    }
    loadWellness();
  }, []);

  const filteredResources = resources.filter(res => {
    const matchesSearch = 
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      res.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.expert.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (res.description && res.description.toLowerCase().includes(searchQuery.toLowerCase()));

    let matchesTab = true;
    if (activeTab === 'partner') matchesTab = res.expert.toLowerCase().includes('budding') || res.subcategory === 'partner';
    if (activeTab === 'protocols') matchesTab = res.subcategory === 'protocols' || res.topic.toLowerCase().includes('hormone') || res.topic.toLowerCase().includes('gut') || res.topic.toLowerCase().includes('nutrition');
    if (activeTab === 'burnout') matchesTab = res.subcategory === 'burnout' || res.topic.toLowerCase().includes('burnout') || res.topic.toLowerCase().includes('nervous');

    const matchesType = typeFilter === 'All Types' || res.type === typeFilter;
    return matchesSearch && matchesTab && matchesType;
  });

  const featuredOfferings = filteredResources.filter(r => r.featured).slice(0, 4);
  const regularResources = filteredResources.filter(r => !r.featured || !featuredOfferings.some(f => f.id === r.id));

  const handleConsultSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConsultSubmitted(true);
    setTimeout(() => {
      setConsultSubmitted(false);
      setIsConsultModalOpen(false);
      setConsultForm({
        name: '',
        email: '',
        role: '',
        interest: '1:1 Nutritional Therapy (Gut & Hormones)',
        message: ''
      });
    }, 2500);
  };

  const currentStateObj = POLYVAGAL_STATES.find(s => s.id === selectedState) || POLYVAGAL_STATES[0];

  return (
    <div className="min-h-screen bg-[#f8faf8] dark:bg-[#070b0e] text-gray-900 dark:text-white font-sans selection:bg-emerald-500/30 overflow-x-hidden transition-colors duration-300">
      
      {/* Sleek Sanctuary Hero Header */}
      <div className="relative w-full border-b border-emerald-950/10 dark:border-white/10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/15 via-teal-500/5 to-transparent dark:from-[#05261b]/60 dark:via-[#071310] dark:to-[#070b0e] z-0"></div>
        <div className="absolute -top-28 left-1/2 -translate-x-1/2 w-[700px] h-[340px] bg-emerald-500/20 dark:bg-emerald-600/15 rounded-full blur-[120px] pointer-events-none z-0"></div>
        
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-12 relative z-10 flex flex-col items-center text-center">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/25 text-emerald-800 dark:text-emerald-300 text-[11px] font-black uppercase tracking-wider mb-3 shadow-2xs">
            <Sparkles size={13} className="text-emerald-500" /> Whole-Person Resilience & Somatics
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight mb-3 text-gray-900 dark:text-white">
            Wellness & <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-[#00d26a] dark:from-emerald-400 dark:via-teal-300 dark:to-[#00d26a]">Wellbeing</span>
          </h1>
          
          <p className="text-xs sm:text-sm md:text-base font-medium text-gray-600 dark:text-white/70 max-w-2xl leading-relaxed mx-auto">
            Curated evidence-based nutritional therapy, somatic nervous system regulation, and gut-hormone protocols to help women excel in demanding intellectual property careers.
          </p>

          {/* Vitals Ribbon */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 w-full max-w-4xl mt-7">
            {WELLNESS_STATS.map((stat, idx) => (
              <div 
                key={idx} 
                className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-white/80 dark:bg-white/5 border border-emerald-100 dark:border-white/10 backdrop-blur-md shadow-2xs hover:border-emerald-300 dark:hover:border-emerald-500/40 transition-all"
              >
                <div className="text-lg sm:text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 to-teal-600 dark:from-emerald-300 dark:to-teal-300 mb-0.5">
                  {stat.value}
                </div>
                <div className="text-[10px] sm:text-xs font-bold text-gray-600 dark:text-white/65 text-center line-clamp-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Search & Content Selector */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 w-full max-w-xl mt-6">
            <div className="relative w-full flex items-center bg-white dark:bg-slate-900/90 border border-gray-200 dark:border-white/15 rounded-xl px-3.5 py-2 shadow-2xs transition-all focus-within:ring-2 focus-within:ring-emerald-500/25 focus-within:border-emerald-500">
              <Search size={15} className="text-gray-400 dark:text-white/40 mr-2.5 shrink-0" />
              <input 
                type="text" 
                placeholder="Search gut health, Jel, burnout, somatic resets..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm font-semibold text-gray-900 dark:text-white focus:outline-none placeholder-gray-400 dark:placeholder-white/40"
              />
            </div>
            
            <div className="relative w-full sm:w-48 shrink-0">
              <select 
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="appearance-none w-full bg-white dark:bg-slate-900/90 border border-gray-200 dark:border-white/15 rounded-xl px-3.5 py-2 pr-9 text-xs sm:text-sm font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/25 focus:border-emerald-500 cursor-pointer shadow-2xs transition-all"
              >
                {CONTENT_TYPES.map(type => (
                  <option key={type} value={type} className="dark:bg-gray-900">{type}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Navigation Category Tabs */}
          <div className="mt-5 flex items-center justify-center max-w-full overflow-x-auto no-scrollbar">
            <div className="inline-flex items-center gap-1.5 p-1 rounded-2xl bg-white/80 dark:bg-white/5 border border-emerald-100 dark:border-white/10 shadow-2xs backdrop-blur-md">
              {WELLNESS_TABS.map(tab => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3.5 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-bold tracking-tight transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 ${
                      isActive 
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xs font-black' 
                        : 'text-gray-600 dark:text-gray-300 hover:text-emerald-700 dark:hover:text-white hover:bg-emerald-50/80 dark:hover:bg-white/5'
                    }`}
                  >
                    {tab.name}
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* Main Content Body */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-12 sm:space-y-16">
        
        {/* SECTION 1: Editorial Luxury Residency - Budding Minds × Jel */}
        {(activeTab === 'all' || activeTab === 'partner') && (
          <div className="relative rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-white via-emerald-50/30 to-teal-50/20 dark:from-[#0b1418] dark:via-[#091114] dark:to-[#071912] border border-emerald-200/80 dark:border-emerald-500/25 p-6 sm:p-8 md:p-10 shadow-xl shadow-emerald-900/5 dark:shadow-emerald-950/20">
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
              
              {/* Photo of Jel with Clinician Badge */}
              <div className="relative shrink-0">
                <div className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-3xl overflow-hidden border-4 border-white dark:border-emerald-900/40 shadow-2xl bg-emerald-100 flex items-center justify-center">
                  <img 
                    src="/jel.jpg" 
                    alt="Jel · Budding Minds" 
                    className="w-full h-full object-cover object-top" 
                  />
                </div>
                
                {/* Clean Logo Emblem Badge */}
                <div className="absolute -bottom-3 -right-3 w-16 h-16 rounded-2xl bg-[#142e14] border-2 border-emerald-400 p-2.5 shadow-xl flex items-center justify-center">
                  <img src="/budding-minds-logo.png" alt="Budding Minds Logo" className="w-full h-full object-contain" />
                </div>
              </div>

              {/* Text & Clinical Offerings */}
              <div className="flex-1 text-center lg:text-left">
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-2.5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 text-xs font-black uppercase tracking-wider border border-emerald-500/30">
                    <ShieldCheck size={13} className="text-emerald-600" /> Featured Clinical Wellbeing Partner
                  </span>
                  <span className="text-xs font-bold text-teal-700 dark:text-teal-300 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20">
                    Nutritional Therapy & Polyvagal Somatics
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-2">
                  Budding Minds <span className="text-gray-400 dark:text-gray-500 font-normal text-xl sm:text-2xl">· with Jel</span>
                </h2>

                <p className="text-xs sm:text-sm text-gray-600 dark:text-white/75 font-medium leading-relaxed max-w-2xl mb-6">
                  Demanding IP deadlines, intense litigation, and client pressures take a direct toll on gut motility, hormonal balance, and nervous system reserves. Jel takes a root-cause, whole-person approach to help women attorneys cultivate sustained vitality, digestive ease, and somatic calm.
                </p>

                {/* 4 Clinical Pillars */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-7 text-left max-w-2xl mx-auto lg:mx-0">
                  {[
                    { label: "1:1 Gut & Nutrition", desc: "Personalized metabolic care" },
                    { label: "Hormone Harmony", desc: "PMS, energy & perimenopause" },
                    { label: "Nervous System", desc: "Vagus nerve & polyvagal" },
                    { label: "Corporate Sessions", desc: "Workshops & team retreats" }
                  ].map((pillar, i) => (
                    <div key={i} className="p-3 rounded-2xl bg-white/70 dark:bg-white/5 border border-emerald-100 dark:border-white/10 backdrop-blur-sm">
                      <div className="flex items-center gap-1.5 text-xs font-black text-emerald-800 dark:text-emerald-300 mb-0.5">
                        <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                        <span className="truncate">{pillar.label}</span>
                      </div>
                      <div className="text-[10px] font-medium text-gray-500 dark:text-white/50 truncate">
                        {pillar.desc}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Call-to-action buttons */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                  <button
                    type="button"
                    onClick={() => setIsConsultModalOpen(true)}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-teal-600 hover:to-emerald-600 text-white font-black text-xs sm:text-sm tracking-tight shadow-lg shadow-emerald-600/25 transition-all hover:scale-[1.02] cursor-pointer inline-flex items-center gap-2"
                  >
                    <Calendar size={15} /> Book 1:1 Discovery Call
                  </button>

                  <Link
                    href="/platform/resources/wellness/budding-minds"
                    className="px-5 py-3 rounded-xl bg-white dark:bg-white/10 hover:bg-emerald-50 dark:hover:bg-white/15 text-gray-900 dark:text-white font-bold text-xs sm:text-sm border border-gray-200 dark:border-white/15 transition-all inline-flex items-center gap-2 shadow-2xs cursor-pointer"
                  >
                    Explore Budding Minds Hub <ArrowRight size={14} className="text-emerald-500" />
                  </Link>

                  <a 
                    href="https://www.instagram.com/buddingminds__" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-4 py-3 rounded-xl text-pink-600 dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-950/20 font-bold text-xs transition-colors inline-flex items-center gap-1.5"
                  >
                    <InstagramIcon size={15} /> @buddingminds__
                  </a>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* SECTION 2: The Interactive 4-7-8 Somatic Pacer & Audio Deck (THE COOL FACTOR) */}
        {(activeTab === 'all' || activeTab === 'breathing') && (
          <div className="w-full space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-emerald-950/10 dark:border-white/10 pb-4">
              <div>
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 text-xs font-black uppercase tracking-wider mb-1">
                  <Wind size={16} /> Somatic Reset Pacer
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                  Instant Nervous System Regulation
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-white/70 font-medium">
                  Use the live 4-7-8 breathing circle or quick audio sessions to stimulate the vagus nerve and downshift sympathetic stress in real-time.
                </p>
              </div>

              <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/25 self-start sm:self-auto">
                Polyvagal Vagus Nerve Stimulator
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* Interactive 4-7-8 Breathing Circle */}
              <div className="lg:col-span-7 rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-emerald-900 via-[#06241a] to-[#041611] text-white shadow-2xl relative overflow-hidden flex flex-col items-center justify-between min-h-[380px]">
                <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/15 rounded-full blur-[80px] pointer-events-none"></div>

                <div className="w-full flex items-center justify-between relative z-10">
                  <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-white/10 text-emerald-300 border border-white/15">
                    4-7-8 Polyvagal Pacer
                  </span>
                  <span className="text-xs font-semibold text-white/70">
                    {isBreathingActive ? 'Pacer Running' : 'Ready to Start'}
                  </span>
                </div>

                {/* Animated Breathing Orb */}
                <div className="relative my-6 flex flex-col items-center justify-center">
                  <div 
                    className={`w-40 h-40 sm:w-48 sm:h-48 rounded-full flex flex-col items-center justify-center text-center transition-all duration-1000 border-2 ${
                      isBreathingActive 
                        ? breathPhase === 'inhale' 
                          ? 'scale-110 bg-emerald-500/30 border-emerald-400 shadow-[0_0_60px_rgba(16,185,129,0.5)]'
                          : breathPhase === 'hold'
                          ? 'scale-110 bg-teal-500/30 border-teal-300 shadow-[0_0_70px_rgba(20,184,166,0.6)]'
                          : 'scale-90 bg-emerald-950/50 border-emerald-600/50 shadow-none'
                        : 'scale-100 bg-white/5 border-white/20'
                    }`}
                  >
                    <div className="text-xs font-black uppercase tracking-widest text-emerald-300 mb-1">
                      {isBreathingActive 
                        ? breathPhase === 'inhale' ? 'Inhale Deeply' : breathPhase === 'hold' ? 'Hold Breath' : 'Exhale Slowly' 
                        : 'Tap to Begin'}
                    </div>
                    <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                      {isBreathingActive ? `${breathCount}s` : '4-7-8'}
                    </div>
                  </div>

                  <div className="text-[11px] font-medium text-white/60 mt-3 text-center max-w-xs">
                    {breathPhase === 'inhale' && 'Expand your diaphragm fully through the nose.'}
                    {breathPhase === 'hold' && 'Allow oxygen to diffuse through bloodstream calmly.'}
                    {breathPhase === 'exhale' && 'Release slowly through parted lips with a soft whoosh.'}
                  </div>
                </div>

                <div className="w-full flex items-center justify-between gap-4 relative z-10 pt-4 border-t border-white/10">
                  <div className="text-xs text-white/80 font-medium">
                    Recommended: 4 consecutive cycles (approx. 76 seconds)
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsBreathingActive(!isBreathingActive)}
                    className="px-5 py-2.5 rounded-xl bg-white text-emerald-950 hover:bg-emerald-50 font-black text-xs sm:text-sm tracking-tight shadow-md transition-all cursor-pointer flex items-center gap-2"
                  >
                    {isBreathingActive ? <Pause size={15} /> : <Play size={15} />}
                    {isBreathingActive ? 'Pause Pacer' : 'Start 60s Reset'}
                  </button>
                </div>
              </div>

              {/* Quick Somatic Audio Deck */}
              <div className="lg:col-span-5 rounded-3xl p-6 bg-white dark:bg-[#0c1317] border border-emerald-100 dark:border-white/10 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                      Guided Audio Library
                    </span>
                    <span className="text-xs font-bold text-gray-500 dark:text-white/50 flex items-center gap-1">
                      <Headphones size={13} /> 3 Protocols
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-gray-900 dark:text-white mb-2">
                    Micro Somatic Soundbites
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-white/65 font-medium mb-4">
                    Fast audio resets engineered for attorney desk use before arguments, client calls, or after intense cross-examinations.
                  </p>

                  <div className="space-y-3">
                    {[
                      { id: 'audio-vagus', title: 'Daily Vagus Nerve Reset', time: '3 min', expert: 'Jel · Budding Minds' },
                      { id: 'audio-courtroom', title: 'Pre-Hearing Courtroom Grounding', time: '5 min', expert: 'Somatic Mindfulness' },
                      { id: 'audio-evening', title: 'End-of-Day Cognitive Detachment', time: '4 min', expert: 'Sleep & Nervous System' }
                    ].map(track => {
                      const isPlaying = activeAudioId === track.id;
                      return (
                        <div 
                          key={track.id}
                          className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                            isPlaying 
                              ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-800 dark:text-emerald-200' 
                              : 'bg-gray-50 dark:bg-white/5 border-gray-200/70 dark:border-white/10 text-gray-800 dark:text-white hover:border-emerald-300'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <button
                              type="button"
                              onClick={() => setActiveAudioId(isPlaying ? null : track.id)}
                              className="w-9 h-9 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white flex items-center justify-center shrink-0 shadow-sm cursor-pointer"
                            >
                              {isPlaying ? <Pause size={15} /> : <Play size={15} className="ml-0.5" />}
                            </button>
                            <div className="min-w-0">
                              <div className="text-xs font-black truncate">{track.title}</div>
                              <div className="text-[10px] text-gray-500 dark:text-white/50">{track.expert} • {track.time}</div>
                            </div>
                          </div>

                          {isPlaying && (
                            <div className="flex items-center gap-1 shrink-0">
                              <span className="w-1 h-3 bg-emerald-500 animate-pulse"></span>
                              <span className="w-1 h-5 bg-emerald-500 animate-pulse delay-75"></span>
                              <span className="w-1 h-2 bg-emerald-500 animate-pulse delay-150"></span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-white/5 mt-4 flex items-center justify-between text-[11px] font-bold text-gray-500 dark:text-white/50">
                  <span>Binaural 432Hz Alpha Frequencies</span>
                  <span className="text-emerald-600 dark:text-emerald-400">Earphones Recommended</span>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* SECTION 3: Somatic State Navigator (Polyvagal Nervous System Check-in) */}
        <div className="w-full rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#0c1317] border border-emerald-100 dark:border-white/10 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 mb-1 inline-block">
                Polyvagal Energy Tuning
              </span>
              <h3 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white">
                What state is your nervous system in right now?
              </h3>
            </div>
            <div className="text-xs font-bold text-gray-500 dark:text-white/50">
              Select your current physiological state:
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
            {POLYVAGAL_STATES.map(st => {
              const isSelected = selectedState === st.id;
              const Icon = st.icon;
              return (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setSelectedState(st.id)}
                  className={`p-4 rounded-2xl text-left border-2 transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected 
                      ? 'border-emerald-500 bg-emerald-500/10 dark:bg-emerald-950/30 shadow-md' 
                      : 'border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/5 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Icon size={20} className={isSelected ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400'} />
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-white dark:bg-white/10 text-gray-700 dark:text-gray-300">
                      {st.badge}
                    </span>
                  </div>
                  <div>
                    <div className="text-xs font-black text-gray-900 dark:text-white">{st.name}</div>
                    <div className="text-[11px] text-gray-500 dark:text-white/60 line-clamp-1">{st.state}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Dynamic Prescription Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-xs font-black text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                <Sparkles size={14} className="text-emerald-500" /> Somatic Insight & Micro-Protocol:
              </div>
              <p className="text-xs text-gray-700 dark:text-white/80 font-medium">
                {currentStateObj.tip}
              </p>
              <p className="text-xs text-emerald-700 dark:text-emerald-300 font-bold">
                👉 Recommended Action: {currentStateObj.actionText}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsConsultModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold tracking-tight shrink-0 shadow-sm transition-all cursor-pointer self-start sm:self-auto"
            >
              Get Tailored 1:1 Advice
            </button>
          </div>
        </div>

        {/* SECTION 4: Curated Evidence-Based Library Grid */}
        <div className="w-full space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-emerald-950/10 dark:border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 text-xs font-black uppercase tracking-wider mb-1">
                <ShieldCheck size={16} /> Clinical & Somatic Protocols
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                Curated Sanctuary Resources & Guides
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-white/70 font-medium">
                Deep-dive playbooks, gut-brain protocols, and boundary templates for sustained legal performance.
              </p>
            </div>

            <div className="text-xs font-bold text-gray-500 dark:text-white/50">
              Showing {filteredResources.length} offerings
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredResources.map((resource) => (
              <Link 
                key={resource.id} 
                href={`/platform/resources/wellness/${resource.id}`} 
                className="group relative rounded-3xl overflow-hidden bg-white dark:bg-[#0c1317] border border-emerald-100 dark:border-white/10 hover:border-emerald-400 dark:hover:border-emerald-500/50 shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col hover:-translate-y-1"
              >
                {resource.image && (
                  <div className="relative overflow-hidden bg-slate-900 w-full h-44">
                    <img 
                      src={resource.image} 
                      alt={resource.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-gray-900/20 to-transparent"></div>
                    
                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] font-black uppercase tracking-wider text-white bg-black/60 backdrop-blur-md border border-white/20 px-2.5 py-0.5 rounded-full">
                        {resource.type}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3">
                      <span className="text-[10px] font-bold text-emerald-200 bg-emerald-950/80 backdrop-blur-md px-2 py-0.5 rounded-md border border-emerald-500/30">
                        {resource.topic}
                      </span>
                    </div>
                  </div>
                )}
                
                <div className="p-5 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="text-base font-black tracking-tight leading-snug mb-2 text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
                      {resource.title}
                    </h3>

                    {resource.description && (
                      <p className="text-xs text-gray-600 dark:text-white/65 font-medium line-clamp-2 mb-4 leading-relaxed">
                        {resource.description}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-xs font-semibold text-gray-500 dark:text-white/50">
                    <span className="truncate max-w-[150px] font-bold text-gray-700 dark:text-gray-300">
                      {resource.expert}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded-md text-gray-600 dark:text-white/60 shrink-0">
                      {resource.time}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* SECTION 5: Retreats & Corporate Residency Banner */}
        <div className="relative rounded-[2.5rem] overflow-hidden p-8 sm:p-10 md:p-12 border border-emerald-500/30 shadow-2xl bg-gradient-to-r from-[#06241a] via-[#093526] to-[#041a12] text-white">
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-emerald-400/20 rounded-full blur-[100px] pointer-events-none"></div>
          
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-emerald-300 text-[11px] font-black uppercase tracking-wider mb-3">
              <Sparkles size={12} className="text-amber-400" /> Corporate Law Firm Wellbeing & Retreats
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight mb-3">
              Restore Your Firm's Health & High-Performance Retention
            </h2>

            <p className="text-xs sm:text-sm md:text-base text-white/80 font-medium leading-relaxed mb-6">
              Partner with Budding Minds for customized partner and associate wellness retreats, nutritional diagnostic testing, and team polyvagal masterclasses that reduce attrition and promote sustainable executive clarity.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setConsultForm(prev => ({ ...prev, interest: 'Corporate Workshops & Team Retreats' }));
                  setIsConsultModalOpen(true);
                }}
                className="px-5 py-2.5 rounded-xl bg-white text-emerald-950 hover:bg-emerald-50 font-black text-xs sm:text-sm tracking-tight shadow-lg transition-all hover:scale-[1.02] cursor-pointer"
              >
                Inquire for Law Firms & Teams
              </button>

              <Link
                href="/platform/resources/wellness/budding-minds"
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 text-white font-black text-xs sm:text-sm tracking-tight transition-all cursor-pointer inline-flex items-center gap-1.5"
              >
                View Retreat Itineraries <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>

      </div>

      {/* ================= MODAL: Book 1:1 Consultation / Discovery Call ================= */}
      {isConsultModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-[#0c1317] border border-emerald-100 dark:border-white/15 p-6 sm:p-8 shadow-2xl">
            <button 
              onClick={() => setIsConsultModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-500 dark:text-white/70 hover:text-gray-900 dark:hover:text-white cursor-pointer"
            >
              <X size={16} />
            </button>

            {consultSubmitted ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 flex items-center justify-center mx-auto">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white">Discovery Call Requested!</h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-white/70 max-w-sm mx-auto">
                  Thank you! Jel from Budding Minds will review your intake inquiry and reach out with private booking calendar availability within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleConsultSubmit} className="space-y-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20 mb-2 inline-block">
                    Budding Minds × WIPA
                  </span>
                  <h3 className="text-xl font-black text-gray-900 dark:text-white">
                    Book 1:1 Wellbeing Discovery Call
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-white/50">
                    Complimentary 15-minute consultation to discuss your health history, gut symptoms, or nervous system regulation goals.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                      Full Name
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Attorney Maya Lin"
                      value={consultForm.name}
                      onChange={e => setConsultForm({ ...consultForm, name: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/15 text-xs sm:text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                      Corporate / Professional Email
                    </label>
                    <input 
                      type="email" 
                      required
                      placeholder="e.g. maya@lawfirm.com"
                      value={consultForm.email}
                      onChange={e => setConsultForm({ ...consultForm, email: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/15 text-xs sm:text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                      Area of Focus
                    </label>
                    <select
                      value={consultForm.interest}
                      onChange={e => setConsultForm({ ...consultForm, interest: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/15 text-xs sm:text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                    >
                      <option value="1:1 Nutritional Therapy (Gut & Hormones)">1:1 Nutritional Therapy (Gut & Hormones)</option>
                      <option value="Somatic Nervous System & Burnout Protocol">Somatic Nervous System & Burnout Protocol</option>
                      <option value="Corporate Workshops & Team Retreats">Corporate Workshops & Team Retreats</option>
                      <option value="International Wellness Retreats">International Wellness Retreats</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                      Current Symptoms or What You Wish to Address
                    </label>
                    <textarea 
                      rows={3}
                      required
                      placeholder="Briefly describe what you're experiencing (e.g. chronic bloating under trial stress, perimenopause brain fog, morning fatigue)..."
                      value={consultForm.message}
                      onChange={e => setConsultForm({ ...consultForm, message: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/15 text-xs sm:text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-teal-600 hover:to-emerald-600 text-white text-xs sm:text-sm font-black tracking-tight shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <Send size={15} /> Request Discovery Call with Jel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
