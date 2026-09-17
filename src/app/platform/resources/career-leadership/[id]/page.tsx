'use client';

import React, { useEffect, useState } from 'react';
import { ArrowLeft, BookOpen, Sparkles, TrendingUp, Target, ListChecks, FileText, ChevronRight, Briefcase, Award, Clock, Star, Share2, Check } from 'lucide-react';
import Link from 'next/link';
import DOMPurify from 'dompurify';
import { supabase } from '@/lib/supabase';
import { MOCK_FULL_CAREER_RESOURCES, CareerResource } from '@/lib/career-leadership-data';

export default function CareerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [resource, setResource] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadResource() {
      try {
        // Try fetching from Supabase first
        const { data, error } = await supabase
          .from('resources')
          .select('*')
          .eq('id', id)
          .single();

        if (!error && data) {
          setResource({
            id: data.id,
            title: data.title,
            type: data.resource_type || data.type || "Leadership Guide",
            readingTime: data.read_time || "10 min read",
            expert: {
              name: data.author_name || "Sarah Norkor Anku",
              role: data.author_title || data.organization || "Global Managing Partner",
              image: data.author_avatar || data.cover_image_url || "/resourceimg2.jpg",
              bio: data.organization 
                ? `${data.author_name || 'The author'} is a leader at ${data.organization}, advising executive teams and mentoring next-generation women attorneys across global IP hubs.`
                : "Experienced Managing Partner advising senior IP counsel on business origination, equity partnerships, and cross-border practice strategy."
            },
            overview: data.summary || "Making the transition from high-performing legal practitioner to partner or General Counsel requires an intentional shift in mindset, client generation, and executive leadership presence.",
            keyTakeaways: [
              "Technical excellence is the baseline entry ticket; commercial originations and sponsorship determine partnership.",
              "Cultivate an unmistakable external authority niche (e.g. AI patenting, life sciences ITC litigation, pharma transactions).",
              "Build internal cross-practice champions who will advocate for your elevation behind closed doors."
            ],
            content: data.content 
              ? `<div class="space-y-6 text-gray-700 dark:text-gray-300 text-base leading-relaxed">${data.content.replace(/\n\n/g, '</div><div class="space-y-6 text-gray-700 dark:text-gray-300 text-base leading-relaxed">')}</div>`
              : `
                <h3 class="text-2xl font-black text-gray-900 dark:text-white mb-4 mt-6">From Technical Doer to Business Generator</h3>
                <p class="mb-6 leading-relaxed">As a senior associate or counsel, your primary currency is billable hours and flawless technical execution. When ascending to partner or corporate legal leadership, your primary currency shifts to client origination, team sponsorship, and enterprise risk navigation.</p>
                
                <div class="my-8 p-6 bg-purple-500/10 border-l-4 border-[#5a32fa] rounded-r-2xl">
                  <p class="text-base italic font-bold text-gray-800 dark:text-purple-200">"You are no longer just practicing intellectual property law; you are running a sustainable business and protecting corporate valuation."</p>
                </div>

                <h3 class="text-2xl font-black text-gray-900 dark:text-white mb-4 mt-8">Cultivating Internal Champions & Sponsors</h3>
                <p class="mb-6 leading-relaxed">Many senior women attorneys focus exclusively on external client deliverables and overlook the politics of internal partnership committees. A mentor advises you; a sponsor advocates for your compensation and partnership seat when you are not in the room.</p>
                
                <h3 class="text-2xl font-black text-gray-900 dark:text-white mb-4 mt-8">The Economics of Equity & Origination</h3>
                <p class="mb-6 leading-relaxed">Understand exactly how your law firm or corporation makes money. Build a 3-year portable business plan outlining recurring client origination, realization rates, and cross-practice leverage opportunities.</p>
              `,
            nextSteps: [
              "Schedule a confidential career mapping session with a partner outside your immediate practice group.",
              "Identify two high-profile industry speaking or publishing opportunities for the upcoming quarter.",
              "Draft your 3-year portable client origination plan using our downloadable Partnership Business Plan model."
            ],
            related: [
              { id: '0111a3a9-6e9b-425e-9070-69b92f114e6f', title: "From Senior Associate to IP Partner: The Roadmap to Equity", type: "Career Guide" },
              { id: '52ee37c0-8cff-4cd4-8926-c9be05e40f8a', title: "Mastering the General Counsel Seat: IP Strategy for Corporate Executives", type: "Executive Briefing" }
            ]
          });
          setLoading(false);
          return;
        }

        // Fallback to mock library
        const match = MOCK_FULL_CAREER_RESOURCES.find(r => r.id === id);
        if (match) {
          setResource({
            id: match.id,
            title: match.title,
            type: match.type,
            readingTime: match.time,
            expert: {
              name: match.expert.split(',')[0],
              role: match.expertRole || match.expert,
              image: match.expertAvatar || match.image,
              bio: "Distinguished IP leader dedicated to accelerating women in patent prosecution, litigation, and corporate legal executive roles."
            },
            overview: match.summary || "A comprehensive executive briefing on navigating career progression, business development, and executive leadership in global intellectual property law.",
            keyTakeaways: [
              "Client originations and portable business portfolios are the single greatest drivers of partner compensation.",
              "Form strategic cross-selling alliances with corporate, tax, and regulatory practice chairs.",
              "Protect billable realization by setting clear pricing boundaries and scoping guidelines."
            ],
            content: `
              <h3 class="text-2xl font-black text-gray-900 dark:text-white mb-4 mt-6">Strategic Imperatives for Executive Advancement</h3>
              <p class="mb-6 leading-relaxed">Ascending into tier-1 partnership or corporate General Counsel roles requires intentional personal branding. You must define a distinct area of legal domain authority where clients and colleagues immediately think of your name first.</p>
              
              <div class="my-8 p-6 bg-purple-500/10 border-l-4 border-[#5a32fa] rounded-r-2xl">
                <p class="text-base italic font-bold text-gray-800 dark:text-purple-200">"The best leaders do not wait for permission to lead; they solve enterprise problems before they reach the C-suite."</p>
              </div>

              <h3 class="text-2xl font-black text-gray-900 dark:text-white mb-4 mt-8">Navigating Compensation & Equity Committees</h3>
              <p class="mb-6 leading-relaxed">Never enter an annual review without verified origination metrics, realization rates, and client satisfaction testimonials. Present your contribution as recurring EBITDA and firm equity value.</p>
            `,
            nextSteps: [
              "Conduct a complete audit of your top 5 client billing realization rates.",
              "Identify 3 target corporate prospects within your technological specialty for an introductory briefing.",
              "Connect with an executive mentor from the WIPA faculty for personalized 1:1 career guidance."
            ],
            related: [
              { id: 'adf54322-17ca-461c-bf38-bc35e8f8bff9', title: "Rising to Partner: Strategies for Women Attorneys in Modern Law Firms", type: "Leadership Guide" },
              { id: '52ee37c0-8cff-4cd4-8926-c9be05e40f8a', title: "Mastering the General Counsel Seat: IP Strategy for Corporate Executives", type: "Executive Briefing" }
            ]
          });
        } else {
          // Default fallback
          setResource({
            id: id,
            title: "Transitioning from Senior Counsel to Partner: The Hidden Curriculum",
            type: "Career Guide",
            readingTime: "12 min read",
            expert: {
              name: "David Chen",
              role: "Managing Partner, Apex IP Law",
              image: "/resourceimg2.jpg",
              bio: "David has overseen the promotion of over 40 partners during his tenure and regularly mentors senior associates on business development and firm economics."
            },
            overview: "Making the leap from a highly competent Senior Counsel to a Partner requires a fundamental shift in mindset. It is no longer just about doing excellent legal work; it's about business generation, firm leadership, and strategic client management.",
            keyTakeaways: [
              "Excellent legal work is the baseline, not the differentiator for partnership.",
              "You must develop a niche where you are recognized as an external authority.",
              "Internal networking is just as critical as external client development."
            ],
            content: `
              <h3 class="text-2xl font-black text-gray-900 dark:text-white mb-4 mt-6">The Shift from Doer to Generator</h3>
              <p class="mb-6 leading-relaxed">As a Senior Counsel, your primary value to the firm is the billable hour and the flawless execution of complex legal tasks. When you transition to Partner, your value shifts to generating revenue and managing client relationships.</p>
              
              <div class="my-8 p-6 bg-purple-500/10 border-l-4 border-[#5a32fa] rounded-r-2xl">
                <p class="text-base italic font-bold text-gray-800 dark:text-purple-200">"You are no longer just practicing law; you are running a business within a business."</p>
              </div>

              <h3 class="text-2xl font-black text-gray-900 dark:text-white mb-4 mt-8">Building Your Internal Brand</h3>
              <p class="mb-6 leading-relaxed">Many candidates focus entirely on external clients and neglect their internal reputation. You need sponsors—current partners who will advocate for your promotion behind closed doors.</p>
            `,
            nextSteps: [
              "Schedule a 'career mapping' lunch with a partner outside your direct practice group.",
              "Identify three speaking engagements or publication opportunities in your target niche.",
              "Draft a preliminary one-page business plan outlining your target clients and revenue projections."
            ],
            related: [
              { id: 'adf54322-17ca-461c-bf38-bc35e8f8bff9', title: "Rising to Partner: Strategies for Women Attorneys in Modern Law Firms", type: "Leadership Guide" }
            ]
          });
        }
      } catch (e) {
        // Fallback
      } finally {
        setLoading(false);
      }
    }

    loadResource();
  }, [id]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading || !resource) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#070913] flex items-center justify-center">
        <div className="flex items-center gap-3 text-purple-600 font-bold text-sm">
          <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          Loading executive briefing...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#070913] text-gray-900 dark:text-white font-sans selection:bg-purple-500/30 overflow-x-hidden transition-colors duration-300 pb-20">
      
      {/* Header Area */}
      <div className="relative bg-white dark:bg-[#0c1120] border-b border-gray-200/80 dark:border-white/10 pt-8 pb-12 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="w-full max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center justify-between mb-8">
            <Link 
              href="/platform/resources/career-leadership" 
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-[#5a32fa] dark:hover:text-purple-400 transition-colors"
            >
              <ArrowLeft size={16} /> Back to Career & Leadership Hub
            </Link>

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-white/10 hover:bg-purple-50 dark:hover:bg-purple-900/30 text-xs font-bold text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-300 transition-all cursor-pointer"
            >
              {copied ? <Check size={14} className="text-emerald-500" /> : <Share2 size={14} />}
              {copied ? 'Link Copied' : 'Share Briefing'}
            </button>
          </div>
          
          <div className="flex flex-wrap items-center gap-2.5 mb-4">
            <span className="bg-gradient-to-r from-[#5a32fa] to-purple-600 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md shadow-purple-500/20">
              {resource.type}
            </span>
            <span className="text-xs font-semibold text-gray-500 dark:text-white/60 flex items-center gap-1">
              <Clock size={12} className="text-purple-500" /> {resource.readingTime}
            </span>
            <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 flex items-center gap-1">
              <Star size={12} className="text-amber-400 fill-amber-400" /> 4.9 Rating
            </span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6 leading-tight tracking-tight">
            {resource.title}
          </h1>

          <div className="flex items-center gap-4 border-t border-gray-100 dark:border-white/10 pt-6">
            <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-800 border-2 border-purple-500/20 shrink-0">
              <img src={resource.expert.image} alt={resource.expert.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-wider text-purple-600 dark:text-purple-400">
                Author & Executive Advisor
              </div>
              <p className="font-black text-gray-900 dark:text-white text-base sm:text-lg">{resource.expert.name}</p>
              <p className="text-xs text-gray-500 dark:text-white/60 font-medium">{resource.expert.role}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        
        {/* Overview & Key Takeaways Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          
          {/* Overview */}
          <div className="bg-white dark:bg-[#0c1120] rounded-3xl p-6 sm:p-8 shadow-2xs border border-gray-200/90 dark:border-white/10">
            <h2 className="text-lg font-black text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <TrendingUp className="text-[#5a32fa] dark:text-purple-400" size={18} /> Executive Overview
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-white/70 leading-relaxed font-medium">
              {resource.overview}
            </p>
          </div>

          {/* Key Takeaways */}
          <div className="bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent rounded-3xl p-6 sm:p-8 border border-purple-500/20 shadow-2xs">
            <h2 className="text-lg font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Sparkles className="text-[#5a32fa] dark:text-purple-400" size={18} /> Core Takeaways
            </h2>
            <ul className="space-y-3">
              {resource.keyTakeaways.map((takeaway: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-purple-500/20 text-[#5a32fa] dark:text-purple-300 flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <span className="text-xs sm:text-sm text-gray-700 dark:text-white/80 font-medium leading-relaxed">{takeaway}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Main Content Body */}
        <div className="bg-white dark:bg-[#0c1120] rounded-3xl p-6 sm:p-10 md:p-12 shadow-2xs border border-gray-200/90 dark:border-white/10 mb-10">
          <div 
            className="prose prose-purple dark:prose-invert max-w-none text-gray-700 dark:text-white/80 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: typeof window !== 'undefined' ? DOMPurify.sanitize(resource.content) : resource.content }}
          />
        </div>

        {/* Practical Next Steps */}
        <div className="bg-white dark:bg-[#0c1120] rounded-3xl p-6 sm:p-8 shadow-2xs border-l-6 border-[#5a32fa] mb-10 border-y border-r border-gray-200/90 dark:border-white/10">
          <h2 className="text-xl font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Target className="text-[#5a32fa] dark:text-purple-400" size={20} /> Actionable Next Steps
          </h2>
          <div className="space-y-3">
            {resource.nextSteps.map((step: string, idx: number) => (
              <div key={idx} className="flex items-center gap-3 p-3.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                <div className="w-5 h-5 rounded-md border-2 border-purple-500/40 flex items-center justify-center text-purple-600 shrink-0">
                  <Check size={12} />
                </div>
                <p className="text-xs sm:text-sm text-gray-700 dark:text-white/80 font-medium">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Grid: Expert Bio & Related Tools */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Expert Bio */}
          <div className="bg-white dark:bg-[#0c1120] p-6 sm:p-8 rounded-3xl border border-gray-200/90 dark:border-white/10 shadow-2xs flex flex-col items-center text-center">
            <h3 className="font-black text-xs text-gray-400 uppercase tracking-wider mb-5 w-full text-left">
              About the Executive
            </h3>
            <img src={resource.expert.image} alt={resource.expert.name} className="w-20 h-20 rounded-2xl object-cover border-2 border-purple-500/20 shadow-md mb-3" />
            <h4 className="font-black text-lg text-gray-900 dark:text-white mb-0.5">{resource.expert.name}</h4>
            <p className="text-xs text-[#5a32fa] dark:text-purple-400 font-bold mb-3">{resource.expert.role}</p>
            <p className="text-xs text-gray-600 dark:text-white/70 leading-relaxed mb-6 font-medium">
              {resource.expert.bio}
            </p>
            <Link
              href="/platform/resources/career-leadership"
              className="mt-auto px-5 py-2.5 bg-gray-100 dark:bg-white/5 hover:bg-purple-50 dark:hover:bg-purple-900/20 border border-gray-200 dark:border-white/10 rounded-xl font-bold text-xs text-gray-800 dark:text-white hover:text-purple-600 dark:hover:text-purple-300 transition-all w-full text-center"
            >
              Explore Faculty & Request 1:1 Advisory
            </Link>
          </div>

          {/* Related Resources */}
          <div className="bg-white dark:bg-[#0c1120] p-6 sm:p-8 rounded-3xl border border-gray-200/90 dark:border-white/10 shadow-2xs">
            <h3 className="font-black text-xs text-gray-400 uppercase tracking-wider mb-5 flex items-center gap-2">
              <Briefcase size={14} /> Related Executive Resources
            </h3>
            <div className="flex flex-col gap-3">
              {resource.related.map((item: any) => (
                <Link key={item.id} href={`/platform/resources/career-leadership/${item.id}`} className="group block">
                  <div className="p-3.5 rounded-2xl border border-gray-100 dark:border-white/5 hover:border-purple-400/50 hover:bg-purple-50/40 dark:hover:bg-purple-900/10 transition-all">
                    <span className="text-[10px] font-black uppercase text-purple-600 dark:text-purple-400 mb-1 block">{item.type}</span>
                    <p className="font-bold text-gray-800 dark:text-white text-xs sm:text-sm group-hover:text-[#5a32fa] dark:group-hover:text-purple-400 transition-colors line-clamp-2">
                      {item.title}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
