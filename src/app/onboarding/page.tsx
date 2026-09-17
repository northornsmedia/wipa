'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/store/useAppStore';
import { ArrowRight, Upload, Camera, Building2, GraduationCap, Briefcase, CheckCircle2, Scale } from 'lucide-react';
import Image from 'next/image';

const MEMBERSHIP_TIERS = [
  {
    id: 'in_house_counsel',
    title: 'In-House Counsel & Corporate IP',
    description: 'For corporate in-house counsel, general counsel, and enterprise IP directors leading corporate legal functions.',
    price: '£495',
    interval: 'per year',
    icon: Scale,
    requiresDoc: false,
  },
  {
    id: 'ip_professional',
    title: 'IP Professionals',
    description: 'For IP lawyers, attorneys, trademark practitioners, patent professionals, academics, and private practice consultants.',
    price: '£395',
    interval: 'per year',
    icon: Briefcase,
    requiresDoc: false,
  },
  {
    id: 'startup',
    title: 'Start-Up Law Firms & Emerging IP Businesses',
    description: 'For founders, innovators, entrepreneurs, business owners, and technology leaders looking to scale global visibility.',
    note: 'Open to businesses founded within the past 12 months.',
    price: '£295',
    interval: 'per year',
    icon: Building2,
    requiresDoc: true,
    docLabel: 'Upload Registration Certificate',
  },
  {
    id: 'student',
    title: 'Students & Alumni',
    description: 'For students and recent graduates pursuing careers in intellectual property, innovation, law, or related disciplines.',
    price: '£99',
    interval: 'per year',
    icon: GraduationCap,
    requiresDoc: true,
    docLabel: 'Upload Student ID / Documentation',
  }
];

