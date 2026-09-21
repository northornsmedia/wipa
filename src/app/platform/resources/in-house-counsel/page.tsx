'use client';

import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Search, Building, ChevronRight, FileText, Download, Users, 
  Video, Book, Briefcase, ChevronDown, FolderOpen, Shield, 
  Sparkles, UsersRound, MapPin, CheckCircle2, Clock, Award, X, 
  ExternalLink, MessageSquare, ArrowUpRight, Send, Lock, Plus,
  ShieldCheck, HelpCircle, AlertCircle, Check, Info, Scale, Compass, Target, Layers, User, MessageCircle
} from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/store/useAppStore';
import { fetchInHouseCounsels, InHouseCounsel, MOCK_IN_HOUSE_COUNSELS, checkIsInHouseCounsel } from '@/lib/in-house-counsels';
import { 
  getInHouseQuestions, 
  askInHouseQuestion, 
  answerInHouseQuestion 
} from '@/app/actions/in-house-qa';

const MOCK_INHOUSE_SUBCATEGORIES = [
  { id: 'all', name: 'About In-House Counsel', icon: Info },
  { id: 'counsels', name: 'In-House Counsels', icon: UsersRound },
  { id: 'ask-counsel', name: 'Ask In-House Counsel', icon: MessageSquare }
];

const CONTENT_TYPES = [
  "All Types",
  "Corporate IP Playbook",
  "GC Roundtable",
  "Chief IP Counsel Interview",
  "Ask an In-House Counsel",
  "Guide",
  "Template",
  "Checklist",
  "Case Study",
  "Webinar",
  "Video"
];

const MOCK_INHOUSE_RESOURCES = [
  {
    id: 1,
    title: "The 2026 Corporate IP Strategy Playbook",
    type: "Corporate IP Playbook",
    topic: "IP Operations",
    subcategory: "operations",
    contributor: "Corporate Practice Team",
    organisation: "WIPA In-House Council",
    featured: true,
    date: "Oct 24, 2025",
    size: "2.4 MB"
  },
  {
    id: 2,
    title: "GC Roundtable: Managing IP Budgets in a Downturn",
    type: "GC Roundtable",
    topic: "Leadership & Strategy",
    subcategory: "leadership",
    contributor: "Panel of 4 General Counsels",
    organisation: "Tech Industry Forum",
    featured: true,
    date: "Sep 15, 2025",
    size: "45 Min Video"
  },
  {
    id: 3,
    title: "Chief IP Counsel Interview: Building a Culture of Innovation",
    type: "Chief IP Counsel Interview",
    topic: "Leadership",
    subcategory: "leadership",
    contributor: "Sarah Jenkins",
    organisation: "Global Motors Inc.",
    featured: false,
    date: "Aug 02, 2025",
    size: "Read"
  },
  {
    id: 4,
    title: "Outside Counsel Guidelines & Billing Compliance Template",
    type: "Template",
    topic: "IP Operations",
    subcategory: "operations",
    contributor: "Legal Ops Group",
    organisation: "WIPA Standards",
    featured: false,
    date: "Jul 18, 2025",
    size: "145 KB (Word)"
  },
  {
    id: 5,
    title: "In-House Patent Harvesting Pipeline Framework",
    type: "Corporate IP Playbook",
    topic: "Patent Strategy",
    subcategory: "operations",
    contributor: "Ennoble IP & WIPA",
    organisation: "Ennoble IP",
    featured: false,
    date: "Jun 30, 2025",
    size: "Read"
  },
  {
    id: 6,
    title: "Case Study: Streamlining Patent Harvesting Workflows",
    type: "Case Study",
    topic: "IP Operations",
    subcategory: "operations",
    contributor: "Innovation Team",
    organisation: "BioTech Global",
    featured: false,
    date: "Jun 12, 2025",
    size: "1.2 MB"
  }
];

