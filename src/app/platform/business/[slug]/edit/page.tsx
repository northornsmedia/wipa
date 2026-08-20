'use client';

import { DotmCircular7 as Loader2 } from '@/components/ui/dotm-circular-7';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/store/useAppStore';
import { ArrowLeft, Save, Users, Search, X, UserPlus, Shield } from 'lucide-react';
import Link from 'next/link';

export default function EditBusinessProfilePage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const { user } = useAppStore();
  
  const [business, setBusiness] = useState<any>(null);
  const [team, setTeam] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Search for new members
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const fetchBusiness = async () => {
      setLoading(true);
      const { data } = await supabase.from('business_profiles').select('*').eq('slug', params.slug).single();
      
      if (data) {
        // Verify admin access
        const { data: teamData } = await supabase.from('business_team_members').select('*').eq('business_id', data.id);
        
        if (teamData && user) {
          const myRole = teamData.find(t => t.profile_id === user.id);
          if (myRole?.is_admin || data.owner_id === user.id) {
            setBusiness(data);
            fetchTeam(data.id);
          } else {
            router.push(`/platform/business/${params.slug}`); // Not authorized
            return;
          }
        } else {
          router.push(`/platform`);
          return;
        }
      }
      setLoading(false);
    };
    
    fetchBusiness();
  }, [params.slug, user, router]);

  const fetchTeam = async (businessId: string) => {
    const { data } = await supabase
      .from('business_team_members')
      .select('*, profiles(first_name, last_name, avatar_url, email)')
      .eq('business_id', businessId);
    if (data) setTeam(data);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const specializationsArray = Array.isArray(business.specializations) 
      ? business.specializations 
      : typeof business.specializations === 'string' 
        ? business.specializations.split(',').map((s: string) => s.trim()).filter(Boolean)
        : [];

    const { error } = await supabase.from('business_profiles').update({
      name: business.name,
      tagline: business.tagline,
      description: business.description,
      website_url: business.website_url,
      linkedin_url: business.linkedin_url,
      founded_year: business.founded_year,
      company_size: business.company_size,
      headquarters: business.headquarters,
      contact_email: business.contact_email,
      phone: business.phone,
      logo_url: business.logo_url,
      cover_image_url: business.cover_image_url,
      specializations: specializationsArray
    }).eq('id', business.id);

    setSaving(false);
    if (error) alert('Error saving: ' + error.message);
    else router.push(`/platform/business/${business.slug}`);
  };

  const searchUsers = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 3) {
      setSearchResults([]);
      return;
    }
    
    setSearching(true);
    // basic search by name or email
    const { data } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, avatar_url, email')
      .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,email.ilike.%${query}%`)
      .limit(5);
      
    if (data) setSearchResults(data);
    setSearching(false);
  };

  const inviteMember = async (profileId: string) => {
    // Check if already in team
    if (team.some(t => t.profile_id === profileId)) {
      alert('User is already in the team');
      return;
    }
    
    const { error } = await supabase.from('business_team_members').insert({
      business_id: business.id,
      profile_id: profileId,
      role: 'Member',
      is_admin: false
    });
    
    if (error) {
      alert('Error inviting member: ' + error.message);
    } else {
      setSearchQuery('');
      setSearchResults([]);
      fetchTeam(business.id);
    }
  };

  const removeMember = async (id: string, profileId: string) => {
    if (profileId === business.owner_id) {
      alert('Cannot remove the owner of the business.');
      return;
    }
    if (confirm('Are you sure you want to remove this member?')) {
      await supabase.from('business_team_members').delete().eq('id', id);
      fetchTeam(business.id);
    }
  };

  const toggleAdmin = async (id: string, currentStatus: boolean, profileId: string) => {
    if (profileId === business.owner_id) {
      alert('Cannot change owner admin status.');
      return;
    }
    await supabase.from('business_team_members').update({ is_admin: !currentStatus }).eq('id', id);
    fetchTeam(business.id);
  };

  if (loading) {
    return <div className="min-h-screen flex justify-center pt-32"><Loader2 size={40} className="animate-spin text-[#5a32fa]" /></div>;
  }

  if (!business) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] pb-24">
      
      {/* Header */}
      <div className="bg-white dark:bg-[#0f172a] border-b border-slate-200 dark:border-white/10 sticky top-[73px] z-30">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={`/platform/business/${business.slug}`} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-xl font-black">Edit {business.name}</h1>
          </div>
          <button 
            onClick={handleSave} 
            disabled={saving}
            className="bg-[#5a32fa] text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-[#4a24db] transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} 
            Save Changes
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        
        {/* Profile Settings */}
        <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-8 border border-slate-200 dark:border-white/10 shadow-sm">
          <h2 className="text-2xl font-black mb-6">Profile Details</h2>
          <form className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold mb-2">Business Name</label>
                <input value={business.name} onChange={e => setBusiness({...business, name: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#5a32fa]/50" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Tagline</label>
                <input value={business.tagline || ''} onChange={e => setBusiness({...business, tagline: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#5a32fa]/50" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Description</label>
              <textarea rows={5} value={business.description || ''} onChange={e => setBusiness({...business, description: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#5a32fa]/50" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold mb-2">Website URL</label>
                <input value={business.website_url || ''} onChange={e => setBusiness({...business, website_url: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#5a32fa]/50" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">LinkedIn URL</label>
                <input value={business.linkedin_url || ''} onChange={e => setBusiness({...business, linkedin_url: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#5a32fa]/50" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-bold mb-2">Founded Year</label>
                <input type="number" value={business.founded_year || ''} onChange={e => setBusiness({...business, founded_year: parseInt(e.target.value) || null})} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#5a32fa]/50" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Company Size</label>
                <select value={business.company_size || ''} onChange={e => setBusiness({...business, company_size: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#5a32fa]/50">
                  <option value="1-10">1-10</option>
                  <option value="11-50">11-50</option>
                  <option value="51-200">51-200</option>
                  <option value="201-500">201-500</option>
                  <option value="500+">500+</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Headquarters</label>
                <input value={business.headquarters || ''} onChange={e => setBusiness({...business, headquarters: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#5a32fa]/50" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold mb-2">Contact Email</label>
                <input value={business.contact_email || ''} onChange={e => setBusiness({...business, contact_email: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#5a32fa]/50" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Contact Phone</label>
                <input value={business.phone || ''} onChange={e => setBusiness({...business, phone: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#5a32fa]/50" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Specializations (comma separated)</label>
              <input 
                value={Array.isArray(business.specializations) ? business.specializations.join(', ') : business.specializations || ''} 
                onChange={e => setBusiness({...business, specializations: e.target.value})} 
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#5a32fa]/50" 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-200 dark:border-slate-800">
              <div>
                <label className="block text-sm font-bold mb-2">Logo URL</label>
                <input value={business.logo_url || ''} onChange={e => setBusiness({...business, logo_url: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#5a32fa]/50" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Cover Image URL</label>
                <input value={business.cover_image_url || ''} onChange={e => setBusiness({...business, cover_image_url: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#5a32fa]/50" />
              </div>
            </div>

          </form>
        </div>

        {/* Team Management */}
        <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-8 border border-slate-200 dark:border-white/10 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black flex items-center gap-2"><Users className="text-[#5a32fa]" /> Team Management</h2>
          </div>

          {/* Invite Member */}
          <div className="mb-8 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="font-bold mb-4 flex items-center gap-2"><UserPlus size={18} /> Invite Member</h3>
            <div className="relative">
              <div className="flex items-center bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                <Search size={18} className="ml-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search WIPA profiles by name or email..." 
                  value={searchQuery}
                  onChange={e => searchUsers(e.target.value)}
                  className="w-full bg-transparent px-3 py-3 outline-none text-sm"
                />
                {searching && <Loader2 size={16} className="mr-4 animate-spin text-slate-400" />}
              </div>
              
              {searchResults.length > 0 && (
                <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-20 max-h-60 overflow-y-auto">
                  {searchResults.map(result => (
                    <div key={result.id} className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-800 border-b border-slate-100 dark:border-slate-800 last:border-0">
                      <div className="flex items-center gap-3">
                        <img src={result.avatar_url || `https://ui-avatars.com/api/?name=${result.first_name}+${result.last_name}`} className="w-8 h-8 rounded-full" />
                        <div>
                          <div className="font-bold text-sm">{result.first_name} {result.last_name}</div>
                          <div className="text-xs text-slate-500">{result.email}</div>
                        </div>
                      </div>
                      <button 
                        onClick={() => inviteMember(result.id)}
                        className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors"
                      >
                        Add to Team
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Current Team */}
          <div className="space-y-4">
            <h3 className="font-bold mb-4">Current Team ({team.length})</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-xs uppercase tracking-wider text-slate-500 border-b border-slate-200 dark:border-slate-800">
                    <th className="pb-3 pl-2">Member</th>
                    <th className="pb-3">Role</th>
                    <th className="pb-3">Admin</th>
                    <th className="pb-3 text-right pr-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {team.map(member => (
                    <tr key={member.id} className="border-b border-slate-100 dark:border-slate-800/50 last:border-0 group hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                      <td className="py-3 pl-2">
                        <div className="flex items-center gap-3">
                          <img src={member.profiles?.avatar_url || `https://ui-avatars.com/api/?name=${member.profiles?.first_name}+${member.profiles?.last_name}`} className="w-8 h-8 rounded-full object-cover" />
                          <div>
                            <div className="font-bold text-sm">
                              {member.profiles?.first_name} {member.profiles?.last_name}
                              {member.profile_id === business.owner_id && <span className="ml-2 text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-black uppercase">Owner</span>}
                            </div>
                            <div className="text-xs text-slate-500">{member.profiles?.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3">
                        <input 
                          value={member.role || ''}
                          onChange={async (e) => {
                            const newRole = e.target.value;
                            setTeam(team.map(t => t.id === member.id ? {...t, role: newRole} : t));
                            await supabase.from('business_team_members').update({ role: newRole }).eq('id', member.id);
                          }}
                          className="bg-transparent border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-sm outline-none focus:border-[#5a32fa]"
                          placeholder="Role..."
                        />
                      </td>
                      <td className="py-3">
                        <button 
                          onClick={() => toggleAdmin(member.id, member.is_admin, member.profile_id)}
                          disabled={member.profile_id === business.owner_id}
                          className={`p-1.5 rounded-lg transition-colors ${member.is_admin ? 'text-green-600 bg-green-50' : 'text-slate-400 hover:bg-slate-100'} disabled:opacity-50`}
                          title={member.is_admin ? 'Remove Admin' : 'Make Admin'}
                        >
                          <Shield size={16} className={member.is_admin ? 'fill-green-600' : ''} />
                        </button>
                      </td>
                      <td className="py-3 pr-2 text-right">
                        <button 
                          onClick={() => removeMember(member.id, member.profile_id)}
                          disabled={member.profile_id === business.owner_id}
                          className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                          title="Remove from team"
                        >
                          <X size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
