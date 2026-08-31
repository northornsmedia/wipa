'use client';

import { DotmCircular7 } from '@/components/ui/dotm-circular-7';
import { useState, useEffect, useRef, Fragment } from 'react';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/store/useAppStore';
import { 
  Search, UserPlus, MapPin, Briefcase, Mail, ArrowLeft, UsersRound,
  Hash, BellOff, ArrowUpRight, Circle, CheckCircle2, LayoutGrid,
  ThumbsUp, MessageSquare, BookOpen, Calendar, FileText, GraduationCap,
  Users, Navigation, ChevronDown, X, SlidersHorizontal, Sparkles, Check, Globe, Award
} from 'lucide-react';
import Link from 'next/link';
import AdSlot from '@/components/AdSlot';

type Profile = {
  id: string;
  full_name: string;
  avatar_url: string;
  cover_url?: string;
  role?: string;
  location?: string;
  country?: string;
  practice_area?: string;
  company?: string;
  is_wipa_recommended?: boolean;
  type?: 'user' | 'business';
  slug?: string;
};

const NEED_OPTIONS = [
  { value: '', label: 'All Categories & Roles', icon: Users, badge: 'All' },
  { value: 'IP Associations members', label: 'IP Associations members', icon: UsersRound, badge: 'Association' },
  { value: 'IP Attorneys', label: 'IP Attorneys', icon: Briefcase, badge: 'Attorney' },
  { value: 'IP Organisations', label: 'IP Organisations', icon: LayoutGrid, badge: 'Organisation' },
  { value: 'IP Service providers', label: 'IP Service providers', icon: Sparkles, badge: 'Service Provider' }
];

const ASSOCIATION_SUBCATEGORIES = [
  { value: '', label: 'All', icon: Globe },
  { value: '1st deputy reporter', label: '1st deputy reporter', icon: FileText },
  { value: '1st Deputy Sec General', label: '1st Deputy Sec General', icon: Award },
  { value: '2nd deputy reporter', label: '2nd deputy reporter', icon: FileText },
  { value: '2nd Deputy Sec General', label: '2nd Deputy Sec General', icon: Award },
  { value: 'Branding Strategy', label: 'Branding Strategy', icon: Sparkles },
  { value: 'CEO', label: 'CEO', icon: Briefcase },
  { value: 'Emerging Technologies', label: 'Emerging Technologies', icon: Sparkles },
  { value: 'First vice president', label: 'First vice president', icon: GraduationCap },
  { value: 'General reporter', label: 'General reporter', icon: FileText },
  { value: 'General secretariat', label: 'General secretariat', icon: LayoutGrid },
  { value: 'Internet Governance', label: 'Internet Governance', icon: Globe },
  { value: 'President', label: 'President', icon: CheckCircle2 },
  { value: 'Second vice president', label: 'Second vice president', icon: GraduationCap },
  { value: 'Secretary-General', label: 'Secretary-General', icon: Award },
  { value: 'Social Media Handles and Domain Conflicts', label: 'Social Media Handles and Domain Conflicts', icon: BookOpen }
];

