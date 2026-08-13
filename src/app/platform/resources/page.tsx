'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, Search, Download, FileText, Video, Headphones, Bookmark, Plus, Globe, Newspaper, Lightbulb, Briefcase, Building, Mic, MonitorPlay, FileCheck, Presentation } from 'lucide-react';
import Link from 'next/link';

const MOCK_CATEGORIES = [
  {
    id: 1,
    title: "Webinars & Learning",
    icon: MonitorPlay,
    color: "#ff90e8",
    description: "Interactive sessions and educational courses on intellectual property.",
    latestItems: [
      { title: "AI in Patent Law", type: "New Webinar", time: "1 day ago" },
      { title: "Mastering IP Litigation", type: "Masterclass", time: "3 days ago" }
    ]
  },
  {
    id: 3,
    title: "Education & Professional Development",
    icon: BookOpen,
    color: "#5a32fa",
    description: "Resources for advancing your IP career and knowledge.",
    latestItems: [
      { title: "Global IP Strategies 2026", type: "New PDF", time: "2 hours ago" },
      { title: "Patent Law Fundamentals", type: "New Course", time: "1 day ago" }
    ]
  },
  {
    id: 4,
    title: "Women's IP World",
    icon: Globe,
    color: "#e84393",
    description: "Spotlighting achievements and topics relevant to women in IP.",
    latestItems: [
      { title: "Top 50 Women in IP 2026", type: "Report", time: "4 hours ago" },
      { title: "Diversity in IP", type: "Episode", time: "5 days ago" }
    ]
  },
  {
    id: 12,
    title: "IP Services",
    icon: Building,
    color: "#1dd1a1",
    description: "Explore our specialized IP services and consulting.",
    latestItems: [
      { title: "Trademark Registration", type: "Service", time: "Available" },
      { title: "Patent Filing", type: "Service", time: "Available" }
    ]
  },
  {
    id: 5,
    title: "Articles & Insights",
    icon: FileText,
    color: "#0984e3",
    description: "In-depth articles, opinion pieces, and thought leadership.",
    latestItems: [
      { title: "The Future of Copyright", type: "Insight", time: "1 hour ago" },
      { title: "Trademarks in the Metaverse", type: "Article", time: "1 day ago" }
    ]
  },
  {
    id: 6,
    title: "IP News & Legal Updates",
    icon: Newspaper,
    color: "#d63031",
    description: "The latest developments in patent, trademark, and copyright law.",
    latestItems: [
      { title: "Supreme Court IP Ruling", type: "Breaking", time: "30 mins ago" },
      { title: "New EPO Guidelines", type: "Update", time: "5 hours ago" }
    ]
  },
  {
    id: 7,
    title: "Research & Reports",
    icon: FileCheck,
    color: "#6c5ce7",
    description: "Data-driven insights and comprehensive industry reports.",
    latestItems: [
      { title: "2026 IP Filing Statistics", type: "Data", time: "1 day ago" },
      { title: "Global Innovation Index", type: "Report", time: "1 week ago" }
    ]
  },
  {
    id: 8,
    title: "Guides & Toolkits",
    icon: BookOpen,
    color: "#00b894",
    description: "Practical guides and toolkits for daily IP operations.",
    latestItems: [
      { title: "Prior Art Search Guide", type: "PDF Guide", time: "2 days ago" },
      { title: "IP Due Diligence Checklist", type: "Toolkit", time: "5 days ago" }
    ]
  },
  {
    id: 9,
    title: "Career & Leadership",
    icon: Briefcase,
    color: "#fdcb6e",
    description: "Advice on career progression and leadership skills in law.",
    latestItems: [
      { title: "Negotiating Partner Track", type: "Video", time: "3 days ago" },
      { title: "Mentorship in IP Law", type: "Article", time: "1 week ago" }
    ]
  },
  {
    id: 10,
    title: "In-House Counsel Resources",
    icon: Building,
    color: "#e17055",
    description: "Tools and strategies specifically for corporate IP counsel.",
    latestItems: [
      { title: "Managing Outside Counsel", type: "Webinar", time: "4 days ago" },
      { title: "IP Budgeting Templates", type: "Toolkit", time: "1 week ago" }
    ]
  },
  {
    id: 11,
    title: "Podcasts & Conversations",
    icon: Mic,
    color: "#00cec9",
    description: "Interviews and discussions with leading IP professionals.",
    latestItems: [
      { title: "Interview with USPTO Director", type: "New Episode", time: "1 day ago" },
      { title: "The IP Innovators Series", type: "Podcast", time: "4 days ago" }
    ]
  },
  {
    id: 2,
    title: "Wellness & Wellbeing",
    icon: Headphones,
    color: "#00d26a",
    description: "Resources focused on mental health and work-life balance.",
    latestItems: [
      { title: "Work-Life Balance for Lawyers", type: "New Webinar", time: "5 hours ago" },
      { title: "Stress Management Techniques", type: "Audio Guide", time: "2 days ago" }
    ]
  }
];

