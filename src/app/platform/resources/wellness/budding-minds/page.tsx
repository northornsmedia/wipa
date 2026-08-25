// @ts-nocheck
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  ExternalLink, 
  Heart, 
  Sparkles, 
  CheckCircle2, 
  Calendar, 
  Globe, 
  Compass, 
  Activity, 
  Users, 
  BookOpen, 
  ShieldCheck, 
  Zap, 
  Smile, 
  Coffee, 
  Moon, 
  Sun, 
  Feather, 
  BrainCircuit, 
  Award, 
  ArrowRight, 
  Plane, 
  Building2, 
  Sparkle
} from 'lucide-react';

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

const EXPERTISE_AREAS = [
  {
    id: 'nutritional-therapy',
    title: 'Nutritional Therapy',
    subtitle: 'Personalised, Root-Cause Nutrition',
    icon: Sparkles,
    color: 'from-emerald-500 to-teal-500',
    bgLight: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    description: 'Personalised nutritional therapy support that considers diet, lifestyle, symptoms, health history and individual goals. Rather than taking a one-size-fits-all approach, recommendations are tailored to the individual and designed to be practical and sustainable.',
    keyPoints: [
      'Comprehensive health history & symptom analysis',
      'Evidence-based nutritional protocols tailored to your goals',
      'Realistic meal structures that fit busy work schedules',
      'Optional functional testing & targeted supplement guidance'
    ]
  },
  {
    id: 'gut-health',
    title: 'Gut Health',
    subtitle: 'Digestive Harmony & Microbiome',
    icon: Activity,
    color: 'from-teal-500 to-cyan-500',
    bgLight: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20',
    description: 'Support for women experiencing digestive concerns and those looking to improve their overall gut health. This may include exploring areas such as digestion, food choices, meal patterns, stress, lifestyle and the relationship between the gut and nervous system.',
    keyPoints: [
      'Relief for bloating, discomfort, and irregular digestion',
      'Exploring gut-brain & gut-nervous system connections',
      'Gentle food reintroductions and microbiome nourishment',
      'Practical dietary tweaks to enhance daily energy and digestion'
    ]
  },
  {
    id: 'hormone-health',
    title: "Hormone & Women's Health",
    subtitle: 'Support Across Every Life Stage',
    icon: Heart,
    color: 'from-pink-500 to-rose-500',
    bgLight: 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20',
    description: "Nutrition and lifestyle support for women across different life stages, including support around PMS, menstrual health, perimenopause and menopause. The focus may include hormone balance, energy, stress, sleep, nutrition, lifestyle and overall wellbeing, with guidance tailored to the individual.",
    keyPoints: [
      'PMS, cycle syncing, and menstrual wellbeing',
      'Perimenopause and menopause nutritional support',
      'Sustained energy and hormonal mood balance',
      'Targeted nutrition to protect bone, heart, and metabolic health'
    ]
  },
  {
    id: 'stress-management',
    title: 'Stress Management',
    subtitle: 'Protecting Body & Mind from Burnout',
    icon: ShieldCheck,
    color: 'from-amber-500 to-orange-500',
    bgLight: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    description: 'Stress can have a significant impact on digestion, hormones, sleep, energy and overall wellbeing. Budding Minds supports women in identifying areas of stress within their lives and developing realistic strategies that can help them better manage their physical and emotional wellbeing.',
    keyPoints: [
      'Identifying subtle physical & emotional stress triggers',
      'Mitigating the impact of stress on cortisol and digestion',
      'Sustainable boundaries for demanding professional careers',
      'Restorative evening routines for deep, restful sleep'
    ]
  },
  {
    id: 'nervous-system',
    title: 'Nervous System Support',
    subtitle: 'Polyvagal & Somatic Regulation',
    icon: BrainCircuit,
    color: 'from-indigo-500 to-purple-500',
    bgLight: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
    description: 'Jel incorporates nervous system education and practical somatic practices into her wider wellbeing approach where appropriate. This can help women better understand their stress responses, recognise patterns within their nervous system and develop tools that support greater regulation and resilience.',
    keyPoints: [
      'Polyvagal-informed nervous system education',
      'Recognising fight/flight, freeze, and shut-down responses',
      'Quick in-the-moment somatic grounding tools for high-pressure days',
      'Building lasting nervous system resilience and emotional capacity'
    ]
  },
  {
    id: 'practical-nutrition',
    title: 'Practical Lifestyle Guidance',
    subtitle: 'Achievable Habits for Busy Lives',
    icon: Feather,
    color: 'from-emerald-500 to-green-500',
    bgLight: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
    description: 'Wellbeing does not need to involve completely changing your life. Budding Minds focuses on realistic nutrition and lifestyle strategies that can fit around demanding careers, family life, travel and other responsibilities. The aim is to help women build habits that feel achievable rather than overwhelming.',
    keyPoints: [
      'No restrictive or unrealistic diet rules',
      'Strategies designed for travel, dining out, and long workdays',
      'Small, progressive shifts with compounding positive results',
      'Empowering women to build long-term trust in their bodies'
    ]
  }
];

