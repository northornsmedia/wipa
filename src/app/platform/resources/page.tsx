// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, Search, Download, FileText, Video, Headphones, Bookmark, Plus, Globe, Newspaper, Lightbulb, Briefcase, Building, Building2, Mic, MonitorPlay, FileCheck, Presentation, ChevronRight, X, Play, Flame, ArrowUpRight, CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import MobileResourcesPage from './MobileResourcesPage';

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

      const categorySlugFromPath = (path: string) => {
        const parts = (path || '').split('/').filter(Boolean);
        return parts[parts.length - 1] || '';
      };

      const updatedCategories = MOCK_CATEGORIES.map(category => {
        let latest = [];
        const slug = categorySlugFromPath(category.path);
        if (slug === 'podcasts-conversations' || category.id === 11) {
          latest = (allPodcasts || []).slice(0, 2).map((p: any) => ({
            title: p.title,
            type: "Podcast",
            time: new Date(p.created_at).toLocaleDateString()
          }));
        } else {
          const matches = (allResources || []).filter((r: any) => {
            const cat = (r.category || '').toLowerCase();
            return cat === slug.toLowerCase() || cat.replace(/-/g, ' ') === slug.replace(/-/g, ' ');
          });
          latest = matches.slice(0, 2).map((r: any) => ({
            title: r.title,
            type: r.resource_type || r.type || "Resource",
            time: new Date(r.created_at).toLocaleDateString()
          }));
        }
        return {
          ...category,
          latestItems: latest.length > 0 ? latest : category.latestItems
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
    <>
    <MobileResourcesPage />
    <div className="hidden min-h-screen bg-[#f8f9fa] dark:bg-[#0f172a] sm:flex sm:flex-col">
      {/* Main Content: Full-width edge-to-edge layout without container bounds */}
      <div className="flex-1 w-full max-w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 py-4 sm:py-8 md:py-10">
        
        {/* Mobile Modern Header */}
        <div className="sm:hidden mb-3.5">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Resource Library
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              Access exclusive guides, templates, webinars, and reports across 11 verticals.
            </p>
          </div>
        </div>

        {/* Desktop Apple-grade Header */}
        <div className="hidden sm:block mb-10 pt-2">
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <span className="text-[11px] font-black uppercase tracking-[0.25em] px-3 py-1 rounded-full bg-[#5a32fa]/10 text-[#5a32fa] dark:text-purple-300 border border-[#5a32fa]/20">
              WIPA Knowledge Vault
            </span>
            <span className="text-xs text-slate-300 dark:text-slate-700">•</span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              11 Professional IP Verticals
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.08] mb-3">
            Resource Library & <span className="text-[#5a32fa] dark:text-purple-400">Legal Intelligence</span>.
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-normal max-w-3xl leading-relaxed">
            Access exclusive practitioner guides, webinar masterclasses, legal templates, market surveys, and annual publications curated for women in intellectual property.
          </p>
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
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Horizontal Category Pill Filter Bar */}
        <div className="mb-4">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            <button
              type="button"
              onClick={() => setActiveTab('All Resources')}
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
              { title: 'Education', key: 'Education' },
              { title: 'Publications', key: 'Publications' },
              { title: 'Articles', key: 'Articles' },
              { title: 'IP News', key: 'News' },
              { title: 'Research', key: 'Research' },
              { title: 'Toolkits', key: 'Guides' },
              { title: 'Career', key: 'Career' },
              { title: 'In-House', key: 'In-House' },
              { title: 'Podcasts', key: 'Podcasts' },
              { title: 'IP Services', key: 'Services' },
              { title: 'IP Firms', key: 'Firms' },
              { title: 'Wellness', key: 'Wellness' },
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

        {/* 1. MOBILE-ONLY APP EXPERIENCE (Reels, Story Orbs, Interactive Feeds) */}
        <div className="sm:hidden flex flex-col gap-6">

          {/* Story Orbs Horizontal Navigation Bar */}
          <div>
            <div className="flex items-center justify-between mb-2 px-0.5">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Browse Verticals
              </span>
              <span className="text-[11px] font-semibold text-[#5a32fa] dark:text-[#ff90e8]">
                11 Hubs
              </span>
            </div>
            <div className="-mx-3.5 px-3.5 overflow-x-auto no-scrollbar flex items-center gap-3.5 pb-1">
              {[
                { title: 'Webinars', path: '/platform/resources/webinars', icon: MonitorPlay, color: 'from-[#ff90e8] to-[#5a32fa]' },
                { title: 'Education', path: '/platform/resources/education', icon: BookOpen, color: 'from-[#5a32fa] to-[#a29bfe]' },
                { title: 'Publications', path: '/platform/publications', icon: Globe, color: 'from-[#e84393] to-[#ff2a5f]' },
                { title: 'Articles', path: '/platform/resources/articles-insights', icon: FileText, color: 'from-[#0984e3] to-[#74b9ff]' },
                { title: 'IP News', path: '/platform/resources/ip-news', icon: Newspaper, color: 'from-[#d63031] to-[#ff7675]' },
                { title: 'Research', path: '/platform/resources/research-reports', icon: FileCheck, color: 'from-[#6c5ce7] to-[#a29bfe]' },
                { title: 'Toolkits', path: '/platform/resources/guides-toolkits', icon: Download, color: 'from-[#00b894] to-[#55efc4]' },
                { title: 'Career', path: '/platform/resources/career-leadership', icon: Briefcase, color: 'from-[#e17055] to-[#fab1a0]' },
                { title: 'In-House', path: '/platform/resources/in-house-counsel', icon: Building, color: 'from-[#0984e3] to-[#74b9ff]' },
                { title: 'Podcasts', path: '/platform/resources/podcasts-conversations', icon: Mic, color: 'from-[#00cec9] to-[#0984e3]' },
                { title: 'IP Services', path: '/platform/resources/ip-services', icon: Building, color: 'from-[#1dd1a1] to-[#10ac84]' },
                { title: 'IP Firms', path: '/platform/resources/ip-firms', icon: Building2, color: 'from-[#f59e0b] to-[#fdcb6e]' },
                { title: 'Wellness', path: '/platform/resources/wellness', icon: Headphones, color: 'from-[#00d26a] to-[#00cec9]' },
              ].map((orb, oIdx) => {
                const OrbIcon = orb.icon;
                return (
                  <Link
                    key={oIdx}
                    href={orb.path}
                    className="flex flex-col items-center gap-1.5 shrink-0 group active:scale-95 transition-transform"
                  >
                    <div className={`w-14 h-14 rounded-2xl p-0.5 bg-gradient-to-tr ${orb.color} shadow-xs`}>
                      <div className="w-full h-full rounded-[14px] bg-white dark:bg-[#111726] flex items-center justify-center text-slate-800 dark:text-white group-hover:bg-transparent group-hover:text-white transition-colors">
                        <OrbIcon size={22} strokeWidth={2.2} />
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 max-w-[62px] truncate text-center">
                      {orb.title}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Conditionally Render Filtered Search Stream OR Curated App Feeds */}
          {searchQuery.trim() !== '' || activeTab !== 'All Resources' ? (
            /* Search / Filter Active: Clean List Stream */
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between px-0.5">
                <span className="text-xs font-bold text-slate-500">
                  {filteredResources.length} Results Found
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setActiveTab("All Resources");
                  }}
                  className="text-xs font-bold text-[#5a32fa] dark:text-[#ff90e8]"
                >
                  Clear filter
                </button>
              </div>

              {filteredResources.map((item) => {
                const ItemIcon = item.icon;
                const path = item.path || `/platform/resources/webinars`;
                return (
                  <Link
                    key={item.id}
                    href={path}
                    className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white dark:bg-[#101626] border border-slate-200/80 dark:border-white/10 shadow-2xs active:scale-[0.98] transition-all"
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-2xs"
                      style={{ backgroundColor: `${item.color}15`, color: item.color }}
                    >
                      <ItemIcon size={22} strokeWidth={2.2} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded"
                          style={{ backgroundColor: `${item.color}15`, color: item.color }}
                        >
                          {item.badge || 'VERTICAL'}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate mt-0.5">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                        {item.description}
                      </p>
                    </div>
                    <ChevronRight size={18} className="text-slate-400 shrink-0" />
                  </Link>
                );
              })}

              {filteredResources.length === 0 && (
                <div className="py-12 text-center bg-white dark:bg-[#101626] rounded-2xl border border-dashed border-slate-200 dark:border-white/10 p-4">
                  <BookOpen size={32} className="mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                  <p className="text-xs font-bold text-slate-600 dark:text-slate-400">No matching resources found</p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setActiveTab("All Resources");
                    }}
                    className="mt-2 text-xs font-bold text-[#5a32fa]"
                  >
                    Reset Search
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Default Mode: Curated App Experience */
            <div className="flex flex-col gap-6">

              {/* 1. Hero Spotlight: Featured Masterclass */}
              <div
                onClick={() => router.push('/platform/resources/webinars')}
                className="relative rounded-3xl overflow-hidden bg-slate-950 text-white p-5 min-h-[190px] flex flex-col justify-between shadow-lg cursor-pointer active:scale-[0.99] transition-all"
              >
                <div className="absolute inset-0 z-0">
                  <img
                    src="/resource3.jpg"
                    alt="Featured Masterclass"
                    className="w-full h-full object-cover opacity-45"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                </div>

                <div className="relative z-10 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-rose-500 text-white shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    LIVE MASTERCLASS
                  </span>
                  <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full flex items-center gap-1">
                    Watch ↗
                  </span>
                </div>

                <div className="relative z-10 mt-6">
                  <div className="flex items-center gap-2 mb-1.5 text-rose-400 text-xs font-semibold">
                    <Flame size={14} />
                    <span>Trending in Intellectual Property</span>
                  </div>
                  <h3 className="text-lg font-black leading-snug">
                    AI in Patent Law & Cross-Border Prosecution
                  </h3>
                  <p className="text-xs text-slate-300 line-clamp-1 mt-1">
                    BGLS Legal, Tech & AI Dubai 2026 Masterclass Series
                  </p>
                </div>
              </div>

              {/* 2. REEL: 🎥 Masterclasses & Video Sessions */}
              <div>
                <div className="flex items-center justify-between mb-2.5 px-0.5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-pink-500/10 text-pink-600 flex items-center justify-center">
                      <MonitorPlay size={14} strokeWidth={2.5} />
                    </div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white">
                      Masterclasses & Webinars
                    </h3>
                  </div>
                  <Link
                    href="/platform/resources/webinars"
                    className="text-xs font-bold text-[#5a32fa] dark:text-[#ff90e8] flex items-center gap-0.5"
                  >
                    <span>See all</span>
                    <ChevronRight size={14} />
                  </Link>
                </div>

                <div className="-mx-3.5 px-3.5 overflow-x-auto no-scrollbar flex gap-3 snap-x snap-mandatory">
                  {[
                    { title: 'AI in Patent Law & Generative Models', type: 'Live Webinar', time: '1 day ago', duration: '48m', image: '/resource3.jpg', path: '/platform/resources/webinars' },
                    { title: 'Mastering IP Litigation in Federal Courts', type: 'Masterclass', time: '3 days ago', duration: '1h 15m', image: '/resourceimg1.jpg', path: '/platform/resources/webinars' },
                    { title: 'Cross-Border Trademark Clearance', type: 'Panel', time: '1 week ago', duration: '55m', image: '/wellbeing.jpg', path: '/platform/resources/webinars' },
                  ].map((vid, vIdx) => (
                    <Link
                      key={vIdx}
                      href={vid.path}
                      className="w-[230px] shrink-0 snap-start rounded-2xl overflow-hidden bg-white dark:bg-[#101626] border border-slate-200/80 dark:border-white/10 shadow-2xs active:scale-95 transition-all group flex flex-col"
                    >
                      <div className="relative h-28 w-full bg-slate-900 overflow-hidden">
                        <img src={vid.image} alt={vid.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-black/75 text-white border border-white/10">
                          {vid.type}
                        </div>
                        <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/70 text-white">
                          {vid.duration}
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-9 h-9 rounded-full bg-white/90 text-slate-900 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Play size={15} className="fill-slate-900 translate-x-0.5" />
                          </div>
                        </div>
                      </div>
                      <div className="p-3 flex-1 flex flex-col justify-between">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug">
                          {vid.title}
                        </h4>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2">
                          <span>{vid.time}</span>
                          <span className="text-[#5a32fa] font-bold">Watch ↗</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* 3. REEL: 🎙️ Audio Lounge (Podcasts & Wellness) */}
              <div>
                <div className="flex items-center justify-between mb-2.5 px-0.5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-cyan-500/10 text-cyan-600 flex items-center justify-center">
                      <Mic size={14} strokeWidth={2.5} />
                    </div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white">
                      The Audio Lounge & Wellbeing
                    </h3>
                  </div>
                  <Link
                    href="/platform/resources/podcasts-conversations"
                    className="text-xs font-bold text-[#5a32fa] dark:text-[#ff90e8] flex items-center gap-0.5"
                  >
                    <span>Listen</span>
                    <ChevronRight size={14} />
                  </Link>
                </div>

                <div className="-mx-3.5 px-3.5 overflow-x-auto no-scrollbar flex gap-3 snap-x snap-mandatory">
                  {[
                    { title: 'Interview with USPTO Director on AI Filings', category: 'Podcast Episode', time: '28m', color: '#00cec9', path: '/platform/resources/podcasts-conversations' },
                    { title: 'Stress Reduction & Mindfulness for Lawyers', category: 'Audio Guide', time: '14m', color: '#00d26a', path: '/platform/resources/wellness' },
                    { title: 'The IP Innovators Series: Silicon Valley Founders', category: 'Series', time: '42m', color: '#0984e3', path: '/platform/resources/podcasts-conversations' },
                    { title: 'Work-Life Balance on Partner Track', category: 'Meditation', time: '18m', color: '#ff7675', path: '/platform/resources/wellness' },
                  ].map((audio, aIdx) => (
                    <Link
                      key={aIdx}
                      href={audio.path}
                      className="w-[210px] shrink-0 snap-start p-3.5 rounded-2xl bg-white dark:bg-[#101626] border border-slate-200/80 dark:border-white/10 shadow-2xs active:scale-95 transition-all flex flex-col justify-between min-h-[135px]"
                    >
                      <div className="flex items-start justify-between">
                        <div
                          className="w-8 h-8 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: `${audio.color}18`, color: audio.color }}
                        >
                          <Headphones size={16} strokeWidth={2.5} />
                        </div>
                        <span
                          className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: `${audio.color}15`, color: audio.color }}
                        >
                          {audio.category}
                        </span>
                      </div>
                      <div className="mt-2">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug">
                          {audio.title}
                        </h4>
                      </div>
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 mt-2.5 pt-2 border-t border-slate-100 dark:border-white/5">
                        <span>{audio.time} listen</span>
                        <span style={{ color: audio.color }}>Tune in 🎙️</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* 4. REEL: 📖 Publications & Editorial Wire */}
              <div>
                <div className="flex items-center justify-between mb-2.5 px-0.5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-pink-500/10 text-pink-600 flex items-center justify-center">
                      <Globe size={14} strokeWidth={2.5} />
                    </div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white">
                      Publications & Legal Wire
                    </h3>
                  </div>
                  <Link
                    href="/platform/publications"
                    className="text-xs font-bold text-[#5a32fa] dark:text-[#ff90e8] flex items-center gap-0.5"
                  >
                    <span>Explore</span>
                    <ChevronRight size={14} />
                  </Link>
                </div>

                <div className="-mx-3.5 px-3.5 overflow-x-auto no-scrollbar flex gap-3 snap-x snap-mandatory">
                  {[
                    { title: "Women's IP World Annual Hardcover", badge: 'Annual Issue', subtitle: 'Global editorial release & leadership roster', path: '/platform/publications', image: '/images/publications-card-banner.png' },
                    { title: 'Supreme Court IP Ruling: Fair Use Analysis', badge: 'Breaking News', subtitle: '30 mins ago · Landmark decision for trademark holders', path: '/platform/resources/ip-news' },
                    { title: 'The Future of Copyright in Generative Models', badge: 'Analysis', subtitle: '1 hour ago · Deep dive on IP attribution frameworks', path: '/platform/resources/articles-insights' },
                  ].map((pub, pIdx) => (
                    <Link
                      key={pIdx}
                      href={pub.path}
                      className="w-[230px] shrink-0 snap-start p-3.5 rounded-2xl bg-white dark:bg-[#101626] border border-slate-200/80 dark:border-white/10 shadow-2xs active:scale-95 transition-all flex flex-col justify-between min-h-[145px]"
                    >
                      <div>
                        <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-600 dark:text-pink-400 border border-pink-500/20">
                          {pub.badge}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug mt-2">
                          {pub.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                          {pub.subtitle}
                        </p>
                      </div>
                      <div className="flex items-center justify-between text-xs font-bold text-[#5a32fa] dark:text-[#ff90e8] mt-2 pt-2 border-t border-slate-100 dark:border-white/5">
                        <span>Read Issue</span>
                        <span>↗</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* 5. REEL: 🏢 Verified IP Firms & Tech Solutions */}
              <div>
                <div className="flex items-center justify-between mb-2.5 px-0.5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                      <Building2 size={14} strokeWidth={2.5} />
                    </div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white">
                      Firms & Tech Network
                    </h3>
                  </div>
                  <Link
                    href="/platform/resources/ip-firms"
                    className="text-xs font-bold text-[#5a32fa] dark:text-[#ff90e8] flex items-center gap-0.5"
                  >
                    <span>Directory</span>
                    <ChevronRight size={14} />
                  </Link>
                </div>

                <div className="-mx-3.5 px-3.5 overflow-x-auto no-scrollbar flex gap-3 snap-x snap-mandatory">
                  <div className="w-[230px] shrink-0 snap-start p-3.5 rounded-2xl bg-white dark:bg-[#101626] border border-slate-200/80 dark:border-white/10 shadow-2xs flex flex-col justify-between min-h-[145px]">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600">
                          GLOBAL ROSTER
                        </span>
                        <Link
                          href="/platform/resources/ip-firms/claim"
                          className="text-[10px] font-bold text-[#5a32fa] underline"
                        >
                          +List Firm
                        </Link>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-2">
                        IP Law Firms Directory
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                        Search top patent prosecution and IP litigation firms across 45+ jurisdictions.
                      </p>
                    </div>
                    <Link
                      href="/platform/resources/ip-firms"
                      className="text-xs font-bold text-amber-600 dark:text-amber-400 pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between"
                    >
                      <span>Browse Firms</span>
                      <span>→</span>
                    </Link>
                  </div>

                  <div className="w-[230px] shrink-0 snap-start p-3.5 rounded-2xl bg-white dark:bg-[#101626] border border-slate-200/80 dark:border-white/10 shadow-2xs flex flex-col justify-between min-h-[145px]">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-600">
                          SOLUTIONS
                        </span>
                        <Link
                          href="/platform/resources/ip-services/list"
                          className="text-[10px] font-bold text-[#5a32fa] underline"
                        >
                          +List Service
                        </Link>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-2">
                        IP Services & AI Tech
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                        Portfolio docketing, Genie AI legal intelligence and technical consulting.
                      </p>
                    </div>
                    <Link
                      href="/platform/resources/ip-services"
                      className="text-xs font-bold text-teal-600 dark:text-teal-400 pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between"
                    >
                      <span>Explore Services</span>
                      <span>→</span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* 6. REEL: 🛠️ Toolkits, Academy & Career */}
              <div>
                <div className="flex items-center justify-between mb-2.5 px-0.5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
                      <Download size={14} strokeWidth={2.5} />
                    </div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white">
                      Toolkits, Academy & Career
                    </h3>
                  </div>
                  <Link
                    href="/platform/resources/guides-toolkits"
                    className="text-xs font-bold text-[#5a32fa] dark:text-[#ff90e8] flex items-center gap-0.5"
                  >
                    <span>All Guides</span>
                    <ChevronRight size={14} />
                  </Link>
                </div>

                <div className="-mx-3.5 px-3.5 overflow-x-auto no-scrollbar flex gap-3 snap-x snap-mandatory">
                  {[
                    { title: 'IP Due Diligence Audit Checklist', type: 'PDF Toolkit', time: '5 days ago', path: '/platform/resources/guides-toolkits' },
                    { title: 'Patent Law Fundamentals Course', type: 'Academy CLE', time: '1 day ago', path: '/platform/resources/education' },
                    { title: 'Negotiating Partner Track in IP', type: 'Career Guide', time: '3 days ago', path: '/platform/resources/career-leadership' },
                    { title: 'In-House Counsel Management Suite', type: 'Corporate Suite', time: 'Available', path: '/platform/resources/in-house-counsel' },
                  ].map((guide, gIdx) => (
                    <Link
                      key={gIdx}
                      href={guide.path}
                      className="w-[200px] shrink-0 snap-start p-3.5 rounded-2xl bg-white dark:bg-[#101626] border border-slate-200/80 dark:border-white/10 shadow-2xs active:scale-95 transition-all flex flex-col justify-between min-h-[135px]"
                    >
                      <div>
                        <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600">
                          {guide.type}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug mt-2">
                          {guide.title}
                        </h4>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 pt-2 border-t border-slate-100 dark:border-white/5">
                        <span>{guide.time}</span>
                        <span className="text-indigo-600 font-bold">Download 📥</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* 7. Featured Global IP Partner Banner */}
              <div
                onClick={() => router.push('/platform/resources/ip-firms')}
                className="p-4 rounded-3xl bg-gradient-to-r from-[#5a32fa] via-purple-600 to-[#ff2a5f] text-white shadow-md cursor-pointer active:scale-[0.99] transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-white/20 text-white">
                    ⭐ Featured Global Partner
                  </span>
                  <span className="text-xs font-bold bg-white/20 px-2.5 py-0.5 rounded-full">
                    Explore Firm ↗
                  </span>
                </div>
                <h3 className="text-base font-black mt-2.5">
                  Ennoble IP · Global Patent Prosecution
                </h3>
                <p className="text-xs text-white/80 line-clamp-2 mt-0.5 leading-relaxed">
                  Accelerate cross-border patent applications with 24/7 AI-assisted analytics and expert drafting.
                </p>
              </div>

            </div>
          )}

        </div>

        {/* 2. DESKTOP / TABLET GRID (Preserved 3-column layout) */}
        <div className="hidden sm:block">
          {/* Desktop Splash Sponsored Banner */}
          <div className="mb-8 p-6 rounded-3xl bg-gradient-to-r from-[#5a32fa] via-purple-600 to-[#ff2a5f] text-white shadow-lg relative overflow-hidden flex flex-row items-center justify-between gap-4">
            <div className="relative z-10">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-white/20 text-white mb-2 inline-block border border-white/20">
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
                  className="relative bg-white dark:bg-[#111827] rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-700 flex flex-col hover:-translate-y-1.5 active:scale-[0.99] transition-all duration-300 group overflow-hidden z-10 cursor-pointer"
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
    </>
  );
}