const ATTORNEY_SUBCATEGORIES = [
  { value: '', label: 'All', icon: Globe },
  { value: 'Account Manager', label: 'Account Manager', icon: Users },
  { value: 'Associate', label: 'Associate', icon: Briefcase },
  { value: 'Biotech', label: 'Biotech', icon: Sparkles },
  { value: 'Brand protection', label: 'Brand protection', icon: CheckCircle2 },
  { value: 'Cancellation application', label: 'Cancellation application', icon: FileText },
  { value: 'Cease & Desits', label: 'Cease & Desits', icon: FileText },
  { value: 'Certificates', label: 'Certificates', icon: Award },
  { value: 'Circuit layouts', label: 'Circuit layouts', icon: LayoutGrid },
  { value: 'Compliance', label: 'Compliance', icon: CheckCircle2 },
  { value: 'Consumer brands', label: 'Consumer brands', icon: Sparkles },
  { value: 'Contracts', label: 'Contracts', icon: FileText },
  { value: 'Copyright', label: 'Copyright', icon: BookOpen },
  { value: 'Copyright Protections', label: 'Copyright Protections', icon: BookOpen },
  { value: 'Copyright service', label: 'Copyright service', icon: BookOpen },
  { value: 'Counseling', label: 'Counseling', icon: UsersRound },
  { value: 'Counterfeit', label: 'Counterfeit', icon: Sparkles },
  { value: 'Cybersquatting', label: 'Cybersquatting', icon: Globe },
  { value: 'Data protection', label: 'Data protection', icon: Sparkles },
  { value: 'Doc Management', label: 'Doc Management', icon: FileText },
  { value: 'Domain Management', label: 'Domain Management', icon: Globe },
  { value: 'Domain Name Disputes', label: 'Domain Name Disputes', icon: Globe },
  { value: 'Domain Name in Mergers and Acquisitions', label: 'Domain Name in Mergers and Acquisitions', icon: Globe },
  { value: 'Domain registration', label: 'Domain registration', icon: Globe },
  { value: 'Drafting', label: 'Drafting', icon: FileText },
  { value: 'Ecommerce', label: 'Ecommerce', icon: LayoutGrid },
  { value: 'Enforcement', label: 'Enforcement', icon: ArrowUpRight },
  { value: 'Enforcement of Rights', label: 'Enforcement of Rights', icon: ArrowUpRight },
  { value: 'Foreign Associates', label: 'Foreign Associates', icon: Globe },
  { value: 'Founder & CEO', label: 'Founder & CEO', icon: Briefcase },
  { value: 'Franchise', label: 'Franchise', icon: Briefcase },
  { value: 'Freedom to operate', label: 'Freedom to operate', icon: CheckCircle2 },
  { value: 'Industrial design', label: 'Industrial design', icon: LayoutGrid },
  { value: 'Innovation', label: 'Innovation', icon: Sparkles },
  { value: 'Int registrations', label: 'Int registrations', icon: Globe },
  { value: 'Invoicing services', label: 'Invoicing services', icon: FileText },
  { value: 'IP Dispute', label: 'IP Dispute', icon: ArrowUpRight },
  { value: 'IP Landscape', label: 'IP Landscape', icon: Sparkles },
  { value: 'IP Management', label: 'IP Management', icon: Briefcase },
  { value: 'IP Tech', label: 'IP Tech', icon: Sparkles },
  { value: 'Jurisdiction-Specific Expertise', label: 'Jurisdiction-Specific Expertise', icon: Globe },
  { value: 'Legal advice', label: 'Legal advice', icon: BookOpen },
  { value: 'Licensing', label: 'Licensing', icon: Briefcase },
  { value: 'Litigation', label: 'Litigation', icon: ArrowUpRight },
  { value: 'Litigators', label: 'Litigators', icon: ArrowUpRight },
  { value: 'Local Counsel', label: 'Local Counsel', icon: UsersRound },
  { value: 'Managing disputes', label: 'Managing disputes', icon: ArrowUpRight },
  { value: 'Mechanical Eng', label: 'Mechanical Eng', icon: LayoutGrid },
  { value: 'New Tech', label: 'New Tech', icon: Sparkles },
  { value: 'Opposition Counsel', label: 'Opposition Counsel', icon: Briefcase },
  { value: 'Partner', label: 'Partner', icon: GraduationCap },
  { value: 'Pat Applications', label: 'Pat Applications', icon: FileText },
  { value: 'Pat Filing', label: 'Pat Filing', icon: FileText },
  { value: 'Pat Prosecution', label: 'Pat Prosecution', icon: FileText },
  { value: 'Patent', label: 'Patent', icon: FileText },
  { value: 'Patent Appeals', label: 'Patent Appeals', icon: ArrowUpRight },
  { value: 'Patent Search', label: 'Patent Search', icon: Search },
  { value: 'Patent service', label: 'Patent service', icon: FileText },
  { value: 'Pharma', label: 'Pharma', icon: GraduationCap },
  { value: 'Plant Varieties', label: 'Plant Varieties', icon: Sparkles },
  { value: 'Pre-litigation', label: 'Pre-litigation', icon: ArrowUpRight },
  { value: 'Privacy and Proxy Services', label: 'Privacy and Proxy Services', icon: CheckCircle2 },
  { value: 'Recruitment', label: 'Recruitment', icon: Users },
  { value: 'Registered designs', label: 'Registered designs', icon: LayoutGrid },
  { value: 'Registry docs', label: 'Registry docs', icon: FileText },
  { value: 'Renewals', label: 'Renewals', icon: CheckCircle2 },
  { value: 'Right to privacy', label: 'Right to privacy', icon: CheckCircle2 },
  { value: 'semiconductor topography rights', label: 'semiconductor topography rights', icon: LayoutGrid },
  { value: 'Senior Partner', label: 'Senior Partner', icon: GraduationCap },
  { value: 'Software', label: 'Software', icon: Sparkles },
  { value: 'Surveillance', label: 'Surveillance', icon: Search },
  { value: 'Tech and innovation', label: 'Tech and innovation', icon: Sparkles },
  { value: 'TM Applications', label: 'TM Applications', icon: CheckCircle2 },
  { value: 'TM Filing', label: 'TM Filing', icon: CheckCircle2 },
  { value: 'TM Maintenance', label: 'TM Maintenance', icon: CheckCircle2 },
  { value: 'TM Management', label: 'TM Management', icon: CheckCircle2 },
  { value: 'TM Prosecution', label: 'TM Prosecution', icon: CheckCircle2 },
  { value: 'TM Renewals', label: 'TM Renewals', icon: CheckCircle2 },
  { value: 'Trade secrets', label: 'Trade secrets', icon: Sparkles },
  { value: 'Trademark', label: 'Trademark', icon: CheckCircle2 },
  { value: 'Trademark search', label: 'Trademark search', icon: Search },
  { value: 'Trademark service', label: 'Trademark service', icon: CheckCircle2 },
  { value: 'Unfair competition', label: 'Unfair competition', icon: ArrowUpRight },
  { value: 'Utility Models', label: 'Utility Models', icon: FileText },
  { value: 'Watch service', label: 'Watch service', icon: Search }
];

const ORGANISATION_SUBCATEGORIES = [
  { value: '', label: 'All', icon: Globe },
  { value: '1st deputy reporter', label: '1st deputy reporter', icon: FileText },
  { value: '1st Deputy Sec General', label: '1st Deputy Sec General', icon: Award },
  { value: '2nd deputy reporter', label: '2nd deputy reporter', icon: FileText },
  { value: '2nd Deputy Sec General', label: '2nd Deputy Sec General', icon: Award },
  { value: 'CEO', label: 'CEO', icon: Briefcase },
  { value: 'Country Code Top-Level Domains', label: 'Country Code Top-Level Domains', icon: Globe },
  { value: 'First vice president', label: 'First vice president', icon: GraduationCap },
  { value: 'General reporter', label: 'General reporter', icon: FileText },
  { value: 'General secretariat', label: 'General secretariat', icon: LayoutGrid },
  { value: 'Governance and Dispute Resolution Frameworks', label: 'Governance and Dispute Resolution Frameworks', icon: ArrowUpRight },
  { value: 'Internationalised Domain Names', label: 'Internationalised Domain Names', icon: Globe },
  { value: 'President', label: 'President', icon: CheckCircle2 },
  { value: 'Second vice president', label: 'Second vice president', icon: GraduationCap },
  { value: 'Secretary-General', label: 'Secretary-General', icon: Award }
];