const OFFERINGS = [
  {
    id: '1to1-support',
    title: '1:1 Nutrition & Lifestyle Support',
    category: 'Personalised Care',
    badge: '1:1 Consultations',
    image: '/jel.jpg',
    description: "Budding Minds offers personalised 1:1 support for women who would like a deeper understanding of their health and wellbeing. Sessions explore the individual's current concerns, nutrition, lifestyle, stress, health history and personal goals. Where appropriate, clients receive personalised nutrition and lifestyle recommendations designed around their individual circumstances.",
    highlights: [
      'In-depth initial consultation and health timeline review',
      'Personalised nutrition, gut & hormone health plan',
      'Nervous system regulation & somatic coaching',
      'Ongoing check-ins and direct support between sessions'
    ],
    pricing: 'Personalised Packages · Discovery Call Available',
    url: 'https://www.budding-minds.com/copy-of-services',
    ctaText: 'Explore 1:1 Support & Book Call'
  },
  {
    id: 'workshops-corporate',
    title: 'Workshops & Corporate Wellbeing',
    category: 'Workplace Wellness',
    badge: 'Corporate & Teams',
    image: '/resourceimg1.jpg',
    description: "Budding Minds delivers educational and interactive wellbeing workshops covering gut health, hormone health, PMS, perimenopause, menopause, women's health, stress management, nervous system regulation, workplace wellbeing, and sustainable healthy habits. Workshops can be tailored to the needs of organisations, professional communities and groups.",
    highlights: [
      'Tailored corporate workshops for law firms & IP organisations',
      "Interactive sessions on women's hormonal health in the workplace",
      'Practical nervous system tools for high-stress corporate environments',
      'Actionable nutrition & energy management strategies for teams'
    ],
    pricing: 'Bespoke Corporate Programmes',
    url: 'https://www.budding-minds.com/copy-of-services',
    ctaText: 'Enquire for Corporate Workshops'
  },
  {
    id: 'wellness-events',
    title: 'Budding Minds Wellness Events',
    category: 'In-Person & Community',
    badge: 'Sensory & Interactive',
    image: '/resourceimg2.jpg',
    description: "Budding Minds creates wellbeing events designed to bring together education, connection and different approaches to supporting physical and emotional wellbeing. Events may include talks, workshops, practical wellbeing sessions and collaborations with other practitioners.",
    highlights: [
      'Sensory-rich experiences combining sound, breath, and movement',
      'Collaborations with renowned holistic health practitioners',
      'Nourishing, gut-friendly catering and curated wellness toolkits',
      'Intimate spaces to disconnect from devices and build community'
    ],
    pricing: 'Ticketed Events · Special Offers for WIPA',
    url: 'https://www.budding-minds.com/specialoffer-service-with-jel',
    ctaText: 'View Upcoming Events'
  },
  {
    id: 'international-retreats',
    title: "International Women's Retreats",
    category: 'Immersive Experiences',
    badge: 'Worldwide Retreats',
    image: '/resourceimg3.jpg',
    description: "Budding Minds also hosts international women's wellness retreats combining nutrition, wellbeing, relaxation, education and connection. Retreat experiences may include nutritional support, workshops, movement, wellbeing practices, activities and opportunities to step away from everyday pressures.",
    highlights: [
      'Beautiful international destinations curated for deep restorative rest',
      'Daily nourishing, chef-prepared anti-inflammatory cuisine',
      'Gentle movement, nervous system resets, and somatic workshops',
      'A sanctuary to recharge away from relentless career demands'
    ],
    pricing: 'All-Inclusive Retreat Packages',
    url: 'https://www.budding-minds.com/s-projects-basic-1',
    ctaText: 'Explore Upcoming Retreats'
  }
];

