"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
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
  const { setUser } = useAppStore();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const msg = params.get("message");
    if (msg) setMessage(msg);

    // Task 326: check existing session
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
      // Fetch profile data
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

      // Record device session
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
    <div className="min-h-screen bg-[#fbe8d5] bg-grid-pattern flex flex-col font-sans">
      {/* Header with Logo */}
      <header className="w-full max-w-7xl mx-auto px-6 py-8 flex items-center justify-between z-10">
        <Link href="/" className="flex items-center">
          <h1 className="text-3xl font-bold tracking-tighter text-[#131313] flex items-center">
            <span>WIPA</span>
          </h1>
        </Link>
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 px-4 py-2 bg-white border-[1.5px] border-black rounded-full shadow-[3px_3px_0px_0px_#131313] hover:translate-y-px hover:shadow-[1px_1px_0px_0px_#131313] transition-all font-semibold text-sm text-[#131313]"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
          Back
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-sm border-[1.5px] border-black">
          <div className="text-center mb-8">
            <h2 className="font-serif text-4xl text-[#1a1a1a] mb-2 leading-tight">
              Welcome back
            </h2>
            <p className="text-gray-500 font-medium">
              Please enter your details to sign in.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleLogin}>
            {message && <div className="text-green-600 bg-green-50 px-3 py-2 rounded-md text-sm font-semibold">{message}</div>}
            {error && <div className="text-red-500 text-sm font-semibold">{error}</div>}
            <div>
              <label className="block text-sm font-semibold text-[#1a1a1a] mb-1.5 px-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck="false"
                  className="w-full bg-transparent rounded-full py-3 px-5 text-[#1a1a1a] placeholder-gray-400 font-medium border-[1.5px] border-black/20 focus:border-black outline-none transition-colors shadow-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1a1a1a] mb-1.5 px-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck="false"
                  className="w-full bg-transparent rounded-full py-3 pl-5 pr-12 text-[#1a1a1a] placeholder-gray-400 font-medium border-[1.5px] border-black/20 focus:border-black outline-none transition-colors shadow-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" strokeWidth={2.5} /> : <Eye className="w-5 h-5" strokeWidth={2.5} />}
                </button>
              </div>
              <div className="flex justify-end mt-2">
                <button 
                  type="button"
                  onClick={handleResetPassword} 
                  className="text-sm font-semibold text-[#f99d3e] hover:text-[#e88c2d] transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#b892ff] text-black font-semibold py-3.5 rounded-full hover:bg-[#a57aff] hover:-translate-y-0.5 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 border-[1.5px] border-black shadow-sm disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="flex-shrink-0 mx-4 text-gray-500 text-sm font-medium">Or continue with</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleOAuthLogin('google')}
                className="w-full flex items-center justify-center gap-2 bg-white text-black font-semibold py-3 rounded-full hover:-translate-y-0.5 transition-all duration-300 border-[1.5px] border-black shadow-[2px_2px_0px_0px_#131313] hover:shadow-[1px_1px_0px_0px_#131313]"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Google
              </button>
              <button
                type="button"
                onClick={() => handleOAuthLogin('azure')}
                className="w-full flex items-center justify-center gap-2 bg-white text-black font-semibold py-3 rounded-full hover:-translate-y-0.5 transition-all duration-300 border-[1.5px] border-black shadow-[2px_2px_0px_0px_#131313] hover:shadow-[1px_1px_0px_0px_#131313]"
              >
                <svg className="w-5 h-5" viewBox="0 0 21 21"><path d="M10 0H0v10h10V0zM21 0H11v10h10V0zM10 11H0v10h10V11zM21 11H11v10h10V11z" fill="#00a4ef"/></svg>
                Microsoft
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600 font-medium">
              Don't have an account?{" "}
              <Link href="/signup" className="text-[#1a1a1a] font-bold hover:text-[#f99d3e] transition-colors">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
