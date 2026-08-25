// @ts-nocheck
'use client';

import React from 'react';
import { ArrowLeft, Play, Calendar as CalendarIcon, ExternalLink, Heart, Clock, Star, MapPin, Video, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

const DETAILS_DB = {
  'jel-1to1': {
    title: "1:1 Nutritional Therapy & Coaching",
    type: "Service",
    expert: "Jel · Budding Minds",
    expertRole: "Registered Nutritional Therapist",
    price: "From £690",
    image: "/jel.jpg",
    description: "A completely personalized journey to uncover the root causes of your symptoms. I look at your health timeline, dietary habits, and lifestyle to create a tailored protocol that works for your unique body.",
    includes: [
      "Initial 90-minute deep dive consultation",
      "Personalized nutrition & lifestyle plan",
      "Supplement recommendations (if needed)",
      "Access to functional testing (extra cost)",
      "Follow-up consultations to track progress",
      "Direct message support between sessions"
    ],
    linkUrl: "https://www.budding-minds.com/copy-of-services",
    linkText: "Book Your Discovery Call",
    tags: ["Member Offer", "Gut Health", "Hormones"]
  },
  'jel-group': {
    title: "The Reset: Group Coaching Programme",
    type: "Service",
    expert: "Jel · Budding Minds",
    expertRole: "Registered Nutritional Therapist",
    price: "Live Zoom Sessions",
    image: "/jel.jpg",
    description: "Join a supportive community of like-minded professionals in a guided program designed to reset your nervous system, optimize your nutrition, and build sustainable habits.",
    includes: [
      "Weekly live group coaching sessions on Zoom",
      "Downloadable workbooks and resources",
      "Private community group for daily support",
      "Guest expert sessions on mindset and sleep",
      "Access to session recordings"
    ],
    linkUrl: "https://www.budding-minds.com/",
    linkText: "Join the Waitlist",
    tags: ["Member Offer", "Community", "Mental Health"]
  },
  'jel-events': {
    title: "Sensory Vibes: In-Person Wellness Event",
    type: "Service",
    expert: "Jel · Budding Minds",
    expertRole: "Registered Nutritional Therapist",
    price: "In-Person Event",
    image: "/jel.jpg",
    description: "An immersive, in-person experience designed to engage all your senses and regulate your nervous system. Expect sound baths, mindful movement, nourishing food, and deep connection.",
    includes: [
      "Guided somatic movement and breathwork",
      "Immersive sound healing session",
      "Nutrient-dense, chef-prepared lunch",
      "Nervous system regulation toolkit to take home",
      "Goodie bag with wellness products"
    ],
    linkUrl: "https://www.budding-minds.com/",
    linkText: "View Upcoming Dates",
    tags: ["Member Offer", "In-Person", "Stress Management"]
  },
  'burnout-guide': {
    title: "Navigating Burnout: A Practical Guide for IP Professionals",
    type: "Wellness Webinar",
    expert: "Dr. Elena Rostova",
    expertRole: "Clinical Psychologist & Wellbeing Consultant",
    price: "Free for WIPA Members",
    image: "/resourceimg2.jpg",
    description: "In this comprehensive session, Dr. Elena Rostova explores the unique stressors faced by intellectual property professionals. We delve into identifying early signs of burnout and practical techniques to manage high-pressure deadlines.",
    includes: [
      "45-minute video presentation",
      "Downloadable burnout prevention toolkit",
      "Self-assessment checklist",
      "Actionable stress management strategies"
    ],
    linkUrl: "#",
    linkText: "Watch Webinar",
    tags: ["Mental Health", "Burnout", "Webinar"]
  }
};

export default function WellnessDetailRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const data = DETAILS_DB[id] || DETAILS_DB['jel-1to1'];

  return (
    <div className="min-h-screen bg-[#f4f6f9] dark:bg-[#0a0a0f] text-slate-900 dark:text-white font-sans transition-colors duration-300 pb-20">
      
      {/* Top Bar */}
      <div className="bg-white/60 dark:bg-[#1a1a24]/60 backdrop-blur-xl border-b border-gray-200 dark:border-white/10 py-6">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8">
          <Link href="/platform/resources/wellness" className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-[#00d26a] font-bold text-sm transition-colors">
            <ArrowLeft size={16} /> Back to Wellness & Wellbeing
          </Link>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 md:px-8 pt-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main Detail Area */}
          <div className="lg:col-span-8">
            
            {/* Header / Badges */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="bg-[#00d26a]/10 text-[#00d26a] font-bold text-xs px-3 py-1.5 rounded-full border border-[#00d26a]/20">
                {data.type}
              </span>
              {data.tags && data.tags.map(tag => (
                <span key={tag} className="bg-pink-500/10 text-pink-500 font-bold text-xs px-3 py-1.5 rounded-full border border-pink-500/20">
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white leading-tight mb-6">
              {data.title}
            </h1>

            {/* Expert Info */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/60 dark:bg-[#1a1a24]/60 backdrop-blur-xl border border-gray-200 dark:border-white/10 mb-8">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00d26a] to-[#20c997] flex items-center justify-center text-white font-black text-lg shadow-md shadow-[#00d26a]/20">
                {data.expert.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-base">{data.expert}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{data.expertRole}</p>
              </div>
            </div>

            {/* Image */}
            <div className="rounded-[2.5rem] overflow-hidden aspect-[16/9] mb-10 shadow-lg border border-gray-200 dark:border-white/10">
              <img src={data.image} alt={data.title} className="w-full h-full object-cover object-top" />
            </div>

            {/* Description */}
            <div className="prose dark:prose-invert max-w-none mb-10">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-4">About this Offering</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                {data.description}
              </p>
            </div>

            {/* What's Included */}
            {data.includes && (
              <div className="bg-white/60 dark:bg-[#1a1a24]/60 backdrop-blur-xl rounded-[2rem] p-8 border border-gray-200 dark:border-white/10 mb-10">
                <h3 className="text-xl font-black text-gray-900 dark:text-white mb-6">What's Included</h3>
                <ul className="space-y-4">
                  {data.includes.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-gray-700 dark:text-gray-300 font-medium text-base">
                      <CheckCircle2 size={20} className="text-[#00d26a] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </div>

          {/* Sidebar CTA Card */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 bg-white/80 dark:bg-[#1a1a24]/80 backdrop-blur-xl rounded-[2.5rem] p-8 border border-gray-200 dark:border-white/10 shadow-xl">
              <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Pricing / Access</div>
              <div className="text-3xl font-black text-gray-900 dark:text-white mb-6">{data.price}</div>

              <a 
                href={data.linkUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full bg-[#00d26a] text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-[#00c060] shadow-lg shadow-[#00d26a]/25 transition-all text-center mb-4"
              >
                {data.linkText} <ExternalLink size={18} />
              </a>

              <p className="text-xs text-gray-500 dark:text-gray-400 text-center leading-relaxed">
                Exclusive wellness resources & member offers powered by WIPA partners.
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