export default function OnboardingPage() {
  const router = useRouter();
  const { user, setUser } = useAppStore();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (user) {
        setIsLoadingAuth(false);
        return;
      }
      
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        const { data: profile } = await supabase.from('profiles').select('onboarding_completed').eq('id', authUser.id).single();
        if (profile?.onboarding_completed) {
          router.push('/platform');
          return;
        }

        setUser({
          id: authUser.id,
          email: authUser.email || '',
          name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || ''
        });
      } else {
        router.push('/');
      }
      setIsLoadingAuth(false);
    };
    
    checkAuth();
  }, [user, setUser, router]);

  // Step 1 State
  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    location: '',
    practiceAreas: '',
    linkedinUrl: '',
    websiteUrl: '',
    bio: '',
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Step 2 State
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  // Step 3 State
  const [docFile, setDocFile] = useState<File | null>(null);

  useEffect(() => {
    if (user?.name) {
      setFormData(prev => ({ ...prev, fullName: user.name }));
    }
  }, [user]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const uploadFile = async (file: File, bucket: string): Promise<string | null> => {
    if (!user || !user.id) return null;
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Math.random()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return publicUrlData.publicUrl;
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!formData.fullName || !formData.mobileNumber || !formData.location || !formData.practiceAreas) {
      setError('Please fill out all required fields.');
      return;
    }
    
    setStep(2);
  };

  const handleStep2Submit = () => {
    if (!selectedTier) {
      setError('Please select a membership tier.');
      return;
    }
    setStep(3);
  };

  const handleFinalSubmit = async () => {
    if (!user) return;
    setError('');
    setIsSubmitting(true);

    try {
      const tierConfig = MEMBERSHIP_TIERS.find(t => t.id === selectedTier);
      let finalAvatarUrl = avatarPreview;
      let finalDocUrl = null;
      let verificationStatus = 'pending';

      // 1. Upload Avatar if new file
      if (avatarFile) {
        finalAvatarUrl = await uploadFile(avatarFile, 'avatars');
      }

      // 2. Upload Doc if required
      if (tierConfig?.requiresDoc) {
        if (!docFile) {
          throw new Error('Please upload the required documentation.');
        }
        finalDocUrl = await uploadFile(docFile, 'verifications');
      } else {
        // IP Professionals auto-verified in this mock flow after "payment"
        verificationStatus = 'verified';
      }

      // 3. Update Profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          full_name: formData.fullName,
          avatar_url: finalAvatarUrl,
          country: formData.location,
          practice_area: formData.practiceAreas,
          linkedin_url: formData.linkedinUrl,
          website_url: formData.websiteUrl,
          bio: formData.bio,
          membership_tier: selectedTier,
          verification_status: verificationStatus,
          onboarding_completed: true
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      // Save PII to private_profiles
      if (formData.mobileNumber || finalDocUrl) {
        const { error: privateError } = await supabase
          .from('private_profiles')
          .upsert({
            user_id: user.id,
            mobile_number: formData.mobileNumber || null,
            verification_document_url: finalDocUrl || null
          });
        
        if (privateError) throw privateError;
      }

      // 4. Redirect
      router.push('/platform');
      
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong during onboarding.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user || isLoadingAuth) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#060608] text-slate-700 dark:text-slate-200">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#060608] text-slate-900 dark:text-white py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Complete Your Profile</h1>
          <p className="mt-3 text-lg text-slate-600 dark:text-slate-400">
            Let's get you set up in the WIPA community.
          </p>
          
          {/* Progress Bar */}
          <div className="mt-8 flex items-center justify-center space-x-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  step >= s ? 'bg-purple-600 text-white' : 'bg-slate-200 dark:bg-white/10 text-slate-500 dark:text-gray-400'
                }`}>
                  {s}
                </div>
                {s < 3 && (
                  <div className={`w-16 h-1 mx-2 ${step > s ? 'bg-purple-600' : 'bg-slate-200 dark:bg-white/10'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl border border-red-500/20 font-medium">
            {error}
          </div>
        )}

        <div className="bg-white dark:bg-[#0c101d] rounded-3xl shadow-sm border border-slate-200 dark:border-white/10 overflow-hidden">
          
          {/* STEP 1: Basic Details */}
          {step === 1 && (
            <form onSubmit={handleStep1Submit} className="p-8">
              <div className="space-y-8">
                
                {/* Avatar Upload */}
                <div className="flex flex-col items-center">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden bg-slate-100 dark:bg-white/5 border-4 border-white dark:border-white/10 shadow-lg mb-4">
                    {avatarPreview ? (
                      <Image src={avatarPreview} alt="Preview" fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-gray-400">
                        <Camera size={40} />
                      </div>
                    )}
                    <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                      <Upload className="text-white" size={24} />
                      <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                    </label>
                  </div>
                  <p className="text-sm font-medium text-slate-600 dark:text-gray-400">Upload Profile Photo (Required)</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                    <input 
                      type="text" 
                      value={user.email || ''} 
                      disabled 
                      className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-gray-400 cursor-not-allowed text-sm font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Full Name <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-[#18181d] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-900/30 outline-none transition-all text-sm font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Mobile Number <span className="text-red-500">*</span></label>
                    <input 
                      type="tel" 
                      required
                      value={formData.mobileNumber}
                      onChange={(e) => setFormData({...formData, mobileNumber: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-[#18181d] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-900/30 outline-none transition-all text-sm font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Location <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. London, UK"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-[#18181d] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-900/30 outline-none transition-all text-sm font-medium"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Practice Areas (comma separated) <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Patent Prosecution, Trademark Law, IP Litigation"
                      value={formData.practiceAreas}
                      onChange={(e) => setFormData({...formData, practiceAreas: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-[#18181d] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-900/30 outline-none transition-all text-sm font-medium"
                    />
                  </div>
                </div>

                <hr className="border-slate-100 dark:border-white/10" />
                <h3 className="font-bold text-slate-900 dark:text-white">Optional Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">LinkedIn URL</label>
                    <input 
                      type="url" 
                      placeholder="https://linkedin.com/in/username"
                      value={formData.linkedinUrl}
                      onChange={(e) => setFormData({...formData, linkedinUrl: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-[#18181d] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-900/30 outline-none transition-all text-sm font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Website URL</label>
                    <input 
                      type="url" 
                      placeholder="https://yourwebsite.com"
                      value={formData.websiteUrl}
                      onChange={(e) => setFormData({...formData, websiteUrl: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-[#18181d] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-900/30 outline-none transition-all text-sm font-medium"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Bio / Headline</label>
                    <textarea 
                      rows={3}
                      value={formData.bio}
                      onChange={(e) => setFormData({...formData, bio: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-[#18181d] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-900/30 outline-none transition-all text-sm font-medium"
                    />
                  </div>
                </div>

              </div>
              <div className="mt-8 flex justify-end">
                <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-bold transition-all flex items-center cursor-pointer shadow-md shadow-purple-500/20">
                  Continue <ArrowRight className="ml-2" size={20} />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Membership Tier */}
          {step === 2 && (
            <div className="p-8">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6">Select Your Membership</h2>
              <div className="space-y-4">
                {MEMBERSHIP_TIERS.map((tier) => (
                  <div 
                    key={tier.id}
                    onClick={() => setSelectedTier(tier.id)}
                    className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                      selectedTier === tier.id 
                        ? 'border-purple-600 bg-purple-50/50 dark:bg-purple-950/20' 
                        : 'border-slate-200 dark:border-white/10 hover:border-purple-300 dark:hover:border-purple-500/50 bg-white dark:bg-white/5'
                    }`}
                  >
                    {selectedTier === tier.id && (
                      <div className="absolute top-6 right-6 text-purple-600 dark:text-purple-400">
                        <CheckCircle2 size={24} className="fill-current text-white dark:text-slate-900 border-purple-600" />
                      </div>
                    )}
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl ${selectedTier === tier.id ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400' : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300'}`}>
                        <tier.icon size={24} />
                      </div>
                      <div className="flex-1 pr-12">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{tier.title}</h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm mb-2">{tier.description}</p>
                        {tier.note && (
                          <p className="text-sm font-medium text-amber-600 dark:text-amber-400 mb-4">{tier.note}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-black text-slate-900 dark:text-white">{tier.price}</div>
                        <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">{tier.interval}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 flex justify-between">
                <button onClick={() => setStep(1)} className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-bold px-4 py-2 cursor-pointer">
                  Back
                </button>
                <button onClick={handleStep2Submit} className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-bold transition-all flex items-center cursor-pointer shadow-md shadow-purple-500/20">
                  Continue <ArrowRight className="ml-2" size={20} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Verification & Payment */}
          {step === 3 && (
            <div className="p-8">
              {MEMBERSHIP_TIERS.find(t => t.id === selectedTier)?.requiresDoc ? (
                // Document Upload View
                <div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Verification Required</h2>
                  <p className="text-slate-600 dark:text-slate-400 mb-8">Please provide documentation to verify your eligibility for this tier.</p>
                  
                  <div className="border-2 border-dashed border-slate-200 dark:border-white/15 rounded-2xl p-12 text-center hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                    <Upload className="mx-auto text-slate-400 dark:text-gray-400 mb-4" size={48} />
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                      {MEMBERSHIP_TIERS.find(t => t.id === selectedTier)?.docLabel}
                    </h3>
                    <p className="text-slate-500 dark:text-gray-400 text-sm mb-6">PDF, JPG, or PNG up to 10MB</p>
                    
                    <label className="bg-white dark:bg-[#18181d] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 font-bold py-3 px-6 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-white/10 transition-colors inline-block shadow-xs">
                      Browse Files
                      <input 
                        type="file" 
                        className="hidden" 
                        accept=".pdf,image/*"
                        onChange={(e) => {
                          if(e.target.files && e.target.files[0]) setDocFile(e.target.files[0]);
                        }} 
                      />
                    </label>
                    {docFile && <p className="mt-4 font-medium text-purple-600 dark:text-purple-400">{docFile.name}</p>}
                  </div>
                </div>
              ) : (
                // Mock Payment View
                <div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Complete Payment</h2>
                  <p className="text-slate-600 dark:text-slate-400 mb-8">You are purchasing the <strong>IP Professionals</strong> membership for £395/year.</p>
                  
                  <div className="bg-slate-50 dark:bg-white/5 rounded-2xl p-6 border border-slate-200 dark:border-white/10 mb-8">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-slate-600 dark:text-slate-400 font-medium">Subtotal</span>
                      <span className="font-bold text-slate-900 dark:text-white">£395.00</span>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-slate-600 dark:text-slate-400 font-medium">VAT (0%)</span>
                      <span className="font-bold text-slate-900 dark:text-white">£0.00</span>
                    </div>
                    <hr className="border-slate-200 dark:border-white/10 my-4" />
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-slate-900 dark:text-white">Total Due</span>
                      <span className="text-2xl font-black text-purple-600 dark:text-purple-400">£395.00</span>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-blue-500/10 text-blue-700 dark:text-blue-300 rounded-xl font-medium border border-blue-500/20 flex items-start gap-3">
                    <div className="mt-0.5">ℹ️</div>
                    <p>This is a simulated checkout. Clicking submit will automatically verify your account and process the &ldquo;payment&rdquo;.</p>
                  </div>
                </div>
              )}

              <div className="mt-12 flex justify-between items-center">
                <button onClick={() => setStep(2)} className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-bold px-4 py-2 cursor-pointer">
                  Back
                </button>
                <button 
                  onClick={handleFinalSubmit} 
                  disabled={isSubmitting}
                  className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-8 py-3 rounded-xl font-bold transition-all flex items-center shadow-lg shadow-purple-500/20 cursor-pointer"
                >
                  {isSubmitting ? 'Processing...' : (
                    MEMBERSHIP_TIERS.find(t => t.id === selectedTier)?.requiresDoc ? 'Submit for Review' : 'Pay & Complete'
                  )}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