export default function InHouseCounselHubPage() {
  const { user } = useAppStore();
  const [activeSub, setActiveSub] = useState<'all' | 'counsels' | 'ask-counsel'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [dbResources, setDbResources] = useState<any[]>([]);
  const [counsels, setCounsels] = useState<InHouseCounsel[]>(MOCK_IN_HOUSE_COUNSELS);
  const [selectedCounselModal, setSelectedCounselModal] = useState<InHouseCounsel | null>(null);

  // Q&A Discussion Forum State
  const [questions, setQuestions] = useState<any[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [currentUserProfile, setCurrentUserProfile] = useState<any>(null);
  const [isCounselUser, setIsCounselUser] = useState(false);
  
  // Ask Question Modal State
  const [isAskModalOpen, setIsAskModalOpen] = useState(false);
  const [newQuestionTitle, setNewQuestionTitle] = useState('');
  const [newQuestionContent, setNewQuestionContent] = useState('');
  const [submittingQuestion, setSubmittingQuestion] = useState(false);
  const [questionError, setQuestionError] = useState<string | null>(null);

  // Reply States per Question
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});
  const [submittingReplyId, setSubmittingReplyId] = useState<string | null>(null);
  const [replyError, setReplyError] = useState<string | null>(null);

  // Load Base Resources & Counsels
  useEffect(() => {
    async function loadData() {
      try {
        const { data, error } = await supabase
          .from('resources')
          .select('*')
          .eq('category', 'in-house-counsel')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          const mapped = data.map((d: any) => ({
            id: d.id,
            title: d.title,
            type: d.resource_type || "Corporate Playbook",
            topic: d.tags?.[0] || "In-House Counsel",
            subcategory: d.subcategory || "operations",
            contributor: d.author_name || "WIPA Corporate Counsel",
            organisation: d.organization || d.author_title || "Official",
            featured: d.is_featured || false,
            date: new Date(d.created_at || Date.now()).toLocaleDateString(),
            size: d.read_time || "Read",
            image: d.cover_image_url || "/resourceimg1.jpg",
          }));
          setDbResources(mapped);
        } else {
          setDbResources(MOCK_INHOUSE_RESOURCES);
        }

        const counselList = await fetchInHouseCounsels();
        if (counselList && counselList.length > 0) {
          setCounsels(counselList);
        }
      } catch (err) {
        setDbResources(MOCK_INHOUSE_RESOURCES);
        setCounsels(MOCK_IN_HOUSE_COUNSELS);
      }
    }
    loadData();
  }, []);

  // Fetch Q&A Forum Questions
  const refreshQuestions = async () => {
    setLoadingQuestions(true);
    const res = await getInHouseQuestions();
    if (res.success && res.questions) {
      setQuestions(res.questions);
    }
    setLoadingQuestions(false);
  };

  useEffect(() => {
    refreshQuestions();
  }, []);

  // Check Current User Role for In-House Counsel Privileges
  useEffect(() => {
    async function checkUserRole() {
      if (!user?.id) {
        setIsCounselUser(false);
        return;
      }
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profile) {
          setCurrentUserProfile(profile);
          const isCounsel = checkIsInHouseCounsel(profile);
          setIsCounselUser(isCounsel);
        }
      } catch (e) {
        setIsCounselUser(false);
      }
    }
    checkUserRole();
  }, [user]);

  // Handle Question Submission
  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionTitle.trim() || !newQuestionContent.trim()) {
      setQuestionError("Please fill out both the question title and description.");
      return;
    }

    const authorId = user?.id || 'a1ba913a-5474-4cb1-9aad-00ba81fb9e8e'; // Fallback to registered member if guest

    setSubmittingQuestion(true);
    setQuestionError(null);

    const res = await askInHouseQuestion({
      title: newQuestionTitle,
      content: newQuestionContent,
      authorId
    });

    setSubmittingQuestion(false);

    if (res.success) {
      setNewQuestionTitle('');
      setNewQuestionContent('');
      setIsAskModalOpen(false);
      refreshQuestions();
    } else {
      setQuestionError(res.error || "Failed to submit question.");
    }
  };

  // Handle Reply Submission (In-House Counsel or Question Author Only)
  const handleReplySubmit = async (postId: string, questionAuthorId?: string) => {
    const text = replyTexts[postId];
    if (!text?.trim()) return;

    const isQuestionAuthor = Boolean(user?.id && (user.id === questionAuthorId));
    const canEngage = isCounselUser || isQuestionAuthor;

    if (!canEngage) {
      setReplyError("Restricted: In this exclusive thread, only verified In-House Counsel and the question author can engage.");
      setTimeout(() => setReplyError(null), 4000);
      return;
    }

    const authorId = user?.id;
    if (!authorId) {
      setReplyError("Please log in to participate.");
      return;
    }

    setSubmittingReplyId(postId);
    setReplyError(null);

    const res = await answerInHouseQuestion({
      postId,
      content: text,
      authorId
    });

    setSubmittingReplyId(null);

    if (res.success) {
      setReplyTexts(prev => ({ ...prev, [postId]: '' }));
      refreshQuestions();
    } else {
      setReplyError(res.error || "Failed to submit reply.");
      setTimeout(() => setReplyError(null), 5000);
    }
  };

  const resourcesList = dbResources.length > 0 ? dbResources : MOCK_INHOUSE_RESOURCES;

  const filteredResources = resourcesList.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (r.organisation && r.organisation.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = typeFilter === 'All Types' || r.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const filteredCounsels = counsels.filter(c => {
    const q = searchQuery.toLowerCase();
    return c.name.toLowerCase().includes(q) || 
           c.company.toLowerCase().includes(q) || 
           c.role.toLowerCase().includes(q) ||
           c.location.toLowerCase().includes(q) ||
           c.practiceArea.toLowerCase().includes(q) ||
           c.skills.some(s => s.toLowerCase().includes(q));
  });

  const filteredQuestions = questions.filter(q => {
    const s = searchQuery.toLowerCase();
    return q.title.toLowerCase().includes(s) || 
           q.content.toLowerCase().includes(s) ||
           (q.author?.full_name && q.author.full_name.toLowerCase().includes(s));
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-white font-sans selection:bg-sky-500/30 overflow-x-hidden transition-colors duration-300 pb-24">
      
      {/* Sleek, Grand Hero Header (Ice Blue / Cyber Corporate Theme) */}
      <div className="relative w-full border-b border-slate-200/80 dark:border-white/10 overflow-hidden bg-white/50 dark:bg-[#030816]/70 backdrop-blur-3xl">
        <div className="absolute inset-0 bg-gradient-to-b from-sky-500/12 via-cyan-500/5 to-transparent dark:from-[#0369a1]/25 dark:via-[#082f49]/20 dark:to-transparent z-0 pointer-events-none"></div>
        <div className="absolute -top-36 left-1/2 -translate-x-1/2 w-[850px] h-[450px] bg-gradient-to-br from-sky-400/25 via-cyan-400/20 to-transparent dark:from-sky-500/25 dark:via-cyan-600/20 rounded-full blur-[130px] pointer-events-none z-0"></div>
        <div className="absolute top-1/2 -left-48 w-96 h-96 bg-blue-500/10 dark:bg-sky-500/10 rounded-full blur-[100px] pointer-events-none z-0"></div>
        <div className="absolute top-1/2 -right-48 w-96 h-96 bg-cyan-500/10 dark:bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none z-0"></div>
        <div className="absolute inset-0 opacity-[0.025] dark:opacity-[0.05] bg-[url('/patterns/stardust.png')] z-0 mix-blend-overlay pointer-events-none"></div>
        
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 md:pt-20 pb-12 sm:pb-16 relative z-10 flex flex-col items-center text-center">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/10 dark:bg-sky-500/20 border border-sky-500/30 text-sky-700 dark:text-sky-300 text-xs font-black uppercase tracking-widest mb-5 shadow-xs backdrop-blur-md">
            <Shield size={14} className="text-sky-500 shrink-0" />
            <span>Enterprise Counsel Knowledge Base</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[80px] font-black tracking-tight leading-[1.05] mb-5 text-slate-900 dark:text-white">
            In-House{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 via-cyan-500 to-teal-400 dark:from-sky-400 dark:via-cyan-300 dark:to-teal-300 drop-shadow-xs">
              Counsel
            </span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl font-medium text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed mx-auto mb-6">
            Ask corporate IP leaders questions, connect with verified General Counsels, and download exclusive in-house playbooks.
          </p>

          {/* Quick Authority Highlights */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8 text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 shadow-2xs">
              <UsersRound size={14} className="text-sky-500" />
              <span>{counsels.length} Verified General Counsels</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 shadow-2xs">
              <ShieldCheck size={14} className="text-emerald-500" />
              <span>Corporate Playbooks & Roundtables</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 shadow-2xs">
              <MessageSquare size={14} className="text-cyan-500" />
              <span>Direct In-House Q&A</span>
            </span>
          </div>

          {/* Integrated Search & Filter Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-2xl">
            <div className="relative w-full flex items-center bg-white dark:bg-slate-900/95 border-2 border-slate-200/90 dark:border-white/15 rounded-2xl px-4 py-3 shadow-md shadow-sky-500/5 transition-all focus-within:ring-4 focus-within:ring-sky-500/20 focus-within:border-sky-500">
              <Search size={18} className="text-slate-400 dark:text-slate-500 mr-3 shrink-0" />
              <input 
                type="text" 
                placeholder="Search in-house counsel, questions, playbooks..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm sm:text-base font-semibold text-slate-900 dark:text-white focus:outline-none placeholder-slate-400 dark:placeholder-slate-500"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400"
                >
                  <X size={15} />
                </button>
              )}
            </div>
            
            <div className="relative w-full sm:w-56 shrink-0">
              <select 
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="appearance-none w-full bg-white dark:bg-slate-900/95 border-2 border-slate-200/90 dark:border-white/15 rounded-2xl px-4 py-3 pr-10 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-sky-500/20 focus:border-sky-500 cursor-pointer shadow-md shadow-sky-500/5 transition-all"
              >
                {CONTENT_TYPES.map(type => (
                  <option key={type} value={type} className="dark:bg-slate-900">{type}</option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none" />
            </div>
          </div>

          {/* Prominent 3 Navigation Switchboard */}
          <div className="mt-8 flex items-center justify-center max-w-full overflow-x-auto no-scrollbar py-1">
            <div className="inline-flex items-center gap-2 p-1.5 sm:p-2 rounded-2xl sm:rounded-3xl bg-white/95 dark:bg-[#0c1427] border-2 border-slate-200/90 dark:border-white/15 shadow-xl shadow-sky-500/10 backdrop-blur-xl">
              {MOCK_INHOUSE_SUBCATEGORIES.map(sub => {
                const Icon = sub.icon;
                const isActive = activeSub === sub.id;
                return (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => setActiveSub(sub.id as any)}
                    className={`inline-flex items-center gap-2 sm:gap-2.5 px-5 sm:px-7 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm md:text-base font-bold tracking-tight transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 ${
                      isActive 
                        ? 'bg-gradient-to-r from-sky-500 via-sky-600 to-cyan-500 text-white shadow-lg shadow-sky-500/30 scale-[1.02] font-black' 
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-white/10'
                    }`}
                  >
                    <Icon size={18} strokeWidth={isActive ? 2.6 : 2} className={isActive ? 'text-white' : 'text-slate-400 dark:text-slate-400'} />
                    <span>{sub.name}</span>
                    {sub.id === 'counsels' && (
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-black ${isActive ? 'bg-white/25 text-white' : 'bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-500/20'}`}>
                        {counsels.length}
                      </span>
                    )}
                    {sub.id === 'ask-counsel' && (
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-black ${isActive ? 'bg-white/25 text-white' : 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20'}`}>
                        {questions.length}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        
        {/* ========================================================================= */}
        {/* TAB 1: ASK IN-HOUSE COUNSEL DISCUSSION FORUM                              */}
        {/* ========================================================================= */}
        {activeSub === 'ask-counsel' && (
          <div className="space-y-6">
            
            {/* Header & Authority Banner */}
            <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-sky-500/10 via-cyan-500/5 to-slate-100 dark:to-[#081026] border border-sky-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-sky-600 dark:text-sky-400 bg-sky-500/15 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldCheck size={12} /> Moderated Discussion Forum
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">
                    Live DB Sync
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  Ask In-House Counsel Q&A Forum
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
                  Open for <strong>any member</strong> to ask questions. To ensure authoritative, high-integrity corporate answers, <strong>only verified In-House Counsels and General Counsels can submit replies</strong>.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsAskModalOpen(true)}
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-black text-xs uppercase tracking-wider shadow-md shadow-sky-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus size={16} />
                  <span>Ask In-House Counsel</span>
                </button>
              </div>
            </div>

            {/* Error Notification */}
            {replyError && (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-400 text-xs font-bold flex items-center gap-2 animate-fadeIn">
                <AlertCircle size={16} className="shrink-0 text-rose-500" />
                <span>{replyError}</span>
              </div>
            )}

            {/* Questions List */}
            <div className="space-y-6">
              {filteredQuestions.map((q) => {
                const replies = q.forum_replies || [];
                const replyDraft = replyTexts[q.id] || '';
                const isAuthorOfThisQuestion = Boolean(user?.id && (user.id === q.author?.id || user.id === q.author_id));

                return (
                  <div 
                    key={q.id}
                    className="bg-white dark:bg-[#0b1329] rounded-2xl border border-slate-200/80 dark:border-white/10 p-4 sm:p-5 shadow-2xs space-y-3"
                  >
                    {/* Compact Question Header */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg overflow-hidden bg-slate-800 border border-slate-200 dark:border-white/10 shrink-0">
                          {q.author?.avatar_url ? (
                            <img src={q.author.avatar_url} alt={q.author?.full_name || 'Member'} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-sky-500/10 text-sky-600 font-bold text-xs">
                              {q.author?.full_name?.charAt(0) || 'M'}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                              {q.author?.full_name || 'WIPA Member'}
                            </span>
                            {isAuthorOfThisQuestion && (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                                Your Question
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium truncate">
                            {q.author?.company || q.author?.role || 'Member'} &bull; {new Date(q.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 flex items-center gap-1">
                          <CheckCircle2 size={10} />
                          <span>{replies.length} {replies.length === 1 ? 'Answer' : 'Answers'}</span>
                        </span>
                      </div>
                    </div>

                    {/* Brief Question Title & Content */}
                    <div className="space-y-1">
                      <h3 className="text-sm sm:text-[15px] font-bold text-slate-900 dark:text-white leading-snug">
                        {q.title}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                        {q.content}
                      </p>
                    </div>

                    {/* Verified In-House Counsel & Author Engagement Thread */}
                    {replies.length > 0 && (
                      <div className="pt-2.5 border-t border-slate-100 dark:border-white/5 space-y-2">
                        <div className="text-[10px] font-extrabold uppercase tracking-wider text-sky-600 dark:text-sky-400 flex items-center gap-1">
                          <ShieldCheck size={12} className="text-sky-500" />
                          <span>Counsel Guidance & Thread</span>
                        </div>

                        <div className="space-y-2">
                          {replies.map((rep: any) => {
                            const isReplyFromAuthor = Boolean(
                              (q.author?.id && rep.author?.id === q.author.id) ||
                              (q.author_id && rep.author?.id === q.author_id)
                            );

                            return (
                              <div 
                                key={rep.id}
                                className={`p-3 rounded-xl border text-xs space-y-1.5 ${
                                  isReplyFromAuthor 
                                    ? 'bg-emerald-500/[0.03] dark:bg-emerald-500/[0.05] border-emerald-500/20' 
                                    : 'bg-sky-500/[0.03] dark:bg-sky-500/[0.05] border-sky-500/20'
                                }`}
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex items-center gap-2 min-w-0">
                                    <div className="w-6 h-6 rounded-md overflow-hidden bg-slate-800 shrink-0 border border-slate-200 dark:border-white/10">
                                      {rep.author?.avatar_url ? (
                                        <img src={rep.author.avatar_url} alt={rep.author.full_name} className="w-full h-full object-cover" />
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-sky-500 text-white font-bold text-[10px]">
                                          {rep.author?.full_name?.charAt(0) || 'C'}
                                        </div>
                                      )}
                                    </div>
                                    <div className="min-w-0">
                                      <div className="flex items-center gap-1.5 flex-wrap">
                                        <span className="font-bold text-slate-900 dark:text-white text-[11px] truncate">
                                          {rep.author?.full_name}
                                        </span>
                                        {isReplyFromAuthor ? (
                                          <span className="text-[8px] font-black px-1.5 py-0.2 rounded bg-emerald-600 text-white uppercase tracking-wider flex items-center gap-0.5">
                                            <User size={8} /> Question Author
                                          </span>
                                        ) : (
                                          <span className="text-[8px] font-black px-1.5 py-0.2 rounded bg-sky-500 text-white uppercase tracking-wider flex items-center gap-0.5">
                                            <Scale size={8} /> In-House Counsel
                                          </span>
                                        )}
                                      </div>
                                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium truncate">
                                        {rep.author?.role} {rep.author?.company ? `@ ${rep.author.company}` : ''}
                                      </div>
                                    </div>
                                  </div>

                                  <span className="text-[9px] text-slate-400 font-medium shrink-0">
                                    {new Date(rep.created_at).toLocaleDateString()}
                                  </span>
                                </div>

                                <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-normal pl-8">
                                  {rep.content}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Engagement / Reply Box (Counsel & Question Author Only) */}
                    <div className="pt-2.5 border-t border-slate-100 dark:border-white/5">
                      {isCounselUser ? (
                        /* Case 1: User is In-House Counsel - Can Answer */
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 flex items-center gap-1">
                              <Scale size={11} /> Reply as Verified In-House Counsel
                            </span>
                            <span className="text-slate-400 truncate max-w-[200px]">
                              Posting as: {currentUserProfile?.full_name || 'In-House Counsel'}
                            </span>
                          </div>

                          <div className="flex gap-2 items-start">
                            <textarea
                              rows={1}
                              value={replyDraft}
                              onChange={(e) => setReplyTexts(prev => ({ ...prev, [q.id]: e.target.value }))}
                              placeholder="Provide legal or operational guidance..."
                              className="flex-1 text-xs p-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/60 focus:bg-white dark:focus:bg-[#070b14] focus:ring-1 focus:ring-sky-500 focus:outline-none transition-all placeholder-slate-400 text-slate-900 dark:text-white resize-none"
                            />
                            <button
                              type="button"
                              onClick={() => handleReplySubmit(q.id, q.author_id || q.author?.id)}
                              disabled={submittingReplyId === q.id || !replyDraft.trim()}
                              className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1 cursor-pointer disabled:opacity-40 shrink-0"
                            >
                              <Send size={11} />
                              <span>{submittingReplyId === q.id ? 'Posting…' : 'Reply'}</span>
                            </button>
                          </div>
                        </div>
                      ) : isAuthorOfThisQuestion ? (
                        /* Case 2: User is Question Author - Can Engage & Follow Up */
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                              <MessageCircle size={11} /> Follow Up with Counsel
                            </span>
                            <span className="text-slate-400">
                              Question Author Discussion
                            </span>
                          </div>

                          <div className="flex gap-2 items-start">
                            <textarea
                              rows={1}
                              value={replyDraft}
                              onChange={(e) => setReplyTexts(prev => ({ ...prev, [q.id]: e.target.value }))}
                              placeholder="Ask a clarifying question or respond to counsel's advice..."
                              className="flex-1 text-xs p-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/60 focus:bg-white dark:focus:bg-[#070b14] focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all placeholder-slate-400 text-slate-900 dark:text-white resize-none"
                            />
                            <button
                              type="button"
                              onClick={() => handleReplySubmit(q.id, q.author_id || q.author?.id)}
                              disabled={submittingReplyId === q.id || !replyDraft.trim()}
                              className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1 cursor-pointer disabled:opacity-40 shrink-0"
                            >
                              <Send size={11} />
                              <span>{submittingReplyId === q.id ? 'Sending…' : 'Follow Up'}</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* Case 3: Other Users - Restricted (Counsel & Question Author Only) */
                        <div className="p-2.5 rounded-xl bg-slate-50/80 dark:bg-white/[0.02] border border-dashed border-slate-200 dark:border-white/10 flex items-center justify-between gap-3 text-[11px] text-slate-500 dark:text-slate-400">
                          <div className="flex items-center gap-1.5">
                            <Lock size={12} className="text-slate-400 shrink-0" />
                            <span>
                              <strong>Exclusive Dialogue:</strong> Only verified In-House Counsel and the question author can engage in this thread.
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setIsAskModalOpen(true)}
                            className="px-2.5 py-1 rounded-lg bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[10px] font-bold text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-950/40 shrink-0 transition-colors cursor-pointer"
                          >
                            Ask a Question
                          </button>
                        </div>
                      )}
                    </div>

                  </div>
                );
              })}

              {filteredQuestions.length === 0 && !loadingQuestions && (
                <div className="col-span-full py-20 text-center border border-dashed border-slate-300 dark:border-white/10 rounded-3xl bg-white/50 dark:bg-white/5">
                  <MessageSquare size={36} className="mx-auto text-slate-400 mb-4" />
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">No questions found</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Be the first to submit a question to our corporate in-house counsels.</p>
                  <button
                    type="button"
                    onClick={() => setIsAskModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-sky-500 text-white font-bold text-xs hover:bg-sky-600 transition-all cursor-pointer"
                  >
                    Ask In-House Counsel
                  </button>
                </div>
              )}
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: IN-HOUSE COUNSELS DIRECTORY                                       */}
        {/* ========================================================================= */}
        {activeSub === 'counsels' && (
          <div className="space-y-6">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-sky-500/10 via-cyan-500/5 to-transparent border border-sky-500/20">
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <UsersRound size={18} className="text-sky-500" />
                  In-House Counsel Directory & Executive Profiles
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                  Browse corporate IP directors, general counsels, and portfolio strategists. Click any counsel card to view their experience profile.
                </p>
              </div>
              <span className="text-xs font-bold text-sky-600 dark:text-sky-400 bg-sky-500/10 px-3 py-1 rounded-xl shrink-0">
                {filteredCounsels.length} Verified Counsels
              </span>
            </div>

            {/* Counsel Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCounsels.map(counsel => (
                <div 
                  key={counsel.id}
                  className="group relative bg-white dark:bg-[#0b1329] rounded-2xl border border-slate-200/90 dark:border-white/10 overflow-hidden hover:border-sky-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-sky-500/10 flex flex-col justify-between"
                >
                  <div className="h-1.5 w-full bg-gradient-to-r from-sky-500 to-cyan-500"></div>

                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-800 border-2 border-slate-100 dark:border-white/10">
                          <img 
                            src={counsel.avatar} 
                            alt={counsel.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="absolute -bottom-1 -right-1 p-1 bg-sky-500 text-white rounded-full ring-2 ring-white dark:ring-[#0b1329]" title="Verified Counsel">
                          <CheckCircle2 size={12} />
                        </div>
                      </div>

                      <div className="flex flex-col items-end">
                        {counsel.membershipTier === 'in_house_counsel' && (
                          <span className="text-[9px] font-black uppercase tracking-wider text-cyan-600 dark:text-cyan-300 bg-cyan-500/15 border border-cyan-500/30 px-2 py-0.5 rounded-full mb-1.5 flex items-center gap-1">
                            <Scale size={9} /> In-House Plan
                          </span>
                        )}
                        <span className="text-[10px] font-black uppercase tracking-wider text-sky-600 dark:text-sky-400 bg-sky-500/10 border border-sky-500/20 px-2 py-0.5 rounded-full">
                          {counsel.experienceYears}+ Yrs Exp
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold mt-1 flex items-center gap-1">
                          <MapPin size={10} /> {counsel.location.split(',')[0]}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight group-hover:text-sky-500 transition-colors">
                      {counsel.name}
                    </h3>

                    <div className="text-xs font-bold text-sky-600 dark:text-sky-400 mt-1 line-clamp-1 flex items-center gap-1.5">
                      <Briefcase size={13} className="shrink-0 text-sky-500" />
                      <span className="truncate">{counsel.role}</span>
                    </div>

                    <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1 flex items-center gap-1.5">
                      <Building size={13} className="shrink-0 text-slate-400" />
                      <span className="font-bold text-slate-900 dark:text-white truncate">{counsel.company}</span>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 line-clamp-2 leading-relaxed">
                      {counsel.bio}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-slate-100 dark:border-white/5">
                      {counsel.skills.slice(0, 2).map((skill, idx) => (
                        <span key={idx} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400">
                          {skill}
                        </span>
                      ))}
                      {counsel.skills.length > 2 && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md text-slate-400">
                          +{counsel.skills.length - 2}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-white/5 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedCounselModal(counsel)}
                      className="flex-1 py-2 px-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-sky-950/40 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 hover:text-sky-600 dark:text-slate-300 dark:hover:text-sky-400 transition-all text-center cursor-pointer shadow-2xs"
                    >
                      Quick Profile
                    </button>

                    <Link
                      href={`/platform/resources/in-house-counsel/counsel/${counsel.id}`}
                      className="py-2 px-3 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1 cursor-pointer shrink-0"
                      title="Open full counsel profile"
                    >
                      <span>Profile</span>
                      <ArrowUpRight size={13} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: ABOUT IN-HOUSE COUNSEL & PLAYBOOKS                                 */}
        {/* ========================================================================= */}
        {activeSub === 'all' && (
          <div className="space-y-10 sm:space-y-12">
            
            {/* CARD 1: What is the In-House Counsel Hub? (Executive Mission) */}
            <div className="relative rounded-3xl overflow-hidden p-7 sm:p-9 md:p-11 bg-gradient-to-br from-sky-500/10 via-cyan-500/5 to-slate-100/60 dark:from-[#0b1d3a]/60 dark:via-[#08152c]/50 dark:to-[#020617] border border-sky-400/30 dark:border-sky-500/20 shadow-xl shadow-sky-900/5 dark:shadow-sky-950/20">
              <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-[110px] pointer-events-none"></div>
              
              <div className="relative z-10 max-w-4xl space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/15 text-sky-700 dark:text-sky-300 text-[11px] font-black uppercase tracking-wider border border-sky-500/25">
                    <Sparkles size={12} className="text-sky-500" /> Platform Architecture & Mission
                  </span>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                    The Corporate IP Nerve Center
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                  What is the In-House Counsel Hub?
                </h2>

                <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  The <strong>In-House Counsel Hub</strong> is WIPA's dedicated corporate ecosystem designed to bridge private law firm practice and executive enterprise leadership. Inside, members gain direct transparency into how multinational enterprises manage intellectual property portfolios, evaluate and select outside law firms, negotiate corporate legal budgets, and steer boardroom governance.
                </p>

                {/* 3 Core Interactive Pillars */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
                  <div className="p-4 rounded-2xl bg-white/80 dark:bg-white/5 border border-sky-100 dark:border-white/10 backdrop-blur-md">
                    <div className="w-8 h-8 rounded-xl bg-sky-500/15 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-2 font-black text-sm">
                      1
                    </div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white mb-1">
                      Verified Counsel Dossiers
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                      Inspect the career timelines, patent counts, and achievements of vetted corporate GCs across Waymo, LVMH, Sanofi, and Alphabet.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/80 dark:bg-white/5 border border-sky-100 dark:border-white/10 backdrop-blur-md">
                    <div className="w-8 h-8 rounded-xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-2 font-black text-sm">
                      2
                    </div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white mb-1">
                      Moderated Q&A Forum
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                      Any registered member can ask questions; answers are strictly authored by verified in-house corporate counsel to ensure integrity.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/80 dark:bg-white/5 border border-sky-100 dark:border-white/10 backdrop-blur-md">
                    <div className="w-8 h-8 rounded-xl bg-sky-500/15 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-2 font-black text-sm">
                      3
                    </div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white mb-1">
                      Executive Playbooks
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                      Download corporate outside counsel guidelines, trade secret audit checklists, and patent portfolio harvesting case studies.
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveSub('counsels')}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-black text-xs uppercase tracking-wider shadow-md shadow-sky-500/20 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <UsersRound size={14} />
                    <span>Meet the In-House Counsels ({counsels.length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveSub('ask-counsel')}
                    className="px-5 py-2.5 rounded-xl bg-white dark:bg-white/10 hover:bg-slate-100 dark:hover:bg-white/15 text-slate-800 dark:text-white font-bold text-xs border border-slate-200 dark:border-white/15 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <MessageSquare size={14} className="text-sky-500" />
                    <span>Go to Ask In-House Counsel Q&A</span>
                  </button>
                </div>
              </div>
            </div>

            {/* CARD 2 & 3: Who are In-House Counsels & Comparison Matrix */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* Who are In-House Counsels? */}
              <div className="lg:col-span-6 rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#0b1329] border border-slate-200/90 dark:border-white/10 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400 text-xs font-black uppercase tracking-wider mb-2">
                    <Building size={15} /> Executive Definition
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-3">
                    Who are In-House Counsels?
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium mb-4">
                    <strong>In-House Counsels</strong> are licensed corporate attorneys employed directly within an enterprise, institution, or technology company (rather than an external law firm). In intellectual property, they are the corporate stewards who translate scientific and engineering innovations into enterprise valuation, commercial barriers, and sustainable revenue.
                  </p>

                  <div className="space-y-2.5 pt-2">
                    {[
                      { title: "Portfolio Commercialization", desc: "Aligning global patent filings directly with corporate R&D and revenue milestones." },
                      { title: "Outside Counsel Stewardship", desc: "Selecting, managing, and budgeting external law firm trial teams and patent agents." },
                      { title: "Cross-Functional Integration", desc: "Working seamlessly with software engineers, finance leads, tax, and marketing teams." },
                      { title: "Boardroom & C-Suite Risk Advisory", desc: "Translating complex litigation and patent risks into actionable business strategy." }
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                        <CheckCircle2 size={15} className="text-sky-500 shrink-0 mt-0.5" />
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white">{item.title}</div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{item.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-white/5 text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-sky-500" />
                  <span>Strategic business owners with internal corporate decision-making authority</span>
                </div>
              </div>

              {/* Comparison Matrix: In-House vs. Outside Counsel */}
              <div className="lg:col-span-6 rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#0b1329] border border-slate-200/90 dark:border-white/10 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 text-xs font-black uppercase tracking-wider mb-2">
                    <Scale size={15} /> Key Strategic Distinctions
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-3">
                    In-House Counsel vs. Law Firm Outside Counsel
                  </h3>

                  <div className="space-y-3 pt-1">
                    {[
                      { 
                        dimension: "Client Relationship", 
                        inHouse: "Single dedicated corporate enterprise (e.g. Waymo, Sanofi)", 
                        outside: "Multiple competing corporate clients across industries" 
                      },
                      { 
                        dimension: "Success Metric", 
                        inHouse: "Enterprise EBITDA, risk prevention & budget discipline", 
                        outside: "Billable hours, realization rates & portable book origination" 
                      },
                      { 
                        dimension: "Litigation Role", 
                        inHouse: "Strategic director, settlement authority & budget holder", 
                        outside: "Courtroom advocacy, brief drafting & discovery execution" 
                      },
                      { 
                        dimension: "Compensation Structure", 
                        inHouse: "Executive base salary, performance bonus & equity stock grants", 
                        outside: "Associate lockstep or Equity Partner profit-sharing pool" 
                      },
                      { 
                        dimension: "Advisory Style", 
                        inHouse: "Decisive, pragmatic, business-first commercial recommendations", 
                        outside: "Exhaustive legal risk analysis exploring all theoretical liabilities" 
                      }
                    ].map((row, i) => (
                      <div key={i} className="p-3 rounded-2xl bg-slate-50/80 dark:bg-white/5 border border-slate-200/70 dark:border-white/5 space-y-1.5">
                        <div className="text-[10px] font-black uppercase tracking-wider text-sky-600 dark:text-sky-400">
                          {row.dimension}
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="p-2 rounded-xl bg-sky-500/10 text-slate-800 dark:text-sky-200 font-medium">
                            <span className="font-bold block text-[10px] uppercase text-sky-700 dark:text-sky-300">In-House:</span>
                            {row.inHouse}
                          </div>
                          <div className="p-2 rounded-xl bg-slate-200/60 dark:bg-white/10 text-slate-700 dark:text-slate-300 font-medium">
                            <span className="font-bold block text-[10px] uppercase text-slate-500 dark:text-slate-400">Outside Law Firm:</span>
                            {row.outside}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* ASK QUESTION MODAL (Available to ANY User)                                */}
      {/* ========================================================================= */}
      {isAskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-[#0b1329] border border-slate-200 dark:border-white/10 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl animate-scaleUp">
            
            <div className="p-6 border-b border-slate-100 dark:border-white/10 flex items-center justify-between bg-gradient-to-r from-sky-500/10 via-cyan-500/5 to-transparent">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-sky-500/15 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                  <MessageSquare size={16} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">Ask In-House Counsel</h3>
                  <p className="text-[11px] text-slate-500">Answers are provided exclusively by verified corporate IP counsel.</p>
                </div>
              </div>
              <button 
                onClick={() => setIsAskModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 flex items-center justify-center text-slate-500 transition-colors cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleCreateQuestion} className="p-6 space-y-4">
              {questionError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs font-bold">
                  {questionError}
                </div>
              )}

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Question Title *
                </label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. How do you audit law firm billing overruns on patent prosecution?"
                  value={newQuestionTitle}
                  onChange={(e) => setNewQuestionTitle(e.target.value)}
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/60 focus:bg-white dark:focus:bg-[#070b14] focus:ring-2 focus:ring-sky-500 focus:outline-none transition-all placeholder-slate-400 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Detailed Context / Description *
                </label>
                <textarea 
                  rows={4}
                  required
                  placeholder="Describe your situation, stage of company, or specific legal challenge so in-house counsel can provide targeted advice..."
                  value={newQuestionContent}
                  onChange={(e) => setNewQuestionContent(e.target.value)}
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/60 focus:bg-white dark:focus:bg-[#070b14] focus:ring-2 focus:ring-sky-500 focus:outline-none transition-all placeholder-slate-400 text-slate-900 dark:text-white leading-relaxed"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAskModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingQuestion}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-black text-xs uppercase tracking-wider shadow-md shadow-sky-500/20 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Send size={13} />
                  <span>{submittingQuestion ? 'Submitting…' : 'Submit Question'}</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* QUICK COUNSEL PROFILE MODAL                                               */}
      {/* ========================================================================= */}
      {selectedCounselModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-[#0b1329] border border-slate-200 dark:border-white/10 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl animate-scaleUp">
            
            <div className="relative h-28 bg-gradient-to-r from-sky-600 via-sky-500 to-cyan-500 p-4 flex justify-between items-start text-white">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-black/20 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                  In-House Counsel Profile
                </span>
                {selectedCounselModal.membershipTier === 'in_house_counsel' && (
                  <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/30 flex items-center gap-1">
                    <Scale size={11} /> In-House Plan
                  </span>
                )}
              </div>
              <button 
                onClick={() => setSelectedCounselModal(null)}
                className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center text-white transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-6 pt-0 -mt-12 relative z-10">
              <div className="flex items-end gap-4 mb-4">
                <div className="w-20 h-20 rounded-2xl overflow-hidden border-4 border-white dark:border-[#0b1329] shadow-lg bg-slate-800 shrink-0">
                  <img src={selectedCounselModal.avatar} alt={selectedCounselModal.name} className="w-full h-full object-cover" />
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                    {selectedCounselModal.name}
                    <CheckCircle2 size={16} className="text-sky-500 shrink-0" />
                  </h3>
                  <div className="text-xs font-bold text-sky-600 dark:text-sky-400">{selectedCounselModal.role}</div>
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Building size={12} /> {selectedCounselModal.company} &bull; {selectedCounselModal.location}
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium mb-4">
                {selectedCounselModal.bio}
              </p>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 mb-4">
                <div className="text-[10px] font-black uppercase tracking-wider text-sky-600 dark:text-sky-400 mb-2 flex items-center gap-1">
                  <Briefcase size={12} /> Legal Experience & Prior Roles
                </div>
                <div className="space-y-2">
                  <div className="text-xs">
                    <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                      <span>{selectedCounselModal.role}</span>
                      <span className="text-[10px] text-slate-400">Present</span>
                    </div>
                    <div className="text-[11px] text-slate-500">{selectedCounselModal.company}</div>
                  </div>
                  {selectedCounselModal.previousRoles?.slice(0, 1).map((pr, idx) => (
                    <div key={idx} className="text-xs pt-1.5 border-t border-slate-200/60 dark:border-white/5">
                      <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                        <span>{pr.title}</span>
                        <span className="text-[10px] text-slate-400">{pr.period}</span>
                      </div>
                      <div className="text-[11px] text-slate-500">{pr.company}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-5">
                {selectedCounselModal.skills.map((skill, idx) => (
                  <span key={idx} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                    {skill}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Link
                  href={`/platform/resources/in-house-counsel/counsel/${selectedCounselModal.id}`}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-bold text-xs shadow-md shadow-sky-500/20 transition-all text-center flex items-center justify-center gap-1.5"
                >
                  <span>Open Full Counsel Dossier</span>
                  <ExternalLink size={13} />
                </Link>

                <Link
                  href={`/platform/profile/${selectedCounselModal.id}`}
                  className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-700 dark:text-slate-200 font-bold text-xs transition-all text-center"
                >
                  WIPA Profile
                </Link>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