const DEFAULT_SPECIALTY_OPTIONS = [
  { value: '', label: 'Select Sub-Category (All)', icon: Globe },
  { value: 'Patents', label: 'Patents & Inventions', icon: FileText },
  { value: 'Trademarks', label: 'Trademarks & Brand Protection', icon: CheckCircle2 },
  { value: 'Copyright', label: 'Copyright & Digital Media', icon: BookOpen },
  { value: 'Litigation', label: 'Litigation & Dispute Resolution', icon: ArrowUpRight },
  { value: 'Licensing', label: 'Licensing & Commercial Deals', icon: Briefcase },
  { value: 'Trade Secrets', label: 'Trade Secrets & Data Rights', icon: Sparkles },
  { value: 'AI', label: 'AI & DeepTech IP', icon: Sparkles },
  { value: 'Pharma', label: 'Life Sciences & Pharma', icon: GraduationCap },
  { value: 'Design', label: 'Design Rights & Trade Dress', icon: LayoutGrid }
];

function getSpecialtyOptions(needCategory: string) {
  if (needCategory === 'IP Associations members') return ASSOCIATION_SUBCATEGORIES;
  if (needCategory === 'IP Attorneys' || needCategory === 'IP Service providers') return ATTORNEY_SUBCATEGORIES;
  if (needCategory === 'IP Organisations') return ORGANISATION_SUBCATEGORIES;
  return DEFAULT_SPECIALTY_OPTIONS;
}

