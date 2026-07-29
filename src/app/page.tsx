'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Phone, Play, X, Star, Sun, Sparkles, ArrowDown, ArrowLeft, ArrowRight, Plus, Minus, LogOut } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useAppStore } from '@/store/useAppStore';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import PublicHeader from '@/components/PublicHeader';
import PublicFooter from '@/components/PublicFooter';

const ROLLING_WORDS = ["Network", "Leadership", "Career", "Patents", "Knowledge"];

export default function Home() {
  const { isMenuOpen, toggleMenu, user, setUser } = useAppStore();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showSplash, setShowSplash] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    // Verify active session securely with the server
    supabase.auth.getUser().then(({ data: { user: authUser }, error }) => {
      if (error || !authUser) {
        setUser(null);
        return;
      }
      
      supabase
        .from("profiles")
        .select("full_name, avatar_url, cover_url")
        .eq("id", authUser.id)
        .single()
        .then(({ data }) => {
          setUser({
            name: data?.full_name || authUser.email?.split("@")[0] || "User",
            email: authUser.email!,
            id: authUser.id,
            avatar_url: data?.avatar_url || undefined,
            cover_url: data?.cover_url || undefined,
          });
        });
    });
  }, [setUser]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const coursesCarouselRef = useRef<HTMLDivElement>(null);
  const scrollResources = (direction: 'left' | 'right') => {
    if (coursesCarouselRef.current) {
      coursesCarouselRef.current.scrollBy({ left: direction === 'left' ? -350 : 350, behavior: 'smooth' });
    }
  };

  const teamCarouselRef = useRef<HTMLDivElement>(null);
  const scrollTeam = (direction: 'left' | 'right') => {
    if (teamCarouselRef.current) {
      teamCarouselRef.current.scrollBy({ left: direction === 'left' ? -320 : 320, behavior: 'smooth' });
    }
  };

  // Splash Screen Timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  // Word Cycler Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % ROLLING_WORDS.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <AnimatePresence>
        {showSplash && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#fbe8d5] bg-grid-pattern"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex items-center"
            >
              <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-[#131313] flex items-center">

                <span>WIPA</span>
              </h1>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="min-h-screen bg-[#fbe8d5] bg-grid-pattern flex flex-col font-sans overflow-x-hidden w-full max-w-[100vw]">
      
      {/* Navigation */}
      <PublicHeader />


      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 z-10 relative mt-12 mb-20 w-full overflow-hidden">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={!showSplash ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="w-full max-w-5xl mx-auto relative flex flex-col items-center"
        >
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[4.5rem] text-[#1a1a1a] leading-[1.1] mb-6 w-full px-2">
            <span className="block md:whitespace-nowrap">A Global, Empowering</span>
            <span className="block md:whitespace-nowrap mt-2">
              Community To Grow Your <span className="relative inline-flex items-center justify-center whitespace-nowrap">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={currentWordIndex}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="relative inline-block px-2"
                  >
                    {ROLLING_WORDS[currentWordIndex]}
                  </motion.span>
                </AnimatePresence>
                
                <svg className="absolute w-full h-[12px] -bottom-1 md:-bottom-2 left-0 text-[#f99d3e]" viewBox="0 0 200 20" preserveAspectRatio="none" fill="none">
                  <path d="M5,15 Q100,5 195,15" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </span>
            </span>
          </h2>
          
          <p className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-gray-800 font-medium leading-relaxed mb-10 px-4">
            Connect, collaborate, and grow professionally within the premier global Intellectual Property community for women.
          </p>
          
          <div className="flex items-center justify-center gap-6">
            <button className="bg-[#48d29b] text-black px-8 py-3 rounded-full font-medium hover:bg-[#3bb886] transition-colors border border-black/10 shadow-sm">
              About Us
            </button>
            <button className="hidden md:flex items-center gap-2 text-black font-medium hover:opacity-70 transition-opacity">
              <div className="w-8 h-8 rounded-full border-2 border-black flex items-center justify-center">
                <Play size={14} fill="currentColor" className="ml-1" />
              </div>
              Watch more
            </button>
            {user ? (
              <Link href="/platform" className="md:hidden flex items-center gap-2 text-black font-medium hover:opacity-70 transition-opacity">
                <div className="w-8 h-8 rounded-full border-2 border-black flex items-center justify-center bg-[#b892ff]">
                  <Play size={14} fill="currentColor" className="ml-1" />
                </div>
                Platform
              </Link>
            ) : (
              <Link href="/signup" className="md:hidden flex items-center gap-2 text-black font-medium hover:opacity-70 transition-opacity">
                <div className="w-8 h-8 rounded-full border-2 border-black flex items-center justify-center bg-[#b892ff]">
                  <Plus size={16} strokeWidth={3} />
                </div>
                Signup
              </Link>
            )}
          </div>
        </motion.div>
      </section>

      {/* Bottom Profiles Grid (Marquee) */}
      <section className="w-full overflow-hidden pb-8 z-10 relative">
        
        {/* SVG Defs for custom shapes */}
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
              transition: { staggerChildren: 0.1, delayChildren: 0.5 }
            }
          }}
        >
          {/* Infinite Marquee Container */}
          <motion.div
            className="flex items-end gap-3 md:gap-5 flex-nowrap w-max"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 25 }}
          >
            {/* Render two identical sets of items for seamless looping */}
            {[...Array(2)].map((_, setIndex) => (
              <div key={setIndex} className="flex items-end gap-3 md:gap-5 flex-nowrap">
                {/* Item 1 - Orange Pill */}
                <motion.div variants={{ hidden: { y: 50, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } } }} className="relative w-20 h-40 md:w-32 md:h-64 rounded-full bg-[#f99d3e] border border-black/10 overflow-hidden flex-shrink-0 flex items-end justify-center">
                  <div className="w-full h-full relative">
                     <Image src="/avatar_1.png" alt="User 1" fill className="object-cover object-top mix-blend-multiply grayscale scale-[1.15]" />
                  </div>
                </motion.div>
                
                {/* Item 2 - Purple Pill */}
                <motion.div variants={{ hidden: { y: 50, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } } }} className="relative w-28 h-40 md:w-44 md:h-64 rounded-full bg-[#b892ff] border border-black/10 overflow-hidden flex-shrink-0 flex items-end justify-center">
                   <div className="w-full h-full relative">
                     <Image src="/avatar_2.png" alt="User 2" fill className="object-cover object-top mix-blend-multiply grayscale scale-[1.1]" />
                  </div>
                </motion.div>

                {/* Item 3 - Red Peanut */}
                <motion.div variants={{ hidden: { y: 50, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } } }} className="relative w-32 h-40 md:w-52 md:h-64 bg-[#ff5241] flex-shrink-0 flex items-end justify-center group" style={{ clipPath: 'url(#peanut-clip)' }}>
                   <div className="absolute inset-0 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1)]"></div>
                   <div className="w-full h-full relative">
                     <Image src="/avatar_1.png" alt="User 3" fill className="object-cover object-top mix-blend-multiply grayscale scale-[1.1]" />
                  </div>
                </motion.div>

                {/* Item 4 - Yellow Arch */}
                <motion.div variants={{ hidden: { y: 50, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } } }} className="relative w-28 h-40 md:w-44 md:h-64 rounded-t-full bg-[#ffd05b] border border-black/10 border-b-0 overflow-hidden flex-shrink-0 flex items-end justify-center">
                  <div className="w-full h-full relative">
                     <Image src="/avatar_2.png" alt="User 4" fill className="object-cover object-top mix-blend-multiply grayscale scale-[1.1]" />
                  </div>
                </motion.div>

                {/* Item 5 - Green Peanut */}
                <motion.div variants={{ hidden: { y: 50, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } } }} className="relative w-32 h-40 md:w-52 md:h-64 bg-[#48d29b] flex-shrink-0 flex items-end justify-center group" style={{ clipPath: 'url(#peanut-clip)' }}>
                   <div className="absolute inset-0 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1)]"></div>
                   <div className="w-full h-full relative">
                     <Image src="/avatar_1.png" alt="User 5" fill className="object-cover object-top mix-blend-multiply grayscale scale-[1.1]" />
                  </div>
                </motion.div>

                {/* Item 6 - Blue Pill */}
                <motion.div variants={{ hidden: { y: 50, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } } }} className="relative w-28 h-40 md:w-44 md:h-64 rounded-full bg-[#6eb4ff] border border-black/10 overflow-hidden flex-shrink-0 flex items-end justify-center">
                   <div className="w-full h-full relative">
                     <Image src="/avatar_2.png" alt="User 6" fill className="object-cover object-top mix-blend-multiply grayscale scale-[1.1]" />
                  </div>
                </motion.div>

                {/* Item 7 - Peach Arch */}
                <motion.div variants={{ hidden: { y: 50, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } } }} className="relative w-28 h-40 md:w-44 md:h-64 rounded-t-full bg-[#ff9882] border border-black/10 border-b-0 overflow-hidden flex-shrink-0 flex items-end justify-center">
                   <div className="w-full h-full relative">
                     <Image src="/avatar_1.png" alt="User 7" fill className="object-cover object-top mix-blend-multiply grayscale scale-[1.1]" />
                  </div>
                </motion.div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Red Quote Section */}
      <section className="relative w-full py-16 md:py-48 flex items-center justify-center mt-0 md:mt-10">
        
        {/* Curved Background SVG */}
        <div className="absolute inset-0 w-full h-full -z-10 overflow-hidden">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full text-[#ff5241]">
            <path fill="currentColor" d="M 0 0 Q 50 15 100 0 L 100 100 Q 50 85 0 100 Z" />
          </svg>
        </div>

        <div className="max-w-5xl mx-auto px-6 relative flex flex-col md:flex-row items-end gap-10">
          <h3 className="font-serif text-3xl md:text-5xl lg:text-[3.5rem] leading-[1.2] text-[#1a1a1a]">
            Within The Global <Star className="inline-block w-8 h-8 md:w-12 md:h-12 -mt-2 fill-current" /> IP Sector, The Belief That We Can Empower Each Other Will Motivate Us <Sun className="inline-block w-8 h-8 md:w-12 md:h-12 -mt-2" /> To Achieve Greatness. Experience The Benefits Of A <span className="inline-flex items-center gap-2 border-[1.5px] border-black rounded-full px-4 py-1 pb-2 relative top-2">
              Global Network <Sparkles className="w-6 h-6 md:w-10 md:h-10 inline-block" />
            </span>
          </h3>

          {/* Downward Arrow Button */}
          <div className="hidden md:block flex-shrink-0 mb-4 md:mb-0">
            <button className="w-16 h-16 md:w-24 md:h-24 rounded-full border-[1.5px] border-black flex items-center justify-center hover:bg-black/5 transition-colors">
              <ArrowDown className="w-6 h-6 md:w-8 md:h-8" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="w-full max-w-7xl mx-auto px-6 py-10 md:py-24 z-10 relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 md:mb-12">
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#1a1a1a] max-w-2xl leading-[1.1]">
            Access exclusive IP resources, webinars, and events!
          </h2>
          
          <div className="hidden md:flex items-center gap-4">
            <button onClick={() => scrollResources('left')} className="w-14 h-14 rounded-full border border-black flex items-center justify-center hover:bg-black/5 transition-colors">
              <ArrowLeft strokeWidth={1} className="w-6 h-6" />
            </button>
            <button onClick={() => scrollResources('right')} className="w-14 h-14 rounded-full border border-black flex items-center justify-center hover:bg-black/5 transition-colors">
              <ArrowRight strokeWidth={1} className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div ref={coursesCarouselRef} className="w-full overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-8 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex gap-6 w-max">
            
            {/* Card 1 */}
            <div className="w-[300px] h-[450px] md:w-[350px] md:h-[520px] rounded-[1.5rem] overflow-hidden relative snap-start group cursor-pointer flex-shrink-0 border border-black/10">
              <Image src="/course_finance_1783622322975.png" alt="Finance Course" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-8 w-full z-10">
                <h3 className="text-white font-serif text-2xl mb-2 leading-snug">IP Leadership Masterclass</h3>
                <p className="text-white/80 text-sm mb-6 leading-relaxed">Navigate leadership in Patents & Trademarks.</p>
                <button className="bg-[#ffd05b] text-black text-sm font-semibold px-6 py-2 rounded-full hover:bg-[#e5bb52] transition-colors">
                  View Details
                </button>
              </div>
            </div>

            {/* Card 2 */}
            <div className="w-[300px] h-[450px] md:w-[350px] md:h-[520px] rounded-[1.5rem] overflow-hidden relative snap-start group cursor-pointer flex-shrink-0 border border-black/10">
              <Image src="/course_yoga_1783622333453.png" alt="Yoga Course" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-8 w-full z-10">
                <h3 className="text-white font-serif text-2xl mb-2 leading-snug">Global Trademarks Webinar</h3>
                <p className="text-white/80 text-sm mb-6 leading-relaxed">Stay updated with global trademark laws.</p>
                <button className="bg-[#f99d3e] text-black text-sm font-semibold px-6 py-2 rounded-full hover:bg-[#e08d37] transition-colors">
                  View Details
                </button>
              </div>
            </div>

            {/* Card 3 */}
            <div className="w-[300px] h-[450px] md:w-[350px] md:h-[520px] rounded-[1.5rem] overflow-hidden relative snap-start group cursor-pointer flex-shrink-0 border border-black/10">
              <Image src="/course_speaking_1783622343431.png" alt="Speaking Course" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-8 w-full z-10">
                <h3 className="text-white font-serif text-2xl mb-2 leading-snug">AI in Intellectual Property</h3>
                <p className="text-white/80 text-sm mb-6 leading-relaxed">Understanding AI's impact on copyright.</p>
                <button className="bg-[#b892ff] text-black text-sm font-semibold px-6 py-2 rounded-full hover:bg-[#a57aff] transition-colors">
                  View Details
                </button>
              </div>
            </div>

            {/* Card 4 */}
            <div className="w-[300px] h-[450px] md:w-[350px] md:h-[520px] rounded-[1.5rem] overflow-hidden relative snap-start group cursor-pointer flex-shrink-0 border border-black/10">
              <Image src="/course_marketing_1783622354038.png" alt="Marketing Course" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-8 w-full z-10">
                <h3 className="text-white font-serif text-2xl mb-2 leading-snug">Women in IP Networking Event</h3>
                <p className="text-white/80 text-sm mb-6 leading-relaxed">Connect with IP professionals globally.</p>
                <button className="bg-[#48d29b] text-black text-sm font-semibold px-6 py-2 rounded-full hover:bg-[#3bb886] transition-colors">
                  View Details
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full">
        {/* Row 1 */}
        <div className="flex flex-col md:flex-row w-full h-auto md:h-[700px]">
          {/* Left: Text */}
          <div className="w-full md:w-1/2 flex items-center justify-center p-12 md:p-24">
            <div className="max-w-md">
              <span className="inline-block bg-[#b892ff] text-black font-medium px-4 py-1.5 rounded-full text-sm mb-6 border border-black/20 shadow-sm">
                Our Features
              </span>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#1a1a1a] mb-6 leading-[1.15]">
                A Seamless Hub For Networking & Collaboration
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                Connect with professionals globally, join topic-based groups like Trademarks, Patents, and Start-ups, and build meaningful relationships.
              </p>
            </div>
          </div>
          {/* Right: Image */}
          <div className="w-full md:w-1/2 relative flex items-center justify-center h-[500px] md:h-auto overflow-hidden">
             <Image src="/feature_student_1783622505917.png" alt="Happy student holding books" fill className="object-cover object-center" />
          </div>
        </div>

        {/* Row 2 */}
        <div className="flex flex-col md:flex-row-reverse w-full h-auto md:h-[700px]">
          {/* Right: Text */}
          <div className="w-full md:w-1/2 flex items-center justify-center p-12 md:p-24">
            <div className="max-w-md">
              <span className="inline-block bg-[#f99d3e] text-black font-medium px-4 py-1.5 rounded-full text-sm mb-6 border border-black/20 shadow-sm">
                Our Features
              </span>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#1a1a1a] mb-6 leading-[1.15]">
                Access Resources & Events Anywhere
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                Connect with professionals globally, join topic-based groups like Trademarks, Patents, and Start-ups, and build meaningful relationships.
              </p>
            </div>
          </div>
          {/* Left: Image */}
          <div className="w-full md:w-1/2 relative flex items-center justify-center h-[500px] md:h-auto overflow-hidden">
             <Image src="/feature_phone_1783622518657.png" alt="Smiling woman on smartphone" fill className="object-cover object-center" />
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="w-full bg-[#fae9db] pt-12 md:pt-32 pb-12 md:pb-24 px-6 relative mt-8 md:mt-16">
        {/* Curved Top Background SVG */}
        <div className="absolute top-0 left-0 w-full h-16 md:h-24 -mt-16 md:-mt-24 overflow-hidden z-0">
           <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full text-[#fae9db]">
            <path fill="currentColor" d="M 0 100 L 0 0 Q 50 100 100 0 L 100 100 Z" />
          </svg>
        </div>
        
        <div className="max-w-7xl mx-auto z-10 relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 md:mb-16">
            <h2 className="font-serif text-4xl md:text-5xl lg:text-[4rem] text-[#1a1a1a] leading-[1.1] max-w-2xl">
              Meet Our IP Alliance<br />Leaders & Mentors
            </h2>
            
            <div className="hidden md:flex items-center gap-4">
              <button onClick={() => scrollTeam('left')} className="w-14 h-14 rounded-full border border-black flex items-center justify-center hover:bg-black/5 transition-colors">
                <ArrowLeft strokeWidth={1} className="w-6 h-6" />
              </button>
              <button onClick={() => scrollTeam('right')} className="w-14 h-14 rounded-full border border-black flex items-center justify-center hover:bg-black/5 transition-colors">
                <ArrowRight strokeWidth={1} className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Carousel */}
          <div ref={teamCarouselRef} className="w-full overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-8 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex gap-6 w-max">
              
              {/* Member 1 */}
              <div className="w-[280px] md:w-[320px] snap-start flex-shrink-0 group cursor-pointer">
                <div className="w-full aspect-[4/4.5] rounded-[1.5rem] bg-[#b892ff] mb-5 overflow-hidden relative border border-black">
                  <Image src="/team_1_1783622614612.png" alt="Wade Warren" fill className="object-cover object-bottom mix-blend-multiply grayscale group-hover:scale-105 transition-transform duration-700" />
                </div>
                <span className="inline-block border border-black rounded-full px-3 py-1 text-xs mb-3 font-medium">Washington</span>
                <h3 className="font-serif text-2xl font-bold text-[#1a1a1a] mb-1">Wade Warren</h3>
                <p className="text-gray-600 text-sm">Patent Attorney</p>
              </div>

              {/* Member 2 */}
              <div className="w-[280px] md:w-[320px] snap-start flex-shrink-0 group cursor-pointer">
                <div className="w-full aspect-[4/4.5] rounded-[1.5rem] bg-[#ffd05b] mb-5 overflow-hidden relative border border-black">
                  <Image src="/team_2_1783622628114.png" alt="Jenny Wilson" fill className="object-cover object-bottom mix-blend-multiply grayscale group-hover:scale-105 transition-transform duration-700" />
                </div>
                <span className="inline-block border border-black rounded-full px-3 py-1 text-xs mb-3 font-medium">New Mexico</span>
                <h3 className="font-serif text-2xl font-bold text-[#1a1a1a] mb-1">Jenny Wilson</h3>
                <p className="text-gray-600 text-sm">Trademark Specialist</p>
              </div>

              {/* Member 3 */}
              <div className="w-[280px] md:w-[320px] snap-start flex-shrink-0 group cursor-pointer">
                <div className="w-full aspect-[4/4.5] rounded-[1.5rem] bg-[#48d29b] mb-5 overflow-hidden relative border border-black">
                  <Image src="/team_3_1783622639486.png" alt="Kristin Watson" fill className="object-cover object-bottom mix-blend-multiply grayscale group-hover:scale-105 transition-transform duration-700" />
                </div>
                <span className="inline-block border border-black rounded-full px-3 py-1 text-xs mb-3 font-medium">Florida</span>
                <h3 className="font-serif text-2xl font-bold text-[#1a1a1a] mb-1">Kristin Watson</h3>
                <p className="text-gray-600 text-sm">IP Consultant</p>
              </div>

              {/* Member 4 */}
              <div className="w-[280px] md:w-[320px] snap-start flex-shrink-0 group cursor-pointer">
                <div className="w-full aspect-[4/4.5] rounded-[1.5rem] bg-[#f99d3e] mb-5 overflow-hidden relative border border-black">
                  <Image src="/team_4_1783622650804.png" alt="Ronald Richards" fill className="object-cover object-bottom mix-blend-multiply grayscale group-hover:scale-105 transition-transform duration-700" />
                </div>
                <span className="inline-block border border-black rounded-full px-3 py-1 text-xs mb-3 font-medium">New Jersey</span>
                <h3 className="font-serif text-2xl font-bold text-[#1a1a1a] mb-1">Ronald Richards</h3>
                <p className="text-gray-600 text-sm">Copyright Lawyer</p>
              </div>

              {/* Member 5 */}
              <div className="w-[280px] md:w-[320px] snap-start flex-shrink-0 group cursor-pointer">
                <div className="w-full aspect-[4/4.5] rounded-[1.5rem] bg-[#ff6b6b] mb-5 overflow-hidden relative border border-black">
                  <Image src="/avatar_1.png" alt="Eleanor Pena" fill className="object-cover object-bottom mix-blend-multiply grayscale group-hover:scale-105 transition-transform duration-700" />
                </div>
                <span className="inline-block border border-black rounded-full px-3 py-1 text-xs mb-3 font-medium">California</span>
                <h3 className="font-serif text-2xl font-bold text-[#1a1a1a] mb-1">Eleanor Pena</h3>
                <p className="text-gray-600 text-sm">Legal Counsel</p>
              </div>

              {/* Member 6 */}
              <div className="w-[280px] md:w-[320px] snap-start flex-shrink-0 group cursor-pointer">
                <div className="w-full aspect-[4/4.5] rounded-[1.5rem] bg-[#6eb4ff] mb-5 overflow-hidden relative border border-black">
                  <Image src="/avatar_2.png" alt="Albert Flores" fill className="object-cover object-bottom mix-blend-multiply grayscale group-hover:scale-105 transition-transform duration-700" />
                </div>
                <span className="inline-block border border-black rounded-full px-3 py-1 text-xs mb-3 font-medium">Texas</span>
                <h3 className="font-serif text-2xl font-bold text-[#1a1a1a] mb-1">Albert Flores</h3>
                <p className="text-gray-600 text-sm">Partner, IP Law</p>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="w-full bg-[#48d29b] pt-24 pb-48 px-6 relative mt-0 z-0">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start justify-between gap-16 relative z-10">
          
          {/* Left Content */}
          <div className="w-full lg:w-5/12 sticky top-12">
            <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl text-[#1a1a1a] mb-6 leading-tight">
              The Global IP<br />Community Welcomes You!
            </h2>
            <p className="text-[#1a1a1a]/80 text-lg mb-10 max-w-md leading-relaxed font-medium">
              Join discussions, share your expertise, and collaborate with women in the IP sector from around the world.
            </p>
            <button className="bg-white text-black font-semibold px-8 py-3.5 rounded-full hover:bg-white/90 transition-colors border border-black/10 shadow-sm">
              Join The Discussion
            </button>
          </div>

          {/* Right Content - Cards List */}
          <div className="w-full lg:w-7/12 flex flex-col gap-4">
            
            {/* Card 1 */}
            <div className="bg-white rounded-2xl p-4 pr-6 flex items-center justify-between gap-4 border border-black/10 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden relative flex-shrink-0 bg-yellow-100 border border-black/10">
                  <Image src="/team_2_1783622628114.png" alt="User" fill className="object-cover object-top mix-blend-multiply" />
                </div>
                <div>
                  <h4 className="font-serif text-[#1a1a1a] text-lg font-bold mb-1 leading-snug max-w-md">Best practices for filing patents internationally across different jurisdictions?</h4>
                  <p className="text-gray-500 text-xs font-semibold">@Patents Group</p>
                </div>
              </div>
              <div className="flex-shrink-0">
                <span className="inline-block border border-black rounded-full px-4 py-1.5 text-xs font-semibold text-black">36 Answers</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-2xl p-4 pr-6 flex items-center justify-between gap-4 border border-black/10 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden relative flex-shrink-0 bg-purple-100 border border-black/10">
                  <Image src="/team_1_1783622614612.png" alt="User" fill className="object-cover object-top mix-blend-multiply" />
                </div>
                <div>
                  <h4 className="font-serif text-[#1a1a1a] text-lg font-bold mb-1 leading-snug max-w-md">How is AI impacting copyright laws and creator rights in Europe?</h4>
                  <p className="text-gray-500 text-xs font-semibold">@Patents Group</p>
                </div>
              </div>
              <div className="flex-shrink-0">
                <span className="inline-block bg-[#b892ff] border border-black/10 rounded-full px-4 py-1.5 text-xs font-semibold text-black">36 Answers</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-2xl p-4 pr-6 flex items-center justify-between gap-4 border border-black/10 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden relative flex-shrink-0 bg-orange-100 border border-black/10">
                  <Image src="/team_4_1783622650804.png" alt="User" fill className="object-cover object-top mix-blend-multiply" />
                </div>
                <div>
                  <h4 className="font-serif text-[#1a1a1a] text-lg font-bold mb-1 leading-snug max-w-md">Looking for a co-counsel or referral in Japan for a trademark dispute.</h4>
                  <p className="text-gray-500 text-xs font-semibold">@Patents Group</p>
                </div>
              </div>
              <div className="flex-shrink-0">
                <span className="inline-block border border-black rounded-full px-4 py-1.5 text-xs font-semibold text-black">36 Answers</span>
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-white rounded-2xl p-4 pr-6 flex items-center justify-between gap-4 border border-black/10 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden relative flex-shrink-0 bg-green-100 border border-black/10">
                  <Image src="/avatar_1.png" alt="User" fill className="object-cover object-top mix-blend-multiply grayscale" />
                </div>
                <div>
                  <h4 className="font-serif text-[#1a1a1a] text-lg font-bold mb-1 leading-snug max-w-md">Looking for a co-counsel or referral in Japan for a trademark dispute.</h4>
                  <p className="text-gray-500 text-xs font-semibold">@Patents Group</p>
                </div>
              </div>
              <div className="flex-shrink-0">
                <span className="inline-block border border-black rounded-full px-4 py-1.5 text-xs font-semibold text-black">36 Answers</span>
              </div>
            </div>

            {/* Card 5 */}
            <div className="bg-white rounded-2xl p-4 pr-6 flex items-center justify-between gap-4 border border-black/10 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden relative flex-shrink-0 bg-pink-100 border border-black/10">
                  <Image src="/team_3_1783622639486.png" alt="User" fill className="object-cover object-top mix-blend-multiply" />
                </div>
                <div>
                  <h4 className="font-serif text-[#1a1a1a] text-lg font-bold mb-1 leading-snug max-w-md">Looking for a co-counsel or referral in Japan for a trademark dispute.</h4>
                  <p className="text-gray-500 text-xs font-semibold">@Patents Group</p>
                </div>
              </div>
              <div className="flex-shrink-0">
                <span className="inline-block border border-black rounded-full px-4 py-1.5 text-xs font-semibold text-black">36 Answers</span>
              </div>
            </div>

          </div>
        </div>

        {/* Curved Bottom White Background SVG */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10 pointer-events-none">
           <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-24 md:h-40 lg:h-64 text-white translate-y-[2px]">
            <path fill="currentColor" d="M 0 100 Q 50 0 100 100 Z" />
          </svg>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="w-full bg-white pt-12 md:pt-24 pb-32 px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Quote Icon */}
          <div className="mb-6">
            <span className="text-[5rem] md:text-[7rem] leading-none font-serif text-[#b892ff] block h-16 md:h-24" style={{ WebkitTextStroke: '2px black' }}>
              “
            </span>
          </div>
          
          {/* Quote Text */}
          <h2 className="font-serif text-3xl md:text-4xl lg:text-[2.75rem] text-[#1a1a1a] leading-[1.3] mb-12 max-w-4xl">
            “This platform has been invaluable for connecting with other women in IP, sharing resources, and staying informed on global legal trends.”
          </h2>
          
          {/* Author and Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            {/* Author */}
            <div className="flex items-center gap-5 w-full md:w-auto">
              <div className="w-16 h-20 md:w-20 md:h-24 bg-[#f99d3e] rounded-t-full rounded-b-2xl overflow-hidden relative border border-black flex-shrink-0">
                <Image src="/avatar_1.png" alt="Leslie Alexander" fill className="object-cover object-top mix-blend-multiply grayscale" />
              </div>
              <div>
                <h4 className="font-bold text-[#1a1a1a] text-lg md:text-xl mb-1">Leslie Alexander</h4>
                <p className="text-gray-500 text-xs md:text-sm font-medium">4140 Parker Rd. Allentown, New Mexico 31134</p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4 flex-shrink-0">
              <button className="w-14 h-14 md:w-16 md:h-16 rounded-full border border-black flex items-center justify-center hover:bg-black/5 transition-colors">
                <ArrowLeft strokeWidth={1} className="w-6 h-6 md:w-7 md:h-7" />
              </button>
              <button className="w-14 h-14 md:w-16 md:h-16 rounded-full border border-black flex items-center justify-center hover:bg-black/5 transition-colors">
                <ArrowRight strokeWidth={1} className="w-6 h-6 md:w-7 md:h-7" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="w-full bg-[#b892ff] pt-24 pb-32 px-6 relative z-0 mt-8 md:mt-16">
        
        {/* Curved Top Purple Background SVG */}
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-none z-10 pointer-events-none -translate-y-[95%]">
           <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-12 md:h-24 text-[#b892ff] translate-y-2">
            <path fill="currentColor" d="M 0 100 Q 50 0 100 100 Z" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto relative z-20">
          <h2 className="font-serif text-4xl md:text-5xl lg:text-[4.5rem] text-[#1a1a1a] mb-12 lg:mb-20 leading-[1.1]">
            Latest IP News<br />& Articles
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
            
            {/* Blog Post 1 */}
            <div className="group cursor-pointer">
              <div className="w-full aspect-[4/3] rounded-[2rem] overflow-hidden relative border-[1.5px] border-black mb-6">
                <Image src="/blog_1_1783622882746.png" alt="Blog Image 1" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <span className="bg-white border border-black/80 rounded-full px-5 py-1.5 text-xs font-semibold text-[#1a1a1a]">Updated Sep 20, 2022</span>
                <span className="bg-white border border-black/80 rounded-full px-5 py-1.5 text-xs font-semibold text-[#1a1a1a]">2090 Views</span>
              </div>
              
              <h3 className="font-serif text-2xl md:text-[1.75rem] font-bold text-[#1a1a1a] mb-4 leading-[1.25]">
                Navigating the New European Unitary Patent System
              </h3>
              
              <p className="text-[#1a1a1a]/80 text-sm md:text-base leading-relaxed max-w-lg">
                Stay updated with the latest changes in global intellectual property law, networking strategies, and professional development resources.
              </p>
            </div>

            {/* Blog Post 2 */}
            <div className="group cursor-pointer">
              <div className="w-full aspect-[4/3] rounded-[2rem] overflow-hidden relative border-[1.5px] border-black mb-6">
                <Image src="/blog_2_1783622901376.png" alt="Blog Image 2" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <span className="bg-white border border-black/80 rounded-full px-5 py-1.5 text-xs font-semibold text-[#1a1a1a]">Updated Sep 27, 2022</span>
                <span className="bg-white border border-black/80 rounded-full px-5 py-1.5 text-xs font-semibold text-[#1a1a1a]">1320 Views</span>
              </div>
              
              <h3 className="font-serif text-2xl md:text-[1.75rem] font-bold text-[#1a1a1a] mb-4 leading-[1.25]">
                Promoting Diversity and Leadership for Women in IP Law
              </h3>
              
              <p className="text-[#1a1a1a]/80 text-sm md:text-base leading-relaxed max-w-lg">
                Stay updated with the latest changes in global intellectual property law, networking strategies, and professional development resources.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Marquee Section */}
      <section className="w-full bg-white relative pb-24 overflow-hidden">
        
        {/* Purple Curve overlay from previous section */}
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-none z-10 pointer-events-none -translate-y-[1px]">
           <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-12 md:h-24 text-[#b892ff]">
            <path fill="currentColor" d="M 0 0 Q 50 100 100 0 Z" />
          </svg>
        </div>

        <div className="w-full border-t border-b border-black/20 pt-6 pb-2 flex flex-col gap-2 mt-20 md:mt-32">
          
          {/* Top Marquee (Moves Left) */}
          <div className="flex whitespace-nowrap overflow-hidden items-center border-b border-black/20 pb-6">
             <motion.div
               animate={{ x: ["0%", "-50%"] }}
               transition={{ ease: "linear", duration: 15, repeat: Infinity }}
               className="flex items-center gap-6 md:gap-10 min-w-max"
             >
               {[...Array(6)].map((_, i) => (
                 <div key={`top-${i}`} className="flex items-center gap-6 md:gap-10">
                   {/* Green 8-pointed star */}
                   <svg className="w-10 h-10 md:w-14 md:h-14 text-[#48d29b]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0l1.5 8.5 8.5 1.5-8.5 1.5-1.5 8.5-1.5-8.5-8.5-1.5 8.5-1.5z" />
                      <path d="M12 0l4 4 4-4-4 4 4 4-4-4-4 4 4-4-4-4 4 4-4-4z" transform="rotate(45 12 12)" />
                   </svg>
                   <span className="font-serif text-5xl md:text-7xl lg:text-[5.5rem] text-[#1a1a1a] tracking-tight">Women In IP &</span>
                   <span className="font-serif text-5xl md:text-7xl lg:text-[5.5rem] text-transparent tracking-tight" style={{ WebkitTextStroke: '1.5px #a3a3a3' }}>Global Network</span>
                 </div>
               ))}
             </motion.div>
          </div>

          {/* Bottom Marquee (Moves Right) */}
          <div className="flex whitespace-nowrap overflow-hidden items-center pt-4 pb-4">
             <motion.div
               animate={{ x: ["-50%", "0%"] }}
               transition={{ ease: "linear", duration: 15, repeat: Infinity }}
               className="flex items-center gap-6 md:gap-10 min-w-max"
             >
               {[...Array(6)].map((_, i) => (
                 <div key={`bottom-${i}`} className="flex items-center gap-6 md:gap-10">
                   {/* Red Badge/Sunburst */}
                   <svg className="w-10 h-10 md:w-14 md:h-14 text-[#ff5241]" viewBox="0 0 24 24" fill="currentColor">
                     <path d="M12 1l2.5 3 3.5-1 1.5 3.5 3.5 1.5-1 3.5 3 2.5-3 2.5 1 3.5-3.5 1.5-1.5 3.5-3.5-1-2.5 3-2.5-3-3.5 1-1.5-3.5-3.5-1.5 1-3.5-3-2.5 3-2.5-1-3.5 3.5-1.5 1.5-3.5 3.5 1z" />
                   </svg>
                   <span className="font-serif text-5xl md:text-7xl lg:text-[5.5rem] text-[#1a1a1a] tracking-tight">An Easier, More</span>
                   <span className="font-serif text-5xl md:text-7xl lg:text-[5.5rem] text-transparent tracking-tight" style={{ WebkitTextStroke: '1.5px #a3a3a3' }}>Powerful</span>
                   <span className="font-serif text-5xl md:text-7xl lg:text-[5.5rem] text-[#1a1a1a] tracking-tight">Platform</span>
                 </div>
               ))}
             </motion.div>
          </div>

        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full bg-[#fae9db] relative pt-16 md:pt-32 pb-24 md:pb-48 px-6 mt-8 md:mt-16 z-0">
        
        {/* Curved Top Beige Background SVG */}
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-none z-10 pointer-events-none -translate-y-[98%]">
           <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-16 md:h-32 text-[#fae9db]">
            <path fill="currentColor" d="M 0 100 L 0 100 Q 50 0 100 100 L 100 100 Z" />
          </svg>
        </div>

        <div className="max-w-4xl mx-auto relative z-20">
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#1a1a1a] mb-16 text-center leading-tight">
            Frequently<br />Asked Questions
          </h2>

          <div className="flex flex-col gap-4">
            {[
              "Which Tool Can Be Learned In The Shortest Time?",
              "Which Is The Ideal Tool For Creating Videos For Online Training?",
              "Which Of The ELearning Authoring Tools Is The Most Customizable?",
              "How To Design A Product That Can Grow Itself 10x In Year:",
              "Understanding Color Theory: The Color Wheel And Finding Complementary."
            ].map((question, index) => (
              <div 
                key={index} 
                className="bg-white rounded-full border border-black/20 shadow-sm overflow-hidden"
              >
                <button 
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 md:px-8 py-4 flex items-center justify-between text-left hover:bg-black/5 transition-colors"
                >
                  <span className="font-medium text-[#1a1a1a] text-sm md:text-base pr-4">{question}</span>
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-black flex items-center justify-center flex-shrink-0 bg-white">
                    {openFaq === index ? <Minus className="w-4 h-4 md:w-5 md:h-5 text-[#1a1a1a]" /> : <Plus className="w-4 h-4 md:w-5 md:h-5 text-[#1a1a1a]" />}
                  </div>
                </button>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-6 md:px-8 bg-white"
                    >
                      <p className="pb-6 text-gray-600 text-sm md:text-base">
                        Stay updated with the latest changes in global intellectual property law, networking strategies, and professional development resources.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="w-full bg-[#48d29b] relative pt-32 pb-24 px-6 z-10 mt-0">
        
        {/* Curved Top Green Background SVG */}
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-none z-10 pointer-events-none -translate-y-[98%]">
           <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-16 md:h-32 text-[#48d29b]">
            <path fill="currentColor" d="M 0 100 L 0 100 Q 50 0 100 100 L 100 100 Z" />
          </svg>
        </div>

        <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
          <h2 className="font-serif text-4xl md:text-5xl lg:text-[4rem] text-[#1a1a1a] mb-6 leading-tight">
            Join with us &<br />grow your Personal Skills
          </h2>
          <p className="text-[#1a1a1a]/80 text-base md:text-lg mb-12 max-w-2xl leading-relaxed font-medium">
            Connect with professionals globally, join topic-based groups like Trademarks, Patents, and Start-ups, and build meaningful relationships.
          </p>

          {/* Subscribe Form */}
          <div className="w-full max-w-lg relative flex items-center bg-white rounded-full p-1.5 border-[1.5px] border-black shadow-sm">
            <input 
              type="email" 
              placeholder="Enter Your Mail" 
              className="flex-1 bg-transparent border-none outline-none px-6 text-[#1a1a1a] placeholder-gray-500 font-medium"
            />
            <button className="bg-[#b892ff] text-black font-semibold px-8 py-3 rounded-full hover:bg-[#a57aff] transition-colors border border-black/20">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Footer Links Section */}
      <PublicFooter />

      </main>
    </>
  );
}
