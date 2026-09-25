// @ts-nocheck
'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Home, Heart, MessageSquare, Users, UserCheck, 
  Globe, Building2, Briefcase, Award, Calendar, 
  BookOpen, Sparkles, Gift, Moon, Sun, Settings, 
  LogOut, ChevronRight, ShieldCheck, Star, Radio, HelpCircle
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { supabase } from '@/lib/supabase';

interface MobileDrawerMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileDrawerMenu({ isOpen, onClose }: MobileDrawerMenuProps) {
  const router = useRouter();
  const user = useAppStore((state) => state.user);
  const isDarkMode = useAppStore((state) => state.isDarkMode);
  const toggleDarkMode = useAppStore((state) => state.toggleDarkMode);
  const setIsLexIQOpen = useAppStore((state) => state.setIsLexIQOpen);

  const handleLogout = async () => {
    onClose();
    await supabase.auth.signOut();
    useAppStore.getState().setUser(null);
    router.push('/login');
  };

  const handleNavigate = (path: string) => {
    onClose();
    router.push(path);
  };

  const handleLexIQ = () => {
    onClose();
    setIsLexIQOpen(true);
  };

  const sections = [
    {
      title: 'Community & Social',
      items: [
        { name: 'Activity Feed', icon: Home, path: '/platform', color: 'text-indigo-500 bg-indigo-500/10' },
        { name: 'Liked Threads', icon: Heart, path: '/platform/liked-threads', color: 'text-rose-500 bg-rose-500/10' },
        { name: 'Discussion Forums', icon: MessageSquare, path: '/platform/forums', color: 'text-amber-500 bg-amber-500/10' },
        { name: 'Specialty Groups', icon: Users, path: '/platform/groups', color: 'text-purple-500 bg-purple-500/10' },
        { name: 'Mentorship Hub', icon: UserCheck, path: '/platform/mentorship', color: 'text-teal-500 bg-teal-500/10' },
      ]
    },
    {
      title: 'Professional Directory',
      items: [
        { name: 'Members Directory', icon: Users, path: '/platform/members', color: 'text-sky-500 bg-sky-500/10' },
        { name: 'My Network', icon: Globe, path: '/platform/network', color: 'text-blue-500 bg-blue-500/10' },
        { name: 'IP Law Firms', icon: Building2, path: '/platform/resources/ip-firms', color: 'text-emerald-500 bg-emerald-500/10' },
        { name: 'Business Profiles', icon: Briefcase, path: '/platform/business', color: 'text-orange-500 bg-orange-500/10' },
        { name: 'Board of Directors', icon: Star, path: '/platform/board-members', color: 'text-amber-500 bg-amber-500/10' },
      ]
    },
    {
      title: 'Career & Knowledge',
      items: [
        { name: 'Jobs Board', icon: Briefcase, path: '/platform/jobs', color: 'text-emerald-500 bg-emerald-500/10' },
        { name: 'Quizzes & XP', icon: Award, path: '/platform/quizzes', color: 'text-fuchsia-500 bg-fuchsia-500/10' },
        { name: 'Leaderboard', icon: Award, path: '/platform/leaderboard', color: 'text-yellow-500 bg-yellow-500/10' },
        { name: 'Events & Calendar', icon: Calendar, path: '/platform/events', color: 'text-rose-500 bg-rose-500/10' },
        { name: '11 Resource Verticals', icon: BookOpen, path: '/platform/resources', color: 'text-[#ff2a5f] bg-[#ff2a5f]/10' },
      ]
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] md:hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Slide-Over Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 280 }}
            className="absolute top-0 right-0 bottom-0 w-[85vw] max-w-sm bg-white dark:bg-[#0b0f19] border-l border-gray-200 dark:border-gray-800 shadow-2xl flex flex-col z-10 overflow-hidden"
          >
            {/* Drawer Header with Close button */}
            <div className="p-4 border-b border-gray-100 dark:border-gray-800/80 flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-widest text-gray-400">Navigation Menu</span>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 text-gray-500 hover:text-gray-900 dark:hover:text-white flex items-center justify-center transition-colors active:scale-90"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 [scrollbar-width:none]">
              {/* User Identity Card */}
              {user ? (
                <div 
                  onClick={() => handleNavigate('/platform/profile')}
                  className="p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#151c2c] dark:to-[#1a2236] border border-gray-200/80 dark:border-gray-700/60 shadow-sm cursor-pointer active:scale-[0.98] transition-transform"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      {user.avatar_url ? (
                        <img src={user.avatar_url} alt={user.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-[#5a32fa]" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#5a32fa] to-[#ff90e8] text-white flex items-center justify-center font-black text-base shadow-md">
                          {user.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                      )}
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-[#151c2c] rounded-full" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate">{user.name}</h3>
                        <ShieldCheck size={14} className="text-sky-400 shrink-0" />
                      </div>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                      <div className="mt-1 flex items-center gap-1">
                        <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-[#5a32fa]/10 text-[#5a32fa] dark:text-[#ff90e8] border border-[#5a32fa]/20">
                          {user.membership_tier === 'in_house_counsel' ? 'In-House Counsel' : user.membership_tier === 'ip_professional' ? 'IP Professional' : user.membership_tier || 'Verified Counsel'}
                        </span>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-gray-400 shrink-0" />
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-center">
                  <p className="text-xs text-gray-500 mb-2">Sign in to access your network & profile</p>
                  <button onClick={() => handleNavigate('/login')} className="w-full py-2 bg-[#ff2a5f] text-white rounded-xl text-xs font-bold shadow-md">
                    Sign In
                  </button>
                </div>
              )}

              {/* Special AI Trigger Tile */}
              <button
                onClick={handleLexIQ}
                className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-[#5a32fa]/15 via-[#ff90e8]/15 to-purple-500/15 border border-[#5a32fa]/30 flex items-center justify-between text-left active:scale-[0.98] transition-transform shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#5a32fa]/20 via-[#ff90e8]/20 to-purple-500/20 border border-[#5a32fa]/30 flex items-center justify-center shadow-md p-1.5 overflow-hidden">
                    <img src="/sally-logo.png" alt="Sally 4.1 Pro" className="w-full h-full object-contain dark:invert" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1">
                      Sally 4.1 Pro
                      <span className="px-1.5 py-0.2 rounded text-[9px] bg-[#ff90e8] text-black font-black uppercase">AI</span>
                    </h4>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">Ask any patent, trademark, or IP question</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
              </button>

              {/* Categorized FB-Style Touch Tiles */}
              {sections.map((section, idx) => (
                <div key={idx} className="space-y-2">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 px-1">
                    {section.title}
                  </h4>
                  <div className="grid grid-cols-1 gap-1">
                    {section.items.map((item, itemIdx) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={itemIdx}
                          onClick={() => handleNavigate(item.path)}
                          className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-left active:scale-[0.98]"
                        >
                          <div className={`w-8 h-8 rounded-lg ${item.color} flex items-center justify-center shrink-0`}>
                            <Icon size={16} />
                          </div>
                          <span className="text-xs font-bold text-gray-700 dark:text-gray-200 flex-1">{item.name}</span>
                          <ChevronRight size={14} className="text-gray-400 opacity-60" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Utilities & Settings */}
              <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 px-1">
                  Utilities & Account
                </h4>

                <div className="grid grid-cols-1 gap-1">
                  <button
                    onClick={toggleDarkMode}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
                        {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
                      </div>
                      <span className="text-xs font-bold text-gray-700 dark:text-gray-200">
                        {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-gray-400">{isDarkMode ? 'DARK' : 'LIGHT'}</span>
                  </button>

                  <button
                    onClick={() => handleNavigate('/platform/gift')}
                    className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-left"
                  >
                    <div className="w-8 h-8 rounded-lg bg-pink-500/10 text-pink-500 flex items-center justify-center">
                      <Gift size={16} />
                    </div>
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-200">Gift a Membership</span>
                  </button>

                  <button
                    onClick={() => handleNavigate('/platform/settings')}
                    className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-left"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gray-500/10 text-gray-400 flex items-center justify-center">
                      <Settings size={16} />
                    </div>
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-200">Account Settings</span>
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 p-2.5 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors text-left"
                  >
                    <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center">
                      <LogOut size={16} />
                    </div>
                    <span className="text-xs font-bold">Log Out</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
