"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();
  const { setUser } = useAppStore();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const msg = params.get("message");
    if (msg) setMessage(msg);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message === "Failed to fetch" || error.message.includes("Invalid login credentials")) {
        setError("Wrong username / email entered. Please enter correct details.");
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
                <a href="#" className="text-sm font-semibold text-[#f99d3e] hover:text-[#e88c2d] transition-colors">
                  Forgot Password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#b892ff] text-black font-semibold py-3.5 rounded-full hover:bg-[#a57aff] hover:-translate-y-0.5 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 border-[1.5px] border-black shadow-sm disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
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
