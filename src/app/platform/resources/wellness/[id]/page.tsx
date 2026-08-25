// @ts-nocheck
'use client';

import React from 'react';
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
  BookOpen
} from 'lucide-react';
import Link from 'next/link';

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

const DETAILS_DB = {
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
    linkUrl: "https://www.budding-minds.com/specialoffer-service-with-jel",
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
    linkUrl: "https://www.budding-minds.com/s-projects-basic-1",
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
    tags: ["Video", "Mobility", "Physical Health"]
  },
  'client-boundaries': {
    title: "Setting Boundaries with Demanding Clients",
    type: "Guide",
    expert: "Marcus Thorne",
    expertRole: "Legal Practice Consultant & Executive Coach",
    price: "Free Resource",
    image: "/resourceimg3.jpg",
    description: "Learn practical communication scripts and operational boundaries to protect your personal time while strengthening client trust and professional reputation.",
    includes: [
      "Written 15-minute executive guide",
      "Email and communication templates for urgent out-of-hours requests",
      "Boundary-setting frameworks for legal practitioners"
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
  const data = DETAILS_DB[id] || DETAILS_DB['jel-1to1'];

  const isBuddingMinds = data.expert.includes('Budding Minds');

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
              {data.tags && data.tags.map(tag => (
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
                  className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-pink-500 hover:text-pink-600 bg-pink-50 dark:bg-pink-950/30 px-3 py-1.5 rounded-xl border border-pink-100 dark:border-pink-500/20 transition-colors"
                >
                  <InstagramIcon size={14} /> @buddingminds__
                </a>
              )}
            </div>

            {/* Main Image */}
            <div className="rounded-[2.5rem] overflow-hidden aspect-[16/9] mb-10 shadow-lg border border-gray-200 dark:border-white/10">
              <img src={data.image} alt={data.title} className="w-full h-full object-cover object-top" />
            </div>

            {/* Description */}
            <div className="bg-white/80 dark:bg-[#161622]/80 backdrop-blur-xl rounded-[2rem] p-6 sm:p-8 border border-gray-200 dark:border-white/10 mb-8 shadow-sm">
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white mb-4">About this Offering</h2>
              <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                {data.description}
              </p>
            </div>

            {/* What's Included */}
            {data.includes && (
              <div className="bg-white/80 dark:bg-[#161622]/80 backdrop-blur-xl rounded-[2rem] p-6 sm:p-8 border border-gray-200 dark:border-white/10 mb-8 shadow-sm">
                <h3 className="text-xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <ShieldCheck size={20} className="text-[#00d26a]" /> What&apos;s Included & What to Expect
                </h3>
                <ul className="space-y-3.5">
                  {data.includes.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-gray-700 dark:text-gray-300 font-medium text-sm sm:text-base">
                      <CheckCircle2 size={18} className="text-[#00d26a] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Areas of Focus */}
            {data.areasOfFocus && (
              <div className="bg-white/80 dark:bg-[#161622]/80 backdrop-blur-xl rounded-[2rem] p-6 sm:p-8 border border-gray-200 dark:border-white/10 mb-8 shadow-sm">
                <h3 className="text-xl font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Sparkles size={20} className="text-[#00d26a]" /> Key Areas of Focus
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {data.areasOfFocus.map((area, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-gray-50 dark:bg-[#1e1e2c] border border-gray-100 dark:border-white/5 text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#00d26a] shrink-0" />
                      <span>{area}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Budding Minds Practitioner Bio */}
            {isBuddingMinds && (
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-[2rem] p-6 sm:p-8 border border-emerald-200/60 dark:border-emerald-500/20">
                <div className="flex items-center gap-3 mb-4">
                  <Award size={22} className="text-[#00d26a]" />
                  <h3 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white">About Jel & Budding Minds</h3>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 font-medium leading-relaxed mb-5">
                  Jel is a qualified Nutritional Therapist specialising in gut and hormone health, with additional training in nervous system support and polyvagal-informed approaches. Her work brings together nutrition, lifestyle and nervous system support to help women better understand the relationship between their physical health, stress levels and overall wellbeing.
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <Link 
                    href="/platform/resources/wellness/budding-minds" 
                    className="bg-[#00d26a] text-white text-xs font-black px-4 py-2.5 rounded-xl inline-flex items-center gap-1.5 shadow-md hover:bg-[#00c060] transition-colors"
                  >
                    View Full Budding Minds Hub <ArrowRight size={14} />
                  </Link>
                  <a 
                    href="https://www.budding-minds.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-white dark:bg-[#1a1a26] text-gray-900 dark:text-white text-xs font-bold px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 inline-flex items-center gap-1.5 shadow-sm"
                  >
                    <Globe size={14} className="text-[#00d26a]" /> budding-minds.com
                  </a>
                  <a 
                    href="https://www.instagram.com/buddingminds__" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-pink-500 font-bold text-xs px-3 py-2 inline-flex items-center gap-1.5"
                  >
                    <InstagramIcon size={14} /> @buddingminds__
                  </a>
                </div>
              </div>
            )}

          </div>

          {/* Sidebar CTA Card */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 bg-white/90 dark:bg-[#161622]/90 backdrop-blur-2xl rounded-[2.5rem] p-6 sm:p-8 border border-gray-200 dark:border-white/10 shadow-2xl space-y-6">
              
              <div>
                <div className="text-[11px] font-black uppercase tracking-wider text-gray-400 mb-1">Pricing & Access</div>
                <div className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">{data.price}</div>
              </div>

              <a 
                href={data.linkUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full bg-[#00d26a] text-white py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-[#00c060] shadow-xl shadow-[#00d26a]/25 hover:shadow-2xl hover:shadow-[#00d26a]/40 hover:-translate-y-0.5 transition-all text-center"
              >
                {data.linkText} <ExternalLink size={16} />
              </a>

              {isBuddingMinds && (
                <div className="space-y-2.5 pt-2 border-t border-gray-100 dark:border-white/5">
                  <div className="text-[11px] font-black uppercase tracking-wider text-gray-400 mb-2">Budding Minds Links</div>
                  <a 
                    href="https://www.budding-minds.com/copy-of-services" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full bg-gray-50 dark:bg-[#1e1e2c] hover:bg-gray-100 dark:hover:bg-[#28283a] text-gray-800 dark:text-white p-3 rounded-xl text-xs font-bold flex items-center justify-between transition-colors border border-gray-100 dark:border-white/5"
                  >
                    <span>1:1 Support & Consultations</span>
                    <ExternalLink size={13} className="text-[#00d26a]" />
                  </a>
                  <a 
                    href="https://www.budding-minds.com/specialoffer-service-with-jel" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full bg-gray-50 dark:bg-[#1e1e2c] hover:bg-gray-100 dark:hover:bg-[#28283a] text-gray-800 dark:text-white p-3 rounded-xl text-xs font-bold flex items-center justify-between transition-colors border border-gray-100 dark:border-white/5"
                  >
                    <span>Wellness Events with Jel</span>
                    <ExternalLink size={13} className="text-[#00d26a]" />
                  </a>
                  <a 
                    href="https://www.budding-minds.com/s-projects-basic-1" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full bg-gray-50 dark:bg-[#1e1e2c] hover:bg-gray-100 dark:hover:bg-[#28283a] text-gray-800 dark:text-white p-3 rounded-xl text-xs font-bold flex items-center justify-between transition-colors border border-gray-100 dark:border-white/5"
                  >
                    <span>International Retreats</span>
                    <ExternalLink size={13} className="text-[#00d26a]" />
                  </a>
                  <a 
                    href="https://www.instagram.com/buddingminds__" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full bg-gray-50 dark:bg-[#1e1e2c] hover:bg-gray-100 dark:hover:bg-[#28283a] text-gray-800 dark:text-white p-3 rounded-xl text-xs font-bold flex items-center justify-between transition-colors border border-gray-100 dark:border-white/5"
                  >
                    <span className="flex items-center gap-1.5 text-pink-500">
                      <InstagramIcon size={14} /> @buddingminds__
                    </span>
                    <ExternalLink size={13} className="text-pink-500" />
                  </a>
                </div>
              )}

              <p className="text-[11px] text-gray-500 dark:text-gray-400 text-center leading-relaxed pt-2">
                Exclusive wellness partner resources curated for WIPA members.
              </p>

            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
