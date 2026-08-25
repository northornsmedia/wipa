"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { User, LogIn, Eye, EyeOff, Sun, Moon } from "lucide-react";
import AppLaunchSplash from "@/components/AppLaunchSplash";

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
    <div className="min-h-screen bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 flex flex-col justify-between items-center p-4 sm:p-6 relative overflow-hidden font-sans transition-colors duration-300">
      
      {/* Subtle Background Radial Gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-gradient-to-b from-[#5a32fa]/10 via-[#5a32fa]/5 to-transparent pointer-events-none blur-3xl -z-10" />

      {/* Top Header Bar */}
      <header className="w-full max-w-4xl flex items-center justify-between z-10 pt-2 pb-6">
        {/* Official WIPA Brand Logo */}
        <Link href="/" aria-label="WIPA Home" className="flex items-center gap-3 group">
          <div className="h-10 w-auto flex items-center">
            <img 
              src="/WIPA-Logo.png" 
              alt="Women's IP World Alliance" 
              className="h-9 sm:h-10 w-auto object-contain dark:brightness-110 drop-shadow-sm group-hover:scale-105 transition-transform" 
            />
          </div>
        </Link>

        {/* Top Right Controls: Theme Switch + Sign Up */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Dual Mode Light/Dark Switch */}
          <button
            type="button"
            onClick={handleToggleTheme}
            title={isDarkMode ? "Switch to Light theme" : "Switch to Dark theme"}
            aria-label="Toggle theme"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 dark:border-white/15 bg-white/80 dark:bg-white/5 backdrop-blur text-slate-700 dark:text-slate-200 hover:border-[#5a32fa]/50 hover:text-[#5a32fa] transition-all text-xs font-bold shadow-2xs"
          >
            {isDarkMode ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-[#5a32fa]" />
                <span className="hidden sm:inline">Dark</span>
              </>
            )}
          </button>

          {/* Sign Up Link */}
          <Link
            href="/signup"
            className="flex items-center gap-1.5 text-slate-700 dark:text-slate-200 hover:text-[#5a32fa] dark:hover:text-white font-semibold text-xs sm:text-sm transition-colors py-1.5 px-3.5 rounded-full border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 shadow-2xs"
          >
            <div className="w-5 h-5 rounded-full border border-slate-300 dark:border-white/20 flex items-center justify-center">
              <User className="w-3 h-3" />
            </div>
            <span>Sign Up</span>
          </Link>
        </div>
      </header>

      {/* Main Content Form Card */}
      <main className="w-full max-w-md flex-1 flex flex-col justify-center items-center z-10 py-6">
        <div className="w-full bg-white dark:bg-[#0d1322] border border-slate-200/90 dark:border-slate-800/90 rounded-3xl p-7 sm:p-9 shadow-xl shadow-slate-200/50 dark:shadow-black/40 backdrop-blur">
          
          {/* Header Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              Sign In
            </h1>
            <p className="mt-2 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
              Welcome back to Women&apos;s IP World Alliance
            </p>
          </div>

          <form onSubmit={handleLogin} className="w-full space-y-5">
            {message && (
              <div className="text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-4 py-2.5 rounded-2xl text-xs font-bold text-center animate-fadeIn">
                {message}
              </div>
            )}
            {error && (
              <div className="text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 px-4 py-2.5 rounded-2xl text-xs font-bold text-center animate-fadeIn">
                {error}
              </div>
            )}

            {/* Email Input Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@organization.com"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck="false"
                required
                className="w-full bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 rounded-2xl py-3 px-4 text-sm font-semibold outline-none focus:border-[#5a32fa] focus:ring-2 focus:ring-[#5a32fa]/20 transition-all"
              />
            </div>

            {/* Password Input Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={handleResetPassword}
                  className="text-xs font-bold text-[#5a32fa] hover:underline transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck="false"
                  required
                  className="w-full bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 rounded-2xl py-3 px-4 pr-11 text-sm font-semibold outline-none focus:border-[#5a32fa] focus:ring-2 focus:ring-[#5a32fa]/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-[#5a32fa] hover:bg-[#4924df] active:scale-[0.98] text-white py-3.5 px-6 flex items-center justify-center gap-2.5 font-bold text-sm shadow-md shadow-[#5a32fa]/25 transition-all cursor-pointer disabled:opacity-60"
              >
                <LogIn className="w-4 h-4" />
                <span>{loading ? "Signing In..." : "Sign In to Platform"}</span>
              </button>
            </div>

            {/* Social Divider */}
            <div className="pt-4 flex items-center gap-3">
              <div className="flex-1 h-[1px] bg-slate-200 dark:bg-white/10" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                or continue with
              </span>
              <div className="flex-1 h-[1px] bg-slate-200 dark:bg-white/10" />
            </div>

            {/* Social Buttons Row */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              {/* Google */}
              <button
                type="button"
                onClick={() => handleOAuthLogin('google')}
                className="flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-white/10 transition-all text-xs font-bold text-slate-700 dark:text-slate-200 active:scale-95 shadow-2xs"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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
                className="flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-white/10 transition-all text-xs font-bold text-slate-700 dark:text-slate-200 active:scale-95 shadow-2xs"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 21 21">
                  <path d="M10 0H0v10h10V0z" fill="#f25022"/>
                  <path d="M21 0H11v10h10V0z" fill="#7fba00"/>
                  <path d="M10 11H0v10h10V11z" fill="#00a4ef"/>
                  <path d="M21 11H11v10h10V11z" fill="#ffb900"/>
                </svg>
                <span>Microsoft</span>
              </button>
            </div>
          </form>

        </div>
      </main>

      {/* Footer Safe Area */}
      <footer className="w-full text-center py-4 text-xs font-medium text-slate-400 dark:text-slate-500 z-10">
        Women&apos;s IP World Alliance Platform &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
