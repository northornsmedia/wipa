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
  CheckCircle2
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
    title: "AI Inventorship Eligibility",
    prompt: "What are the USPTO and EPO baseline rules for naming AI systems as inventors?",
    response: "Both the USPTO and EPO require human inventive conception. Natural persons must demonstrate substantial creative contribution to the claimed subject matter. Automated generative outputs without human prompt engineering and verification fail inventorship thresholds."
  },
  {
    title: "UPC Injunction Standards",
    prompt: "How does the Unified Patent Court evaluate preliminary injunctions under FRAND terms?",
    response: "The UPC Court of Appeal requires patent proprietors to show clear validity with reasonable certainty while implementers must exhibit genuine willingness to enter into a FRAND license with verifiable escrow guarantees."
  },
  {
    title: "Trademark Clearance in Europe",
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

      <main className="min-h-screen bg-[#fdf6ec] bg-grid-pattern flex flex-col font-sans overflow-x-hidden w-full max-w-[100vw]">
        
        {/* Navigation */}
        <PublicHeader />

        {/* Hero Section */}
        <section className="flex-1 flex flex-col items-center justify-center text-center px-4 z-10 relative mt-8 md:mt-12 mb-16 w-full overflow-hidden">
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={!showSplash ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full max-w-5xl mx-auto relative flex flex-col items-center"
          >
            
            {/* Top Floating Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-[#5a32fa]/10 border border-[#5a32fa]/20 px-4 py-1.5 mb-6 shadow-2xs">
              <Sparkles size={14} className="text-[#5a32fa] animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#5a32fa]">
                Premier Global IP Ecosystem
              </span>
            </div>

            {/* Editorial Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] text-[#131313] leading-[1.12] mb-6 w-full px-2 tracking-tight">
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
                      className="relative inline-block px-2 text-[#131313]"
                    >
                      {ROLLING_WORDS[currentWordIndex]}
                    </motion.span>
                  </AnimatePresence>
                  
                  {/* Handwritten Underline SVG Curve */}
                  <svg 
                    className="absolute w-full h-[14px] -bottom-1 md:-bottom-2 left-0 text-[#f99d3e]" 
                    viewBox="0 0 200 20" 
                    preserveAspectRatio="none" 
                    fill="none"
                  >
                    <path d="M5,15 Q100,5 195,15" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                  </svg>
                </span>
              </span>
            </h1>
            
            <p className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-gray-800 font-medium leading-relaxed mb-10 px-4">
              Connect, collaborate, and grow professionally within the premier global Intellectual Property community for women.
            </p>
            
            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              <Link 
                href="/about" 
                className="bg-[#48d29b] text-black px-8 py-3.5 rounded-full font-bold text-sm hover:bg-[#3bb886] hover:scale-105 active:scale-95 transition-all border border-black/10 shadow-sm"
              >
                About Us
              </Link>

              <button 
                onClick={() => setIsVideoOpen(true)}
                className="flex items-center gap-2.5 text-black font-bold text-sm hover:opacity-80 transition-opacity bg-white/70 px-6 py-3.5 rounded-full border border-black/10 shadow-2xs hover:scale-105 active:scale-95"
              >
                <div className="w-6 h-6 rounded-full border-2 border-black flex items-center justify-center bg-white">
                  <Play size={10} fill="currentColor" className="ml-0.5 text-black" />
                </div>
                <span>Watch more</span>
              </button>

              <Link 
                href="/platform" 
                className="bg-[#5a32fa] text-white px-8 py-3.5 rounded-full font-bold text-sm hover:bg-[#4924df] hover:scale-105 active:scale-95 transition-all shadow-md shadow-[#5a32fa]/20"
              >
                Explore Platform ➔
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
              className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
              onClick={() => setIsVideoOpen(false)}
            >
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-4xl bg-slate-900 border border-white/20 rounded-3xl overflow-hidden shadow-2xl relative"
              >
                <div className="p-4 border-b border-white/10 flex items-center justify-between text-white">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-orange-500 animate-pulse" />
                    <span className="font-bold text-sm uppercase tracking-wider">WIPA Platform Overview</span>
                  </div>
                  <button 
                    onClick={() => setIsVideoOpen(false)}
                    className="p-1 rounded-full text-slate-400 hover:text-white transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="aspect-video w-full bg-black relative flex flex-col items-center justify-center p-8 text-center text-white">
                  <div className="w-16 h-16 rounded-full bg-[#5a32fa] flex items-center justify-center mb-4 shadow-lg animate-bounce">
                    <Play size={28} fill="currentColor" className="ml-1 text-white" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black mb-2">Welcome to Women's IP World Alliance</h3>
                  <p className="max-w-xl text-slate-300 text-sm mb-6 leading-relaxed">
                    Connecting women in patents, trademarks, copyright, and IP leadership across 45+ jurisdictions with AI intelligence and exclusive masterclasses.
                  </p>
                  <Link 
                    href="/signup" 
                    className="bg-orange-500 hover:bg-orange-600 text-white font-black px-8 py-3 rounded-full text-sm transition-all shadow-lg"
                  >
                    Join The Alliance Today
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Profiles Grid (Infinite Marquee) */}
        <section className="w-full overflow-hidden pb-12 z-10 relative">
          
          <svg width="0" height="0" className="absolute">
            <defs>
              <clipPath id="peanut-clip" clipPathUnits="objectBoundingBox">
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
                  <motion.div className="relative w-20 h-40 md:w-32 md:h-64 rounded-full bg-[#f99d3e] border border-black/10 overflow-hidden flex-shrink-0 flex items-end justify-center">
                    <div className="w-full h-full relative">
                      <Image src="/avatar_1.png" alt="User 1" fill sizes="(max-width: 768px) 80px, 128px" className="object-cover object-top mix-blend-multiply grayscale scale-[1.15]" />
                    </div>
                  </motion.div>
                  
                  {/* Item 2 - Purple Pill */}
                  <motion.div className="relative w-28 h-40 md:w-44 md:h-64 rounded-full bg-[#b892ff] border border-black/10 overflow-hidden flex-shrink-0 flex items-end justify-center">
                    <div className="w-full h-full relative">
                      <Image src="/avatar_2.png" alt="User 2" fill sizes="(max-width: 768px) 112px, 176px" className="object-cover object-top mix-blend-multiply grayscale scale-[1.1]" />
                    </div>
                  </motion.div>

                  {/* Item 3 - Red Peanut */}
                  <motion.div className="relative w-32 h-40 md:w-52 md:h-64 bg-[#ff5241] flex-shrink-0 flex items-end justify-center group" style={{ clipPath: 'url(#peanut-clip)' }}>
                    <div className="w-full h-full relative">
                      <Image src="/avatar_1.png" alt="User 3" fill sizes="(max-width: 768px) 128px, 208px" className="object-cover object-top mix-blend-multiply grayscale scale-[1.1]" />
                    </div>
                  </motion.div>

                  {/* Item 4 - Yellow Arch */}
                  <motion.div className="relative w-28 h-40 md:w-44 md:h-64 rounded-t-full bg-[#ffd05b] border border-black/10 border-b-0 overflow-hidden flex-shrink-0 flex items-end justify-center">
                    <div className="w-full h-full relative">
                      <Image src="/avatar_2.png" alt="User 4" fill sizes="(max-width: 768px) 112px, 176px" className="object-cover object-top mix-blend-multiply grayscale scale-[1.1]" />
                    </div>
                  </motion.div>

                  {/* Item 5 - Green Peanut */}
                  <motion.div className="relative w-32 h-40 md:w-52 md:h-64 bg-[#48d29b] flex-shrink-0 flex items-end justify-center group" style={{ clipPath: 'url(#peanut-clip)' }}>
                    <div className="w-full h-full relative">
                      <Image src="/avatar_1.png" alt="User 5" fill sizes="(max-width: 768px) 128px, 208px" className="object-cover object-top mix-blend-multiply grayscale scale-[1.1]" />
                    </div>
                  </motion.div>

                  {/* Item 6 - Blue Pill */}
                  <motion.div className="relative w-28 h-40 md:w-44 md:h-64 rounded-full bg-[#6eb4ff] border border-black/10 overflow-hidden flex-shrink-0 flex items-end justify-center">
                    <div className="w-full h-full relative">
                      <Image src="/avatar_2.png" alt="User 6" fill sizes="(max-width: 768px) 112px, 176px" className="object-cover object-top mix-blend-multiply grayscale scale-[1.1]" />
                    </div>
                  </motion.div>

                  {/* Item 7 - Peach Arch */}
                  <motion.div className="relative w-28 h-40 md:w-44 md:h-64 rounded-t-full bg-[#ff9882] border border-black/10 border-b-0 overflow-hidden flex-shrink-0 flex items-end justify-center">
                    <div className="w-full h-full relative">
                      <Image src="/avatar_1.png" alt="User 7" fill sizes="(max-width: 768px) 112px, 176px" className="object-cover object-top mix-blend-multiply grayscale scale-[1.1]" />
                    </div>
                  </motion.div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* Red Curve Quote Section */}
        <section className="relative w-full py-20 md:py-40 flex items-center justify-center mt-4">
          <div className="absolute inset-0 w-full h-full -z-10 overflow-hidden">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full text-[#ff5241]">
              <path fill="currentColor" d="M 0 0 Q 50 15 100 0 L 100 100 Q 50 85 0 100 Z" />
            </svg>
          </div>

          <div className="max-w-5xl mx-auto px-6 relative flex flex-col md:flex-row items-end gap-10">
            <h2 className="font-serif text-3xl md:text-5xl lg:text-[3.5rem] leading-[1.2] text-[#1a1a1a]">
              Within The Global <Star className="inline-block w-8 h-8 md:w-12 md:h-12 -mt-2 fill-current" /> IP Sector, The Belief That We Can Empower Each Other Will Motivate Us <Sun className="inline-block w-8 h-8 md:w-12 md:h-12 -mt-2" /> To Achieve Greatness. Experience The Benefits Of A <span className="inline-flex items-center gap-2 border-[1.5px] border-black rounded-full px-4 py-1 pb-2 relative top-2">
                Global Network <Sparkles className="w-6 h-6 md:w-10 md:h-10 inline-block" />
              </span>
            </h2>

            <div className="hidden md:block flex-shrink-0 mb-4 md:mb-0">
              <a href="#features" className="w-16 h-16 md:w-24 md:h-24 rounded-full border-[1.5px] border-black flex items-center justify-center hover:bg-black/5 transition-colors">
                <ArrowDown className="w-6 h-6 md:w-8 md:h-8" strokeWidth={1.5} />
              </a>
            </div>
          </div>
        </section>

        {/* Interactive LexIQ AI Playground Showcase */}
        <section id="features" className="w-full max-w-7xl mx-auto px-6 py-16 md:py-28 z-10 relative">
          <div className="bg-white rounded-[2.5rem] border border-black/10 p-8 md:p-14 shadow-xl overflow-hidden relative">
            
            <div className="flex flex-col lg:flex-row items-start justify-between gap-12">
              <div className="lg:w-1/2">
                <div className="inline-flex items-center gap-2 bg-[#5a32fa]/10 px-4 py-1.5 rounded-full text-xs font-black uppercase text-[#5a32fa] mb-4">
                  <Bot size={15} /> Specialized Legal Tech
                </div>
                <h2 className="font-serif text-4xl md:text-5xl text-[#1a1a1a] mb-6 leading-tight">
                  Meet LexIQ — The Only AI Specialized in Intellectual Property
                </h2>
                <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-8">
                  Trained on verified patent prosecution guidelines, trademark case law, and cross-border regulatory precedents. Experience pinpoint accuracy with zero hallucinations.
                </p>

                {/* Prompt Selectors */}
                <div className="flex flex-col gap-2.5">
                  {DEMO_AI_PROMPTS.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedPromptIndex(idx)}
                      className={`text-left px-5 py-3.5 rounded-2xl border text-sm font-bold transition-all flex items-center justify-between ${
                        selectedPromptIndex === idx
                          ? 'bg-[#5a32fa] text-white border-[#5a32fa] shadow-md shadow-[#5a32fa]/20'
                          : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                      }`}
                    >
                      <span>{item.title}</span>
                      <ArrowRight size={15} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Simulated Live AI Terminal */}
              <div className="lg:w-1/2 w-full bg-[#0d1322] border border-slate-800 rounded-3xl p-6 md:p-8 text-white shadow-2xl flex flex-col justify-between min-h-[380px]">
                <div>
                  <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
                    <div className="flex items-center gap-2.5">
                      <span className="h-3 w-3 rounded-full bg-emerald-500 animate-ping" />
                      <span className="font-black text-xs uppercase tracking-wider text-slate-300">LexIQ Active Agent</span>
                    </div>
                    <span className="text-[11px] font-mono text-purple-400 font-bold">WIPA Engine v2.4</span>
                  </div>

                  <div className="mb-4">
                    <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">User Query:</span>
                    <p className="text-sm font-semibold text-slate-200 mt-1">
                      "{DEMO_AI_PROMPTS[selectedPromptIndex].prompt}"
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/5">
                    <span className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles size={13} /> Legal Intelligence Analysis:
                    </span>
                    <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed mt-2">
                      {aiTypingText}
                      {isTyping && <span className="inline-block w-2 h-4 bg-orange-400 ml-1 animate-pulse" />}
                    </p>
                  </div>
                </div>

                <div className="pt-5 border-t border-white/10 flex items-center justify-between mt-6">
                  <span className="text-[11px] text-slate-400">Verified IP Case Precedents</span>
                  <Link 
                    href="/platform/ai" 
                    className="text-xs font-bold text-orange-400 hover:text-orange-300 transition-colors flex items-center gap-1"
                  >
                    Open Full LexIQ Chat ➔
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Resources & Masterclasses Carousel */}
        <section className="w-full max-w-7xl mx-auto px-6 py-10 md:py-20 z-10 relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 md:mb-12">
            <div>
              <span className="bg-[#b892ff]/20 text-[#5a32fa] text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-3 inline-block">
                Exclusive Content
              </span>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#1a1a1a] max-w-2xl leading-[1.1]">
                Access exclusive IP resources, webinars, and events!
              </h2>
            </div>
            
            <div className="hidden md:flex items-center gap-4">
              <button onClick={() => scrollResources('left')} className="w-14 h-14 rounded-full border border-black flex items-center justify-center hover:bg-black/5 transition-colors">
                <ArrowLeft strokeWidth={1.5} className="w-6 h-6" />
              </button>
              <button onClick={() => scrollResources('right')} className="w-14 h-14 rounded-full border border-black flex items-center justify-center hover:bg-black/5 transition-colors">
                <ArrowRight strokeWidth={1.5} className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div ref={coursesCarouselRef} className="w-full overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-8 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex gap-6 w-max">
              
              {/* Card 1 */}
              <div className="w-[300px] h-[450px] md:w-[350px] md:h-[520px] rounded-[2rem] overflow-hidden relative snap-start group cursor-pointer flex-shrink-0 border border-black/10 shadow-md">
                <Image src="/course_finance_1783622322975.png" alt="IP Leadership" fill sizes="(max-width: 768px) 300px, 350px" className="object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8 w-full z-10">
                  <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider mb-2 block">Leadership Series</span>
                  <h3 className="text-white font-serif text-2xl mb-2 leading-snug">IP Leadership Masterclass</h3>
                  <p className="text-white/80 text-sm mb-6 leading-relaxed">Navigate global patent prosecution and corporate strategy.</p>
                  <Link href="/platform/resources/career-leadership" className="inline-block bg-[#ffd05b] text-black text-xs font-bold px-6 py-2.5 rounded-full hover:bg-[#e5bb52] transition-colors">
                    Explore Series
                  </Link>
                </div>
              </div>

              {/* Card 2 */}
              <div className="w-[300px] h-[450px] md:w-[350px] md:h-[520px] rounded-[2rem] overflow-hidden relative snap-start group cursor-pointer flex-shrink-0 border border-black/10 shadow-md">
                <Image src="/course_yoga_1783622333453.png" alt="Trademarks" fill sizes="(max-width: 768px) 300px, 350px" className="object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8 w-full z-10">
                  <span className="text-[10px] font-black uppercase text-orange-400 tracking-wider mb-2 block">Webinar Replay</span>
                  <h3 className="text-white font-serif text-2xl mb-2 leading-snug">Global Trademarks Webinar</h3>
                  <p className="text-white/80 text-sm mb-6 leading-relaxed">Stay updated with brand protection across EUIPO and USPTO.</p>
                  <Link href="/platform/resources/webinars" className="inline-block bg-[#f99d3e] text-black text-xs font-bold px-6 py-2.5 rounded-full hover:bg-[#e08d37] transition-colors">
                    Watch Webinar
                  </Link>
                </div>
              </div>

              {/* Card 3 */}
              <div className="w-[300px] h-[450px] md:w-[350px] md:h-[520px] rounded-[2rem] overflow-hidden relative snap-start group cursor-pointer flex-shrink-0 border border-black/10 shadow-md">
                <Image src="/course_speaking_1783622343431.png" alt="AI in IP" fill sizes="(max-width: 768px) 300px, 350px" className="object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8 w-full z-10">
                  <span className="text-[10px] font-black uppercase text-purple-300 tracking-wider mb-2 block">Tech Briefing</span>
                  <h3 className="text-white font-serif text-2xl mb-2 leading-snug">AI & Copyright in Europe</h3>
                  <p className="text-white/80 text-sm mb-6 leading-relaxed">Evaluating machine learning training data legalities.</p>
                  <Link href="/platform/resources/articles-insights" className="inline-block bg-[#b892ff] text-black text-xs font-bold px-6 py-2.5 rounded-full hover:bg-[#a57aff] transition-colors">
                    Read Article
                  </Link>
                </div>
              </div>

              {/* Card 4 */}
              <div className="w-[300px] h-[450px] md:w-[350px] md:h-[520px] rounded-[2rem] overflow-hidden relative snap-start group cursor-pointer flex-shrink-0 border border-black/10 shadow-md">
                <Image src="/course_marketing_1783622354038.png" alt="Networking Event" fill sizes="(max-width: 768px) 300px, 350px" className="object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8 w-full z-10">
                  <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider mb-2 block">Live Roundtable</span>
                  <h3 className="text-white font-serif text-2xl mb-2 leading-snug">Women in IP Annual Summit</h3>
                  <p className="text-white/80 text-sm mb-6 leading-relaxed">Connect with managing partners and in-house directors globally.</p>
                  <Link href="/platform/events" className="inline-block bg-[#48d29b] text-black text-xs font-bold px-6 py-2.5 rounded-full hover:bg-[#3bb886] transition-colors">
                    View Events
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Global Impact Numbers Counter */}
        <section className="w-full bg-[#131318] text-white py-16 px-6 relative z-10">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-4 border-r border-white/10 last:border-none">
              <h3 className="text-4xl sm:text-5xl md:text-6xl font-black text-orange-400 mb-2">5,000+</h3>
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-300">IP Leaders & Counsel</p>
            </div>
            <div className="p-4 border-r border-white/10 last:border-none">
              <h3 className="text-4xl sm:text-5xl md:text-6xl font-black text-purple-400 mb-2">45+</h3>
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-300">Global Jurisdictions</p>
            </div>
            <div className="p-4 border-r border-white/10 last:border-none">
              <h3 className="text-4xl sm:text-5xl md:text-6xl font-black text-emerald-400 mb-2">1,200+</h3>
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-300">Intelligence Resources</p>
            </div>
            <div className="p-4">
              <h3 className="text-4xl sm:text-5xl md:text-6xl font-black text-amber-400 mb-2">35%</h3>
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-300">Member Savings</p>
            </div>
          </div>
        </section>

        {/* Meet Our IP Alliance Leaders & Mentors Carousel */}
        <section className="w-full bg-[#fae9db] pt-16 md:pt-28 pb-16 md:pb-24 px-6 relative mt-0">
          <div className="max-w-7xl mx-auto z-10 relative">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 md:mb-16">
              <div>
                <span className="bg-orange-500/10 text-orange-600 text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-3 inline-block">
                  Global Mentorship
                </span>
                <h2 className="font-serif text-4xl md:text-5xl lg:text-[4rem] text-[#1a1a1a] leading-[1.1] max-w-2xl">
                  Meet Our IP Alliance<br />Leaders & Mentors
                </h2>
              </div>
              
              <div className="hidden md:flex items-center gap-4">
                <button onClick={() => scrollTeam('left')} className="w-14 h-14 rounded-full border border-black flex items-center justify-center hover:bg-black/5 transition-colors">
                  <ArrowLeft strokeWidth={1.5} className="w-6 h-6" />
                </button>
                <button onClick={() => scrollTeam('right')} className="w-14 h-14 rounded-full border border-black flex items-center justify-center hover:bg-black/5 transition-colors">
                  <ArrowRight strokeWidth={1.5} className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div ref={teamCarouselRef} className="w-full overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-8 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              <div className="flex gap-6 w-max">
                
                {/* Member 1 */}
                <div className="w-[280px] md:w-[320px] snap-start flex-shrink-0 group cursor-pointer">
                  <div className="w-full aspect-[4/4.5] rounded-[2rem] bg-[#b892ff] mb-5 overflow-hidden relative border border-black shadow-md">
                    <Image src="/team_1_1783622614612.png" alt="Wade Warren" fill className="object-cover object-bottom mix-blend-multiply grayscale group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <span className="inline-block border border-black rounded-full px-3 py-1 text-xs mb-3 font-medium bg-white">Washington</span>
                  <h3 className="font-serif text-2xl font-bold text-[#1a1a1a] mb-1">Sarah Jenkins</h3>
                  <p className="text-gray-600 text-sm">Patent Litigation Partner</p>
                </div>

                {/* Member 2 */}
                <div className="w-[280px] md:w-[320px] snap-start flex-shrink-0 group cursor-pointer">
                  <div className="w-full aspect-[4/4.5] rounded-[2rem] bg-[#ffd05b] mb-5 overflow-hidden relative border border-black shadow-md">
                    <Image src="/team_2_1783622628114.png" alt="Jenny Wilson" fill className="object-cover object-bottom mix-blend-multiply grayscale group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <span className="inline-block border border-black rounded-full px-3 py-1 text-xs mb-3 font-medium bg-white">London</span>
                  <h3 className="font-serif text-2xl font-bold text-[#1a1a1a] mb-1">Jenny Wilson</h3>
                  <p className="text-gray-600 text-sm">Trademark Specialist</p>
                </div>

                {/* Member 3 */}
                <div className="w-[280px] md:w-[320px] snap-start flex-shrink-0 group cursor-pointer">
                  <div className="w-full aspect-[4/4.5] rounded-[2rem] bg-[#48d29b] mb-5 overflow-hidden relative border border-black shadow-md">
                    <Image src="/team_3_1783622639486.png" alt="Kristin Watson" fill className="object-cover object-bottom mix-blend-multiply grayscale group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <span className="inline-block border border-black rounded-full px-3 py-1 text-xs mb-3 font-medium bg-white">Munich</span>
                  <h3 className="font-serif text-2xl font-bold text-[#1a1a1a] mb-1">Kristin Watson</h3>
                  <p className="text-gray-600 text-sm">UPC Legal Consultant</p>
                </div>

                {/* Member 4 */}
                <div className="w-[280px] md:w-[320px] snap-start flex-shrink-0 group cursor-pointer">
                  <div className="w-full aspect-[4/4.5] rounded-[2rem] bg-[#f99d3e] mb-5 overflow-hidden relative border border-black shadow-md">
                    <Image src="/team_4_1783622650804.png" alt="Ronald Richards" fill className="object-cover object-bottom mix-blend-multiply grayscale group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <span className="inline-block border border-black rounded-full px-3 py-1 text-xs mb-3 font-medium bg-white">Singapore</span>
                  <h3 className="font-serif text-2xl font-bold text-[#1a1a1a] mb-1">Ronald Richards</h3>
                  <p className="text-gray-600 text-sm">APAC Corporate Counsel</p>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="w-full max-w-5xl mx-auto px-6 py-20 z-10 relative">
          <div className="text-center mb-12">
            <span className="bg-[#48d29b]/20 text-[#2a8b65] text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-3 inline-block">
              Frequently Asked Questions
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-[#1a1a1a]">
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
                className="bg-white rounded-2xl border border-black/10 overflow-hidden transition-all shadow-xs"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-6 text-left font-bold text-base md:text-lg text-[#1a1a1a] flex items-center justify-between gap-4"
                >
                  <span>{faq.q}</span>
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                    {openFaq === idx ? <Minus size={16} /> : <Plus size={16} />}
                  </div>
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-6 text-gray-600 text-sm md:text-base leading-relaxed border-t border-slate-100 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA Banner */}
        <section className="w-full max-w-7xl mx-auto px-6 py-12 mb-20 z-10 relative">
          <div className="bg-gradient-to-r from-[#5a32fa] via-[#7c3aed] to-[#ff2a70] rounded-[2.5rem] p-10 md:p-16 text-white text-center shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10 pointer-events-none" />
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-6 relative z-10 leading-tight">
              Ready To Expand Your Global IP Career?
            </h2>
            <p className="max-w-2xl mx-auto text-white/90 text-base md:text-lg mb-8 relative z-10 leading-relaxed font-medium">
              Join thousands of patent attorneys, corporate counsel, and trademark specialists driving innovation across the globe.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 relative z-10">
              <Link 
                href="/signup" 
                className="bg-white text-black font-black text-sm px-8 py-4 rounded-full hover:bg-slate-100 hover:scale-105 active:scale-95 transition-all shadow-lg"
              >
                Join The Alliance Now
              </Link>
              <Link 
                href="/login" 
                className="bg-black/30 border border-white/30 text-white font-bold text-sm px-8 py-4 rounded-full hover:bg-black/50 hover:scale-105 active:scale-95 transition-all"
              >
                Sign In to Platform
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <PublicFooter />

      </main>
    </>
  );
}
