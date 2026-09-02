// @ts-nocheck
'use client';
import { DotmCircular7 as Loader2 } from '@/components/ui/dotm-circular-7';
import { useState, useRef, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { 
  BadgeCheck, User, Users, Mail, UserPlus, MessageSquare, Briefcase, GraduationCap,
  MapPin, Link as LinkIcon, Calendar, Edit3, Settings, Camera, ThumbsUp,
  Share2, Copy, PlayCircle, Hash, ArrowUpRight, CheckCircle2, Star,
  Folder, Lightbulb, HelpCircle, Headphones, Award, Gift, Sparkles, Plus,
  Image as ImageIcon, Video, Send, MoreHorizontal, Eye, TrendingUp, Search,
  Globe2, ShieldCheck, Check, Heart, MessageCircle, Repeat2, Bookmark, X,
  Trash2, UploadCloud, Play, Volume2, FileText, Building2, Clock
} from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { optimizeFeedUpload } from '@/lib/feedPerformance';
import { getProfileByIdOrMemberId } from '@/app/actions/profiles';
import { fetchUserAnalytics, UserAnalytics } from '@/lib/analytics';
import FormattedPostText, { getPostPreview } from '@/components/FormattedPostText';
import ImageCropperModal from '@/components/ImageCropperModal';

export interface PositionItem {
  id: string;
  title: string;
  company: string;
  location?: string;
  years?: number | string;
  current?: boolean;
  startDate?: string;
  endDate?: string;
  description?: string;
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  year?: string;
  grade?: string;
  description?: string;
}

export default function ProfilePage() {
  const { user, setUser } = useAppStore();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'activity' | 'about' | 'experience' | 'education' | 'skills'>('activity');

  const [profileData, setProfileData] = useState({
    name: user?.name || 'WIPA Member',
    role: user?.role || 'Intellectual Property Specialist | WIPA Member',
    company: user?.company || 'International IP Practice',
    experienceYears: 5,
    education: user?.education || 'Law & Technology Institute',
    location: user?.country || 'Global',
    bio: user?.bio || 'Dedicated IP practitioner and active contributor to the Women in Intellectual Property Alliance.',
    linkedin: '',
    website: '',
    practiceAreas: user?.practice_area || 'Patents, Trademarks, IP Strategy, Licensing',
    skills: 'Patent Drafting, Trademark Portfolio, IP Litigation, Trade Secrets',
    avatarUrl: user?.avatar_url || '',
    introVideoUrl: '',
    memberId: user?.member_id || '',
    verificationStatus: user?.verification_status || 'verified',
    isWipaRecommended: false,
    businessProfile: null as any,
    positions: [] as PositionItem[],
    educations: [] as EducationItem[]
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEditAboutModalOpen, setIsEditAboutModalOpen] = useState(false);
  const [aboutForm, setAboutForm] = useState({ bio: '', practiceAreas: '' });
  const [isSavingAbout, setIsSavingAbout] = useState(false);
  const [aboutSaveError, setAboutSaveError] = useState<string | null>(null);
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);
  const [aiBioSuccess, setAiBioSuccess] = useState(false);

  const [isEditExperienceModalOpen, setIsEditExperienceModalOpen] = useState(false);
  const [experienceList, setExperienceList] = useState<PositionItem[]>([]);
  const [isSavingExperience, setIsSavingExperience] = useState(false);
  const [experienceSaveError, setExperienceSaveError] = useState<string | null>(null);

  const [isEditEducationModalOpen, setIsEditEducationModalOpen] = useState(false);
  const [educationList, setEducationList] = useState<EducationItem[]>([]);
  const [isSavingEducation, setIsSavingEducation] = useState(false);
  const [educationSaveError, setEducationSaveError] = useState<string | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [storyProgress, setStoryProgress] = useState(0);
  const [previewModalImage, setPreviewModalImage] = useState<string | null>(null);
  const [expandedPosts, setExpandedPosts] = useState<Set<string>>(new Set());
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [editForm, setEditForm] = useState(profileData);
  const [stats, setStats] = useState({ connections: 0, followers: 0, posts: 0 });
  const [analytics, setAnalytics] = useState<UserAnalytics>({
    profileViews: 0,
    profileViewsThisWeek: 0,
    profileViewsGrowth: '0% this week',
    profileViewsDirection: 'neutral',
    postImpressions: 0,
    postImpressionsThisWeek: 0,
    postImpressionsGrowth: '0% this week',
    postImpressionsDirection: 'neutral',
  });

  // Post composer state
  const [newPostText, setNewPostText] = useState('');
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [likedPostIds, setLikedPostIds] = useState<Set<string>>(new Set());
  const [activePostMenuId, setActivePostMenuId] = useState<string | null>(null);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editingPostContent, setEditingPostContent] = useState('');
  const [isSavingPost, setIsSavingPost] = useState(false);
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);

  const toggleExpandPost = (postId: string) => {
    setExpandedPosts(prev => {
      const next = new Set(prev);
      if (next.has(postId)) next.delete(postId);
      else next.add(postId);
      return next;
    });
  };
  const [endorsedSkills, setEndorsedSkills] = useState<Record<string, { count: number; endorsed: boolean }>>({});
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [profileSaveError, setProfileSaveError] = useState<string | null>(null);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  
  // Cover & Avatar Cropper states
  const [isCoverCropperOpen, setIsCoverCropperOpen] = useState(false);
  const [coverCropSrc, setCoverCropSrc] = useState<string | null>(null);
  const [isAvatarCropperOpen, setIsAvatarCropperOpen] = useState(false);
  const [avatarCropSrc, setAvatarCropSrc] = useState<string | null>(null);

  const coverInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });
  const [passwordStatus, setPasswordStatus] = useState({ type: '', message: '' });

  const fetchUserPosts = async (userId: string) => {
    setIsLoadingPosts(true);
    try {
      const { data, error } = await supabase
        .from('feed_posts')
        .select(`
          *,
          author:profiles!feed_posts_author_id_fkey(full_name, avatar_url, role, is_wipa_recommended)
        `)
        .eq('author_id', userId)
        .is('group_id', null)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setUserPosts(data);
        setStats(prev => ({ ...prev, posts: data.length }));
      }

      const { data: likesData } = await supabase
        .from('feed_likes')
        .select('post_id')
        .eq('user_id', userId);

      if (likesData) {
        setLikedPostIds(new Set(likesData.map(l => l.post_id)));
      }
    } catch (err) {
      console.error("Error fetching user posts:", err);
    } finally {
      setIsLoadingPosts(false);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      let currentUserId = user?.id;
      if (!currentUserId) {
        const { data: authData } = await supabase.auth.getUser();
        currentUserId = authData?.user?.id;
      }
      if (!currentUserId) return;

      const [profileResult, connectionsResult, followersResult, analyticsResult] = await Promise.all([
        supabase.from('profiles').select('*, business_profiles(id, name, slug, type, logo_url)').eq('id', currentUserId).maybeSingle(),
        supabase.from('connections').select('id', { count: 'exact', head: true }).or(`requester_id.eq.${currentUserId},recipient_id.eq.${currentUserId}`).eq('status', 'accepted'),
        supabase.from('follows').select('id', { count: 'exact', head: true }).eq('following_id', currentUserId),
        fetchUserAnalytics(currentUserId)
      ]);
      
      let data = profileResult.data;
      if (!data) {
        data = await getProfileByIdOrMemberId(currentUserId);
      }
        
      if (data) {
        const parsedPositions = Array.isArray(data.experience_data) && data.experience_data.length > 0
          ? data.experience_data
          : [
              {
                id: 'pos-1',
                title: data.role || 'Intellectual Property Specialist | WIPA Member',
                company: data.company || 'International IP Practice',
                location: data.country || 'Global',
                years: data.experience_years ?? 5,
                current: true,
                description: ''
              }
            ];

        const parsedEducations: EducationItem[] = Array.isArray(data.education_data) && data.education_data.length > 0
          ? data.education_data
          : [
              {
                id: 'edu-1',
                institution: data.education || 'Law & Technology Institute',
                degree: 'Degree & Professional Accreditation in Intellectual Property Law',
                fieldOfStudy: 'Intellectual Property Law',
                year: 'Graduated',
                description: ''
              }
            ];

        const newProfile = {
          ...profileData,
          name: data.full_name || user?.name || 'WIPA Member',
          role: data.role || 'Intellectual Property Specialist | WIPA Member',
          company: data.company || 'International IP Practice',
          experienceYears: data.experience_years ?? 5,
          education: data.education || 'Law & Technology Institute',
          location: data.country || 'Global',
          bio: data.bio || 'Dedicated IP practitioner and active contributor to the Women in Intellectual Property Alliance.',
          linkedin: data.linkedin_url || '',
          website: data.website_url || '',
          practiceAreas: data.practice_area || 'Patents, Trademarks, IP Strategy, Licensing',
          skills: data.skills || 'Patent Drafting, Trademark Portfolio, IP Litigation, Trade Secrets',
          avatarUrl: data.avatar_url || user?.avatar_url || '',
          introVideoUrl: data.intro_video_url || '',
          memberId: data.member_id || profileData.memberId,
          verificationStatus: data.verification_status || 'verified',
          isWipaRecommended: data.is_wipa_recommended ?? false,
          businessProfile: data.business_profiles,
          positions: parsedPositions,
          educations: parsedEducations
        };
        setProfileData(newProfile);
        setEditForm(newProfile);
        setExperienceList(parsedPositions);
        setEducationList(parsedEducations);
        if (data.cover_url) {
          setCoverImage(data.cover_url);
        }
        setStats(current => ({
          ...current,
          connections: connectionsResult?.count ?? 0,
          followers: followersResult?.count ?? 0
        }));
        if (analyticsResult) {
          setAnalytics(analyticsResult);
        }
      }
      fetchUserPosts(currentUserId);
    };
    
    fetchProfile();
  }, [user?.id]);

  // Avatar Cropper Handlers
  const onAvatarFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarCropSrc(reader.result as string);
        setIsAvatarCropperOpen(true);
      };
      reader.readAsDataURL(file);
      e.target.value = '';
    }
  };

  const handleAvatarCropComplete = async (croppedBlob: Blob, previewUrl: string) => {
    if (!user?.id) return;
    setProfileData(prev => ({ ...prev, avatarUrl: previewUrl }));
    setEditForm(prev => ({ ...prev, avatarUrl: previewUrl }));

    try {
      const fileName = `${user.id}/avatar.webp`;
      const { error: uploadError } = await supabase.storage.from('avatars').upload(fileName, croppedBlob, {
        upsert: true,
        cacheControl: '31536000, public, immutable',
        contentType: 'image/webp',
      });
      if (!uploadError) {
        const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
        const avatarUrlWithTimestamp = `${data.publicUrl}?t=${Date.now()}`;
        await supabase.from('profiles').update({ avatar_url: avatarUrlWithTimestamp }).eq('id', user.id);
        setUser({ ...user, avatar_url: avatarUrlWithTimestamp });
      }
    } catch (err) {
      console.error('Error uploading avatar:', err);
    }
  };

  // Cover Cropper Handlers
  const onCoverFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCoverCropSrc(reader.result as string);
        setIsCoverCropperOpen(true);
      };
      reader.readAsDataURL(file);
      e.target.value = '';
    }
  };

  const handleCoverCropComplete = async (croppedBlob: Blob, previewUrl: string) => {
    if (!user?.id) return;
    setIsUploadingCover(true);
    setCoverImage(previewUrl);

    try {
      const fileName = `${user.id}/cover.webp`;
      const { error: uploadError } = await supabase.storage.from('covers').upload(fileName, croppedBlob, {
        upsert: true,
        cacheControl: '31536000, public, immutable',
        contentType: 'image/webp',
      });
      if (!uploadError) {
        const { data } = supabase.storage.from('covers').getPublicUrl(fileName);
        const coverUrlWithTimestamp = `${data.publicUrl}?t=${Date.now()}`;
        await supabase.from('profiles').update({ cover_url: coverUrlWithTimestamp }).eq('id', user.id);
        setUser({ ...user, cover_url: coverUrlWithTimestamp });
        setCoverImage(coverUrlWithTimestamp);
      }
    } catch (err) {
      console.error('Error uploading cover:', err);
    } finally {
      setIsUploadingCover(false);
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user?.id) {
      setIsUploadingVideo(true);
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}-intro.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('feed-media').upload(fileName, file, {
          upsert: false, cacheControl: '31536000', contentType: file.type || undefined
        });
        
        let finalVideoUrl = URL.createObjectURL(file);
        if (!uploadError) {
          const { data } = supabase.storage.from('feed-media').getPublicUrl(fileName);
          finalVideoUrl = data.publicUrl;
        }

        await supabase.from('profiles').update({ intro_video_url: finalVideoUrl }).eq('id', user.id);
        setProfileData(prev => ({ ...prev, introVideoUrl: finalVideoUrl }));
        setEditForm(prev => ({ ...prev, introVideoUrl: finalVideoUrl }));
        alert('Introduction video story updated successfully! 🎬');
      } catch (err) {
        console.error('Error uploading video:', err);
      } finally {
        setIsUploadingVideo(false);
      }
    }
  };

  const handleRemoveVideo = async () => {
    if (!confirm('Are you sure you want to remove your introduction story video?')) return;
    if (user?.id) {
      await supabase.from('profiles').update({ intro_video_url: null }).eq('id', user.id);
    }
    setProfileData(prev => ({ ...prev, introVideoUrl: '' }));
    setEditForm(prev => ({ ...prev, introVideoUrl: '' }));
    setIsVideoModalOpen(false);
  };

  const handleSaveProfile = async () => {
    if (!user?.id) return;
    setIsSaving(true);
    setProfileSaveError(null);
    try {
      const { data: savedProfile, error } = await supabase.from('profiles').update({
        full_name: editForm.name,
        role: editForm.role,
        company: editForm.company,
        experience_years: editForm.experienceYears,
        education: editForm.education,
        bio: editForm.bio,
        country: editForm.location,
        linkedin_url: editForm.linkedin,
        website_url: editForm.website,
        practice_area: editForm.practiceAreas,
        skills: editForm.skills,
        intro_video_url: editForm.introVideoUrl
      }).eq('id', user.id).select('*').single();

      if (error) throw error;
      if (!savedProfile) throw new Error('The updated profile could not be confirmed.');

      const confirmedProfile = {
        ...editForm,
        name: savedProfile.full_name ?? '',
        role: savedProfile.role ?? '',
        company: savedProfile.company ?? '',
        experienceYears: savedProfile.experience_years ?? 0,
        education: savedProfile.education ?? '',
        location: savedProfile.country ?? '',
        bio: savedProfile.bio ?? '',
        linkedin: savedProfile.linkedin_url ?? '',
        website: savedProfile.website_url ?? '',
        practiceAreas: savedProfile.practice_area ?? '',
        skills: savedProfile.skills ?? '',
        avatarUrl: savedProfile.avatar_url ?? editForm.avatarUrl,
        introVideoUrl: savedProfile.intro_video_url ?? ''
      };

      setProfileData(confirmedProfile);
      setEditForm(confirmedProfile);
      setUser({
        ...user,
        name: savedProfile.full_name ?? '',
        avatar_url: savedProfile.avatar_url ?? user.avatar_url,
        cover_url: savedProfile.cover_url ?? user.cover_url,
        country: savedProfile.country ?? '',
        practice_area: savedProfile.practice_area ?? '',
        bio: savedProfile.bio ?? ''
      });
      setIsEditModalOpen(false);
    } catch (err: any) {
      console.error('Error saving profile:', err);
      setProfileSaveError(err?.message || 'Profile could not be saved. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAbout = async () => {
    let currentUserId = user?.id;
    if (!currentUserId) {
      const { data: authData } = await supabase.auth.getUser();
      currentUserId = authData?.user?.id;
    }
    if (!currentUserId) {
      setAboutSaveError("User session not found. Please log in again.");
      return;
    }

    setIsSavingAbout(true);
    setAboutSaveError(null);
    try {
      const { data: savedProfile, error } = await supabase.from('profiles').update({
        bio: aboutForm.bio,
        practice_area: aboutForm.practiceAreas
      }).eq('id', currentUserId).select('bio, practice_area').single();

      if (error) throw error;

      setProfileData(prev => ({
        ...prev,
        bio: savedProfile?.bio ?? aboutForm.bio,
        practiceAreas: savedProfile?.practice_area ?? aboutForm.practiceAreas
      }));
      setEditForm(prev => ({
        ...prev,
        bio: savedProfile?.bio ?? aboutForm.bio,
        practiceAreas: savedProfile?.practice_area ?? aboutForm.practiceAreas
      }));
      setUser({
        ...user,
        practice_area: savedProfile?.practice_area ?? aboutForm.practiceAreas,
        bio: savedProfile?.bio ?? aboutForm.bio
      });
      setIsEditAboutModalOpen(false);
    } catch (err: any) {
      console.error('Error saving about:', err);
      setAboutSaveError(err?.message || 'Failed to update About details. Please try again.');
    } finally {
      setIsSavingAbout(false);
    }
  };

  const handleGenerateBioWithAI = async () => {
    setIsGeneratingBio(true);
    setAboutSaveError(null);
    setAiBioSuccess(false);
    try {
      const res = await fetch('/api/ai/generate-bio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brief: aboutForm.bio,
          name: profileData.name,
          role: profileData.role,
          company: profileData.company,
          practiceAreas: aboutForm.practiceAreas || profileData.practiceAreas,
          education: profileData.education,
          experienceYears: profileData.experienceYears,
          location: profileData.location
        })
      });

      const data = await res.json();
      if (data.text) {
        setAboutForm(prev => ({ ...prev, bio: data.text }));
        setAiBioSuccess(true);
        setTimeout(() => setAiBioSuccess(false), 6000);
      } else if (data.error) {
        setAboutSaveError(`AI Generation note: ${data.error}`);
      }
    } catch (err: any) {
      console.error('Error generating bio:', err);
      setAboutSaveError('Could not generate bio with AI. Please try again.');
    } finally {
      setIsGeneratingBio(false);
    }
  };

  const handleAddPosition = () => {
    setExperienceList(prev => [
      ...prev,
      {
        id: `pos-${Date.now()}`,
        title: '',
        company: '',
        location: '',
        years: 1,
        current: false,
        startDate: '',
        endDate: '',
        description: ''
      }
    ]);
  };

  const handleUpdatePosition = (index: number, field: keyof PositionItem, value: any) => {
    setExperienceList(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleRemovePosition = (index: number) => {
    setExperienceList(prev => {
      if (prev.length <= 1) {
        // Reset instead of empty array
        return [{
          id: `pos-${Date.now()}`,
          title: '',
          company: '',
          location: '',
          years: 1,
          current: true,
          description: ''
        }];
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSaveExperience = async () => {
    let currentUserId = user?.id;
    if (!currentUserId) {
      const { data: authData } = await supabase.auth.getUser();
      currentUserId = authData?.user?.id;
    }
    if (!currentUserId) {
      setExperienceSaveError("User session not found. Please log in again.");
      return;
    }

    const validPositions = experienceList.filter(p => p.title.trim() || p.company.trim());
    if (validPositions.length === 0) {
      setExperienceSaveError("Please add at least one position with a title or company.");
      return;
    }

    setIsSavingExperience(true);
    setExperienceSaveError(null);

    try {
      // Find current or primary position (first position)
      const primaryPos = validPositions.find(p => p.current) || validPositions[0];
      const updatePayload: any = {
        experience_data: validPositions,
        role: primaryPos.title || profileData.role,
        company: primaryPos.company || profileData.company,
        country: primaryPos.location || profileData.location
      };
      if (primaryPos.years && !isNaN(Number(primaryPos.years))) {
        updatePayload.experience_years = Number(primaryPos.years);
      }

      const { error } = await supabase.from('profiles').update(updatePayload).eq('id', currentUserId);
      if (error) throw error;

      setProfileData(prev => ({
        ...prev,
        role: primaryPos.title || prev.role,
        company: primaryPos.company || prev.company,
        location: primaryPos.location || prev.location,
        experienceYears: Number(primaryPos.years) || prev.experienceYears,
        positions: validPositions
      }));

      setEditForm(prev => ({
        ...prev,
        role: primaryPos.title || prev.role,
        company: primaryPos.company || prev.company,
        location: primaryPos.location || prev.location,
        experienceYears: Number(primaryPos.years) || prev.experienceYears
      }));

      setUser({
        ...user,
        role: primaryPos.title || user.role,
        company: primaryPos.company || user.company,
        country: primaryPos.location || user.country
      });

      setIsEditExperienceModalOpen(false);
    } catch (err: any) {
      console.error("Error saving positions:", err);
      setExperienceSaveError(err?.message || "Failed to save positions. Please try again.");
    } finally {
      setIsSavingExperience(false);
    }
  };

  const handleAddEducation = () => {
    setEducationList(prev => [
      ...prev,
      {
        id: `edu-${Date.now()}`,
        institution: '',
        degree: '',
        fieldOfStudy: '',
        year: '',
        grade: '',
        description: ''
      }
    ]);
  };

  const handleUpdateEducation = (index: number, field: keyof EducationItem, value: any) => {
    setEducationList(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleRemoveEducation = (index: number) => {
    setEducationList(prev => {
      if (prev.length <= 1) {
        return [{
          id: `edu-${Date.now()}`,
          institution: '',
          degree: '',
          fieldOfStudy: '',
          year: '',
          grade: '',
          description: ''
        }];
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSaveEducation = async () => {
    let currentUserId = user?.id;
    if (!currentUserId) {
      const { data: authData } = await supabase.auth.getUser();
      currentUserId = authData?.user?.id;
    }
    if (!currentUserId) {
      setEducationSaveError("User session not found. Please log in again.");
      return;
    }

    const validEducations = educationList.filter(e => e.institution.trim() || e.degree.trim());
    if (validEducations.length === 0) {
      setEducationSaveError("Please add at least one institution or degree.");
      return;
    }

    setIsSavingEducation(true);
    setEducationSaveError(null);

    try {
      const primaryEdu = validEducations[0];
      const primaryTitle = primaryEdu.institution || primaryEdu.degree;

      const { error } = await supabase.from('profiles').update({
        education_data: validEducations,
        education: primaryTitle
      }).eq('id', currentUserId);

      if (error) throw error;

      setProfileData(prev => ({
        ...prev,
        education: primaryTitle,
        educations: validEducations
      }));

      setEditForm(prev => ({
        ...prev,
        education: primaryTitle
      }));

      setUser({
        ...user,
        education: primaryTitle
      });

      setIsEditEducationModalOpen(false);
    } catch (err: any) {
      console.error("Error saving education credentials:", err);
      setEducationSaveError(err?.message || "Failed to save education. Please try again.");
    } finally {
      setIsSavingEducation(false);
    }
  };

  const [attachedMedia, setAttachedMedia] = useState<{
    file: File;
    previewUrl: string;
    type: 'image' | 'video' | 'doc';
    name: string;
    size?: string;
  } | null>(null);
  const postImageInputRef = useRef<HTMLInputElement>(null);
  const postVideoInputRef = useRef<HTMLInputElement>(null);
  const postDocInputRef = useRef<HTMLInputElement>(null);

  const handleCreatePost = async () => {
    if ((!newPostText.trim() && !attachedMedia) || !user?.id) return;
    setIsPublishing(true);
    try {
      let mediaUrls: string[] = [];
      let mediaType = attachedMedia?.type || null;
      let docName = attachedMedia?.name || null;

      if (attachedMedia?.file) {
        const uploadFile = attachedMedia.type === 'image'
          ? await optimizeFeedUpload(attachedMedia.file)
          : attachedMedia.file;
        const safeName = uploadFile.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const fileName = `${user.id}/${Date.now()}-${safeName}`;
        const { error: uploadErr } = await supabase.storage
          .from('feed-media')
          .upload(fileName, uploadFile, {
            upsert: false, cacheControl: '31536000', contentType: uploadFile.type || undefined
          });

        if (!uploadErr) {
          const { data: urlData } = supabase.storage.from('feed-media').getPublicUrl(fileName);
          if (urlData?.publicUrl) {
            mediaUrls = [urlData.publicUrl];
          }
        }
      }

      const { data, error } = await supabase
        .from('feed_posts')
        .insert({
          author_id: user.id,
          content: newPostText.trim(),
          privacy: 'Anyone',
          media_urls: mediaUrls,
          media_type: mediaType,
          document_name: docName
        })
        .select(`
          *,
          author:profiles!feed_posts_author_id_fkey(full_name, avatar_url, role, is_wipa_recommended)
        `)
        .single();

      if (!error && data) {
        setUserPosts(prev => [data, ...prev]);
        setNewPostText('');
        setAttachedMedia(null);
        setStats(prev => ({ ...prev, posts: prev.posts + 1 }));
      } else if (error) {
        console.error("Error inserting post to DB:", error);
      }
    } catch (e) {
      console.error("Error creating post:", e);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleToggleLike = async (postId: string) => {
    if (!user?.id) return;
    const isLiked = likedPostIds.has(postId);
    const nextLiked = new Set(likedPostIds);
    if (isLiked) {
      nextLiked.delete(postId);
      setUserPosts(prev => prev.map(p => p.id === postId ? { ...p, likes_count: Math.max(0, (p.likes_count || 0) - 1) } : p));
      await supabase.from('feed_likes').delete().match({ post_id: postId, user_id: user.id });
    } else {
      nextLiked.add(postId);
      setUserPosts(prev => prev.map(p => p.id === postId ? { ...p, likes_count: (p.likes_count || 0) + 1 } : p));
      await supabase.from('feed_likes').insert({ post_id: postId, user_id: user.id });
    }
    setLikedPostIds(nextLiked);
  };

  const beginEditingPost = (post: any) => {
    setEditingPostId(post.id);
    setEditingPostContent(post.content || '');
    setActivePostMenuId(null);
  };

  const handleSavePost = async (postId: string) => {
    if (!user?.id || !editingPostContent.trim() || isSavingPost) return;
    setIsSavingPost(true);
    const content = editingPostContent.trim();
    const { error } = await supabase
      .from('feed_posts')
      .update({ content })
      .eq('id', postId)
      .eq('author_id', user.id)
      .is('group_id', null);
    setIsSavingPost(false);

    if (error) {
      alert(error.message || 'Could not update this post.');
      return;
    }

    setUserPosts((current) => current.map((post) => post.id === postId ? { ...post, content } : post));
    setEditingPostId(null);
    setEditingPostContent('');
  };

  const handleDeletePost = async (postId: string) => {
    if (!user?.id || deletingPostId) return;
    setActivePostMenuId(null);
    if (!window.confirm('Delete this post? This cannot be undone.')) return;

    setDeletingPostId(postId);
    const { error } = await supabase
      .from('feed_posts')
      .delete()
      .eq('id', postId)
      .eq('author_id', user.id)
      .is('group_id', null);
    setDeletingPostId(null);

    if (error) {
      alert(error.message || 'Could not delete this post.');
      return;
    }

    setUserPosts((current) => current.filter((post) => post.id !== postId));
    setStats((current) => ({ ...current, posts: Math.max(0, current.posts - 1) }));
  };

  const handleCopyPostLink = async (postId: string) => {
    setActivePostMenuId(null);
    await navigator.clipboard.writeText(`${window.location.origin}/platform/post/${postId}`);
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] dark:bg-[#0b0f19] text-gray-900 dark:text-gray-100 font-sans pb-20">
      
      {/* Top Banner & Header Container */}
      <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 pt-0 sm:pt-4">
        
        {/* ================= HERO PROFILE CARD (FB + LINKEDIN HYBRID) ================= */}
        <div className="bg-white dark:bg-[#151c2c] rounded-none sm:rounded-2xl md:rounded-3xl border-x-0 sm:border-x border-b sm:border-y border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden mb-4 sm:mb-6">
          
          {/* Cover Photo */}
          <div className="relative h-48 w-full overflow-hidden bg-white sm:h-64 md:h-80">
            {(user?.cover_url || coverImage) ? (
              <img
                src={user?.cover_url || coverImage || ''}
                alt="Profile cover"
                className="absolute inset-0 h-full w-full object-contain object-center sm:object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-r from-[#5a32fa] via-[#7952ff] to-[#ff90e8]">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_3px,transparent_3px)] [background-size:24px_24px]" />
              </div>
            )}

            {/* Edit Cover Photo Button */}
            <button 
              onClick={() => coverInputRef.current?.click()}
              disabled={isUploadingCover}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 bg-black/60 hover:bg-black/80 text-white backdrop-blur-md px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all shadow-md hover:scale-105"
            >
              {isUploadingCover ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
              <span>{isUploadingCover ? 'Uploading...' : 'Edit Cover'}</span>
            </button>
            <input type="file" ref={coverInputRef} onChange={onCoverFileSelected} accept="image/*" className="hidden" />
          </div>

          {/* Profile Header Info */}
          <div className="px-4 sm:px-8 pb-6 sm:pb-8 relative">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 -mt-16 sm:-mt-24 mb-4">
              
              {/* Avatar + Rainbow Gradient Story Ring */}
              <div className="relative group self-start">
                
                {/* Glowing Story Gradient Ring */}
                <div 
                  className="p-[4px] rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-[#5a32fa] animate-gradient cursor-pointer hover:scale-105 transition-all shadow-xl relative"
                  onClick={() => setIsVideoModalOpen(true)}
                  title="Click to watch Introduction Story Video"
                >
                  <div className="w-28 h-28 sm:w-40 sm:h-40 rounded-full bg-white dark:bg-[#151c2c] p-1">
                    <div 
                      className="w-full h-full rounded-full bg-gradient-to-br from-[#5a32fa] to-[#ff90e8] flex items-center justify-center text-white text-4xl sm:text-6xl font-bold overflow-hidden relative"
                      style={{ backgroundImage: profileData.avatarUrl ? `url(${profileData.avatarUrl})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center' }}
                    >
                      {!profileData.avatarUrl && profileData.name.charAt(0).toUpperCase()}

                      {/* Play Story Overlay Icon on Hover */}
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <PlayCircle size={44} className="text-white drop-shadow-lg" />
                      </div>
                    </div>
                  </div>

                  {/* Pulsing "Story Video" Badge */}
                  <div className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-[#5a32fa] text-white p-1.5 rounded-full shadow-md border-2 border-white dark:border-[#151c2c] flex items-center justify-center">
                    <Play size={12} className="fill-white" />
                  </div>
                </div>

                {/* Camera Upload Badge for Photo */}
                <button 
                  onClick={(e) => { e.stopPropagation(); avatarInputRef.current?.click(); }}
                  className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 p-2 bg-[#5a32fa] hover:bg-[#4a24db] text-white rounded-full shadow-lg border-2 border-white dark:border-[#151c2c] transition-transform hover:scale-110 z-10 cursor-pointer"
                  title="Change Profile Photo"
                >
                  <Camera size={15} />
                </button>
                <input type="file" ref={avatarInputRef} onChange={onAvatarFileSelected} accept="image/*" className="hidden" />
                <input type="file" ref={videoInputRef} onChange={handleVideoUpload} accept="video/*" className="hidden" />
              </div>

              {/* Action Buttons (LinkedIn/FB style) */}
              <div className="flex flex-wrap items-center gap-2.5 pt-2 md:pt-0">
                
                {/* Upload / Change Video Story Button */}
                <button 
                  onClick={() => videoInputRef.current?.click()}
                  disabled={isUploadingVideo}
                  className="px-4 py-2.5 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold text-sm flex items-center gap-2 transition-all cursor-pointer"
                  title="Upload or Change Intro Video Story"
                >
                  {isUploadingVideo ? <Loader2 size={16} className="animate-spin" /> : <Video size={16} className="text-[#5a32fa] dark:text-[#ff90e8]" />}
                  <span>{isUploadingVideo ? 'Uploading...' : profileData.introVideoUrl ? 'Change Story' : 'Add Story'}</span>
                </button>

                <button 
                  onClick={() => { setProfileSaveError(null); setEditForm(profileData); setIsEditModalOpen(true); }}
                  className="px-5 py-2.5 rounded-full bg-[#5a32fa] hover:bg-[#4a24db] text-white font-semibold text-sm flex items-center gap-2 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
                >
                  <Edit3 size={16} /> Edit Profile
                </button>

                <button 
                  onClick={() => setIsShareModalOpen(true)}
                  className="px-4 py-2.5 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold text-sm flex items-center gap-2 transition-all"
                >
                  <Share2 size={16} /> Share
                </button>

                <Link 
                  href="/platform/settings"
                  className="p-2.5 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors inline-flex items-center justify-center"
                  title="Settings & Preferences"
                >
                  <Settings size={18} />
                </Link>
              </div>
            </div>

            {/* Name, Headline & Metadata */}
            <div className="space-y-2 mt-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                  {profileData.name}
                </h1>
                
                {profileData.verificationStatus === 'verified' && (
                  <span className="inline-flex items-center gap-1 text-[#00d26a] bg-emerald-500/10 px-2.5 py-0.5 rounded-full text-xs font-bold border border-emerald-500/20">
                    <BadgeCheck size={14} className="fill-[#00d26a] text-white" /> Verified Counsel
                  </span>
                )}

                <span className="inline-flex items-center gap-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2.5 py-0.5 rounded-full text-xs font-bold border border-blue-500/20 shadow-xs">
                  <ShieldCheck size={14} className="text-blue-500" /> LexisNexis® Certified IP Specialist
                </span>

                {profileData.isWipaRecommended && (
                  <span className="inline-flex items-center gap-1 bg-amber-400/10 text-amber-600 dark:text-amber-400 px-2.5 py-0.5 rounded-full text-xs font-bold border border-amber-400/30 shadow-sm">
                    <Star size={12} className="fill-amber-400 text-amber-400" /> Recommended by WIPA
                  </span>
                )}
              </div>

              <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 font-medium leading-snug max-w-3xl">
                {profileData.role || 'Intellectual Property Specialist | WIPA Member'}
              </p>

              {/* Location, Links & Company info */}
              <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400 pt-1">
                {(profileData.location || profileData.country) && (
                  <span className="flex items-center gap-1 font-medium">
                    <MapPin size={15} className="text-[#ff4b4b]" /> {profileData.location || profileData.country}
                  </span>
                )}

                {profileData.company && (
                  <span className="flex items-center gap-1 font-medium text-[#5a32fa] dark:text-[#ff90e8]">
                    <Briefcase size={15} /> {profileData.company}
                  </span>
                )}

                {profileData.education && (
                  <span className="flex items-center gap-1 font-medium">
                    <GraduationCap size={15} /> {profileData.education}
                  </span>
                )}

                {profileData.memberId && (
                  <span className="inline-flex items-center gap-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-md font-mono text-xs font-semibold">
                    <Hash size={12} /> {profileData.memberId}
                  </span>
                )}
              </div>

              {/* Network Stats Bar */}
              <div className="flex items-center gap-4 text-xs sm:text-sm pt-2 text-gray-600 dark:text-gray-400">
                <span className="font-bold text-gray-900 dark:text-white">
                  {stats.connections} <span className="font-normal text-gray-500">connections</span>
                </span>
                <span>•</span>
                <span className="font-bold text-gray-900 dark:text-white">
                  {stats.followers} <span className="font-normal text-gray-500">followers</span>
                </span>
                <span>•</span>
                <span className="font-bold text-[#5a32fa] dark:text-[#ff90e8] hover:underline cursor-pointer">
                  Contact info
                </span>
              </div>
            </div>

            {/* Profile Navigation Tabs (LinkedIn/FB style) */}
            <div className="flex border-t border-gray-200 dark:border-gray-800 mt-6 pt-1 gap-2 sm:gap-6 overflow-x-auto no-scrollbar">
              {[
                { key: 'activity', label: 'Posts & Activity', count: stats.posts },
                { key: 'about', label: 'About' },
                { key: 'experience', label: 'Experience' },
                { key: 'education', label: 'Education & Honors' },
                { key: 'skills', label: 'Skills & Endorsements' }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`py-3 px-3 sm:px-4 font-semibold text-sm whitespace-nowrap border-b-2 transition-all flex items-center gap-2 ${
                    activeTab === tab.key
                      ? 'border-[#5a32fa] text-[#5a32fa] dark:text-[#ff90e8]'
                      : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {tab.label}
                  {tab.count !== undefined && (
                    <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full font-bold">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

          </div>
        </div>

        {/* ================= 2-COLUMN MAIN CONTENT (LINKEDIN/FB GRID) ================= */}
        <div className="px-3 sm:px-0 grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* ================= LEFT / MAIN CONTENT STREAM (2 COLS) ================= */}
          <div className="lg:col-span-2 space-y-6">

            {/* TAB 1: POSTS & ACTIVITY */}
            {activeTab === 'activity' && (
              <>
                {/* LinkedIn-style "Create a Post" Box (Navigates directly to /platform/create-post) */}
                <div className="bg-white dark:bg-[#151c2c] rounded-2xl p-4 sm:p-5 border border-gray-200 dark:border-gray-800 shadow-sm transition-all hover:border-gray-300 dark:hover:border-gray-700">
                  <div 
                    onClick={() => router.push('/platform/create-post')}
                    className="flex items-center gap-3 mb-3 cursor-pointer group"
                  >
                    <div 
                      className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#5a32fa] to-[#ff90e8] text-white flex items-center justify-center font-bold text-sm overflow-hidden shrink-0 group-hover:scale-105 transition-transform"
                      style={{ backgroundImage: profileData.avatarUrl ? `url(${profileData.avatarUrl})` : undefined, backgroundSize: 'cover' }}
                    >
                      {!profileData.avatarUrl && profileData.name.charAt(0)}
                    </div>
                    
                    <div 
                      className="flex-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200/70 dark:hover:bg-gray-700/70 text-gray-500 dark:text-gray-400 rounded-full px-4 py-2.5 text-sm transition-all border border-transparent group-hover:border-[#5a32fa]/40 flex items-center select-none"
                    >
                      <span>What&apos;s on your mind, {profileData.name.split(' ')[0]}?</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800/80">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <button 
                        type="button"
                        onClick={() => router.push('/platform/create-post?type=photo')}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
                      >
                        <ImageIcon size={18} className="text-blue-500" />
                        <span className="hidden sm:inline">Photo</span>
                      </button>
                      <button 
                        type="button"
                        onClick={() => router.push('/platform/create-post?type=video')}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
                      >
                        <Video size={18} className="text-emerald-500" />
                        <span className="hidden sm:inline">Video</span>
                      </button>
                      <button 
                        type="button"
                        onClick={() => router.push('/platform/create-post?type=doc')}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
                      >
                        <FileText size={18} className="text-[#5a32fa] dark:text-[#ff90e8]" />
                        <span className="hidden sm:inline">Document / PDF</span>
                      </button>
                    </div>

                    <button 
                      type="button"
                      onClick={() => router.push('/platform/create-post')}
                      className="px-5 py-1.5 bg-[#5a32fa] hover:bg-[#4a24db] text-white text-xs sm:text-sm font-bold rounded-full transition-all flex items-center gap-1.5 shadow-sm cursor-pointer active:scale-95"
                    >
                      <Send size={14} />
                      <span>Post</span>
                    </button>
                  </div>
                </div>

                {/* User's Post Feed */}
                <div className="space-y-4">
                  {isLoadingPosts ? (
                    <div className="bg-white dark:bg-[#151c2c] rounded-2xl p-8 border border-gray-200 dark:border-gray-800 flex items-center justify-center text-gray-500 gap-2">
                      <Loader2 size={20} className="animate-spin text-[#5a32fa]" />
                      <span className="text-sm font-medium">Loading your activity...</span>
                    </div>
                  ) : userPosts.length === 0 ? (
                    <div className="bg-white dark:bg-[#151c2c] rounded-2xl p-8 border border-gray-200 dark:border-gray-800 text-center space-y-3 shadow-sm">
                      <div className="w-12 h-12 rounded-2xl bg-[#5a32fa]/10 text-[#5a32fa] flex items-center justify-center mx-auto">
                        <MessageSquare size={22} />
                      </div>
                      <h4 className="font-bold text-base text-gray-900 dark:text-white">No posts published yet</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                        Share your thoughts, IP case analysis, or an update with the global WIPA community using the composer above!
                      </p>
                    </div>
                  ) : (
                    userPosts.map((post) => {
                      const isLiked = likedPostIds.has(post.id);
                      return (
                        <div key={post.id} className="bg-white dark:bg-[#151c2c] rounded-2xl p-5 border border-gray-200 dark:border-gray-800 shadow-sm">
                          {/* Post Author Header */}
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div 
                                className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#5a32fa] to-[#ff90e8] text-white flex items-center justify-center font-bold text-sm overflow-hidden shrink-0"
                                style={{ backgroundImage: (post.author?.avatar_url || profileData.avatarUrl) ? `url(${post.author?.avatar_url || profileData.avatarUrl})` : undefined, backgroundSize: 'cover' }}
                              >
                                {!(post.author?.avatar_url || profileData.avatarUrl) && (post.author?.full_name || profileData.name).charAt(0)}
                              </div>
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <h4 className="font-bold text-sm text-gray-900 dark:text-white">{post.author?.full_name || profileData.name}</h4>
                                  <BadgeCheck size={14} className="text-[#00d26a]" />
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{post.author?.role || profileData.role.split('|')[0]}</p>
                                <span className="text-[11px] text-gray-400 flex items-center gap-1">
                                  {new Date(post.created_at).toLocaleDateString()} • <Globe2 size={10} />
                                </span>
                              </div>
                            </div>

                            <div className="relative">
                              {activePostMenuId === post.id && (
                                <button
                                  type="button"
                                  className="fixed inset-0 z-10 cursor-default"
                                  onClick={() => setActivePostMenuId(null)}
                                  aria-label="Close post actions"
                                />
                              )}
                              <button
                                type="button"
                                onClick={() => setActivePostMenuId((current) => current === post.id ? null : post.id)}
                                disabled={deletingPostId === post.id}
                                className="relative z-20 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
                                aria-label="Open post actions"
                              >
                                {deletingPostId === post.id ? <Loader2 size={18} className="animate-spin" /> : <MoreHorizontal size={18} />}
                              </button>

                              {activePostMenuId === post.id && (
                                <div className="absolute right-0 top-10 z-30 w-44 overflow-hidden rounded-xl border border-gray-200 bg-white py-1.5 shadow-xl dark:border-gray-700 dark:bg-[#1d2638]">
                                  <button
                                    type="button"
                                    onClick={() => beginEditingPost(post)}
                                    className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-xs font-bold text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-white/10"
                                  >
                                    <Edit3 size={15} /> Edit post
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleCopyPostLink(post.id)}
                                    className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-xs font-bold text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-white/10"
                                  >
                                    <Copy size={15} /> Copy post link
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeletePost(post.id)}
                                    className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-xs font-bold text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
                                  >
                                    <Trash2 size={15} /> Delete post
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* LinkedIn-Style Content */}
                          {editingPostId === post.id ? (
                            <div className="mb-4 space-y-3 rounded-xl border border-indigo-200 bg-indigo-50/50 p-3 dark:border-indigo-800/60 dark:bg-indigo-950/20">
                              <textarea
                                rows={4}
                                value={editingPostContent}
                                onChange={(event) => setEditingPostContent(event.target.value)}
                                className="w-full resize-none rounded-xl border border-gray-200 bg-white p-3 text-sm text-gray-900 outline-none focus:border-[#5a32fa] dark:border-white/10 dark:bg-[#111827] dark:text-white"
                              />
                              <div className="flex justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => { setEditingPostId(null); setEditingPostContent(''); }}
                                  className="rounded-lg bg-gray-100 px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-200 dark:bg-white/10 dark:text-gray-300"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleSavePost(post.id)}
                                  disabled={isSavingPost || !editingPostContent.trim()}
                                  className="flex items-center gap-2 rounded-lg bg-[#5a32fa] px-4 py-2 text-xs font-bold text-white hover:bg-[#4a24db] disabled:opacity-50"
                                >
                                  {isSavingPost && <Loader2 size={14} className="animate-spin" />}
                                  Save
                                </button>
                              </div>
                            </div>
                          ) : post.content && (() => {
                            const isExpanded = expandedPosts.has(post.id);
                            const { preview, hasMore } = getPostPreview(post.content || '');
                            const displayContent = isExpanded ? (post.content || '') : preview;

                            return (
                              <div className="mb-3">
                                <div className="text-sm sm:text-base text-gray-800 dark:text-gray-200 leading-relaxed font-normal inline">
                                  <FormattedPostText text={displayContent} />
                                  {hasMore && !isExpanded && (
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleExpandPost(post.id);
                                      }}
                                      className="inline text-gray-500 hover:text-[#5a32fa] dark:text-gray-400 dark:hover:text-[#ff90e8] font-bold text-xs ml-1 cursor-pointer transition-colors"
                                    >
                                      ...read more
                                    </button>
                                  )}
                                </div>
                                {hasMore && isExpanded && (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleExpandPost(post.id);
                                    }}
                                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xs font-medium mt-1.5 block cursor-pointer"
                                  >
                                    Show less
                                  </button>
                                )}
                              </div>
                            );
                          })()}

                          {/* Post Media Attachments (Images, Videos, Documents/PDFs) */}
                          {post.media_urls && post.media_urls.length > 0 && post.media_urls.map((url: string, mIdx: number) => {
                            const isVideo = post.media_type === 'video' || url.match(/\.(mp4|webm|mov|ogg)$/i);
                            const isDoc = post.media_type === 'doc' || url.match(/\.(pdf|doc|docx|txt)$/i);

                            if (isVideo) {
                              return (
                                <div key={mIdx} className="mb-4 rounded-2xl overflow-hidden bg-black shadow-sm flex items-center justify-center border border-gray-100 dark:border-white/5 p-0.5">
                                  <video 
                                    src={url} 
                                    controls 
                                    playsInline 
                                    preload="metadata"
                                    className="max-h-[290px] sm:max-h-[440px] w-auto max-w-full h-auto object-contain rounded-xl mx-auto block" 
                                  />
                                </div>
                              );
                            }

                            if (isDoc) {
                              return (
                                <a 
                                  key={mIdx}
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-between p-4 rounded-xl sm:rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/40 hover:border-[#5a32fa] transition-all mb-4 group/doc shadow-sm"
                                >
                                  <div className="flex items-center gap-3.5 overflow-hidden">
                                    <div className="w-11 h-11 rounded-xl bg-[#5a32fa] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-md">
                                      <FileText size={22} />
                                    </div>
                                    <div className="overflow-hidden">
                                      <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate group-hover/doc:text-[#5a32fa] transition-colors">
                                        {post.document_name || 'Legal Document / PDF'}
                                      </h4>
                                      <p className="text-xs text-gray-500 dark:text-gray-400">Click to view & download document</p>
                                    </div>
                                  </div>
                                  <ArrowUpRight size={18} className="text-gray-400 group-hover/doc:text-[#5a32fa] group-hover/doc:translate-x-0.5 group-hover/doc:-translate-y-0.5 transition-transform shrink-0" />
                                </a>
                              );
                            }

                            return (
                              <div key={mIdx} className="mb-4 w-full max-w-full min-w-0 rounded-2xl overflow-hidden bg-slate-900/5 dark:bg-black/40 shadow-sm flex items-center justify-center border border-gray-100 dark:border-white/5 p-0.5 box-border">
                                <img 
                                  src={url} 
                                  alt="Post attachment" 
                                  className="w-full max-w-full h-auto max-h-[75vh] sm:max-h-[560px] object-contain rounded-xl hover:opacity-98 transition-opacity md:cursor-pointer block mx-auto"
                                  onClick={() => {
                                    if (typeof window !== 'undefined' && window.innerWidth >= 768) {
                                      setPreviewModalImage(url);
                                    }
                                  }}
                                />
                              </div>
                            );
                          })}

                          {/* Instagram-Style Action Bar */}
                          <div className="w-full max-w-full min-w-0 flex items-center justify-between pt-2 box-border">
                            <div className="flex items-center gap-4">
                              <button 
                                onClick={() => handleToggleLike(post.id)}
                                className="text-gray-700 dark:text-gray-200 hover:text-rose-500 transition-transform active:scale-75"
                              >
                                <Heart size={22} className={isLiked ? 'fill-rose-500 text-rose-500' : ''} />
                              </button>
                              <button 
                                onClick={() => router.push('/platform')}
                                className="text-gray-700 dark:text-gray-200 hover:text-[#5a32fa] transition-transform active:scale-75"
                              >
                                <MessageCircle size={22} />
                              </button>
                              <button 
                                onClick={() => {
                                  navigator.clipboard.writeText(window.location.origin + '/platform');
                                  alert('Post link copied to clipboard!');
                                }}
                                className="text-gray-700 dark:text-gray-200 hover:text-[#ff90e8] transition-transform active:scale-75 -rotate-12"
                              >
                                <Send size={20} />
                              </button>
                            </div>
                            <button 
                              onClick={() => {
                                navigator.clipboard.writeText(window.location.origin + '/platform');
                                alert('Post saved!');
                              }}
                              className="text-gray-700 dark:text-gray-200 hover:text-[#5a32fa] transition-transform active:scale-75"
                            >
                              <Bookmark size={22} />
                            </button>
                          </div>

                          {/* Likes Count Summary */}
                          <div className="pt-2 text-xs font-bold text-gray-900 dark:text-white">
                            {post.likes_count ? `${post.likes_count.toLocaleString()} likes` : '0 likes'}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </>
            )}

            {/* TAB 2: ABOUT SECTION */}
            {activeTab === 'about' && (
              <div className="bg-white dark:bg-[#151c2c] rounded-3xl p-6 sm:p-8 border border-gray-200/80 dark:border-gray-800 shadow-sm transition-all space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100 dark:border-gray-800/80">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500/15 via-pink-500/15 to-indigo-500/15 border border-purple-500/20 text-[#5a32fa] dark:text-[#ff90e8] flex items-center justify-center shadow-inner shrink-0">
                      <User size={22} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-black text-gray-900 dark:text-white">About</h3>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                          Biography
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-medium">Professional background, IP mission & core expertise</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setAboutSaveError(null);
                      setAboutForm({
                        bio: profileData.bio,
                        practiceAreas: profileData.practiceAreas
                      });
                      setIsEditAboutModalOpen(true);
                    }}
                    className="px-4 py-2 text-xs font-bold text-[#5a32fa] dark:text-[#ff90e8] bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/50 border border-purple-200/80 dark:border-purple-800/60 rounded-full flex items-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-sm cursor-pointer self-start sm:self-auto"
                    title="Edit About & Practice Areas"
                  >
                    <Edit3 size={14} className="stroke-[2.5]" />
                    <span>Edit About</span>
                  </button>
                </div>

                {/* Bio Content Box */}
                <div className="p-6 rounded-2xl bg-gray-50/70 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
                  <p className="text-sm sm:text-base text-gray-700 dark:text-gray-200 leading-relaxed whitespace-pre-line font-normal">
                    {profileData.bio || 'Dedicated IP practitioner and active contributor to the Women in Intellectual Property Alliance.'}
                  </p>
                </div>

                {/* Practice Areas & Specializations */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles size={16} className="text-[#5a32fa] dark:text-[#ff90e8]" />
                    <h4 className="text-xs font-black uppercase tracking-wider text-gray-900 dark:text-white">
                      Practice Areas & Specializations
                    </h4>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {(profileData.practiceAreas || 'Patents, Trademarks, IP Strategy, Licensing')
                      .split(',')
                      .map(s => s.trim())
                      .filter(Boolean)
                      .map((area, idx) => (
                        <div 
                          key={idx} 
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-50/80 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/60 text-[#5a32fa] dark:text-[#ff90e8] font-bold text-xs border border-purple-200/70 dark:border-purple-800/60 transition-all hover:scale-105 shadow-sm"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#5a32fa] dark:bg-[#ff90e8]"></span>
                          <span>{area}</span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: EXPERIENCE TIMELINE */}
            {activeTab === 'experience' && (
              <div className="bg-white dark:bg-[#151c2c] rounded-3xl p-6 sm:p-8 border border-gray-200/80 dark:border-gray-800 shadow-sm transition-all">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-100 dark:border-gray-800/80">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500/15 via-indigo-500/15 to-pink-500/15 border border-purple-500/20 text-[#5a32fa] dark:text-[#ff90e8] flex items-center justify-center shadow-inner shrink-0">
                      <Briefcase size={22} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-black text-gray-900 dark:text-white">Experience</h3>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                          {((profileData.positions && profileData.positions.length > 0) ? profileData.positions.length : 1)} {((profileData.positions && profileData.positions.length > 0) ? (profileData.positions.length === 1 ? 'Role' : 'Roles') : 'Role')}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-medium">Professional practice, leadership roles & career timeline</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setExperienceSaveError(null);
                      const currentPositions = (profileData.positions && profileData.positions.length > 0)
                        ? profileData.positions
                        : [
                            {
                              id: 'pos-1',
                              title: profileData.role || 'Intellectual Property Specialist | WIPA Member',
                              company: profileData.company || 'International IP Practice',
                              location: profileData.location || 'Global',
                              years: profileData.experienceYears || 5,
                              current: true,
                              startDate: '',
                              endDate: '',
                              description: ''
                            }
                          ];
                      setExperienceList(JSON.parse(JSON.stringify(currentPositions)));
                      setIsEditExperienceModalOpen(true);
                    }}
                    className="px-4 py-2 text-xs font-bold text-[#5a32fa] dark:text-[#ff90e8] bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/50 border border-purple-200/80 dark:border-purple-800/60 rounded-full flex items-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-sm cursor-pointer self-start sm:self-auto"
                    title="Add or Edit Positions"
                  >
                    <Plus size={14} className="stroke-[3]" />
                    <span>Edit Positions</span>
                  </button>
                </div>

                {/* Timeline Container */}
                <div className="relative pl-2 sm:pl-4 space-y-8 before:absolute before:left-8 sm:before:left-10 before:top-4 before:bottom-4 before:w-0.5 before:bg-gradient-to-b before:from-[#5a32fa] before:via-indigo-400 before:to-gray-200 dark:before:to-gray-800">
                  {((profileData.positions && profileData.positions.length > 0) ? profileData.positions : [
                    {
                      id: 'pos-1',
                      title: profileData.role || 'Intellectual Property Specialist | WIPA Member',
                      company: profileData.company || 'International IP Practice',
                      location: profileData.location || 'Global',
                      years: profileData.experienceYears || 5,
                      current: true,
                      description: ''
                    }
                  ]).map((pos, pIdx) => {
                    const companyInitial = (pos.company || 'C').charAt(0).toUpperCase();
                    const colorGradients = [
                      'from-[#5a32fa] to-[#8b5cf6]',
                      'from-[#ff2a5f] to-[#ff90e8]',
                      'from-[#00b4d8] to-[#0077b6]',
                      'from-[#10b981] to-[#059669]',
                      'from-[#f59e0b] to-[#d97706]'
                    ];
                    const selectedGrad = colorGradients[pIdx % colorGradients.length];

                    return (
                      <div key={pos.id || pIdx} className="relative flex items-start gap-4 sm:gap-6 group">
                        
                        {/* Interactive Timeline Monogram Node */}
                        <div className="relative z-10 shrink-0">
                          <div className={`w-12 h-12 sm:w-13 sm:h-13 rounded-2xl bg-gradient-to-br ${selectedGrad} text-white flex items-center justify-center font-black text-lg shadow-lg ring-4 ring-white dark:ring-[#151c2c] group-hover:scale-110 group-hover:shadow-purple-500/25 transition-all duration-300`}>
                            {companyInitial}
                          </div>
                          {pos.current && (
                            <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white dark:border-[#151c2c]"></span>
                            </span>
                          )}
                        </div>

                        {/* Experience Content Box */}
                        <div className="flex-1 bg-gray-50/60 dark:bg-gray-800/40 hover:bg-gray-50 dark:hover:bg-gray-800/80 border border-gray-100 dark:border-gray-800 p-5 rounded-2xl transition-all duration-200 group-hover:border-purple-200 dark:group-hover:border-purple-800/60 group-hover:shadow-md">
                          
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                            <h4 className="text-base sm:text-lg font-black text-gray-900 dark:text-white group-hover:text-[#5a32fa] dark:group-hover:text-[#ff90e8] transition-colors">
                              {pos.title || 'Intellectual Property Specialist'}
                            </h4>
                            {pos.current && (
                              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-wider border border-emerald-500/30 inline-flex items-center gap-1 shadow-sm">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                Current Role
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5 text-sm font-bold text-[#5a32fa] dark:text-[#ff90e8] mb-3">
                            <Building2 size={15} />
                            <span>{pos.company || 'International IP Practice'}</span>
                          </div>

                          {/* Meta Tags Row */}
                          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-gray-500 dark:text-gray-400">
                            {pos.years && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-gray-900/60 border border-gray-200/60 dark:border-gray-700/60">
                                <Clock size={13} className="text-purple-500" />
                                {pos.years} {pos.years === 1 ? 'year' : 'years'} experience
                              </span>
                            )}
                            {pos.location && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-gray-900/60 border border-gray-200/60 dark:border-gray-700/60">
                                <MapPin size={13} className="text-pink-500" />
                                {pos.location}
                              </span>
                            )}
                            {pos.startDate && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-gray-900/60 border border-gray-200/60 dark:border-gray-700/60">
                                <Calendar size={13} className="text-indigo-500" />
                                {pos.startDate} {pos.endDate ? `– ${pos.endDate}` : (pos.current ? '– Present' : '')}
                              </span>
                            )}
                          </div>

                          {pos.description && (
                            <div className="mt-4 pt-3.5 border-t border-gray-200/60 dark:border-gray-700/60 text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line font-medium">
                              {pos.description}
                            </div>
                          )}
                        </div>

                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 4: EDUCATION & CERTIFICATIONS */}
            {activeTab === 'education' && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-[#151c2c] rounded-3xl p-6 sm:p-8 border border-gray-200/80 dark:border-gray-800 shadow-sm transition-all">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-100 dark:border-gray-800/80">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500/15 via-orange-500/15 to-purple-500/15 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-inner shrink-0">
                        <GraduationCap size={22} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-black text-gray-900 dark:text-white">Education & Certifications</h3>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                            Credentials
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-medium">Degrees, academic credentials & professional accreditations</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        setEducationSaveError(null);
                        const currentEducations = (profileData.educations && profileData.educations.length > 0)
                          ? profileData.educations
                          : [
                              {
                                id: 'edu-1',
                                institution: profileData.education || 'Law & Technology Institute',
                                degree: 'Degree & Professional Accreditation in Intellectual Property Law',
                                fieldOfStudy: 'Intellectual Property Law',
                                year: 'Graduated',
                                description: ''
                              }
                            ];
                        setEducationList(JSON.parse(JSON.stringify(currentEducations)));
                        setIsEditEducationModalOpen(true);
                      }}
                      className="px-4 py-2 text-xs font-bold text-[#5a32fa] dark:text-[#ff90e8] bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/50 border border-purple-200/80 dark:border-purple-800/60 rounded-full flex items-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-sm cursor-pointer self-start sm:self-auto"
                      title="Add or Edit Credentials"
                    >
                      <Plus size={14} className="stroke-[3]" />
                      <span>Edit Credentials</span>
                    </button>
                  </div>

                  {/* Cards Container */}
                  <div className="space-y-6">
                    {((profileData.educations && profileData.educations.length > 0) ? profileData.educations : [
                      {
                        id: 'edu-1',
                        institution: profileData.education || 'Law & Technology Institute',
                        degree: 'Degree & Professional Accreditation in Intellectual Property Law',
                        year: 'Graduated'
                      }
                    ]).map((edu, eIdx) => {
                      return (
                        <div key={edu.id || eIdx} className="flex items-start gap-4 sm:gap-6 group">
                          {/* Institution Cap Node */}
                          <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-lg ring-4 ring-white dark:ring-[#151c2c] group-hover:scale-110 group-hover:shadow-amber-500/25 transition-all duration-300 shrink-0">
                            <GraduationCap size={24} />
                          </div>

                          {/* Details Box */}
                          <div className="flex-1 bg-gray-50/60 dark:bg-gray-800/40 hover:bg-gray-50 dark:hover:bg-gray-800/80 border border-gray-100 dark:border-gray-800 p-5 rounded-2xl transition-all duration-200 group-hover:border-amber-300 dark:group-hover:border-amber-700/60 group-hover:shadow-md">
                            <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                              <h4 className="text-base sm:text-lg font-black text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                                {edu.institution || 'Law & Technology Institute'}
                              </h4>
                              {edu.year && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 text-[11px] font-extrabold border border-amber-500/30 shadow-sm">
                                  <Calendar size={12} />
                                  {edu.year}
                                </span>
                              )}
                            </div>
                            
                            <p className="text-sm font-bold text-[#5a32fa] dark:text-[#ff90e8]">
                              {edu.degree || 'Degree in Intellectual Property Law'}
                              {edu.fieldOfStudy ? ` · ${edu.fieldOfStudy}` : ''}
                            </p>

                            {edu.grade && (
                              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-1">
                                Grade / Honors: <span className="text-gray-900 dark:text-white font-bold">{edu.grade}</span>
                              </p>
                            )}

                            {edu.description && (
                              <div className="mt-4 pt-3.5 border-t border-gray-200/60 dark:border-gray-700/60 text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line font-medium">
                                {edu.description}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {/* LexisNexis Verified Accreditation Card */}
                    <div className="flex items-start gap-4 sm:gap-6 p-5 rounded-2xl bg-gradient-to-r from-blue-50/80 via-indigo-50/40 to-purple-50/60 dark:from-blue-950/30 dark:via-indigo-950/20 dark:to-purple-950/20 border border-blue-200/80 dark:border-blue-500/30 shadow-sm">
                      <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-black text-sm shadow-md ring-4 ring-white dark:ring-[#151c2c] shrink-0">
                        LN
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                          <h4 className="text-base font-black text-gray-900 dark:text-white flex items-center gap-1.5">
                            LexisNexis® Certified IP Analytics Specialist
                          </h4>
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-700 dark:text-blue-300 text-[10px] font-black uppercase tracking-wider border border-blue-500/30 shadow-sm">
                            <ShieldCheck size={12} className="text-blue-500" />
                            Verified Badge
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 mb-1.5">
                          PatentSight+™ Portfolio Valuation & TotalPatent One® Search Mastery
                        </p>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">
                          Issued in partnership with WIPA • Institutional ID: <code className="px-1.5 py-0.5 rounded bg-blue-100/60 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 font-mono text-[10px]">LN-WIPA-2024-8842</code>
                        </p>
                      </div>
                    </div>

                  </div>
                </div>

                {/* WIPA MEMBER ADVANTAGE: LEXISNEXIS PERK CARD */}
                <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="space-y-1.5 text-center sm:text-left">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-extrabold uppercase tracking-wider">
                      <Sparkles size={12} /> WIPA Member Advantage
                    </div>
                    <h3 className="text-xl font-black">LexisNexis® IP Suite 30-Day Guided Access</h3>
                    <p className="text-xs text-white/90 max-w-xl leading-relaxed">
                      As an active WIPA member, claim your complimentary 30-day enterprise access to PatentAdvisor® and PatentSight+™ analytics.
                    </p>
                  </div>
                  <Link
                    href="/platform/intelligence"
                    className="px-6 py-3 rounded-2xl bg-white hover:bg-slate-100 text-blue-700 font-black text-xs transition-all shadow-lg shrink-0 cursor-pointer hover:scale-105 active:scale-95"
                  >
                    Launch Intelligence Hub →
                  </Link>
                </div>
              </div>
            )}

            {/* TAB 5: SKILLS & ENDORSEMENTS */}
            {activeTab === 'skills' && (
              <div className="bg-white dark:bg-[#151c2c] rounded-3xl p-6 sm:p-8 border border-gray-200/80 dark:border-gray-800 shadow-sm transition-all">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-100 dark:border-gray-800/80">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500/15 via-purple-500/15 to-indigo-500/15 border border-pink-500/20 text-[#5a32fa] dark:text-[#ff90e8] flex items-center justify-center shadow-inner shrink-0">
                      <Star size={22} className="fill-[#5a32fa]/20 dark:fill-[#ff90e8]/20" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-black text-gray-900 dark:text-white">Skills & Endorsements</h3>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-800">
                          {(profileData.skills || 'Patent Drafting, Trademark Portfolio, IP Litigation, Trade Secrets').split(',').filter(Boolean).length} Skills
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-medium">Peer-validated competencies in intellectual property and legal strategy</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => { setProfileSaveError(null); setEditForm(profileData); setIsEditModalOpen(true); }}
                    className="px-4 py-2 text-xs font-bold text-[#5a32fa] dark:text-[#ff90e8] bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/50 border border-purple-200/80 dark:border-purple-800/60 rounded-full flex items-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-sm cursor-pointer self-start sm:self-auto"
                  >
                    <Plus size={14} className="stroke-[3]" />
                    <span>Edit Skills</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(profileData.skills || 'Patent Drafting, Trademark Portfolio, IP Litigation, Trade Secrets')
                    .split(',')
                    .map(s => s.trim())
                    .filter(Boolean)
                    .map((skill, idx) => {
                    const state = endorsedSkills[skill] || { count: 0, endorsed: false };

                    const handleEndorse = () => {
                      setEndorsedSkills(prev => {
                        const current = prev[skill] || { count: 0, endorsed: false };
                        return {
                          ...prev,
                          [skill]: {
                            count: current.endorsed ? current.count - 1 : current.count + 1,
                            endorsed: !current.endorsed
                          }
                        };
                      });
                    };

                    return (
                      <div 
                        key={idx} 
                        className={`p-5 rounded-2xl border transition-all duration-200 flex items-center justify-between group hover:shadow-md ${
                          state.endorsed 
                            ? 'bg-gradient-to-r from-purple-500/10 via-pink-500/5 to-purple-500/10 dark:from-purple-950/30 dark:to-pink-950/20 border-purple-300 dark:border-purple-700/60 shadow-sm' 
                            : 'bg-gray-50/70 dark:bg-gray-800/40 hover:bg-gray-50 dark:hover:bg-gray-800/80 border-gray-100 dark:border-gray-800 hover:border-purple-200 dark:hover:border-purple-800/50'
                        }`}
                      >
                        <div className="flex-1 min-w-0 pr-3">
                          <div className="flex items-center gap-2 mb-1">
                            <div className={`w-2 h-2 rounded-full ${state.endorsed ? 'bg-emerald-500 animate-pulse' : 'bg-[#5a32fa] dark:bg-[#ff90e8]'}`} />
                            <h4 className="font-black text-sm sm:text-base text-gray-900 dark:text-white truncate group-hover:text-[#5a32fa] dark:group-hover:text-[#ff90e8] transition-colors">
                              {skill}
                            </h4>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5 font-medium pl-4">
                            <span>{state.count} endorsements</span>
                            {state.endorsed && <span className="text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">✓ Endorsed by you</span>}
                          </p>
                        </div>
                        <button 
                          onClick={handleEndorse}
                          className={`px-4 py-2 rounded-full text-xs font-bold transition-all active:scale-95 flex items-center gap-1.5 shrink-0 shadow-sm cursor-pointer ${
                            state.endorsed
                              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-emerald-500/25'
                              : 'bg-white dark:bg-gray-900 hover:bg-[#5a32fa] hover:text-white text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:border-[#5a32fa]'
                          }`}
                        >
                          {state.endorsed ? <Check size={14} className="stroke-[3]" /> : <Plus size={14} className="stroke-[3]" />}
                          <span>{state.endorsed ? 'Endorsed' : 'Endorse'}</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>

          {/* ================= RIGHT SIDEBAR (LINKEDIN ANALYTICS & WIDGETS) ================= */}
          <div className="space-y-6">

            {/* LinkedIn-style Analytics Box (Private to you) */}
            <div className="bg-white dark:bg-[#151c2c] rounded-2xl p-5 border border-gray-200 dark:border-gray-800 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                  <TrendingUp size={16} className="text-[#5a32fa]" /> Analytics
                </h3>
                <span className="text-[11px] text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full font-medium">Private to you</span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                  <p className="text-xl font-black text-gray-900 dark:text-white">
                    {analytics.profileViews.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 flex items-center gap-1">
                    <Eye size={12} /> Profile views
                  </p>
                  <span className={`text-[10px] font-bold ${
                    analytics.profileViewsDirection === 'up' 
                      ? 'text-emerald-600 dark:text-emerald-400' 
                      : analytics.profileViewsDirection === 'down'
                      ? 'text-rose-500'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {analytics.profileViewsGrowth}
                  </span>
                </div>

                <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                  <p className="text-xl font-black text-gray-900 dark:text-white">
                    {analytics.postImpressions.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 flex items-center gap-1">
                    <Sparkles size={12} /> Impressions
                  </p>
                  <span className={`text-[10px] font-bold ${
                    analytics.postImpressionsDirection === 'up' 
                      ? 'text-emerald-600 dark:text-emerald-400' 
                      : analytics.postImpressionsDirection === 'down'
                      ? 'text-rose-500'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {analytics.postImpressionsGrowth}
                  </span>
                </div>
              </div>
            </div>

            {/* Public Profile URL Card */}
            <div className="bg-white dark:bg-[#151c2c] rounded-2xl p-5 border border-gray-200 dark:border-gray-800 shadow-sm">
              <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-2">Public Profile & URL</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Your custom WIPA profile handle:</p>
              
              <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-2 rounded-xl text-xs font-mono font-semibold text-gray-700 dark:text-gray-300">
                <span className="truncate">wipa.org/u/{profileData.memberId?.toLowerCase() || 'janedoe'}</span>
                <button 
                  onClick={() => alert('Profile URL copied to clipboard!')}
                  className="p-1.5 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-colors text-[#5a32fa] dark:text-[#ff90e8]"
                  title="Copy Link"
                >
                  <Copy size={14} />
                </button>
              </div>
            </div>

            {/* Associated Firm / Business Hub */}
            {profileData.businessProfile && (
              <div className="bg-white dark:bg-[#151c2c] rounded-2xl p-5 border border-gray-200 dark:border-gray-800 shadow-sm">
                <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-3">Associated Firm</h3>
                <Link 
                  href={`/platform/business/${profileData.businessProfile.slug}`}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-100 dark:border-gray-800 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden shrink-0">
                    {profileData.businessProfile.logo_url ? (
                      <img src={profileData.businessProfile.logo_url} className="w-full h-full object-cover" />
                    ) : (
                      <Briefcase className="text-gray-400" size={18} />
                    )}
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white truncate">{profileData.businessProfile.name}</h4>
                    <p className="text-xs text-gray-500 capitalize">{profileData.businessProfile.type?.replace('_', ' ')}</p>
                  </div>
                </Link>
              </div>
            )}

            {/* Refer a Friend & Benefits */}
            <div className="bg-gradient-to-br from-[#5a32fa] to-[#ff90e8] rounded-2xl p-5 text-white shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white blur-[50px] opacity-20 rounded-full pointer-events-none" />
              <h3 className="font-bold text-base mb-1.5 flex items-center gap-2 relative z-10">
                <Gift size={18} /> Invite & Earn Benefit
              </h3>
              <p className="text-xs text-white/90 mb-4 leading-relaxed relative z-10">
                Invite fellow female IP practitioners to WIPA and both receive a 10% annual membership bonus.
              </p>
              
              <div className="flex items-center bg-white/20 backdrop-blur-md rounded-xl p-1 relative z-10">
                <span className="flex-1 px-3 text-xs font-mono font-bold truncate">
                  WIP-{profileData.memberId?.substring(0, 6) || '884920'}
                </span>
                <button 
                  onClick={() => alert('Referral code copied!')}
                  className="bg-white text-[#5a32fa] px-3 py-1 rounded-lg text-xs font-bold hover:bg-gray-100 transition-colors"
                >
                  Copy
                </button>
              </div>
            </div>

            {/* People Also Viewed (Networking Suggestions) */}
            <div className="bg-white dark:bg-[#151c2c] rounded-2xl p-5 border border-gray-200 dark:border-gray-800 shadow-sm">
              <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-4">People Also Viewed</h3>
              <div className="space-y-3.5">
                {[
                  { name: 'Dr. Shweta Singh', role: 'Founder & CEO, Ennoble IP', img: '/Dr Shweta_AIPPI (1).png' },
                  { name: 'Adriana Barrera', role: 'Partner, BARLAW Peru', img: '/10.jpg' },
                  { name: 'Nadine Stuttle', role: 'CEO, PSS Solutions Switzerland', img: '/Nadine Stuttle Picture.jpg' }
                ].map((person, i) => (
                  <div key={i} className="flex items-center gap-3 group cursor-pointer">
                    <div 
                      className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden shrink-0"
                      style={{ backgroundImage: `url("${person.img}")`, backgroundSize: 'cover', backgroundPosition: 'top' }}
                    />
                    <div className="overflow-hidden flex-1">
                      <h4 className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white truncate group-hover:text-[#5a32fa] transition-colors">{person.name}</h4>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">{person.role}</p>
                    </div>
                    <button className="p-1.5 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-[#5a32fa] hover:text-white hover:border-[#5a32fa] transition-colors text-gray-600 dark:text-gray-400">
                      <UserPlus size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* ================= FULL-SCREEN INTRODUCTION STORY VIDEO MODAL ================= */}
      {isVideoModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/90 backdrop-blur-md"
          onClick={() => { setStoryProgress(0); setIsVideoModalOpen(false); }}
        >
          <div 
            className="bg-black text-white w-full max-w-sm sm:max-w-md h-full sm:h-auto sm:max-h-[85vh] sm:rounded-3xl border-0 sm:border border-white/10 shadow-2xl overflow-hidden flex flex-col relative animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Story Header & Progress Line */}
            <div className="absolute top-0 left-0 right-0 z-30 p-4 pt-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-auto">
              {/* Progress Line */}
              <div className="w-full h-1 bg-white/30 rounded-full overflow-hidden mb-3">
                <div 
                  className="h-full bg-white transition-all duration-100 ease-linear rounded-full"
                  style={{ width: `${storyProgress}%` }}
                />
              </div>

              {/* Story User Info & Close */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div 
                    className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#5a32fa] to-[#ff90e8] text-white flex items-center justify-center font-bold text-xs ring-2 ring-white/50 overflow-hidden"
                    style={{ backgroundImage: profileData.avatarUrl ? `url(${profileData.avatarUrl})` : undefined, backgroundSize: 'cover' }}
                  >
                    {!profileData.avatarUrl && profileData.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-white flex items-center gap-1">
                      {profileData.name} <BadgeCheck size={14} className="text-[#00d26a]" />
                    </h4>
                    <p className="text-[10px] text-white/70">Story Video</p>
                  </div>
                </div>

                <button 
                  onClick={() => { setStoryProgress(0); setIsVideoModalOpen(false); }}
                  className="p-1.5 text-white/80 hover:text-white rounded-full bg-black/40 hover:bg-black/60 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Video Player Container */}
            <div className="w-full h-full sm:min-h-[500px] sm:max-h-[75vh] bg-black flex items-center justify-center relative overflow-hidden">
              {profileData.introVideoUrl ? (
                <video 
                  key={profileData.introVideoUrl}
                  autoPlay
                  playsInline
                  preload="auto"
                  onTimeUpdate={(e) => {
                    const v = e.currentTarget;
                    if (v.duration > 0) {
                      setStoryProgress((v.currentTime / v.duration) * 100);
                    }
                  }}
                  onEnded={() => {
                    setStoryProgress(100);
                    setIsVideoModalOpen(false);
                  }}
                  className="w-full h-full object-cover sm:object-contain"
                >
                  <source src={profileData.introVideoUrl} type="video/mp4" />
                  Your browser does not support HTML video.
                </video>
              ) : (
                <div className="text-center p-8 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mx-auto text-[#5a32fa]">
                    <Video size={32} />
                  </div>
                  <h3 className="text-lg font-bold">No Story Video Uploaded</h3>
                  <p className="text-xs text-gray-400 max-w-xs mx-auto">
                    Record a brief introduction to introduce yourself to the global WIPA community!
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ================= EDIT PROFILE MODAL ================= */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#151c2c] w-full max-w-xl rounded-2xl border border-gray-200 dark:border-gray-800 shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-5 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Edit Profile Details</h2>
              <button onClick={() => setIsEditModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-4 text-sm">
              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={editForm.name} 
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent focus:border-[#5a32fa] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Headline / Role</label>
                <input 
                  type="text" 
                  value={editForm.role} 
                  onChange={(e) => setEditForm({...editForm, role: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent focus:border-[#5a32fa] outline-none"
                />
              </div>

              {/* Story Video Introduction Field */}
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 space-y-2">
                <label className="block font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Video size={16} className="text-[#5a32fa]" /> Story / Intro Video URL
                </label>
                <input 
                  type="text" 
                  value={editForm.introVideoUrl || ''} 
                  placeholder="https://example.com/intro-video.mp4"
                  onChange={(e) => setEditForm({...editForm, introVideoUrl: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#151c2c] focus:border-[#5a32fa] outline-none font-mono text-xs"
                />
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-gray-500">Supported formats: MP4, WebM</span>
                  <button 
                    type="button"
                    onClick={() => videoInputRef.current?.click()}
                    className="text-[#5a32fa] dark:text-[#ff90e8] font-bold hover:underline"
                  >
                    Upload from device
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Company</label>
                  <input 
                    type="text" 
                    value={editForm.company} 
                    onChange={(e) => setEditForm({...editForm, company: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent focus:border-[#5a32fa] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Location</label>
                  <input 
                    type="text" 
                    value={editForm.location} 
                    onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent focus:border-[#5a32fa] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Skills (comma separated)</label>
                <input 
                  type="text" 
                  value={editForm.skills} 
                  onChange={(e) => setEditForm({...editForm, skills: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent focus:border-[#5a32fa] outline-none"
                />
              </div>
            </div>

            {profileSaveError && (
              <p className="mx-4 mb-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
                Could not save profile: {profileSaveError}
              </p>
            )}
            <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3">
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="px-5 py-2 text-sm font-bold bg-[#5a32fa] hover:bg-[#4a24db] text-white rounded-xl flex items-center gap-2"
              >
                {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= EDIT ABOUT & PRACTICE AREAS MODAL ================= */}
      {isEditAboutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#151c2c] w-full max-w-lg rounded-3xl p-6 sm:p-8 border border-gray-200 dark:border-gray-800 shadow-2xl space-y-5 text-gray-900 dark:text-white">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Edit About & Specializations</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Update your professional biography and practice areas</p>
              </div>
              <button 
                onClick={() => setIsEditAboutModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-gray-700 dark:text-gray-300">
                    About / Biography
                  </label>
                  {aiBioSuccess && (
                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 animate-in fade-in">
                      <Check size={12} /> Generated with AI! Review & edit below.
                    </span>
                  )}
                </div>

                <div className="relative rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 focus-within:border-[#5a32fa] focus-within:bg-white dark:focus-within:bg-[#151c2c] transition-all p-1">
                  <textarea 
                    rows={6}
                    value={aboutForm.bio} 
                    placeholder="Write a brief overview, rough notes, or bullet points (e.g. '10 yrs patent attorney in Delhi focusing on tech innovation & IP strategy')... Then click Write with AI!"
                    onChange={(e) => setAboutForm({ ...aboutForm, bio: e.target.value })}
                    className="w-full px-3 pt-2 pb-11 bg-transparent border-0 outline-none text-xs sm:text-sm leading-relaxed resize-y placeholder:text-gray-400"
                  />

                  {/* Bottom Action Bar inside Textarea Container */}
                  <div className="absolute bottom-2 right-2.5 left-2.5 flex items-center justify-between pointer-events-none">
                    <span className="text-[10px] text-gray-400 pointer-events-auto pl-1">
                      {aboutForm.bio ? `${aboutForm.bio.length} chars` : 'Write brief & click AI'}
                    </span>

                    <button
                      type="button"
                      onClick={handleGenerateBioWithAI}
                      disabled={isGeneratingBio}
                      className="pointer-events-auto px-3 py-1.5 rounded-full bg-gradient-to-r from-[#5a32fa] to-[#ff90e8] hover:opacity-95 text-white font-extrabold text-[11px] flex items-center gap-1.5 shadow-sm shadow-indigo-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                      title="Write or expand your brief into a full professional bio with AI"
                    >
                      {isGeneratingBio ? (
                        <>
                          <Loader2 size={13} className="animate-spin" />
                          <span>Writing with AI...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles size={13} />
                          <span>{aboutForm.bio?.trim() ? 'Write / Polish with AI' : 'Write with AI'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1.5">Practice Areas & Specializations (comma separated)</label>
                <input 
                  type="text" 
                  value={aboutForm.practiceAreas} 
                  placeholder="e.g. Patents, Trademarks, IP Strategy, Licensing"
                  onChange={(e) => setAboutForm({ ...aboutForm, practiceAreas: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 focus:border-[#5a32fa] focus:bg-white dark:focus:bg-[#151c2c] outline-none text-xs sm:text-sm font-medium"
                />
              </div>
            </div>

            {aboutSaveError && (
              <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
                Could not save: {aboutSaveError}
              </p>
            )}

            <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3">
              <button 
                onClick={() => setIsEditAboutModalOpen(false)}
                className="px-5 py-2.5 text-xs sm:text-sm font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveAbout}
                disabled={isSavingAbout}
                className="px-6 py-2.5 text-xs sm:text-sm font-bold bg-[#5a32fa] hover:bg-[#4a24db] text-white rounded-full flex items-center gap-2 shadow-sm transition-all cursor-pointer active:scale-95 disabled:opacity-50"
              >
                {isSavingAbout ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                <span>{isSavingAbout ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= EDIT EXPERIENCE & POSITIONS MODAL ================= */}
      {isEditExperienceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#151c2c] w-full max-w-2xl max-h-[90vh] rounded-3xl p-6 sm:p-8 border border-gray-200 dark:border-gray-800 shadow-2xl flex flex-col text-gray-900 dark:text-white">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Manage Experience & Positions</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Add, edit, or remove your career history and practice roles</p>
              </div>
              <button 
                onClick={() => setIsEditExperienceModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Scrollable Positions List */}
            <div className="flex-1 overflow-y-auto py-4 space-y-5 pr-1">
              {experienceList.map((pos, idx) => (
                <div 
                  key={pos.id || idx} 
                  className="p-5 rounded-2xl bg-gray-50/70 dark:bg-gray-800/40 border border-gray-200/80 dark:border-gray-700/80 space-y-4 relative group"
                >
                  {/* Position Header & Delete button */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#5a32fa] text-white text-xs font-black flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white">
                        {pos.title ? pos.title : `Position #${idx + 1}`}
                      </span>
                      {idx === 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-[#5a32fa] dark:text-[#ff90e8] text-[10px] font-bold">
                          Primary / Headline
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemovePosition(idx)}
                      className="text-gray-400 hover:text-rose-500 p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                      title="Remove this position"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {/* Form Inputs Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                    <div>
                      <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                        Job Title / Role <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="text" 
                        required
                        value={pos.title} 
                        placeholder="e.g. Senior Patent Attorney"
                        onChange={(e) => handleUpdatePosition(idx, 'title', e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#151c2c] focus:border-[#5a32fa] outline-none text-xs font-medium"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                        Company / Organization <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="text" 
                        required
                        value={pos.company} 
                        placeholder="e.g. International IP Practice"
                        onChange={(e) => handleUpdatePosition(idx, 'company', e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#151c2c] focus:border-[#5a32fa] outline-none text-xs font-medium"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                        Location / Country
                      </label>
                      <input 
                        type="text" 
                        value={pos.location || ''} 
                        placeholder="e.g. Delhi, India or London, UK"
                        onChange={(e) => handleUpdatePosition(idx, 'location', e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#151c2c] focus:border-[#5a32fa] outline-none text-xs font-medium"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                        Years in this role / Experience
                      </label>
                      <input 
                        type="number" 
                        min={0}
                        max={60}
                        value={pos.years ?? ''} 
                        placeholder="e.g. 5"
                        onChange={(e) => handleUpdatePosition(idx, 'years', e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#151c2c] focus:border-[#5a32fa] outline-none text-xs font-medium"
                      />
                    </div>
                  </div>

                  {/* Current Position Checkbox */}
                  <label className="flex items-center gap-2 cursor-pointer pt-1">
                    <input 
                      type="checkbox"
                      checked={!!pos.current}
                      onChange={(e) => handleUpdatePosition(idx, 'current', e.target.checked)}
                      className="w-4 h-4 rounded text-[#5a32fa] focus:ring-[#5a32fa]"
                    />
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      I am currently working in this role
                    </span>
                  </label>

                  {/* Description / Highlights */}
                  <div>
                    <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1 text-xs">
                      Key Highlights & Responsibilities (Optional)
                    </label>
                    <textarea 
                      rows={2}
                      value={pos.description || ''} 
                      placeholder="e.g. Leading cross-border patent prosecution and trademark enforcement across APAC region..."
                      onChange={(e) => handleUpdatePosition(idx, 'description', e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#151c2c] focus:border-[#5a32fa] outline-none text-xs leading-relaxed"
                    />
                  </div>
                </div>
              ))}

              {/* Add Position Button */}
              <button
                type="button"
                onClick={handleAddPosition}
                className="w-full py-3.5 rounded-2xl border-2 border-dashed border-[#5a32fa]/40 hover:border-[#5a32fa] bg-[#5a32fa]/5 hover:bg-[#5a32fa]/10 text-[#5a32fa] dark:text-[#ff90e8] font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Plus size={16} />
                <span>+ Add Another Position</span>
              </button>
            </div>

            {/* Error Message */}
            {experienceSaveError && (
              <p className="mb-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300 shrink-0">
                Could not save: {experienceSaveError}
              </p>
            )}

            {/* Modal Actions */}
            <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-3 shrink-0">
              <button 
                type="button"
                onClick={() => setIsEditExperienceModalOpen(false)}
                className="px-5 py-2.5 text-xs sm:text-sm font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={handleSaveExperience}
                disabled={isSavingExperience}
                className="px-6 py-2.5 text-xs sm:text-sm font-bold bg-[#5a32fa] hover:bg-[#4a24db] text-white rounded-full flex items-center gap-2 shadow-sm transition-all cursor-pointer active:scale-95 disabled:opacity-50"
              >
                {isSavingExperience ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                <span>{isSavingExperience ? 'Saving...' : 'Save Positions'}</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ================= EDIT EDUCATION & CREDENTIALS MODAL ================= */}
      {isEditEducationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#151c2c] w-full max-w-2xl max-h-[90vh] rounded-3xl p-6 sm:p-8 border border-gray-200 dark:border-gray-800 shadow-2xl flex flex-col text-gray-900 dark:text-white">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Manage Education & Credentials</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Add, edit, or update your degrees, academic honors, and accreditations</p>
              </div>
              <button 
                onClick={() => setIsEditEducationModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Scrollable Education List */}
            <div className="flex-1 overflow-y-auto py-4 space-y-5 pr-1">
              {educationList.map((edu, idx) => (
                <div 
                  key={edu.id || idx} 
                  className="p-5 rounded-2xl bg-gray-50/70 dark:bg-gray-800/40 border border-gray-200/80 dark:border-gray-700/80 space-y-4 relative group"
                >
                  {/* Item Header & Delete */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#5a32fa] text-white text-xs font-black flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white">
                        {edu.institution ? edu.institution : `Credential #${idx + 1}`}
                      </span>
                      {idx === 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-[#5a32fa] dark:text-[#ff90e8] text-[10px] font-bold">
                          Primary Degree
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveEducation(idx)}
                      className="text-gray-400 hover:text-rose-500 p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                      title="Remove this credential"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {/* Form Inputs Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                    <div>
                      <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                        Institution / University <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="text" 
                        required
                        value={edu.institution} 
                        placeholder="e.g. Law & Technology Institute"
                        onChange={(e) => handleUpdateEducation(idx, 'institution', e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#151c2c] focus:border-[#5a32fa] outline-none text-xs font-medium"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                        Degree / Qualification <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="text" 
                        required
                        value={edu.degree} 
                        placeholder="e.g. LL.M in Intellectual Property"
                        onChange={(e) => handleUpdateEducation(idx, 'degree', e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#151c2c] focus:border-[#5a32fa] outline-none text-xs font-medium"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                        Field of Study / Major
                      </label>
                      <input 
                        type="text" 
                        value={edu.fieldOfStudy || ''} 
                        placeholder="e.g. Patent Law & Licensing"
                        onChange={(e) => handleUpdateEducation(idx, 'fieldOfStudy', e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#151c2c] focus:border-[#5a32fa] outline-none text-xs font-medium"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                        Graduation Year / Dates
                      </label>
                      <input 
                        type="text" 
                        value={edu.year || ''} 
                        placeholder="e.g. 2018 - 2022 or Graduated 2020"
                        onChange={(e) => handleUpdateEducation(idx, 'year', e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#151c2c] focus:border-[#5a32fa] outline-none text-xs font-medium"
                      />
                    </div>
                  </div>

                  {/* Description / Honors */}
                  <div>
                    <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1 text-xs">
                      Honors, Activities & Societies (Optional)
                    </label>
                    <textarea 
                      rows={2}
                      value={edu.description || ''} 
                      placeholder="e.g. First Class Distinction, Editor of Law Review, IP Moot Court Winner..."
                      onChange={(e) => handleUpdateEducation(idx, 'description', e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#151c2c] focus:border-[#5a32fa] outline-none text-xs leading-relaxed"
                    />
                  </div>
                </div>
              ))}

              {/* Add Education Button */}
              <button
                type="button"
                onClick={handleAddEducation}
                className="w-full py-3.5 rounded-2xl border-2 border-dashed border-[#5a32fa]/40 hover:border-[#5a32fa] bg-[#5a32fa]/5 hover:bg-[#5a32fa]/10 text-[#5a32fa] dark:text-[#ff90e8] font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Plus size={16} />
                <span>+ Add Another Credential</span>
              </button>
            </div>

            {/* Error Message */}
            {educationSaveError && (
              <p className="mb-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300 shrink-0">
                Could not save: {educationSaveError}
              </p>
            )}

            {/* Modal Actions */}
            <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-3 shrink-0">
              <button 
                type="button"
                onClick={() => setIsEditEducationModalOpen(false)}
                className="px-5 py-2.5 text-xs sm:text-sm font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={handleSaveEducation}
                disabled={isSavingEducation}
                className="px-6 py-2.5 text-xs sm:text-sm font-bold bg-[#5a32fa] hover:bg-[#4a24db] text-white rounded-full flex items-center gap-2 shadow-sm transition-all cursor-pointer active:scale-95 disabled:opacity-50"
              >
                {isSavingEducation ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                <span>{isSavingEducation ? 'Saving...' : 'Save Credentials'}</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ================= SHARE PROFILE / QR MODAL ================= */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#151c2c] w-full max-w-sm rounded-3xl p-6 border border-gray-200 dark:border-gray-800 shadow-2xl text-center">
            <div className="flex justify-end">
              <button onClick={() => setIsShareModalOpen(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#5a32fa] to-[#ff90e8] text-white flex items-center justify-center text-2xl font-bold mx-auto mb-3">
              {profileData.name.charAt(0)}
            </div>

            <h3 className="text-lg font-extrabold text-gray-900 dark:text-white">{profileData.name}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">{profileData.role}</p>

            <div className="p-4 bg-white rounded-2xl shadow-inner inline-block border mb-6">
              <QRCodeCanvas value={`https://wipa.org/u/${profileData.memberId || 'janedoe'}`} size={160} />
            </div>

            <button 
              onClick={() => {
                navigator.clipboard.writeText(`https://wipa.org/u/${profileData.memberId || 'janedoe'}`);
                alert('Profile link copied!');
              }}
              className="w-full py-3 bg-[#5a32fa] hover:bg-[#4a24db] text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <Copy size={16} /> Copy Profile Link
            </button>
          </div>
        </div>
      )}

      {/* ================= SETTINGS & PASSWORD MODAL ================= */}
      {isSettingsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#151c2c] w-full max-w-md rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Settings size={18} /> Account Settings
              </h3>
              <button onClick={() => setIsSettingsModalOpen(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div>
                <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">New Password</label>
                <input 
                  type="password"
                  placeholder="Enter new password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent focus:border-[#5a32fa] outline-none"
                />
              </div>

              {passwordStatus.message && (
                <p className={`text-xs ${passwordStatus.type === 'error' ? 'text-red-500' : 'text-emerald-500'}`}>
                  {passwordStatus.message}
                </p>
              )}

              <button 
                onClick={async () => {
                  if (!passwordForm.newPassword) return;
                  setPasswordStatus({ type: 'loading', message: 'Updating password...' });
                  const { error } = await supabase.auth.updateUser({ password: passwordForm.newPassword });
                  if (error) {
                    setPasswordStatus({ type: 'error', message: error.message });
                  } else {
                    setPasswordStatus({ type: 'success', message: 'Password updated successfully!' });
                    setTimeout(() => setIsSettingsModalOpen(false), 1500);
                  }
                }}
                className="w-full py-2.5 bg-[#5a32fa] hover:bg-[#4a24db] text-white font-bold rounded-xl transition-all"
              >
                Update Password
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Image Lightbox Preview Modal */}
      {previewModalImage && (
        <div 
          className="hidden md:flex fixed inset-0 z-[120] bg-black/90 backdrop-blur-md items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
          onClick={() => setPreviewModalImage(null)}
        >
          <button 
            onClick={() => setPreviewModalImage(null)}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-all active:scale-95 shadow-lg border border-white/20 z-20 cursor-pointer"
            title="Close preview (Esc)"
          >
            <X size={22} />
          </button>
          <div 
            className="relative max-w-5xl max-h-[90vh] flex items-center justify-center overflow-hidden rounded-2xl shadow-2xl border border-white/10 bg-black/40"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={previewModalImage} 
              alt="Enlarged Post View" 
              className="w-auto h-auto max-w-full max-h-[88vh] object-contain rounded-2xl" 
            />
          </div>
        </div>
      )}

      {/* Profile Cover Image Cropper Modal */}
      <ImageCropperModal
        isOpen={isCoverCropperOpen}
        imageSrc={coverCropSrc || ''}
        title="Position & Crop Cover Banner"
        recommendedPx="1440 × 450 px (3.2:1 Ratio)"
        aspectRatio={3.2}
        shape="banner"
        showAvatarGuide={true}
        onClose={() => {
          setIsCoverCropperOpen(false);
          setCoverCropSrc(null);
        }}
        onCropComplete={handleCoverCropComplete}
      />

      {/* Profile Avatar Image Cropper Modal */}
      <ImageCropperModal
        isOpen={isAvatarCropperOpen}
        imageSrc={avatarCropSrc || ''}
        title="Crop Profile Avatar"
        recommendedPx="600 × 600 px (1:1 Ratio)"
        aspectRatio={1}
        shape="rounded"
        onClose={() => {
          setIsAvatarCropperOpen(false);
          setAvatarCropSrc(null);
        }}
        onCropComplete={handleAvatarCropComplete}
      />

    </div>
  );
}
