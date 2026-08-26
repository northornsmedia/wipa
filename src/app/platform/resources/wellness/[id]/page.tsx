// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  ExternalLink, 
  Heart, 
  Clock, 
  Star, 
  MapPin, 
  CheckCircle2, 
  Globe, 
  Sparkles, 
  ShieldCheck, 
  Users, 
  Calendar, 
  Plane, 
  Building2, 
  Award, 
  ArrowRight, 
  BookOpen,
  Loader2,
  FileText
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

const DETAILS_DB: Record<string, any> = {
  'jel-1to1': {
    title: "1:1 Nutrition & Lifestyle Support",
    type: "Service",
    expert: "Jel · Budding Minds",
    expertRole: "Qualified Nutritional Therapist · Gut, Hormone & Nervous System Specialist",
    price: "Personalised 1:1 Packages · Discovery Call Available",
    image: "/jel.jpg",
    partnerHubUrl: "/platform/resources/wellness/budding-minds",
    description: "Budding Minds offers personalised 1:1 support for women who would like a deeper understanding of their health and wellbeing. Sessions explore the individual's current concerns, nutrition, lifestyle, stress, health history and personal goals. Where appropriate, clients receive personalised nutrition and lifestyle recommendations designed around their individual circumstances.",
    includes: [
      "Initial in-depth consultation and comprehensive health timeline analysis",
      "Personalised nutrition, gut & hormone health protocol tailored to your lifestyle",
      "Polyvagal-informed somatic exercises for daily nervous system regulation",
      "Targeted supplement advice and functional testing guidance if indicated",
      "Scheduled follow-up consultations to track progress and refine your plan",
      "Direct messaging support between sessions for guidance and accountability"
    ],
    areasOfFocus: [
      "Nutritional Therapy (Tailored, sustainable dietary changes)",
      "Gut Health (Digestion, food patterns, microbiome support)",
      "Hormone & Women's Health (PMS, menstrual wellbeing, perimenopause, menopause)",
      "Stress Management (Cortisol balance, sleep, burnout recovery)",
      "Nervous System Support (Polyvagal somatics, emotional resilience)"
    ],
    linkUrl: "https://www.budding-minds.com/copy-of-services",
    linkText: "Book Your 1:1 Consultation on Budding Minds",
    tags: ["Partner Offer", "1:1 Support", "Gut Health", "Hormones", "Nervous System"]
  },
  'budding-minds-workshops': {
    title: "Workshops & Corporate Wellbeing for Teams",
    type: "Workshop",
    expert: "Jel · Budding Minds",
    expertRole: "Qualified Nutritional Therapist & Workplace Wellbeing Consultant",
    price: "Bespoke Corporate & Team Programmes",
    image: "/jel.jpg",
    partnerHubUrl: "/platform/resources/wellness/budding-minds",
    description: "Budding Minds delivers educational and interactive wellbeing workshops covering gut health, hormone health, PMS, perimenopause, menopause, women's health, stress management, nervous system regulation, workplace wellbeing, and sustainable healthy habits. Workshops can be tailored to the needs of organisations, professional communities and groups.",
    includes: [
      "Customised interactive workshops for law firms, IP organisations & corporate teams",
      "Dedicated focus on women's hormonal transitions in high-performance workplaces",
      "Actionable nervous system tools for high-pressure deadlines and stress management",
      "Practical nutrition and energy strategies that fit demanding professional schedules",
      "Interactive Q&A and practical habit-building toolkits for participants",
      "Post-workshop actionable summaries and executive wellbeing guides"
    ],
    areasOfFocus: [
      "Gut Health & Digestive Resilience",
      "Hormone Health & Energy Optimization",
      "PMS, Perimenopause & Menopause Support in the Workplace",
      "Stress Management & Burnout Prevention",
      "Nervous System Regulation & Polyvagal Tools",
      "Workplace Wellbeing & Team Vitality"
    ],
    linkUrl: "https://www.budding-minds.com/copy-of-services",
    linkText: "Enquire for Corporate Workshops",
    tags: ["Corporate", "Workplace Wellbeing", "Workshops", "Women's Health"]
  },
  'budding-minds-events': {
    title: "Budding Minds Sensory & Wellness Events",
    type: "Event",
    expert: "Jel · Budding Minds",
    expertRole: "Qualified Nutritional Therapist & Somatic Practitioner",
    price: "Ticketed Events · Special Offers for WIPA",
    image: "/jel.jpg",
    partnerHubUrl: "/platform/resources/wellness/budding-minds",
    description: "Budding Minds creates wellbeing events designed to bring together education, connection and different approaches to supporting physical and emotional wellbeing. Events may include talks, workshops, practical wellbeing sessions and collaborations with other practitioners.",
    includes: [
      "Immersive, sensory-rich spaces blending education, movement, and sound",
      "Collaborative wellness experiences with expert holistic practitioners",
      "Nourishing, chef-prepared gut-friendly culinary offerings",
      "Hands-on somatic practices for deep nervous system calming",
      "Curated take-home wellness toolkits and habit resources",
      "Meaningful connection with a supportive community of like-minded women"
    ],
    areasOfFocus: [
      "Sensory Wellbeing & Somatic Grounding",
      "Holistic Gut & Hormone Education",
      "Vagus Nerve & Nervous System Resets",
      "Community Connection & Stress Relief"
    ],
    linkUrl: "https://www.budding-minds.com",
    linkText: "View Upcoming Wellness Events",
    tags: ["Sensory Events", "In-Person", "Community", "Somatic"]
  },
  'budding-minds-retreats': {
    title: "International Women's Wellness Retreats",
    type: "Retreat",
    expert: "Jel · Budding Minds",
    expertRole: "Qualified Nutritional Therapist & Retreat Host",
    price: "All-Inclusive Immersive Packages",
    image: "/jel.jpg",
    partnerHubUrl: "/platform/resources/wellness/budding-minds",
    description: "Budding Minds also hosts international women's wellness retreats combining nutrition, wellbeing, relaxation, education and connection. Retreat experiences may include nutritional support, workshops, movement, wellbeing practices, activities and opportunities to step away from everyday pressures.",
    includes: [
      "Handpicked international retreat sanctuaries designed for complete restoration",
      "Daily chef-prepared, nutrient-dense anti-inflammatory meals",
      "Personalised nutritional insights and intimate group wellness workshops",
      "Gentle movement, yoga, breathwork, and nervous system resets",
      "Mindful activities and peaceful spaces to disconnect from career demands",
      "Deep camaraderie and connection with fellow professional women"
    ],
    areasOfFocus: [
      "Deep Rest & Nervous System Recharge",
      "Anti-Inflammatory Nutritional Support",
      "Somatic Practices & Restorative Movement",
      "Stepping Away from Everyday Career Pressures"
    ],
    linkUrl: "https://www.budding-minds.com",
    linkText: "Explore Upcoming International Retreats",
    tags: ["Retreats", "International", "Nourishment", "Restoration"]
  },
  'burnout-guide': {
    title: "Navigating Burnout: A Practical Guide for IP Professionals",
    type: "Wellness Webinar",
    expert: "Dr. Elena Rostova",
    expertRole: "Clinical Psychologist & Wellbeing Consultant",
    price: "Included with WIPA Membership",
    image: "/resourceimg2.jpg",
    description: "In this comprehensive session, Dr. Elena Rostova explores the unique stressors faced by intellectual property professionals. We delve into identifying early signs of burnout, nervous system deregulation, and practical techniques to manage high-pressure deadlines.",
    includes: [
      "45-minute video presentation and slides",
      "Downloadable burnout prevention toolkit and self-assessment checklist",
      "Actionable stress management strategies for patent and legal deadlines",
      "Guidance on recognizing cognitive fatigue and establishing boundaries"
    ],
    areasOfFocus: [
      "Mental Health & Burnout Prevention",
      "Work-Life Integration for IP Counsel",
      "Cognitive Fatigue Management"
    ],
    linkUrl: "https://www.budding-minds.com",
    linkText: "Watch Webinar Recording",
    tags: ["Mental Health", "Burnout", "Webinar"]
  },
  'desk-yoga': {
    title: "The 10-Minute Desk Yoga Routine",
    type: "Video",
    expert: "Sarah Jenkins",
    expertRole: "Movement Specialist & Ergonomics Coach",
    price: "Free Resource",
    image: "/resourceimg1.jpg",
    description: "Designed specifically for desk workers, this quick routine releases tension in the neck, shoulders, and lower back without needing workout gear or leaving your workspace.",
    includes: [
      "10-minute guided video routine",
      "Postural alignment tips for long computer hours",
      "Micro-movement strategies throughout the workday"
    ],
    areasOfFocus: [
      "Physical Wellbeing",
      "Desk Ergonomics",
      "Daily Mobility"
    ],
    linkUrl: "https://www.budding-minds.com",
    linkText: "Start Movement Session",
    tags: ["Quick Reset", "Physical", "Ergonomics"]
  },
  'client-boundaries': {
    title: "Setting Boundaries with Demanding Clients",
    type: "Guide",
    expert: "Marcus Thorne",
    expertRole: "Executive Career & Boundaries Coach",
    price: "Free Guide",
    image: "/resourceimg3.jpg",
    description: "Scripts and mental frameworks for protecting personal time and managing client expectations without compromising reputation or quality of service.",
    includes: [
      "Word-for-word email and phone templates for challenging conversations",
      "Boundary-setting algorithms for out-of-hours emergencies",
      "Techniques for setting client expectations from engagement day one"
    ],
    areasOfFocus: [
      "Work-Life Balance",
      "Professional Communication",
      "Stress Reduction"
    ],
    linkUrl: "https://www.budding-minds.com",
    linkText: "Read Complete Guide",
    tags: ["Guide", "Work-Life Balance", "Career"]
  }
};

