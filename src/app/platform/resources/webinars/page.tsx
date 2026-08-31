// @ts-nocheck
'use client';

import { DotmCircular7 as Loader2 } from '@/components/ui/dotm-circular-7';
import React, { useState } from 'react';
import { ArrowLeft, Search, Play, Calendar, Clock, ChevronDown, MonitorPlay, Users, Filter, Tv, Eye, Plus, Link as LinkIcon, X, Radio, Video, Sparkles, Check } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/store/useAppStore';

const MOCK_WEBINAR_SUBCATEGORIES = [
  { id: 'all', name: 'All Webinars' },
  { id: 'ai-in-ip', name: 'AI in IP' },
  { id: 'ip-litigation', name: 'IP Litigation' },
  { id: 'patent-law', name: 'Patent Law' },
  { id: 'ip-strategy', name: 'IP Strategy' }
];

const CONTENT_TYPES = [
  "All Types",
  "Upcoming Webinar",
  "Webinar Recording",
  "Masterclass",
  "Panel Discussion",
  "Workshop",
  "Video Session"
];

const MOCK_WEBINAR_RESOURCES = [
  {
    id: 101,
    title: "WIPA × LexisNexis® IP Masterclass: Portfolio Valuation & 5G SEPs with PatentSight+™",
    type: "Masterclass",
    topic: "Patent Law",
    subcategory: "patent-law",
    expert: "LexisNexis® IP Analytics Team & WIPA Senior Counsel",
    time: "Live Nov 14 • 11:00 AM EST",
    featured: true,
    views: "2.4k registered",
    company: {
      logo: "/companylogo.png",
      name: "LexisNexis® IP Solutions",
      description: "Official global analytics partner of WIPA."
    },
    image: "/resourceimg1.jpg"
  },
  {
    id: 1,
    title: "AI in Patent Law: Opportunities and Risks",
    type: "Upcoming Webinar",
    topic: "AI in IP",
    subcategory: "ai-ip",
    expert: "Dr. Alan Turing, Esq.",
    time: "Oct 24 • 10:00 AM EST",
    featured: true,
    views: "1.2k attending",
    company: {
      logo: "/companylogo.png",
      name: "Turing IP Group",
      description: "Leading experts in artificial intelligence and intellectual property law."
    },
    image: "/resourceimg1.jpg"
  },
  {
    id: 2,
    title: "Mastering IP Litigation Tactics",
    type: "Masterclass",
    topic: "IP Litigation",
    subcategory: "litigation",
    expert: "Sarah Jenkins & Co.",
    time: "3:00:00", // Duration format for YT style
    featured: true,
    views: "8.5k views",
    company: {
      logo: "/companylogo.png",
      name: "Jenkins & Co.",
      description: "A premier litigation boutique specializing in high-stakes patent disputes."
    },
    image: "/resourceimg2.jpg"
  },
  {
    id: 3,
    title: "The Future of Trademarks in the Metaverse",
    type: "Panel Discussion",
    topic: "IP Strategy",
    subcategory: "ip-strategy",
    expert: "Tech IP Group",
    time: "1:30:00",
    featured: false,
    views: "4.2k views",
    image: "/resource3.jpg"
  },
  {
    id: 4,
    title: "Drafting Software Patents",
    type: "Workshop",
    topic: "Patent Law",
    subcategory: "patent-law",
    expert: "Robert Smith Esq.",
    time: "Nov 5 • 1:00 PM EST",
    featured: false,
    views: "500 attending",
    image: "/resourceimg1.jpg"
  },
  {
    id: 5,
    title: "State of Global IP 2025",
    type: "Webinar Recording",
    topic: "IP Strategy",
    subcategory: "ip-strategy",
    expert: "Global IP Forum",
    time: "45:00",
    featured: false,
    views: "12k views",
    image: "/resourceimg2.jpg"
  },
  {
    id: 6,
    title: "Tech Giants and Standard Essential Patents",
    type: "Video Session",
    topic: "IP Litigation",
    subcategory: "litigation",
    expert: "IP Podcast Series",
    time: "35:00",
    featured: false,
    views: "3.1k views",
    image: "/resource3.jpg"
  }
];

