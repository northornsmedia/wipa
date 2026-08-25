'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Star, 
  Sun, 
  Sparkles, 
  ArrowDown, 
  ArrowLeft, 
  ArrowRight, 
  Plus, 
  Minus, 
  Globe, 
  BookOpen, 
  Scale, 
  Bot, 
  Users, 
  Briefcase, 
  Calendar, 
  ShieldCheck, 
  Zap, 
  X,
  MessageSquare,
  Activity,
  Layers,
  HeartHandshake
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useAppStore } from '@/store/useAppStore';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import PublicHeader from '@/components/PublicHeader';
import PublicFooter from '@/components/PublicFooter';
import AppLaunchSplash from '@/components/AppLaunchSplash';
import { useRouter } from 'next/navigation';

const ROLLING_WORDS = ["Career", "Network", "Leadership", "Innovations", "IP Practice"];

const DEMO_AI_PROMPTS = [
  {
    title: "AI Inventorship & Patentability",
    prompt: "What are the USPTO and EPO baseline standards for naming AI systems as inventors?",
    response: "Both the USPTO and EPO require natural human conception. Human inventors must prove significant creative contributions to the claimed invention. Pure autonomous generative outputs without human prompt engineering and verification fail inventorship thresholds."
  },
  {
    title: "UPC Injunction & FRAND Defense",
    prompt: "How does the Unified Patent Court evaluate preliminary injunctions under FRAND terms?",
    response: "The UPC Court of Appeal requires patent proprietors to show clear validity with reasonable certainty while implementers must exhibit genuine willingness to enter into a FRAND license with verifiable escrow guarantees."
  },
  {
    title: "Cross-Border Trademark Clearance",
    prompt: "How does the EUIPO evaluate likelihood of confusion across multilingual digital goods?",
    response: "The EUIPO assesses visual, phonetic, and conceptual similarities across all official EU languages, giving heightened weight to distinctive dominant elements in Class 9 and Class 42 digital assets."
  }
];