export default function MembersDirectoryPage() {
  const { user } = useAppStore();
  const [members, setMembers] = useState<Profile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [needCategory, setNeedCategory] = useState('IP Service providers');
  const [specialty, setSpecialty] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [connectionStatuses, setConnectionStatuses] = useState<Record<string, 'pending' | 'accepted' | 'none'>>({});
  const [followStatuses, setFollowStatuses] = useState<Record<string, boolean>>({});
  const [isConnecting, setIsConnecting] = useState<Record<string, boolean>>({});
  const [isFollowingMap, setIsFollowingMap] = useState<Record<string, boolean>>({});
  const [filter, setFilter] = useState<'all' | 'recommended'>('all');

  const [needOpen, setNeedOpen] = useState(false);
  const [specOpen, setSpecOpen] = useState(false);
  const [needFilterText, setNeedFilterText] = useState('');
  const [specFilterText, setSpecFilterText] = useState('');
  const needRef = useRef<HTMLDivElement>(null);
  const specRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (needRef.current && !needRef.current.contains(event.target as Node)) {
        setNeedOpen(false);
      }
      if (specRef.current && !specRef.current.contains(event.target as Node)) {
        setSpecOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    let query = supabase.from('profiles').select('*').limit(60);
    
    if (searchQuery.trim() !== '') {
      query = query.or(`full_name.ilike.%${searchQuery}%,bio.ilike.%${searchQuery}%,role.ilike.%${searchQuery}%,practice_area.ilike.%${searchQuery}%,company.ilike.%${searchQuery}%`);
    }

    if (needCategory && needCategory !== 'All') {
      if (needCategory === 'IP Attorneys') {
        query = query.or(`role.ilike.%attorney%,role.ilike.%lawyer%,role.ilike.%counsel%,role.ilike.%patent%,role.ilike.%trademark%,practice_area.ilike.%attorney%`);
      } else if (needCategory === 'IP Associations members') {
        query = query.or(`role.ilike.%association%,role.ilike.%member%,practice_area.ilike.%association%,company.ilike.%association%`);
      } else if (needCategory === 'IP Organisations') {
        query = query.or(`company.ilike.%org%,company.ilike.%institute%,company.ilike.%firm%,role.ilike.%organisation%,role.ilike.%organization%`);
      } else if (needCategory === 'IP Service providers') {
        query = query.or(`role.ilike.%service%,role.ilike.%provider%,company.ilike.%service%,practice_area.ilike.%service%`);
      } else {
        query = query.or(`role.ilike.%${needCategory}%,company.ilike.%${needCategory}%,practice_area.ilike.%${needCategory}%`);
      }
    }

    if (specialty && specialty !== 'All') {
      query = query.or(`practice_area.ilike.%${specialty}%,skills.ilike.%${specialty}%,role.ilike.%${specialty}%,company.ilike.%${specialty}%,bio.ilike.%${specialty}%`);
    }

    if (locationQuery.trim() !== '') {
      query = query.or(`country.ilike.%${locationQuery}%,location.ilike.%${locationQuery}%`);
    }

    // Filter by full_name to safely exclude the current user.
    if (user?.name) {
      query = query.neq('full_name', user.name);
    }

    if (filter === 'recommended') {
      query = query.eq('is_wipa_recommended', true);
    } else {
      // Sort recommended members first when showing all
      query = query.order('is_wipa_recommended', { ascending: false, nullsFirst: false });
    }

    const { data, error } = await query;
    
    if (error) {
      console.error("Supabase Error fetching members:", error);
    }
    
    if (!error && data) {
      let combined = data.map(d => ({
        ...d, 
        location: d.country || d.location,
        type: 'user'
      })) as any[];
      
      // Also fetch business profiles matching search & filters
      let bizQuery = supabase.from('business_profiles').select('*').limit(15);
      if (searchQuery.trim() !== '') {
        bizQuery = bizQuery.ilike('name', `%${searchQuery}%`);
      }
      if (locationQuery.trim() !== '') {
        bizQuery = bizQuery.ilike('headquarters', `%${locationQuery}%`);
      }
      if (specialty && specialty !== 'All') {
        bizQuery = bizQuery.ilike('practice_areas', `%${specialty}%`);
      }
      if (needCategory === 'IP Service providers') {
        bizQuery = bizQuery.or(`type.eq.service_provider,type.eq.ip_firm`);
      } else if (needCategory === 'IP Organisations') {
        bizQuery = bizQuery.or(`type.eq.corporate,type.eq.ip_firm`);
      }

      const { data: businessData } = await bizQuery;
      if (businessData) {
        const mappedBiz = businessData.map(b => ({
          id: b.id,
          full_name: b.name,
          avatar_url: b.logo_url,
          cover_url: b.cover_image_url,
          role: b.type?.replace('_', ' '),
          location: b.headquarters,
          is_wipa_recommended: b.is_verified,
          type: 'business',
          slug: b.slug
        }));
        combined = [...mappedBiz, ...combined];
      }
      
      setMembers(combined);
      
      // Fetch connections & follows involving this user
      if (user?.id && data.length > 0) {
        const [connRes, followRes] = await Promise.all([
          supabase
            .from('connections')
            .select('*')
            .or(`requester_id.eq.${user.id},recipient_id.eq.${user.id}`),
          supabase
            .from('follows')
            .select('following_id')
            .eq('follower_id', user.id)
        ]);
          
        if (connRes.data) {
          const statuses: Record<string, 'pending' | 'accepted' | 'none'> = {};
          connRes.data.forEach(conn => {
            const otherId = conn.requester_id === user.id ? conn.recipient_id : conn.requester_id;
            statuses[otherId] = conn.status;
          });
          setConnectionStatuses(statuses);
        }

        if (followRes.data) {
          const fStatuses: Record<string, boolean> = {};
          followRes.data.forEach(f => {
            fStatuses[f.following_id] = true;
          });
          setFollowStatuses(fStatuses);
        }
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    const delay = setTimeout(fetchMembers, 300);
    return () => clearTimeout(delay);
  }, [searchQuery, needCategory, specialty, locationQuery, user?.id, filter]);

  // Listen for realtime updates to connection statuses globally
  useEffect(() => {
    if (!user?.id) return;
    
    const channel = supabase.channel(`members-connections-${user.id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'connections',
      }, (payload) => {
        if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
          const row = payload.new as any;
          if (row.requester_id === user.id || row.recipient_id === user.id) {
            const otherId = row.requester_id === user.id ? row.recipient_id : row.requester_id;
            setConnectionStatuses(prev => ({ ...prev, [otherId]: row.status }));
          }
        } else if (payload.eventType === 'DELETE') {
          const row = payload.old as any;
          if (row.requester_id === user.id || row.recipient_id === user.id) {
            const otherId = row.requester_id === user.id ? row.recipient_id : row.requester_id;
            setConnectionStatuses(prev => {
              const next = { ...prev };
              delete next[otherId];
              return next;
            });
          }
        }
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  const handleConnect = async (targetId: string) => {
    if (!user?.id || isConnecting[targetId]) return;
    setIsConnecting(prev => ({ ...prev, [targetId]: true }));
    try {
      const { error: connError } = await supabase.from('connections').insert({
        requester_id: user.id,
        recipient_id: targetId,
        status: 'pending'
      });
      
      if (!connError) {
        await supabase.from('notifications').insert({
          user_id: targetId,
          actor_id: user.id,
          type: 'connection_request',
          content: `${user.name || 'Someone'} sent you a connection request!`,
          link: `/platform/profile/${user.id}`,
          is_read: false
        });
        setConnectionStatuses(prev => ({ ...prev, [targetId]: 'pending' }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsConnecting(prev => ({ ...prev, [targetId]: false }));
    }
  };

  const handleToggleFollow = async (targetId: string) => {
    if (!user?.id || isFollowingMap[targetId]) return;
    setIsFollowingMap(prev => ({ ...prev, [targetId]: true }));
    const isCurrentlyFollowing = Boolean(followStatuses[targetId]);

    try {
      if (isCurrentlyFollowing) {
        await supabase
          .from('follows')
          .delete()
          .eq('follower_id', user.id)
          .eq('following_id', targetId);
        setFollowStatuses(prev => ({ ...prev, [targetId]: false }));
      } else {
        await supabase
          .from('follows')
          .insert({
            follower_id: user.id,
            following_id: targetId
          });
        await supabase.from('notifications').insert({
          user_id: targetId,
          actor_id: user.id,
          type: 'new_follower',
          content: `${user.name || 'Someone'} started following you!`,
          link: `/platform/profile/${user.id}`,
          is_read: false
        });
        setFollowStatuses(prev => ({ ...prev, [targetId]: true }));
      }
    } catch (err) {
      console.error("Failed to toggle follow:", err);
    } finally {
      setIsFollowingMap(prev => ({ ...prev, [targetId]: false }));
    }
  };

  return (
    <div className="w-full bg-[#f8f9fa] dark:bg-[#0f172a] font-sans flex flex-col h-[calc(100vh-73px)] overflow-hidden">
  <div className="w-full flex flex-col flex-1 overflow-hidden">
    <div className="flex flex-1 overflow-hidden">
        {/* MAIN CONTENT AREA */}

        {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 no-scrollbar">
        <div className="max-w-6xl mx-auto space-y-6 pb-20">
          {/* Hero Section */}
          <div className="relative rounded-[2.5rem] bg-gradient-to-br from-[#f0ebff] via-[#f8f9fa] to-white dark:from-[#1e1b4b]/40 dark:via-[#0f172a] dark:to-[#0f172a] border border-gray-100 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-8 z-20">
            
            {/* Abstract Background Shapes (isolated in overflow-hidden container) */}
            <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden pointer-events-none">
              <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 rounded-full bg-gradient-to-br from-[#5a32fa]/10 to-[#ff90e8]/10 blur-3xl mix-blend-multiply dark:mix-blend-screen" />
              <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-60 h-60 rounded-full bg-gradient-to-tr from-[#00d26a]/10 to-[#ffc900]/10 blur-3xl mix-blend-multiply dark:mix-blend-screen" />
            </div>
            
            <div className="relative p-8 md:p-12 lg:p-16 flex flex-col items-center text-center">

              
              <h1 className="font-black text-4xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-[#131313] dark:from-white via-[#5a32fa] to-[#ff90e8] tracking-tight mb-4 mt-8 md:mt-0">
                Members Directory
              </h1>
              <p className="text-gray-500 dark:text-gray-400 font-medium text-lg max-w-lg mb-10">
                Discover, connect, and collaborate with brilliant minds across the global platform.
              </p>
              
              {/* ================= PREMIUM WIPA-THEMED DIRECTORY FILTER BAR ================= */}
              <div className="w-full max-w-5xl text-left mt-2 relative z-30">
                <div className="relative group/filter">
                  {/* Subtle Ambient Glow matching page theme */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#5a32fa]/25 via-[#ff90e8]/20 to-[#00d26a]/20 rounded-[2rem] blur-xl opacity-75 group-hover/filter:opacity-100 transition duration-700 pointer-events-none" />
                  
                  <div className="relative bg-white/90 dark:bg-[#11162b]/95 backdrop-blur-2xl rounded-2xl md:rounded-[1.75rem] border border-purple-200/70 dark:border-purple-500/20 p-4 sm:p-5 md:p-6 shadow-[0_20px_50px_rgba(90,50,250,0.08)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.7)] transition-all">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3.5 sm:gap-4 items-end">
                      
                      {/* 1. What do you need: (Custom Animated Dropdown) */}
                      <div className={`lg:col-span-4 space-y-1.5 relative ${needOpen ? 'z-50' : 'z-20'}`} ref={needRef}>
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-200 tracking-wide flex items-center gap-1.5">
                          <Briefcase size={13} className="text-[#5a32fa]" />
                          <span>What do you need:</span>
                        </label>
                        
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => { setNeedOpen(!needOpen); setSpecOpen(false); }}
                            className={`w-full bg-white dark:bg-[#182038] text-left text-xs sm:text-sm font-medium py-3 px-3.5 pr-8 rounded-xl border transition-all duration-200 flex items-center justify-between cursor-pointer shadow-sm ${
                              needOpen 
                                ? 'border-[#5a32fa] ring-2 ring-[#5a32fa]/20 shadow-md' 
                                : 'border-gray-200 dark:border-white/10 hover:border-purple-300 dark:hover:border-purple-500/50'
                            }`}
                          >
                            <span className="truncate text-gray-800 dark:text-gray-100 font-semibold">
                              {NEED_OPTIONS.find(o => o.value === needCategory)?.label || 'IP Service providers'}
                            </span>
                            <div className="flex items-center gap-1">
                              {needCategory && (
                                <span
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setNeedCategory('');
                                  }}
                                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-full transition-colors"
                                >
                                  <X size={13} />
                                </span>
                              )}
                              <ChevronDown 
                                size={15} 
                                className={`text-gray-400 transition-transform duration-200 ${needOpen ? 'rotate-180 text-[#5a32fa]' : ''}`} 
                              />
                            </div>
                          </button>

                          {/* Animated Dropdown Menu with Search */}
                          {needOpen && (
                            <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-[#161c33] backdrop-blur-2xl border border-purple-200/80 dark:border-purple-500/30 rounded-2xl p-2 shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-50 animate-in fade-in zoom-in-95 duration-150">
                              {/* Mini Search Filter inside popup */}
                              <div className="relative mb-2 px-1">
                                <input
                                  type="text"
                                  value={needFilterText}
                                  onChange={(e) => setNeedFilterText(e.target.value)}
                                  placeholder="Search categories..."
                                  className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 pr-8 text-xs text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-[#5a32fa] focus:ring-1 focus:ring-[#5a32fa]"
                                  autoFocus
                                />
                                <Search size={13} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                              </div>

                              <div className="max-h-60 overflow-y-auto no-scrollbar space-y-0.5">
                                {NEED_OPTIONS.filter(o => o.label.toLowerCase().includes(needFilterText.toLowerCase())).map((opt) => {
                                  const IconComp = opt.icon;
                                  const isSelected = needCategory === opt.value;
                                  return (
                                    <button
                                      key={opt.value || 'all'}
                                      type="button"
                                      onClick={() => {
                                        setNeedCategory(opt.value);
                                        setSpecialty('');
                                        setNeedOpen(false);
                                        setNeedFilterText('');
                                      }}
                                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                                        isSelected
                                          ? 'bg-purple-100/80 dark:bg-purple-900/40 text-[#5a32fa] dark:text-purple-300 font-bold'
                                          : 'text-gray-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-white/5 hover:text-[#5a32fa] dark:hover:text-purple-300'
                                      }`}
                                    >
                                      <div className="flex items-center gap-2.5 truncate">
                                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${isSelected ? 'bg-[#5a32fa] text-white' : 'bg-purple-50 dark:bg-purple-950/50 text-[#5a32fa]'}`}>
                                          <IconComp size={13} />
                                        </div>
                                        <span className="truncate">{opt.label}</span>
                                      </div>
                                      {isSelected && <Check size={14} className="text-[#5a32fa] shrink-0 ml-2" />}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* 2. Specialising in: (Custom Animated Dropdown) */}
                      <div className={`lg:col-span-3 space-y-1.5 relative ${specOpen ? 'z-50' : 'z-20'}`} ref={specRef}>
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-200 tracking-wide flex items-center gap-1.5">
                          <Sparkles size={13} className="text-[#ff90e8]" />
                          <span>Specialising in:</span>
                        </label>
                        
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => { setSpecOpen(!specOpen); setNeedOpen(false); }}
                            className={`w-full bg-white dark:bg-[#182038] text-left text-xs sm:text-sm font-medium py-3 px-3.5 pr-8 rounded-xl border transition-all duration-200 flex items-center justify-between cursor-pointer shadow-sm ${
                              specOpen 
                                ? 'border-[#5a32fa] ring-2 ring-[#5a32fa]/20 shadow-md' 
                                : 'border-gray-200 dark:border-white/10 hover:border-purple-300 dark:hover:border-purple-500/50'
                            }`}
                          >
                            <span className="truncate text-gray-800 dark:text-gray-100 font-semibold">
                              {getSpecialtyOptions(needCategory).find(o => o.value === specialty)?.label || (needCategory ? 'All' : 'Select Sub-Category')}
                            </span>
                            <div className="flex items-center gap-1">
                              {specialty && (
                                <span
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSpecialty('');
                                  }}
                                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-full transition-colors"
                                >
                                  <X size={13} />
                                </span>
                              )}
                              <ChevronDown 
                                size={15} 
                                className={`text-gray-400 transition-transform duration-200 ${specOpen ? 'rotate-180 text-[#5a32fa]' : ''}`} 
                              />
                            </div>
                          </button>

                          {/* Animated Dropdown Menu with Search */}
                          {specOpen && (
                            <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-[#161c33] backdrop-blur-2xl border border-purple-200/80 dark:border-purple-500/30 rounded-2xl p-2 shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-50 animate-in fade-in zoom-in-95 duration-150">
                              {/* Mini Search Filter inside popup */}
                              <div className="relative mb-2 px-1">
                                <input
                                  type="text"
                                  value={specFilterText}
                                  onChange={(e) => setSpecFilterText(e.target.value)}
                                  placeholder="Search specialities..."
                                  className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 pr-8 text-xs text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-[#5a32fa] focus:ring-1 focus:ring-[#5a32fa]"
                                  autoFocus
                                />
                                <Search size={13} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                              </div>

                              <div className="max-h-60 overflow-y-auto no-scrollbar space-y-0.5">
                                {getSpecialtyOptions(needCategory)
                                  .filter(o => o.label.toLowerCase().includes(specFilterText.toLowerCase()))
                                  .map((opt) => {
                                    const IconComp = opt.icon;
                                    const isSelected = specialty === opt.value;
                                    return (
                                      <button
                                        key={opt.value || 'all'}
                                        type="button"
                                        onClick={() => {
                                          setSpecialty(opt.value);
                                          setSpecOpen(false);
                                          setSpecFilterText('');
                                        }}
                                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                                          isSelected
                                            ? 'bg-purple-100/80 dark:bg-purple-900/40 text-[#5a32fa] dark:text-purple-300 font-bold'
                                            : 'text-gray-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-white/5 hover:text-[#5a32fa] dark:hover:text-purple-300'
                                        }`}
                                      >
                                        <div className="flex items-center gap-2.5 truncate">
                                          <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${isSelected ? 'bg-[#5a32fa] text-white' : 'bg-purple-50 dark:bg-purple-950/50 text-[#5a32fa]'}`}>
                                            <IconComp size={13} />
                                          </div>
                                          <span className="truncate">{opt.label}</span>
                                        </div>
                                        {isSelected && <Check size={14} className="text-[#5a32fa] shrink-0 ml-2" />}
                                      </button>
                                    );
                                  })}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* 3. Search by location: */}
                      <div className="lg:col-span-3 space-y-1.5">
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-200 tracking-wide flex items-center gap-1.5">
                          <MapPin size={13} className="text-[#00d26a]" />
                          <span>Search by location:</span>
                        </label>
                        <div className="relative flex items-center bg-white dark:bg-[#182038] rounded-xl border border-gray-200 dark:border-white/10 shadow-sm overflow-hidden focus-within:ring-2 focus-within:ring-[#5a32fa]/30 focus-within:border-[#5a32fa] transition-all">
                          <div className="bg-purple-50 dark:bg-purple-950/40 px-3 py-3 text-slate-500 border-r border-gray-100 dark:border-white/10 shrink-0 flex items-center justify-center">
                            <Navigation size={14} className="rotate-45 text-[#5a32fa] fill-current" />
                          </div>
                          <input
                            type="text"
                            value={locationQuery}
                            onChange={(e) => setLocationQuery(e.target.value)}
                            placeholder="City or Post Code"
                            className="w-full bg-transparent py-2.5 px-3 text-xs sm:text-sm font-semibold text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none"
                          />
                          {locationQuery && (
                            <button
                              type="button"
                              onClick={() => setLocationQuery('')}
                              className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors"
                            >
                              <X size={14} />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* 4. Search Now Action Button (WIPA Vibrant Gradient) */}
                      <div className="lg:col-span-2">
                        <button
                          type="button"
                          onClick={fetchMembers}
                          className="w-full bg-gradient-to-r from-[#5a32fa] via-[#7c3aed] to-[#ff90e8] hover:from-[#4c28db] hover:to-[#f472b6] active:scale-[0.97] text-white font-bold text-xs sm:text-sm py-3 px-4 rounded-xl shadow-lg shadow-purple-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer h-[46px] group"
                        >
                          <Search size={15} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" />
                          <span>Search Now</span>
                        </button>
                      </div>

                    </div>

                    {/* Fast live keyword search & active filter pill reset bar */}
                    <div className="mt-4 pt-3.5 border-t border-purple-100 dark:border-white/10 flex flex-wrap items-center gap-2.5 text-xs">
                      <div className="relative flex-1 min-w-[200px] max-w-md">
                        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Instant search by name, firm, or bio..."
                          className="w-full bg-gray-50 dark:bg-[#182038]/80 text-gray-900 dark:text-white placeholder-gray-400 text-xs rounded-xl pl-8 pr-7 py-2 border border-gray-200 dark:border-white/10 focus:outline-none focus:border-[#5a32fa] focus:ring-1 focus:ring-[#5a32fa] transition-all"
                        />
                        {searchQuery && (
                          <button
                            type="button"
                            onClick={() => setSearchQuery('')}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 dark:hover:text-white"
                          >
                            <X size={12} />
                          </button>
                        )}
                      </div>

                      {(needCategory || specialty || locationQuery || searchQuery) && (
                        <button
                          onClick={() => {
                            setNeedCategory('');
                            setSpecialty('');
                            setLocationQuery('');
                            setSearchQuery('');
                          }}
                          className="text-[#5a32fa] dark:text-purple-400 hover:underline ml-auto text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <X size={12} />
                          Reset All Filters
                        </button>
                      )}
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Filters Tab */}
          <div className="flex items-center gap-4 border-b border-gray-200 dark:border-white/10 mb-6">
            <button 
              onClick={() => setFilter('all')}
              className={`px-4 py-3 font-bold text-sm border-b-2 transition-colors ${filter === 'all' ? 'border-[#5a32fa] text-[#5a32fa]' : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
            >
              All Members
            </button>
            <button 
              onClick={() => setFilter('recommended')}
              className={`px-4 py-3 font-bold text-sm border-b-2 flex items-center gap-2 transition-colors ${filter === 'recommended' ? 'border-yellow-500 text-yellow-600 dark:text-yellow-400' : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
            >
              ⭐ WIPA Recommended
            </button>
          </div>

        {/* Members Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <DotmCircular7 size={40} className="text-[#6600FF]" />
          </div>
        ) : members.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map((member, index) => (
              <Fragment key={member.id}>
                <div className="bg-white dark:bg-[#0f172a] rounded-3xl border border-gray-200 dark:border-white/20 shadow-sm overflow-hidden flex flex-col transition-transform hover:-translate-y-1">
                <div 
                  className="h-24 bg-[#5a32fa]/10 border-b-2 border-gray-200 dark:border-white/20 relative bg-cover bg-center"
                  style={{ backgroundImage: member.cover_url ? `url(${member.cover_url})` : undefined }}
                >
                  <Link href={member.type === 'business' ? `/platform/business/${member.slug}` : `/platform/profile/${member.id}`}>
                    <div 
                      className="absolute -bottom-10 left-6 w-20 h-20 bg-white dark:bg-[#0f172a] rounded-2xl border border-gray-200 dark:border-white/20 shadow-sm flex items-center justify-center font-bold text-2xl overflow-hidden bg-cover bg-center cursor-pointer transition-transform hover:scale-105" 
                      style={{ 
                        color: ['#5a32fa', '#ff90e8', '#00d26a', '#ffc900'][Math.floor(Math.random() * 4)],
                        backgroundImage: member.avatar_url ? `url(${member.avatar_url})` : undefined 
                      }}
                    >
                      {!member.avatar_url && (member.full_name ? member.full_name.charAt(0).toUpperCase() : 'U')}
                    </div>
                  </Link>
                  {member.is_wipa_recommended && (
                    <div className="absolute -bottom-12 left-20 w-8 h-8 bg-gradient-to-br from-yellow-300 to-yellow-600 rounded-full border-2 border-white dark:border-[#0f172a] flex items-center justify-center shadow-lg z-10" title="WIPA Recommended">
                      <span className="text-white text-xs drop-shadow-md">⭐</span>
                    </div>
                  )}
                </div>
                
                <div className="p-6 pt-12 flex-1 flex flex-col">
                  <Link href={member.type === 'business' ? `/platform/business/${member.slug}` : `/platform/profile/${member.id}`}>
                    <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-1 line-clamp-1 hover:text-[#5a32fa] transition-colors cursor-pointer flex items-center gap-2">
                      {member.full_name || 'Anonymous User'}
                      {member.is_wipa_recommended && <span className="text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 px-2 py-0.5 rounded-full whitespace-nowrap">⭐ {member.type === 'business' ? 'Verified' : 'WIPA'}</span>}
                      {member.type === 'business' && <span className="text-[10px] bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full whitespace-nowrap uppercase tracking-wider">Business</span>}
                    </h3>
                  </Link>
                  <p className="text-[#5a32fa] font-bold text-sm mb-4 flex items-center gap-1">
                    <Briefcase size={14} /> {member.role || 'WIPA Member'}
                  </p>
                  
                  <div className="flex flex-col gap-2 mb-6 text-sm font-medium text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-2"><MapPin size={16} /> {member.location || 'Global'}</span>
                    {member.type !== 'business' && <span className="flex items-center gap-2"><Mail size={16} /> Message via platform</span>}
                  </div>
                  
                  {member.type !== 'business' && (
                    <div className="mt-auto flex flex-col gap-2">
                      <div className="flex gap-2">
                        {/* 1. Connect / Connected Message Action */}
                        {connectionStatuses[member.id] === 'accepted' ? (
                          <Link 
                            href={`/platform/messages?userId=${member.id}`}
                            className="flex-1 bg-[#5a32fa] text-white font-bold py-2.5 px-4 rounded-xl hover:bg-[#4a26d2] transition-all flex items-center justify-center gap-1.5 text-xs shadow-sm"
                          >
                            <MessageSquare size={16} /> Message
                          </Link>
                        ) : connectionStatuses[member.id] === 'pending' ? (
                          <button 
                            disabled
                            className="flex-1 bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400 font-bold py-2.5 px-4 rounded-xl border border-gray-200 dark:border-white/10 flex items-center justify-center gap-1.5 text-xs cursor-not-allowed"
                          >
                            <CheckCircle2 size={16} /> Pending
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleConnect(member.id)}
                            disabled={isConnecting[member.id]}
                            className="flex-1 bg-[#131313] dark:bg-white dark:text-black text-white font-bold py-2.5 px-4 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-all flex items-center justify-center gap-1.5 text-xs disabled:opacity-50"
                          >
                            <UserPlus size={16} /> {isConnecting[member.id] ? 'Sending...' : 'Connect'}
                          </button>
                        )}

                        {/* 2. Asymmetric 1-Way Follow / Following Action */}
                        <button
                          onClick={() => handleToggleFollow(member.id)}
                          disabled={isFollowingMap[member.id]}
                          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all border shrink-0 ${
                            followStatuses[member.id]
                              ? 'bg-[#5a32fa]/10 text-[#5a32fa] dark:text-[#a855f7] border-[#5a32fa]/30 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-300'
                              : 'bg-gray-50 dark:bg-white/5 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-white/10 hover:border-[#5a32fa] hover:text-[#5a32fa]'
                          }`}
                        >
                          <Users size={15} />
                          <span>{followStatuses[member.id] ? 'Following' : 'Follow'}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              </Fragment>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-[#0f172a] rounded-3xl border border-gray-200 dark:border-white/20 shadow-sm">
            <UsersRound size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No members found</h3>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Try adjusting your search query to find who you're looking for.</p>
          </div>
        )}
        </div>
      </main>

{/* FIXED RIGHT SIDEBAR */}
      <aside className="w-[300px] hidden xl:flex flex-col shrink-0 space-y-6 pt-6 overflow-y-auto no-scrollbar pb-10 pr-4 md:pr-8 lg:pr-12">
        <div className="h-full flex flex-col gap-6">
          
          {/* DYNAMIC AD SPACE */}
          <AdSlot slotId="members_sidebar" />

          {/* Active Groups */}
          <div className="bg-white dark:bg-[#0f172a] p-4 rounded-2xl border border-gray-200 dark:border-white/20 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-[15px] text-gray-900 dark:text-white">Active Groups</h3>
              <button className="text-xs font-bold text-[#5a32fa] hover:underline">See all</button>
            </div>
            <div className="space-y-4">
              {[
                { name: 'Trade Marks', members: '1,345', icon: '©️', color: '#b892ff' },
                { name: 'Women in Leadership', members: '897', icon: '👩‍💼', color: '#ff90e8' },
                { name: 'Artificial Intelligence', members: '1,105', icon: '🤖', color: '#5a32fa' },
                { name: 'Patent Law', members: '1,245', icon: '📜', color: '#5a32fa' },
                { name: 'Start-ups & Innovation', members: '764', icon: '🚀', color: '#ffc900' }
              ].map((group, i) => (
                <div key={i} className="flex items-center gap-3 cursor-pointer group">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg border-2 border-transparent group-hover:border-gray-200 dark:border-white/20 transition-all" style={{ backgroundColor: `${group.color}20`, color: group.color }}>
                    {group.icon}
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-gray-900 dark:text-white group-hover:text-[#5a32fa] transition-colors">{group.name}</p>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">{group.members} members</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trending Discussions */}
          <div className="bg-white dark:bg-[#0f172a] p-4 rounded-2xl border border-gray-200 dark:border-white/20 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-[15px] text-gray-900 dark:text-white">Trending Discussions</h3>
              <button className="text-xs font-bold text-[#5a32fa] hover:underline">See all</button>
            </div>
            <div className="space-y-4">
              {[
                { title: 'How is AI changing patent landscapes globally?', comments: '128' },
                { title: 'The future of trademark law in digital markets', comments: '96' },
                { title: 'Building personal brand in IP profession', comments: '74' }
              ].map((disc, i) => (
                <div key={i} className="cursor-pointer group">
                  <p className="text-[13px] font-bold text-gray-900 dark:text-white group-hover:text-[#5a32fa] transition-colors leading-tight mb-1">
                    <span className="text-[#00d26a] mr-1">▶</span>{disc.title}
                  </p>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">{disc.comments} comments</p>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-white dark:bg-[#0f172a] p-4 rounded-2xl border border-gray-200 dark:border-white/20 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-[15px] text-gray-900 dark:text-white">Upcoming Events</h3>
              <button className="text-xs font-bold text-[#5a32fa] hover:underline">See all</button>
            </div>
            <div className="space-y-4">
              {[
                { month: 'JUL', day: '22', title: 'Women in AI & IP Leadership', loc: 'London, UK', time: '10:00 AM GMT' },
                { month: 'AUG', day: '05', title: 'Global Trademark Trends 2025', loc: 'Online Webinar', time: '03:00 PM GMT' },
                { month: 'AUG', day: '19', title: 'IP Strategy for Start-ups', loc: 'New York, USA', time: '11:00 AM EST' }
              ].map((event, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="flex flex-col items-center justify-center border border-gray-200 dark:border-white/20 rounded-xl overflow-hidden min-w-[45px]">
                    <div className="bg-[#5a32fa] text-white text-[9px] font-bold w-full text-center py-0.5">{event.month}</div>
                    <div className="bg-white dark:bg-[#0f172a] text-gray-900 dark:text-white text-sm font-bold py-1">{event.day}</div>
                  </div>
                  <div className="flex-1">
                    <p className="text-[12px] font-bold text-gray-900 dark:text-white leading-tight mb-0.5">{event.title}</p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">{event.loc}</p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">{event.time}</p>
                  </div>
                  <button className="bg-[#5a32fa] text-white text-[10px] font-bold px-3 py-1.5 rounded-lg hover:bg-[#4020ca] transition-colors">
                    Register
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      </aside>
    </div>
  </div>
</div>
  );
}
