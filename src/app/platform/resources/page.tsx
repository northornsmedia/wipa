// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, Search, Download, FileText, Video, Headphones, Bookmark, Plus, Globe, Newspaper, Lightbulb, Briefcase, Building, Building2, Mic, MonitorPlay, FileCheck, Presentation, Sparkles, ChevronRight, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const MOCK_CATEGORIES = [
  {
    id: 1,
    title: "Webinars & Learning",
    badge: "Live & Masterclass",
    icon: MonitorPlay,
    color: "#ff90e8",
    image: "/resource3.jpg",
    path: "/platform/resources/webinars",
    isWide: true,
    actionText: "Watch ↗",
    description: "Interactive sessions and educational masterclasses on intellectual property.",
    latestItems: [
      { title: "AI in Patent Law", type: "New Webinar", time: "1 day ago" },
      { title: "Mastering IP Litigation", type: "Masterclass", time: "3 days ago" }
    ]
  },
  {
    id: 2,
    title: "Wellness & Wellbeing",
    badge: "Mind & Focus",
    icon: Headphones,
    color: "#00d26a",
    image: "/wellbeing.jpg",
    path: "/platform/resources/wellness",
    isWide: false,
    actionText: "Listen 🎧",
    description: "Resources focused on mental health and work-life balance.",
    latestItems: [
      { title: "Work-Life Balance for Lawyers", type: "New Webinar", time: "5 hours ago" },
      { title: "Stress Management Techniques", type: "Audio Guide", time: "2 days ago" }
    ]
  },
  {
    id: 11,
    title: "Podcasts & Audio",
    badge: "Audio Series",
    icon: Mic,
    color: "#00cec9",
    image: "https://coruzant.com/wp-content/uploads/2022/05/podcast-conversation.jpg",
    path: "/platform/resources/podcasts-conversations",
    isWide: false,
    actionText: "Tune In 🎙️",
    description: "Interviews and discussions with leading IP professionals.",
    latestItems: [
      { title: "Interview with USPTO Director", type: "New Episode", time: "1 day ago" },
      { title: "The IP Innovators Series", type: "Podcast", time: "4 days ago" }
    ]
  },
  {
    id: 4,
    title: "Publications",
    badge: "Official Issue",
    icon: Globe,
    color: "#e84393",
    image: "/images/publications-card-banner.png",
    path: "/platform/publications",
    isWide: true,
    actionText: "Read Issue ↗",
    description: "Official partner publications, annual issues, and global editorial visibility for women in IP.",
    latestItems: [
      { title: "Women's IP World Annual", type: "Annual Issue", time: "Available" },
      { title: "Global IP Magazine", type: "Magazine", time: "Available" }
    ]
  },
  {
    id: 6,
    title: "IP News & Updates",
    badge: "Breaking",
    icon: Newspaper,
    color: "#d63031",
    image: "https://www.bennett.edu.in/wp-content/uploads/2025/02/Advanced-Intellectual-Property-Law-Types-Core-Modules-and-Career-Avenues.webp",
    path: "/platform/resources/ip-news",
    isWide: false,
    actionText: "Read 📰",
    description: "The latest developments in patent, trademark, and copyright law.",
    latestItems: [
      { title: "Supreme Court IP Ruling", type: "Breaking", time: "30 mins ago" },
      { title: "New EPO Guidelines", type: "Update", time: "5 hours ago" }
    ]
  },
  {
    id: 5,
    title: "Articles & Insights",
    badge: "Analysis",
    icon: FileText,
    color: "#0984e3",
    image: "https://media.licdn.com/dms/image/v2/D4D12AQGPvWYs0hREpQ/article-cover_image-shrink_720_1280/B4DZUeerAVGkAI-/0/1739973132208?e=2147483647&v=beta&t=jDj9Iy2LLXJfKsScgkaNMKyXRrgy34PP3nZFglw-Rt0",
    path: "/platform/resources/articles-insights",
    isWide: false,
    actionText: "Explore 📄",
    description: "In-depth articles, opinion pieces, and thought leadership.",
    latestItems: [
      { title: "The Future of Copyright", type: "Insight", time: "1 hour ago" },
      { title: "Trademarks in the Metaverse", type: "Article", time: "1 day ago" }
    ]
  },
  {
    id: 13,
    title: "IP Law Firms",
    badge: "Directory",
    icon: Building2,
    color: "#f59e0b",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    path: "/platform/resources/ip-firms",
    claimPath: "/platform/resources/ip-firms/claim",
    isWide: false,
    actionText: "Firms 🏢",
    description: "Search and connect with specialized IP law firms worldwide.",
    latestItems: [
      { title: "Browse Top Firms", type: "Directory", time: "Available" },
      { title: "Verified IP Partners", type: "Network", time: "Available" }
    ]
  },
  {
    id: 12,
    title: "IP Services & Tech",
    badge: "Solutions",
    icon: Building,
    color: "#1dd1a1",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
    path: "/platform/resources/ip-services",
    listPath: "/platform/resources/ip-services/list",
    isWide: false,
    actionText: "Solutions ⚡",
    description: "Specialized IP consulting, docketing, portfolio management, and technology solutions.",
    latestItems: [
      { title: "Tech Operations (PSS)", type: "Service", time: "Available" },
      { title: "Genie AI Legal Intelligence", type: "AI Tool", time: "Available" }
    ]
  },
  {
    id: 3,
    title: "Education & Prep",
    badge: "Academy",
    icon: BookOpen,
    color: "#5a32fa",
    image: "/resourceimg1.jpg",
    path: "/platform/resources/education",
    isWide: false,
    actionText: "Courses 🎓",
    description: "Resources for advancing your IP career and patent knowledge.",
    latestItems: [
      { title: "Global IP Strategies 2026", type: "New PDF", time: "2 hours ago" },
      { title: "Patent Law Fundamentals", type: "New Course", time: "1 day ago" }
    ]
  },
  {
    id: 8,
    title: "Guides & Toolkits",
    badge: "Templates",
    icon: BookOpen,
    color: "#00b894",
    image: "https://media.licdn.com/dms/image/v2/D5610AQG43vrwkaPiSQ/image-shrink_800/image-shrink_800/0/1707177003680?e=2147483647&v=beta&t=sq45ZJZYH8htsCpG76UiVa0yDDkZUsddD_Axx5yFKKY",
    path: "/platform/resources/guides-toolkits",
    isWide: false,
    actionText: "Toolkits 📥",
    description: "Practical guides, due diligence checklists, and toolkits for daily IP operations.",
    latestItems: [
      { title: "Prior Art Search Guide", type: "PDF Guide", time: "2 days ago" },
      { title: "IP Due Diligence Checklist", type: "Toolkit", time: "5 days ago" }
    ]
  },
  {
    id: 7,
    title: "Research & Reports",
    badge: "Data & Stats",
    icon: FileCheck,
    color: "#6c5ce7",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxBiK_KFYr8IEt7R9niEFVTTjmFYgcMU7mSy4MLHc1dlrjzLndY55xWRBF&s=10",
    path: "/platform/resources/research-reports",
    isWide: false,
    actionText: "Reports 📊",
    description: "Data-driven insights and comprehensive industry reports.",
    latestItems: [
      { title: "2026 IP Filing Statistics", type: "Data", time: "1 day ago" },
      { title: "Global Innovation Index", type: "Report", time: "1 week ago" }
    ]
  },
  {
    id: 9,
    title: "Career & Leadership",
    badge: "Career Hub",
    icon: Briefcase,
    color: "#fdcb6e",
    image: "https://media.licdn.com/dms/image/v2/D4E12AQEEtjLt4_x96g/article-cover_image-shrink_600_2000/B4EZt2WvkFGYAQ-/0/1767217232568?e=2147483647&v=beta&t=uf-9-XxWoJeKHz6j0AFDlc2l0-RX9BbUZ6lNULQjs1o",
    path: "/platform/resources/career-leadership",
    isWide: false,
    actionText: "Career 💼",
    description: "Advice on career progression and leadership skills in law.",
    latestItems: [
      { title: "Negotiating Partner Track", type: "Video", time: "3 days ago" },
      { title: "Mentorship in IP Law", type: "Article", time: "1 week ago" }
    ]
  },
  {
    id: 10,
    title: "In-House Counsel Suite",
    badge: "Corporate Specialty",
    icon: Building,
    color: "#e17055",
    image: "https://cdn.prod.website-files.com/696a195e77c16374d6beeb51/698ee7bbc05af6693c7a57eb_63c5782cf0ee732be3f43836_614a0f782b14afae42c142df_InHouse%252520Counsel%252520Empowered%252520by%252520Tech.png",
    path: "/platform/resources/in-house-counsel",
    isWide: true,
    actionText: "Corporate Suite 🏢",
    description: "Tools and outside counsel management strategies specifically for corporate IP counsel.",
    latestItems: [
      { title: "Managing Outside Counsel", type: "Webinar", time: "4 days ago" },
      { title: "IP Budgeting Templates", type: "Toolkit", time: "1 week ago" }
    ]
  }
];

