// @ts-nocheck
'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { 
  User, ShieldCheck, Bell, Eye, Palette, Crown, Download, Trash2, 
  Camera, Upload, Check, AlertCircle, Sparkles, Key, Lock, Mail, 
  Phone, Globe, Building2, Briefcase, MapPin, GraduationCap,
  Save, ArrowLeft, ArrowUpRight, CheckCircle2, Shield, Smartphone, 
  Monitor, RefreshCw, LogOut, HelpCircle, EyeOff, Moon, Sun, Volume2, 
  Sliders, FileText, BadgeCheck, Zap, Tablet, Clock, ChevronRight,
  Bookmark, Heart, History, UserPlus, Info, Settings as SettingsIcon,
  Share2, X, ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/store/useAppStore';
import { DotmCircular7 as Loader2 } from '@/components/ui/dotm-circular-7';
import { 
  DeviceSession, 
  loadUserSessionsFromDb, 
  syncCurrentSessionWithDb, 
  revokeSessionInDb, 
  signOutOtherSessionsInDb 
} from '@/lib/device';

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

const MetaIcon = ({ size = 18, className = "" }: { size?: number, className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M16.96 4C14.34 4 12.82 5.56 12 6.78C11.18 5.56 9.66 4 7.04 4C3.76 4 1 6.85 1 10.87C1 15.7 5.16 19.5 11.23 20c.48.04 1.06.04 1.54 0C18.84 19.5 23 15.7 23 10.87C23 6.85 20.24 4 16.96 4zm-9.92 13.88c-4.47-.41-7.24-3.41-7.24-7.01C-0.2 7.82 1.83 5.8 4.6 5.8c2.14 0 3.42 1.47 4.19 2.76c.4.67.75 1.43 1.21 2.37l-3.2 6.95zm5.96-.05c-.48.03-.98.03-1.46 0l2.36-5.11c.36-.78.69-1.48 1.03-2.12c.76-1.43 2.16-3.2 4.41-3.2c2.78 0 4.8 2.02 4.8 5.07c0 3.6-2.77 6.6-7.14 7.36l-4-2z" />
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

function SettingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabFromUrl = searchParams.get('tab');

  const user = useAppStore((state) => state.user);
  const setUser = useAppStore((state) => state.setUser);
  const isDarkMode = useAppStore((state) => state.isDarkMode);
  const toggleDarkMode = useAppStore((state) => state.toggleDarkMode);

  // If a tab is present in URL, activeTab is set; otherwise null on mobile for the main list
  const [activeTab, setActiveTab] = useState<string | null>(tabFromUrl);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: '',
  });

  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);

  useEffect(() => {
    setActiveTab(searchParams.get('tab'));
  }, [searchParams]);

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

  // Real DB Active Sessions State
  const [sessionList, setSessionList] = useState<DeviceSession[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);
  const [isRevokingId, setIsRevokingId] = useState<string | null>(null);
  const [isSigningOutOthers, setIsSigningOutOthers] = useState(false);
  const [sessionToast, setSessionToast] = useState<string | null>(null);

  // Fetch real sessions from database and sync current device
  useEffect(() => {
    if (!user?.id) return;
    let cancelled = false;

    async function initSessions() {
      setIsLoadingSessions(true);
      try {
        // Sync current device with real IP, location, OS, browser
        await syncCurrentSessionWithDb(user.id);

        // Fetch all active sessions from Supabase DB
        const dbSessions = await loadUserSessionsFromDb(user.id);
        if (!cancelled) {
          setSessionList(dbSessions);
        }
      } catch (err) {
        console.error('Error initializing device sessions:', err);
      } finally {
        if (!cancelled) {
          setIsLoadingSessions(false);
        }
      }
    }

    initSessions();

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const handleRevokeSession = async (sessionId: string) => {
    if (!user?.id || isRevokingId) return;
    setIsRevokingId(sessionId);

    // Optimistically update UI
    setSessionList(prev => prev.map(s => s.id === sessionId ? { ...s, status: 'revoked' } : s));

    // Real database deletion
    const ok = await revokeSessionInDb(user.id, sessionId);
    if (ok) {
      setSessionToast('Session access revoked and removed from database.');
    } else {
      setSessionToast('Session marked as revoked.');
    }
    setIsRevokingId(null);
    setTimeout(() => setSessionToast(null), 3000);
  };

  const handleSignOutOtherSessions = async () => {
    if (!user?.id || isSigningOutOthers) return;
    setIsSigningOutOthers(true);

    const currentSession = sessionList.find(s => s.isCurrent);
    const countToRevoke = sessionList.filter(s => !s.isCurrent && s.status !== 'revoked').length;

    // Optimistically update UI
    setSessionList(prev => prev.map(s => s.isCurrent ? s : { ...s, status: 'revoked' }));

    // Real database deletion
    const ok = await signOutOtherSessionsInDb(user.id, currentSession?.id);
    if (ok) {
      setSessionToast(`Signed out of all other ${countToRevoke} device sessions in database.`);
    } else {
      setSessionToast('Sessions marked as signed out.');
    }
    setIsSigningOutOthers(false);
    setTimeout(() => setSessionToast(null), 3500);
  };

  // Preferences State
  const [notifPrefs, setNotifPrefs] = useState({
    directMessages: true,
    connectionRequests: true,
    mentionsAndReplies: true,
    calendarReminders: true,
    weeklyDigest: true,
    soundEffects: true,
  });

  const [privacyPrefs, setPrivacyPrefs] = useState({
    profileVisibility: 'public',
    showOnlineStatus: true,
    allowDirectMessagesFrom: 'all',
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

      setUser({
        ...user,
        name: updates.full_name,
        role: updates.role,
        company: updates.company,
      });

      localStorage.setItem('wipa_pref_notifications', JSON.stringify(notifPrefs));
      localStorage.setItem('wipa_pref_privacy', JSON.stringify(privacyPrefs));

      setSaveStatus({
        type: 'success',
        message: 'Settings saved successfully!',
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

  // Export User Data
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

  const handleSelectTab = (tabId: string) => {
    setActiveTab(tabId);
    router.replace(`/platform/settings?tab=${tabId}`, { scroll: false });
  };

  const handleBack = () => {
    if (activeTab) {
      setActiveTab(null);
      router.replace('/platform/settings', { scroll: false });
    } else {
      router.push('/platform/profile');
    }
  };

  // Desktop active tab defaults to 'profile' if none selected
  const effectiveDesktopTab = activeTab || 'profile';

  // Navigation Items matching the sleek Instagram Settings List
  const settingsMenuItems = [
    {
      id: 'security',
      label: 'Account & Security',
      icon: ShieldCheck,
      type: 'tab',
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      type: 'tab',
    },
    {
      id: 'privacy',
      label: 'Privacy',
      icon: Lock,
      type: 'tab',
    },
    {
      id: 'appearance',
      label: 'Appearance',
      icon: Moon,
      type: 'tab',
    },
    {
      id: 'membership',
      label: 'Membership & Tier',
      icon: Crown,
      type: 'tab',
    },
    {
      id: 'data',
      label: 'Data & Account',
      icon: Download,
      type: 'tab',
    },
    {
      id: 'saved',
      label: 'Saved',
      icon: Bookmark,
      type: 'link',
      href: '/platform/bookmarks',
    },
    {
      id: 'live_profile',
      label: 'Account Status & Live Profile',
      icon: User,
      type: 'link',
      href: '/platform/profile',
    },
    {
      id: 'help',
      label: 'Help',
      icon: HelpCircle,
      type: 'modal',
      action: () => setShowHelpModal(true),
    },
    {
      id: 'about',
      label: 'About',
      icon: Info,
      type: 'modal',
      action: () => setShowAboutModal(true),
    },
  ];

  const getTabTitle = (tab: string | null) => {
    switch (tab) {
      case 'profile': return 'Accounts Centre';
      case 'security': return 'Account & Security';
      case 'notifications': return 'Notifications';
      case 'privacy': return 'Privacy';
      case 'appearance': return 'Appearance';
      case 'membership': return 'Membership & Tier';
      case 'data': return 'Data & Account';
      default: return 'Settings';
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-77px)] bg-white dark:bg-black">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-zinc-900 dark:border-white border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-medium text-zinc-500">Loading settings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-white dark:bg-black md:dark:bg-[#0f172a] text-zinc-900 dark:text-zinc-100 font-sans pb-24 lg:pb-12">
      
      {/* ========================================================
          TOP NAVIGATION BAR (Instagram Native Clean Header)
          ======================================================== */}
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-black/95 md:dark:bg-[#0f172a]/95 backdrop-blur-md border-b border-zinc-200/80 dark:border-white/[0.08] md:dark:border-slate-800 px-4 py-3 sm:py-3.5">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="p-1 -ml-1 text-zinc-900 dark:text-white hover:opacity-70 transition-opacity cursor-pointer flex items-center justify-center"
              aria-label="Back"
            >
              <ArrowLeft size={24} strokeWidth={2} />
            </button>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-zinc-900 dark:text-white select-none">
              {/* On mobile, show section title if tab is open, otherwise "Settings" */}
              <span className="lg:hidden">{getTabTitle(activeTab)}</span>
              {/* On desktop, show "Settings" */}
              <span className="hidden lg:inline">Settings</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Show Save Button on mobile if inside profile tab */}
            {activeTab === 'profile' && (
              <button
                onClick={() => handleSaveProfile()}
                disabled={isSaving}
                className="lg:hidden text-sm font-semibold text-[#5a32fa] dark:text-[#a5b4fc] hover:opacity-80 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            )}

            {/* Desktop right action */}
            <div className="hidden lg:flex items-center gap-3">
              <Link
                href="/platform/profile"
                className="text-xs font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                View Live Profile
              </Link>
              {effectiveDesktopTab === 'profile' && (
                <button
                  onClick={() => handleSaveProfile()}
                  disabled={isSaving}
                  className="px-4 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-900 text-xs font-semibold shadow-xs transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Global Save Alert Toast */}
        {saveStatus.message && (
          <div className="max-w-4xl mx-auto mt-2.5">
            <div className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold animate-in fade-in slide-in-from-top-1 duration-200 ${
              saveStatus.type === 'success' 
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' 
                : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
            }`}>
              {saveStatus.type === 'success' ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
              <span>{saveStatus.message}</span>
            </div>
          </div>
        )}
      </header>

      {/* ========================================================
          BODY CONTAINER
          ======================================================== */}
      <div className="max-w-4xl mx-auto w-full px-0 sm:px-4 lg:py-6">
        <div className="flex flex-col lg:flex-row gap-0 lg:gap-8 items-start">
          
          {/* ====================================================
              LEFT COLUMN: INSTAGRAM SETTINGS MENU
              (Shown on mobile if !activeTab, always shown on desktop)
              ==================================================== */}
          <div className={`w-full lg:w-80 shrink-0 ${activeTab !== null ? 'hidden lg:block' : 'block'}`}>
            <div className="py-2 lg:py-0 divide-y divide-transparent">
              
              {/* ACCOUNTS CENTRE (Featured Card at Top - Just like Screenshot) */}
              <div className="px-4 sm:px-0 mb-4 sm:mb-5">
                <div 
                  onClick={() => handleSelectTab('profile')}
                  className="p-4 rounded-2xl bg-zinc-50 dark:bg-black md:dark:bg-[#1e293b] hover:bg-zinc-100/80 dark:hover:bg-zinc-900 md:dark:hover:bg-[#334155]/60 border border-zinc-200/70 dark:border-white/[0.08] md:dark:border-slate-700/60 transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div className="flex items-center gap-3.5">
                      {profileForm.avatar_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img 
                          src={profileForm.avatar_url} 
                          alt="Avatar" 
                          className="w-12 h-12 rounded-full object-cover ring-1 ring-zinc-300 dark:ring-white/10 shrink-0" 
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-zinc-200 dark:bg-[#12182c] flex items-center justify-center text-zinc-700 dark:text-zinc-200 font-semibold text-lg shrink-0">
                          {profileForm.full_name?.charAt(0)?.toUpperCase() || <User size={22} />}
                        </div>
                      )}
                      
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[16px] font-bold text-zinc-900 dark:text-white group-hover:opacity-90">
                            Accounts Centre
                          </span>
                        </div>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium truncate block">
                          {profileForm.full_name || 'Personal & Counsel Details'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 pt-1 text-zinc-500 dark:text-zinc-400">
                      <span className="text-[11px] font-bold tracking-tight">WIPA</span>
                      <ChevronRight size={17} className="text-zinc-400 dark:text-zinc-500" />
                    </div>
                  </div>

                  <p className="text-[12px] text-zinc-500 dark:text-zinc-400 leading-normal pl-0.5">
                    Password, security, personal details, professional credentials, biography, avatar & live profile
                  </p>
                </div>
              </div>

              {/* LIST OF SETTINGS (Matching Screenshot's Clean Minimalist Style) */}
              <div className="px-1 sm:px-0 space-y-0.5">
                {settingsMenuItems.map((item) => {
                  const Icon = item.icon;
                  const isCurrentTab = (activeTab === item.id) || (!activeTab && effectiveDesktopTab === item.id && item.type === 'tab');

                  if (item.type === 'link') {
                    return (
                      <Link
                        key={item.id}
                        href={item.href}
                        className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-left text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100/70 dark:hover:bg-zinc-900 md:dark:hover:bg-[#1e293b]/60 active:bg-zinc-200/50 dark:active:bg-zinc-800 md:dark:active:bg-[#334155]/80 transition-colors cursor-pointer group"
                      >
                        <Icon size={22} strokeWidth={1.8} className="text-zinc-900 dark:text-zinc-100 shrink-0" />
                        <span className="text-[15px] font-normal sm:font-medium flex-1 truncate">
                          {item.label}
                        </span>
                        <ChevronRight size={18} className="text-zinc-400 dark:text-zinc-600 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    );
                  }

                  if (item.type === 'modal') {
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={item.action}
                        className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-left text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100/70 dark:hover:bg-zinc-900 md:dark:hover:bg-[#1e293b]/60 active:bg-zinc-200/50 dark:active:bg-zinc-800 md:dark:active:bg-[#334155]/80 transition-colors cursor-pointer group"
                      >
                        <Icon size={22} strokeWidth={1.8} className="text-zinc-900 dark:text-zinc-100 shrink-0" />
                        <span className="text-[15px] font-normal sm:font-medium flex-1 truncate">
                          {item.label}
                        </span>
                        <ChevronRight size={18} className="text-zinc-400 dark:text-zinc-600 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    );
                  }

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectTab(item.id)}
                      className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-left transition-colors cursor-pointer group ${
                        isCurrentTab
                          ? 'bg-zinc-100 dark:bg-black md:dark:bg-[#1e293b] border border-transparent dark:border-white/10 md:dark:border-slate-700/60 font-semibold text-zinc-900 dark:text-white'
                          : 'text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100/70 dark:hover:bg-zinc-900 md:dark:hover:bg-[#1e293b]/60 active:bg-zinc-200/50 dark:active:bg-zinc-800 md:dark:active:bg-[#334155]/80 font-normal sm:font-medium'
                      }`}
                    >
                      <Icon size={22} strokeWidth={1.8} className="text-zinc-900 dark:text-zinc-100 shrink-0" />
                      <span className="text-[15px] flex-1 truncate">
                        {item.label}
                      </span>
                      <ChevronRight size={18} className="text-zinc-400 dark:text-zinc-600 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  );
                })}
              </div>

              {/* Sign out shortcut at bottom */}
              <div className="pt-4 px-4 sm:px-0">
                <button
                  onClick={async () => {
                    await supabase.auth.signOut();
                    router.push('/login');
                  }}
                  className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-left text-rose-500 hover:bg-rose-500/10 active:bg-rose-500/20 transition-colors cursor-pointer"
                >
                  <LogOut size={22} strokeWidth={1.8} className="shrink-0" />
                  <span className="text-[15px] font-medium">Log out</span>
                </button>
              </div>

            </div>
          </div>

          {/* ====================================================
              RIGHT COLUMN / MOBILE SUBPAGE: SECTION CONTENT
              (Shown on mobile if activeTab !== null, always shown on desktop)
              ==================================================== */}
          <main className={`flex-1 min-w-0 w-full px-4 sm:px-0 ${activeTab === null ? 'hidden lg:block' : 'block'}`}>
            
            {/* Desktop Section Header Title */}
            <div className="hidden lg:flex items-center justify-between pb-5 mb-6 border-b border-zinc-200/80 dark:border-white/[0.08]">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
                  {getTabTitle(effectiveDesktopTab)}
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  {effectiveDesktopTab === 'profile' && 'Manage your personal details, credentials, biography, avatar and banner.'}
                  {effectiveDesktopTab === 'security' && 'Manage passwords, active sessions, and cryptographic key encryption.'}
                  {effectiveDesktopTab === 'notifications' && 'Select your preferences for messaging, connections, and event alerts.'}
                  {effectiveDesktopTab === 'privacy' && 'Control profile visibility, directory search, and read receipts.'}
                  {effectiveDesktopTab === 'appearance' && 'Customize interface theme between pitch black and crisp light.'}
                  {effectiveDesktopTab === 'membership' && 'Review your verified counsel tier privileges and accreditation.'}
                  {effectiveDesktopTab === 'data' && 'Export personal archives and access permanent account controls.'}
                </p>
              </div>
            </div>

            {/* TAB 1: PROFILE & BIO (Accounts Centre) */}
            {(activeTab === 'profile' || (!activeTab && effectiveDesktopTab === 'profile')) && (
              <div className="space-y-6 animate-in fade-in duration-150">
                
                {/* Media Section: Cover & Avatar */}
                <div className="space-y-4">
                  
                  {/* Cover Banner */}
                  <div className="relative">
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                      Cover Banner
                    </label>
                    <div className="relative w-full h-36 sm:h-44 rounded-2xl overflow-hidden bg-zinc-100 dark:bg-black md:dark:bg-[#1e293b] border border-zinc-200 dark:border-white/10 md:dark:border-slate-700/60 group flex items-center justify-center">
                      {profileForm.cover_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={profileForm.cover_url} alt="Cover" className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-xs font-medium text-zinc-400 flex items-center gap-2">
                          <Camera size={16} /> No cover banner set
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
                          className="px-3.5 py-1.5 bg-white text-zinc-900 rounded-full text-xs font-bold shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <Upload size={13} />
                          <span>{isUploadingCover ? 'Uploading...' : 'Change Banner'}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Avatar Upload */}
                  <div className="flex items-center gap-4 py-2">
                    <div className="relative group shrink-0">
                      <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full overflow-hidden ring-2 ring-zinc-200 dark:ring-white/10 bg-zinc-100 dark:bg-black md:dark:bg-[#1e293b] flex items-center justify-center text-zinc-900 dark:text-white font-bold text-2xl">
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
                        className="absolute bottom-0 right-0 p-1.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-full shadow-md hover:scale-110 active:scale-95 transition-all cursor-pointer"
                        title="Upload new avatar"
                      >
                        <Camera size={14} />
                      </button>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold text-zinc-900 dark:text-white">Profile Picture</h4>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        Square 1:1 image recommended. Minimum 400x400px.
                      </p>
                      <div className="flex items-center gap-3 pt-0.5">
                        <button
                          type="button"
                          onClick={() => avatarInputRef.current?.click()}
                          className="text-xs font-semibold text-[#5a32fa] dark:text-[#a5b4fc] hover:underline cursor-pointer"
                        >
                          Change photo
                        </button>
                        {profileForm.avatar_url && (
                          <button
                            type="button"
                            onClick={() => setProfileForm({ ...profileForm, avatar_url: '' })}
                            className="text-xs font-semibold text-rose-500 hover:underline cursor-pointer"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                        <input
                          type="text"
                          value={profileForm.full_name}
                          onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })}
                          placeholder="e.g. Sarah Jenkins, Esq."
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-white/10 md:dark:border-slate-700/60 bg-zinc-50/70 dark:bg-black md:dark:bg-[#0f172a] text-xs sm:text-sm font-medium text-zinc-900 dark:text-white focus:outline-none focus:border-[#5a32fa] transition-colors"
                        />
                      </div>
                    </div>

                    {/* Role */}
                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                        Professional Title / Role
                      </label>
                      <div className="relative">
                        <Briefcase size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                        <input
                          type="text"
                          value={profileForm.role}
                          onChange={(e) => setProfileForm({ ...profileForm, role: e.target.value })}
                          placeholder="e.g. Partner & Head of IP Litigation"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-white/10 md:dark:border-slate-700/60 bg-zinc-50/70 dark:bg-black md:dark:bg-[#0f172a] text-xs sm:text-sm font-medium text-zinc-900 dark:text-white focus:outline-none focus:border-[#5a32fa] transition-colors"
                        />
                      </div>
                    </div>

                    {/* Company / Law Firm */}
                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                        Law Firm / Company
                      </label>
                      <div className="relative">
                        <Building2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                        <input
                          type="text"
                          value={profileForm.company}
                          onChange={(e) => setProfileForm({ ...profileForm, company: e.target.value })}
                          placeholder="e.g. Morrison & Foerster LLP"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-white/10 md:dark:border-slate-700/60 bg-zinc-50/70 dark:bg-black md:dark:bg-[#0f172a] text-xs sm:text-sm font-medium text-zinc-900 dark:text-white focus:outline-none focus:border-[#5a32fa] transition-colors"
                        />
                      </div>
                    </div>

                    {/* Practice Area */}
                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                        Primary IP Practice Area
                      </label>
                      <select
                        value={profileForm.practice_area}
                        onChange={(e) => setProfileForm({ ...profileForm, practice_area: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-white/10 md:dark:border-slate-700/60 bg-zinc-50/70 dark:bg-black md:dark:bg-[#0f172a] text-xs sm:text-sm font-medium text-zinc-900 dark:text-white focus:outline-none focus:border-[#5a32fa] transition-colors"
                      >
                        <option value="">Select Practice Area</option>
                        {PRACTICE_AREAS.map((area) => (
                          <option key={area} value={area}>{area}</option>
                        ))}
                      </select>
                    </div>

                    {/* Industry Sector */}
                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                        Industry Sector
                      </label>
                      <select
                        value={profileForm.industry_sector}
                        onChange={(e) => setProfileForm({ ...profileForm, industry_sector: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-white/10 md:dark:border-slate-700/60 bg-zinc-50/70 dark:bg-black md:dark:bg-[#0f172a] text-xs sm:text-sm font-medium text-zinc-900 dark:text-white focus:outline-none focus:border-[#5a32fa] transition-colors"
                      >
                        <option value="">Select Industry</option>
                        {INDUSTRY_SECTORS.map((sec) => (
                          <option key={sec} value={sec}>{sec}</option>
                        ))}
                      </select>
                    </div>

                    {/* Years of Experience */}
                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                        Years of IP Experience
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="60"
                        value={profileForm.experience_years}
                        onChange={(e) => setProfileForm({ ...profileForm, experience_years: Number(e.target.value) })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-white/10 md:dark:border-slate-700/60 bg-zinc-50/70 dark:bg-black md:dark:bg-[#0f172a] text-xs sm:text-sm font-medium text-zinc-900 dark:text-white focus:outline-none focus:border-[#5a32fa] transition-colors"
                      />
                    </div>

                    {/* Location */}
                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                        Location / Jurisdiction
                      </label>
                      <div className="relative">
                        <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                        <input
                          type="text"
                          value={profileForm.country}
                          onChange={(e) => setProfileForm({ ...profileForm, country: e.target.value })}
                          placeholder="e.g. London, United Kingdom / New York, USA"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-white/10 md:dark:border-slate-700/60 bg-zinc-50/70 dark:bg-black md:dark:bg-[#0f172a] text-xs sm:text-sm font-medium text-zinc-900 dark:text-white focus:outline-none focus:border-[#5a32fa] transition-colors"
                        />
                      </div>
                    </div>

                    {/* Education */}
                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                        Education & Bar Admissions
                      </label>
                      <div className="relative">
                        <GraduationCap size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                        <input
                          type="text"
                          value={profileForm.education}
                          onChange={(e) => setProfileForm({ ...profileForm, education: e.target.value })}
                          placeholder="e.g. JD (Harvard Law), USPTO Reg. Patent Bar"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-white/10 md:dark:border-slate-700/60 bg-zinc-50/70 dark:bg-black md:dark:bg-[#0f172a] text-xs sm:text-sm font-medium text-zinc-900 dark:text-white focus:outline-none focus:border-[#5a32fa] transition-colors"
                        />
                      </div>
                    </div>

                    {/* LinkedIn */}
                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                        LinkedIn Profile
                      </label>
                      <div className="relative">
                        <LinkedinIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0a66c2]" />
                        <input
                          type="url"
                          value={profileForm.linkedin_url}
                          onChange={(e) => setProfileForm({ ...profileForm, linkedin_url: e.target.value })}
                          placeholder="https://linkedin.com/in/username"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-white/10 md:dark:border-slate-700/60 bg-zinc-50/70 dark:bg-black md:dark:bg-[#0f172a] text-xs sm:text-sm font-medium text-zinc-900 dark:text-white focus:outline-none focus:border-[#5a32fa] transition-colors"
                        />
                      </div>
                    </div>

                    {/* Website */}
                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                        Firm or Portfolio Website
                      </label>
                      <div className="relative">
                        <Globe size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                        <input
                          type="url"
                          value={profileForm.website_url}
                          onChange={(e) => setProfileForm({ ...profileForm, website_url: e.target.value })}
                          placeholder="https://yourfirm.com"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-white/10 md:dark:border-slate-700/60 bg-zinc-50/70 dark:bg-black md:dark:bg-[#0f172a] text-xs sm:text-sm font-medium text-zinc-900 dark:text-white focus:outline-none focus:border-[#5a32fa] transition-colors"
                        />
                      </div>
                    </div>

                  </div>

                  {/* Bio */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                        Professional Biography
                      </label>
                      <span className="text-[10px] text-zinc-400">{profileForm.bio.length}/1000</span>
                    </div>
                    <textarea
                      rows={4}
                      maxLength={1000}
                      value={profileForm.bio}
                      onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                      placeholder="Share your professional journey, landmark IP trials, patent prosecution areas, and areas you can advise on..."
                      className="w-full p-3.5 rounded-xl border border-zinc-200 dark:border-white/10 md:dark:border-slate-700/60 bg-zinc-50/70 dark:bg-black md:dark:bg-[#0f172a] text-xs sm:text-sm font-medium text-zinc-900 dark:text-white focus:outline-none focus:border-[#5a32fa] transition-colors"
                    />
                  </div>

                  {/* Skills */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                      Core Skills & Key Competencies (Comma-separated)
                    </label>
                    <input
                      type="text"
                      value={profileForm.skills}
                      onChange={(e) => setProfileForm({ ...profileForm, skills: e.target.value })}
                      placeholder="Patent Drafting, Hatch-Waxman Litigation, Trademark Clearance, SEP Licensing, Trade Secret Audits"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-white/10 md:dark:border-slate-700/60 bg-zinc-50/70 dark:bg-black md:dark:bg-[#0f172a] text-xs sm:text-sm font-medium text-zinc-900 dark:text-white focus:outline-none focus:border-[#5a32fa] transition-colors"
                    />
                  </div>

                  {/* Submit Button on Mobile & Bottom */}
                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={() => handleSaveProfile()}
                      disabled={isSaving}
                      className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-900 text-xs font-bold transition-all active:scale-95 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                    >
                      {isSaving ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          <span>Saving Changes...</span>
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

              </div>
            )}

            {/* TAB 2: ACCOUNT & SECURITY */}
            {(activeTab === 'security' || (!activeTab && effectiveDesktopTab === 'security')) && (
              <div className="space-y-6 animate-in fade-in duration-150">
                
                {/* E2EE Badge */}
                <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-black md:dark:bg-[#1e293b] border border-zinc-200/70 dark:border-white/[0.08] md:dark:border-slate-700/60 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-zinc-900 dark:text-white">End-to-End Encryption Active</span>
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                          AES-256-GCM
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                        Client-side WebCrypto cryptographic keys protect all counsel communications.
                      </p>
                    </div>
                  </div>

                  <span className="hidden sm:inline font-mono text-[10px] text-zinc-400">
                    Session: {user?.id?.slice(0, 10)}...
                  </span>
                </div>

                {/* Password Form */}
                <div className="p-4 sm:p-5 rounded-2xl bg-zinc-50 dark:bg-black md:dark:bg-[#1e293b] border border-zinc-200/70 dark:border-white/[0.08] md:dark:border-slate-700/60 space-y-4">
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Change Password</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 -mt-2">Keep your account secure with a strong passphrase.</p>

                  <form onSubmit={handleUpdatePassword} className="space-y-3.5 max-w-md">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                        New Password
                      </label>
                      <div className="relative">
                        <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={passwordForm.newPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                          placeholder="••••••••••••"
                          className="w-full pl-10 pr-10 py-2 rounded-xl border border-zinc-200 dark:border-white/10 md:dark:border-slate-700/60 bg-white dark:bg-black md:dark:bg-[#0f172a] text-xs sm:text-sm font-medium text-zinc-900 dark:text-white focus:outline-none focus:border-[#5a32fa]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
                        >
                          {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={passwordForm.confirmPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                          placeholder="••••••••••••"
                          className="w-full pl-10 pr-4 py-2 rounded-xl border border-zinc-200 dark:border-white/10 md:dark:border-slate-700/60 bg-white dark:bg-black md:dark:bg-[#0f172a] text-xs sm:text-sm font-medium text-zinc-900 dark:text-white focus:outline-none focus:border-[#5a32fa]"
                        />
                      </div>
                    </div>

                    {passwordMessage.message && (
                      <div className={`flex items-center gap-2 text-xs font-semibold ${
                        passwordMessage.type === 'error' ? 'text-rose-500' : 'text-emerald-500'
                      }`}>
                        {passwordMessage.type === 'error' ? <AlertCircle size={14} /> : <Check size={14} />}
                        <span>{passwordMessage.message}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-900 text-xs font-bold transition-all cursor-pointer"
                    >
                      Update Password
                    </button>
                  </form>
                </div>

                {/* 10 Sessions */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Active Sessions (Last 10)</h3>
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Live Database
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">Devices logged into your counsel account.</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleSignOutOtherSessions}
                      disabled={isSigningOutOthers || sessionList.filter(s => !s.isCurrent && s.status !== 'revoked').length === 0}
                      className="text-xs font-semibold text-rose-500 hover:text-rose-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      {isSigningOutOthers && <Loader2 size={12} className="animate-spin" />}
                      <span>{isSigningOutOthers ? 'Signing Out...' : 'Sign Out Others'}</span>
                    </button>
                  </div>

                  {sessionToast && (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium flex items-center gap-2">
                      <CheckCircle2 size={15} />
                      <span>{sessionToast}</span>
                    </div>
                  )}

                  <div className="divide-y divide-zinc-100 dark:divide-white/[0.06] rounded-2xl bg-zinc-50 dark:bg-black md:dark:bg-[#1e293b] border border-zinc-200/70 dark:border-white/[0.08] md:dark:border-slate-700/60 overflow-hidden">
                    {isLoadingSessions && sessionList.length === 0 ? (
                      <div className="p-8 flex items-center justify-center gap-2 text-zinc-400 text-xs font-medium">
                        <Loader2 size={16} className="animate-spin text-[#5a32fa]" />
                        <span>Loading active sessions from database...</span>
                      </div>
                    ) : sessionList.length === 0 ? (
                      <div className="p-8 text-center text-zinc-400 text-xs">
                        No active sessions found.
                      </div>
                    ) : (
                      sessionList.map((s) => {
                        const isRevoked = s.status === 'revoked';
                        return (
                          <div key={s.id} className="p-3.5 sm:p-4 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="p-2 rounded-lg bg-zinc-200 dark:bg-black md:dark:bg-[#0f172a] text-zinc-700 dark:text-zinc-300 shrink-0">
                                {s.type === 'mobile' ? <Smartphone size={16} /> : s.type === 'tablet' ? <Tablet size={16} /> : <Monitor size={16} />}
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-white truncate">
                                    {s.device}
                                  </span>
                                  {s.isCurrent ? (
                                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                      Active Now
                                    </span>
                                  ) : isRevoked ? (
                                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-rose-500/10 text-rose-500">
                                      Revoked
                                    </span>
                                  ) : null}
                                </div>
                                <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                                  {s.os} • {s.location} • <span className="font-mono">{s.ip}</span>
                                </p>
                              </div>
                            </div>

                            <div className="shrink-0 text-right">
                              {s.isCurrent ? (
                                <span className="text-[11px] text-zinc-400 font-medium">This Device</span>
                              ) : isRevoked ? (
                                <span className="text-[11px] text-zinc-400 italic">Signed Out</span>
                              ) : (
                                <button
                                  type="button"
                                  disabled={isRevokingId === s.id}
                                  onClick={() => handleRevokeSession(s.id)}
                                  className="text-xs font-semibold text-rose-500 hover:underline cursor-pointer disabled:opacity-50"
                                >
                                  {isRevokingId === s.id ? 'Revoking...' : 'Revoke'}
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

              </div>
            )}

            {/* TAB 3: NOTIFICATIONS */}
            {(activeTab === 'notifications' || (!activeTab && effectiveDesktopTab === 'notifications')) && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="divide-y divide-zinc-100 dark:divide-white/[0.06] rounded-2xl bg-zinc-50 dark:bg-black md:dark:bg-[#1e293b] border border-zinc-200/70 dark:border-white/[0.08] md:dark:border-slate-700/60 overflow-hidden">
                  {[
                    { key: 'directMessages', title: 'Direct Messages & Chat', desc: 'Real-time alert when a counsel sends you an encrypted message.' },
                    { key: 'connectionRequests', title: 'Connection & Network Invitations', desc: 'Notify when members request to connect or accept invitations.' },
                    { key: 'mentionsAndReplies', title: 'Discussions & Comments', desc: 'Alerts when someone mentions you or replies to your feed threads.' },
                    { key: 'calendarReminders', title: 'Events & Masterclass Reminders', desc: '1-hour and 24-hour briefings for webinars and council summits.' },
                    { key: 'weeklyDigest', title: 'Weekly IP Intelligence Digest', desc: 'Curated weekly briefing featuring breaking patent rulings.' },
                    { key: 'soundEffects', title: 'In-App Sound Effects', desc: 'Subtle sound feedback on message sent and incoming notifications.' },
                  ].map((item) => (
                    <div key={item.key} className="p-4 flex items-center justify-between gap-4">
                      <div>
                        <h4 className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-white">{item.title}</h4>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{item.desc}</p>
                      </div>

                      <label className="relative inline-flex items-center cursor-pointer shrink-0">
                        <input
                          type="checkbox"
                          checked={notifPrefs[item.key as keyof typeof notifPrefs]}
                          onChange={(e) => setNotifPrefs({ ...notifPrefs, [item.key]: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-zinc-300 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-zinc-900 dark:peer-checked:bg-white dark:peer-checked:after:bg-zinc-900"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: PRIVACY */}
            {(activeTab === 'privacy' || (!activeTab && effectiveDesktopTab === 'privacy')) && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="divide-y divide-zinc-100 dark:divide-white/[0.06] rounded-2xl bg-zinc-50 dark:bg-black md:dark:bg-[#1e293b] border border-zinc-200/70 dark:border-white/[0.08] md:dark:border-slate-700/60 overflow-hidden">
                  
                  {/* Profile Visibility */}
                  <div className="p-4 flex items-center justify-between gap-4">
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-white">Profile Visibility</h4>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Define who can view your credentials and full portfolio.</p>
                    </div>
                    <select
                      value={privacyPrefs.profileVisibility}
                      onChange={(e) => setPrivacyPrefs({ ...privacyPrefs, profileVisibility: e.target.value })}
                      className="px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-white/10 md:dark:border-slate-700/60 bg-white dark:bg-black md:dark:bg-[#0f172a] text-xs font-semibold text-zinc-900 dark:text-white focus:outline-none focus:border-[#5a32fa]"
                    >
                      <option value="public">Public (All Members)</option>
                      <option value="connections">Connections Only</option>
                      <option value="private">Private (Stealth)</option>
                    </select>
                  </div>

                  {/* Online Status */}
                  <div className="p-4 flex items-center justify-between gap-4">
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-white">Show Online Status</h4>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Show active indicator when browsing WIPA platform.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        checked={privacyPrefs.showOnlineStatus}
                        onChange={(e) => setPrivacyPrefs({ ...privacyPrefs, showOnlineStatus: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-zinc-300 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-zinc-900 dark:peer-checked:bg-white dark:peer-checked:after:bg-zinc-900"></div>
                    </label>
                  </div>

                  {/* Directory */}
                  <div className="p-4 flex items-center justify-between gap-4">
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-white">Member Directory Inclusion</h4>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Allow counsel and corporate recruiters to find you by practice area.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        checked={privacyPrefs.showInDirectory}
                        onChange={(e) => setPrivacyPrefs({ ...privacyPrefs, showInDirectory: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-zinc-300 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-zinc-900 dark:peer-checked:bg-white dark:peer-checked:after:bg-zinc-900"></div>
                    </label>
                  </div>

                  {/* Read Receipts */}
                  <div className="p-4 flex items-center justify-between gap-4">
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-white">Live Read Receipts in Chat</h4>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Show read indicator when private messages are viewed.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        checked={privacyPrefs.readReceipts}
                        onChange={(e) => setPrivacyPrefs({ ...privacyPrefs, readReceipts: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-zinc-300 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-zinc-900 dark:peer-checked:bg-white dark:peer-checked:after:bg-zinc-900"></div>
                    </label>
                  </div>

                </div>
              </div>
            )}

            {/* TAB 5: APPEARANCE */}
            {(activeTab === 'appearance' || (!activeTab && effectiveDesktopTab === 'appearance')) && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Light Mode */}
                  <button
                    type="button"
                    onClick={() => { if (isDarkMode) toggleDarkMode(); }}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between h-32 ${
                      !isDarkMode
                        ? 'border-zinc-900 ring-2 ring-zinc-900/10 bg-white text-zinc-900 shadow-sm'
                        : 'border-zinc-200 dark:border-white/10 md:dark:border-slate-700/60 bg-zinc-50 dark:bg-black md:dark:bg-[#1e293b] text-zinc-500 hover:border-zinc-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Sun size={22} className="text-amber-500" />
                      {!isDarkMode && <Check size={18} className="text-zinc-900" />}
                    </div>
                    <div>
                      <div className="font-bold text-sm">Light Mode</div>
                      <div className="text-xs text-zinc-400 mt-0.5">Crisp clean white aesthetic</div>
                    </div>
                  </button>

                  {/* Dark Mode */}
                  <button
                    type="button"
                    onClick={() => { if (!isDarkMode) toggleDarkMode(); }}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between h-32 ${
                      isDarkMode
                        ? 'border-white ring-2 ring-white/10 bg-black md:bg-[#1e293b] text-white shadow-sm'
                        : 'border-zinc-200 dark:border-white/10 md:dark:border-slate-700/60 bg-zinc-50 dark:bg-black md:dark:bg-[#1e293b] text-zinc-500 hover:border-zinc-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Moon size={22} className="text-indigo-400" />
                      {isDarkMode && <Check size={18} className="text-white" />}
                    </div>
                    <div>
                      <div className="font-bold text-sm">Dark Mode (Cosmic Navy)</div>
                      <div className="text-xs text-zinc-400 mt-0.5">Low-light focus with dark blue desktop</div>
                    </div>
                  </button>

                </div>
              </div>
            )}

            {/* TAB 6: MEMBERSHIP & TIER */}
            {(activeTab === 'membership' || (!activeTab && effectiveDesktopTab === 'membership')) && (
              <div className="space-y-4 animate-in fade-in duration-150">
                {/* Membership Card */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white border border-white/10 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Crown size={20} className="text-amber-400" />
                      <span className="font-bold text-sm uppercase tracking-wider text-amber-300">
                        {profileForm.membership_tier === 'in_house_counsel' ? 'In-House Counsel' : profileForm.membership_tier === 'ip_professional' ? 'IP Professional' : profileForm.membership_tier === 'startup' ? 'Start-Up' : profileForm.membership_tier === 'student' ? 'Student' : `${profileForm.membership_tier} Member`}
                      </span>
                    </div>
                    <span className="text-xs font-mono opacity-80">{profileForm.member_id}</span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold">{profileForm.full_name || 'WIPA Member'}</h3>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      {profileForm.company || 'Global IP Practice'} • {profileForm.practice_area || 'Intellectual Property'}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                      <BadgeCheck size={16} /> Certified Accreditation Active
                    </div>
                    <span className="text-zinc-500">Valid Worldwide</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-black md:dark:bg-[#1e293b] border border-zinc-200/70 dark:border-white/[0.08] md:dark:border-slate-700/60 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-white">Upgrade or Change Plan</h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Access exclusive council seats and CLE accredited certificates.</p>
                  </div>
                  <Link
                    href="/platform/memberships"
                    className="px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-900 text-xs font-bold rounded-xl transition-all shrink-0"
                  >
                    Manage
                  </Link>
                </div>
              </div>
            )}

            {/* TAB 7: DATA & ACCOUNT */}
            {(activeTab === 'data' || (!activeTab && effectiveDesktopTab === 'data')) && (
              <div className="space-y-6 animate-in fade-in duration-150">
                
                {/* Archive Download */}
                <div className="p-4 sm:p-5 rounded-2xl bg-zinc-50 dark:bg-black md:dark:bg-[#1e293b] border border-zinc-200/70 dark:border-white/[0.08] md:dark:border-slate-700/60 space-y-3">
                  <div>
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Export Profile Archive</h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Download a complete GDPR-compliant JSON archive of your counsel records.</p>
                  </div>

                  <button
                    type="button"
                    onClick={handleExportData}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-black md:dark:bg-[#0f172a] border border-zinc-200 dark:border-white/10 md:dark:border-slate-700/60 hover:bg-zinc-100 dark:hover:bg-zinc-900 md:dark:hover:bg-[#1e293b] text-zinc-900 dark:text-white text-xs font-semibold transition-all cursor-pointer"
                  >
                    <Download size={14} />
                    <span>Download Archive (.json)</span>
                  </button>
                </div>

                {/* Danger Zone */}
                <div className="p-4 sm:p-5 rounded-2xl bg-rose-500/5 dark:bg-rose-950/20 border border-rose-500/20 space-y-3">
                  <div>
                    <h3 className="text-sm font-bold text-rose-600 dark:text-rose-400">Danger Zone</h3>
                    <p className="text-xs text-rose-600/80 dark:text-rose-400/80 mt-0.5">Permanently erase your counsel credentials and message history.</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Are you sure you want to permanently delete your account? This action cannot be undone.')) {
                        alert('Please contact support@wipaworld.com to process your permanent counsel erasure request.');
                      }
                    }}
                    className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                  >
                    Delete Account
                  </button>
                </div>

              </div>
            )}

          </main>

        </div>
      </div>

      {/* ========================================================
          HELP & SUPPORT MODAL
          ======================================================== */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white dark:bg-black md:dark:bg-[#1e293b] rounded-3xl p-6 border border-zinc-200 dark:border-white/10 md:dark:border-slate-700/60 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-white/10 md:dark:border-slate-700/60">
              <div className="flex items-center gap-2.5">
                <HelpCircle size={20} className="text-zinc-900 dark:text-white" />
                <h3 className="text-base font-bold text-zinc-900 dark:text-white">Help & Support</h3>
              </div>
              <button 
                onClick={() => setShowHelpModal(false)}
                className="p-1 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs text-zinc-600 dark:text-zinc-300">
              <p>Need assistance with your counsel credentials, verified accreditation, or encrypted messaging?</p>
              
              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-black md:dark:bg-[#0f172a] border border-zinc-200/60 dark:border-white/10 md:dark:border-slate-700/60 space-y-1">
                <span className="font-bold text-zinc-900 dark:text-white block">WIPA Concierge Support</span>
                <a href="mailto:support@wipaworld.com" className="text-[#5a32fa] dark:text-[#a5b4fc] hover:underline font-medium">
                  support@wipaworld.com
                </a>
              </div>

              <div className="space-y-2 pt-2">
                <h4 className="font-bold text-zinc-900 dark:text-white text-xs">Quick Counsel FAQs:</h4>
                <ul className="list-disc list-inside space-y-1 text-zinc-500 dark:text-zinc-400">
                  <li>Changes to your profile and bio sync live across member directory searches.</li>
                  <li>All direct messages are secured by AES-256 client-side cryptographic keys.</li>
                  <li>Accreditation updates reflect automatically upon bar status confirmation.</li>
                </ul>
              </div>
            </div>

            <button
              onClick={() => setShowHelpModal(false)}
              className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-900 text-xs font-bold transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          ABOUT WIPA MODAL
          ======================================================== */}
      {showAboutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white dark:bg-black md:dark:bg-[#1e293b] rounded-3xl p-6 border border-zinc-200 dark:border-white/10 md:dark:border-slate-700/60 shadow-2xl space-y-4 text-center">
            <div className="flex justify-end -mt-1 -mr-1">
              <button 
                onClick={() => setShowAboutModal(false)}
                className="p-1 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center font-black text-xl shadow-md">
                W
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Women in IP Association</h3>
              <span className="text-xs font-medium text-zinc-500">Version 2.4.0 (Global Edition)</span>
            </div>

            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-xs mx-auto">
              Empowering global intellectual property leaders, patent attorneys, and innovators with high-trust networking and cryptographic privacy.
            </p>

            <div className="pt-2 border-t border-zinc-100 dark:border-white/10 text-[11px] text-zinc-400 space-y-1">
              <p>© 2026 Women in IP Association. All rights reserved.</p>
              <div className="flex items-center justify-center gap-3 pt-1">
                <span className="hover:underline cursor-pointer">Terms of Service</span>
                <span>•</span>
                <span className="hover:underline cursor-pointer">Privacy Policy</span>
              </div>
            </div>

            <button
              onClick={() => setShowAboutModal(false)}
              className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-900 text-xs font-bold transition-all cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={null}>
      <SettingsContent />
    </Suspense>
  );
}
