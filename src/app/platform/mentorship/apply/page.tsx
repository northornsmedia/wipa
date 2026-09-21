'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  GraduationCap, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles as _, // strict rule reminder: never use Sparkles in UI
  Heart, 
  Users, 
  Calendar, 
  Send 
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

const PRACTICE_AREAS = [
  'Patent Prosecution & Claim Drafting',
  'Trademarks & Global Brand Protection',
  'IP Litigation & TTAB Proceedings',
  'Life Sciences, Biologics & SPCs',
  'Artificial Intelligence & Software IP',
  'Standard Essential Patents (SEPs) & FRAND',
  'Trade Secrets & Employee Mobility',
  'In-House Legal Operations & Outside Counsel Management',
  'Partnership Track Navigation & Law Firm Business Development'
];

export default function BecomeMentorPage() {
  const router = useRouter();
  const user = useAppStore((state) => state.user);

  const [selectedAreas, setSelectedAreas] = useState<string[]>([
    'Patent Prosecution & Claim Drafting',
    'In-House Legal Operations & Outside Counsel Management'
  ]);
  const [experienceYears, setExperienceYears] = useState('10');
  const [monthlyCommitment, setMonthlyCommitment] = useState('2');
  const [mentorshipBio, setMentorshipBio] = useState('');
  const [motivation, setMotivation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const toggleArea = (area: string) => {
    setSelectedAreas(prev => 
      prev.includes(area) ? prev.filter(a => a !== area) : [...prev, area]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAreas.length === 0 || !mentorshipBio.trim() || isSubmitting) return;
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/mentorship/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          practiceAreas: selectedAreas,
          experienceYears,
          availability: monthlyCommitment,
          mentorshipBio: mentorshipBio.trim(),
          motivation: motivation.trim()
        })
      });

      const result = await res.json();
      if (result.success) {
        setIsSubmitted(true);
      }
    } catch (err) {
      console.error('Error submitting mentorship application:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#070b14] text-slate-900 dark:text-white font-sans pb-24">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Navigation Breadcrumb */}
        <button 
          onClick={() => router.push('/platform/mentorship')}
          className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 mb-6 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Back to Mentorship Directory</span>
        </button>

        {/* Application Header */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0c1020] border border-slate-200/80 dark:border-white/10 shadow-xs mb-8">
          <div className="max-w-2xl">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] px-2.5 py-0.5 rounded-full bg-[#5a32fa]/10 text-[#5a32fa] dark:text-purple-300 border border-[#5a32fa]/20 mb-3 inline-block">
              WIPA Leadership Initiative
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white mb-2">
              Apply to Become a WIPA Mentor
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Empower the next generation of female IP counsel and patent specialists. Share your prosecution wisdom, executive experience, and strategic guidance with emerging practitioners.
            </p>
          </div>
        </div>

        {isSubmitted ? (
          <div className="p-10 rounded-3xl bg-white dark:bg-[#0c1020] border border-emerald-500/30 text-center shadow-lg">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
              <CheckCircle2 size={32} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
              Welcome to the WIPA Mentor Roster!
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto mb-6 leading-relaxed">
              Thank you for dedicating your time to empower women in intellectual property law. Your mentor profile has been verified and is now live in the directory.
            </p>
            <button
              onClick={() => router.push('/platform/mentorship')}
              className="py-3 px-8 rounded-2xl bg-[#5a32fa] text-white text-xs font-black shadow-md cursor-pointer hover:bg-purple-600 transition-colors"
            >
              View in Directory
            </button>
          </div>
        ) : (
          /* Application Form */
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Step 1: Practice Areas */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#0c1020] border border-slate-200/80 dark:border-white/10 shadow-xs">
              <h2 className="text-sm font-black uppercase tracking-wider text-slate-400 mb-2">
                1. Areas of Mentorship Focus
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                Select the legal fields and practice subjects you feel confident advising on:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {PRACTICE_AREAS.map((area) => {
                  const isChecked = selectedAreas.includes(area);
                  return (
                    <div
                      key={area}
                      onClick={() => toggleArea(area)}
                      className={`p-3 rounded-2xl border text-xs font-bold cursor-pointer transition-all flex items-center gap-2.5 ${
                        isChecked
                          ? 'bg-[#5a32fa]/10 text-[#5a32fa] dark:text-purple-300 border-[#5a32fa]/40'
                          : 'bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-slate-300 border-slate-200/60 dark:border-white/5 hover:border-slate-300'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-md flex items-center justify-center text-[10px] ${
                        isChecked ? 'bg-[#5a32fa] text-white' : 'border border-slate-300 dark:border-slate-600'
                      }`}>
                        {isChecked && '✓'}
                      </div>
                      <span>{area}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Experience & Availability */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#0c1020] border border-slate-200/80 dark:border-white/10 shadow-xs">
              <h2 className="text-sm font-black uppercase tracking-wider text-slate-400 mb-4">
                2. Experience & Monthly Commitment
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 dark:text-slate-300 mb-1.5">
                    Years of IP Experience
                  </label>
                  <select
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#12182c] border border-slate-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#5a32fa]"
                  >
                    <option value="7">7+ Years (Senior Associate)</option>
                    <option value="10">10+ Years (Special Counsel / Lead)</option>
                    <option value="15">15+ Years (Partner / Director)</option>
                    <option value="20">20+ Years (Senior Partner / Chief IP Counsel)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 dark:text-slate-300 mb-1.5">
                    Monthly Mentorship Sessions
                  </label>
                  <select
                    value={monthlyCommitment}
                    onChange={(e) => setMonthlyCommitment(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#12182c] border border-slate-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#5a32fa]"
                  >
                    <option value="1">1 Session per month (30-45 mins)</option>
                    <option value="2">2 Sessions per month (Recommended)</option>
                    <option value="4">4 Sessions per month (High capacity)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Step 3: Mentorship Statement */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#0c1020] border border-slate-200/80 dark:border-white/10 shadow-xs">
              <h2 className="text-sm font-black uppercase tracking-wider text-slate-400 mb-4">
                3. Mentorship Philosophy & Background
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 dark:text-slate-300 mb-1.5">
                    What can mentees expect from a session with you?
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={mentorshipBio}
                    onChange={(e) => setMentorshipBio(e.target.value)}
                    placeholder="e.g. I specialize in helping mid-level patent attorneys transition from law firm prosecution to leading in-house patent committees, reviewing drafting quality, and building partnership confidence..."
                    className="w-full bg-slate-50 dark:bg-[#12182c] border border-slate-200 dark:border-white/10 rounded-xl p-3.5 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#5a32fa] resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 dark:text-slate-300 mb-1.5">
                    Why is mentoring in WIPA important to you? (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={motivation}
                    onChange={(e) => setMotivation(e.target.value)}
                    placeholder="Briefly describe your motivation for giving back to the community..."
                    className="w-full bg-slate-50 dark:bg-[#12182c] border border-slate-200 dark:border-white/10 rounded-xl p-3.5 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#5a32fa] resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => router.push('/platform/mentorship')}
                className="py-3 px-6 rounded-2xl border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting || selectedAreas.length === 0 || !mentorshipBio.trim()}
                className="py-3 px-8 rounded-2xl bg-[#5a32fa] hover:bg-purple-600 disabled:opacity-50 text-white text-xs font-black shadow-md shadow-purple-500/25 cursor-pointer flex items-center gap-2"
              >
                {isSubmitting ? (
                  <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <CheckCircle2 size={16} />
                )}
                <span>{isSubmitting ? 'Activating Profile...' : 'Submit & Activate Mentor Profile'}</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