export default function ResourcesPage() {
  const router = useRouter();
  const [resources, setResources] = useState<any[]>(MOCK_CATEGORIES.map(c => ({...c, latestItems: []})));
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<string>('All Resources');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const { data: allResources } = await supabase
        .from('resources')
        .select('*')
        .order('created_at', { ascending: false });
        
      const { data: allPodcasts } = await supabase
        .from('podcasts')
        .select('*')
        .order('created_at', { ascending: false });

      const updatedCategories = MOCK_CATEGORIES.map(category => {
        let latest = [];
        if (category.id === 11) { // Podcasts
          latest = (allPodcasts || []).slice(0, 2).map((p: any) => ({
            title: p.title,
            type: "Podcast",
            time: new Date(p.created_at).toLocaleDateString()
          }));
        } else {
          // Attempt to match by category name or similar
          const matches = (allResources || []).filter((r: any) => 
            r.category?.toLowerCase() === category.title.toLowerCase() || 
            category.title.toLowerCase().includes(r.category?.toLowerCase() || 'xyz')
          );
          latest = matches.slice(0, 2).map((r: any) => ({
            title: r.title,
            type: r.type,
            time: new Date(r.created_at).toLocaleDateString()
          }));
        }
        return {
          ...category,
          latestItems: latest.length > 0 ? latest : category.latestItems // fallback to mock if empty for visual
        };
      });

      setResources(updatedCategories);
    };
    
    fetchData();
  }, []);

  const filteredResources = resources.filter(r => {
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch = !q || 
      r.title.toLowerCase().includes(q) || 
      r.description.toLowerCase().includes(q) ||
      (r.badge && r.badge.toLowerCase().includes(q)) ||
      (r.latestItems && r.latestItems.some((item: any) => item.title?.toLowerCase().includes(q)));
    
    let matchesTab = true;
    if (activeTab === 'Latest Resources') {
      matchesTab = r.id === 1;
    } else if (activeTab !== 'All Resources') {
      matchesTab = r.title.toLowerCase().includes(activeTab.toLowerCase());
    }

    return matchesSearch && matchesTab;
  });

  if (isGenerating) {
    return (
      <div className="w-full min-h-[calc(100vh-73px)] flex flex-col items-center justify-center bg-white dark:bg-[#0f172a] overflow-hidden relative z-10 px-4">
        <style dangerouslySetInnerHTML={{ __html: `
          .loader-wrapper {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 70px;
            width: auto;
            max-width: 95vw;
            margin: 0 auto;

            font-family: "Poppins", sans-serif;
            font-size: 0.82rem;
            font-weight: 700;
            user-select: none;
            text-align: center;
            white-space: nowrap;
          }

          @media (min-width: 480px) {
            .loader-wrapper {
              font-size: 1.05rem;
              height: 85px;
            }
          }

          @media (min-width: 768px) {
            .loader-wrapper {
              font-size: 1.35rem;
              height: 100px;
            }
          }

          @media (min-width: 1024px) {
            .loader-wrapper {
              font-size: 2.25rem;
              height: 150px;
              letter-spacing: 0.02em;
            }
          }

          @media (min-width: 1440px) {
            .loader-wrapper {
              font-size: 2.65rem;
              height: 170px;
            }
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
              transparent 4px,
              black 5px,
              black 6px
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
      {/* Main Content: Edge-to-edge on mobile with px-3.5, container on desktop */}
      <div className="flex-1 w-full max-w-none sm:max-w-[1400px] mx-auto px-3.5 sm:px-6 lg:px-8 py-3 sm:py-6 md:py-8">
        
        {/* Mobile Modern Header */}
        <div className="sm:hidden mb-3.5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                Resource Library
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                11 IP verticals, webinars & directories
              </p>
            </div>

            {/* Mobile Quick Upload Action */}
            <Link
              href="/platform/resources/ip-services/list"
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#5a32fa] to-[#ff2a5f] text-white px-3.5 py-1.5 rounded-full text-xs font-bold shadow-xs active:scale-95 transition-all shrink-0"
            >
              <Plus size={13} strokeWidth={2.8} />
              <span>Upload</span>
            </Link>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden sm:flex mb-8 flex-row items-center justify-between gap-4">
          <div className="w-auto">
            <div className="flex items-center justify-start gap-3">
              <div className="w-12 h-12 bg-[#5a32fa]/10 dark:bg-[#5a32fa]/20 p-2.5 rounded-2xl flex items-center justify-center shrink-0 shadow-xs">
                <BookOpen className="w-6 h-6 text-[#5a32fa] dark:text-[#ff90e8]" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight text-left">
                  Resource Library
                </h1>
                <p className="text-gray-500 dark:text-gray-400 font-medium mt-1 text-sm md:text-base text-left">
                  Access exclusive guides, templates, webinars, and reports across 11 verticals.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <Link
              href="/platform/resources/ip-services/list"
              className="group relative inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#5a32fa] to-[#ff2a5f] text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-md shadow-[#5a32fa]/20 hover:shadow-lg hover:shadow-[#5a32fa]/30 active:scale-95 transition-all overflow-hidden"
            >
              <Plus size={16} strokeWidth={2.8} className="relative z-10 group-hover:rotate-90 transition-transform duration-300" />
              <span className="relative z-10">Upload Resource</span>
            </Link>
          </div>
        </div>

        {/* Mobile Real-Time Interactive Search Bar */}
        <div className="sm:hidden mb-2.5">
          <div className="relative flex items-center w-full bg-slate-100 dark:bg-white/[0.06] border border-transparent focus-within:border-[#5a32fa]/40 rounded-2xl px-3.5 py-2.5 transition-colors">
            <Search size={15} className="text-slate-400 mr-2 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 11+ IP verticals, webinars, guides..."
              className="w-full bg-transparent text-xs text-slate-900 dark:text-white placeholder-slate-400 outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Edge-to-Edge Swipeable Category Chips for Mobile Navigation */}
        <div className="mb-3.5 sm:hidden -mx-3.5 px-3.5 overflow-x-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex items-center gap-1.5 w-max py-0.5">
            <button
              type="button"
              onClick={() => {
                setActiveTab('All Resources');
                setSearchQuery("");
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap active:scale-95 shrink-0 ${
                activeTab === 'All Resources'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                  : 'bg-white dark:bg-white/5 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-white/10'
              }`}
            >
              All Verticals
            </button>
            {[
              { title: 'Webinars', key: 'Webinars' },
              { title: 'Publications', key: 'Publications' },
              { title: 'Wellness', key: 'Wellness' },
              { title: 'Podcasts', key: 'Podcasts' },
              { title: 'Articles', key: 'Articles' },
              { title: 'IP News', key: 'News' },
              { title: 'IP Firms', key: 'Firms' },
              { title: 'IP Services', key: 'Services' },
              { title: 'Education', key: 'Education' },
              { title: 'Toolkits', key: 'Guides' },
              { title: 'Research', key: 'Research' },
              { title: 'Career', key: 'Career' },
              { title: 'In-House', key: 'In-House' },
            ].map((tab, tIdx) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tIdx}
                  type="button"
                  onClick={() => {
                    setActiveTab(isActive ? 'All Resources' : tab.key);
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap active:scale-95 shrink-0 ${
                    isActive
                      ? 'bg-[#5a32fa] text-white shadow-xs'
                      : 'bg-white dark:bg-white/5 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-white/10'
                  }`}
                >
                  {tab.title}
                </button>
              );
            })}
          </div>
        </div>

        {/* 1. MOBILE-ONLY BENTO GRID (Unified Luxury Aesthetic, No voids, Cohesive styling) */}
        <div className="grid grid-cols-2 gap-2.5 sm:hidden">
          {filteredResources.map((resource) => {
            const Icon = resource.icon;
            const categoryHref = resource.path || (
              resource.id === 1 ? `/platform/resources/webinars` :
              resource.id === 2 ? `/platform/resources/wellness` :
              resource.id === 3 ? `/platform/resources/education` :
              resource.id === 4 ? `/platform/publications` :
              resource.id === 5 ? `/platform/resources/articles-insights` :
              resource.id === 6 ? `/platform/resources/ip-news` :
              resource.id === 7 ? `/platform/resources/research-reports` :
              resource.id === 8 ? `/platform/resources/guides-toolkits` :
              resource.id === 9 ? `/platform/resources/career-leadership` :
              resource.id === 10 ? `/platform/resources/in-house-counsel` :
              resource.id === 11 ? `/platform/resources/podcasts-conversations` :
              resource.id === 12 ? `/platform/resources/ip-services` :
              resource.id === 13 ? `/platform/resources/ip-firms` : `/platform/resources/wellness`
            );

            const listingHref = resource.id === 12
              ? '/platform/resources/ip-services/list'
              : resource.id === 13
                ? '/platform/resources/ip-firms/claim'
                : null;

            const isWide = filteredResources.length === 1 || Boolean(resource.isWide);
            const latestItem = resource.latestItems && resource.latestItems.length > 0 ? resource.latestItems[0] : null;

            if (isWide) {
              return (
                <div
                  key={resource.id}
                  onClick={() => router.push(categoryHref)}
                  className="col-span-2 relative rounded-3xl p-4 bg-white dark:bg-[#101626] border border-slate-200/80 dark:border-white/10 shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:shadow-none active:scale-[0.98] transition-all duration-200 cursor-pointer overflow-hidden flex flex-col justify-between min-h-[145px]"
                >
                  {/* Subtle ambient gradient overlay matching category tint */}
                  <div
                    className="absolute top-0 right-0 w-44 h-44 rounded-full blur-3xl opacity-15 pointer-events-none"
                    style={{ backgroundColor: resource.color }}
                  />

                  {/* Top Row: Icon, Title & Badge */}
                  <div className="relative z-10 flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs"
                        style={{ backgroundColor: `${resource.color}15`, color: resource.color }}
                      >
                        <Icon size={22} strokeWidth={2.2} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span
                            className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: `${resource.color}15`, color: resource.color }}
                          >
                            {resource.badge || 'FEATURED'}
                          </span>
                          {resource.id === 1 && (
                            <span className="flex items-center gap-1 text-[9px] font-bold text-rose-500 bg-rose-500/10 px-1.5 py-0.5 rounded-full">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                              LIVE
                            </span>
                          )}
                        </div>
                        <h3 className="text-[15px] font-bold text-slate-900 dark:text-white leading-tight mt-1 truncate">
                          {resource.title}
                        </h3>
                      </div>
                    </div>

                    <span className="text-xs font-bold text-[#5a32fa] dark:text-[#ff90e8] bg-[#5a32fa]/10 dark:bg-white/10 px-2.5 py-1 rounded-full flex items-center gap-1 shrink-0">
                      Explore ↗
                    </span>
                  </div>

                  {/* Middle Description */}
                  <p className="relative z-10 text-xs text-slate-500 dark:text-slate-400 mt-2.5 line-clamp-2 leading-relaxed">
                    {resource.description}
                  </p>

                  {/* Bottom Preview Pill or Listing Action */}
                  <div className="relative z-10 mt-3 pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                    {latestItem ? (
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0"
                          style={{ backgroundColor: `${resource.color}15`, color: resource.color }}
                        >
                          {latestItem.type || 'NEW'}
                        </span>
                        <p className="text-[11px] font-medium text-slate-700 dark:text-slate-300 truncate">
                          {latestItem.title}
                        </p>
                      </div>
                    ) : (
                      <span className="text-[11px] font-semibold text-slate-400">
                        {resource.actionText || 'Explore vertical'}
                      </span>
                    )}

                    {listingHref && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          router.push(listingHref);
                        }}
                        className="px-2.5 py-1 rounded-full bg-[#5a32fa] text-[10px] font-bold text-white shadow-xs active:scale-95 shrink-0 ml-2"
                      >
                        + {resource.id === 12 ? 'List Service' : 'List Firm'}
                      </button>
                    )}
                  </div>
                </div>
              );
            }

            // Compact 1-column Tile (Uniform luxury card, no voids)
            return (
              <div
                key={resource.id}
                onClick={() => router.push(categoryHref)}
                className="col-span-1 relative rounded-3xl p-3.5 bg-white dark:bg-[#101626] border border-slate-200/80 dark:border-white/10 shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:shadow-none active:scale-[0.98] transition-all duration-200 cursor-pointer overflow-hidden flex flex-col justify-between min-h-[160px]"
              >
                {/* Subtle ambient tint */}
                <div
                  className="absolute -top-8 -right-8 w-24 h-24 rounded-full blur-2xl opacity-15 pointer-events-none"
                  style={{ backgroundColor: resource.color }}
                />

                {/* Top Row: Squircle Icon + Tag Badge */}
                <div className="flex items-start justify-between relative z-10 gap-2">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs"
                    style={{ backgroundColor: `${resource.color}15`, color: resource.color }}
                  >
                    <Icon size={19} strokeWidth={2.2} />
                  </div>
                  <span
                    className="text-[8.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0"
                    style={{ color: resource.color, backgroundColor: `${resource.color}15` }}
                  >
                    {resource.badge || 'HUB'}
                  </span>
                </div>

                {/* Middle: Title & Informative Subtitle */}
                <div className="relative z-10 mt-2.5">
                  <h3 className="text-[13.5px] font-bold text-slate-900 dark:text-white leading-snug line-clamp-2">
                    {resource.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {resource.description}
                  </p>
                </div>

                {/* Bottom Row: Themed Action Button & Arrow */}
                <div className="relative z-10 mt-3 pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                  <span
                    className="text-[10.5px] font-bold truncate max-w-[100px]"
                    style={{ color: resource.color }}
                  >
                    {resource.actionText || 'Explore'}
                  </span>

                  {listingHref ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        router.push(listingHref);
                      }}
                      className="text-[10px] font-bold text-[#5a32fa] dark:text-[#ff90e8] hover:underline"
                    >
                      +List
                    </button>
                  ) : (
                    <span
                      className="text-xs font-bold transition-transform group-hover:translate-x-0.5"
                      style={{ color: resource.color }}
                    >
                      ↗
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {/* Featured Global IP Partner Spotlight Banner (Mobile Bento Hero) */}
          <div
            onClick={() => router.push('/platform/resources/ip-firms')}
            className="col-span-2 p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-[#5a32fa] via-purple-600 to-[#ff2a5f] text-white shadow-md relative overflow-hidden flex flex-col justify-between min-h-[125px] active:scale-[0.99] transition-all cursor-pointer"
          >
            <div className="relative z-10 flex items-start justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-white/20 text-white backdrop-blur-md border border-white/20">
                ⭐ Featured Global IP Partner
              </span>
              <span className="text-xs font-bold bg-white/20 px-2.5 py-0.5 rounded-full backdrop-blur-md">
                Explore ↗
              </span>
            </div>
            <div className="relative z-10 mt-3">
              <h3 className="text-base font-black">
                Ennoble IP · Global Patent Prosecution
              </h3>
              <p className="text-xs text-white/80 line-clamp-1 mt-0.5">
                Accelerate cross-border patent applications with 24/7 AI-assisted analytics.
              </p>
            </div>
          </div>

          {filteredResources.length === 0 && (
            <div className="col-span-2 py-12 text-center bg-white dark:bg-white/[0.04] rounded-3xl border border-dashed border-gray-200 dark:border-white/10 p-4">
              <BookOpen size={36} className="mx-auto text-gray-300 dark:text-gray-600 mb-2" />
              <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">No resources found</h3>
              <p className="text-xs text-gray-400 mt-1">Try clearing your search query or filter chip.</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setActiveTab("All Resources");
                }}
                className="mt-3 px-3.5 py-1 rounded-full bg-[#5a32fa] text-xs font-bold text-white shadow-xs"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>

        {/* 2. DESKTOP / TABLET GRID (Preserved 3-column layout) */}
        <div className="hidden sm:block">
          {/* Desktop Splash Sponsored Banner */}
          <div className="mb-8 p-6 rounded-3xl bg-gradient-to-r from-[#5a32fa] via-purple-600 to-[#ff2a5f] text-white shadow-lg relative overflow-hidden flex flex-row items-center justify-between gap-4">
            <div className="relative z-10">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-white/20 text-white backdrop-blur-md mb-2 inline-block border border-white/20">
                ⭐ Featured Global IP Partner
              </span>
              <h3 className="text-xl font-black">Ennoble IP · Global Patent Prosecution</h3>
              <p className="text-xs text-white/80 max-w-xl mt-1">Accelerate your cross-border patent applications with 24/7 AI-assisted analytics and expert drafting.</p>
            </div>
            <Link
              href="/platform/resources/ip-firms"
              className="relative z-10 px-4 py-2 rounded-xl bg-white text-gray-900 text-xs font-bold shadow-md hover:bg-white/90 active:scale-95 transition-all shrink-0"
            >
              Explore Firm
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource) => {
              const Icon = resource.icon;
              const categoryHref = resource.path || (
                resource.id === 1 ? `/platform/resources/webinars` :
                resource.id === 2 ? `/platform/resources/wellness` :
                resource.id === 3 ? `/platform/resources/education` :
                resource.id === 4 ? `/platform/publications` :
                resource.id === 5 ? `/platform/resources/articles-insights` :
                resource.id === 6 ? `/platform/resources/ip-news` :
                resource.id === 7 ? `/platform/resources/research-reports` :
                resource.id === 8 ? `/platform/resources/guides-toolkits` :
                resource.id === 9 ? `/platform/resources/career-leadership` :
                resource.id === 10 ? `/platform/resources/in-house-counsel` :
                resource.id === 11 ? `/platform/resources/podcasts-conversations` :
                resource.id === 12 ? `/platform/resources/ip-services` :
                resource.id === 13 ? `/platform/resources/ip-firms` : `/platform/resources/wellness`
              );

              const listingHref = resource.id === 12
                ? '/platform/resources/ip-services/list'
                : resource.id === 13
                  ? '/platform/resources/ip-firms/claim'
                  : null;

              return (
                <div
                  key={resource.id}
                  onClick={() => router.push(categoryHref)}
                  className="relative bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-2xl rounded-[2rem] border border-white/60 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] flex flex-col hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(90,50,250,0.15)] active:scale-[0.98] transition-all duration-300 group overflow-hidden z-10 cursor-pointer"
                >
                  <Link
                    href={categoryHref}
                    aria-label={`Explore ${resource.title}`}
                    className="absolute inset-0 z-30 cursor-pointer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-[#5a32fa]/5 to-[#ff90e8]/5 dark:from-[#5a32fa]/10 dark:to-[#ff90e8]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0" />
                  
                  <div className="h-52 w-full relative shrink-0 overflow-hidden z-10 pointer-events-none">
                    <img 
                      src={resource.image || `/resourceimg${resource.id % 2 === 0 ? 2 : 1}.jpg`} 
                      alt={resource.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#0f172a] via-transparent to-transparent opacity-100 transition-opacity duration-500" />
                    <div className="absolute inset-0 bg-[#5a32fa]/20 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                  
                  <div className="p-6 pt-2 flex flex-col flex-1 relative z-10 pointer-events-none">
                    <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2 line-clamp-2 text-center group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#5a32fa] group-hover:to-[#ff90e8] transition-all duration-300">
                      {resource.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-6 flex-1 text-center leading-relaxed">
                      {resource.description}
                    </p>
                    
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
                    
                    <div className={`flex items-center ${listingHref ? 'justify-between' : 'justify-end'} gap-3 mt-auto border-t border-gray-100 dark:border-white/5 pt-5 relative z-20`}>
                      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#5a32fa]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      {listingHref && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            router.push(listingHref);
                          }}
                          className="pointer-events-auto relative z-40 inline-flex items-center gap-1.5 rounded-full bg-[#5a32fa] px-3.5 py-2 text-xs font-black text-white shadow-md transition hover:bg-[#4a24db] active:scale-95 cursor-pointer"
                        >
                          <Plus size={14} /> {resource.id === 12 ? 'List Your Service' : 'List Your Firm'}
                        </button>
                      )}
                      <span className="font-bold text-sm flex items-center gap-2 group-hover:translate-x-1 transition-all duration-300 text-gray-400 group-hover:text-[#5a32fa]">
                        Explore Category <span className="group-hover:translate-x-1 transition-transform duration-300">&rarr;</span>
                      </span>
                    </div>
                  </div>
                </div>
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
    </div>
  );
}