// Aliases for backwards compatibility
DETAILS_DB['budding-minds-1to1'] = DETAILS_DB['jel-1to1'];
DETAILS_DB['jel-group'] = DETAILS_DB['budding-minds-workshops'];
DETAILS_DB['jel-events'] = DETAILS_DB['budding-minds-events'];

export default function WellnessDetailRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadItem() {
      try {
        // Query by id OR slug
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
        
        let query = supabase.from('resources').select('*');
        if (isUUID) {
          query = query.eq('id', id);
        } else {
          query = query.or(`slug.eq.${id},id.eq.${id}`);
        }

        const { data: dbItem, error } = await query.maybeSingle();

        if (dbItem) {
          setData({
            title: dbItem.title,
            type: dbItem.resource_type || dbItem.type || "Wellness Offering",
            expert: dbItem.author_name || "Budding Minds · Jel",
            expertRole: dbItem.author_title || dbItem.organization || "Wellness Specialist",
            price: "Included / Special Rates Available",
            image: dbItem.cover_image_url || "/jel.jpg",
            partnerHubUrl: "/platform/resources/wellness/budding-minds",
            description: dbItem.description || dbItem.content || dbItem.summary,
            content: dbItem.content || dbItem.description || dbItem.summary,
            includes: [
              "Comprehensive consultation and evidence-based guidance",
              "Personalized wellbeing strategies tailored to your lifestyle",
              "Practical daily habits and actionable takeaway resources",
              "Direct expert support and follow-up guidance"
            ],
            areasOfFocus: [
              dbItem.subcategory ? dbItem.subcategory.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()) : "Whole-Person Wellness",
              "Evidence-Based Health Optimization",
              "Stress Reduction & Resilience"
            ],
            linkUrl: dbItem.external_url || dbItem.url || "https://www.budding-minds.com",
            linkText: dbItem.external_url ? "Book or Access Offering" : "Explore Wellness Offering",
            tags: Array.isArray(dbItem.tags) && dbItem.tags.length > 0 ? dbItem.tags : ["Wellness", "Wellbeing"]
          });
        } else if (DETAILS_DB[id]) {
          setData(DETAILS_DB[id]);
        } else {
          setData(DETAILS_DB['jel-1to1']);
        }
      } catch (e) {
        console.error("Error loading wellness details:", e);
        setData(DETAILS_DB[id] || DETAILS_DB['jel-1to1']);
      } finally {
        setLoading(false);
      }
    }
    loadItem();
  }, [id]);

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-[#f4f6f9] dark:bg-[#0a0a0f] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#00d26a]" size={36} />
      </div>
    );
  }

  const isBuddingMinds = data.expert && data.expert.includes('Budding Minds');

  return (
    <div className="min-h-screen bg-[#f4f6f9] dark:bg-[#0a0a0f] text-slate-900 dark:text-white font-sans transition-colors duration-300 pb-24">
      
      {/* Top Navigation */}
      <div className="bg-white/70 dark:bg-[#161622]/70 backdrop-blur-xl border-b border-gray-200 dark:border-white/10 py-5">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 flex items-center justify-between">
          <Link 
            href="/platform/resources/wellness" 
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-[#00d26a] font-bold text-sm transition-colors"
          >
            <ArrowLeft size={16} /> Back to Wellness & Wellbeing
          </Link>

          {isBuddingMinds && (
            <Link 
              href="/platform/resources/wellness/budding-minds" 
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00d26a] bg-[#00d26a]/10 hover:bg-[#00d26a]/20 px-3.5 py-1.5 rounded-full transition-all"
            >
              <Sparkles size={13} /> Budding Minds Partner Hub
            </Link>
          )}
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 md:px-8 pt-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Main Detail Area */}
          <div className="lg:col-span-8">
            
            {/* Header / Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="bg-[#00d26a]/10 text-[#00d26a] font-black text-xs px-3.5 py-1.5 rounded-full border border-[#00d26a]/20">
                {data.type}
              </span>
              {data.tags && data.tags.map((tag: string) => (
                <span key={tag} className="bg-pink-500/10 text-pink-500 font-bold text-xs px-3 py-1.5 rounded-full border border-pink-500/20">
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 dark:text-white leading-tight mb-6">
              {data.title}
            </h1>

            {/* Expert Info Card */}
            <div className="flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-white/80 dark:bg-[#161622]/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 mb-8 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-[#00d26a]">
                  <img src={data.image} alt={data.expert} className="w-full h-full object-cover object-top" />
                </div>
                <div>
                  <h3 className="font-black text-gray-900 dark:text-white text-base">{data.expert}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{data.expertRole}</p>
                </div>
              </div>

              {isBuddingMinds && (
                <a 
                  href="https://www.instagram.com/buddingminds__" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-pink-500 hover:text-pink-600 bg-pink-50 dark:bg-pink-950/30 px-3 py-1.5 rounded-full border border-pink-200 dark:border-pink-500/20"
                >
                  <InstagramIcon size={14} /> @buddingminds__
                </a>
              )}
            </div>

            {/* Overview / Description */}
            <div className="bg-white/70 dark:bg-[#161622]/70 backdrop-blur-xl rounded-[2.5rem] p-6 sm:p-8 border border-gray-200 dark:border-white/10 shadow-sm mb-8">
              <h2 className="text-xl font-black text-gray-900 dark:text-white mb-4">About this Offering</h2>
              <p className="text-gray-700 dark:text-gray-300 font-medium leading-relaxed text-sm sm:text-base whitespace-pre-line">
                {data.description}
              </p>
            </div>

            {/* Key Focus Areas */}
            {data.areasOfFocus && (
              <div className="bg-white/70 dark:bg-[#161622]/70 backdrop-blur-xl rounded-[2.5rem] p-6 sm:p-8 border border-gray-200 dark:border-white/10 shadow-sm mb-8">
                <h2 className="text-xl font-black text-gray-900 dark:text-white mb-4">Core Areas of Focus</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {data.areasOfFocus.map((area: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-200 p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                      <Sparkles size={16} className="text-[#00d26a] shrink-0 mt-0.5" />
                      <span>{area}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* What is Included */}
            {data.includes && (
              <div className="bg-white/70 dark:bg-[#161622]/70 backdrop-blur-xl rounded-[2.5rem] p-6 sm:p-8 border border-gray-200 dark:border-white/10 shadow-sm">
                <h2 className="text-xl font-black text-gray-900 dark:text-white mb-4">What is Included</h2>
                <div className="space-y-3">
                  {data.includes.map((inc: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                      <CheckCircle2 size={16} className="text-[#00d26a] shrink-0 mt-0.5" />
                      <span>{inc}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Sidebar Booking / Action Card */}
          <div className="lg:col-span-4">
            <div className="sticky top-20 space-y-6">
              
              <div className="bg-white/80 dark:bg-[#161622]/80 backdrop-blur-2xl rounded-[2.5rem] p-6 sm:p-8 border border-gray-200 dark:border-white/10 shadow-xl text-center relative overflow-hidden">
                <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-5 border-4 border-[#00d26a] shadow-lg">
                  <img src={data.image} alt={data.expert} className="w-full h-full object-cover object-top" />
                </div>

                <span className="inline-block bg-[#00d26a]/15 text-[#00d26a] font-bold text-xs px-3.5 py-1 rounded-full mb-3">
                  {data.price}
                </span>

                <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">{data.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-6">Delivered by {data.expert}</p>

                <a 
                  href={data.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#00d26a] hover:bg-[#00c060] text-white py-4 rounded-2xl font-black text-sm shadow-lg shadow-[#00d26a]/25 hover:shadow-xl hover:shadow-[#00d26a]/40 hover:-translate-y-0.5 transition-all inline-flex items-center justify-center gap-2 mb-3"
                >
                  {data.linkText} <ExternalLink size={16} />
                </a>

                {isBuddingMinds && (
                  <Link 
                    href="/platform/resources/wellness/budding-minds"
                    className="w-full bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-900 dark:text-white py-3.5 rounded-2xl font-bold text-xs transition-colors inline-flex items-center justify-center gap-1.5"
                  >
                    View All Budding Minds Services <ArrowRight size={13} />
                  </Link>
                )}
              </div>

              {/* Safe & Evidence-Based Notice */}
              <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs font-medium space-y-2">
                <div className="flex items-center gap-2 font-bold text-emerald-900 dark:text-emerald-200">
                  <ShieldCheck size={16} className="text-[#00d26a]" /> Evidence-Informed Wellbeing
                </div>
                <p className="leading-relaxed">
                  All wellness resources and partner collaborations on WIPA adhere to professional standards in nutritional science and nervous system somatic care.
                </p>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
