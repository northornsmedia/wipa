"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [tier, setTier] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tierParam = params.get('tier');
      if (tierParam) {
        setIsPurchasing(true);
        setTier(tierParam);
      }
    }
  }, []);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          ...(tier ? { pending_tier: tier } : {})
        },
        emailRedirectTo: `${window.location.origin}/platform`,
      },
    });

    if (error) {
      if (error.message === "Failed to fetch") {
        setError("Network error. Please make sure you are connected to the internet.");
      } else {
        setError(error.message);
      }
      setLoading(false);
    } else {
      router.push("/login?message=Check your email to confirm your account");
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
      <main className="flex-1 flex flex-col items-center justify-center p-6 relative z-10 pb-20">
        <div className="w-full max-w-md px-4 sm:px-8">
          <div className="text-center mb-8">
            <h2 className="font-serif text-4xl text-[#1a1a1a] mb-2 leading-tight">
              {isPurchasing ? "Complete Purchase" : "Join WIPA"}
            </h2>
            <p className="text-gray-500 font-medium">
              {isPurchasing ? "To complete the purchase, please create a profile." : "Create an account to start networking."}
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSignup}>
            {error && <div className="text-red-500 text-sm font-semibold">{error}</div>}
            <div>
              <label className="block text-sm font-semibold text-[#1a1a1a] mb-1.5 px-1">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-transparent rounded-full py-3 px-5 text-[#1a1a1a] placeholder-gray-400 font-medium border-[1.5px] border-black/20 focus:border-black outline-none transition-colors shadow-sm"
                  required
                />
              </div>
            </div>

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
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent rounded-full py-3 px-5 text-[#1a1a1a] placeholder-gray-400 font-medium border-[1.5px] border-black/20 focus:border-black outline-none transition-colors shadow-sm"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#f99d3e] text-black font-semibold py-3.5 rounded-full mt-2 hover:bg-[#e88c2d] hover:-translate-y-0.5 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 border-[1.5px] border-black shadow-sm disabled:opacity-50"
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600 font-medium">
              Already have an account?{" "}
              <Link href="/login" className="text-[#1a1a1a] font-bold hover:text-[#b892ff] transition-colors">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
