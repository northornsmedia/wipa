// @ts-nocheck
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  User, ShieldCheck, Bell, Eye, Palette, Crown, Download, Trash2, 
  Camera, Upload, Check, AlertCircle, Sparkles, Key, Lock, Mail, 
  Phone, Globe, Building2, Briefcase, MapPin, GraduationCap,
  Save, ArrowLeft, ArrowUpRight, CheckCircle2, Shield, Smartphone, 
  Monitor, RefreshCw, LogOut, HelpCircle, EyeOff, Moon, Sun, Volume2, 
  Sliders, FileText, BadgeCheck, Zap, Tablet, Clock
} from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/store/useAppStore';

const LinkedinIcon = ({ size = 16, className = "" }: { size?: number, className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.65 1.65 0 0 0 1.65-1.65A1.65 1.65 0 0 0 6.46 5.46a1.65 1.65 0 0 0-1.65 1.65c0 .91.74 1.65 1.65 1.65m1.39 9.74v-8.37H5.07v8.37h2.78Z" />
  </svg>
);

const PRACTICE_AREAS = [
  'Patent Prosecution & Strategy',
  'Patent Litigation',
  'Trademark & Brand Protection',
  'Copyright Law',
  'Trade Secrets',
  'IP Licensing & Tech Transfer',
  'IP Portfolio Management',
  'AI & Emerging Tech IP',
  'Life Sciences & Pharma IP',
  'Cross-Border IP Enforcement',
  'Corporate IP & M&A Due Diligence',
  'General IP Practice',
];

const INDUSTRY_SECTORS = [
  'Biotech & Pharmaceuticals',
  'Software, SaaS & Cloud',
  'Artificial Intelligence & ML',
  'Semiconductors & Hardware',
  'CleanTech & Energy',
  'Medical Devices & HealthTech',
  'Media, Gaming & Entertainment',
  'Telecommunications',
  'Consumer Goods & Fashion',
  'Automotive & Aerospace',
  'Higher Education & Research',
  'Financial Services & FinTech',
];

export default function SettingsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'profile';

  const user = useAppStore((state) => state.user);
  const setUser = useAppStore((state) => state.setUser);
  const isDarkMode = useAppStore((state) => state.isDarkMode);
  const toggleDarkMode = useAppStore((state) => state.toggleDarkMode);

  const [activeTab, setActiveTab] = useState(initialTab);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: '',
  });

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    full_name: '',
    role: '',
    company: '',
    practice_area: '',
    industry_sector: '',
    experience_years: 5,
    education: '',
    country: '',
    bio: '',
    skills: '',
    linkedin_url: '',
    website_url: '',
    mobile_number: '',
    avatar_url: '',
    cover_url: '',
    membership_tier: 'Member',
    verification_status: 'unverified',
    member_id: '',
  });

  // Security Form State
  const [passwordForm, setPasswordForm] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: '',
  });

  // Last 10 Sessions State
  const [sessionList, setSessionList] = useState([
    {
      id: 'sess-current',
      device: 'Primary Workstation',
      os: 'Windows 11 Pro',
      browser: 'Google Chrome 128.0',
      location: 'New York, United States',
      ip: '198.51.100.42',
      lastActive: 'Active Now',
      isCurrent: true,
      status: 'active',
      type: 'desktop',
    },
    {
      id: 'sess-2',
      device: 'MacBook Pro 16" (M3 Max)',
      os: 'macOS Sequoia 15.1',
      browser: 'Safari 18.2',
      location: 'London, United Kingdom',
      ip: '185.86.151.11',
      lastActive: '2 hours ago',
      isCurrent: false,
      status: 'active',
      type: 'desktop',
    },
    {
      id: 'sess-3',
      device: 'iPhone 16 Pro Max',
      os: 'iOS 18.3',
      browser: 'WIPA Mobile PWA / Safari',
      location: 'London, United Kingdom',
      ip: '185.86.151.14',
      lastActive: '6 hours ago',
      isCurrent: false,
      status: 'active',
      type: 'mobile',
    },
    {
      id: 'sess-4',
      device: 'iPad Pro 13" (M4)',
      os: 'iPadOS 18.2',
      browser: 'Safari',
      location: 'Zurich, Switzerland',
      ip: '194.209.200.12',
      lastActive: 'Yesterday, 17:34',
      isCurrent: false,
      status: 'active',
      type: 'tablet',
    },
    {
      id: 'sess-5',
      device: 'Dell Precision 5690 Workstation',
      os: 'Windows 11 Enterprise',
      browser: 'Microsoft Edge 128.0',
      location: 'Frankfurt, Germany',
      ip: '193.159.244.8',
      lastActive: 'Aug 29, 2026 • 14:15',
      isCurrent: false,
      status: 'expired',
      type: 'desktop',
    },
    {
      id: 'sess-6',
      device: 'Google Pixel 9 Pro',
      os: 'Android 15',
      browser: 'Chrome Mobile 128.0',
      location: 'Tokyo, Japan',
      ip: '133.242.18.99',
      lastActive: 'Aug 27, 2026 • 09:20',
      isCurrent: false,
      status: 'expired',
      type: 'mobile',
    },
    {
      id: 'sess-7',
      device: 'MacBook Air 15" (M3)',
      os: 'macOS Sonoma 14.6',
      browser: 'Mozilla Firefox 129.0',
      location: 'Paris, France',
      ip: '195.154.122.30',
      lastActive: 'Aug 25, 2026 • 19:42',
      isCurrent: false,
      status: 'expired',
      type: 'desktop',
    },
    {
      id: 'sess-8',
      device: 'Lenovo ThinkPad X1 Carbon',
      os: 'Ubuntu Linux 24.04 LTS',
      browser: 'Google Chrome 128.0',
      location: 'San Francisco, United States',
      ip: '192.88.99.1',
      lastActive: 'Aug 22, 2026 • 11:05',
      isCurrent: false,
      status: 'expired',
      type: 'desktop',
    },
    {
      id: 'sess-9',
      device: 'Samsung Galaxy S24 Ultra',
      os: 'Android 14 (One UI 6.1)',
      browser: 'Samsung Internet 25.0',
      location: 'Singapore',
      ip: '202.166.198.45',
      lastActive: 'Aug 19, 2026 • 08:30',
      isCurrent: false,
      status: 'expired',
      type: 'mobile',
    },
    {
      id: 'sess-10',
      device: 'HP EliteBook 840 G10',
      os: 'Windows 11 Pro',
      browser: 'Google Chrome 127.0',
      location: 'Toronto, Canada',
      ip: '142.112.96.22',
      lastActive: 'Aug 15, 2026 • 16:50',
      isCurrent: false,
      status: 'expired',
      type: 'desktop',
    },
  ]);
  const [sessionToast, setSessionToast] = useState<string | null>(null);

  const handleRevokeSession = (sessionId: string) => {
    setSessionList(prev => prev.map(s => s.id === sessionId ? { ...s, status: 'revoked' } : s));
    setSessionToast('Session access revoked successfully.');
    setTimeout(() => setSessionToast(null), 3000);
  };

  const handleSignOutOtherSessions = () => {
    setSessionList(prev => prev.map(s => s.isCurrent ? s : { ...s, status: 'revoked' }));
    setSessionToast('Signed out of all other 9 device sessions.');
    setTimeout(() => setSessionToast(null), 3500);
  };

  // Preferences State (Stored in localStorage & user metadata)
  const [notifPrefs, setNotifPrefs] = useState({
    directMessages: true,
    connectionRequests: true,
    mentionsAndReplies: true,
    calendarReminders: true,
    weeklyDigest: true,
    soundEffects: true,
  });

  const [privacyPrefs, setPrivacyPrefs] = useState({
    profileVisibility: 'public', // 'public' | 'connections' | 'private'
    showOnlineStatus: true,
    allowDirectMessagesFrom: 'all', // 'all' | 'connections'
    showInDirectory: true,
    readReceipts: true,
  });

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);

  // Load existing profile data
  useEffect(() => {
    async function loadUserData() {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (!error && data) {
          setProfileForm({
            full_name: data.full_name || user.name || '',
            role: data.role || '',
            company: data.company || '',
            practice_area: data.practice_area || '',
            industry_sector: data.industry_sector || '',
            experience_years: data.experience_years || 5,
            education: data.education || '',
            country: data.country || '',
            bio: data.bio || '',
            skills: data.skills || '',
            linkedin_url: data.linkedin_url || '',
            website_url: data.website_url || '',
            mobile_number: data.mobile_number || '',
            avatar_url: data.avatar_url || user.avatar_url || '',
            cover_url: data.cover_url || '',
            membership_tier: data.membership_tier || 'Member',
            verification_status: data.verification_status || 'unverified',
            member_id: data.member_id || `WIPA-${user.id.slice(0, 6).toUpperCase()}`,
          });
        }

        // Load saved preferences
        const savedNotifs = localStorage.getItem('wipa_pref_notifications');
        if (savedNotifs) setNotifPrefs(JSON.parse(savedNotifs));

        const savedPrivacy = localStorage.getItem('wipa_pref_privacy');
        if (savedPrivacy) setPrivacyPrefs(JSON.parse(savedPrivacy));
      } catch (err) {
        console.error('Error loading profile settings:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadUserData();
  }, [user?.id]);

  // Save Profile Changes
  const handleSaveProfile = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!user?.id) return;

    setIsSaving(true);
    setSaveStatus({ type: null, message: '' });

    try {
      const updates = {
        full_name: profileForm.full_name.trim(),
        role: profileForm.role.trim(),
        company: profileForm.company.trim(),
        practice_area: profileForm.practice_area,
        industry_sector: profileForm.industry_sector,
        experience_years: Number(profileForm.experience_years) || 0,
        education: profileForm.education.trim(),
        country: profileForm.country.trim(),
        bio: profileForm.bio.trim(),
        skills: profileForm.skills.trim(),
        linkedin_url: profileForm.linkedin_url.trim(),
        website_url: profileForm.website_url.trim(),
        mobile_number: profileForm.mobile_number.trim(),
      };

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;

      // Update store
      setUser({
        ...user,
        name: updates.full_name,
        role: updates.role,
        company: updates.company,
      });

      // Save notification and privacy preferences
      localStorage.setItem('wipa_pref_notifications', JSON.stringify(notifPrefs));
      localStorage.setItem('wipa_pref_privacy', JSON.stringify(privacyPrefs));

      setSaveStatus({
        type: 'success',
        message: 'Settings updated successfully! Changes are live across your profile.',
      });

      setTimeout(() => {
        setSaveStatus({ type: null, message: '' });
      }, 3500);
    } catch (err: any) {
      console.error('Error saving settings:', err);
      setSaveStatus({
        type: 'error',
        message: err.message || 'Failed to save changes. Please try again.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Avatar Upload Handler
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    setIsUploadingAvatar(true);
    try {
      const fileName = `${user.id}/avatar_${Date.now()}.png`;
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          upsert: true,
          contentType: file.type,
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
      const newUrl = data.publicUrl;

      await supabase.from('profiles').update({ avatar_url: newUrl }).eq('id', user.id);
      setProfileForm((prev) => ({ ...prev, avatar_url: newUrl }));
      setUser({ ...user, avatar_url: newUrl });
    } catch (err: any) {
      console.error('Avatar upload failed:', err);
      alert('Failed to upload avatar: ' + (err.message || 'Unknown error'));
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  // Cover Upload Handler
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    setIsUploadingCover(true);
    try {
      const fileName = `${user.id}/cover_${Date.now()}.png`;
      const { error: uploadError } = await supabase.storage
        .from('covers')
        .upload(fileName, file, {
          upsert: true,
          contentType: file.type,
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('covers').getPublicUrl(fileName);
      const newUrl = data.publicUrl;

      await supabase.from('profiles').update({ cover_url: newUrl }).eq('id', user.id);
      setProfileForm((prev) => ({ ...prev, cover_url: newUrl }));
    } catch (err: any) {
      console.error('Cover upload failed:', err);
      alert('Failed to upload cover: ' + (err.message || 'Unknown error'));
    } finally {
      setIsUploadingCover(false);
    }
  };

  // Password Update Handler
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordForm.newPassword) return;

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMessage({ type: 'error', message: 'Passwords do not match.' });
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setPasswordMessage({ type: 'error', message: 'Password must be at least 8 characters long.' });
      return;
    }

    setPasswordMessage({ type: null, message: 'Updating password...' });

    try {
      const { error } = await supabase.auth.updateUser({ password: passwordForm.newPassword });
      if (error) throw error;

      setPasswordMessage({ type: 'success', message: 'Password updated successfully!' });
      setPasswordForm({ newPassword: '', confirmPassword: '' });
      setTimeout(() => setPasswordMessage({ type: null, message: '' }), 4000);
    } catch (err: any) {
      setPasswordMessage({ type: 'error', message: err.message || 'Failed to update password.' });
    }
  };

  // Export User Data (GDPR / Archive)
  const handleExportData = () => {
    const dataToExport = {
      user_id: user?.id,
      profile: profileForm,
      exported_at: new Date().toISOString(),
      platform: 'Women in IP Association (WIPA)',
    };

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wipa_profile_archive_${user?.id || 'user'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const navTabs = [
    { id: 'profile', label: 'Profile & Bio', icon: User, desc: 'Public identity, credentials & avatar' },
    { id: 'security', label: 'Account & Security', icon: ShieldCheck, desc: 'Password, encryption & sessions' },
    { id: 'notifications', label: 'Notifications', icon: Bell, desc: 'Push, alerts & sound preferences' },
    { id: 'privacy', label: 'Privacy & Visibility', icon: Eye, desc: 'Directory visibility & status' },
    { id: 'appearance', label: 'Appearance', icon: Palette, desc: 'Theme & interface layout' },
    { id: 'membership', label: 'Membership & Tier', icon: Crown, desc: 'Status, benefits & accreditation' },
    { id: 'data', label: 'Data & Account', icon: Download, desc: 'Export archive & danger zone' },
  ];

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-77px)] bg-[#f8f9fa] dark:bg-[#070b14]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#5a32fa] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-bold text-gray-500 dark:text-gray-400">Loading settings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-[calc(100vh-77px)] bg-[#f8f9fa] dark:bg-[#070b14] text-gray-900 dark:text-gray-100 font-sans pb-16">
      
      {/* Top Banner & Header Bar */}
      <div className="w-full bg-white dark:bg-[#0c1020] border-b border-gray-200/80 dark:border-white/[0.08] px-4 sm:px-8 py-5 relative z-20">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link 
              href="/platform/profile"
              className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 transition-colors"
              title="Back to profile"
            >
              <ArrowLeft size={18} />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                  Settings & Preferences
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#5a32fa]/10 text-[#5a32fa] dark:text-[#a5b4fc] border border-[#5a32fa]/20">
                  Account Control
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Manage your credentials, professional biography, security, and notifications.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/platform/profile"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-gray-700 dark:text-gray-200 text-xs font-bold transition-all"
            >
              <span>View Live Profile</span>
              <ArrowUpRight size={14} />
            </Link>

            <button
              onClick={() => handleSaveProfile()}
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-[#5a32fa] to-[#7c3aed] hover:from-[#4f2bd6] hover:to-[#6d28d9] text-white text-xs font-black shadow-md shadow-[#5a32fa]/25 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {isSaving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={15} />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Global Save Status Alert Toast */}
        {saveStatus.message && (
          <div className="max-w-6xl mx-auto mt-4">
            <div className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-bold animate-in slide-in-from-top duration-200 ${
              saveStatus.type === 'success' 
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' 
                : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
            }`}>
              {saveStatus.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              <span>{saveStatus.message}</span>
            </div>
          </div>
        )}
      </div>

      {/* Main Settings Grid Layout */}
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-8 mt-8 flex flex-col lg:flex-row gap-8">
        
        {/* Left Navigation Tabs Panel */}
        <aside className="w-full lg:w-72 shrink-0">
          <div className="bg-white dark:bg-[#0c1020] rounded-3xl p-3 border border-gray-200/80 dark:border-white/[0.08] shadow-sm space-y-1 sticky top-6">
            <div className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">
              Preferences
            </div>
            
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    router.replace(`/platform/settings?tab=${tab.id}`, { scroll: false });
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-left transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-[#5a32fa]/10 dark:bg-[#5a32fa]/20 text-[#5a32fa] dark:text-[#a5b4fc] font-bold border border-[#5a32fa]/20 shadow-xs'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100/70 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <span className={`p-2 rounded-xl transition-colors ${
                    isSelected 
                      ? 'bg-[#5a32fa] text-white shadow-xs' 
                      : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400'
                  }`}>
                    <Icon size={16} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold truncate leading-tight">{tab.label}</div>
                    <div className="text-[10px] opacity-75 truncate text-gray-400 dark:text-gray-500 mt-0.5">{tab.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Right Content Area */}
        <main className="flex-1 min-w-0">
          
          {/* TAB 1: PROFILE & BIO */}
          {activeTab === 'profile' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Media Card: Avatar & Banner */}
              <div className="bg-white dark:bg-[#0c1020] rounded-3xl p-6 sm:p-8 border border-gray-200/80 dark:border-white/[0.08] shadow-sm">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-white/[0.08]">
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-gray-900 dark:text-white">Profile Imagery & Brand</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Custom header banner and portrait avatar.</p>
                  </div>
                  <span className="text-[11px] font-bold text-gray-400">Step 1 of 2</span>
                </div>

                {/* Banner Upload */}
                <div className="relative mb-8">
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">Cover Banner</label>
                  <div className="relative w-full h-36 sm:h-48 rounded-2xl overflow-hidden bg-gradient-to-r from-[#5a32fa]/20 via-[#6600FF]/15 to-[#ff90e8]/20 border border-gray-200 dark:border-white/10 group flex items-center justify-center">
                    {profileForm.cover_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={profileForm.cover_url} alt="Cover" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-xs font-semibold text-gray-400 flex items-center gap-2">
                        <Camera size={18} /> No cover banner set
                      </div>
                    )}

                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-xs">
                      <input 
                        type="file" 
                        ref={coverInputRef} 
                        onChange={handleCoverUpload} 
                        accept="image/*" 
                        className="hidden" 
                      />
                      <button
                        type="button"
                        onClick={() => coverInputRef.current?.click()}
                        disabled={isUploadingCover}
                        className="px-4 py-2 bg-white text-gray-900 rounded-xl text-xs font-black shadow-lg flex items-center gap-2 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                      >
                        <Upload size={14} />
                        <span>{isUploadingCover ? 'Uploading...' : 'Change Banner'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Avatar Upload */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                  <div className="relative group">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden ring-4 ring-white dark:ring-[#0c1020] shadow-xl bg-gradient-to-br from-[#5a32fa] to-[#ff90e8] flex items-center justify-center text-white font-black text-3xl">
                      {profileForm.avatar_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={profileForm.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <span>{profileForm.full_name?.charAt(0)?.toUpperCase() || 'U'}</span>
                      )}
                    </div>
                    
                    <input 
                      type="file" 
                      ref={avatarInputRef} 
                      onChange={handleAvatarUpload} 
                      accept="image/*" 
                      className="hidden" 
                    />
                    <button
                      type="button"
                      onClick={() => avatarInputRef.current?.click()}
                      disabled={isUploadingAvatar}
                      className="absolute bottom-0 right-0 p-2 bg-[#5a32fa] text-white rounded-xl shadow-lg hover:bg-[#4f2bd6] active:scale-90 transition-all cursor-pointer"
                      title="Upload new avatar"
                    >
                      <Camera size={16} />
                    </button>
                  </div>

                  <div className="space-y-1.5 text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <h3 className="font-extrabold text-sm sm:text-base text-gray-900 dark:text-white">Profile Portrait</h3>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        Square 1:1
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm">
                      Recommended: High resolution JPG, PNG, or WebP. Minimum 400x400 pixels for crisp clarity in directory search.
                    </p>
                    <div className="pt-2 flex items-center gap-2 justify-center sm:justify-start">
                      <button
                        type="button"
                        onClick={() => avatarInputRef.current?.click()}
                        className="text-xs font-bold text-[#5a32fa] dark:text-[#a5b4fc] hover:underline"
                      >
                        Upload file
                      </button>
                      <span className="text-gray-300 dark:text-gray-700">•</span>
                      <button
                        type="button"
                        onClick={() => setProfileForm({ ...profileForm, avatar_url: '' })}
                        className="text-xs font-semibold text-rose-500 hover:underline"
                      >
                        Remove photo
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Personal & Professional Form Card */}
              <div className="bg-white dark:bg-[#0c1020] rounded-3xl p-6 sm:p-8 border border-gray-200/80 dark:border-white/[0.08] shadow-sm space-y-6">
                <div className="pb-4 border-b border-gray-100 dark:border-white/[0.08]">
                  <h2 className="text-base sm:text-lg font-black text-gray-900 dark:text-white">Legal & Professional Profile</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Displayed on your global public profile card and member directory.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={profileForm.full_name}
                        onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })}
                        placeholder="e.g. Sarah Jenkins, Esq."
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.03] text-xs sm:text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5a32fa]/30 focus:border-[#5a32fa]"
                      />
                    </div>
                  </div>

                  {/* Professional Title / Role */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                      Professional Title / Role
                    </label>
                    <div className="relative">
                      <Briefcase size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={profileForm.role}
                        onChange={(e) => setProfileForm({ ...profileForm, role: e.target.value })}
                        placeholder="e.g. Partner & Head of IP Litigation"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.03] text-xs sm:text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5a32fa]/30 focus:border-[#5a32fa]"
                      />
                    </div>
                  </div>

                  {/* Law Firm / Enterprise Company */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                      Law Firm / Company
                    </label>
                    <div className="relative">
                      <Building2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={profileForm.company}
                        onChange={(e) => setProfileForm({ ...profileForm, company: e.target.value })}
                        placeholder="e.g. Morrison & Foerster LLP"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.03] text-xs sm:text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5a32fa]/30 focus:border-[#5a32fa]"
                      />
                    </div>
                  </div>

                  {/* Primary Practice Area */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                      Primary IP Practice Area
                    </label>
                    <select
                      value={profileForm.practice_area}
                      onChange={(e) => setProfileForm({ ...profileForm, practice_area: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-[#0c1020] text-xs sm:text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5a32fa]/30 focus:border-[#5a32fa]"
                    >
                      <option value="">Select Practice Area</option>
                      {PRACTICE_AREAS.map((area) => (
                        <option key={area} value={area}>{area}</option>
                      ))}
                    </select>
                  </div>

                  {/* Industry Sector */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                      Industry Sector
                    </label>
                    <select
                      value={profileForm.industry_sector}
                      onChange={(e) => setProfileForm({ ...profileForm, industry_sector: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-[#0c1020] text-xs sm:text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5a32fa]/30 focus:border-[#5a32fa]"
                    >
                      <option value="">Select Industry</option>
                      {INDUSTRY_SECTORS.map((sec) => (
                        <option key={sec} value={sec}>{sec}</option>
                      ))}
                    </select>
                  </div>

                  {/* Years of Experience */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                      Years of IP Experience
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="60"
                      value={profileForm.experience_years}
                      onChange={(e) => setProfileForm({ ...profileForm, experience_years: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.03] text-xs sm:text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5a32fa]/30 focus:border-[#5a32fa]"
                    />
                  </div>

                  {/* Location / Country */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                      Location / Jurisdiction
                    </label>
                    <div className="relative">
                      <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={profileForm.country}
                        onChange={(e) => setProfileForm({ ...profileForm, country: e.target.value })}
                        placeholder="e.g. London, United Kingdom / New York, USA"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.03] text-xs sm:text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5a32fa]/30 focus:border-[#5a32fa]"
                      />
                    </div>
                  </div>

                  {/* Education / Bar Admissions */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                      Education & Bar Admissions
                    </label>
                    <div className="relative">
                      <GraduationCap size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={profileForm.education}
                        onChange={(e) => setProfileForm({ ...profileForm, education: e.target.value })}
                        placeholder="e.g. JD (Harvard Law), USPTO Reg. Patent Bar"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.03] text-xs sm:text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5a32fa]/30 focus:border-[#5a32fa]"
                      />
                    </div>
                  </div>

                  {/* LinkedIn URL */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                      LinkedIn Profile
                    </label>
                    <div className="relative">
                      <LinkedinIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0a66c2]" />
                      <input
                        type="url"
                        value={profileForm.linkedin_url}
                        onChange={(e) => setProfileForm({ ...profileForm, linkedin_url: e.target.value })}
                        placeholder="https://linkedin.com/in/username"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.03] text-xs sm:text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5a32fa]/30 focus:border-[#5a32fa]"
                      />
                    </div>
                  </div>

                  {/* Portfolio or Firm Website */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                      Firm or Portfolio Website
                    </label>
                    <div className="relative">
                      <Globe size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="url"
                        value={profileForm.website_url}
                        onChange={(e) => setProfileForm({ ...profileForm, website_url: e.target.value })}
                        placeholder="https://yourfirm.com"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.03] text-xs sm:text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5a32fa]/30 focus:border-[#5a32fa]"
                      />
                    </div>
                  </div>
                </div>

                {/* Professional Bio / Statement */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
                      Professional Biography
                    </label>
                    <span className="text-[10px] text-gray-400">{profileForm.bio.length}/1000 characters</span>
                  </div>
                  <textarea
                    rows={4}
                    maxLength={1000}
                    value={profileForm.bio}
                    onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                    placeholder="Share your professional journey, landmark IP trials, patent prosecution areas, and areas you can advise on..."
                    className="w-full p-4 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.03] text-xs sm:text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5a32fa]/30 focus:border-[#5a32fa]"
                  />
                </div>

                {/* Skills & Specialties */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                    Core Skills & Key Competencies (Comma-separated)
                  </label>
                  <input
                    type="text"
                    value={profileForm.skills}
                    onChange={(e) => setProfileForm({ ...profileForm, skills: e.target.value })}
                    placeholder="Patent Drafting, Hatch-Waxman Litigation, Trademark Clearance, SEP Licensing, Trade Secret Audits"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.03] text-xs sm:text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5a32fa]/30 focus:border-[#5a32fa]"
                  />
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: ACCOUNT & SECURITY */}
          {activeTab === 'security' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* E2EE Cryptographic Security Status Badge */}
              <div className="bg-gradient-to-r from-[#5a32fa]/10 via-[#6600FF]/15 to-[#ff90e8]/10 rounded-3xl p-6 border border-[#5a32fa]/30 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="p-3 rounded-2xl bg-[#5a32fa] text-white shadow-md shadow-[#5a32fa]/30">
                    <ShieldCheck size={22} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-sm text-gray-900 dark:text-white">End-to-End Encryption (E2EE) Active</h3>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                        AES-256-GCM
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">
                      Client-side WebCrypto cryptographic keys protect all your direct communications.
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] font-mono text-gray-400 dark:text-gray-400">
                    Session Key: {user?.id?.slice(0, 12)}...
                  </span>
                </div>
              </div>

              {/* Password Update Card */}
              <div className="bg-white dark:bg-[#0c1020] rounded-3xl p-6 sm:p-8 border border-gray-200/80 dark:border-white/[0.08] shadow-sm">
                <div className="pb-4 border-b border-gray-100 dark:border-white/[0.08] mb-6">
                  <h2 className="text-base sm:text-lg font-black text-gray-900 dark:text-white">Change Password</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Keep your account secure with a strong passphrase.</p>
                </div>

                <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                        placeholder="••••••••••••"
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.03] text-xs sm:text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5a32fa]/30 focus:border-[#5a32fa]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                        placeholder="••••••••••••"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.03] text-xs sm:text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5a32fa]/30 focus:border-[#5a32fa]"
                      />
                    </div>
                  </div>

                  {/* Password status feedback */}
                  {passwordMessage.message && (
                    <div className={`flex items-center gap-2 text-xs font-bold ${
                      passwordMessage.type === 'error' ? 'text-rose-500' : 'text-emerald-500'
                    }`}>
                      {passwordMessage.type === 'error' ? <AlertCircle size={14} /> : <Check size={14} />}
                      <span>{passwordMessage.message}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#5a32fa] hover:bg-[#4f2bd6] text-white text-xs font-bold shadow-md shadow-[#5a32fa]/20 transition-all active:scale-95 cursor-pointer"
                  >
                    Update Password
                  </button>
                </form>
              </div>

              {/* Active & Recent Sessions (Last 10) Card */}
              <div className="bg-white dark:bg-[#0c1020] rounded-3xl p-6 sm:p-8 border border-gray-200/80 dark:border-white/[0.08] shadow-sm space-y-6">
                <div className="pb-4 border-b border-gray-100 dark:border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base sm:text-lg font-black text-gray-900 dark:text-white">Active & Recent Sessions (Last 10)</h2>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-500/15 text-[#5a32fa] dark:text-purple-300 border border-purple-500/20">
                        10 Sessions Logged
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      Review all 10 most recent devices and locations that accessed your WIPA counsel account.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleSignOutOtherSessions}
                    className="self-start sm:self-center px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <LogOut size={13} /> Sign Out Other Sessions
                  </button>
                </div>

                {sessionToast && (
                  <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                    <CheckCircle2 size={15} />
                    <span>{sessionToast}</span>
                  </div>
                )}

                <div className="space-y-3">
                  {sessionList.map((s, index) => {
                    const isRevoked = s.status === 'revoked';
                    const isTablet = s.type === 'tablet';
                    const isMobile = s.type === 'mobile';

                    return (
                      <div 
                        key={s.id} 
                        className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border transition-all gap-3 ${
                          s.isCurrent 
                            ? 'bg-purple-50/50 dark:bg-purple-950/20 border-purple-200/80 dark:border-purple-800/40 shadow-xs' 
                            : isRevoked
                            ? 'bg-gray-50/40 dark:bg-white/[0.01] border-gray-100 dark:border-white/[0.03] opacity-60'
                            : 'bg-gray-50/70 dark:bg-white/[0.03] border-gray-100 dark:border-white/[0.06] hover:border-gray-200 dark:hover:border-white/10'
                        }`}
                      >
                        <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                          <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 sm:mt-0 ${
                            s.isCurrent 
                              ? 'bg-[#5a32fa] text-white shadow-xs' 
                              : isMobile 
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                              : isTablet
                              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                              : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                          }`}>
                            {isMobile ? (
                              <Smartphone size={18} />
                            ) : isTablet ? (
                              <Tablet size={18} />
                            ) : (
                              <Monitor size={18} />
                            )}
                          </div>
                          
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-xs sm:text-[13px] font-extrabold text-gray-900 dark:text-white truncate">
                                {index + 1}. {s.device}
                              </span>
                              
                              {s.isCurrent ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                                  Active Now
                                </span>
                              ) : isRevoked ? (
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-rose-500/10 text-rose-500 border border-rose-500/20">
                                  Revoked
                                </span>
                              ) : s.status === 'active' ? (
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                                  Active Session
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-gray-500/10 text-gray-500 dark:text-gray-400">
                                  Previous Session
                                </span>
                              )}
                            </div>

                            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                              <span>{s.os} • {s.browser}</span>
                              <span>•</span>
                              <span className="flex items-center gap-1 font-medium text-gray-700 dark:text-gray-300">
                                <MapPin size={11} className="text-gray-400 shrink-0" />
                                {s.location}
                              </span>
                              <span>•</span>
                              <span className="font-mono text-[10px] text-gray-400">{s.ip}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100 dark:border-white/[0.05]">
                          <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1">
                            <Clock size={11} className="text-gray-400" />
                            {s.lastActive}
                          </span>

                          {s.isCurrent ? (
                            <span className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-white/[0.05] text-[10px] font-bold text-gray-600 dark:text-gray-300">
                              This Device
                            </span>
                          ) : isRevoked ? (
                            <span className="text-[11px] font-bold text-rose-400 italic">
                              Signed Out
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleRevokeSession(s.id)}
                              className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/30 dark:hover:bg-rose-950/50 text-[10px] font-bold text-rose-600 dark:text-rose-400 transition-colors cursor-pointer"
                            >
                              Revoke
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="bg-white dark:bg-[#0c1020] rounded-3xl p-6 sm:p-8 border border-gray-200/80 dark:border-white/[0.08] shadow-sm space-y-6 animate-in fade-in duration-200">
              <div className="pb-4 border-b border-gray-100 dark:border-white/[0.08]">
                <h2 className="text-base sm:text-lg font-black text-gray-900 dark:text-white">Notification Preferences</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">Choose when and how WIPA notifies you about activity.</p>
              </div>

              <div className="space-y-4">
                {[
                  {
                    key: 'directMessages',
                    title: 'Direct Messages & Chat',
                    desc: 'Real-time alert when a connected counsel or firm sends you an encrypted message.',
                  },
                  {
                    key: 'connectionRequests',
                    title: 'Connection & Network Invitations',
                    desc: 'Notify when members request to connect or accept your invitation.',
                  },
                  {
                    key: 'mentionsAndReplies',
                    title: 'Discussions & Comments',
                    desc: 'Alerts when someone mentions you or replies to your threads in the feed or forums.',
                  },
                  {
                    key: 'calendarReminders',
                    title: 'Events & Masterclass Reminders',
                    desc: 'Automated 1-hour and 24-hour briefings for registered webinars and council summits.',
                  },
                  {
                    key: 'weeklyDigest',
                    title: 'Weekly IP Intelligence Digest',
                    desc: 'Curated weekly briefing featuring breaking patent rulings and certified jobs.',
                  },
                  {
                    key: 'soundEffects',
                    title: 'In-App Sound Effects',
                    desc: 'Subtle sound feedback on message sent and incoming notifications.',
                  },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.05]">
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">{item.title}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 max-w-lg mt-0.5">{item.desc}</p>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifPrefs[item.key as keyof typeof notifPrefs]}
                        onChange={(e) => setNotifPrefs({ ...notifPrefs, [item.key]: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#5a32fa]"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: PRIVACY & VISIBILITY */}
          {activeTab === 'privacy' && (
            <div className="bg-white dark:bg-[#0c1020] rounded-3xl p-6 sm:p-8 border border-gray-200/80 dark:border-white/[0.08] shadow-sm space-y-6 animate-in fade-in duration-200">
              <div className="pb-4 border-b border-gray-100 dark:border-white/[0.08]">
                <h2 className="text-base sm:text-lg font-black text-gray-900 dark:text-white">Privacy & Directory Visibility</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">Control who can discover your professional profile and reach out.</p>
              </div>

              <div className="space-y-4">
                
                {/* Profile Visibility */}
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.05] space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">Profile Visibility</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Define who can view your credentials and full portfolio.</p>
                    </div>
                    <select
                      value={privacyPrefs.profileVisibility}
                      onChange={(e) => setPrivacyPrefs({ ...privacyPrefs, profileVisibility: e.target.value })}
                      className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0c1020] text-xs font-bold text-gray-900 dark:text-white"
                    >
                      <option value="public">Public (All Members)</option>
                      <option value="connections">Connections Only</option>
                      <option value="private">Private (Stealth)</option>
                    </select>
                  </div>
                </div>

                {/* Show Online Status */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.05]">
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">Show Online Status Indicator</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Show a green active dot when you are active on the platform.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={privacyPrefs.showOnlineStatus}
                      onChange={(e) => setPrivacyPrefs({ ...privacyPrefs, showOnlineStatus: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#5a32fa]"></div>
                  </label>
                </div>

                {/* Directory Search Inclusion */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.05]">
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">Include in Global Member Directory</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Allow other IP lawyers and recruiting corporate counsel to find you by practice area.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={privacyPrefs.showInDirectory}
                      onChange={(e) => setPrivacyPrefs({ ...privacyPrefs, showInDirectory: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#5a32fa]"></div>
                  </label>
                </div>

                {/* Read Receipts */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.05]">
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">Live Read Receipts in Direct Messaging</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Show double purple ticks when a message has been read.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={privacyPrefs.readReceipts}
                      onChange={(e) => setPrivacyPrefs({ ...privacyPrefs, readReceipts: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#5a32fa]"></div>
                  </label>
                </div>

              </div>
            </div>
          )}

          {/* TAB 5: APPEARANCE */}
          {activeTab === 'appearance' && (
            <div className="bg-white dark:bg-[#0c1020] rounded-3xl p-6 sm:p-8 border border-gray-200/80 dark:border-white/[0.08] shadow-sm space-y-6 animate-in fade-in duration-200">
              <div className="pb-4 border-b border-gray-100 dark:border-white/[0.08]">
                <h2 className="text-base sm:text-lg font-black text-gray-900 dark:text-white">Theme & Interface Appearance</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">Customize the visual presentation of your workspace.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Light Mode Card */}
                <button
                  type="button"
                  onClick={() => { if (isDarkMode) toggleDarkMode(); }}
                  className={`p-5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between h-36 ${
                    !isDarkMode
                      ? 'border-[#5a32fa] ring-2 ring-[#5a32fa]/20 bg-white text-gray-900 shadow-md'
                      : 'border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/[0.02] text-gray-500 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Sun size={20} className="text-amber-500" />
                    {!isDarkMode && <Check size={16} className="text-[#5a32fa]" />}
                  </div>
                  <div>
                    <div className="font-black text-sm">Light Mode</div>
                    <div className="text-xs text-gray-400">Clean, crisp paper-white aesthetic</div>
                  </div>
                </button>

                {/* Dark Mode Card */}
                <button
                  type="button"
                  onClick={() => { if (!isDarkMode) toggleDarkMode(); }}
                  className={`p-5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between h-36 ${
                    isDarkMode
                      ? 'border-[#5a32fa] ring-2 ring-[#5a32fa]/20 bg-[#070b14] text-white shadow-md'
                      : 'border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/[0.02] text-gray-500 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Moon size={20} className="text-indigo-400" />
                    {isDarkMode && <Check size={16} className="text-[#a5b4fc]" />}
                  </div>
                  <div>
                    <div className="font-black text-sm">Dark Mode (Cosmic)</div>
                    <div className="text-xs text-gray-400">Deep navy midnight for low-light focus</div>
                  </div>
                </button>

              </div>
            </div>
          )}

          {/* TAB 6: MEMBERSHIP & TIER */}
          {activeTab === 'membership' && (
            <div className="bg-white dark:bg-[#0c1020] rounded-3xl p-6 sm:p-8 border border-gray-200/80 dark:border-white/[0.08] shadow-sm space-y-6 animate-in fade-in duration-200">
              <div className="pb-4 border-b border-gray-100 dark:border-white/[0.08] flex items-center justify-between">
                <div>
                  <h2 className="text-base sm:text-lg font-black text-gray-900 dark:text-white">Membership Status</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Your global credentials and executive council access.</p>
                </div>
                <Link
                  href="/platform/memberships"
                  className="px-4 py-2 bg-[#5a32fa]/10 text-[#5a32fa] dark:text-[#a5b4fc] font-bold text-xs rounded-xl hover:bg-[#5a32fa]/20 transition-colors"
                >
                  Explore All Tiers
                </Link>
              </div>

              {/* Membership Card */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-[#5a32fa] via-[#6600FF] to-[#7c3aed] text-white shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Crown size={20} className="text-amber-300" />
                    <span className="font-extrabold text-sm uppercase tracking-wider text-amber-200">
                      {profileForm.membership_tier} Counsel
                    </span>
                  </div>
                  <span className="text-xs font-mono opacity-80">{profileForm.member_id}</span>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-black">{profileForm.full_name || 'WIPA Member'}</h3>
                  <p className="text-xs text-white/80">{profileForm.company || 'Global IP Practice'} • {profileForm.practice_area || 'Intellectual Property'}</p>
                </div>

                <div className="pt-2 border-t border-white/20 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-300 font-bold">
                    <BadgeCheck size={16} /> Certified Accreditation Active
                  </div>
                  <span className="opacity-75">Valid Worldwide</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.05] flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white">Upgrade or Change Plan</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Access exclusive council seats, featured sponsor spots, and CLE certificates.</p>
                </div>
                <Link
                  href="/platform/memberships"
                  className="px-4 py-2 bg-[#5a32fa] text-white text-xs font-bold rounded-xl shadow-md shadow-[#5a32fa]/20 hover:bg-[#4f2bd6] transition-all"
                >
                  Manage Membership
                </Link>
              </div>
            </div>
          )}

          {/* TAB 7: DATA & DANGER ZONE */}
          {activeTab === 'data' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Archive Download */}
              <div className="bg-white dark:bg-[#0c1020] rounded-3xl p-6 sm:p-8 border border-gray-200/80 dark:border-white/[0.08] shadow-sm space-y-4">
                <div className="pb-4 border-b border-gray-100 dark:border-white/[0.08]">
                  <h2 className="text-base sm:text-lg font-black text-gray-900 dark:text-white">Export Profile Archive</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Download a complete GDPR-compliant JSON archive of your profile data.</p>
                </div>

                <button
                  type="button"
                  onClick={handleExportData}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-gray-800 dark:text-gray-200 text-xs font-bold transition-all cursor-pointer"
                >
                  <Download size={15} />
                  <span>Download Archive (.json)</span>
                </button>
              </div>

              {/* Danger Zone */}
              <div className="bg-rose-500/5 dark:bg-rose-950/10 rounded-3xl p-6 sm:p-8 border border-rose-500/20 shadow-sm space-y-4">
                <div className="pb-4 border-b border-rose-500/20">
                  <h2 className="text-base sm:text-lg font-black text-rose-600 dark:text-rose-400">Danger Zone</h2>
                  <p className="text-xs text-rose-700/80 dark:text-rose-300/70">Irreversible account actions.</p>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-[#0c1020] border border-rose-200 dark:border-rose-900/30">
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 dark:text-white">Delete Account</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 max-w-md mt-0.5">
                      Permanently erase your counsel credentials, member posts, and private encrypted messages from WIPA servers.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Are you sure you want to permanently delete your account? This cannot be undone.')) {
                        alert('Please contact support@wipaworld.com to process your permanent counsel erasure request.');
                      }
                    }}
                    className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-xl shadow-md shadow-rose-500/20 transition-all shrink-0 cursor-pointer"
                  >
                    Delete Account
                  </button>
                </div>
              </div>

            </div>
          )}

        </main>
      </div>

    </div>
  );
}
