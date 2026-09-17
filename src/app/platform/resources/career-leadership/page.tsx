'use client';
import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Search, TrendingUp, ChevronDown, Activity, Users, Video, Mic, 
  FileText, Briefcase, PlayCircle, Sparkles, Award, Star, Compass, Target, 
  Download, CheckCircle2, ChevronRight, X, Clock, Calendar, ShieldCheck, 
  Send, ExternalLink, BookOpen, Layers, MessageSquare, ArrowUpRight
} from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { 
  CAREER_STATS, 
  CAREER_SUBCATEGORIES, 
  CAREER_CONTENT_TYPES, 
  MOCK_CAREER_MENTORS, 
  MOCK_CAREER_ROADMAPS, 
  MOCK_EXECUTIVE_TOOLKITS, 
  MOCK_FULL_CAREER_RESOURCES,
  CareerMentor,
  CareerRoadmap,
  ExecutiveToolkit,
  CareerResource
} from '@/lib/career-leadership-data';

export default function CareerLeadershipHubPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [dbResources, setDbResources] = useState<CareerResource[]>([]);
  const [loading, setLoading] = useState(true);

  // Interactive Modals State
  const [selectedMentor, setSelectedMentor] = useState<CareerMentor | null>(null);
  const [selectedRoadmap, setSelectedRoadmap] = useState<CareerRoadmap | null>(null);
  const [selectedToolkit, setSelectedToolkit] = useState<ExecutiveToolkit | null>(null);
  const [isCohortModalOpen, setIsCohortModalOpen] = useState(false);
  const [cohortRole, setCohortRole] = useState<'mentee' | 'mentor'>('mentee');

  // Mentorship Form State
  const [mentorFormData, setMentorFormData] = useState({
    name: '',
    role: '',
    organization: '',
    topic: 'Partner Track Guidance',
    message: '',
    preferredFormat: 'Virtual Coffee Chat (30 min)'
  });
  const [mentorSubmitted, setMentorSubmitted] = useState(false);

  // Cohort Form State
  const [cohortFormData, setCohortFormData] = useState({
    name: '',
    email: '',
    title: '',
    company: '',
    yearsExp: '5-8 years',
    goal: ''
  });
  const [cohortSubmitted, setCohortSubmitted] = useState(false);

  // Download state feedback
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLiveCareer() {
      try {
        const { data, error } = await supabase
          .from('resources')
          .select('*')
          .eq('category', 'career-leadership')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          const mapped: CareerResource[] = data.map((d: any) => ({
            id: d.id,
            title: d.title,
            type: d.resource_type || d.type || "Leadership Guide",
            topic: d.tags?.[0] || "Career Growth",
            subcategory: d.subcategory || "leadership",
            expert: d.author_name ? `${d.author_name}${d.author_title ? ', ' + d.author_title : ''}` : "WIPA Leadership Council",
            expertRole: d.author_title || d.organization || "Senior IP Leader",
            expertAvatar: d.author_avatar || d.cover_image_url || "/resourceimg2.jpg",
            time: d.read_time || "10 min read",
            featured: d.is_featured || false,
            image: d.cover_image_url || "/resourceimg2.jpg",
            summary: d.summary || d.description,
            level: "Executive",
            rating: "4.9",
            reviewsCount: 120,
            tags: d.tags || ["Leadership", "Career"],
            is_splash_sponsored: d.is_splash_sponsored,
            splash_tagline: d.splash_tagline,
            splash_cta_text: d.splash_cta_text,
            splash_cta_url: d.splash_cta_url,
          }));

          // Merge with our rich mock resources without duplicating IDs
          const existingIds = new Set(mapped.map(m => m.id));
          const complementary = MOCK_FULL_CAREER_RESOURCES.filter(r => !existingIds.has(r.id));
          setDbResources([...mapped, ...complementary]);
        } else {
          setDbResources(MOCK_FULL_CAREER_RESOURCES);
        }
      } catch (err) {
        setDbResources(MOCK_FULL_CAREER_RESOURCES);
      } finally {
        setLoading(false);
      }
    }
    fetchLiveCareer();
  }, []);

  const resourcesList = dbResources.length > 0 ? dbResources : MOCK_FULL_CAREER_RESOURCES;

  // Filter logic
  const filteredResources = resourcesList.filter(r => {
    const matchesSearch = 
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.expert.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.summary && r.summary.toLowerCase().includes(searchQuery.toLowerCase()));
    
    let matchesTab = true;
    if (activeTab === 'masterclasses') {
      matchesTab = r.type.toLowerCase().includes('masterclass') || r.type.toLowerCase().includes('webinar');
    }

    const matchesType = typeFilter === 'All Types' || r.type === typeFilter;
    return matchesSearch && matchesTab && matchesType;
  });

  const featuredResource = filteredResources.find(r => r.featured) || filteredResources[0];
  const regularResources = filteredResources.filter(r => r.id !== featuredResource?.id);

  // Mentorship request handler
  const handleMentorshipSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMentorSubmitted(true);
    setTimeout(() => {
      setMentorSubmitted(false);
      setSelectedMentor(null);
      setMentorFormData({
        name: '',
        role: '',
        organization: '',
        topic: 'Partner Track Guidance',
        message: '',
        preferredFormat: 'Virtual Coffee Chat (30 min)'
      });
    }, 2400);
  };

  // Cohort application handler
  const handleCohortSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCohortSubmitted(true);
    setTimeout(() => {
      setCohortSubmitted(false);
      setIsCohortModalOpen(false);
      setCohortFormData({
        name: '',
        email: '',
        title: '',
        company: '',
        yearsExp: '5-8 years',
        goal: ''
      });
    }, 2400);
  };

  // Toolkit download handler
  const handleDownloadToolkit = (toolkit: ExecutiveToolkit) => {
    setDownloadingId(toolkit.id);
    setTimeout(() => {
      setDownloadingId(null);
      setDownloadSuccess(`Downloaded: ${toolkit.title} (${toolkit.format})`);
      setTimeout(() => setDownloadSuccess(null), 3500);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#fafafc] dark:bg-[#070913] text-gray-900 dark:text-white font-sans selection:bg-purple-500/30 overflow-x-hidden transition-colors duration-300">
      
      {/* Toast Notification */}
      {downloadSuccess && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-gray-900 dark:bg-purple-950 text-white border border-purple-500/40 shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom-5 duration-300">
          <CheckCircle2 size={18} className="text-purple-400 shrink-0" />
          <span className="text-xs sm:text-sm font-bold">{downloadSuccess}</span>
        </div>
      )}

      {/* Sleek, Modern Hero Header */}
      <div className="relative w-full border-b border-gray-200/80 dark:border-white/10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 via-purple-500/5 to-transparent dark:from-[#1b0d38]/50 dark:via-[#090514] dark:to-[#070913] z-0"></div>
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[650px] h-[320px] bg-purple-500/15 dark:bg-purple-600/20 rounded-full blur-[110px] pointer-events-none z-0"></div>
        
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-12 relative z-10 flex flex-col items-center text-center">
          
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-700 dark:text-purple-400 text-[11px] font-black uppercase tracking-wider mb-3 shadow-2xs">
            <Sparkles size={13} /> Executive Legal Advancement
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-2.5 text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-purple-700 to-[#5a32fa] dark:from-white dark:via-purple-100 dark:to-purple-400">
            Career & Leadership
          </h1>
          
          <p className="text-xs sm:text-sm md:text-base font-medium text-gray-600 dark:text-white/60 max-w-2xl leading-relaxed mx-auto">
            Masterclasses, executive coaching, and in-depth playbooks to accelerate your trajectory in the global IP ecosystem.
          </p>

          {/* Key Executive Impact Statistics Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 w-full max-w-4xl mt-7">
            {CAREER_STATS.map((stat, idx) => (
              <div 
                key={idx} 
                className="flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-2xl bg-white/70 dark:bg-white/5 border border-purple-100 dark:border-white/10 backdrop-blur-md shadow-2xs hover:border-purple-300 dark:hover:border-purple-500/40 transition-all"
              >
                <div className="text-xl sm:text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#5a32fa] to-purple-600 dark:from-purple-300 dark:to-purple-400 mb-0.5">
                  {stat.value}
                </div>
                <div className="text-[10px] sm:text-xs font-bold text-gray-600 dark:text-white/65 text-center line-clamp-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Integrated Search & Filter Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 w-full max-w-xl mt-6">
            <div className="relative w-full flex items-center bg-white dark:bg-slate-900/90 border border-gray-200 dark:border-white/15 rounded-xl px-3.5 py-2 shadow-2xs transition-all focus-within:ring-2 focus-within:ring-purple-500/20 focus-within:border-purple-500">
              <Search size={15} className="text-gray-400 dark:text-white/40 mr-2.5 shrink-0" />
              <input 
                type="text" 
                placeholder="Search masterclasses, roadmaps, mentors, playbooks..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm font-semibold text-gray-900 dark:text-white focus:outline-none placeholder-gray-400 dark:placeholder-white/40"
              />
            </div>
            
            <div className="relative w-full sm:w-48 shrink-0">
              <select 
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="appearance-none w-full bg-white dark:bg-slate-900/90 border border-gray-200 dark:border-white/15 rounded-xl px-3.5 py-2 pr-9 text-xs sm:text-sm font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 cursor-pointer shadow-2xs transition-all"
              >
                {CAREER_CONTENT_TYPES.map(type => (
                  <option key={type} value={type} className="dark:bg-gray-900">{type}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/40 pointer-events-none" />
            </div>
          </div>

          {/* High-Value Navigation Category Tabs */}
          <div className="mt-5 flex items-center justify-center max-w-full overflow-x-auto no-scrollbar">
            <div className="inline-flex items-center gap-1.5 p-1 rounded-2xl bg-white/80 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 shadow-2xs backdrop-blur-md">
              {CAREER_SUBCATEGORIES.map(sub => {
                const isActive = activeTab === sub.id;
                return (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => setActiveTab(sub.id)}
                    className={`px-3.5 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-bold tracking-tight transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 ${
                      isActive 
                        ? 'bg-gradient-to-r from-[#5a32fa] to-purple-600 text-white shadow-xs font-black' 
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/80 dark:hover:bg-white/5'
                    }`}
                  >
                    {sub.name}
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-12 sm:space-y-16">
        
        {/* SECTION 1: Flagship Masterclass (Visible on All & Masterclasses) */}
        {(activeTab === 'all' || activeTab === 'masterclasses') && featuredResource && (
          <div className="w-full">
            <div className="relative min-h-[300px] sm:min-h-[360px] md:h-[400px] w-full rounded-3xl overflow-hidden group border border-purple-200/70 dark:border-white/10 shadow-xl shadow-purple-900/10 dark:shadow-purple-900/25 flex flex-col justify-end">
              <img 
                src={featuredResource.image} 
                alt={featuredResource.title} 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-purple-950/20"></div>
              
              <div className="relative z-10 p-6 sm:p-8 md:p-10 text-white flex flex-col justify-end max-w-4xl">
                <div className="flex flex-wrap items-center gap-2.5 mb-3">
                  <span className="bg-gradient-to-r from-[#5a32fa] to-purple-600 text-white text-[10px] sm:text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md shadow-purple-500/25">
                    {featuredResource.type}
                  </span>
                  <span className="bg-black/40 backdrop-blur-md border border-white/15 text-white/90 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5">
                    <Activity size={12} className="text-purple-400" /> {featuredResource.time}
                  </span>
                  <span className="bg-purple-500/20 border border-purple-400/30 text-purple-200 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Star size={12} className="text-amber-400 fill-amber-400" /> 4.9 (184 reviews)
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-snug mb-3 drop-shadow-md">
                  {featuredResource.title}
                </h2>

                {featuredResource.summary && (
                  <p className="text-xs sm:text-sm text-white/80 line-clamp-2 max-w-2xl mb-4 font-medium leading-relaxed">
                    {featuredResource.summary}
                  </p>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-white/15">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/15 backdrop-blur-md border border-white/25 overflow-hidden flex items-center justify-center shrink-0">
                      {featuredResource.expertAvatar ? (
                        <img src={featuredResource.expertAvatar} alt={featuredResource.expert} className="w-full h-full object-cover" />
                      ) : (
                        <Briefcase size={18} className="text-purple-200" />
                      )}
                    </div>
                    <div>
                      <div className="text-white/60 text-[10px] font-black uppercase tracking-wider">Instructor / Expert</div>
                      <div className="text-xs sm:text-sm font-bold text-white">{featuredResource.expert}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Link
                      href={`/platform/resources/career-leadership/${featuredResource.id}`}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#5a32fa] to-purple-600 hover:from-purple-600 hover:to-[#5a32fa] text-white text-xs sm:text-sm font-black tracking-tight flex items-center gap-2 shadow-lg shadow-purple-600/30 transition-all hover:scale-[1.02] cursor-pointer"
                    >
                      <PlayCircle size={16} /> Start Masterclass
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 2: Strategic Career Progression Roadmaps (Interactive) */}
        {(activeTab === 'all' || activeTab === 'roadmaps') && (
          <div className="w-full space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-gray-200/80 dark:border-white/10 pb-4">
              <div>
                <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 text-xs font-black uppercase tracking-wider mb-1">
                  <Compass size={16} /> Milestones & Progression
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                  Strategic Career Progression Roadmaps
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-white/60 font-medium">
                  Proven step-by-step pathways curated for women navigating IP partnerships, corporate GC seats, and trial chairs.
                </p>
              </div>

              {activeTab === 'all' && (
                <button
                  type="button"
                  onClick={() => setActiveTab('roadmaps')}
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-purple-600 dark:text-purple-400 hover:text-[#5a32fa] transition-colors self-start sm:self-auto cursor-pointer"
                >
                  View all roadmaps <ChevronRight size={15} />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {MOCK_CAREER_ROADMAPS.map((roadmap) => (
                <div 
                  key={roadmap.id}
                  className="rounded-3xl p-6 bg-white dark:bg-[#0c1120] border border-gray-200/90 dark:border-white/10 hover:border-purple-400 dark:hover:border-purple-500/50 shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-700 dark:text-purple-300">
                        {roadmap.track}
                      </span>
                      <span className="text-xs font-bold text-gray-500 dark:text-white/50 flex items-center gap-1">
                        <Clock size={12} className="text-purple-500" /> {roadmap.timeline}
                      </span>
                    </div>

                    <h3 className="text-lg font-black tracking-tight text-gray-900 dark:text-white group-hover:text-[#5a32fa] dark:group-hover:text-purple-400 transition-colors mb-2 line-clamp-2">
                      {roadmap.title}
                    </h3>

                    <p className="text-xs text-gray-600 dark:text-white/65 font-medium line-clamp-3 mb-4 leading-relaxed">
                      {roadmap.description}
                    </p>

                    {/* Key Milestone Tag */}
                    <div className="p-3 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/30 mb-4">
                      <div className="text-[10px] font-black uppercase tracking-wider text-purple-700 dark:text-purple-300 mb-1">
                        Anchor Milestone
                      </div>
                      <div className="text-xs font-bold text-gray-800 dark:text-gray-200 leading-snug">
                        {roadmap.keyMilestone}
                      </div>
                    </div>

                    {/* Phase Snapshot */}
                    <div className="space-y-2 mb-5">
                      {roadmap.phases.map((ph, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-gray-600 dark:text-white/70">
                          <div className="w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-900/40 text-[#5a32fa] dark:text-purple-300 flex items-center justify-center text-[10px] font-black shrink-0">
                            {idx + 1}
                          </div>
                          <span className="truncate">{ph.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
                    <div className="text-[11px] font-bold text-gray-500 dark:text-white/50">
                      {roadmap.salaryBenchmark.split(' ')[0]} Benchmark
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedRoadmap(roadmap)}
                      className="px-3.5 py-1.5 rounded-xl bg-purple-500/10 hover:bg-[#5a32fa] text-purple-700 dark:text-purple-300 hover:text-white text-xs font-bold tracking-tight transition-all duration-200 flex items-center gap-1 cursor-pointer"
                    >
                      Explore Milestones <ChevronRight size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 3: Verified Executive Mentors & 1:1 Coaching Faculty */}
        {(activeTab === 'all' || activeTab === 'mentors') && (
          <div className="w-full space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-gray-200/80 dark:border-white/10 pb-4">
              <div>
                <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 text-xs font-black uppercase tracking-wider mb-1">
                  <Users size={16} /> 1-on-1 Executive Guidance
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                  Verified Executive Mentors & Coaching Faculty
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-white/60 font-medium">
                  Connect 1-on-1 with Global Managing Partners, Trial Chairs, and General Counsels dedicated to advancing women in IP.
                </p>
              </div>

              {activeTab === 'all' && (
                <button
                  type="button"
                  onClick={() => setActiveTab('mentors')}
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-purple-600 dark:text-purple-400 hover:text-[#5a32fa] transition-colors self-start sm:self-auto cursor-pointer"
                >
                  View all faculty <ChevronRight size={15} />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {MOCK_CAREER_MENTORS.map((mentor) => (
                <div 
                  key={mentor.id}
                  className="rounded-3xl p-6 bg-white dark:bg-[#0c1120] border border-gray-200/90 dark:border-white/10 hover:border-purple-400 dark:hover:border-purple-500/50 shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Header: Photo & Verified Check */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-slate-800 border-2 border-purple-500/20 shrink-0">
                        <img src={mentor.avatar} alt={mentor.name} className="w-full h-full object-cover" />
                        <div className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-purple-600 border border-white flex items-center justify-center text-white">
                          <CheckCircle2 size={10} />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-base font-black text-gray-900 dark:text-white truncate">
                            {mentor.name}
                          </h3>
                        </div>
                        <p className="text-xs font-bold text-purple-600 dark:text-purple-400 truncate">
                          {mentor.role}
                        </p>
                        <p className="text-[11px] font-medium text-gray-500 dark:text-white/50 truncate">
                          {mentor.firm}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-gray-600 dark:text-white/70 line-clamp-3 mb-4 leading-relaxed font-medium">
                      {mentor.bio}
                    </p>

                    {/* Mentoring Focus Chips */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {mentor.focusAreas.map((f, i) => (
                        <span key={i} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-white/70 border border-gray-200/60 dark:border-white/5">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                        {mentor.availability}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedMentor(mentor);
                        setMentorFormData(prev => ({
                          ...prev,
                          topic: `1:1 Advisory with ${mentor.name}`
                        }));
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#5a32fa] to-purple-600 hover:from-purple-600 hover:to-[#5a32fa] text-white text-xs font-black tracking-tight shadow-md shadow-purple-600/20 transition-all hover:scale-[1.02] cursor-pointer"
                    >
                      Request 1:1 Advisory
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 4: Executive Masterclasses & Guides Grid */}
        {(activeTab === 'all' || activeTab === 'masterclasses') && (
          <div className="w-full space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-gray-200/80 dark:border-white/10 pb-4">
              <div>
                <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 text-xs font-black uppercase tracking-wider mb-1">
                  <BookOpen size={16} /> Deep-Dive Curriculum
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                  Executive Masterclasses & Leadership Guides
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-white/60 font-medium">
                  Video masterclasses, strategic frameworks, and tactical coaching for every career milestone.
                </p>
              </div>

              <div className="text-xs font-bold text-gray-500 dark:text-white/50">
                Showing {regularResources.length} masterclasses & guides
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {regularResources.map((resource, i) => (
                <Link 
                  key={resource.id} 
                  href={`/platform/resources/career-leadership/${resource.id}`} 
                  className="group relative rounded-2xl overflow-hidden bg-white dark:bg-[#0c1120] border border-gray-200/90 dark:border-white/10 hover:border-purple-400 dark:hover:border-purple-500/50 shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col hover:-translate-y-1"
                >
                  {resource.image && (
                    <div className="relative overflow-hidden bg-slate-900 w-full h-44">
                      <img 
                        src={resource.image} 
                        alt={resource.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-gray-900/20 to-transparent"></div>
                      
                      <div className="absolute top-3 left-3">
                        <span className="text-[10px] font-black uppercase tracking-wider text-white bg-black/60 backdrop-blur-md border border-white/20 px-2.5 py-0.5 rounded-full">
                          {resource.type}
                        </span>
                      </div>

                      {resource.level && (
                        <div className="absolute bottom-3 left-3">
                          <span className="text-[10px] font-bold text-purple-200 bg-purple-900/80 backdrop-blur-md px-2 py-0.5 rounded-md border border-purple-500/30">
                            {resource.level}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="p-5 flex flex-col flex-1 justify-between">
                    <div>
                      <h3 className="text-base font-black tracking-tight leading-snug mb-2 text-gray-900 dark:text-white group-hover:text-[#5a32fa] dark:group-hover:text-purple-400 transition-colors line-clamp-2">
                        {resource.title}
                      </h3>

                      {resource.summary && (
                        <p className="text-xs text-gray-600 dark:text-white/65 font-medium line-clamp-2 mb-4 leading-relaxed">
                          {resource.summary}
                        </p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-xs font-semibold text-gray-500 dark:text-white/50">
                      <span className="flex items-center gap-1.5 truncate max-w-[170px]">
                        {resource.type === 'Webinar' || resource.type === 'Video' || resource.type.includes('Masterclass') ? (
                          <Video size={13} className="text-purple-500 shrink-0"/>
                        ) : resource.type === 'Podcast' ? (
                          <Mic size={13} className="text-purple-500 shrink-0"/>
                        ) : (
                          <FileText size={13} className="text-purple-500 shrink-0"/>
                        )} 
                        <span className="truncate">{resource.expert}</span>
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded-md text-gray-600 dark:text-white/60 shrink-0">
                        {resource.time}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}

              {regularResources.length === 0 && (
                <div className="col-span-full py-16 text-center border border-dashed border-gray-300 dark:border-white/10 rounded-3xl bg-white/50 dark:bg-white/5">
                  <Briefcase size={36} className="mx-auto text-gray-400 dark:text-white/20 mb-3" />
                  <h3 className="text-base font-bold mb-1 text-gray-900 dark:text-white">No matching resources found</h3>
                  <p className="text-xs text-gray-500 dark:text-white/40">Try adjusting your search terms or selecting All Types.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SECTION 5: Actionable Toolkits & Strategic Playbooks */}
        {(activeTab === 'all' || activeTab === 'playbooks') && (
          <div className="w-full space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-gray-200/80 dark:border-white/10 pb-4">
              <div>
                <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 text-xs font-black uppercase tracking-wider mb-1">
                  <Layers size={16} /> Executive Downloads & Templates
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                  Actionable Toolkits & Strategic Playbooks
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-white/60 font-medium">
                  Battle-tested financial models, presentation templates, and compensation data built for real executive practice.
                </p>
              </div>

              {activeTab === 'all' && (
                <button
                  type="button"
                  onClick={() => setActiveTab('playbooks')}
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-purple-600 dark:text-purple-400 hover:text-[#5a32fa] transition-colors self-start sm:self-auto cursor-pointer"
                >
                  View all toolkits <ChevronRight size={15} />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {MOCK_EXECUTIVE_TOOLKITS.map((toolkit) => (
                <div 
                  key={toolkit.id}
                  className="rounded-3xl p-6 sm:p-7 bg-white dark:bg-[#0c1120] border border-gray-200/90 dark:border-white/10 hover:border-purple-400 dark:hover:border-purple-500/50 shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20">
                        {toolkit.type}
                      </span>
                      <span className="text-xs font-bold text-gray-500 dark:text-white/50">
                        {toolkit.format} • {toolkit.size}
                      </span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-black tracking-tight text-gray-900 dark:text-white mb-2">
                      {toolkit.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-gray-600 dark:text-white/70 font-medium mb-4 leading-relaxed">
                      {toolkit.description}
                    </p>

                    {/* Features checklist */}
                    <div className="space-y-2 mb-6">
                      {toolkit.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-xs font-medium text-gray-700 dark:text-white/80">
                          <CheckCircle2 size={14} className="text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
                    <div className="text-xs font-bold text-gray-500 dark:text-white/50">
                      {toolkit.downloads.toLocaleString()} verified downloads
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedToolkit(toolkit)}
                        className="px-3.5 py-2 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-gray-200 text-xs font-bold tracking-tight transition-all cursor-pointer"
                      >
                        Preview
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDownloadToolkit(toolkit)}
                        disabled={downloadingId === toolkit.id}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#5a32fa] to-purple-600 hover:from-purple-600 hover:to-[#5a32fa] text-white text-xs font-black tracking-tight flex items-center gap-2 shadow-md shadow-purple-600/25 transition-all hover:scale-[1.02] cursor-pointer disabled:opacity-70"
                      >
                        <Download size={14} className={downloadingId === toolkit.id ? 'animate-bounce' : ''} />
                        {downloadingId === toolkit.id ? 'Downloading...' : 'Download'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 6: Annual WIPA Executive Mentorship Cohort 2026 Callout Banner */}
        <div className="relative rounded-3xl overflow-hidden p-8 sm:p-10 md:p-12 border border-purple-400/30 dark:border-purple-500/30 shadow-2xl bg-gradient-to-r from-[#1b0d38] via-[#2a1352] to-[#140b2b] text-white">
          <div className="absolute -right-16 -top-16 w-80 h-80 bg-purple-500/20 rounded-full blur-[90px] pointer-events-none"></div>
          
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-purple-200 text-[11px] font-black uppercase tracking-wider mb-3">
              <Sparkles size={12} className="text-amber-400" /> Applications Now Open • Fall 2026 Cohort
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight mb-3">
              WIPA Executive Mentorship Cohort 2026
            </h2>

            <p className="text-xs sm:text-sm md:text-base text-white/80 font-medium leading-relaxed mb-6">
              A bespoke 6-month paired mentorship program connecting emerging women IP partners, trial attorneys, and in-house counsel with global Managing Partners and General Counsels. Complete with 1:1 advisory, partner pitch coaching, and boardroom simulations.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setCohortRole('mentee');
                  setIsCohortModalOpen(true);
                }}
                className="px-5 py-2.5 rounded-xl bg-white text-purple-950 hover:bg-purple-50 font-black text-xs sm:text-sm tracking-tight shadow-lg transition-all hover:scale-[1.02] cursor-pointer"
              >
                Apply as Mentee
              </button>

              <button
                type="button"
                onClick={() => {
                  setCohortRole('mentor');
                  setIsCohortModalOpen(true);
                }}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 text-white font-black text-xs sm:text-sm tracking-tight transition-all cursor-pointer"
              >
                Become a Faculty Mentor
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* ================= MODAL: 1:1 Mentorship Request ================= */}
      {selectedMentor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-[#0f1424] border border-gray-200 dark:border-white/15 p-6 sm:p-8 shadow-2xl overflow-hidden">
            <button 
              onClick={() => setSelectedMentor(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-500 dark:text-white/70 hover:text-gray-900 dark:hover:text-white cursor-pointer"
            >
              <X size={16} />
            </button>

            {mentorSubmitted ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 flex items-center justify-center mx-auto">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white">Advisory Request Sent!</h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-white/70 max-w-sm mx-auto">
                  {selectedMentor.name} has been notified. You will receive an email confirmation and calendar invitation within 48 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleMentorshipSubmit} className="space-y-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <img src={selectedMentor.avatar} alt={selectedMentor.name} className="w-12 h-12 rounded-xl object-cover border border-purple-500/20" />
                    <div>
                      <h3 className="text-lg font-black text-gray-900 dark:text-white">
                        Book 1:1 with {selectedMentor.name}
                      </h3>
                      <p className="text-xs text-purple-600 dark:text-purple-400 font-bold">
                        {selectedMentor.role} • {selectedMentor.firm}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-white/50">
                    Request an executive advisory session, partner pitch review, or confidential career discussion.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                      Your Full Name
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Attorney Maya Lin"
                      value={mentorFormData.name}
                      onChange={e => setMentorFormData({ ...mentorFormData, name: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/15 text-xs sm:text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-black uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                        Current Title / Role
                      </label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. Senior IP Associate"
                        value={mentorFormData.role}
                        onChange={e => setMentorFormData({ ...mentorFormData, role: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/15 text-xs sm:text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-black uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                        Firm / Organization
                      </label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. Baker & Hostetler LLP"
                        value={mentorFormData.organization}
                        onChange={e => setMentorFormData({ ...mentorFormData, organization: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/15 text-xs sm:text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                      Preferred Advisory Format
                    </label>
                    <select
                      value={mentorFormData.preferredFormat}
                      onChange={e => setMentorFormData({ ...mentorFormData, preferredFormat: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/15 text-xs sm:text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="Virtual Coffee Chat (30 min)">Virtual Coffee Chat (30 min)</option>
                      <option value="Executive 1:1 Strategy Session (45 min)">Executive 1:1 Strategy Session (45 min)</option>
                      <option value="Partnership Business Plan Critique (60 min)">Partnership Business Plan Critique (60 min)</option>
                      <option value="Compensation & Equity Review (45 min)">Compensation & Equity Review (45 min)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                      Primary Question or Career Challenge
                    </label>
                    <textarea 
                      rows={3}
                      required
                      placeholder="Briefly describe what you would like advice on (e.g., building origination credit, transitioning to in-house, negotiating equity points)..."
                      value={mentorFormData.message}
                      onChange={e => setMentorFormData({ ...mentorFormData, message: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/15 text-xs sm:text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#5a32fa] to-purple-600 hover:from-purple-600 hover:to-[#5a32fa] text-white text-xs sm:text-sm font-black tracking-tight shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <Send size={15} /> Send Advisory Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ================= MODAL: Career Roadmap Explorer ================= */}
      {selectedRoadmap && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl bg-white dark:bg-[#0f1424] border border-gray-200 dark:border-white/15 p-6 sm:p-8 shadow-2xl">
            <button 
              onClick={() => setSelectedRoadmap(null)}
              className="sticky top-0 float-right w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-500 dark:text-white/70 hover:text-gray-900 dark:hover:text-white cursor-pointer z-20"
            >
              <X size={16} />
            </button>

            <div className="mb-6">
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20 mb-2 inline-block">
                {selectedRoadmap.track} • {selectedRoadmap.timeline}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white mb-2">
                {selectedRoadmap.title}
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-white/70 font-medium">
                {selectedRoadmap.description}
              </p>
            </div>

            {/* Benchmark Pill */}
            <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-800/40 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="text-[10px] font-black uppercase tracking-wider text-purple-700 dark:text-purple-300">
                  Target Compensation Benchmark
                </div>
                <div className="text-sm font-black text-gray-900 dark:text-white">
                  {selectedRoadmap.salaryBenchmark}
                </div>
              </div>
              <div className="text-right sm:text-left">
                <div className="text-[10px] font-black uppercase tracking-wider text-rose-600 dark:text-rose-400">
                  Primary Pitfall to Avoid
                </div>
                <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 max-w-xs">
                  {selectedRoadmap.keyPitfall}
                </div>
              </div>
            </div>

            {/* Phased Breakdown */}
            <div className="space-y-6">
              <h3 className="text-sm font-black uppercase tracking-wider text-gray-900 dark:text-white flex items-center gap-2">
                <Target size={16} className="text-purple-600" /> Phased Execution Plan
              </h3>

              {selectedRoadmap.phases.map((ph, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-purple-600 dark:text-purple-400">
                      {ph.phase}
                    </span>
                    <span className="text-[11px] font-bold text-gray-500 dark:text-white/50">
                      {ph.timeframe}
                    </span>
                  </div>

                  <h4 className="text-base font-black text-gray-900 dark:text-white">
                    {ph.title}
                  </h4>

                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-white/50 mb-1.5">
                      Required Milestones
                    </div>
                    <ul className="space-y-1.5">
                      {ph.milestones.map((m, mIdx) => (
                        <li key={mIdx} className="flex items-start gap-2 text-xs font-medium text-gray-700 dark:text-gray-300">
                          <CheckCircle2 size={13} className="text-purple-500 shrink-0 mt-0.5" />
                          <span>{m}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2 flex flex-wrap gap-1.5">
                    {ph.competencies.map((c, cIdx) => (
                      <span key={cIdx} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 text-gray-800 dark:text-white/80">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-white/10 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedRoadmap(null)}
                className="px-5 py-2 rounded-xl bg-gray-100 dark:bg-white/10 hover:bg-gray-200 text-gray-800 dark:text-white text-xs font-bold transition-all cursor-pointer"
              >
                Close Roadmap
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: Toolkit Preview ================= */}
      {selectedToolkit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-[#0f1424] border border-gray-200 dark:border-white/15 p-6 sm:p-8 shadow-2xl">
            <button 
              onClick={() => setSelectedToolkit(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-500 dark:text-white/70 hover:text-gray-900 dark:hover:text-white cursor-pointer"
            >
              <X size={16} />
            </button>

            <div className="mb-4">
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20 mb-2 inline-block">
                {selectedToolkit.type} • {selectedToolkit.format}
              </span>
              <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">
                {selectedToolkit.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-white/70 font-medium leading-relaxed">
                {selectedToolkit.description}
              </p>
            </div>

            <div className="space-y-3 mb-6 p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200/80 dark:border-white/10">
              <h4 className="text-xs font-black uppercase tracking-wider text-gray-900 dark:text-white">
                Included Deliverables & Files
              </h4>
              <div className="space-y-2">
                {selectedToolkit.features.map((f, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs font-medium text-gray-700 dark:text-gray-300">
                    <CheckCircle2 size={14} className="text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <span className="text-xs font-bold text-gray-500 dark:text-white/50">
                File Size: {selectedToolkit.size}
              </span>

              <button
                type="button"
                onClick={() => {
                  handleDownloadToolkit(selectedToolkit);
                  setSelectedToolkit(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#5a32fa] to-purple-600 hover:from-purple-600 hover:to-[#5a32fa] text-white text-xs font-black tracking-tight flex items-center gap-2 shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
              >
                <Download size={15} /> Download Package
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: Mentorship Cohort 2026 Application ================= */}
      {isCohortModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-[#0f1424] border border-gray-200 dark:border-white/15 p-6 sm:p-8 shadow-2xl">
            <button 
              onClick={() => setIsCohortModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-500 dark:text-white/70 hover:text-gray-900 dark:hover:text-white cursor-pointer"
            >
              <X size={16} />
            </button>

            {cohortSubmitted ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-500 flex items-center justify-center mx-auto">
                  <Sparkles size={32} />
                </div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white">Application Received!</h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-white/70 max-w-sm mx-auto">
                  Thank you for applying to the WIPA Executive Mentorship Cohort 2026. The admissions steering committee will review your credentials and contact you by email.
                </p>
              </div>
            ) : (
              <form onSubmit={handleCohortSubmit} className="space-y-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20 mb-2 inline-block">
                    Fall 2026 Admissions
                  </span>
                  <h3 className="text-xl font-black text-gray-900 dark:text-white">
                    {cohortRole === 'mentee' ? 'Apply as Mentee' : 'Register as Faculty Mentor'}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-white/50">
                    {cohortRole === 'mentee' 
                      ? 'Tailored for senior associates, special counsel, and in-house IP counsel within 1-3 years of partnership/director election.' 
                      : 'For experienced Managing Partners, General Counsels, and IP Practice Leaders.'}
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                      Full Legal Name
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Attorney Helena Vance"
                      value={cohortFormData.name}
                      onChange={e => setCohortFormData({ ...cohortFormData, name: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/15 text-xs sm:text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                      Corporate / Professional Email
                    </label>
                    <input 
                      type="email" 
                      required
                      placeholder="e.g. helena@lawfirm.com"
                      value={cohortFormData.email}
                      onChange={e => setCohortFormData({ ...cohortFormData, email: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/15 text-xs sm:text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-black uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                        Current Position
                      </label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. Counsel - IP Litigation"
                        value={cohortFormData.title}
                        onChange={e => setCohortFormData({ ...cohortFormData, title: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/15 text-xs sm:text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-black uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                        Years in IP Practice
                      </label>
                      <select
                        value={cohortFormData.yearsExp}
                        onChange={e => setCohortFormData({ ...cohortFormData, yearsExp: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/15 text-xs sm:text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="3-5 years">3 - 5 years</option>
                        <option value="6-9 years">6 - 9 years</option>
                        <option value="10-15 years">10 - 15 years</option>
                        <option value="15+ years">15+ years</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                      Primary Advancement Objective
                    </label>
                    <textarea 
                      rows={3}
                      required
                      placeholder="e.g. Transitioning from non-equity to equity partner in 2027; developing a $1M+ independent patent litigation client book..."
                      value={cohortFormData.goal}
                      onChange={e => setCohortFormData({ ...cohortFormData, goal: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/15 text-xs sm:text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#5a32fa] to-purple-600 hover:from-purple-600 hover:to-[#5a32fa] text-white text-xs sm:text-sm font-black tracking-tight shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    Submit Application
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
