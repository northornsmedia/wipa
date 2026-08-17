'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/store/useAppStore';
import { ArrowLeft, CheckCircle2, MapPin, Globe, Mail, Phone, Users, Building2, Briefcase, Monitor, MoreHorizontal, Link as LinkIcon, Edit2, UserPlus, Star, Loader2, MessageCircle } from 'lucide-react';
import Link from 'next/link';

const TYPE_ICONS: Record<string, any> = {
  startup: Briefcase,
  law_firm: Building2,
  ip_firm: Building2,
  tech_company: Monitor,
  other: MoreHorizontal
};

const TYPE_LABELS: Record<string, string> = {
  startup: 'Startup',
  law_firm: 'Law Firm',
  ip_firm: 'IP Firm',
  tech_company: 'Tech Company',
  other: 'Other'
};

export default function BusinessProfilePage({ params }: { params: { slug: string } }) {
  const { user } = useAppStore();
  const [business, setBusiness] = useState<any>(null);
  const [team, setTeam] = useState<any[]>([]);
  const [sponsorships, setSponsorships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('about');
  const [checkingOutId, setCheckingOutId] = useState<string | null>(null);
  
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchBusiness = async () => {
      setLoading(true);
      const { data } = await supabase.from('business_profiles').select('*').eq('slug', params.slug).single();
      
      if (data) {
        setBusiness(data);
        
        // Fetch team
        const { data: teamData } = await supabase
          .from('business_team_members')
          .select('*, profiles(first_name, last_name, avatar_url, job_title)')
          .eq('business_id', data.id);
          
        if (teamData) {
          setTeam(teamData);
          
          if (user) {
            const myRole = teamData.find(t => t.profile_id === user.id);
            if (myRole?.is_admin || data.owner_id === user.id) {
              setIsAdmin(true);
            }
          }
        }

        // Fetch Sponsorships if admin
        if (user && (data.owner_id === user.id || teamData?.find(t => t.profile_id === user.id)?.is_admin)) {
          const { data: sponsorData } = await supabase
            .from('event_sponsorships')
            .select('*, event:events(title), package:sponsorship_packages(name, price)')
            .eq('business_profile_id', data.id)
            .order('applied_at', { ascending: false });
          if (sponsorData) setSponsorships(sponsorData);
        }
      }
      setLoading(false);
    };
    
    fetchBusiness();
  }, [params.slug, user]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#020617]"><div className="animate-spin w-12 h-12 border-4 border-[#5a32fa] border-t-transparent rounded-full"></div></div>;
  }

  if (!business) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-[#020617] p-4 text-center">
        <Building2 size={64} className="text-slate-300 dark:text-slate-700 mb-6" />
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Business Not Found</h1>
        <p className="text-slate-500 mb-8">This business profile does not exist or has been removed.</p>
        <Link href="/platform" className="bg-[#5a32fa] text-white px-6 py-3 rounded-xl font-bold">Back to Feed</Link>
      </div>
    );
  }

  const TypeIcon = TYPE_ICONS[business.type] || Building2;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-white pb-24">
      
      {/* Cover & Header */}
      <div className="bg-white dark:bg-[#0f172a] border-b border-slate-200 dark:border-white/10">
        <div className="h-64 md:h-80 w-full relative bg-slate-200 dark:bg-slate-800">
          {business.cover_image_url ? (
            <img src={business.cover_image_url} alt="Cover" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-[#020617] to-indigo-900 opacity-80"></div>
          )}
          <div className="absolute top-6 left-6 z-10">
            <Link href="/platform" className="bg-black/40 hover:bg-black/60 backdrop-blur-md text-white p-2 rounded-full inline-flex transition-colors">
              <ArrowLeft size={20} />
            </Link>
          </div>
          {isAdmin && (
            <div className="absolute top-6 right-6 z-10">
              <button className="bg-white text-slate-900 hover:bg-slate-100 font-bold text-sm px-4 py-2 rounded-xl inline-flex items-center gap-2 transition-colors shadow-md">
                <Edit2 size={16} /> Edit Profile
              </button>
            </div>
          )}
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative pb-8">
          <div className="flex flex-col md:flex-row md:items-end gap-6 md:gap-8 -mt-20 relative z-10 mb-8">
            <div className="w-32 h-32 md:w-40 md:h-40 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border-4 border-white dark:border-slate-900 flex items-center justify-center overflow-hidden shrink-0">
              {business.logo_url ? (
                <img src={business.logo_url} alt={business.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-5xl font-black text-slate-300">{business.name.charAt(0)}</span>
              )}
            </div>
            <div className="flex-1 pb-2">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">{business.name}</h1>
                {business.is_verified && <CheckCircle2 size={24} className="text-blue-500" />}
                <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  <Globe size={16} /> {TYPE_LABELS[business.type] || business.type}
                </span>
              </div>
              {business.tagline && (
                <p className="text-xl text-[#5a32fa] font-bold mb-3">{business.tagline}</p>
              )}
              <div className="flex flex-wrap items-center gap-4 text-slate-600 dark:text-slate-400 font-medium text-sm">
                {business.headquarters && <div className="flex items-center gap-1"><MapPin size={16} /> {business.headquarters}</div>}
                {business.company_size && <div className="flex items-center gap-1"><Users size={16} /> {business.company_size} Employees</div>}
                {business.founded_year && <div>Est. {business.founded_year}</div>}
              </div>
            </div>
          </div>

          <div className="flex overflow-x-auto gap-8 border-b border-slate-200 dark:border-white/10 no-scrollbar">
            {['about', 'team', 'posts', 'contact'].concat(isAdmin ? ['sponsorships'] : []).map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-sm font-black uppercase tracking-widest border-b-2 transition-colors whitespace-nowrap ${activeTab === tab ? 'border-[#5a32fa] text-[#5a32fa]' : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
              >
                {tab === 'sponsorships' ? 'My Sponsorships' : tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col lg:flex-row gap-12">
        
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          
          {activeTab === 'about' && (
            <div className="space-y-12 animate-in fade-in">
              <section>
                <h2 className="text-2xl font-black mb-6">About Us</h2>
                <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
                  {business.description ? (
                    <p className="whitespace-pre-wrap">{business.description}</p>
                  ) : (
                    <p className="italic text-slate-400">No description provided yet.</p>
                  )}
                </div>
              </section>
              
              {business.specializations && business.specializations.length > 0 && (
                <section>
                  <h2 className="text-xl font-black mb-4">Specializations</h2>
                  <div className="flex flex-wrap gap-2">
                    {business.specializations.map((spec: string) => (
                      <span key={spec} className="bg-slate-200 dark:bg-white/10 text-slate-800 dark:text-slate-200 px-4 py-2 rounded-xl font-bold text-sm">
                        {spec}
                      </span>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}

          {activeTab === 'team' && (
            <div className="animate-in fade-in space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black">Team ({team.length})</h2>
                {isAdmin && (
                  <button className="bg-[#5a32fa] text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-[#4a24db] transition-colors text-sm">
                    <UserPlus size={16} /> Invite Member
                  </button>
                )}
              </div>
              
              {team.length === 0 ? (
                <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-12 border border-slate-200 dark:border-white/10 text-center">
                  <Users size={48} className="mx-auto text-slate-300 dark:text-slate-700 mb-4" />
                  <p className="text-slate-500 font-medium">No team members visible yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {team.map(member => (
                    <div key={member.id} className="bg-white dark:bg-[#0f172a] p-6 rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm flex items-center gap-4">
                      <img src={member.profiles?.avatar_url || `https://ui-avatars.com/api/?name=${member.profiles?.first_name}+${member.profiles?.last_name}`} alt="Avatar" className="w-16 h-16 rounded-2xl object-cover" />
                      <div>
                        <div className="font-bold text-lg">{member.profiles?.first_name} {member.profiles?.last_name}</div>
                        <div className="text-slate-500 text-sm font-medium">{member.role}</div>
                        {member.is_admin && <span className="inline-block mt-1 bg-indigo-100 text-indigo-700 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded">Admin</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'posts' && (
            <div className="animate-in fade-in">
              <h2 className="text-2xl font-black mb-6">Recent Activity</h2>
              <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-12 border border-slate-200 dark:border-white/10 text-center">
                <p className="text-slate-500 font-medium">No recent posts from this business.</p>
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="animate-in fade-in space-y-6">
              <h2 className="text-2xl font-black mb-6">Contact Information</h2>
              
              <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-8 border border-slate-200 dark:border-white/10 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {business.website_url && (
                    <a href={business.website_url} target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 text-slate-700 dark:text-slate-300 hover:text-[#5a32fa] group transition-colors">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-[#5a32fa]/10"><Globe size={20} /></div>
                      <div>
                        <div className="font-bold text-sm text-slate-400 mb-1">Website</div>
                        <div className="font-bold">{business.website_url.replace(/^https?:\/\//, '')}</div>
                      </div>
                    </a>
                  )}
                  {business.linkedin_url && (
                    <a href={business.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 text-slate-700 dark:text-slate-300 hover:text-[#5a32fa] group transition-colors">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-[#5a32fa]/10"><Globe size={20} /></div>
                      <div>
                        <div className="font-bold text-sm text-slate-400 mb-1">LinkedIn</div>
                        <div className="font-bold break-all">{business.linkedin_url}</div>
                      </div>
                    </a>
                  )}
                  {business.contact_email && (
                    <a href={`mailto:${business.contact_email}`} className="flex items-start gap-4 text-slate-700 dark:text-slate-300 hover:text-[#5a32fa] group transition-colors">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-[#5a32fa]/10"><Mail size={20} /></div>
                      <div>
                        <div className="font-bold text-sm text-slate-400 mb-1">Email</div>
                        <div className="font-bold">{business.contact_email}</div>
                      </div>
                    </a>
                  )}
                  {business.phone && (
                    <div className="flex items-start gap-4 text-slate-700 dark:text-slate-300">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center shrink-0"><Phone size={20} /></div>
                      <div>
                        <div className="font-bold text-sm text-slate-400 mb-1">Phone</div>
                        <div className="font-bold">{business.phone}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sponsorships' && isAdmin && (
            <div className="animate-in fade-in space-y-6">
              <h2 className="text-2xl font-black mb-6">My Sponsorships</h2>
              
              {sponsorships.length === 0 ? (
                <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-12 border border-slate-200 dark:border-white/10 text-center">
                  <Star size={48} className="mx-auto text-slate-300 dark:text-slate-700 mb-4" />
                  <p className="text-slate-500 font-medium mb-4">No active sponsorships.</p>
                  <Link href="/platform/events" className="bg-[#5a32fa] text-white px-6 py-3 rounded-xl font-bold inline-flex">Explore Events to Sponsor</Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {sponsorships.map(app => (
                    <div key={app.id} className="bg-white dark:bg-[#0f172a] p-6 rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                      <div>
                        <div className="text-sm font-bold text-gray-500 mb-1">{app.event?.title}</div>
                        <div className="font-black text-xl text-gray-900 dark:text-white mb-2">{app.package?.name}</div>
                        <div className="flex items-center gap-3 text-sm">
                          <span className="font-bold text-gray-600 dark:text-gray-400">£{app.package?.price}</span>
                          <span className="text-gray-300 dark:text-gray-600">•</span>
                          <span className="text-gray-500">Applied {new Date(app.applied_at).toLocaleDateString()}</span>
                          <span className="text-gray-300 dark:text-gray-600">•</span>
                          <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                            app.status === 'approved' ? 'bg-blue-100 text-blue-700' :
                            app.status === 'paid' ? 'bg-green-100 text-green-700' :
                            app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {app.status === 'paid' ? 'ACTIVE' : app.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      
                      <div className="shrink-0 flex items-center gap-3">
                        {app.status === 'approved' && (
                          <button 
                            onClick={async () => {
                              setCheckingOutId(app.id);
                              try {
                                const res = await fetch('/api/sponsorship/checkout', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ sponsorshipId: app.id })
                                });
                                const data = await res.json();
                                if (data.success && data.url) {
                                  // For demo, we just update the local state since we simulate it
                                  setSponsorships(sponsorships.map(s => s.id === app.id ? { ...s, status: 'paid' } : s));
                                }
                              } catch (e) {
                                console.error(e);
                              }
                              setCheckingOutId(null);
                            }}
                            disabled={checkingOutId === app.id}
                            className="bg-[#00d26a] text-white px-6 py-2.5 rounded-xl font-bold shadow-md hover:bg-[#00b85c] transition-colors disabled:opacity-50 flex items-center gap-2"
                          >
                            {checkingOutId === app.id ? <Loader2 size={16} className="animate-spin"/> : null}
                            Pay Now
                          </button>
                        )}
                        {app.status === 'paid' && (
                          <Link href={`/platform/events/${app.event_id}`} className="bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-white/20 px-6 py-2.5 rounded-xl font-bold transition-colors">
                            View Event
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-80 shrink-0 space-y-6">
          <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-6 border border-slate-200 dark:border-white/10 shadow-sm text-center">
            <h3 className="font-black mb-2">Interested in {business.name}?</h3>
            <p className="text-slate-500 text-sm mb-6">Send a direct message to their team for inquiries or partnerships.</p>
            <button className="w-full bg-[#5a32fa] text-white py-3 rounded-xl font-black hover:bg-[#4a24db] transition-colors">
              Send Message
            </button>
          </div>
          
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-3xl p-6 border border-indigo-100 dark:border-indigo-900/50">
            <div className="w-10 h-10 bg-white dark:bg-indigo-900 rounded-full flex items-center justify-center text-indigo-500 mb-4 shadow-sm">
              <LinkIcon size={18} />
            </div>
            <h3 className="font-black text-indigo-900 dark:text-indigo-200 mb-2">Claimed Profile</h3>
            <p className="text-indigo-700/70 dark:text-indigo-300/70 text-sm">This profile is actively managed by verified representatives of {business.name}.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
