// @ts-nocheck
'use client';

import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

export default function PublicHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const [user, setUser] = useState<{name: string, email: string} | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user: authUser }, error }) => {
      if (error || !authUser) {
        setUser(null);
        return;
      }
      
      supabase
        .from("profiles")
        .select("full_name")
        .eq("id", authUser.id)
        .single()
        .then(({ data, error }) => {
          if (!error && data) {
            setUser({
              name: data.full_name || authUser.email?.split('@')[0] || "User",
              email: authUser.email || ""
            });
          } else {
             setUser(null);
          }
        });
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <>
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between z-50 relative">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-3 group">
            <img 
              src="/WIPA-Logo.png" 
              alt="Women's IP World Alliance" 
              className="h-9 md:h-10 w-auto object-contain group-hover:scale-105 transition-transform" 
            />
          </Link>
        </div>

        {/* Main Navigation */}
        <nav className="hidden md:flex items-center gap-8 font-medium text-[#131313]">
          <Link href="/" className="hover:text-[#f99d3e] transition-colors">Home</Link>
          <Link href="/about" className="hover:text-[#48d29b] transition-colors">About Us</Link>
          <Link href="/resources" className="hover:text-[#b892ff] transition-colors">Resources</Link>
          <Link href="/pricing" className="hover:text-[#ff5241] transition-colors">Pricing</Link>
          <Link href="/contact" className="hover:text-[#6eb4ff] transition-colors">Contact</Link>
        </nav>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-4 z-50 relative">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-black font-semibold bg-white dark:bg-[#0f172a]/50 px-4 py-2 rounded-full border border-black dark:border-white/20/10">
                Hi, {user.name} 👋
              </span>
              <Link 
                href="/platform"
                className="bg-[#b892ff] text-black px-6 py-2 rounded-full font-medium hover:bg-[#a57aff] hover:-translate-y-0.5 hover:scale-105 active:scale-95 transition-all duration-300 border border-black dark:border-white/20/10 shadow-sm hover:shadow-md block"
              >
                Platform
              </Link>
              <button 
                onClick={handleLogout}
                className="bg-[#ff5241] text-white px-6 py-2 rounded-full font-medium hover:bg-[#ff3b26] hover:-translate-y-0.5 hover:scale-105 active:scale-95 transition-all duration-300 border border-black dark:border-white/20/10 shadow-sm hover:shadow-md block"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link href="/login" className="text-black font-medium hover:bg-black/5 rounded-full transition-all px-5 py-2 active:scale-95 duration-200">
                Login
              </Link>
              <Link href="/signup" className="bg-[#b892ff] text-black px-6 py-2 rounded-full font-medium hover:bg-[#a57aff] hover:-translate-y-0.5 hover:scale-105 active:scale-95 transition-all duration-300 border border-black dark:border-white/20/10 shadow-sm hover:shadow-md block">
                Signup
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Menu (only visible on small screens) */}
        <button 
          onClick={toggleMenu}
          className="md:hidden text-black hover:opacity-70 transition-opacity z-50 relative"
        >
          {isMenuOpen ? <X size={32} strokeWidth={1} /> : <Menu size={32} strokeWidth={1} />}
        </button>
      </header>

      {/* Animated Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-white dark:bg-[#0f172a] z-40 flex flex-col pt-24 md:hidden overflow-y-auto px-6 pb-10"
          >
            <nav className="flex flex-col gap-3 w-full max-w-sm mx-auto mt-2">
              {[
                { name: 'Home', href: '/', color: 'bg-[#f99d3e]' },
                { name: 'About Us', href: '/about', color: 'bg-[#48d29b]' },
                { name: 'Resources', href: '/resources', color: 'bg-[#b892ff]' },
                { name: 'Pricing', href: '/pricing', color: 'bg-[#ff5241]' },
                { name: 'Contact', href: '/contact', color: 'bg-[#6eb4ff]' }
              ].map((item) => (
                <Link 
                  key={item.name}
                  onClick={toggleMenu} 
                  href={item.href} 
                  className={`w-full text-center py-2.5 rounded-lg font-bold text-lg uppercase tracking-tight text-[#131313] border-2 border-[#131313] shadow-[3px_3px_0px_0px_#131313] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all ${item.color}`}
                >
                  {item.name}
                </Link>
              ))}
              
              <div className="w-full h-1 bg-[#131313] my-3 rounded-full" />
              
              {user ? (
                <div className="flex flex-col gap-3 w-full">
                  <span className="text-sm font-bold text-center text-gray-500 dark:text-gray-400 mb-1">Logged in as {user.name}</span>
                  <Link onClick={toggleMenu} href="/platform" className="w-full text-center bg-[#b892ff] text-[#131313] px-4 py-2.5 rounded-lg font-bold text-lg border-2 border-[#131313] shadow-[3px_3px_0px_0px_#131313] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all">
                    Platform
                  </Link>
                  <button 
                    onClick={() => { handleLogout(); toggleMenu(); }}
                    className="w-full text-center bg-[#ff5241] text-[#131313] px-4 py-2.5 rounded-lg font-bold text-lg border-2 border-[#131313] shadow-[3px_3px_0px_0px_#131313] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3 w-full">
                  <Link onClick={toggleMenu} href="/login" className="w-full text-center bg-white dark:bg-[#0f172a] text-[#131313] px-4 py-2.5 rounded-lg font-bold text-lg border-2 border-[#131313] shadow-[3px_3px_0px_0px_#131313] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all">
                    Login
                  </Link>
                  <Link onClick={toggleMenu} href="/signup" className="w-full text-center bg-[#b892ff] text-[#131313] px-4 py-2.5 rounded-lg font-bold text-lg border-2 border-[#131313] shadow-[3px_3px_0px_0px_#131313] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all">
                    Signup
                  </Link>
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