const WORKSHOP_TOPICS = [
  'Gut Health & Digestive Resilience',
  'Hormone Health & Energy Optimization',
  'PMS, Perimenopause & Menopause Support',
  "Women's Health in High-Performance Workplaces",
  'Stress Management & Burnout Prevention',
  'Nervous System Regulation & Polyvagal Tools',
  'Nutrition & Lifestyle for Busy Professionals',
  'Workplace Wellbeing & Team Energy',
  'Sustainable Healthy Habits that Stick'
];

export default function BuddingMindsPage() {
  return (
    <div className="min-h-screen bg-[#f4f6f9] dark:bg-[#0a0a0f] text-slate-900 dark:text-white font-sans transition-colors duration-300 pb-24">
      
      {/* Top Header & Navigation */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#00d26a]/15 via-emerald-500/5 to-transparent pt-8 pb-16 border-b border-gray-200 dark:border-white/5">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          
          <div className="flex items-center justify-between gap-4 mb-8">
            <Link 
              href="/platform/resources/wellness" 
              className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-[#00d26a] font-bold text-sm transition-colors bg-white/70 dark:bg-white/5 px-4 py-2 rounded-xl backdrop-blur-md border border-gray-200 dark:border-white/10 shadow-sm"
            >
              <ArrowLeft size={16} /> Back to Wellness Hub
            </Link>

            <div className="flex items-center gap-3">
              <a 
                href="https://www.instagram.com/buddingminds__" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-md hover:opacity-90 transition-all"
              >
                <InstagramIcon size={15} /> @buddingminds__
              </a>
              <a 
                href="https://www.budding-minds.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-2 bg-white/80 dark:bg-white/10 hover:bg-white text-gray-800 dark:text-white font-bold text-xs px-4 py-2 rounded-xl border border-gray-200 dark:border-white/15 transition-all shadow-sm"
              >
                <Globe size={15} className="text-[#00d26a]" /> budding-minds.com
              </a>
            </div>
          </div>

          {/* Hero Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-4">
            
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 bg-[#00d26a]/15 text-[#00d26a] px-4 py-2 rounded-full font-black text-xs uppercase tracking-widest mb-6 border border-[#00d26a]/20 shadow-sm">
                <Sparkles size={14} /> Official WIPA Wellbeing Partner
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white tracking-tight leading-[1.1] mb-6">
                Budding Minds <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d26a] via-teal-400 to-[#20c997]">
                  Whole-Person Wellbeing for Women
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 font-medium leading-relaxed mb-8 max-w-2xl">
                Budding Minds supports women with their nutrition, gut health, hormone health, stress management, nervous system regulation and overall wellbeing.
              </p>

              <div className="bg-white/80 dark:bg-[#151520]/80 backdrop-blur-xl p-6 rounded-3xl border border-gray-200 dark:border-white/10 shadow-sm mb-8">
                <h3 className="font-black text-gray-900 dark:text-white text-base mb-2 flex items-center gap-2">
                  <Compass size={18} className="text-[#00d26a]" /> The Budding Minds Approach
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                  The approach looks beyond symptoms alone and considers the wider picture, including nutrition, lifestyle, stress, the nervous system, sleep, movement and the many factors that can influence how someone feels physically and emotionally. Support is practical, personalised and designed to help women better understand their bodies and make realistic, sustainable changes that fit around their everyday lives.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <a 
                  href="https://www.budding-minds.com/copy-of-services" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-[#00d26a] hover:bg-[#00c060] text-white px-7 py-3.5 rounded-2xl font-black shadow-lg shadow-[#00d26a]/25 hover:shadow-xl hover:shadow-[#00d26a]/40 hover:-translate-y-0.5 transition-all inline-flex items-center gap-2"
                >
                  Explore 1:1 Support & Services <ExternalLink size={17} />
                </a>
                <a 
                  href="https://www.budding-minds.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white dark:bg-[#1e1e2d] hover:bg-gray-100 dark:hover:bg-[#28283c] text-gray-900 dark:text-white px-7 py-3.5 rounded-2xl font-black border border-gray-200 dark:border-white/10 transition-all inline-flex items-center gap-2 shadow-sm"
                >
                  Visit Official Website <Globe size={17} className="text-[#00d26a]" />
                </a>
              </div>
            </div>

            {/* Meet Jel Card */}
            <div className="lg:col-span-5">
              <div className="relative bg-gradient-to-br from-white/90 to-white/60 dark:from-[#181824]/90 dark:to-[#12121c]/60 backdrop-blur-2xl rounded-[3rem] p-8 border border-gray-200/80 dark:border-white/10 shadow-2xl overflow-hidden group">
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#00d26a]/15 rounded-full blur-3xl pointer-events-none" />
                
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-6">
                    <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden border-4 border-white dark:border-[#2b2b3a] shadow-xl relative z-10">
                      <img src="/jel.jpg" alt="Jel · Budding Minds" className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="absolute -bottom-2 bg-gradient-to-r from-[#00d26a] to-teal-500 text-white font-black text-[11px] px-3.5 py-1 rounded-full uppercase tracking-wider shadow-md z-20">
                      Nutritional Therapist
                    </div>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mb-1">Meet Jel</h2>
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-4">Founder, Budding Minds</p>

                  <div className="bg-emerald-50 dark:bg-[#00d26a]/10 text-[#00d26a] border border-emerald-100 dark:border-emerald-500/20 text-xs font-black px-4 py-2 rounded-xl mb-5 flex items-center gap-2">
                    <Award size={16} /> Qualified Nutritional Therapist
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium mb-6 text-left">
                    Jel is a qualified Nutritional Therapist specialising in gut and hormone health, with additional training in nervous system support and polyvagal-informed approaches.
                  </p>

                  <div className="border-t border-gray-100 dark:border-white/5 pt-5 text-left w-full space-y-2.5 text-xs text-gray-600 dark:text-gray-300 font-medium">
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 size={16} className="text-[#00d26a] shrink-0 mt-0.5" />
                      <span>Gut & Hormone Health Specialist</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 size={16} className="text-[#00d26a] shrink-0 mt-0.5" />
                      <span>Nervous System & Polyvagal-Informed Training</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 size={16} className="text-[#00d26a] shrink-0 mt-0.5" />
                      <span>Workshops, Wellness Events & International Retreats</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-5 border-t border-gray-100 dark:border-white/5 w-full flex items-center justify-between">
                    <a 
                      href="https://www.instagram.com/buddingminds__" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-xs font-bold text-pink-500 hover:text-pink-600 flex items-center gap-1.5"
                    >
                      <InstagramIcon size={15} /> Follow on Instagram
                    </a>
                    <a 
                      href="https://www.budding-minds.com/copy-of-services" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-xs font-bold text-[#00d26a] hover:underline flex items-center gap-1"
                    >
                      Book Session <ArrowRight size={14} />
                    </a>
                  </div>

                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 pt-16">
        
        {/* SECTION 1: Areas of Expertise */}
        <div className="mb-24">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 bg-[#00d26a]/10 text-[#00d26a] px-4 py-1.5 rounded-full font-black text-xs uppercase tracking-widest mb-3">
              <Zap size={14} /> Core Specialisations
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight mb-4">
              Areas of Expertise
            </h2>
            <p className="text-gray-600 dark:text-gray-300 font-medium text-base sm:text-lg">
              Combining clinical nutritional therapy with polyvagal-informed somatic nervous system tools to address the root drivers of fatigue, gut issues, and stress.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {EXPERTISE_AREAS.map((area) => {
              const Icon = area.icon;
              return (
                <div 
                  key={area.id}
                  className="bg-white/80 dark:bg-[#151520]/80 backdrop-blur-xl rounded-[2.5rem] p-8 border border-gray-200 dark:border-white/10 shadow-sm hover:shadow-xl hover:border-[#00d26a]/40 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${area.color} flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform`}>
                        <Icon size={26} />
                      </div>
                      <span className={`text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full border ${area.bgLight}`}>
                        {area.subtitle}
                      </span>
                    </div>

                    <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3 group-hover:text-[#00d26a] transition-colors">
                      {area.title}
                    </h3>

                    <p className="text-sm text-gray-600 dark:text-gray-300 font-medium leading-relaxed mb-6">
                      {area.description}
                    </p>
                  </div>

                  <div className="border-t border-gray-100 dark:border-white/5 pt-5 space-y-2">
                    {area.keyPoints.map((point, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-gray-700 dark:text-gray-300 font-medium">
                        <CheckCircle2 size={14} className="text-[#00d26a] shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 2: Offerings & Services */}
        <div className="mb-24">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 bg-[#00d26a]/10 text-[#00d26a] px-4 py-1.5 rounded-full font-black text-xs uppercase tracking-widest mb-3">
              <Sparkle size={14} /> Tailored Support
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight mb-4">
              Budding Minds Offerings
            </h2>
            <p className="text-gray-600 dark:text-gray-300 font-medium text-base sm:text-lg">
              From 1:1 bespoke nutritional protocols and corporate workshops to immersive sensory events and international retreats.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {OFFERINGS.map((offering) => (
              <div 
                key={offering.id}
                className="bg-white/80 dark:bg-[#151520]/80 backdrop-blur-xl rounded-[3rem] p-8 sm:p-10 border border-gray-200 dark:border-white/10 shadow-sm hover:shadow-2xl hover:border-[#00d26a]/40 transition-all duration-500 flex flex-col justify-between"
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                    <span className="bg-[#00d26a]/10 text-[#00d26a] font-black text-xs px-3.5 py-1.5 rounded-full border border-[#00d26a]/20">
                      {offering.badge}
                    </span>
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-white/5 px-3 py-1.5 rounded-full">
                      {offering.category}
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mb-4 leading-tight">
                    {offering.title}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-300 font-medium leading-relaxed mb-6 text-sm sm:text-base">
                    {offering.description}
                  </p>

                  <div className="bg-gray-50 dark:bg-[#1a1a26] p-6 rounded-2xl border border-gray-100 dark:border-white/5 mb-8">
                    <h4 className="text-xs font-black uppercase tracking-wider text-gray-400 dark:text-gray-400 mb-4">Key Features & Inclusions</h4>
                    <div className="space-y-3">
                      {offering.highlights.map((h, i) => (
                        <div key={i} className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300 font-medium">
                          <CheckCircle2 size={18} className="text-[#00d26a] shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs font-bold text-gray-500 dark:text-gray-400">
                    {offering.pricing}
                  </div>
                  <a 
                    href={offering.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto bg-[#00d26a] hover:bg-[#00c060] text-white px-6 py-3.5 rounded-2xl font-black text-sm shadow-md shadow-[#00d26a]/20 hover:shadow-lg hover:shadow-[#00d26a]/30 transition-all inline-flex items-center justify-center gap-2"
                  >
                    {offering.ctaText} <ExternalLink size={16} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 3: Workshops Topics Showcase */}
        <div className="mb-24 bg-gradient-to-br from-emerald-600 via-teal-700 to-[#00d26a] text-white rounded-[3rem] p-8 sm:p-14 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full font-black text-xs uppercase tracking-widest mb-6">
              <Building2 size={14} /> Corporate & Community Programmes
            </div>

            <h2 className="text-3xl sm:text-5xl font-black mb-6 leading-tight">
              Workshops for Organisations & Teams
            </h2>

            <p className="text-white/90 text-base sm:text-lg font-medium leading-relaxed mb-10 max-w-3xl">
              Budding Minds delivers educational and interactive wellbeing workshops tailored to the needs of organisations, law firms, professional communities and groups.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-10">
              {WORKSHOP_TOPICS.map((topic, index) => (
                <div key={index} className="bg-white/15 backdrop-blur-md p-4 rounded-2xl border border-white/20 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white/25 flex items-center justify-center text-white shrink-0 font-black text-xs">
                    {index + 1}
                  </div>
                  <span className="font-bold text-sm text-white">{topic}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <a 
                href="https://www.budding-minds.com/copy-of-services" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 rounded-2xl font-black text-sm shadow-xl transition-all inline-flex items-center gap-2"
              >
                Book a Corporate Workshop <ArrowRight size={17} className="text-[#00d26a]" />
              </a>
              <a 
                href="https://www.budding-minds.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-8 py-4 rounded-2xl font-black text-sm border border-white/30 transition-all inline-flex items-center gap-2"
              >
                Explore All Programmes
              </a>
            </div>
          </div>
        </div>

        {/* SECTION 4: Direct Links & Social Directory */}
        <div className="bg-white/80 dark:bg-[#151520]/80 backdrop-blur-xl rounded-[3rem] p-8 sm:p-12 border border-gray-200 dark:border-white/10 shadow-sm">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h3 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mb-2">
              Connect with Budding Minds
            </h3>
            <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">
              Direct access to all official Budding Minds resources, bookings, and communities.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <a 
              href="https://www.budding-minds.com/copy-of-services" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group p-6 rounded-2xl bg-gray-50 dark:bg-[#1d1d2b] border border-gray-200 dark:border-white/5 hover:border-[#00d26a]/50 hover:bg-emerald-50/50 dark:hover:bg-[#00d26a]/10 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#00d26a]/10 text-[#00d26a] flex items-center justify-center mb-4">
                  <Sparkles size={20} />
                </div>
                <h4 className="font-black text-gray-900 dark:text-white text-base mb-1 group-hover:text-[#00d26a] transition-colors">1:1 Support</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Bespoke nutrition & lifestyle guidance with Jel.</p>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-200/60 dark:border-white/5 text-xs font-bold text-[#00d26a] flex items-center gap-1">
                Book Consultation <ExternalLink size={13} />
              </div>
            </a>

            <a 
              href="https://www.budding-minds.com/s-projects-basic-1" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group p-6 rounded-2xl bg-gray-50 dark:bg-[#1d1d2b] border border-gray-200 dark:border-white/5 hover:border-teal-500/50 hover:bg-teal-50/50 dark:hover:bg-teal-500/10 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-500 flex items-center justify-center mb-4">
                  <Plane size={20} />
                </div>
                <h4 className="font-black text-gray-900 dark:text-white text-base mb-1 group-hover:text-teal-500 transition-colors">International Retreats</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Nourishing wellness retreats across the globe.</p>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-200/60 dark:border-white/5 text-xs font-bold text-teal-500 flex items-center gap-1">
                Explore Retreats <ExternalLink size={13} />
              </div>
            </a>

            <a 
              href="https://www.budding-minds.com/specialoffer-service-with-jel" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group p-6 rounded-2xl bg-gray-50 dark:bg-[#1d1d2b] border border-gray-200 dark:border-white/5 hover:border-pink-500/50 hover:bg-pink-50/50 dark:hover:bg-pink-500/10 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-500 flex items-center justify-center mb-4">
                  <Calendar size={20} />
                </div>
                <h4 className="font-black text-gray-900 dark:text-white text-base mb-1 group-hover:text-pink-500 transition-colors">Wellness Events</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Sensory events and interactive workshops.</p>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-200/60 dark:border-white/5 text-xs font-bold text-pink-500 flex items-center gap-1">
                View Event Dates <ExternalLink size={13} />
              </div>
            </a>

            <a 
              href="https://www.instagram.com/buddingminds__" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group p-6 rounded-2xl bg-gray-50 dark:bg-[#1d1d2b] border border-gray-200 dark:border-white/5 hover:border-purple-500/50 hover:bg-purple-50/50 dark:hover:bg-purple-500/10 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center mb-4">
                  <InstagramIcon size={20} />
                </div>
                <h4 className="font-black text-gray-900 dark:text-white text-base mb-1 group-hover:text-purple-500 transition-colors">Instagram Community</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Daily gut, hormone, and nervous system tips.</p>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-200/60 dark:border-white/5 text-xs font-bold text-purple-500 flex items-center gap-1">
                @buddingminds__ <ExternalLink size={13} />
              </div>
            </a>
          </div>
        </div>

      </div>

    </div>
  );
}
