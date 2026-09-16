'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, 
  EyeOff, 
  Sun, 
  Moon, 
  Sparkles, 
  Heart, 
  Star, 
  Send, 
  ShieldCheck, 
  ArrowRight,
  User,
  CheckCircle2,
  AlertCircle,
  Globe,
  Lock,
  ChevronDown
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/store/useAppStore';
import ConstellationGrid from '@/components/ui/constellation-grid';
import AppLaunchSplash from '@/components/AppLaunchSplash';

const checkIsMobile = (): boolean => {
  if (typeof window === 'undefined') return false;
  return (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    Boolean((window as any).Capacitor?.isNativePlatform?.())
  );
};

const checkHasPersistedUser = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    const raw = localStorage.getItem('wipa-storage');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.state?.user?.id) return true;
    }
    return Object.keys(localStorage).some(
      (k) => (k.includes('auth-token') || k.startsWith('sb-')) && Boolean(localStorage.getItem(k)?.includes('access_token'))
    );
  } catch {
    return false;
  }
};

export default function Home() {
  const router = useRouter();
  const { user, setUser, isDarkMode, toggleDarkMode } = useAppStore();

  // Pending destination if user is already logged in (redirects only AFTER mandatory 4.2s splash)
  const [pendingRedirect, setPendingRedirect] = useState<string | null>(null);
  const [sessionLoaded, setSessionLoaded] = useState(false);

  // Code-based animated launch splash state (dismissed only when onComplete fires, shown at most once per session)
  const [showSplash, setShowSplash] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        if (sessionStorage.getItem('wipa_splash_seen') === '1') return false;
        const params = new URLSearchParams(window.location.search);
        if (params.get('splash') === 'done') return false;
      } catch (_) {}
    }
    return true;
  });

  // Auth form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [likedHeroPost, setLikedHeroPost] = useState(false);
  const [likeCount, setLikeCount] = useState(148);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetStatus, setResetStatus] = useState<{ success?: boolean; text?: string } | null>(null);

  // Check active session on mount
  useEffect(() => {
    const isMobile = checkIsMobile();

    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && session.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, avatar_url, cover_url, member_id')
            .eq('id', session.user.id)
            .single();

          setUser({
            name: profile?.full_name || session.user.email?.split('@')[0] || 'Member',
            email: session.user.email!,
            id: session.user.id,
            avatar_url: profile?.avatar_url || undefined,
            cover_url: profile?.cover_url || undefined,
            member_id: profile?.member_id || undefined,
          });

          // If splash was already seen, redirect to platform immediately
          if (typeof window !== 'undefined' && sessionStorage.getItem('wipa_splash_seen') === '1') {
            router.replace('/platform');
            return;
          }

          // Otherwise queue redirect to /platform once the initial splash finishes
          setPendingRedirect('/platform');
        }
      } catch (err) {
        console.error('Session check failed', err);
      } finally {
        setSessionLoaded(true);
      }
    };

    checkSession();
  }, [setUser, router]);

  // Dark/Light theme toggle
  const handleToggleTheme = () => {
    toggleDarkMode();
    if (typeof document !== 'undefined') {
      const nextDark = !isDarkMode;
      document.documentElement.classList.toggle('dark', nextDark);
      document.documentElement.style.colorScheme = nextDark ? 'dark' : 'light';
      try {
        const stored = JSON.parse(localStorage.getItem('wipa-storage') || '{}');
        stored.state = { ...(stored.state || {}), isDarkMode: nextDark };
        localStorage.setItem('wipa-storage', JSON.stringify(stored));
      } catch (_) {}
    }
  };

  // Sign In Handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }
    setLoading(true);
    setError(null);
    setMessage(null);

    const cleanEmail = email.trim();
    let authRes = await supabase.auth.signInWithPassword({
      email: cleanEmail.toLowerCase(),
      password: password,
    });

    if (authRes.error && cleanEmail !== cleanEmail.toLowerCase()) {
      authRes = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: password,
      });
    }

    const { data, error: authError } = authRes;

    if (authError) {
      if (authError.message.includes('Invalid login credentials') || authError.message.includes('invalid_grant')) {
        setError('Invalid email or password. Please verify your credentials.');
      } else if (authError.message === 'Failed to fetch') {
        setError('Network error. Please check your internet connection.');
      } else {
        setError(authError.message);
      }
      setLoading(false);
    } else if (data.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, avatar_url, cover_url, member_id')
        .eq('id', data.user.id)
        .single();

      setUser({
        name: profile?.full_name || data.user.email?.split('@')[0] || 'User',
        email: data.user.email!,
        id: data.user.id,
        avatar_url: profile?.avatar_url || undefined,
        cover_url: profile?.cover_url || undefined,
        member_id: profile?.member_id || undefined,
      });

      try {
        const { getDeviceId } = await import('@/lib/device');
        const deviceId = getDeviceId();
        await supabase
          .from('user_sessions')
          .upsert({
            user_id: data.user.id,
            device_id: deviceId,
            last_active_at: new Date().toISOString(),
          }, { onConflict: 'user_id, device_id' });
      } catch (err) {
        console.error('Device session registration failed', err);
      }

      router.push('/platform');
    }
  };

  // Social OAuth Login
  const handleOAuthLogin = async (provider: 'google' | 'azure') => {
    const { error: oAuthError } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (oAuthError) setError(oAuthError.message);
  };

  // Password Reset Trigger
  const handleSendPasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) {
      setResetStatus({ success: false, text: 'Please enter your email.' });
      return;
    }
    setResetLoading(true);
    setResetStatus(null);
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setResetLoading(false);
    if (error) {
      setResetStatus({ success: false, text: error.message });
    } else {
      setResetStatus({ success: true, text: 'Check your email for the reset link!' });
      setTimeout(() => {
        setIsResetModalOpen(false);
        setResetStatus(null);
      }, 3000);
    }
  };

  // Like interaction for hero mockup
  const handleToggleLike = () => {
    setLikedHeroPost((prev) => {
      const next = !prev;
      setLikeCount((c) => (next ? c + 1 : c - 1));
      return next;
    });
  };

  return (
    <>
      {/* Code-Based Cinematic App Launch Splash Overlay */}
      <AnimatePresence mode="wait">
        {showSplash && (
          <motion.div
            key="wipa-launch-splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            className="fixed inset-0 z-[99999] pointer-events-auto"
          >
            <AppLaunchSplash
              isReady={sessionLoaded}
              minDurationMs={4200}
              onComplete={() => {
                setShowSplash(false);
                try {
                  sessionStorage.setItem('wipa_splash_seen', '1');
                } catch (_) {}
                if (pendingRedirect) {
                  router.replace(pendingRedirect);
                }
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-[100dvh] h-auto lg:h-[100dvh] w-screen overflow-x-hidden overflow-y-auto lg:overflow-hidden bg-[#fafafa] dark:bg-[#07070a] text-slate-900 dark:text-white flex flex-col justify-between select-none relative transition-colors duration-500 font-sans pt-[max(env(safe-area-inset-top,0px),52px)] sm:pt-[max(env(safe-area-inset-top,0px),28px)] lg:pt-0">
      <ConstellationGrid
        decorative
        fill
        isDark={isDarkMode}
        showIntro={false}
        transparent
        className="pointer-events-none z-[1] opacity-45 dark:opacity-35"
      />

      {/* Background Ambient Glow Lighting */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {/* Top Left Gradient Orb */}
        <div className="absolute -top-40 -left-40 w-[34rem] h-[34rem] rounded-full bg-gradient-to-br from-pink-500/10 via-purple-600/10 to-transparent blur-3xl dark:from-pink-600/15 dark:via-purple-600/15 dark:to-transparent" />
        {/* Center Glow */}
        <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[42rem] h-[42rem] rounded-full bg-gradient-to-tr from-amber-500/5 via-fuchsia-500/10 to-indigo-600/10 blur-[110px] dark:from-amber-500/10 dark:via-fuchsia-600/15 dark:to-indigo-800/15" />
        {/* Right Accent Glow */}
        <div className="absolute -bottom-32 -right-32 w-[32rem] h-[32rem] rounded-full bg-gradient-to-tl from-blue-500/10 via-indigo-500/10 to-transparent blur-3xl dark:from-blue-600/15 dark:via-indigo-600/15" />
      </div>

      {/* Main Split Body Container */}
      <div className="relative z-10 flex-1 flex flex-col lg:flex-row items-center justify-start lg:justify-center w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 gap-4 lg:gap-14 xl:gap-20 overflow-visible lg:overflow-hidden">
        
        {/* LEFT COLUMN: Instagram-Style Visual Showcase with Tilted Mockups */}
        <div className="flex-1 flex flex-col items-center lg:items-start justify-center max-w-lg lg:max-w-xl w-full text-center lg:text-left pt-1 lg:pt-0">
          
          {/* Brand Header */}
          <div className="flex items-center gap-2.5 sm:gap-3 mb-2 sm:mb-4">
            <div className="relative group cursor-pointer">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#d946ef] via-[#ff2a70] to-[#f97316] opacity-70 blur-xs group-hover:opacity-100 transition-opacity" />
              <div className="relative h-11 w-11 sm:h-12 sm:w-12 rounded-xl bg-white dark:bg-[#111116] p-2 flex items-center justify-center border border-slate-200/80 dark:border-white/15 shadow-md">
                <Image
                  src="/WIPA-Logo.png"
                  alt="WIPA Logo"
                  width={40}
                  height={40}
                  priority
                  className="object-contain dark:brightness-110 drop-shadow-sm"
                />
              </div>
            </div>
            <div className="flex flex-col text-left">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight leading-tight bg-gradient-to-r from-slate-900 via-purple-950 to-slate-800 dark:from-white dark:via-purple-100 dark:to-zinc-300 bg-clip-text text-transparent">
                WIPA
              </span>
              <span className="text-[10px] sm:text-xs font-semibold tracking-wide text-purple-700 dark:text-purple-400 uppercase">
                Women&apos;s IP Alliance
              </span>
            </div>
          </div>

          {/* Punchy Instagram-Style Headline */}
          <h1 className="text-xl sm:text-3xl lg:text-4xl xl:text-[2.65rem] font-extrabold tracking-tight leading-[1.2] text-slate-900 dark:text-white mb-3 sm:mb-6">
            See everyday breakthroughs from{' '}
            <span className="inline-block bg-gradient-to-r from-[#ff2a70] via-[#d946ef] to-[#f97316] bg-clip-text text-transparent drop-shadow-xs">
              your global IP network.
            </span>
          </h1>

          {/* 3D Tilted Layered Phone & Story Showcase */}
          <div className="hidden lg:flex relative w-full max-w-[340px] sm:max-w-[420px] lg:max-w-[460px] h-[240px] sm:h-[290px] lg:h-[320px] items-center justify-center mt-1 sm:mt-2">
            
            {/* Back Left Card: LexIQ AI Patent Intelligence (Tilted -12deg) */}
            <motion.div
              initial={{ opacity: 0, x: -30, rotate: -12 }}
              animate={{ opacity: 1, x: 0, rotate: -12 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              whileHover={{ rotate: -8, scale: 1.03 }}
              className="absolute left-2 sm:left-6 top-4 sm:top-2 w-[160px] sm:w-[200px] h-[210px] sm:h-[260px] rounded-[1.75rem] bg-gradient-to-b from-indigo-950/90 to-purple-950/90 text-white p-3.5 shadow-2xl border border-indigo-500/30 backdrop-blur-md z-10 flex flex-col justify-between overflow-hidden cursor-pointer"
            >
              {/* Floating Emoji Pill at Top */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black/80 dark:bg-black/90 text-xs px-2.5 py-1 rounded-full border border-white/20 shadow-lg flex items-center gap-1.5 backdrop-blur-md">
                <span>🔮</span>
                <span>🧐</span>
                <span>⚖️</span>
                <span>✨</span>
              </div>

              <div className="pt-2">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-[10px]">
                    🤖
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-purple-200">LexIQ AI Intelligence</p>
                    <p className="text-[8px] text-zinc-400">UPC & Cross-Border IP</p>
                  </div>
                </div>
                <p className="text-[10px] text-zinc-200 leading-snug line-clamp-3 bg-white/5 p-2 rounded-xl border border-white/10">
                  &ldquo;EPO Patentability Standards for Autonomous AI Systems require human conception verification.&rdquo;
                </p>
              </div>

              <div className="flex items-center justify-between text-[9px] text-purple-300 font-semibold pt-2 border-t border-white/10">
                <span>LexIQ Copilot</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Live
                </span>
              </div>
            </motion.div>

            {/* Back Right Card: Alliance Networking Summit (Tilted +12deg) */}
            <motion.div
              initial={{ opacity: 0, x: 30, rotate: 12 }}
              animate={{ opacity: 1, x: 0, rotate: 12 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
              whileHover={{ rotate: 8, scale: 1.03 }}
              className="absolute right-2 sm:right-6 top-3 sm:top-1 w-[160px] sm:w-[200px] h-[210px] sm:h-[260px] rounded-[1.75rem] bg-slate-900/95 dark:bg-zinc-900/95 text-white p-3 shadow-2xl border border-slate-700/50 dark:border-white/15 backdrop-blur-md z-10 flex flex-col justify-between overflow-hidden cursor-pointer"
            >
              {/* Floating Green Star "Close Alliance" Badge */}
              <div className="absolute top-3 right-3 bg-emerald-500 text-slate-950 font-bold p-1 rounded-full shadow-lg flex items-center justify-center">
                <Star className="w-3 h-3 fill-slate-950 text-slate-950" />
              </div>

              <div className="relative w-full h-[120px] rounded-xl overflow-hidden mb-2">
                <Image
                  src="/resourceimg1.jpg"
                  alt="IP Summit"
                  fill
                  className="object-cover"
                  sizes="200px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <span className="absolute bottom-1.5 left-2 text-[9px] font-bold text-white bg-black/50 px-1.5 py-0.5 rounded-md backdrop-blur-xs">
                  Paris IP Summit
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-pink-500 to-amber-500 p-[1.5px]">
                  <Image
                    src="/mock_avatar_closefriends.jpg"
                    alt="Member"
                    width={20}
                    height={20}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-bold leading-tight">Maya Lin, Esq.</p>
                  <p className="text-[8px] text-zinc-400">Global IP Partner</p>
                </div>
              </div>
            </motion.div>

            {/* Center Front Story Phone Mockup (Hero) */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
              className="relative w-[180px] sm:w-[220px] lg:w-[240px] h-[240px] sm:h-[285px] lg:h-[310px] rounded-[2rem] bg-black p-2 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] border-2 border-slate-800/80 dark:border-white/20 z-20 flex flex-col justify-between overflow-hidden group"
            >
              {/* Dynamic Island / Notch */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-3 bg-zinc-950 rounded-full flex items-center justify-center gap-1 z-30 border border-white/10">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
                <div className="w-1 h-1 rounded-full bg-emerald-500" />
              </div>

              {/* Story Content Background */}
              <div className="relative w-full h-full rounded-[1.5rem] overflow-hidden flex flex-col justify-between p-3 text-white">
                <Image
                  src="/mock_story_photo.jpg"
                  alt="WIPA Story Highlight"
                  fill
                  priority
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="260px"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/85 pointer-events-none" />

                {/* Story Top Progress & Author Bar */}
                <div className="relative z-10 pt-2">
                  <div className="w-full h-0.5 bg-white/30 rounded-full overflow-hidden mb-2">
                    <div className="w-3/4 h-full bg-white rounded-full" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-6 rounded-full p-[1.5px] bg-gradient-to-tr from-[#ff2a70] via-[#d946ef] to-[#f97316]">
                        <Image
                          src="/mock_avatar_closefriends.jpg"
                          alt="Elena Vance"
                          width={24}
                          height={24}
                          className="w-full h-full rounded-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] font-bold tracking-tight">elenavance</span>
                          <CheckCircle2 className="w-2.5 h-2.5 text-blue-400 fill-blue-400/20" />
                        </div>
                        <span className="text-[8px] text-zinc-300">2h ago • WIPA Alliance</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Story Bottom Reaction Bar */}
                <div className="relative z-10 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full px-3 py-1.5 text-[9px] text-white/90 border border-white/20 flex items-center justify-between cursor-pointer transition-colors">
                      <span>Send message…</span>
                      <Send className="w-2.5 h-2.5 text-white/80" />
                    </div>
                    
                    <button
                      type="button"
                      onClick={handleToggleLike}
                      className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 active:scale-90 backdrop-blur-md border border-white/20 flex items-center justify-center transition-all cursor-pointer"
                      aria-label="Like story"
                    >
                      <Heart
                        className={`w-4 h-4 transition-transform duration-300 ${
                          likedHeroPost
                            ? 'text-pink-500 fill-pink-500 scale-110'
                            : 'text-white hover:text-pink-400'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between px-1 text-[8px] text-white/80 font-medium">
                    <span className="flex items-center gap-1">
                      ❤️ {likeCount} likes
                    </span>
                    <span>WIPA Member Circle</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Floating 3D Glowing Gradient Heart (Instagram Style) */}
            <motion.div
              animate={{ 
                y: [0, -8, 0],
                rotate: [0, -4, 0]
              }}
              transition={{ 
                duration: 3.5, 
                repeat: Infinity, 
                ease: 'easeInOut' 
              }}
              className="absolute -bottom-2 sm:bottom-2 left-0 sm:left-4 z-30 cursor-pointer"
              onClick={handleToggleLike}
            >
              <div className="relative group">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 opacity-75 blur-md group-hover:opacity-100 transition-opacity" />
                <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-[#ff2a70] via-[#d946ef] to-[#f97316] p-2.5 sm:p-3 flex items-center justify-center text-white shadow-xl">
                  <Heart className="w-full h-full fill-white" />
                </div>
              </div>
            </motion.div>

            {/* Floating Close Friends / Network Badge on Bottom Right */}
            <motion.div
              animate={{ 
                y: [0, 8, 0],
                rotate: [0, 3, 0]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                ease: 'easeInOut',
                delay: 0.5
              }}
              className="absolute -bottom-2 sm:bottom-2 right-0 sm:right-4 z-30"
            >
              <div className="relative group cursor-pointer">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full p-[2px] bg-gradient-to-tr from-[#ff2a70] via-[#d946ef] to-[#f97316] shadow-xl">
                  <Image
                    src="/mock_avatar_closefriends.jpg"
                    alt="Network friend"
                    width={48}
                    height={48}
                    className="w-full h-full rounded-full object-cover border-2 border-black"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-slate-950 p-1 rounded-full shadow-md">
                  <Star className="w-2.5 h-2.5 fill-slate-950 text-slate-950" />
                </div>
              </div>
            </motion.div>

          </div>
        </div>

        {/* RIGHT COLUMN: Modern Instagram / Meta Auth Portal */}
        <div className="w-full max-w-[380px] sm:max-w-[400px] lg:max-w-[380px] xl:max-w-[400px] flex flex-col justify-center items-center z-20">
          
          {/* Main Auth Card */}
          <div className="w-full bg-white/95 dark:bg-[#111116]/95 backdrop-blur-xl border border-slate-200/90 dark:border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-2xl shadow-purple-500/5 dark:shadow-black/60 transition-all duration-300">
            
            {/* If user is already logged in, show quick resume option */}
            {user ? (
              <div className="space-y-5 text-center py-2">
                <div className="w-16 h-16 rounded-full mx-auto p-[2px] bg-gradient-to-tr from-[#ff2a70] via-[#d946ef] to-[#f97316]">
                  <div className="w-full h-full rounded-full overflow-hidden bg-slate-100 dark:bg-zinc-800 flex items-center justify-center">
                    {user.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                    )}
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Welcome back, {user.name}!
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                    {user.email}
                  </p>
                </div>

                <div className="space-y-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => router.push('/platform')}
                    className="w-full bg-gradient-to-r from-[#0095f6] to-[#0077e6] hover:from-[#1877f2] hover:to-[#0064d2] text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
                  >
                    <span>Continue to Platform</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={async () => {
                      await supabase.auth.signOut();
                      setUser(null);
                    }}
                    className="w-full bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-zinc-300 font-medium py-2.5 px-4 rounded-xl text-xs transition-colors cursor-pointer border border-slate-200 dark:border-white/5"
                  >
                    Switch Account
                  </button>
                </div>
              </div>
            ) : (
              /* Instagram-Style Login Form */
              <form onSubmit={handleLogin} className="w-full space-y-3.5 sm:space-y-4">
                
                {/* Header Title */}
                <div className="text-left mb-1">
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Log into WIPA
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                    Connect with leaders in global intellectual property
                  </p>
                </div>

                {/* Status Messages */}
                {message && (
                  <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{message}</span>
                  </div>
                )}
                {error && (
                  <div className="bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Email / Username Input */}
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Mobile number, username or email"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck="false"
                    required
                    className="w-full bg-slate-50 dark:bg-[#1c1c22] border border-slate-300/80 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 rounded-xl py-2.5 sm:py-3 px-3.5 text-xs sm:text-sm font-normal outline-none focus:border-[#0095f6] dark:focus:border-[#0095f6] focus:ring-2 focus:ring-[#0095f6]/20 transition-all"
                  />
                </div>

                {/* Password Input */}
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck="false"
                    required
                    className="w-full bg-slate-50 dark:bg-[#1c1c22] border border-slate-300/80 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 rounded-xl py-2.5 sm:py-3 px-3.5 text-xs sm:text-sm font-normal outline-none focus:border-[#0095f6] dark:focus:border-[#0095f6] focus:ring-2 focus:ring-[#0095f6]/20 transition-all pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:text-zinc-400 dark:hover:text-white transition-colors cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Primary Log In Button (Instagram Blue with Glow) */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#0095f6] hover:bg-[#1877f2] active:scale-[0.98] disabled:opacity-50 text-white font-semibold py-2.5 sm:py-3 px-4 rounded-xl text-xs sm:text-sm shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer group"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <span>Log in</span>
                  )}
                </button>

                {/* Forgot Password Link */}
                <div className="text-center pt-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      setResetEmail(email);
                      setIsResetModalOpen(true);
                    }}
                    className="text-[11px] sm:text-xs font-normal text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white transition-colors cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Divider */}
                <div className="relative flex items-center justify-center my-2">
                  <div className="w-full border-t border-slate-200 dark:border-white/10" />
                  <span className="absolute bg-white dark:bg-[#111116] px-3 text-[10px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">
                    or
                  </span>
                </div>

                {/* Social Login Options */}
                <div className="grid grid-cols-2 gap-2.5">
                  {/* Google */}
                  <button
                    type="button"
                    onClick={() => handleOAuthLogin('google')}
                    className="w-full bg-slate-50 dark:bg-[#18181f] hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white rounded-xl py-2 px-3 flex items-center justify-center gap-2 text-xs font-medium transition-all active:scale-95 cursor-pointer shadow-2xs"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    <span>Google</span>
                  </button>

                  {/* Microsoft */}
                  <button
                    type="button"
                    onClick={() => handleOAuthLogin('azure')}
                    className="w-full bg-slate-50 dark:bg-[#18181f] hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white rounded-xl py-2 px-3 flex items-center justify-center gap-2 text-xs font-medium transition-all active:scale-95 cursor-pointer shadow-2xs"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 21 21">
                      <path d="M10 0H0v10h10V0z" fill="#f25022"/>
                      <path d="M21 0H11v10h10V0z" fill="#7fba00"/>
                      <path d="M10 11H0v10h10V11z" fill="#00a4ef"/>
                      <path d="M21 11H11v10h10V11z" fill="#ffb900"/>
                    </svg>
                    <span>Microsoft</span>
                  </button>
                </div>

                {/* Create New Account Button */}
                <div className="pt-1">
                  <Link
                    href="/signup"
                    className="w-full border border-slate-300 dark:border-white/20 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-800 dark:text-white font-semibold py-2.5 px-4 rounded-xl text-xs sm:text-sm transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                  >
                    Create new account
                  </Link>
                </div>

                {/* Brand Logo Tagline */}
                <div className="pt-2 text-center flex items-center justify-center gap-1.5 text-[11px] text-slate-400 dark:text-zinc-500">
                  <Sparkles className="w-3 h-3 text-pink-500" />
                  <span>Women&apos;s IP World Alliance</span>
                </div>

              </form>
            )}

          </div>

          {/* Quick Dual-Mode Theme Switch & Help Card on Right */}
          <div className="w-full mt-2 sm:mt-3 flex items-center justify-between px-2 text-xs text-slate-500 dark:text-zinc-400">
            <div className="flex items-center gap-2">
              <span className="text-[11px]">Appearance:</span>
              <button
                type="button"
                onClick={handleToggleTheme}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer text-[11px] font-medium"
              >
                {isDarkMode ? (
                  <>
                    <Sun className="w-3 h-3 text-amber-400" />
                    <span>Dark</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3 h-3 text-purple-600" />
                    <span>Light</span>
                  </>
                )}
              </button>
            </div>

            <Link
              href="/about"
              className="text-[11px] hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              Explore WIPA →
            </Link>
          </div>

        </div>

      </div>

      {/* BOTTOM COMPACT FOOTER (Instagram Style, Single Row) */}
      <footer className="relative z-10 w-full border-t border-slate-200/80 dark:border-white/5 bg-white/70 dark:bg-[#07070a]/70 backdrop-blur-md py-2 sm:py-2.5 px-4 sm:px-6 pb-[max(env(safe-area-inset-bottom,0px),0.75rem)]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] sm:text-[11px] text-slate-500 dark:text-zinc-500">
          
          {/* Quick Navigation Links */}
          <nav className="flex flex-wrap items-center justify-center sm:justify-start gap-x-3 sm:gap-x-4 gap-y-1">
            <Link href="/about" className="hover:text-slate-900 dark:hover:text-zinc-300 transition-colors">About</Link>
            <Link href="/resources" className="hover:text-slate-900 dark:hover:text-zinc-300 transition-colors">Resources</Link>
            <Link href="/pricing" className="hover:text-slate-900 dark:hover:text-zinc-300 transition-colors">Alliance Membership</Link>
            <Link href="/privacy-policy" className="hover:text-slate-900 dark:hover:text-zinc-300 transition-colors">Privacy</Link>
            <Link href="/csae-standards" className="hover:text-slate-900 dark:hover:text-zinc-300 transition-colors">Terms & Standards</Link>
            <Link href="/contact" className="hover:text-slate-900 dark:hover:text-zinc-300 transition-colors">Contact</Link>
          </nav>

          {/* Language & Copyright */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 cursor-pointer hover:text-slate-900 dark:hover:text-zinc-300 transition-colors">
              <Globe className="w-3 h-3" />
              <span>English</span>
              <ChevronDown className="w-2.5 h-2.5" />
            </div>
            <span>© 2026 WIPA from Women&apos;s IP World Alliance</span>
          </div>

        </div>
      </footer>

      {/* Forgot Password Interactive Modal */}
      <AnimatePresence>
        {isResetModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-white dark:bg-[#18181f] border border-slate-200 dark:border-white/15 rounded-2xl p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-600 dark:text-pink-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    Reset Password
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsResetModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-sm cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-slate-600 dark:text-zinc-400">
                Enter your registered email address and we&apos;ll send you a link to reset your account password.
              </p>

              {resetStatus && (
                <div className={`text-xs px-3 py-2 rounded-lg font-medium ${
                  resetStatus.success
                    ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                    : 'bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400'
                }`}>
                  {resetStatus.text}
                </div>
              )}

              <form onSubmit={handleSendPasswordReset} className="space-y-3">
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full bg-slate-50 dark:bg-[#111116] border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white rounded-xl py-2.5 px-3.5 text-xs outline-none focus:border-pink-500"
                />

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsResetModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium px-4 py-2 rounded-xl text-xs shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
                  >
                    {resetLoading ? 'Sending…' : 'Send Link'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
    </>
  );
}