export default function ResourcesPage() {
  const [resources, setResources] = useState(MOCK_CATEGORIES);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<string>('All Resources');
  const [isGenerating, setIsGenerating] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsGenerating(false);
    }, 6000);
    return () => clearTimeout(timer);
  }, []);

  const filteredResources = resources.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          r.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesTab = true;
    if (activeTab === 'Latest Resources') {
      matchesTab = r.id === 1;
    }

    return matchesSearch && matchesTab;
  });

  if (isGenerating) {
    return (
      <div className="w-full min-h-[calc(100vh-73px)] flex items-center justify-center bg-white dark:bg-[#0f172a] overflow-hidden relative z-10">
        <style dangerouslySetInnerHTML={{ __html: `
          .loader-wrapper {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 120px;
            width: auto;
            margin: 2rem;

            font-family: "Poppins", sans-serif;
            font-size: 1.6em;
            font-weight: 600;
            user-select: none;

            scale: 2;
          }

          .loader {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: 100%;
            z-index: 1;

            background-color: transparent;
            mask: repeating-linear-gradient(
              90deg,
              transparent 0,
              transparent 6px,
              black 7px,
              black 8px
            );
          }

          .loader::after {
            content: "";
            position: absolute;
            top: 0;
            left: -100%;
            width: 300%;
            height: 100%;

            background-image: radial-gradient(ellipse at 50% 50%, #ff0 0%, transparent 50%),
              radial-gradient(ellipse at 45% 45%, #f00 0%, transparent 45%),
              radial-gradient(ellipse at 55% 55%, #0ff 0%, transparent 45%),
              radial-gradient(ellipse at 45% 55%, #0f0 0%, transparent 45%),
              radial-gradient(ellipse at 55% 45%, #00f 0%, transparent 45%);
            mask: radial-gradient(
              ellipse at 50% 50%,
              transparent 0%,
              transparent 10%,
              black 25%
            );
            animation:
              transform-animation 4s infinite alternate,
              opacity-animation 4s infinite;
            animation-timing-function: cubic-bezier(0.6, 0.8, 0.5, 1);
          }

          @keyframes transform-animation {
            0% {
              transform: translate(-33%);
            }
            100% {
              transform: translate(33%);
            }
          }

          @keyframes opacity-animation {
            0%,
            100% {
              opacity: 0;
            }
            15% {
              opacity: 1;
            }
            65% {
              opacity: 0;
            }
          }

          .loader-letter {
            display: inline-block;
            opacity: 0;
            animation: loader-letter-anim 4s infinite linear;
            z-index: 2;
          }

          .loader-letter:nth-child(1) { animation-delay: 0.1s; }
          .loader-letter:nth-child(2) { animation-delay: 0.205s; }
          .loader-letter:nth-child(3) { animation-delay: 0.31s; }
          .loader-letter:nth-child(4) { animation-delay: 0.415s; }
          .loader-letter:nth-child(5) { animation-delay: 0.521s; }
          .loader-letter:nth-child(6) { animation-delay: 0.626s; }
          .loader-letter:nth-child(7) { animation-delay: 0.731s; }
          .loader-letter:nth-child(8) { animation-delay: 0.837s; }
          .loader-letter:nth-child(9) { animation-delay: 0.942s; }
          .loader-letter:nth-child(10) { animation-delay: 1.047s; }
          .loader-letter:nth-child(11) { animation-delay: 1.152s; }
          .loader-letter:nth-child(12) { animation-delay: 1.257s; }
          .loader-letter:nth-child(13) { animation-delay: 1.362s; }
          .loader-letter:nth-child(14) { animation-delay: 1.467s; }
          .loader-letter:nth-child(15) { animation-delay: 1.572s; }
          .loader-letter:nth-child(16) { animation-delay: 1.677s; }
          .loader-letter:nth-child(17) { animation-delay: 1.782s; }
          .loader-letter:nth-child(18) { animation-delay: 1.887s; }
          .loader-letter:nth-child(19) { animation-delay: 1.992s; }
          .loader-letter:nth-child(20) { animation-delay: 2.097s; }
          .loader-letter:nth-child(21) { animation-delay: 2.202s; }
          .loader-letter:nth-child(22) { animation-delay: 2.307s; }
          .loader-letter:nth-child(23) { animation-delay: 2.412s; }
          .loader-letter:nth-child(24) { animation-delay: 2.517s; }

          @keyframes loader-letter-anim {
            0% { opacity: 0; }
            5% {
              opacity: 1;
              text-shadow: 0 0 4px currentColor;
              transform: scale(1.1) translateY(-2px);
            }
            20% { opacity: 0.2; }
            100% { opacity: 0; }
          }
        `}} />
        <div className="loader-wrapper text-[#111] dark:text-white">
          <span className="loader-letter">O</span>
          <span className="loader-letter">p</span>
          <span className="loader-letter">e</span>
          <span className="loader-letter">n</span>
          <span className="loader-letter">i</span>
          <span className="loader-letter">n</span>
          <span className="loader-letter">g</span>
          <span className="loader-letter">&nbsp;</span>
          <span className="loader-letter">R</span>
          <span className="loader-letter">e</span>
          <span className="loader-letter">s</span>
          <span className="loader-letter">o</span>
          <span className="loader-letter">u</span>
          <span className="loader-letter">r</span>
          <span className="loader-letter">c</span>
          <span className="loader-letter">e</span>
          <span className="loader-letter">&nbsp;</span>
          <span className="loader-letter">L</span>
          <span className="loader-letter">i</span>
          <span className="loader-letter">b</span>
          <span className="loader-letter">r</span>
          <span className="loader-letter">a</span>
          <span className="loader-letter">r</span>
          <span className="loader-letter">y</span>

          <div className="loader"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0f172a] flex flex-col">
      {/* Main Content */}
      <div className="flex-1 w-full max-w-[1400px] mx-auto p-4 md:p-6 lg:p-8 pt-8">
        
        {/* Header Section */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black flex items-center gap-4 text-transparent bg-clip-text bg-gradient-to-r from-[#131313] via-[#5a32fa] to-[#ff90e8] tracking-tight">
              <div className="bg-[#5a32fa]/10 p-2.5 rounded-2xl flex items-center justify-center shrink-0">
                <BookOpen size={32} className="text-[#5a32fa]" />
              </div>
              Resource Library
            </h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium mt-3 text-lg">Access exclusive guides, templates, webinars, and reports.</p>
          </div>

          <div className="flex items-center gap-4">
            <button className="group relative flex items-center gap-2 bg-gradient-to-r from-[#5a32fa] to-[#ff90e8] text-white px-7 py-3.5 rounded-2xl font-bold shadow-lg shadow-[#5a32fa]/25 hover:shadow-xl hover:shadow-[#5a32fa]/40 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
              <div className="absolute inset-0 bg-white dark:bg-[#0f172a]/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              <Plus size={20} strokeWidth={3} className="relative z-10 group-hover:rotate-90 transition-transform duration-300" />
              <span className="relative z-10">Upload Resource</span>
            </button>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col xl:flex-row gap-5 mb-16 items-center">
          <div className="flex gap-2 overflow-x-auto pb-2 xl:pb-0 no-scrollbar w-full xl:w-auto p-1">
            {['All Resources', 'Latest Resources'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 flex items-center gap-2 whitespace-nowrap shrink-0 ${
                  activeTab === tab
                    ? 'bg-white dark:bg-[#0f172a] text-[#5a32fa] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 dark:border-white/10/50 scale-105'
                    : 'bg-transparent text-gray-500 dark:text-gray-400 hover:bg-white dark:bg-[#0f172a]/60 hover:text-gray-800 dark:text-gray-100 hover:shadow-sm border border-transparent'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="relative flex-1 w-full max-w-md ml-auto group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#5a32fa] to-[#ff90e8] rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
            <div className="relative flex items-center bg-white dark:bg-[#0f172a] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm group-hover:shadow-md transition-shadow overflow-hidden">
              <Search className="w-5 h-5 text-gray-400 ml-4 shrink-0 group-focus-within:text-[#5a32fa] transition-colors" />
              <input 
                type="text" 
                placeholder="Search resources..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent py-3.5 pl-3 pr-4 font-medium text-gray-800 dark:text-gray-100 focus:outline-none placeholder-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => {
            const Icon = resource.icon;
            return (
              <Link 
                href={resource.id === 1 ? `/platform/resources/webinars` : resource.id === 2 ? `/platform/resources/wellness` : resource.id === 3 ? `/platform/resources/education` : resource.id === 4 ? `/platform/resources/womens-ip-world` : resource.id === 5 ? `/platform/resources/articles-insights` : resource.id === 6 ? `/platform/resources/ip-news` : resource.id === 7 ? `/platform/resources/research-reports` : resource.id === 8 ? `/platform/resources/guides-toolkits` : resource.id === 9 ? `/platform/resources/career-leadership` : resource.id === 10 ? `/platform/resources/in-house-counsel` : resource.id === 11 ? `/platform/resources/podcasts-conversations` : resource.id === 12 ? `/platform/resources/ip-services` : `/platform/resources/wellness/${resource.id}`}
                key={resource.id}
                className="relative bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-2xl rounded-[2rem] border border-white/60 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] flex flex-col hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(90,50,250,0.15)] transition-all duration-500 group cursor-pointer overflow-hidden block z-10"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#5a32fa]/5 to-[#ff90e8]/5 dark:from-[#5a32fa]/10 dark:to-[#ff90e8]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0" />
                
                <div className="h-52 w-full relative shrink-0 overflow-hidden z-10">
                  <img 
                    src={resource.id === 1 ? `/resource3.jpg` : resource.id === 2 ? `/wellbeing.jpg` : resource.id === 4 ? `/Womens-IP-World-Award.webp` : resource.id === 5 ? `https://media.licdn.com/dms/image/v2/D4D12AQGPvWYs0hREpQ/article-cover_image-shrink_720_1280/B4DZUeerAVGkAI-/0/1739973132208?e=2147483647&v=beta&t=jDj9Iy2LLXJfKsScgkaNMKyXRrgy34PP3nZFglw-Rt0` : resource.id === 6 ? `https://www.bennett.edu.in/wp-content/uploads/2025/02/Advanced-Intellectual-Property-Law-Types-Core-Modules-and-Career-Avenues.webp` : resource.id === 7 ? `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxBiK_KFYr8IEt7R9niEFVTTjmFYgcMU7mSy4MLHc1dlrjzLndY55xWRBF&s=10` : resource.id === 8 ? `https://media.licdn.com/dms/image/v2/D5610AQG43vrwkaPiSQ/image-shrink_800/image-shrink_800/0/1707177003680?e=2147483647&v=beta&t=sq45ZJZYH8htsCpG76UiVa0yDDkZUsddD_Axx5yFKKY` : resource.id === 9 ? `https://media.licdn.com/dms/image/v2/D4E12AQEEtjLt4_x96g/article-cover_image-shrink_600_2000/B4EZt2WvkFGYAQ-/0/1767217232568?e=2147483647&v=beta&t=uf-9-XxWoJeKHz6j0AFDlc2l0-RX9BbUZ6lNULQjs1o` : resource.id === 10 ? `https://cdn.prod.website-files.com/696a195e77c16374d6beeb51/698ee7bbc05af6693c7a57eb_63c5782cf0ee732be3f43836_614a0f782b14afae42c142df_InHouse%252520Counsel%252520Empowered%252520by%252520Tech.png` : resource.id === 11 ? `https://coruzant.com/wp-content/uploads/2022/05/podcast-conversation.jpg` : `/resourceimg${resource.id % 2 === 0 ? 2 : 1}.jpg`} 
                    alt={resource.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#0f172a] via-transparent to-transparent opacity-100 transition-opacity duration-500" />
                  <div className="absolute inset-0 bg-[#5a32fa]/20 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                
                <div className="p-6 pt-2 flex flex-col flex-1 relative z-10">

                <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2 line-clamp-2 text-center group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#5a32fa] group-hover:to-[#ff90e8] transition-all duration-300">{resource.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-6 flex-1 text-center leading-relaxed">{resource.description}</p>
                
                {resource.latestItems && (
                  <div className="mt-2 mb-4 flex flex-col gap-2">
                    {resource.latestItems.map((item, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg border border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5 animate-pulse flex items-center gap-3">
                        <div className="relative flex h-2 w-2 shrink-0">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                        </div>
                        <div className="flex-1 flex items-center justify-between min-w-0 gap-2">
                          <p className="text-sm font-bold text-gray-800 dark:text-gray-100 truncate">{item.title}</p>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded whitespace-nowrap" style={{ color: resource.color, backgroundColor: `${resource.color}15` }}>
                              {item.type}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="flex items-center justify-end mt-auto border-t border-gray-100 dark:border-white/5 pt-5 relative">
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#5a32fa]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <span className="font-bold text-sm flex items-center gap-2 group-hover:translate-x-1 transition-all duration-300 text-gray-400 group-hover:text-[#5a32fa]">
                    Explore Category <span className="group-hover:translate-x-1 transition-transform duration-300">&rarr;</span>
                  </span>
                </div>
                </div>
              </Link>
            );
          })}

          {filteredResources.length === 0 && (
            <div className="col-span-full py-20 text-center bg-white dark:bg-[#0f172a] rounded-[2rem] border border-gray-200 dark:border-white/20 border-dashed">
              <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">No resources found</h3>
              <p className="text-gray-500 dark:text-gray-400 font-medium">Try adjusting your search filters to find what you're looking for.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
