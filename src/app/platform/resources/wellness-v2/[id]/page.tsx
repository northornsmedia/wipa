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
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1000",
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
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1000",
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
    image: "https://images.unsplash.com/photo-1600618528240-fb9fc964b853?auto=format&fit=crop&q=80&w=1000",
    description: "An immersive, in-person experience designed to engage all your senses and regulate your nervous system. Expect sound baths, mindful movement, nourishing food, and deep connection.",
    includes: [
      "Guided somatic movement and breathwork",
      "Immersive sound healing session",
      "Nutrient-dense, chef-prepared lunch",
      "Nervous system regulation toolkit to take home",
      "Exclusive goodie bag"
    ],
    linkUrl: "https://www.budding-minds.com/sensory-vibes-26",
    linkText: "Secure Your Spot",
    tags: ["Member Offer", "In-Person", "Regulation"]
  },
  'jel-retreats': {
    title: "International Wellness Retreats",
    type: "Service",
    expert: "Jel · Budding Minds",
    expertRole: "Registered Nutritional Therapist",
    price: "Multi-Day Retreat",
    image: "https://images.unsplash.com/photo-1540206351-d6465b3ac5c1?auto=format&fit=crop&q=80&w=1000",
    description: "Step away from the demands of your daily life and join us for a transformative multi-day retreat in a stunning international location. Reconnect with yourself, nature, and a community of inspiring individuals.",
    includes: [
      "Luxury accommodation in a serene location",
      "All organic, locally sourced meals prepared by private chefs",
      "Daily yoga, pilates, and meditation classes",
      "Workshops on nutrition, burnout, and hormone health",
      "Free time for exploration and relaxation"
    ],
    linkUrl: "https://www.budding-minds.com/",
    linkText: "Explore Upcoming Retreats",
    tags: ["Member Offer", "Travel", "Deep Rest"]
  },
  'jel-podcast': {
    title: "The Budding Minds Podcast",
    type: "Podcast",
    expert: "Jel · Budding Minds",
    expertRole: "Host & Nutritional Therapist",
    price: "Free",
    image: "https://images.unsplash.com/photo-1589903308904-1010c2294adc?auto=format&fit=crop&q=80&w=1000",
    description: "Tune in for honest conversations about mental health, gut health, hormones, and everything in between. We interview leading experts and share actionable tips to help you thrive.",
    includes: [
      "Weekly episodes with industry experts",
      "Actionable takeaways for your daily life",
      "Deep dives into complex health topics",
      "Listener Q&A segments"
    ],
    linkUrl: "https://www.budding-minds.com/podcas", // keeping typo from user
    linkText: "Listen on Spotify / Apple",
    tags: ["Audio", "Education", "Weekly"]
  },
  'jel-guide': {
    title: "Budding Minds Blog & Wellness Guides",
    type: "Guide",
    expert: "Jel · Budding Minds",
    expertRole: "Registered Nutritional Therapist",
    price: "Free Resource",
    image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=1000",
    description: "Explore our library of articles, recipes, and downloadable guides designed to support your journey to better health. From balancing blood sugar to managing stress, find the evidence-based information you need.",
    includes: [
      "Evidence-based health articles",
      "Nutritious and easy-to-make recipes",
      "Downloadable checklists and toolkits",
      "Lifestyle tips for busy professionals"
    ],
    linkUrl: "https://www.budding-minds.com/blog",
    linkText: "Read the Latest Articles",
    tags: ["Reading", "Recipes", "Tips"]
  }
};

export default function WellnessDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const resource = DETAILS_DB[resolvedParams.id as keyof typeof DETAILS_DB];

  if (!resource) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <h1 className="text-2xl font-black mb-4">Resource not found</h1>
        <Link href="/platform/resources/wellness-v2" className="text-[#00d26a] font-bold">Return to Wellness Hub</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafc] dark:bg-[#0a0a0f] font-sans pb-24 relative overflow-hidden">
      
      {/* Dynamic Background Glow */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[#00d26a]/10 to-transparent pointer-events-none" />

      <div className="max-w-[1200px] mx-auto px-6 lg:px-12 pt-8 relative z-10">
        
        {/* Top Nav */}
        <Link href="/platform/resources/wellness-v2" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#00d26a] font-bold text-sm mb-8 transition-colors">
          <ArrowLeft size={16} /> Back to Wellness 2.0
        </Link>

        {/* Hero Content */}
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          
          {/* Main Info Column */}
          <div className="flex-1">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-[#00d26a] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md shadow-[#00d26a]/20">
                {resource.type}
              </span>
              {resource.tags.map(tag => (
                <span key={tag} className="bg-pink-500/10 text-pink-500 text-xs font-bold px-3 py-1.5 rounded-full border border-pink-500/20">
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white leading-[1.1] mb-6">
              {resource.title}
            </h1>

            <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-200 dark:border-white/10">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 shrink-0">
                <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800" alt="Jel" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-black text-gray-900 dark:text-white">{resource.expert}</p>
                <p className="text-sm font-medium text-gray-500">{resource.expertRole}</p>
              </div>
            </div>

            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-xl text-gray-600 dark:text-gray-300 font-medium leading-relaxed mb-8">
                {resource.description}
              </p>

              <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-6">What's Included</h3>
              <ul className="space-y-4 mb-10">
                {resource.includes.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-gray-600 dark:text-gray-300 font-medium">
                    <CheckCircle2 className="text-[#00d26a] shrink-0 mt-1" size={20} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sticky Sidebar Action Card */}
          <div className="w-full lg:w-[400px] shrink-0 sticky top-24">
            <div className="bg-white/60 dark:bg-[#1a1a24]/60 backdrop-blur-xl rounded-[2.5rem] border border-gray-200 dark:border-white/10 p-2 overflow-hidden shadow-2xl shadow-[#00d26a]/5">
              
              <div className="w-full aspect-[4/3] rounded-[2rem] overflow-hidden relative mb-6">
                <img src={resource.image} alt={resource.title} className="w-full h-full object-cover" />
              </div>
              
              <div className="px-6 pb-6">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-gray-500 font-bold">Investment</span>
                  <span className="text-2xl font-black text-gray-900 dark:text-white">{resource.price}</span>
                </div>

                <a href={resource.linkUrl} target="_blank" rel="noopener noreferrer" className="w-full bg-[#00d26a] text-white px-6 py-4 rounded-2xl font-black shadow-lg shadow-[#00d26a]/25 hover:shadow-xl hover:shadow-[#00d26a]/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 mb-4 group">
                  {resource.linkText} <ExternalLink size={18} className="group-hover:translate-x-1 transition-transform" />
                </a>
                
                <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Hosted externally by Budding Minds
                </p>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
