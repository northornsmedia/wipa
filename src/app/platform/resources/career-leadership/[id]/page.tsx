'use client';

import React from 'react';
import { ArrowLeft, BookOpen, Star, TrendingUp, Target, ListChecks, FileText, ChevronRight, Briefcase, Award } from 'lucide-react';
import Link from 'next/link';

export default function CareerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  
  // Mock data for the specific career resource
  const resource = {
    id: id,
    title: "Transitioning from Senior Counsel to Partner: The Hidden Curriculum",
    type: "Career Guide",
    expert: {
      name: "David Chen",
      role: "Managing Partner, Apex IP Law",
      image: "https://i.pravatar.cc/150?img=11",
      bio: "David has overseen the promotion of over 40 partners during his tenure and regularly mentors senior associates on business development and firm economics."
    },
    readingTime: "15 min read",
    overview: "Making the leap from a highly competent Senior Counsel to a Partner requires a fundamental shift in mindset. It is no longer just about doing excellent legal work; it's about business generation, firm leadership, and strategic client management. This guide uncovers the 'hidden curriculum' that law firms rarely explicitly teach.",
    keyTakeaways: [
      "Excellent legal work is the baseline, not the differentiator for partnership.",
      "You must develop a niche where you are recognized as an external authority.",
      "Internal networking is just as critical as external client development."
    ],
    content: `
      <h3 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 mt-6">The Shift from Doer to Generator</h3>
      <p class="mb-6">As a Senior Counsel, your primary value to the firm is the billable hour and the flawless execution of complex legal tasks. When you transition to Partner, your value shifts to generating revenue and managing client relationships. This transition is often the hardest hurdle for technical experts.</p>
      
      <div class="my-10 p-6 bg-[#a855f7]/10 border-l-4 border-[#a855f7] rounded-r-2xl">
        <p class="text-lg italic font-medium text-gray-700 dark:text-gray-300">"You are no longer just practicing law; you are running a business within a business."</p>
      </div>

      <h3 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 mt-10">Building Your Internal Brand</h3>
      <p class="mb-6">Many candidates focus entirely on external clients and neglect their internal reputation. You need sponsors—current partners who will advocate for your promotion behind closed doors. This requires you to be visible, collaborative, and indispensable to multiple practice groups, not just your direct supervisor.</p>
      
      <h3 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 mt-10">The Economics of Partnership</h3>
      <p class="mb-6">Understand how your firm makes money. Be prepared to present a coherent business case for your promotion that includes projected origination, a clear target market, and an analysis of how your practice complements the firm's strategic goals.</p>
    `,
    nextSteps: [
      "Schedule a 'career mapping' lunch with a partner outside your direct practice group.",
      "Identify three speaking engagements or publication opportunities in your target niche for the next quarter.",
      "Draft a preliminary one-page business plan outlining your target clients and revenue projections."
    ],
    related: [
      { id: '3', title: "The First 90 Days as Head of IP", type: "Toolkit" },
      { id: '6', title: "Navigating Firm Politics", type: "Podcast" }
    ]
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0f172a] pb-20">
      
      {/* Header Area */}
      <div className="bg-white dark:bg-[#1e293b] border-b border-gray-200 dark:border-white/10 pt-8 pb-12 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[#a855f7]/5 blur-3xl rounded-full transform translate-x-1/2 -translate-y-1/4 pointer-events-none"></div>

        <div className="w-full max-w-[900px] mx-auto p-4 md:p-6 lg:p-8 relative z-10">
          <Link href="/platform/resources/career-leadership" className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-[#a855f7] font-bold text-sm mb-10 transition-colors">
            <ArrowLeft size={16} />
            Back to Career & Leadership
          </Link>
          
          <div className="flex flex-wrap items-center gap-3 text-sm font-bold mb-6">
            <span className="bg-[#a855f7]/10 px-3 py-1 rounded-md uppercase tracking-wider text-[10px] text-[#a855f7]">{resource.type}</span>
            <span className="text-gray-400 font-medium">{resource.readingTime}</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-gray-100 mb-8 leading-tight">
            {resource.title}
          </h1>

          <div className="flex items-center gap-4 border-t border-gray-100 dark:border-white/10 pt-6">
            <img src={resource.expert.image} alt={resource.expert.name} className="w-14 h-14 rounded-full object-cover border-2 border-[#a855f7]/20" />
            <div>
              <p className="font-bold text-gray-900 dark:text-gray-100 text-lg">{resource.expert.name}</p>
              <p className="text-sm text-[#a855f7] font-medium">{resource.expert.role}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full max-w-[900px] mx-auto p-4 md:p-6 lg:p-8 pt-12">
        
        {/* Overview & Key Takeaways Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          
          {/* Overview */}
          <div className="bg-white dark:bg-[#1e293b] rounded-[2rem] p-8 shadow-sm border border-gray-200 dark:border-white/10">
            <h2 className="text-xl font-black text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <TrendingUp className="text-[#a855f7]" size={20} /> Overview
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {resource.overview}
            </p>
          </div>

          {/* Key Takeaways */}
          <div className="bg-gradient-to-br from-[#a855f7]/10 to-transparent rounded-[2rem] p-8 border border-[#a855f7]/20 shadow-sm">
            <h2 className="text-xl font-black text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
              <Star className="text-[#a855f7]" size={20} /> Key Takeaways
            </h2>
            <ul className="space-y-4">
              {resource.keyTakeaways.map((takeaway, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#a855f7]/20 flex items-center justify-center text-[#a855f7] shrink-0 mt-0.5">
                    <span className="text-xs font-black">{idx + 1}</span>
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 font-medium leading-relaxed">{takeaway}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Main Content Body */}
        <div className="bg-white dark:bg-[#1e293b] rounded-[2rem] p-8 md:p-12 shadow-sm border border-gray-200 dark:border-white/10 mb-12">
          <div 
            className="prose prose-lg dark:prose-invert prose-p:text-gray-600 dark:prose-p:text-gray-300 max-w-none"
            dangerouslySetInnerHTML={{ __html: resource.content }}
          />
        </div>

        {/* Practical Next Steps */}
        <div className="bg-white dark:bg-[#1e293b] rounded-[2rem] p-8 md:p-10 shadow-sm border-l-8 border-[#a855f7] mb-12 border-y border-r border-gray-200 dark:border-white/10">
          <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
            <Target className="text-[#a855f7]" size={24} /> Practical Next Steps
          </h2>
          <div className="space-y-4">
            {resource.nextSteps.map((step, idx) => (
              <div key={idx} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-[#0f172a] border border-gray-100 dark:border-white/5">
                <div className="text-gray-400 hover:text-[#a855f7] transition-colors cursor-pointer">
                  <div className="w-6 h-6 rounded border-2 border-current flex items-center justify-center"></div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 font-medium">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Grid: Expert Bio & Related */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Expert Bio */}
          <div className="bg-white dark:bg-[#1e293b] p-8 rounded-3xl border border-gray-200 dark:border-white/10 shadow-sm flex flex-col items-center text-center">
            <h3 className="font-black text-sm text-gray-400 uppercase tracking-wider mb-6 w-full text-left">About the Expert</h3>
            <img src={resource.expert.image} alt={resource.expert.name} className="w-20 h-20 rounded-full object-cover border-4 border-[#a855f7]/10 shadow-lg mb-4" />
            <h4 className="font-black text-xl text-gray-900 dark:text-gray-100 mb-1">{resource.expert.name}</h4>
            <p className="text-[#a855f7] font-bold text-sm mb-4">{resource.expert.role}</p>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6">
              {resource.expert.bio}
            </p>
            <button className="mt-auto px-6 py-2.5 bg-gray-50 dark:bg-[#0f172a] border border-gray-200 dark:border-white/10 rounded-xl font-bold text-gray-700 dark:text-gray-200 hover:text-[#a855f7] hover:border-[#a855f7] transition-all w-full">
              Connect / View Profile
            </button>
          </div>

          {/* Related Resources */}
          <div className="bg-white dark:bg-[#1e293b] p-8 rounded-3xl border border-gray-200 dark:border-white/10 shadow-sm">
            <h3 className="font-black text-sm text-gray-400 uppercase tracking-wider mb-6 flex items-center gap-2">
              <Briefcase size={16} /> Related Career Tools
            </h3>
            <div className="flex flex-col gap-4">
              {resource.related.map(item => (
                <Link key={item.id} href={`/platform/resources/career-leadership/${item.id}`} className="group block">
                  <div className="p-4 rounded-xl border border-gray-100 dark:border-white/5 hover:border-[#a855f7]/50 hover:bg-[#a855f7]/5 transition-all">
                    <span className="text-[10px] font-black uppercase text-[#a855f7] mb-2 block">{item.type}</span>
                    <p className="font-bold text-gray-800 dark:text-gray-100 text-sm group-hover:text-[#a855f7] transition-colors line-clamp-2">
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