export default function Home() {
  const router = useRouter();
  const { user, setUser } = useAppStore();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showSplash, setShowSplash] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  
  // Interactive LexIQ Playground state
  const [selectedPromptIndex, setSelectedPromptIndex] = useState(0);
  const [aiTypingText, setAiTypingText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    sessionStorage.removeItem('wipa_tts_played');

    const minimumSplash = new Promise((resolve) => setTimeout(resolve, 2000));

    supabase.auth.getUser().then(async ({ data: { user: authUser }, error }) => {
      if (error || !authUser) {
        setUser(null);
        await minimumSplash;
        setShowSplash(false);
        return;
      }
      
      supabase
        .from("profiles")
        .select("full_name, avatar_url, cover_url, member_id")
        .eq("id", authUser.id)
        .single()
        .then(async ({ data }) => {
          setUser({
            name: data?.full_name || authUser.email?.split("@")[0] || "User",
            email: authUser.email!,
            id: authUser.id,
            avatar_url: data?.avatar_url || undefined,
            cover_url: data?.cover_url || undefined,
            member_id: data?.member_id || undefined,
          });
          await minimumSplash;
          setShowSplash(false);
        });
    });
  }, [router, setUser]);

  // Word Cycler Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % ROLLING_WORDS.length);
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  // AI Interactive Typing Simulator
  useEffect(() => {
    const targetText = DEMO_AI_PROMPTS[selectedPromptIndex].response;
    setIsTyping(true);
    setAiTypingText("");

    let i = 0;
    const interval = setInterval(() => {
      if (i < targetText.length) {
        setAiTypingText(targetText.slice(0, i + 1));
        i++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 12);

    return () => clearInterval(interval);
  }, [selectedPromptIndex]);

  const coursesCarouselRef = useRef<HTMLDivElement>(null);
  const scrollResources = (direction: 'left' | 'right') => {
    if (coursesCarouselRef.current) {
      coursesCarouselRef.current.scrollBy({ left: direction === 'left' ? -360 : 360, behavior: 'smooth' });
    }
  };

  const teamCarouselRef = useRef<HTMLDivElement>(null);
  const scrollTeam = (direction: 'left' | 'right') => {
    if (teamCarouselRef.current) {
      teamCarouselRef.current.scrollBy({ left: direction === 'left' ? -320 : 320, behavior: 'smooth' });
    }
  };

  return (
    <>
      <AnimatePresence>
        {showSplash && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.6, ease: "easeInOut" } }}
            className="fixed inset-0 z-[100]"
          >
            <AppLaunchSplash message="Connecting women shaping the future of IP…" />
          </motion.div>
        )}
      </AnimatePresence>

      <main className="min-h-screen bg-white dark:bg-[#060608] text-slate-900 dark:text-white flex flex-col font-sans overflow-x-hidden w-full max-w-[100vw] relative selection:bg-pink-500 selection:text-white transition-colors duration-300">
        
        {/* Background Glowing Wavy Line Gradient SVG (Adapts to Light and Dark) */}
        <div className="absolute top-16 left-0 right-0 w-full overflow-hidden pointer-events-none opacity-85 z-0">
          <svg
            viewBox="0 0 500 150"
            preserveAspectRatio="none"
            className="w-full h-44 sm:h-64 stroke-current"
          >
            <defs>
              <linearGradient id="landingWaveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ff2a70" />
                <stop offset="50%" stopColor="#ff7836" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
            <path
              d="M-20,30 Q80,130 200,60 T440,80 T550,20"
              fill="none"
              stroke="url(#landingWaveGradient)"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Ambient Radial Neon Glows */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-[#ff2a70]/10 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-40 right-1/4 w-96 h-96 bg-[#8b5cf6]/10 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Navigation */}
        <div className="w-full z-50 relative border-b border-slate-100 dark:border-white/5 bg-white/90 dark:bg-[#060608]/80 backdrop-blur-md">
          <PublicHeader />
        </div>

        {/* Hero Section */}
        <section className="flex-1 flex flex-col items-center justify-center text-center px-4 z-10 relative pt-12 md:pt-20 pb-16 w-full overflow-hidden">
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={!showSplash ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full max-w-5xl mx-auto relative flex flex-col items-center"
          >
            
            {/* Top Glowing Floating Pill Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/15 px-4 py-1.5 mb-8 shadow-sm backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-[#ff2a70] animate-pulse" />
              <span className="text-xs font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-orange-500 to-purple-600 dark:from-pink-400 dark:via-orange-300 dark:to-purple-400">
                Women&apos;s IP World Alliance Platform
              </span>
            </div>

            {/* Editorial Futuristic Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.75rem] font-black text-slate-900 dark:text-white leading-[1.12] mb-6 w-full px-2 tracking-tight">
              <span className="block md:whitespace-nowrap">A Global, Empowering</span>
              <span className="block md:whitespace-nowrap mt-2">
                Community To Grow Your{" "}
                <span className="relative inline-flex items-center justify-center whitespace-nowrap">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={currentWordIndex}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      transition={{ duration: 0.35, ease: "easeInOut" }}
                      className="relative inline-block px-2 text-transparent bg-clip-text bg-gradient-to-r from-[#ff2a70] via-[#ff7836] to-[#a855f7]"
                    >
                      {ROLLING_WORDS[currentWordIndex]}
                    </motion.span>
                  </AnimatePresence>
                  
                  {/* Handwritten Underline SVG Curve */}
                  <svg 
                    className="absolute w-full h-[14px] -bottom-1 md:-bottom-2 left-0 text-[#ff7836]" 
                    viewBox="0 0 200 20" 
                    preserveAspectRatio="none" 
                    fill="none"
                  >
                    <path d="M5,15 Q100,5 195,15" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                  </svg>
                </span>
              </span>
            </h1>
            
            <p className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-slate-700 dark:text-slate-300 font-medium leading-relaxed mb-10 px-4">
              Connect, collaborate, and grow professionally within the premier global Intellectual Property ecosystem for women.
            </p>
            
            {/* Primary Action Buttons Matching Login Gradient */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              
              {/* Primary Gradient Pill Button */}
              <Link 
                href="/platform" 
                className="p-[2px] rounded-full bg-gradient-to-r from-[#d946ef] via-[#ff2a70] to-[#f97316] shadow-xl shadow-pink-500/25 hover:scale-105 active:scale-95 transition-all duration-300 group"
              >
                <div className="w-full h-full bg-[#0a0a0e] group-hover:bg-[#121218] text-white rounded-full py-3.5 px-8 flex items-center justify-center gap-2 font-bold text-sm sm:text-base transition-colors">
                  <span>Explore Platform ➔</span>
                </div>
              </Link>

              {/* Glassmorphic Secondary Button */}
              <button 
                onClick={() => setIsVideoOpen(true)}
                className="flex items-center gap-2.5 text-slate-800 dark:text-white font-bold text-sm sm:text-base bg-white/80 dark:bg-white/10 hover:bg-white dark:hover:bg-white/15 px-6 py-3.5 rounded-full border border-slate-300 dark:border-white/20 shadow-md backdrop-blur hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full border-2 border-slate-800 dark:border-white flex items-center justify-center bg-transparent">
                  <Play size={10} fill="currentColor" className="ml-0.5" />
                </div>
                <span>Watch Platform Tour</span>
              </button>

              <Link 
                href="/login" 
                className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-bold text-sm px-6 py-3.5 rounded-full border border-slate-300 dark:border-white/10 hover:border-slate-400 dark:hover:border-white/30 bg-white/60 dark:bg-[#18181d] hover:bg-white dark:hover:bg-[#222228] transition-all"
              >
                Sign In
              </Link>
            </div>

          </motion.div>
        </section>

        {/* Video Overview Modal */}
        <AnimatePresence>
          {isVideoOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[120] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
              onClick={() => setIsVideoOpen(false)}
            >
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-4xl bg-[#0d1322] border border-white/20 rounded-3xl overflow-hidden shadow-2xl relative"
              >
                <div className="p-4 border-b border-white/10 flex items-center justify-between text-white">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#ff2a70] animate-pulse" />
                    <span className="font-bold text-sm uppercase tracking-wider">WIPA Interactive Platform Tour</span>
                  </div>
                  <button 
                    onClick={() => setIsVideoOpen(false)}
                    className="p-1 rounded-full text-slate-400 hover:text-white transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="aspect-video w-full bg-black/90 relative flex flex-col items-center justify-center p-8 text-center text-white">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#ff2a70] to-[#8b5cf6] flex items-center justify-center mb-4 shadow-xl shadow-pink-500/20 animate-bounce">
                    <Play size={26} fill="currentColor" className="ml-1 text-white" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black mb-2">Welcome to Women's IP World Alliance</h3>
                  <p className="max-w-xl text-slate-300 text-sm mb-6 leading-relaxed">
                    Uniting patent attorneys, trademark counsel, and innovators across 45+ jurisdictions with real-time intelligence feeds, specialized LexIQ AI, and global networking.
                  </p>
                  <Link 
                    href="/signup" 
                    className="p-[2px] rounded-full bg-gradient-to-r from-[#d946ef] via-[#ff2a70] to-[#f97316] shadow-lg shadow-pink-500/20"
                  >
                    <div className="bg-[#060608] hover:bg-[#121218] text-white px-8 py-3 rounded-full font-bold text-sm transition-colors">
                      Join The Alliance Today
                    </div>
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Profiles Grid (Infinite Marquee) */}
        <section className="w-full overflow-hidden pb-16 z-10 relative">
          
          <svg width="0" height="0" className="absolute">
            <defs>
              <clipPath id="peanut-clip-dark" clipPathUnits="objectBoundingBox">
                <path d="M 0.5 0 C 0.875 0, 1 0.2, 0.875 0.5 C 1 0.8, 0.875 1, 0.5 1 C 0.125 1, 0 0.8, 0.125 0.5 C 0 0.2, 0.125 0, 0.5 0 Z" />
              </clipPath>
            </defs>
          </svg>

          <motion.div 
            className="w-full"
            initial="hidden"
            animate={!showSplash ? "visible" : "hidden"}
            variants={{
              hidden: { opacity: 0 },
              visible: { 
                opacity: 1,
                transition: { staggerChildren: 0.1, delayChildren: 0.4 }
              }
            }}
          >
            <motion.div
              className="flex items-end gap-3 md:gap-5 flex-nowrap w-max"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ repeat: Infinity, ease: "linear", duration: 32 }}
            >
              {[...Array(2)].map((_, setIndex) => (
                <div key={setIndex} className="flex items-end gap-3 md:gap-5 flex-nowrap">
                  {/* Item 1 - Orange Pill */}
                  <motion.div className="relative w-20 h-40 md:w-32 md:h-64 rounded-full bg-[#f99d3e] border border-white/20 overflow-hidden flex-shrink-0 flex items-end justify-center shadow-lg shadow-orange-500/10">
                    <div className="w-full h-full relative">
                      <Image src="/avatar_1.png" alt="User 1" fill sizes="(max-width: 768px) 80px, 128px" className="object-cover object-top mix-blend-multiply grayscale scale-[1.15]" />
                    </div>
                  </motion.div>
                  
                  {/* Item 2 - Purple Pill */}
                  <motion.div className="relative w-28 h-40 md:w-44 md:h-64 rounded-full bg-[#b892ff] border border-white/20 overflow-hidden flex-shrink-0 flex items-end justify-center shadow-lg shadow-purple-500/10">
                    <div className="w-full h-full relative">
                      <Image src="/avatar_2.png" alt="User 2" fill sizes="(max-width: 768px) 112px, 176px" className="object-cover object-top mix-blend-multiply grayscale scale-[1.1]" />
                    </div>
                  </motion.div>

                  {/* Item 3 - Red Peanut */}
                  <motion.div className="relative w-32 h-40 md:w-52 md:h-64 bg-[#ff5241] flex-shrink-0 flex items-end justify-center group border border-white/10" style={{ clipPath: 'url(#peanut-clip-dark)' }}>
                    <div className="w-full h-full relative">
                      <Image src="/avatar_1.png" alt="User 3" fill sizes="(max-width: 768px) 128px, 208px" className="object-cover object-top mix-blend-multiply grayscale scale-[1.1]" />
                    </div>
                  </motion.div>

                  {/* Item 4 - Yellow Arch */}
                  <motion.div className="relative w-28 h-40 md:w-44 md:h-64 rounded-t-full bg-[#ffd05b] border border-white/20 border-b-0 overflow-hidden flex-shrink-0 flex items-end justify-center">
                    <div className="w-full h-full relative">
                      <Image src="/avatar_2.png" alt="User 4" fill sizes="(max-width: 768px) 112px, 176px" className="object-cover object-top mix-blend-multiply grayscale scale-[1.1]" />
                    </div>
                  </motion.div>

                  {/* Item 5 - Green Peanut */}
                  <motion.div className="relative w-32 h-40 md:w-52 md:h-64 bg-[#48d29b] flex-shrink-0 flex items-end justify-center group border border-white/10" style={{ clipPath: 'url(#peanut-clip-dark)' }}>
                    <div className="w-full h-full relative">
                      <Image src="/avatar_1.png" alt="User 5" fill sizes="(max-width: 768px) 128px, 208px" className="object-cover object-top mix-blend-multiply grayscale scale-[1.1]" />
                    </div>
                  </motion.div>

                  {/* Item 6 - Blue Pill */}
                  <motion.div className="relative w-28 h-40 md:w-44 md:h-64 rounded-full bg-[#6eb4ff] border border-white/20 overflow-hidden flex-shrink-0 flex items-end justify-center">
                    <div className="w-full h-full relative">
                      <Image src="/avatar_2.png" alt="User 6" fill sizes="(max-width: 768px) 112px, 176px" className="object-cover object-top mix-blend-multiply grayscale scale-[1.1]" />
                    </div>
                  </motion.div>

                  {/* Item 7 - Peach Arch */}
                  <motion.div className="relative w-28 h-40 md:w-44 md:h-64 rounded-t-full bg-[#ff9882] border border-white/20 border-b-0 overflow-hidden flex-shrink-0 flex items-end justify-center">
                    <div className="w-full h-full relative">
                      <Image src="/avatar_1.png" alt="User 7" fill sizes="(max-width: 768px) 112px, 176px" className="object-cover object-top mix-blend-multiply grayscale scale-[1.1]" />
                    </div>
                  </motion.div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* 6 Platform Pillars Grid (What WIPA Can Do) */}
        <section className="w-full max-w-7xl mx-auto px-6 py-20 z-10 relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-[#ff2a70]/10 border border-[#ff2a70]/25 text-[#ff2a70] text-xs font-black uppercase tracking-wider px-4 py-1.5 rounded-full mb-4 shadow-sm">
              <Sparkles size={13} /> Platform Capabilities
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              Everything You Need To Lead In Intellectual Property
            </h2>
            <p className="mt-4 text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-2xl mx-auto font-medium leading-relaxed">
              A single unified ecosystem purpose-built for patent attorneys, trademark specialists, in-house counsel, and innovation leaders globally.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            
            {/* Pillar 1: LexIQ AI */}
            <div className="group p-8 rounded-[2rem] bg-white dark:bg-[#0c101d] border border-slate-200/90 dark:border-white/[0.08] hover:border-purple-500/50 shadow-md hover:shadow-xl dark:shadow-2xl dark:hover:shadow-purple-950/30 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform shadow-inner">
                    <Bot size={24} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-300">
                    Core AI
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2.5 tracking-tight group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">
                  LexIQ AI Intelligence
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                  Specialized legal reasoning trained on USPTO, EPO, and WIPO case law. Instant prior art synthesis, claim drafting analysis, and infringement defense.
                </p>
              </div>
              <Link href="/platform/ai" className="mt-8 inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-purple-600 dark:text-purple-400 group-hover:gap-3 transition-all">
                Launch LexIQ AI <ArrowRight size={14} />
              </Link>
            </div>

            {/* Pillar 2: Live IP News */}
            <div className="group p-8 rounded-[2rem] bg-white dark:bg-[#0c101d] border border-slate-200/90 dark:border-white/[0.08] hover:border-orange-500/50 shadow-md hover:shadow-xl dark:shadow-2xl dark:hover:shadow-orange-950/30 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform shadow-inner">
                    <Activity size={24} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-300">
                    30s Live Sync
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2.5 tracking-tight group-hover:text-orange-600 dark:group-hover:text-orange-300 transition-colors">
                  Continuous Live IP News
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                  Continuous 30-second automated internet aggregation stream capturing UPC rulings, trademark oppositions, and global regulatory directives.
                </p>
              </div>
              <Link href="/platform/resources/ip-news" className="mt-8 inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-orange-600 dark:text-orange-400 group-hover:gap-3 transition-all">
                View Live Feed <ArrowRight size={14} />
              </Link>
            </div>

            {/* Pillar 3: Verified Firm Directory */}
            <div className="group p-8 rounded-[2rem] bg-white dark:bg-[#0c101d] border border-slate-200/90 dark:border-white/[0.08] hover:border-emerald-500/50 shadow-md hover:shadow-xl dark:shadow-2xl dark:hover:shadow-emerald-950/30 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform shadow-inner">
                    <ShieldCheck size={24} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-300">
                    45+ Nations
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2.5 tracking-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors">
                  Verified Firm Directory
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                  Global directory of certified IP law firms, boutique patent agencies, and verified partner counsel with claimed profiles and badges.
                </p>
              </div>
              <Link href="/platform/resources/ip-firms" className="mt-8 inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 group-hover:gap-3 transition-all">
                Search Directory <ArrowRight size={14} />
              </Link>
            </div>

            {/* Pillar 4: Annual Publications */}
            <div className="group p-8 rounded-[2rem] bg-white dark:bg-[#0c101d] border border-slate-200/90 dark:border-white/[0.08] hover:border-pink-500/50 shadow-md hover:shadow-xl dark:shadow-2xl dark:hover:shadow-pink-950/30 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-pink-500/15 border border-pink-500/30 flex items-center justify-center text-pink-600 dark:text-pink-400 group-hover:scale-110 transition-transform shadow-inner">
                    <BookOpen size={24} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-600 dark:text-pink-300">
                    35% Savings
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2.5 tracking-tight group-hover:text-pink-600 dark:group-hover:text-pink-300 transition-colors">
                  Annual Publications
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                  Women&apos;s IP World and IP Tech Innovation annuals with exclusive alliance discounts on global print and digital flagship distributions.
                </p>
              </div>
              <Link href="/publications" className="mt-8 inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-pink-600 dark:text-pink-400 group-hover:gap-3 transition-all">
                Explore Editions <ArrowRight size={14} />
              </Link>
            </div>

            {/* Pillar 5: Virtual Roundtables */}
            <div className="group p-8 rounded-[2rem] bg-white dark:bg-[#0c101d] border border-slate-200/90 dark:border-white/[0.08] hover:border-blue-500/50 shadow-md hover:shadow-xl dark:shadow-2xl dark:hover:shadow-blue-950/30 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform shadow-inner">
                    <Calendar size={24} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-300">
                    HD Video
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2.5 tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">
                  Meetn Live Events
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                  High-definition virtual rooms, calendar synchronization (Google / Outlook / iCal), and VIP roundtables with managing partners.
                </p>
              </div>
              <Link href="/platform/events" className="mt-8 inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-400 group-hover:gap-3 transition-all">
                Browse Events <ArrowRight size={14} />
              </Link>
            </div>

            {/* Pillar 6: Mentorship & Wellness */}
            <div className="group p-8 rounded-[2rem] bg-white dark:bg-[#0c101d] border border-slate-200/90 dark:border-white/[0.08] hover:border-amber-500/50 shadow-md hover:shadow-xl dark:shadow-2xl dark:hover:shadow-amber-950/30 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform shadow-inner">
                    <HeartHandshake size={24} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-300">
                    Empowerment
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2.5 tracking-tight group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors">
                  Budding Minds & Mentorship
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                  1:1 mentorship matchmaking, wellness toolkits, leadership coaching, and academic partnerships empowering future IP leaders.
                </p>
              </div>
              <Link href="/platform/mentorship" className="mt-8 inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 group-hover:gap-3 transition-all">
                Join Mentorship <ArrowRight size={14} />
              </Link>
            </div>

          </div>
        </section>

        {/* Interactive LexIQ AI Playground Showcase */}
        <section className="w-full max-w-7xl mx-auto px-6 py-16 z-10 relative">
          <div className="bg-white dark:bg-[#0e0e14] rounded-[2.5rem] border border-slate-200 dark:border-white/15 p-8 md:p-14 shadow-xl dark:shadow-2xl overflow-hidden relative">
            
            <div className="flex flex-col lg:flex-row items-start justify-between gap-12">
              <div className="lg:w-1/2">
                <div className="inline-flex items-center gap-2 bg-purple-500/15 border border-purple-500/30 px-4 py-1.5 rounded-full text-xs font-black uppercase text-purple-600 dark:text-purple-400 mb-4">
                  <Bot size={15} /> Live AI Interactive Demo
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 leading-tight">
                  Meet LexIQ — The AI Purpose-Built for Intellectual Property
                </h2>
                <p className="text-slate-600 dark:text-slate-300 text-base md:text-lg leading-relaxed mb-8">
                  Trained on verified patent prosecution guidelines, trademark case law, and cross-border regulatory precedents. Experience pinpoint accuracy with zero hallucinations.
                </p>

                {/* Prompt Selectors */}
                <div className="flex flex-col gap-3">
                  {DEMO_AI_PROMPTS.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedPromptIndex(idx)}
                      className={`text-left px-5 py-4 rounded-2xl border text-sm font-bold transition-all flex items-center justify-between cursor-pointer ${
                        selectedPromptIndex === idx
                          ? "bg-purple-50 dark:bg-purple-950/40 border-purple-500/60 text-purple-700 dark:text-purple-300 shadow-md"
                          : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-white/20"
                      }`}
                    >
                      <span>{item.title}</span>
                      <ArrowRight size={15} className="text-purple-500 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Simulated Chat Window */}
              <div className="lg:w-1/2 w-full">
                <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl relative overflow-hidden">
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
                    <div className="flex items-center gap-2.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/80" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                      <div className="w-3 h-3 rounded-full bg-green-500/80" />
                      <span className="text-xs font-mono text-slate-400 ml-2">lexiq-kernel-v4.2</span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                      <span>ONLINE</span>
                    </div>
                  </div>

                  {/* Query */}
                  <div className="mb-4 bg-white/5 rounded-2xl p-4 border border-white/5">
                    <div className="text-[10px] font-mono text-purple-400 uppercase font-black mb-1">User Query</div>
                    <p className="text-xs sm:text-sm text-slate-200 font-medium">
                      {DEMO_AI_PROMPTS[selectedPromptIndex].prompt}
                    </p>
                  </div>

                  {/* Response */}
                  <div className="bg-[#0b0f19] rounded-2xl p-5 border border-purple-500/20 min-h-[160px] relative">
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 uppercase font-bold mb-2">
                      <span className="flex items-center gap-1.5 text-purple-300">
                        <Sparkles size={12} /> LexIQ Response
                      </span>
                      <span>Latency: 280ms</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 font-mono leading-relaxed whitespace-pre-wrap">
                      {aiTypingText}
                      {isTyping && <span className="inline-block w-2 h-4 ml-1 bg-purple-400 animate-pulse" />}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 font-mono">USPTO · EPO · WIPO Indexed</span>
                    <Link
                      href="/platform/ai"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      Open Full Chat <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Global Impact Numbers Counter - High-Voltage Interactive Cyber Cards */}
        <section className="w-full max-w-7xl mx-auto px-6 py-16 z-10 relative">
          <div className="relative rounded-[2.5rem] bg-white/95 dark:bg-gradient-to-b dark:from-white/10 dark:via-white/5 dark:to-transparent border border-slate-200 dark:border-transparent p-[1px] shadow-xl dark:shadow-2xl dark:shadow-purple-950/20">
            
            {/* Ambient Backlight Glows */}
            <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
            <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

            <div className="rounded-[2.45rem] bg-white/90 dark:bg-[#090d16]/90 backdrop-blur-2xl p-6 sm:p-10 lg:p-12 border border-slate-200/60 dark:border-white/5">
              
              {/* Header Label */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-8 mb-8 border-b border-slate-200 dark:border-white/10">
                <div className="flex items-center gap-3">
                  <span className="h-3 w-3 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-xs font-black uppercase tracking-widest text-slate-800 dark:text-slate-300">
                    Live Alliance Network Metrics
                  </span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[11px] font-bold text-slate-600 dark:text-slate-400">
                  <Activity size={13} className="text-orange-500 animate-pulse" /> Real-Time Global Telemetry
                </div>
              </div>

              {/* 4 Glowing Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Metric 1 */}
                <div className="group relative rounded-3xl bg-slate-50/90 dark:bg-[#0e1422]/90 border border-slate-200/80 dark:border-white/10 hover:border-orange-500/50 p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-orange-500/15 flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-2xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
                      <Users size={20} />
                    </div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-[10px] font-black uppercase tracking-wider text-orange-600 dark:text-orange-400">
                      Verified
                    </span>
                  </div>

                  <div>
                    <h3 className="text-4xl sm:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-500 dark:from-orange-400 dark:via-amber-300 dark:to-yellow-400 mb-1.5">
                      5,000+
                    </h3>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-300 mb-1">
                      IP Leaders & Counsel
                    </p>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Partners, in-house attorneys & agents
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/80 dark:border-white/5 flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> +18% MoM Growth
                  </div>
                </div>

                {/* Metric 2 */}
                <div className="group relative rounded-3xl bg-slate-50/90 dark:bg-[#0e1422]/90 border border-slate-200/80 dark:border-white/10 hover:border-purple-500/50 p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-purple-500/15 flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform">
                      <Globe size={20} />
                    </div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-[10px] font-black uppercase tracking-wider text-purple-600 dark:text-purple-400">
                      Global
                    </span>
                  </div>

                  <div>
                    <h3 className="text-4xl sm:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-fuchsia-400 to-pink-500 dark:from-purple-400 dark:via-fuchsia-300 dark:to-pink-400 mb-1.5">
                      45+
                    </h3>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-300 mb-1">
                      Global Jurisdictions
                    </p>
                    <p className="text-[11px] text-slate-500 font-medium">
                      USPTO, EPO, UKIPO, WIPO & APAC
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/80 dark:border-white/5 flex items-center gap-1.5 text-[10px] font-bold text-purple-600 dark:text-purple-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-purple-500" /> Cross-Border Precedents
                  </div>
                </div>

                {/* Metric 3 */}
                <div className="group relative rounded-3xl bg-slate-50/90 dark:bg-[#0e1422]/90 border border-slate-200/80 dark:border-white/10 hover:border-emerald-500/50 p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-emerald-500/15 flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                      <Scale size={20} />
                    </div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      Live Sync
                    </span>
                  </div>

                  <div>
                    <h3 className="text-4xl sm:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 dark:from-emerald-400 dark:via-teal-300 dark:to-cyan-400 mb-1.5">
                      1,200+
                    </h3>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-300 mb-1">
                      Intelligence Briefs
                    </p>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Patents, trademarks & copyright rulings
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/80 dark:border-white/5 flex items-center gap-1.5 text-[10px] font-bold text-cyan-600 dark:text-cyan-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-pulse" /> 30s Auto Refresh
                  </div>
                </div>

                {/* Metric 4 */}
                <div className="group relative rounded-3xl bg-slate-50/90 dark:bg-[#0e1422]/90 border border-slate-200/80 dark:border-white/10 hover:border-pink-500/50 p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-pink-500/15 flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-2xl bg-pink-500/15 border border-pink-500/30 flex items-center justify-center text-pink-500 group-hover:scale-110 transition-transform">
                      <Sparkles size={20} />
                    </div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-[10px] font-black uppercase tracking-wider text-pink-600 dark:text-pink-400">
                      Exclusive
                    </span>
                  </div>

                  <div>
                    <h3 className="text-4xl sm:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-rose-400 to-orange-500 dark:from-pink-400 dark:via-rose-300 dark:to-orange-400 mb-1.5">
                      35%
                    </h3>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-300 mb-1">
                      Member Savings
                    </p>
                    <p className="text-[11px] text-slate-500 font-medium">
                      On Women&apos;s IP World Annual editions
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/80 dark:border-white/5 flex items-center gap-1.5 text-[10px] font-bold text-pink-600 dark:text-pink-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-pink-500" /> Print & Digital Editions
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* Resources & Masterclasses Carousel */}
        <section className="w-full max-w-7xl mx-auto px-6 py-20 z-10 relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="bg-purple-500/15 text-purple-600 dark:text-purple-400 text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-3 inline-block">
                Exclusive Content
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white max-w-2xl leading-tight">
                Access Exclusive IP Resources, Webinars, and Masterclasses
              </h2>
            </div>
            
            <div className="hidden md:flex items-center gap-4">
              <button onClick={() => scrollResources('left')} className="w-12 h-12 rounded-full border border-slate-300 dark:border-white/20 bg-white/80 dark:bg-white/5 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-white/15 transition-colors cursor-pointer text-slate-800 dark:text-white shadow-xs">
                <ArrowLeft strokeWidth={1.5} className="w-5 h-5" />
              </button>
              <button onClick={() => scrollResources('right')} className="w-12 h-12 rounded-full border border-slate-300 dark:border-white/20 bg-white/80 dark:bg-white/5 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-white/15 transition-colors cursor-pointer text-slate-800 dark:text-white shadow-xs">
                <ArrowRight strokeWidth={1.5} className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div ref={coursesCarouselRef} className="w-full overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-8 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex gap-6 w-max">
              
              {/* Card 1 */}
              <div className="w-[300px] h-[450px] md:w-[350px] md:h-[520px] rounded-[2rem] overflow-hidden relative snap-start group cursor-pointer flex-shrink-0 border border-slate-200 dark:border-white/10 shadow-xl">
                <Image src="/course_finance_1783622322975.png" alt="IP Leadership" fill sizes="(max-width: 768px) 300px, 350px" className="object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8 w-full z-10">
                  <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider mb-2 block">Leadership Series</span>
                  <h3 className="text-white font-bold text-2xl mb-2 leading-snug">IP Leadership Masterclass</h3>
                  <p className="text-slate-300 text-sm mb-6 leading-relaxed">Navigate global patent prosecution and corporate strategy.</p>
                  <Link href="/platform/resources/career-leadership" className="inline-block bg-[#ffd05b] text-black text-xs font-bold px-6 py-2.5 rounded-full hover:bg-[#e5bb52] transition-colors">
                    Explore Series
                  </Link>
                </div>
              </div>

              {/* Card 2 */}
              <div className="w-[300px] h-[450px] md:w-[350px] md:h-[520px] rounded-[2rem] overflow-hidden relative snap-start group cursor-pointer flex-shrink-0 border border-slate-200 dark:border-white/10 shadow-xl">
                <Image src="/course_yoga_1783622333453.png" alt="Trademarks" fill sizes="(max-width: 768px) 300px, 350px" className="object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8 w-full z-10">
                  <span className="text-[10px] font-black uppercase text-orange-400 tracking-wider mb-2 block">Webinar Replay</span>
                  <h3 className="text-white font-bold text-2xl mb-2 leading-snug">Global Trademarks Webinar</h3>
                  <p className="text-slate-300 text-sm mb-6 leading-relaxed">Stay updated with brand protection across EUIPO and USPTO.</p>
                  <Link href="/platform/resources/webinars" className="inline-block bg-[#f99d3e] text-black text-xs font-bold px-6 py-2.5 rounded-full hover:bg-[#e08d37] transition-colors">
                    Watch Webinar
                  </Link>
                </div>
              </div>

              {/* Card 3 */}
              <div className="w-[300px] h-[450px] md:w-[350px] md:h-[520px] rounded-[2rem] overflow-hidden relative snap-start group cursor-pointer flex-shrink-0 border border-slate-200 dark:border-white/10 shadow-xl">
                <Image src="/course_speaking_1783622343431.png" alt="AI in IP" fill sizes="(max-width: 768px) 300px, 350px" className="object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8 w-full z-10">
                  <span className="text-[10px] font-black uppercase text-purple-300 tracking-wider mb-2 block">Tech Briefing</span>
                  <h3 className="text-white font-bold text-2xl mb-2 leading-snug">AI & Copyright in Europe</h3>
                  <p className="text-slate-300 text-sm mb-6 leading-relaxed">Evaluating machine learning training data legalities.</p>
                  <Link href="/platform/resources/articles-insights" className="inline-block bg-[#b892ff] text-black text-xs font-bold px-6 py-2.5 rounded-full hover:bg-[#a57aff] transition-colors">
                    Read Article
                  </Link>
                </div>
              </div>

              {/* Card 4 */}
              <div className="w-[300px] h-[450px] md:w-[350px] md:h-[520px] rounded-[2rem] overflow-hidden relative snap-start group cursor-pointer flex-shrink-0 border border-slate-200 dark:border-white/10 shadow-xl">
                <Image src="/course_marketing_1783622354038.png" alt="Networking Event" fill sizes="(max-width: 768px) 300px, 350px" className="object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8 w-full z-10">
                  <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider mb-2 block">Live Roundtable</span>
                  <h3 className="text-white font-bold text-2xl mb-2 leading-snug">Women in IP Annual Summit</h3>
                  <p className="text-slate-300 text-sm mb-6 leading-relaxed">Connect with managing partners and in-house directors globally.</p>
                  <Link href="/platform/events" className="inline-block bg-[#48d29b] text-black text-xs font-bold px-6 py-2.5 rounded-full hover:bg-[#3bb886] transition-colors">
                    View Events
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="w-full max-w-5xl mx-auto px-6 py-16 z-10 relative">
          <div className="text-center mb-12">
            <span className="bg-[#ff2a70]/15 text-[#ff2a70] border border-[#ff2a70]/30 text-xs font-black uppercase tracking-wider px-4 py-1.5 rounded-full mb-3 inline-block">
              Frequently Asked Questions
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white">
              Everything You Need To Know
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "What is Women's IP World Alliance (WIPA)?",
                a: "WIPA is the premier global ecosystem connecting, empowering, and promoting women leaders across patents, trademarks, copyright, and intellectual property practice in 45+ jurisdictions."
              },
              {
                q: "How does LexIQ AI help IP professionals?",
                a: "LexIQ is an AI agent purpose-built for IP law. It answers complex questions regarding patent eligibility, trademark specimen criteria, and case law precedents with zero hallucinations."
              },
              {
                q: "What benefits do members receive?",
                a: "Members receive access to the live intelligence feed, masterclass webinars, the verified firm directory, 35% exclusive savings on publications, 1:1 mentorship, and VIP roundtables."
              }
            ].map((faq, idx) => (
              <div 
                key={idx} 
                className="bg-white dark:bg-[#0e0e14] rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden transition-all shadow-xs"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-6 text-left font-bold text-base md:text-lg text-slate-900 dark:text-white flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center shrink-0 text-slate-700 dark:text-slate-300">
                    {openFaq === idx ? <Minus size={16} /> : <Plus size={16} />}
                  </div>
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-6 text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed border-t border-slate-100 dark:border-white/5 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Final Grand CTA Banner */}
        <section className="w-full max-w-7xl mx-auto px-6 py-12 mb-20 z-10 relative">
          <div className="p-[2px] rounded-[2.5rem] bg-gradient-to-r from-[#d946ef] via-[#ff2a70] to-[#f97316] shadow-2xl shadow-pink-500/20">
            <div className="bg-[#0a0a0e] rounded-[2.4rem] p-10 md:p-16 text-white text-center relative overflow-hidden">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-6 relative z-10 leading-tight">
                Ready To Elevate Your Intellectual Property Career?
              </h2>
              <p className="max-w-2xl mx-auto text-slate-300 text-base md:text-lg mb-8 relative z-10 leading-relaxed font-medium">
                Join thousands of patent attorneys, corporate counsel, and trademark specialists driving innovation across the globe.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 relative z-10">
                <Link 
                  href="/signup" 
                  className="p-[2px] rounded-full bg-gradient-to-r from-[#d946ef] via-[#ff2a70] to-[#f97316] shadow-lg hover:scale-105 active:scale-95 transition-all group"
                >
                  <div className="bg-white text-black px-8 py-3.5 rounded-full font-black text-sm transition-colors">
                    Join The Alliance Now
                  </div>
                </Link>
                <Link 
                  href="/login" 
                  className="bg-white/10 border border-white/20 text-white font-bold text-sm px-8 py-3.5 rounded-full hover:bg-white/20 hover:scale-105 active:scale-95 transition-all"
                >
                  Sign In to Platform
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <PublicFooter />

      </main>
    </>
  );
}
