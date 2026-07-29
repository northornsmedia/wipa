'use client';
import { useState, useRef, useEffect } from 'react';

import { useAppStore } from '@/store/useAppStore';
import { 
  BadgeCheck, LayoutGrid, User, Users, Mail, UserPlus, UsersRound, MessageSquare, FileText, Briefcase, GraduationCap,
  MapPin, Link as LinkIcon, Calendar, Edit3, Settings, Camera, ThumbsUp
, BookOpen, X, Share2, Download, Copy
, Hash, BellOff, ArrowUpRight, Circle, CheckCircle2, Loader2} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function ProfilePage() {
  const { user, setUser } = useAppStore();
  const router = useRouter();

  const [profileData, setProfileData] = useState({
    name: user?.name || 'Jane Doe',
    role: 'IP Counsel | Patent Specialist | WIPA Member',
    location: 'London, United Kingdom',
    bio: 'Experienced IP Counsel with a focus on patent strategy and technology licensing. Passionate about protecting innovation in the fast-paced tech sector. Active member of WIPA since 2024.',
    linkedin: 'linkedin.com/in/janedoe',
    website: 'janedoe.com',
    practiceAreas: 'Patent Prosecution, Trademark Law, IP Litigation, Tech Licensing',
    avatarUrl: user?.avatar_url || '',
    memberId: user?.member_id || ''
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [editForm, setEditForm] = useState(profileData);
  const [stats, setStats] = useState({ connections: 0, followers: 0, posts: 0 });

  useEffect(() => {
    if (!user?.id) return;
    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (!error && data) {
        const newProfile = {
          ...profileData,
          name: data.full_name || profileData.name,
          location: data.country || profileData.location,
          bio: data.bio || profileData.bio,
          linkedin: data.linkedin_url || profileData.linkedin,
          website: data.website_url || profileData.website,
          practiceAreas: data.practice_area || profileData.practiceAreas,
          avatarUrl: data.avatar_url || profileData.avatarUrl,
          memberId: data.member_id || ''
        };
        setProfileData(newProfile);
        setEditForm(newProfile);
        
        // Also update store silently to heal stale data
        if (!user.member_id && data.member_id) {
          setUser({ ...user, member_id: data.member_id });
        }
      }
    };
    
    const fetchStats = async () => {
      if (!user?.id) return;
      // Fetch connections count
      const { count: connectionsCount } = await supabase
        .from('connections')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'accepted')
        .or(`requester_id.eq.${user.id},recipient_id.eq.${user.id}`);
        
      // Fetch posts count
      const { count: postsCount } = await supabase
        .from('feed_posts')
        .select('*', { count: 'exact', head: true })
        .eq('author_id', user.id);

      setStats({
        connections: connectionsCount || 0,
        followers: connectionsCount || 0, // Using connections count for followers as a proxy for now
        posts: postsCount || 0
      });
    };
    
    fetchProfile();
    fetchStats();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });
  const [passwordStatus, setPasswordStatus] = useState({ type: '', message: '' });
  
  const handleUpdatePassword = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      setPasswordStatus({ type: 'error', message: 'Please fill out all fields.' });
      return;
    }
    setPasswordStatus({ type: 'loading', message: 'Updating password...' });
    const { error } = await supabase.auth.updateUser({
      password: passwordForm.newPassword
    });

    if (error) {
      setPasswordStatus({ type: 'error', message: error.message });
    } else {
      setPasswordStatus({ type: 'success', message: 'Password updated successfully!' });
      setPasswordForm({ currentPassword: '', newPassword: '' });
      setTimeout(() => {
        setIsSettingsModalOpen(false);
        setPasswordStatus({ type: '', message: '' });
      }, 2000);
    }
  };

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveProfile = async () => {
    if (!user?.id) return;
    setIsSaving(true);
    let finalAvatarUrl = editForm.avatarUrl;

    try {
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, avatarFile, { upsert: true });
          
        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
        finalAvatarUrl = data.publicUrl;
      }

      await supabase.from('profiles').update({
        full_name: editForm.name,
        avatar_url: finalAvatarUrl,
      }).eq('id', user.id);

      setProfileData({ ...editForm, avatarUrl: finalAvatarUrl });
      setUser({ ...user, name: editForm.name, avatar_url: finalAvatarUrl });
      
    } catch (err) {
      console.error('Error saving profile:', err);
    } finally {
      setIsSaving(false);
      setIsEditModalOpen(false);
      setAvatarFile(null);
    }
  };

  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user?.id) {
      setIsUploadingCover(true);
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}-cover.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, file, { upsert: true });
          
        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
        
        await supabase.from('profiles').update({
          cover_url: data.publicUrl
        }).eq('id', user.id);

        setUser({ ...user, cover_url: data.publicUrl });
        setCoverImage(data.publicUrl);
      } catch (err) {
        console.error("Error uploading cover:", err);
      } finally {
        setIsUploadingCover(false);
      }
    }
  };

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const url = URL.createObjectURL(file);
      setEditForm({...editForm, avatarUrl: url});
    }
  };

  return (
    <div className="min-h-screen">
      
      {/* MAIN PROFILE CONTENT */}
      <div className="w-full flex gap-6 lg:gap-8 items-start pl-0 pr-4 md:pr-8 lg:pr-12 bg-[#f8f9fa] min-h-[calc(100vh-73px)]">

        <div className="flex-1 space-y-8 min-w-0 pt-6 pb-24">
          
          {/* Hero Profile Card */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-md overflow-hidden relative">
            {/* Massive Banner */}
            <div 
              className="h-40 md:h-56 relative border-b-4 border-gray-200 bg-indigo-50 overflow-hidden"
              style={{ 
                backgroundImage: (user?.cover_url || coverImage) ? `url(${user?.cover_url || coverImage})` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              {!(user?.cover_url || coverImage) && (
                <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#131313_3px,transparent_3px)] [background-size:24px_24px]"></div>
              )}
              {/* Floating decorative elements */}
              {!(user?.cover_url || coverImage) && (
                <>
                   <div className="absolute top-10 left-10 w-20 h-20 bg-pink-50 border border-gray-200 rounded-full mix-blend-multiply opacity-50 animate-pulse"></div>
                   <div className="absolute bottom-20 right-20 w-32 h-32 bg-green-50 border border-gray-200 rotate-12 mix-blend-multiply opacity-50"></div>
                </>
              )}
              
              <button 
                onClick={() => coverInputRef.current?.click()}
                disabled={isUploadingCover}
                className="absolute bottom-6 right-6 bg-white px-6 py-3 rounded-2xl border border-gray-200 font-bold text-sm flex items-center gap-2 hover:bg-[#5a32fa] hover:text-white transition-all shadow-sm hover:-translate-y-1 disabled:opacity-50"
              >
                {isUploadingCover ? <Loader2 size={20} className="animate-spin" /> : <Camera size={20} />} 
                {isUploadingCover ? 'Uploading...' : 'Edit Cover'}
              </button>
              
              <input 
                type="file"
                ref={coverInputRef}
                onChange={handleCoverUpload}
                accept="image/*"
                className="hidden"
              />
            </div>
            
            <div className="px-6 md:px-12 pb-10 relative flex flex-col md:flex-row gap-6 md:gap-8">
              {/* Giant Avatar */}
              <div className="-mt-16 md:-mt-20 relative z-10 flex-shrink-0">
                <div 
                  className="w-28 h-28 md:w-40 md:h-40 rounded-2xl bg-gradient-to-br from-[#ff90e8] to-[#5a32fa] text-white flex items-center justify-center text-5xl md:text-7xl font-bold border border-gray-200 shadow-md rotate-3 hover:rotate-0 transition-transform duration-300 relative overflow-hidden"
                  style={{ backgroundImage: profileData.avatarUrl ? `url(${profileData.avatarUrl})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center' }}
                >
                  {!profileData.avatarUrl && profileData.name.charAt(0).toUpperCase()}
                </div>
              </div>
              
              <div className="flex-1 pt-4 md:pt-6 flex flex-col xl:flex-row justify-between items-start xl:items-end gap-6">
                <div>
                  <div className="flex items-center gap-4 mb-2 flex-wrap">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center gap-3 tracking-tight">
                      {profileData.name}
                      <BadgeCheck size={32} className="text-[#00d26a]" />
                    </h1>
                    {profileData.memberId && (
                      <span className="bg-[#5a32fa]/10 text-[#5a32fa] px-3 py-1 rounded-full text-sm font-bold border-2 border-[#5a32fa]/20 flex items-center gap-1">
                        <Hash size={14} /> {profileData.memberId}
                      </span>
                    )}
                  </div>
                  <p className="text-lg md:text-xl font-bold text-[#5a32fa] mb-4">{profileData.role}</p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm md:text-base font-bold text-gray-600">
                    <span className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-xl border-2 border-transparent">
                      <MapPin size={18} className="text-[#ff4b4b]" /> {profileData.location}
                    </span>
                    {profileData.linkedin && (
                      <a href={`https://${profileData.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-xl border-2 border-transparent hover:border-gray-200 hover:shadow-[2px_2px_0px_0px_#131313] transition-all cursor-pointer">
                        <LinkIcon size={18} className="text-gray-900" /> {profileData.linkedin}
                      </a>
                    )}
                    {profileData.website && (
                      <a href={`https://${profileData.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-xl border-2 border-transparent hover:border-gray-200 hover:shadow-[2px_2px_0px_0px_#131313] transition-all cursor-pointer">
                        <LinkIcon size={18} className="text-gray-900" /> {profileData.website}
                      </a>
                    )}
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex gap-3 w-full xl:w-auto mt-4 xl:mt-0">
                  <button 
                    onClick={() => setIsSettingsModalOpen(true)}
                    className="flex-none bg-white text-gray-900 p-2.5 rounded-xl font-bold border border-gray-200 shadow-sm hover:bg-gray-50 transition-all flex items-center justify-center"
                  >
                    <Settings size={20} />
                  </button>
                  <button 
                    onClick={() => { setEditForm(profileData); setIsEditModalOpen(true); }} 
                    className="flex-1 xl:flex-none bg-white text-gray-900 px-5 py-2.5 rounded-xl font-bold text-[15px] border border-gray-200 shadow-sm hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                  >
                    <Edit3 size={18} /> Edit Profile
                  </button>
                  <button 
                    onClick={() => setIsShareModalOpen(true)}
                    className="flex-1 xl:flex-none bg-[#5a32fa] text-white px-5 py-2.5 rounded-xl font-bold text-[15px] shadow-sm hover:bg-[#4a24db] transition-all flex items-center justify-center gap-2"
                  >
                    <Share2 size={18} /> Share Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-pink-50 p-8 rounded-2xl border border-gray-200 shadow-md hover:-translate-y-2 transition-transform cursor-pointer">
              <h3 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-2">{stats.connections}</h3>
              <p className="text-lg lg:text-xl font-bold text-gray-900/80">Connections</p>
            </div>
            <div className="bg-[#5a32fa] p-8 rounded-2xl border border-gray-200 shadow-md hover:-translate-y-2 transition-transform cursor-pointer">
              <h3 className="text-5xl lg:text-6xl font-bold text-white mb-2">{stats.followers}</h3>
              <p className="text-lg lg:text-xl font-bold text-white/80">Followers</p>
            </div>
            <div className="bg-yellow-50 p-8 rounded-2xl border border-gray-200 shadow-md hover:-translate-y-2 transition-transform cursor-pointer">
              <h3 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-2">{stats.posts}</h3>
              <p className="text-lg lg:text-xl font-bold text-gray-900/80">Posts</p>
            </div>
          </div>
          
          {/* Main Content Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column (About & Experience) */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white p-8 md:p-10 rounded-3xl border border-gray-200 shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-bl-[100%] opacity-20 pointer-events-none"></div>
                <h3 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-4">
                  About Me
                  <button className="text-gray-900 bg-gray-100 hover:bg-pink-50 border-2 border-transparent hover:border-gray-200 p-2 rounded-xl transition-all shadow-none hover:shadow-[2px_2px_0px_0px_#131313]"><Edit3 size={20} /></button>
                </h3>
                <p className="text-gray-800 font-medium text-lg leading-relaxed">
                  {profileData.bio}
                </p>
              </div>
              
              <div className="bg-white p-8 md:p-10 rounded-3xl border border-gray-200 shadow-md">
                <h3 className="text-3xl font-bold text-gray-900 mb-8 flex items-center justify-between">
                  Experience
                  <button className="text-gray-900 bg-gray-100 hover:bg-green-50 border-2 border-transparent hover:border-gray-200 p-3 rounded-xl transition-all font-bold text-sm flex items-center gap-2 hover:shadow-sm">
                    <span className="text-xl leading-none">+</span> Add New
                  </button>
                </h3>
                
                <div className="space-y-10 relative before:absolute before:inset-0 before:ml-[28px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-1 before:bg-gray-200">
                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-14 h-14 rounded-full border border-gray-200 bg-indigo-50 text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10 text-2xl">
                      ⚖️
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl border border-gray-200 bg-white shadow-sm hover:-translate-y-1 transition-transform">
                      <h4 className="text-xl font-bold text-gray-900">Senior IP Counsel</h4>
                      <p className="text-base font-bold text-[#5a32fa] mb-2">TechLaw Partners LLP</p>
                      <p className="text-sm font-bold text-gray-500 mb-4 bg-gray-100 inline-block px-3 py-1 rounded-lg">Jan 2021 - Present</p>
                      <p className="text-base text-gray-700 font-medium leading-relaxed">
                        Leading the technology patent division, advising Fortune 500 companies on software patentability, and navigating complex cross-border trademark disputes.
                      </p>
                    </div>
                  </div>
                  
                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-14 h-14 rounded-full border border-gray-200 bg-[#ff4b4b] text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10 text-2xl">
                      🏢
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl border border-gray-200 bg-white shadow-sm hover:-translate-y-1 transition-transform">
                      <h4 className="text-xl font-bold text-gray-900">Associate Attorney</h4>
                      <p className="text-base font-bold text-[#5a32fa] mb-2">Global IP Solutions</p>
                      <p className="text-sm font-bold text-gray-500 mb-4 bg-gray-100 inline-block px-3 py-1 rounded-lg">Jun 2017 - Dec 2020</p>
                      <p className="text-base text-gray-700 font-medium leading-relaxed">
                        Drafted and prosecuted over 100 patent applications across mechanical and software domains. Conducted extensive FTO analyses.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Column (Highlights & Skills) */}
            <div className="space-y-8">
              <div className="bg-[#5a32fa] text-white p-8 rounded-3xl border border-gray-200 shadow-[8px_8px_0px_0px_#5a32fa]">
                <h3 className="text-2xl font-bold mb-6 text-[#00d26a]">Highlights</h3>
                <div className="space-y-5">
                  <div className="bg-white/10 p-5 rounded-2xl border-2 border-transparent hover:border-white/30 transition-colors cursor-pointer group">
                    <p className="text-sm font-bold text-[#ff90e8] mb-2 uppercase tracking-wider">Published Article</p>
                    <p className="text-base font-bold group-hover:text-white transition-colors">"The Impact of Generative AI on Modern Copyright Frameworks"</p>
                  </div>
                  <div className="bg-white/10 p-5 rounded-2xl border-2 border-transparent hover:border-white/30 transition-colors cursor-pointer group">
                    <p className="text-sm font-bold text-[#ffc900] mb-2 uppercase tracking-wider">Upcoming Speaker</p>
                    <p className="text-base font-bold group-hover:text-white transition-colors">London Legal Tech Summit 2026</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-md">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Top Skills</h3>
                <div className="flex flex-wrap gap-3">
                  {profileData.practiceAreas.split(',').map((area, idx) => {
                    const colors = ['#5a32fa', '#ff90e8', '#00d26a', '#ffc900'];
                    const color = colors[idx % colors.length];
                    const textColor = color === '#5a32fa' ? 'text-white' : 'text-gray-900';
                    return (
                      <span key={idx} className={`bg-[${color}] ${textColor} px-4 py-2.5 rounded-xl text-sm font-bold border border-gray-100 shadow-[2px_2px_0px_0px_#131313] hover:-translate-y-1 transition-transform cursor-default`} style={{backgroundColor: color}}>
                        {area.trim()}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
            
          </div>
        </div>

          {/* RIGHT SIDEBAR */}
          <aside className="w-[300px] hidden xl:flex flex-col shrink-0 space-y-6 pt-6 sticky top-[73px] h-[calc(100vh-73px)] overflow-y-auto no-scrollbar pb-10">
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-4 text-sm">People Also Viewed</h3>
              <div className="space-y-4">
                {[
                  { name: 'Sarah Jenkins', role: 'Senior Patent Counsel', initial: 'S', color: 'bg-indigo-100 text-indigo-700' },
                  { name: 'David Chen', role: 'Partner at IP Law Group', initial: 'D', color: 'bg-pink-100 text-pink-700' },
                  { name: 'Elena Rodriguez', role: 'Trademark Examiner', initial: 'E', color: 'bg-emerald-100 text-emerald-700' },
                ].map((person, i) => (
                  <div key={i} className="flex items-center gap-3 group cursor-pointer">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${person.color}`}>
                      {person.initial}
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="font-bold text-sm text-gray-900 truncate group-hover:text-[#5a32fa] transition-colors">{person.name}</h4>
                      <p className="text-xs text-gray-500 truncate">{person.role}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 py-2 text-sm font-bold text-gray-600 hover:text-gray-900 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                View all recommendations
              </button>
            </div>

            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-4 text-sm">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                    <ThumbsUp size={14} className="text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-900"><span className="font-bold">You</span> liked a post by Sarah Jenkins</p>
                    <p className="text-xs text-gray-500 mt-0.5">2 hours ago</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center shrink-0">
                    <MessageSquare size={14} className="text-purple-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-900"><span className="font-bold">You</span> commented on "AI in Patents"</p>
                    <p className="text-xs text-gray-500 mt-0.5">Yesterday</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>

      </div>
      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#5a32fa]/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-2xl border border-gray-200 shadow-md flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b-4 border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Edit Profile</h2>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 text-gray-600 border-2 border-transparent hover:border-gray-200 hover:bg-gray-200 transition-all"
              >
                <X size={20} strokeWidth={3} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                <input 
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-[#5a32fa] font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Headline / Role</label>
                <input 
                  type="text"
                  value={editForm.role}
                  onChange={(e) => setEditForm({...editForm, role: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-[#5a32fa] font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Location</label>
                <input 
                  type="text"
                  value={editForm.location}
                  onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-[#5a32fa] font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Profile Photo</label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gray-100 border-2 border-gray-200 flex items-center justify-center overflow-hidden">
                    {editForm.avatarUrl ? (
                      <img src={editForm.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <User size={24} className="text-gray-400" />
                    )}
                  </div>
                  <button onClick={() => avatarInputRef.current?.click()} className="px-4 py-2 bg-white border border-gray-100 rounded-xl font-bold text-sm shadow-[2px_2px_0px_0px_#131313] hover:-translate-y-0.5 transition-all">
                    Upload Photo
                  </button>
                  <input type="file" ref={avatarInputRef} onChange={handleAvatarUpload} accept="image/*" className="hidden" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">LinkedIn URL</label>
                  <input 
                    type="text"
                    value={editForm.linkedin}
                    onChange={(e) => setEditForm({...editForm, linkedin: e.target.value})}
                    placeholder="linkedin.com/in/username"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-[#5a32fa] font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Website URL</label>
                  <input 
                    type="text"
                    value={editForm.website}
                    onChange={(e) => setEditForm({...editForm, website: e.target.value})}
                    placeholder="example.com"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-[#5a32fa] font-medium"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Practice Areas (comma separated)</label>
                <input 
                  type="text"
                  value={editForm.practiceAreas}
                  onChange={(e) => setEditForm({...editForm, practiceAreas: e.target.value})}
                  placeholder="e.g. Patent Law, Trademark Prosecution"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-[#5a32fa] font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Bio / About</label>
                <textarea 
                  rows={4}
                  value={editForm.bio}
                  onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-[#5a32fa] font-medium resize-none"
                />
              </div>
            </div>
            
            <div className="p-6 border-t-4 border-gray-200 flex gap-4">
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="flex-1 py-3 bg-white text-gray-900 rounded-xl font-bold border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm active:translate-y-1 active:shadow-none"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="flex-1 py-3 bg-green-50 text-gray-900 rounded-xl font-bold border border-gray-200 hover:bg-[#00e373] transition-colors shadow-sm active:translate-y-1 active:shadow-none flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSaving ? <Loader2 size={20} className="animate-spin" /> : null}
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings / Security Modal */}
      {isSettingsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#5a32fa]/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl border border-gray-200 shadow-md flex flex-col">
            <div className="flex justify-between items-center p-6 border-b-4 border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Account Settings</h2>
              <button 
                onClick={() => setIsSettingsModalOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 text-gray-600 border-2 border-transparent hover:border-gray-200 hover:bg-gray-200 transition-all"
              >
                <X size={20} strokeWidth={3} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Change Password</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Current Password</label>
                    <input 
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                      placeholder="Enter current password"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-[#5a32fa] font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">New Password</label>
                    <input 
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                      placeholder="Enter new password"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-[#5a32fa] font-medium"
                    />
                  </div>
                  
                  {passwordStatus.message && (
                    <div className={`p-4 rounded-xl border-2 font-bold text-sm ${
                      passwordStatus.type === 'error' ? 'bg-red-50 border-red-200 text-red-600' : 
                      passwordStatus.type === 'success' ? 'bg-green-50 border-green-200 text-green-600' :
                      'bg-blue-50 border-blue-200 text-blue-600'
                    }`}>
                      {passwordStatus.message}
                    </div>
                  )}
                  
                  <button 
                    onClick={handleUpdatePassword}
                    disabled={passwordStatus.type === 'loading'}
                    className="w-full py-3 bg-[#5a32fa] text-white rounded-xl font-bold border-4 border-transparent hover:border-[#5a32fa] transition-all disabled:opacity-50"
                  >
                    {passwordStatus.type === 'loading' ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share Profile Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-gradient-to-br from-white via-white to-[#f0ebff] rounded-[2rem] w-full max-w-sm overflow-hidden flex flex-col relative shadow-[0_0_50px_rgba(90,50,250,0.25)] animate-in fade-in zoom-in duration-300 border border-white/50">
            
            <div className="p-6 pb-2 relative flex justify-between items-center z-10">
              <div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Share Profile</h2>
                <p className="text-sm font-bold text-[#5a32fa]">Digital Business Card</p>
              </div>
              <button onClick={() => setIsShareModalOpen(false)} className="bg-white/80 backdrop-blur-sm text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors p-2.5 rounded-full shadow-sm border border-gray-100">
                <X size={20} />
              </button>
            </div>
            
            <div className="px-8 pb-8 pt-4 flex flex-col items-center relative z-10">
              <p className="text-[14px] text-gray-600 font-medium text-center mb-8 max-w-[250px] leading-relaxed">
                Have someone scan this code with their camera to instantly connect.
              </p>
              
              {/* QR Code Container with Advanced Glow */}
              <div className="relative mb-10 group">
                {/* Animated Gradient Glow */}
                <div className="absolute -inset-3 bg-gradient-to-r from-[#5a32fa] via-[#8c65ff] to-[#ff4b4b] rounded-[2.5rem] blur-xl opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-300 animate-pulse"></div>
                
                <div className="bg-white p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.08)] relative ring-1 ring-gray-100/50 transform group-hover:-translate-y-1 transition-all duration-300" id="qr-code-container">
                  <QRCodeSVG 
                    value={`${window.location.origin}/u/${profileData.memberId}`} 
                    size={200}
                    bgColor="#ffffff"
                    fgColor="#131313"
                    level="H"
                    includeMargin={false}
                    imageSettings={{
                      src: '/WIPALOGO.png',
                      height: 52,
                      width: 52,
                      excavate: true,
                    }}
                  />
                </div>
              </div>
              
              <button 
                onClick={() => {
                  const svg = document.querySelector('#qr-code-container svg');
                  if (!svg) return;
                  const svgData = new XMLSerializer().serializeToString(svg);
                  const canvas = document.createElement('canvas');
                  const ctx = canvas.getContext('2d');
                  const img = new Image();
                  img.onload = () => {
                    canvas.width = img.width;
                    canvas.height = img.height;
                    if(ctx) {
                      ctx.fillStyle = 'white';
                      ctx.fillRect(0, 0, canvas.width, canvas.height);
                      ctx.drawImage(img, 0, 0);
                      const a = document.createElement('a');
                      a.download = `${profileData.name.replace(/\s+/g, '_')}_QR.png`;
                      a.href = canvas.toDataURL('image/png');
                      a.click();
                    }
                  };
                  img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
                }}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#131313] to-[#2a2a2a] text-white font-bold py-3.5 px-6 rounded-2xl hover:shadow-[0_8px_25px_-6px_rgba(0,0,0,0.5)] hover:-translate-y-0.5 transition-all mb-6 border border-gray-800"
              >
                <Download size={20} /> Download QR (HD)
              </button>

              <div className="w-full">
                <div className="flex items-center gap-2 bg-white border border-gray-200/80 p-1.5 rounded-2xl shadow-sm">
                  <input 
                    type="text" 
                    readOnly 
                    value={`${window.location.origin}/u/${profileData.memberId}`}
                    className="flex-1 bg-transparent border-none focus:outline-none text-gray-500 text-[13px] px-3 font-semibold truncate"
                  />
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/u/${profileData.memberId}`);
                      alert('Link copied!');
                    }}
                    className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 p-2.5 rounded-xl text-gray-700 hover:from-[#5a32fa] hover:to-[#8c65ff] hover:text-white hover:border-[#5a32fa] transition-all shadow-sm flex items-center gap-2 font-bold text-sm group"
                  >
                    <Copy size={16} className="group-hover:scale-110 transition-transform" /> Copy
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
}
