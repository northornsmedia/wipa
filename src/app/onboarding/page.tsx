'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/store/useAppStore';
import { ArrowRight, Upload, Camera, Building2, GraduationCap, Briefcase, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';

const MEMBERSHIP_TIERS = [
  {
    id: 'ip_professional',
    title: 'IP Professionals',
    description: 'For IP lawyers, attorneys, trademark practitioners, patent professionals, in-house counsel, academics, and consultants.',
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
  }, [user, setUser]);

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
    
    const { error: uploadError, data } = await supabase.storage
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
          mobile_number: formData.mobileNumber,
          country: formData.location,
          practice_area: formData.practiceAreas,
          linkedin_url: formData.linkedinUrl,
          website_url: formData.websiteUrl,
          bio: formData.bio,
          membership_tier: selectedTier,
          verification_status: verificationStatus,
          verification_document_url: finalDocUrl,
          onboarding_completed: true
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

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
    return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Complete Your Profile</h1>
          <p className="mt-3 text-lg text-gray-500">
            Let's get you set up in the WIPA community.
          </p>
          
          {/* Progress Bar */}
          <div className="mt-8 flex items-center justify-center space-x-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                  step >= s ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-400'
                }`}>
                  {s}
                </div>
                {s < 3 && (
                  <div className={`w-16 h-1 mx-2 ${step > s ? 'bg-purple-600' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 font-medium">
            {error}
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          
          {/* STEP 1: Basic Details */}
          {step === 1 && (
            <form onSubmit={handleStep1Submit} className="p-8">
              <div className="space-y-8">
                
                {/* Avatar Upload */}
                <div className="flex flex-col items-center">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg mb-4">
                    {avatarPreview ? (
                      <Image src={avatarPreview} alt="Preview" fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Camera size={40} />
                      </div>
                    )}
                    <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                      <Upload className="text-white" size={24} />
                      <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                    </label>
                  </div>
                  <p className="text-sm font-medium text-gray-500">Upload Profile Photo (Required)</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                    <input 
                      type="text" 
                      value={user.email || ''} 
                      disabled 
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-500 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Full Name <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Mobile Number <span className="text-red-500">*</span></label>
                    <input 
                      type="tel" 
                      required
                      value={formData.mobileNumber}
                      onChange={(e) => setFormData({...formData, mobileNumber: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Location <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. London, UK"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Practice Areas (comma separated) <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Patent Prosecution, Trademark Law, IP Litigation"
                      value={formData.practiceAreas}
                      onChange={(e) => setFormData({...formData, practiceAreas: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                    />
                  </div>
                </div>

                <hr className="border-gray-100" />
                <h3 className="font-bold text-gray-900">Optional Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">LinkedIn URL</label>
                    <input 
                      type="url" 
                      placeholder="https://linkedin.com/in/username"
                      value={formData.linkedinUrl}
                      onChange={(e) => setFormData({...formData, linkedinUrl: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Website URL</label>
                    <input 
                      type="url" 
                      placeholder="https://yourwebsite.com"
                      value={formData.websiteUrl}
                      onChange={(e) => setFormData({...formData, websiteUrl: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Bio / Headline</label>
                    <textarea 
                      rows={3}
                      value={formData.bio}
                      onChange={(e) => setFormData({...formData, bio: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                    />
                  </div>
                </div>

              </div>
              <div className="mt-8 flex justify-end">
                <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-bold transition-all flex items-center">
                  Continue <ArrowRight className="ml-2" size={20} />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Membership Tier */}
          {step === 2 && (
            <div className="p-8">
              <h2 className="text-2xl font-black text-gray-900 mb-6">Select Your Membership</h2>
              <div className="space-y-4">
                {MEMBERSHIP_TIERS.map((tier) => (
                  <div 
                    key={tier.id}
                    onClick={() => setSelectedTier(tier.id)}
                    className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                      selectedTier === tier.id 
                        ? 'border-purple-600 bg-purple-50/50' 
                        : 'border-gray-100 hover:border-purple-200 bg-white'
                    }`}
                  >
                    {selectedTier === tier.id && (
                      <div className="absolute top-6 right-6 text-purple-600">
                        <CheckCircle2 size={24} className="fill-current text-white border-purple-600" />
                      </div>
                    )}
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl ${selectedTier === tier.id ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'}`}>
                        <tier.icon size={24} />
                      </div>
                      <div className="flex-1 pr-12">
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{tier.title}</h3>
                        <p className="text-gray-500 mb-2">{tier.description}</p>
                        {tier.note && (
                          <p className="text-sm font-medium text-amber-600 mb-4">{tier.note}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-black text-gray-900">{tier.price}</div>
                        <div className="text-sm text-gray-500 font-medium">{tier.interval}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 flex justify-between">
                <button onClick={() => setStep(1)} className="text-gray-500 hover:text-gray-900 font-bold px-4 py-2">
                  Back
                </button>
                <button onClick={handleStep2Submit} className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-bold transition-all flex items-center">
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
                  <h2 className="text-2xl font-black text-gray-900 mb-2">Verification Required</h2>
                  <p className="text-gray-500 mb-8">Please provide documentation to verify your eligibility for this tier.</p>
                  
                  <div className="border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center hover:bg-gray-50 transition-colors">
                    <Upload className="mx-auto text-gray-400 mb-4" size={48} />
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {MEMBERSHIP_TIERS.find(t => t.id === selectedTier)?.docLabel}
                    </h3>
                    <p className="text-gray-500 text-sm mb-6">PDF, JPG, or PNG up to 10MB</p>
                    
                    <label className="bg-white border border-gray-200 text-gray-700 font-bold py-3 px-6 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors inline-block">
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
                    {docFile && <p className="mt-4 font-medium text-purple-600">{docFile.name}</p>}
                  </div>
                </div>
              ) : (
                // Mock Payment View
                <div>
                  <h2 className="text-2xl font-black text-gray-900 mb-2">Complete Payment</h2>
                  <p className="text-gray-500 mb-8">You are purchasing the <strong>IP Professionals</strong> membership for £395/year.</p>
                  
                  <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 mb-8">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-gray-600 font-medium">Subtotal</span>
                      <span className="font-bold">£395.00</span>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-gray-600 font-medium">VAT (0%)</span>
                      <span className="font-bold">£0.00</span>
                    </div>
                    <hr className="border-gray-200 my-4" />
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900">Total Due</span>
                      <span className="text-2xl font-black text-purple-600">£395.00</span>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-blue-50 text-blue-700 rounded-xl font-medium border border-blue-100 flex items-start gap-3">
                    <div className="mt-0.5">ℹ️</div>
                    <p>This is a simulated checkout. Clicking submit will automatically verify your account and process the "payment".</p>
                  </div>
                </div>
              )}

              <div className="mt-12 flex justify-between items-center">
                <button onClick={() => setStep(2)} className="text-gray-500 hover:text-gray-900 font-bold px-4 py-2">
                  Back
                </button>
                <button 
                  onClick={handleFinalSubmit} 
                  disabled={isSubmitting}
                  className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-8 py-3 rounded-xl font-bold transition-all flex items-center shadow-lg shadow-purple-200"
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