export default function WebinarsHubPage() {
  const { user } = useAppStore();
  const [activeSub, setActiveSub] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [resources, setResources] = useState<any[]>([]);
  const [isLoadingWebinars, setIsLoadingWebinars] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    resource_type: 'Upcoming Webinar',
    subcategory: 'AI in IP',
    author_name: '',
    author_title: '',
    organization: '',
    scheduled_at: new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 16),
    duration_minutes: 60,
    read_time: '45:00',
    max_attendees: 500,
    assigned_room: 'ROOM1',
    url: 'https://meetn.com/room1-2',
    cover_image_url: '/resourceimg1.jpg',
    summary: '',
    content: '',
    webinar_status: 'upcoming'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatingMeetn, setGeneratingMeetn] = useState(false);
  const [meetnAssigned, setMeetnAssigned] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [successData, setSuccessData] = useState<any>(null);

  const [userProfile, setUserProfile] = useState<any>(null);
  const canHost = true;

  // User Webinars Modal State
  const [isUserWebinarsOpen, setIsUserWebinarsOpen] = useState(false);
  const [userWebinars, setUserWebinars] = useState<any[]>([]);
  const [loadingUserWebinars, setLoadingUserWebinars] = useState(false);

  const fetchUserWebinars = async () => {
    if (!user?.id) return;
    setLoadingUserWebinars(true);
    try {
      const userEmail = userProfile?.email || user?.email;
      let filterQuery = `author_id.eq.${user.id},submitter_id.eq.${user.id}`;
      if (userEmail) {
        filterQuery += `,submitter_email.eq.${userEmail}`;
      }
      const { data, error } = await supabase
        .from('webinars')
        .select('*')
        .or(filterQuery)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setUserWebinars(data);
      }
    } catch (e) {
      console.error('Error fetching user webinars:', e);
    } finally {
      setLoadingUserWebinars(false);
    }
  };

  React.useEffect(() => {
    async function fetchUser() {
      if (user?.id) {
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        if (data) {
          setUserProfile(data);
          setFormData(prev => ({
            ...prev,
            author_name: prev.author_name || data.full_name || user.email?.split('@')[0] || '',
            author_title: prev.author_title || data.role || '',
            organization: prev.organization || data.company || ''
          }));
        }
        fetchUserWebinars();
      }
    }
    fetchUser();
  }, [user?.id]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const cleanSlug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    setFormData(prev => ({ ...prev, title: val, slug: cleanSlug }));
  };

  const handleAssignMeetn = async () => {
    setGeneratingMeetn(true);
    setMeetnAssigned(false);
    try {
      const res = await fetch('/api/meetn/generate-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scheduled_at: formData.scheduled_at,
          duration_minutes: formData.duration_minutes
        })
      });
      const data = await res.json();
      if (data.success && data.url) {
        setFormData(prev => ({
          ...prev,
          url: data.url,
          assigned_room: data.assigned_room || data.room_name || 'ROOM1'
        }));
      } else {
        setFormData(prev => ({ ...prev, url: 'https://meetn.com/room1-2', assigned_room: 'ROOM1' }));
      }
    } catch (err) {
      setFormData(prev => ({ ...prev, url: 'https://meetn.com/room1-2', assigned_room: 'ROOM1' }));
    } finally {
      setMeetnAssigned(true);
      setTimeout(() => setMeetnAssigned(false), 5000);
      setGeneratingMeetn(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCover(true);
    try {
      const safeName = `${Date.now()}_cover_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const { error: uploadErr } = await supabase.storage
        .from('covers')
        .upload(safeName, file, { upsert: true });

      if (uploadErr) {
        const { error: resErr } = await supabase.storage
          .from('resources')
          .upload(safeName, file, { upsert: true });
        
        if (resErr) {
          alert('Cover upload error: ' + uploadErr.message);
          return;
        }
        const { data } = supabase.storage.from('resources').getPublicUrl(safeName);
        if (data?.publicUrl) setFormData(prev => ({ ...prev, cover_image_url: data.publicUrl }));
      } else {
        const { data } = supabase.storage.from('covers').getPublicUrl(safeName);
        if (data?.publicUrl) setFormData(prev => ({ ...prev, cover_image_url: data.publicUrl }));
      }
    } catch (err: any) {
      alert('Error uploading cover: ' + err.message);
    } finally {
      setUploadingCover(false);
    }
  };

  const handleHostWebinar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Please enter a webinar title');
      return;
    }

    setIsSubmitting(true);
    try {
      const cleanSlug = formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      const isUserAdmin = Boolean(userProfile?.is_admin);
      const initialApprovalStatus = isUserAdmin ? 'approved' : 'in_review';

      const payload = {
        title: formData.title.trim(),
        slug: `${cleanSlug}-${Date.now()}`,
        category: 'webinars',
        subcategory: formData.subcategory,
        resource_type: formData.resource_type,
        type: formData.resource_type,
        author_name: formData.author_name || userProfile?.full_name || user?.email || 'Member Host',
        author_title: formData.author_title || userProfile?.role || 'Speaker',
        organization: formData.organization || userProfile?.company || 'WIPA Member',
        author_id: user?.id || null,
        scheduled_at: formData.scheduled_at ? new Date(formData.scheduled_at).toISOString() : new Date().toISOString(),
        duration_minutes: Number(formData.duration_minutes) || 60,
        read_time: formData.read_time || `${formData.duration_minutes}:00`,
        max_attendees: Number(formData.max_attendees) || 500,
        url: formData.url || 'https://meetn.com/room1-2',
        external_url: formData.url || 'https://meetn.com/room1-2',
        meetn_room_url: formData.url || 'https://meetn.com/room1-2',
        assigned_room: formData.assigned_room || 'ROOM1',
        assigned_room_url: formData.url || 'https://meetn.com/room1-2',
        meetn_room_id: formData.assigned_room || 'ROOM1',
        webinar_platform: 'meetn',
        cover_image_url: formData.cover_image_url || '/resourceimg1.jpg',
        summary: formData.summary || formData.content?.slice(0, 200) || '',
        description: formData.summary || formData.content?.slice(0, 200) || '',
        content: formData.content || '',
        is_featured: false,
        webinar_status: 'upcoming',
        // Track complete Submitter Details
        submitter_id: user?.id || null,
        submitter_email: userProfile?.email || user?.email || '',
        submitter_name: userProfile?.full_name || formData.author_name || user?.email || '',
        submitter_phone: userProfile?.mobile_number || '',
        submitter_membership: userProfile?.membership_tier || 'Member',
        approval_status: initialApprovalStatus,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data: savedWebinar, error: saveErr } = await supabase
        .from('webinars')
        .insert(payload)
        .select()
        .single();

      if (saveErr) throw saveErr;

      setSuccessData({
        ...payload,
        id: savedWebinar?.id,
        is_pending: initialApprovalStatus === 'in_review'
      });

      fetchData();
      fetchUserWebinars();
    } catch (err: any) {
      console.error('Error saving webinar:', err);
      alert('Failed to submit webinar: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  async function fetchData() {
    setIsLoadingWebinars(true);
    try {
      // 1. Fetch from dedicated webinars table (strictly approved only!)
      const { data: webinarData, error: webErr } = await supabase
        .from('webinars')
        .select('*')
        .eq('approval_status', 'approved')
        .order('created_at', { ascending: false });

      if (webinarData && webinarData.length > 0) {
        setResources(webinarData.map(d => ({
          ...d,
          expert: d.author_name || "Expert",
          dateLabel: d.scheduled_at ? new Date(d.scheduled_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : 'Date to be announced',
          timeLabel: d.scheduled_at ? new Date(d.scheduled_at).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit', timeZoneName: 'short' }) : 'Time to be announced',
          time: d.duration_minutes ? `${d.duration_minutes} min` : (d.read_time || ''),
          image: d.cover_image_url || d.url || "/resourceimg1.jpg",
          featured: Boolean(d.is_featured ?? d.featured ?? false),
          topic: d.topic || d.subcategory || "AI in IP",
          subcategory: d.subcategory || d.topic || "AI in IP",
          type: d.webinar_status === 'live' ? 'Live Now' : (d.webinar_status === 'ended' ? 'Recording' : (d.resource_type || d.type || 'Upcoming Webinar'))
        })));
        return;
      }

      // 2. Fallback to resources table
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .eq('category', 'webinars')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        setResources(data.map(d => ({
          ...d,
          expert: d.author_name || "Expert",
          dateLabel: d.scheduled_at ? new Date(d.scheduled_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : 'Date to be announced',
          timeLabel: d.scheduled_at ? new Date(d.scheduled_at).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit', timeZoneName: 'short' }) : 'Time to be announced',
          time: d.duration_minutes ? `${d.duration_minutes} min` : (d.read_time || ''),
          image: d.cover_image_url || d.url || "/resourceimg1.jpg",
          featured: Boolean(d.is_featured ?? d.featured ?? false),
          topic: d.topic || d.subcategory || "AI in IP",
          subcategory: d.subcategory || d.topic || "AI in IP",
          type: d.webinar_status === 'live' ? 'Live Now' : (d.webinar_status === 'ended' ? 'Recording' : (d.resource_type || d.type || 'Upcoming Webinar'))
        })));
      } else {
        setResources([]);
      }
    } catch (err) {
      console.error('Error fetching webinars:', err);
      setResources([]);
    } finally {
      setIsLoadingWebinars(false);
    }
  }

  const [userWebinarFilter, setUserWebinarFilter] = useState<'all' | 'in_review' | 'approved' | 'rejected'>('all');

  const filteredUserWebinars = userWebinars.filter(w => {
    if (userWebinarFilter === 'all') return true;
    if (userWebinarFilter === 'in_review') return w.approval_status === 'in_review' || w.approval_status === 'pending';
    if (userWebinarFilter === 'approved') return w.approval_status === 'approved';
    if (userWebinarFilter === 'rejected') return w.approval_status === 'rejected';
    return true;
  });

  React.useEffect(() => {
    fetchData();

    // Subscribe to realtime updates for webinar status changes
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'resources',
          filter: "category=ilike.%Live Event%"
        },
        (payload) => {
          setResources(current => current.map(r => {
            if (r.id === payload.new.id) {
              return {
                ...r,
                ...payload.new,
                type: payload.new.webinar_status === 'live' ? 'Live Now' : (payload.new.webinar_status === 'ended' ? 'Recording' : 'Upcoming Webinar')
              };
            }
            return r;
          }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const normalize = (str: string = '') => str.toLowerCase().replace(/[^a-z0-9]/g, '');

  const filteredResources = resources.filter(r => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      (r.title && r.title.toLowerCase().includes(q)) ||
      (r.description && r.description.toLowerCase().includes(q)) ||
      (r.expert && r.expert.toLowerCase().includes(q)) ||
      (r.author_name && r.author_name.toLowerCase().includes(q));

    const itemSubNorm = normalize(r.subcategory || r.topic || '');
    const activeSubNorm = normalize(activeSub);

    const matchesSub = activeSub === 'all' || 
      itemSubNorm.includes(activeSubNorm) || 
      activeSubNorm.includes(itemSubNorm) ||
      (activeSubNorm.includes('patent') && itemSubNorm.includes('patent')) ||
      (activeSubNorm.includes('litigation') && itemSubNorm.includes('litigation')) ||
      (activeSubNorm.includes('ai') && itemSubNorm.includes('ai')) ||
      (activeSubNorm.includes('strategy') && itemSubNorm.includes('strategy'));

    const matchesType = typeFilter === 'All Types' || r.type === typeFilter || r.resource_type === typeFilter;
    
    return matchesSearch && matchesSub && matchesType;
  });

  const mainFeature = resources.find(r => r.featured) || filteredResources[0] || resources[0];
  const otherResources = activeSub === 'all' && !searchQuery
    ? filteredResources.filter(r => r.id !== mainFeature?.id)
    : filteredResources;

  if (isLoadingWebinars) {
    return (
      <div className="flex min-h-[calc(100dvh-72px)] items-center justify-center bg-[#f8f9fa] text-[#5a32fa] dark:bg-[#0f172a]">
        <Loader2 size={64} dotSize={8} />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#f8f9fa] dark:bg-[#0f172a] text-gray-900 dark:text-white font-sans selection:bg-[#ff2a5f]/30">
      
      {/* Cinematic Hero Feature */}
      {mainFeature && (
        <div className="relative w-full h-[62vh] min-h-[500px] max-h-[660px] flex flex-col justify-between pb-12 sm:pb-16">
          <div className="absolute inset-0 z-0 bg-gray-100 dark:bg-black">
            <img 
              src={mainFeature.image || "/resourceimg1.jpg"} 
              alt={mainFeature.title} 
              className="w-full h-full object-cover opacity-90 dark:opacity-60" 
              onError={(e) => { e.currentTarget.src = '/resourceimg1.jpg'; }}
            />
            {/* Reduced opacity on light mode via to stop it from washing out the image */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#f8f9fa] via-[#f8f9fa]/40 dark:from-[#0f172a] dark:via-[#0f172a]/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#f8f9fa]/80 via-[#f8f9fa]/20 dark:from-[#0f172a]/90 dark:via-[#0f172a]/50 to-transparent" />
          </div>

          {/* Search bar & Top Navigation */}
          <div className="relative z-50 p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link 
                href="/platform/resources"
                className="flex items-center gap-2 bg-white/70 dark:bg-black/50 hover:bg-white dark:hover:bg-black/70 backdrop-blur-md rounded-full px-4 py-2 border border-gray-300 dark:border-white/20 text-gray-700 dark:text-gray-200 text-sm font-semibold transition-all shadow-sm"
              >
                <ArrowLeft size={16} /> Back
              </Link>
            </div>
            
            <div className="flex items-center gap-3">
              {user && (
                <button 
                  onClick={() => {
                    setIsUserWebinarsOpen(true);
                    fetchUserWebinars();
                  }}
                  className="bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-full font-bold flex items-center gap-2 border border-white/15 backdrop-blur-md shadow-lg transition-transform hover:scale-105 active:scale-95 text-sm"
                >
                  <Video size={16} className="text-[#ff2a5f]" />
                  <span>Your Webinars</span>
                  {userWebinars.length > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-black bg-[#ff2a5f] text-white">
                      {userWebinars.length}
                    </span>
                  )}
                  {userWebinars.some(w => w.approval_status === "in_review" || w.approval_status === "pending") && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" title="You have webinars in review" />
                  )}
                </button>
              )}

              {canHost && (
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="bg-[#ff2a5f] hover:bg-[#e02553] text-white px-6 py-2.5 rounded-full font-bold flex items-center gap-2 shadow-lg transition-transform hover:scale-105 active:scale-95 text-sm"
                >
                  <Plus size={18} /> Host Webinar
                </button>
              )}
            </div>
          </div>
          
          <div className="relative z-10 w-full max-w-[1600px] mx-auto px-6 md:px-12 flex flex-col md:flex-row gap-8 items-end justify-between">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-[#ff2a5f] text-white text-xs font-black uppercase px-3 py-1 rounded-sm flex items-center gap-1.5 shadow-md">
                  <MonitorPlay size={14} /> {mainFeature.type || "Upcoming Webinar"}
                </span>
                {mainFeature.scheduled_at && (
                  <span className="bg-gray-900/10 dark:bg-black/50 backdrop-blur-md text-gray-900 dark:text-white text-xs font-bold uppercase px-3 py-1 rounded-sm border border-gray-900/20 dark:border-white/20 flex items-center gap-1.5">
                    <Calendar size={14} /> {mainFeature.dateLabel} · {mainFeature.timeLabel}
                  </span>
                )}
              </div>
              <h1 className={`${
                (mainFeature.title || '').length > 60
                  ? 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl'
                  : (mainFeature.title || '').length > 35
                  ? 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl'
                  : 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl'
              } font-black text-gray-900 dark:text-white leading-[1.12] mb-4 drop-shadow-sm dark:drop-shadow-lg line-clamp-3 tracking-tight`}>
                {mainFeature.title}
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-gray-800 dark:text-white/80 mb-6 max-w-2xl font-medium drop-shadow-sm dark:drop-shadow-md line-clamp-2 leading-relaxed">
                Join {mainFeature.expert || "Industry Experts"} for an in-depth dive into {mainFeature.topic || "Intellectual Property"}. {mainFeature.company?.description || mainFeature.description || ""}
              </p>
              
              <div className="flex items-center gap-4">
                <Link href={`/platform/resources/webinars/${mainFeature.id}`} className="bg-gray-900 text-white dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 px-7 py-3.5 rounded-full font-bold flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 shadow-xl text-sm sm:text-base">
                  <Play size={18} fill="currentColor" />
                  {mainFeature.type === "Upcoming Webinar" ? "Register Now" : "Watch Now"}
                </Link>
                <Link href={`/platform/resources/webinars/${mainFeature.id}`} className="bg-white/50 dark:bg-white/20 backdrop-blur-md hover:bg-white/80 dark:hover:bg-white/30 text-gray-900 dark:text-white px-7 py-3.5 rounded-full font-bold transition-colors border border-gray-300 dark:border-white/20 shadow-lg text-sm sm:text-base">
                  More Info
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-[1600px] mx-auto px-6 md:px-12 py-8">
        
        {/* Streaming Service Filter Bar */}
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between mb-12 bg-white dark:bg-white/5 p-2 rounded-2xl border border-gray-200 dark:border-white/5 shadow-sm dark:shadow-none">
          
          <div className="flex gap-2 overflow-x-auto no-scrollbar w-full md:w-auto p-2">
            {MOCK_WEBINAR_SUBCATEGORIES.map(sub => (
              <button
                key={sub.id}
                onClick={() => setActiveSub(sub.id)}
                className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
                  activeSub === sub.id
                    ? 'bg-black text-white dark:bg-white dark:text-black'
                    : 'text-gray-600 dark:text-white/60 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {sub.name}
              </button>
            ))}
          </div>
          
          <div className="flex w-full items-center gap-2 px-2 pb-2 md:w-auto md:px-0 md:pb-0 md:pr-2">
            <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-gray-200 bg-gray-100 px-3.5 transition-colors focus-within:border-[#ff2a5f] dark:border-white/10 dark:bg-black/50 md:w-64 md:flex-none">
              <Search size={16} className="shrink-0 text-gray-500 dark:text-white/50" />
              <input
                type="search"
                placeholder="Search webinars..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-11 min-w-0 flex-1 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-500 dark:text-white dark:placeholder:text-white/50"
              />
            </div>

            <div className="relative shrink-0">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="bg-gray-100 dark:bg-black/50 border border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/30 rounded-xl px-4 md:px-5 py-2.5 font-bold text-gray-900 dark:text-white flex items-center gap-2 md:gap-3 min-w-[145px] md:min-w-[200px] transition-all"
              >
                <Filter size={16} className="text-gray-500 dark:text-white/50" />
                <span className="flex-1 text-left">{typeFilter}</span>
                <ChevronDown size={18} className={`text-gray-500 dark:text-white/50 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
            
              {isDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden z-20 min-w-[200px]">
                {CONTENT_TYPES.map(type => (
                  <button
                    key={type}
                    onClick={() => {
                      setTypeFilter(type);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-5 py-3 font-medium transition-colors border-l-2 ${
                      typeFilter === type 
                        ? 'border-[#ff2a5f] bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white' 
                        : 'border-transparent text-gray-600 dark:text-white/60 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    {type}
                  </button>
                ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Video Grid (YouTube Style) */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
            <Tv className="text-[#ff2a5f]" /> All Sessions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
            {otherResources.map(resource => (
              <Link key={resource.id} href={`/platform/resources/webinars/${resource.id}`} className="group flex flex-col gap-3">
                <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-200 dark:bg-white/5">
                  <img 
                    src={resource.image || "/resourceimg1.jpg"} 
                    alt={resource.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    onError={(e) => { e.currentTarget.src = '/resourceimg1.jpg'; }}
                  />
                  
                  {/* Play Overlay */}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="w-12 h-12 rounded-full bg-[#ff2a5f] text-white flex items-center justify-center pl-1 shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                      <Play size={20} fill="currentColor" />
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex gap-2 flex-wrap">
                    {resource.webinar_status === 'live' && (
                      <span className="bg-red-500 text-white text-[10px] font-black uppercase px-2 py-1 rounded-md shadow-sm animate-pulse flex items-center gap-1">
                        <Radio size={10} /> LIVE
                      </span>
                    )}
                    {resource.type === "Upcoming Webinar" && (
                      <span className="bg-[#ff2a5f] text-white text-[10px] font-bold uppercase px-2 py-1 rounded-md shadow-sm">
                        Upcoming
                      </span>
                    )}
                  </div>
                  {resource.time && (
                    <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-sm text-white text-xs font-semibold px-2 py-1 rounded-md">
                      {resource.time}
                    </div>
                  )}
                </div>
                
                <div className="flex gap-3 items-start">
                  {/* Avatar / Channel Icon placeholder */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ff2a5f] to-purple-600 flex-shrink-0 flex items-center justify-center text-white font-bold text-sm shadow-inner mt-1">
                    {resource.expert.charAt(0)}
                  </div>
                  
                  <div className="flex min-w-0 flex-col">
                    <h3 className="text-gray-900 dark:text-white font-bold text-base leading-snug line-clamp-2 group-hover:text-[#ff2a5f] transition-colors">{resource.title}</h3>
                    <div className="mt-1 flex flex-col gap-1.5 text-sm text-gray-500 dark:text-white/60">
                      <span className="hover:text-gray-900 dark:hover:text-white transition-colors">{resource.expert}</span>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium">
                        <span className="flex items-center gap-1"><Calendar size={12} /> {resource.dateLabel}</span>
                        <span className="flex items-center gap-1"><Clock size={12} /> {resource.timeLabel}</span>
                        <span className="flex items-center gap-1"><Video size={12} /> {resource.type}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs">
                        {resource.views && <span className="flex items-center gap-1"><Eye size={12} /> {resource.views}</span>}
                        {resource.views && resource.topic && <span>•</span>}
                        {resource.topic && <span>{resource.topic}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}

            {otherResources.length === 0 && (
              <div className="col-span-full py-20 flex flex-col items-center justify-center text-center bg-gray-50 dark:bg-white/5 rounded-2xl border border-dashed border-gray-200 dark:border-white/10">
                <Tv size={48} className="text-gray-300 dark:text-white/20 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No videos found</h3>
                <p className="text-gray-500 dark:text-white/50">Try adjusting your search or filters.</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* YOUR WEBINARS MODAL */}
      {isUserWebinarsOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-md" 
            onClick={() => setIsUserWebinarsOpen(false)}
          />
          <div className="bg-[#0f1117] border border-white/10 rounded-3xl p-6 sm:p-8 w-full max-w-4xl relative z-10 shadow-2xl max-h-[90vh] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden flex flex-col">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-5 border-b border-white/10">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff2a5f]/15 text-[#ff2a5f] text-xs font-bold mb-2 border border-[#ff2a5f]/20">
                  <Video size={13} /> Submissions & Hosting
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Your Hosted Webinars</h2>
                <p className="text-xs text-gray-400 mt-1">
                  Track verification status, live broadcasting links, and approval states for all your submitted sessions.
                </p>
              </div>
              <button 
                onClick={() => setIsUserWebinarsOpen(false)} 
                className="text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 p-2.5 rounded-full transition-colors shrink-0"
              >
                <X size={20} />
              </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 pt-4 pb-2 overflow-x-auto [scrollbar-width:none]">
              {[
                { id: 'all', label: 'All Webinars', count: userWebinars.length },
                { id: 'in_review', label: '⏳ In Review', count: userWebinars.filter(w => w.approval_status === 'in_review' || w.approval_status === 'pending').length },
                { id: 'approved', label: '✓ Approved', count: userWebinars.filter(w => w.approval_status === 'approved').length },
                { id: 'rejected', label: '✕ Rejected', count: userWebinars.filter(w => w.approval_status === 'rejected').length }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setUserWebinarFilter(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 shrink-0 ${
                    userWebinarFilter === tab.id
                      ? "bg-[#ff2a5f] text-white border-[#ff2a5f] shadow-md shadow-[#ff2a5f]/20"
                      : "bg-white/5 text-gray-400 border-white/10 hover:text-white hover:border-white/20"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${userWebinarFilter === tab.id ? 'bg-white/25 text-white' : 'bg-white/10 text-gray-400'}`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Webinars List */}
            <div className="py-4 space-y-3 flex-1">
              {loadingUserWebinars ? (
                <div className="py-20 flex flex-col items-center justify-center text-center">
                  <Loader2 size={32} className="animate-spin text-[#ff2a5f] mb-3" />
                  <p className="text-xs text-gray-400 font-medium">Fetching your webinars...</p>
                </div>
              ) : filteredUserWebinars.length === 0 ? (
                <div className="py-16 text-center bg-white/[0.02] border border-dashed border-white/10 rounded-2xl p-8">
                  <Video size={40} className="text-gray-600 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-white mb-1">No webinars found in this filter</h3>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto mb-4">
                    {userWebinarFilter === 'all' 
                      ? "You haven't submitted any webinars yet. Host your first live masterclass or panel session with WIPA!"
                      : `You don't have any webinars with status '${userWebinarFilter}'.`}
                  </p>
                  {userWebinarFilter === 'all' && (
                    <button
                      onClick={() => {
                        setIsUserWebinarsOpen(false);
                        setIsModalOpen(true);
                      }}
                      className="bg-[#ff2a5f] hover:bg-[#e02553] text-white px-5 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-lg shadow-[#ff2a5f]/20 transition-all"
                    >
                      <Plus size={14} /> Host Your First Webinar
                    </button>
                  )}
                </div>
              ) : (
                filteredUserWebinars.map(webinar => {
                  const status = webinar.approval_status || 'in_review';
                  const isApproved = status === 'approved';
                  const isRejected = status === 'rejected';
                  const isInReview = !isApproved && !isRejected;

                  return (
                    <div 
                      key={webinar.id}
                      className="p-4 rounded-2xl bg-[#181a24] border border-white/10 hover:border-white/20 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      {/* Left thumbnail & info */}
                      <div className="flex items-start gap-3.5 flex-1 min-w-0">
                        <div className="w-20 h-14 rounded-xl bg-black/40 border border-white/10 overflow-hidden shrink-0">
                          {webinar.cover_image_url || webinar.image ? (
                            <img 
                              src={webinar.cover_image_url || webinar.image} 
                              alt={webinar.title} 
                              className="w-full h-full object-cover" 
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-600">
                              <Tv size={20} />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#ff2a5f] bg-[#ff2a5f]/10 px-2 py-0.5 rounded border border-[#ff2a5f]/20">
                              {webinar.subcategory || webinar.topic || 'Webinar'}
                            </span>
                            <span className="text-[11px] text-gray-500 flex items-center gap-1">
                              <Calendar size={11} /> {webinar.scheduled_at ? new Date(webinar.scheduled_at).toLocaleDateString() : 'Scheduled'}
                            </span>
                            <span className="text-[11px] text-gray-500 flex items-center gap-1">
                              <Clock size={11} /> {webinar.duration_minutes || 60} mins
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-white truncate">{webinar.title}</h4>
                          <p className="text-xs text-gray-400 truncate mt-0.5">
                            Speaker: <span className="text-gray-300 font-medium">{webinar.author_name || userProfile?.full_name || 'You'}</span>
                          </p>
                        </div>
                      </div>

                      {/* Right Status Badge & Room Action */}
                      <div className="flex flex-row sm:flex-col items-end sm:items-end justify-between sm:justify-center gap-2 w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                        {/* Status Badge */}
                        {isApproved && (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            <Check size={12} /> Approved & Live
                          </div>
                        )}
                        {isInReview && (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 animate-pulse">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> In Review
                          </div>
                        )}
                        {isRejected && (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
                            <X size={12} /> Rejected
                          </div>
                        )}

                        {/* Room link & Copy button */}
                        {webinar.url && (
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-mono text-gray-400 bg-black/40 px-2 py-0.5 rounded border border-white/10">
                              📹 {webinar.assigned_room || (webinar.url.includes('room2-2') ? 'Room2' : webinar.url.includes('room3-2') ? 'Room3' : 'ROOM1')}
                            </span>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(webinar.url);
                                alert('Meetn room link copied: ' + webinar.url);
                              }}
                              className="text-[10px] font-bold text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 px-2 py-0.5 rounded border border-white/10 transition-colors"
                            >
                              Copy Link
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-gray-500">
                Total Submissions: <strong className="text-white">{userWebinars.length}</strong>
              </span>
              <button
                onClick={() => {
                  setIsUserWebinarsOpen(false);
                  setIsModalOpen(true);
                }}
                className="bg-[#ff2a5f] hover:bg-[#e02553] text-white px-5 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-lg shadow-[#ff2a5f]/20 transition-all"
              >
                <Plus size={14} /> Host New Webinar
              </button>
            </div>

          </div>
        </div>
      )}

      {/* RICH HOST WEBINAR MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-md" 
            onClick={() => !isSubmitting && !successData && setIsModalOpen(false)}
          />
          <div className="bg-[#0f1117] border border-white/10 rounded-3xl p-6 sm:p-8 w-full max-w-3xl relative z-10 shadow-2xl max-h-[90vh] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {!successData && (
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="absolute top-6 right-6 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            )}

            {successData ? (
              <div className="text-center py-8 space-y-6">
                <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
                  <Check size={40} />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">
                    {successData.is_pending ? "Webinar Submitted for Review!" : "Webinar Scheduled Successfully!"}
                  </h2>
                  <p className="text-gray-400 max-w-md mx-auto text-sm">
                    {successData.is_pending
                      ? "Thank you for hosting with WIPA! Your submission has been sent to the admin team for approval. It will appear on the platform once verified."
                      : "Your webinar is now live on the WIPA platform calendar."}
                  </p>
                </div>
                
                {/* Submitter Summary Card */}
                <div className="bg-[#181a24] p-5 rounded-2xl border border-white/10 text-left space-y-3 max-w-lg mx-auto">
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Users size={14} className="text-[#ff2a5f]" /> Host & Submitter Info
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500 block">Host Name:</span>
                      <span className="text-white font-bold">{successData.submitter_name || successData.author_name}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Account Email:</span>
                      <span className="text-white font-mono">{successData.submitter_email}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Membership Status:</span>
                      <span className="text-purple-400 font-bold">{successData.submitter_membership || "Member"}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Assigned Room:</span>
                      <span className="text-rose-400 font-bold">{successData.assigned_room}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 max-w-lg mx-auto text-left">
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                    <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Assigned Meetn Broadcast Room</div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-black/40 px-3 py-2 rounded-xl text-xs font-mono truncate text-white border border-white/10">
                        {successData.url}
                      </div>
                      <button 
                        onClick={() => navigator.clipboard.writeText(successData.url)} 
                        className="bg-[#ff2a5f] hover:bg-[#e02553] text-white px-3.5 py-2 rounded-xl font-bold text-xs transition-colors"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={() => {
                    setIsModalOpen(false);
                    setSuccessData(null);
                  }}
                  className="bg-white text-black px-8 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors text-sm shadow-lg"
                >
                  Close & Return
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff2a5f]/15 text-[#ff2a5f] text-xs font-bold mb-3 border border-[#ff2a5f]/20">
                    <Video size={13} /> Host Live Masterclass
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Host a Webinar</h2>
                  <p className="text-xs text-gray-400 mt-1">
                    Submit your live masterclass, panel discussion, or presentation to the WIPA community.
                  </p>
                </div>

                {/* Submitter User Profile Pill */}
                {user && (
                  <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#ff2a5f] text-white flex items-center justify-center font-bold text-xs uppercase shrink-0">
                        {userProfile?.full_name?.charAt(0) || user.email?.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-white flex items-center gap-1.5">
                          {userProfile?.full_name || user.email}
                          <span className="px-1.5 py-0.2 rounded text-[10px] bg-purple-500/20 text-purple-300 font-semibold border border-purple-500/30">
                            {userProfile?.membership_tier || "Member"}
                          </span>
                        </div>
                        <div className="text-[11px] text-gray-500 font-mono">{userProfile?.email || user.email}</div>
                      </div>
                    </div>
                    <div className="text-[10px] font-bold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/20 shrink-0 flex items-center gap-1">
                      {userProfile?.is_admin ? "✓ Auto-Approved (Admin)" : "⏳ In Review (Admin Approval Required)"}
                    </div>
                  </div>
                )}

                <form onSubmit={handleHostWebinar} className="space-y-5">
                  {/* Format & Topic */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                        Webinar Format / Type *
                      </label>
                      <select
                        value={formData.resource_type}
                        onChange={(e) => setFormData({ ...formData, resource_type: e.target.value })}
                        className="w-full bg-[#181a24] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff2a5f]"
                      >
                        {["Upcoming Webinar", "Live Masterclass", "Interactive Panel", "Workshop", "Executive Briefing", "Video Session"].map(f => (
                          <option key={f} value={f} className="bg-[#181a24]">{f}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                        Topic & Domain *
                      </label>
                      <select
                        value={formData.subcategory}
                        onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                        className="w-full bg-[#181a24] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff2a5f]"
                      >
                        {["AI in IP", "Patent Law", "IP Litigation", "Trademark & Brand Protection", "Licensing & Tech Transfer", "Trade Secrets", "Copyright & Media", "IP Strategy & Valuation", "Global IP & Cross-Border", "Career & Leadership", "General"].map(t => (
                          <option key={t} value={t} className="bg-[#181a24]">{t}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Title & Slug */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                        Webinar Title *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. AI in Patent Law: Opportunities, Liabilities, and Prosecution Risks"
                        value={formData.title}
                        onChange={handleTitleChange}
                        className="w-full bg-[#181a24] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-[#ff2a5f]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                        URL Slug *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        className="w-full bg-[#181a24] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-gray-300 font-mono focus:outline-none focus:border-[#ff2a5f]"
                      />
                    </div>
                  </div>

                  {/* Speaker Details Card */}
                  <div className="p-4 rounded-2xl bg-[#181a24] border border-white/10 space-y-3">
                    <div className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Users size={14} className="text-[#ff2a5f]" /> Speaker & Expert Details
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-400 mb-1">Speaker / Host Name *</label>
                        <input
                          type="text"
                          required
                          value={formData.author_name}
                          onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                          className="w-full bg-[#09090b] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff2a5f]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-400 mb-1">Professional Title</label>
                        <input
                          type="text"
                          value={formData.author_title}
                          onChange={(e) => setFormData({ ...formData, author_title: e.target.value })}
                          className="w-full bg-[#09090b] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff2a5f]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-400 mb-1">Firm / Company Name</label>
                        <input
                          type="text"
                          value={formData.organization}
                          onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                          className="w-full bg-[#09090b] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff2a5f]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Date, Duration & Status */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5 flex items-center gap-1">
                        <Calendar size={13} className="text-amber-400" /> Scheduled Date & Time *
                      </label>
                      <input
                        type="datetime-local"
                        required
                        value={formData.scheduled_at}
                        onChange={(e) => setFormData({ ...formData, scheduled_at: e.target.value })}
                        className="w-full bg-[#181a24] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff2a5f]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5 flex items-center gap-1">
                        <Clock size={13} className="text-sky-400" /> Duration (Minutes) *
                      </label>
                      <input
                        type="number"
                        min={15}
                        max={300}
                        required
                        value={formData.duration_minutes}
                        onChange={(e) => setFormData({ ...formData, duration_minutes: Number(e.target.value), read_time: `${e.target.value}:00` })}
                        className="w-full bg-[#181a24] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff2a5f]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                        Webinar Status
                      </label>
                      <select
                        value={formData.webinar_status}
                        onChange={(e) => setFormData({ ...formData, webinar_status: e.target.value })}
                        className="w-full bg-[#181a24] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff2a5f]"
                      >
                        <option value="upcoming">Upcoming Session</option>
                        <option value="live">Live Now</option>
                        <option value="ended">Ended / Recording</option>
                      </select>
                    </div>
                  </div>

                  {/* Meetn Room Assignment Section */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                        <Video size={13} className="text-[#ff2a5f]" /> Meetn Live Room URL *
                      </label>
                      <button
                        type="button"
                        onClick={handleAssignMeetn}
                        disabled={generatingMeetn}
                        className={`text-xs px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all shadow-md ${
                          meetnAssigned
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                            : "bg-gradient-to-r from-[#ff2a5f] to-rose-600 hover:from-[#e02553] hover:to-rose-700 text-white active:scale-95 shadow-[#ff2a5f]/20"
                        }`}
                      >
                        {generatingMeetn ? (
                          <>
                            <Loader2 size={13} className="animate-spin" /> Checking Availability...
                          </>
                        ) : meetnAssigned ? (
                          <>
                            <Check size={13} /> Room Assigned: {formData.assigned_room}!
                          </>
                        ) : (
                          <>
                            <Sparkles size={13} /> ⚡ Assign Meetn Room
                          </>
                        )}
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        readOnly
                        placeholder="Click '⚡ Assign Meetn Room' above..."
                        value={formData.url}
                        className="w-full bg-[#181a24] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-gray-500 focus:outline-none cursor-default font-mono selection:bg-[#ff2a5f]/30 select-all"
                      />
                      {formData.url && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 pointer-events-none">
                          <Check size={10} /> {formData.assigned_room || "ROOM1"}
                        </div>
                      )}
                    </div>

                    {/* Room pills */}
                    <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                      <span className="text-[10px] uppercase font-bold text-gray-500">Available Meetn Rooms:</span>
                      {[
                        { name: "ROOM1", url: "https://meetn.com/room1-2" },
                        { name: "Room2", url: "https://meetn.com/room2-2" },
                        { name: "Room3", url: "https://meetn.com/room3-2" }
                      ].map(room => (
                        <button
                          key={room.name}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, url: room.url, assigned_room: room.name }))}
                          className={`text-[11px] px-3 py-1 rounded-lg border font-bold transition-all flex items-center gap-1.5 ${
                            formData.url === room.url || formData.assigned_room === room.name
                              ? "bg-[#ff2a5f] border-[#ff2a5f] text-white shadow-md shadow-[#ff2a5f]/30"
                              : "bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/20"
                          }`}
                        >
                          <Video size={11} /> {room.name}
                          <span className="text-[9px] opacity-70 font-normal">({room.url.replace("https://meetn.com/", "")})</span>
                        </button>
                      ))}
                    </div>
                    <p className="text-[11px] text-gray-500 mt-1">
                      Click &quot;⚡ Assign Meetn Room&quot; to auto-check collisions with a <strong>+60 min buffer</strong> and assign the next available room.
                    </p>
                  </div>

                  {/* Cover Artwork */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">
                      Webinar Cover Artwork / Thumbnail
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-14 rounded-xl bg-[#181a24] border border-white/10 overflow-hidden shrink-0 flex items-center justify-center">
                        {formData.cover_image_url ? (
                          <img src={formData.cover_image_url} alt="Cover Preview" className="w-full h-full object-cover" />
                        ) : (
                          <Tv size={22} className="text-gray-600" />
                        )}
                      </div>
                      <div className="flex-1 space-y-2">
                        <input
                          type="text"
                          placeholder="https://... or upload artwork below"
                          value={formData.cover_image_url}
                          onChange={(e) => setFormData({ ...formData, cover_image_url: e.target.value })}
                          className="w-full bg-[#181a24] border border-white/10 rounded-xl px-4 py-2 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-[#ff2a5f]"
                        />
                        <div className="flex items-center gap-3">
                          <label className="cursor-pointer text-xs font-bold text-white bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-lg border border-white/10 transition-colors inline-flex items-center gap-1.5">
                            {uploadingCover ? <Loader2 size={12} className="animate-spin" /> : <Tv size={12} />}
                            {uploadingCover ? "Uploading..." : "Upload Image File"}
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              disabled={uploadingCover}
                              onChange={handleFileUpload}
                            />
                          </label>
                          <span className="text-[11px] text-gray-500">16:9 ratio recommended</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Summary */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                      Short Summary / Excerpt *
                    </label>
                    <textarea
                      rows={2}
                      required
                      placeholder="A concise, high-impact synopsis of what attendees will learn in this session..."
                      value={formData.summary}
                      onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                      className="w-full bg-[#181a24] border border-white/10 rounded-xl p-3 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-[#ff2a5f]"
                    />
                  </div>

                  {/* Full Agenda */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                      Full Agenda & Learning Objectives (Markdown Supported)
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Outline the detailed schedule, discussion points, key takeaways, and speaker bios..."
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      className="w-full bg-[#181a24] border border-white/10 rounded-xl p-3 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-[#ff2a5f] font-mono"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-[#ff2a5f] to-rose-600 hover:from-[#e02553] hover:to-rose-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-[#ff2a5f]/25 flex items-center justify-center gap-2 text-sm transition-all active:scale-[0.99] disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={16} className="animate-spin" /> Submitting Webinar...
                        </>
                      ) : (
                        <>
                          <MonitorPlay size={16} /> Submit Webinar for Review
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
