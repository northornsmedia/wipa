"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { User, LogIn, Eye, EyeOff, Sun, Moon } from "lucide-react";
import AppLaunchSplash from "@/components/AppLaunchSplash";
import AnimatedWaveLine from "@/components/AnimatedWaveLine";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const router = useRouter();
  const { setUser, isDarkMode, toggleDarkMode } = useAppStore();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const msg = params.get("message");
    if (msg) setMessage(msg);

    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.replace("/platform");
        return;
      }
      setCheckingSession(false);
    };
    checkSession();
  }, [router]);

  const handleToggleTheme = () => {
    toggleDarkMode();
    if (typeof document !== 'undefined') {
      const nextDark = !isDarkMode;
      document.documentElement.classList.toggle('dark', nextDark);
      document.documentElement.style.colorScheme = nextDark ? 'dark' : 'light';
    }
  };

  if (checkingSession) {
    return <AppLaunchSplash message="Checking your secure session…" />;
  }

  const handleResetPassword = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address first.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) setError(error.message);
    else setMessage("Password reset email sent! Please check your inbox.");
    setLoading(false);
  };

  const handleOAuthLogin = async (provider: 'google' | 'azure') => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) setError(error.message);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
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

    const { data, error } = authRes;

    if (error) {
      if (error.message.includes("Invalid login credentials") || error.message.includes("invalid_grant")) {
        setError("Invalid email or password. Please verify your credentials or use Forgot Password.");
      } else if (error.message === "Failed to fetch") {
        setError("Connection issue. Please check your internet connection and try again.");
      } else {
        setError(error.message);
      }
      setLoading(false);
    } else if (data.user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, avatar_url, cover_url, member_id")
        .eq("id", data.user.id)
        .single();
        
      setUser({
        name: profile?.full_name || data.user.email?.split("@")[0] || "User",
        email: data.user.email!,
        id: data.user.id,
        avatar_url: profile?.avatar_url || undefined,
        cover_url: profile?.cover_url || undefined,
        member_id: profile?.member_id || undefined,
      });

      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('wipa_voice_greeted_v3');
        sessionStorage.removeItem('wipa_voice_greeted_v2');
        sessionStorage.removeItem('wipa_tts_played_session');
        sessionStorage.removeItem('wipa_tts_played');
      }

      try {
        const { getDeviceId } = await import('@/lib/device');
        const deviceId = getDeviceId();
        await supabase
          .from("user_sessions")
          .upsert({ 
            user_id: data.user.id, 
            device_id: deviceId,
            last_active_at: new Date().toISOString()
          }, { onConflict: 'user_id, device_id' });
      } catch (err) {
        console.error("Failed to record device session", err);
      }

      router.push("/platform");
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#060608] text-slate-900 dark:text-white flex flex-col justify-between items-center p-6 pt-safe pb-safe relative overflow-hidden font-sans selection:bg-pink-500 selection:text-white transition-colors duration-300">
      {/* Animated Glowing Wavy Line Gradient */}
      <AnimatedWaveLine />

      {/* Top Bar Header */}
      <header className="w-full max-w-sm flex items-center justify-between z-10 pt-2 pb-4">
        {/* Official WIPA Brand Logo */}
        <Link href="/" aria-label="WIPA Home" className="flex items-center gap-2 group">
          <div className="h-10 w-auto flex items-center group-hover:scale-105 transition-transform">
            <img 
              src="/WIPA-Logo.png" 
              alt="WIPA Logo" 
              className="h-8 w-auto object-contain dark:brightness-125 drop-shadow-md"
            />
          </div>
        </Link>

        {/* Top Right Controls: Dual Mode Switch + Sign Up */}
        <div className="flex items-center gap-2">
          {/* Dual Mode Switch */}
          <button
            type="button"
            onClick={handleToggleTheme}
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle theme"
            className="w-8 h-8 rounded-full border border-slate-300 dark:border-white/20 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/15 flex items-center justify-center text-slate-700 dark:text-white transition-all active:scale-95 cursor-pointer shadow-2xs"
          >
            {isDarkMode ? (
              <Sun className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            )}
          </button>

          {/* Sign Up Link */}
          <Link
            href="/signup"
            className="flex items-center gap-1.5 text-slate-800 dark:text-white/90 hover:text-slate-950 dark:hover:text-white font-medium text-sm transition-colors py-1.5 px-3 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 border border-slate-300 dark:border-white/10 shadow-2xs"
          >
            <div className="w-5 h-5 rounded-full border border-slate-400/40 dark:border-white/30 flex items-center justify-center">
              <User className="w-3 h-3" />
            </div>
            <span>Sign Up</span>
          </Link>
        </div>
      </header>

      {/* Main Content Form Card */}
      <main className="w-full max-w-sm flex-1 flex flex-col justify-center items-center z-10 py-6">
        {/* Page Title */}
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-8 text-center font-sans">
          Sign In
        </h1>

        <form onSubmit={handleLogin} className="w-full space-y-6">
          {message && (
            <div className="text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2.5 rounded-2xl text-xs font-semibold text-center">
              {message}
            </div>
          )}
          {error && (
            <div className="text-rose-600 dark:text-rose-400 bg-rose-500/10 border border-rose-500/20 px-4 py-2.5 rounded-2xl text-xs font-semibold text-center">
              {error}
            </div>
          )}

          {/* Email Input Field */}
          <div className="space-y-1.5">
            <label className="block text-center text-xs font-semibold text-slate-600 dark:text-gray-400">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="hannadowie@gmail.com"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck="false"
              required
              className="w-full bg-slate-50 dark:bg-[#18181d] border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 rounded-full py-3.5 px-6 text-center text-sm font-medium outline-none focus:bg-white dark:focus:bg-[#18181d] focus:border-pink-500/60 focus:ring-2 focus:ring-pink-500/20 transition-all shadow-inner"
            />
          </div>

          {/* Password Input Field */}
          <div className="space-y-1.5 relative">
            <label className="block text-center text-xs font-semibold text-slate-600 dark:text-gray-400">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="************"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck="false"
                required
                className="w-full bg-slate-50 dark:bg-[#18181d] border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 rounded-full py-3.5 px-6 text-center text-sm font-medium outline-none focus:bg-white dark:focus:bg-[#18181d] focus:border-pink-500/60 focus:ring-2 focus:ring-pink-500/20 transition-all shadow-inner"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:text-gray-400 dark:hover:text-white transition-colors cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            
            <div className="flex justify-center pt-1">
              <button
                type="button"
                onClick={handleResetPassword}
                className="text-xs font-medium text-slate-500 hover:text-pink-600 dark:text-gray-400 dark:hover:text-pink-400 transition-colors cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>
          </div>

          {/* Primary Gradient Outline Sign In Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full p-[2px] rounded-full bg-gradient-to-r from-[#d946ef] via-[#ff2a70] to-[#f97316] shadow-lg shadow-pink-500/20 active:scale-[0.98] transition-transform duration-200 group cursor-pointer disabled:opacity-50"
            >
              <div className="w-full h-full bg-slate-900 group-hover:bg-slate-800 dark:bg-[#0a0a0e] dark:group-hover:bg-[#121218] text-white rounded-full py-3.5 px-6 flex items-center justify-center gap-2.5 font-medium text-base transition-colors">
                <div className="w-6 h-6 rounded-md border border-white/20 flex items-center justify-center text-white shrink-0">
                  <LogIn className="w-3.5 h-3.5" />
                </div>
                <span>{loading ? "Signing In..." : "Sign In"}</span>
              </div>
            </button>
          </div>

          {/* Social Divider */}
          <div className="pt-4 text-center">
            <span className="text-xs font-medium text-slate-500 dark:text-gray-400">
              or Sign In with
            </span>
          </div>

          {/* Social Buttons Row */}
          <div className="flex items-center justify-center gap-4 pt-1">
            {/* Google */}
            <button
              type="button"
              onClick={() => handleOAuthLogin('google')}
              aria-label="Sign in with Google"
              className="w-12 h-12 rounded-full bg-white dark:bg-[#18181d] border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10 hover:border-slate-300 dark:hover:border-white/30 transition-all active:scale-90 shadow-xs dark:shadow-md cursor-pointer"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            </button>

            {/* Microsoft */}
            <button
              type="button"
              onClick={() => handleOAuthLogin('azure')}
              aria-label="Sign in with Microsoft"
              className="w-12 h-12 rounded-full bg-white dark:bg-[#18181d] border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10 hover:border-slate-300 dark:hover:border-white/30 transition-all active:scale-90 shadow-xs dark:shadow-md cursor-pointer"
            >
              <svg className="w-5 h-5" viewBox="0 0 21 21">
                <path d="M10 0H0v10h10V0z" fill="#f25022"/>
                <path d="M21 0H11v10h10V0z" fill="#7fba00"/>
                <path d="M10 11H0v10h10V11z" fill="#00a4ef"/>
                <path d="M21 11H11v10h10V11z" fill="#ffb900"/>
              </svg>
            </button>
          </div>
        </form>
      </main>

      {/* Footer minimal spacing / safe area */}
      <footer className="w-full text-center py-2 text-[10px] text-slate-400 dark:text-gray-600 z-10">
        Women&apos;s IP World Alliance Platform
      </footer>
    </div>
  );
}
