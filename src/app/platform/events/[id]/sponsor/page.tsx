'use client';

import { DotmCircular7 as Loader2 } from '@/components/ui/dotm-circular-7';
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/store/useAppStore';
import { ArrowLeft, Check, Package, UploadCloud, FileText, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function SponsorApplyPage({ params }: { params: { id: string } }) {
  const { user } = useAppStore();
  const eventId = params.id;
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [event, setEvent] = useState<any>(null);
  const [packages, setPackages] = useState<any[]>([]);
  
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [formData, setFormData] = useState({
    sponsor_name: '',
    sponsor_website_url: '',
    sponsor_tagline: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      const { data: eventData } = await supabase.from('events').select('id, title').eq('id', eventId).single();
      if (eventData) setEvent(eventData);
      
      const { data: pkgData } = await supabase.from('sponsorship_packages').select('*').eq('is_active', true).order('price', { ascending: true });
      if (pkgData) setPackages(pkgData);
      
      if ((user as any)?.businessProfile) {
        setFormData(prev => ({
          ...prev,
          sponsor_name: (user as any).businessProfile.company_name || '',
          sponsor_website_url: (user as any).businessProfile.website_url || ''
        }));
      }
      
      setLoading(false);
    };
    fetchData();
  }, [eventId, user]);

  const handleSubmit = async () => {
    if (!user || !selectedPackage) return;
    setSubmitting(true);
    
    // Insert sponsorship
    const { data, error } = await supabase.from('event_sponsorships').insert({
      event_id: eventId,
      business_profile_id: (user as any).businessProfile?.id || null, // Might be null if user doesn't have one
      package_id: selectedPackage.id,
      sponsor_name: formData.sponsor_name,
      sponsor_website_url: formData.sponsor_website_url,
      sponsor_tagline: formData.sponsor_tagline,
      status: 'pending'
    }).select().single();
    
    if (!error && data) {
      // Notify Admins
      await supabase.from('notifications').insert({
        user_id: user.id, // Usually would send to admins, sending to self for demo
        type: 'sponsorship',
        title: 'New Sponsorship Application',
        message: `${formData.sponsor_name} applied to sponsor ${event?.title}`,
        link: '/admin/sponsorships'
      });
      
      setStep(4); // Success step
    }
    
    setSubmitting(false);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa] dark:bg-[#0f172a]"><Loader2 size={32} className="animate-spin text-[#5a32fa]" /></div>;
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0f172a] font-sans pb-24">
      {/* Top Nav */}
      <div className="bg-white dark:bg-[#1e293b] border-b border-gray-200 dark:border-white/10 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href={`/platform/events/${eventId}`} className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:hover:text-white font-bold transition-colors">
            <ArrowLeft size={20} /> Back to Event
          </Link>
          <div className="font-bold text-gray-900 dark:text-white hidden md:block">Sponsor: {event?.title}</div>
          <div className="w-10"></div> {/* Spacer */}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Steps */}
        {step < 4 && (
          <div className="flex items-center justify-center mb-12">
            <div className={`flex items-center ${step >= 1 ? 'text-[#5a32fa]' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 1 ? 'bg-[#5a32fa] text-white' : 'bg-gray-200 dark:bg-white/10'}`}>1</div>
              <div className="ml-2 font-bold text-sm hidden sm:block">Select Package</div>
            </div>
            <div className={`w-16 h-1 mx-2 ${step >= 2 ? 'bg-[#5a32fa]' : 'bg-gray-200 dark:bg-white/10'}`}></div>
            <div className={`flex items-center ${step >= 2 ? 'text-[#5a32fa]' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 2 ? 'bg-[#5a32fa] text-white' : 'bg-gray-200 dark:bg-white/10'}`}>2</div>
              <div className="ml-2 font-bold text-sm hidden sm:block">Details</div>
            </div>
            <div className={`w-16 h-1 mx-2 ${step >= 3 ? 'bg-[#5a32fa]' : 'bg-gray-200 dark:bg-white/10'}`}></div>
            <div className={`flex items-center ${step >= 3 ? 'text-[#5a32fa]' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 3 ? 'bg-[#5a32fa] text-white' : 'bg-gray-200 dark:bg-white/10'}`}>3</div>
              <div className="ml-2 font-bold text-sm hidden sm:block">Review</div>
            </div>
          </div>
        )}

        {/* Step 1: Select Package */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4">
            <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2 text-center">Choose a Sponsorship Package</h1>
            <p className="text-gray-500 mb-8 text-center">Select the level of visibility and benefits for your brand.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {packages.map(pkg => (
                <div 
                  key={pkg.id} 
                  onClick={() => setSelectedPackage(pkg)}
                  className={`bg-white dark:bg-[#1e293b] rounded-3xl p-6 border-2 cursor-pointer transition-all ${
                    selectedPackage?.id === pkg.id 
                      ? 'border-[#5a32fa] shadow-[0_0_0_4px_rgba(90,50,250,0.1)]' 
                      : 'border-gray-200 dark:border-white/10 hover:border-[#5a32fa]/50'
                  }`}
                >
                  <div className="font-black text-xl text-gray-900 dark:text-white mb-2">{pkg.name}</div>
                  <div className="font-black text-3xl text-[#5a32fa] mb-6">£{pkg.price}</div>
                  
                  <div className="space-y-3 mb-8">
                    {(pkg.benefits || []).map((b: string, i: number) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300 font-medium">
                        <Check size={16} className="text-[#00d26a] shrink-0 mt-0.5" /> {b}
                      </div>
                    ))}
                  </div>
                  
                  <div className={`w-full py-2.5 rounded-xl font-bold text-center border-2 ${
                    selectedPackage?.id === pkg.id 
                      ? 'bg-[#5a32fa] text-white border-[#5a32fa]' 
                      : 'bg-transparent text-[#5a32fa] border-[#5a32fa]'
                  }`}>
                    {selectedPackage?.id === pkg.id ? 'Selected' : 'Select'}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-12 flex justify-end">
              <button 
                onClick={() => setStep(2)}
                disabled={!selectedPackage}
                className="bg-[#131313] dark:bg-white text-white dark:text-[#131313] px-8 py-3 rounded-xl font-black disabled:opacity-50 transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Sponsor Details */}
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4">
            <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Sponsor Details</h1>
            <p className="text-gray-500 mb-8">How should your brand appear on the event page?</p>
            
            <div className="bg-white dark:bg-[#1e293b] rounded-3xl p-8 border border-gray-200 dark:border-white/10 shadow-sm space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Company / Brand Name *</label>
                <input 
                  type="text" 
                  value={formData.sponsor_name}
                  onChange={e => setFormData({...formData, sponsor_name: e.target.value})}
                  className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-[#5a32fa] focus:outline-none"
                  placeholder="e.g. Acme Legal Tech"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Website URL *</label>
                <input 
                  type="url" 
                  value={formData.sponsor_website_url}
                  onChange={e => setFormData({...formData, sponsor_website_url: e.target.value})}
                  className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-[#5a32fa] focus:outline-none"
                  placeholder="https://..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Short Tagline (Optional)</label>
                <input 
                  type="text" 
                  value={formData.sponsor_tagline}
                  onChange={e => setFormData({...formData, sponsor_tagline: e.target.value})}
                  className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-[#5a32fa] focus:outline-none"
                  placeholder="Empowering IP Professionals"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Brand Logo</label>
                <div className="border-2 border-dashed border-gray-200 dark:border-white/20 rounded-2xl p-8 text-center bg-gray-50 dark:bg-black/10">
                  <UploadCloud size={32} className="mx-auto text-gray-400 mb-3" />
                  <div className="font-bold text-gray-900 dark:text-white mb-1">Click to upload or drag & drop</div>
                  <div className="text-xs text-gray-500">PNG, JPG, SVG up to 2MB. Transparent background recommended.</div>
                  <div className="mt-4 text-xs font-bold text-yellow-600 bg-yellow-50 inline-block px-2 py-1 rounded">Mock: Logo upload skipped for demo</div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex justify-between">
              <button 
                onClick={() => setStep(1)}
                className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
              >
                Back
              </button>
              <button 
                onClick={() => setStep(3)}
                disabled={!formData.sponsor_name || !formData.sponsor_website_url}
                className="bg-[#131313] dark:bg-white text-white dark:text-[#131313] px-8 py-3 rounded-xl font-black disabled:opacity-50 transition-colors"
              >
                Review Application
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-right-4">
            <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Review & Submit</h1>
            <p className="text-gray-500 mb-8">Please review your application before submitting. Admins will review your request shortly.</p>
            
            <div className="bg-white dark:bg-[#1e293b] rounded-3xl overflow-hidden border border-gray-200 dark:border-white/10 shadow-sm mb-8">
              <div className="bg-gray-50 dark:bg-white/5 p-6 border-b border-gray-200 dark:border-white/10">
                <div className="text-sm font-bold text-gray-500 mb-1">Selected Event</div>
                <div className="text-xl font-black text-gray-900 dark:text-white">{event?.title}</div>
              </div>
              
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="text-sm font-bold text-gray-500 mb-4 flex items-center gap-2"><Package size={16}/> Package Details</div>
                  <div className="font-bold text-gray-900 dark:text-white text-lg">{selectedPackage?.name}</div>
                  <div className="text-3xl font-black text-[#5a32fa] mb-4">£{selectedPackage?.price}</div>
                  <ul className="space-y-2">
                    {(selectedPackage?.benefits || []).map((b: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <Check size={14} className="text-[#00d26a] shrink-0 mt-0.5" /> {b}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <div className="text-sm font-bold text-gray-500 mb-4 flex items-center gap-2"><FileText size={16}/> Brand Details</div>
                  <div className="space-y-4">
                    <div>
                      <div className="text-xs text-gray-400 font-bold uppercase tracking-wide">Company Name</div>
                      <div className="font-bold text-gray-900 dark:text-white">{formData.sponsor_name}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 font-bold uppercase tracking-wide">Website</div>
                      <div className="font-bold text-[#5a32fa]">{formData.sponsor_website_url}</div>
                    </div>
                    {formData.sponsor_tagline && (
                      <div>
                        <div className="text-xs text-gray-400 font-bold uppercase tracking-wide">Tagline</div>
                        <div className="font-medium text-gray-700 dark:text-gray-300 italic">"{formData.sponsor_tagline}"</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <button 
                onClick={() => setStep(2)}
                className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                disabled={submitting}
              >
                Back
              </button>
              <button 
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-[#00d26a] text-white px-8 py-3 rounded-xl font-black disabled:opacity-50 transition-colors flex items-center gap-2 hover:bg-[#00b85c]"
              >
                {submitting ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
                Submit Application
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Success */}
        {step === 4 && (
          <div className="animate-in zoom-in duration-500 bg-white dark:bg-[#1e293b] rounded-3xl p-12 border border-gray-200 dark:border-white/10 shadow-xl text-center">
            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check size={48} strokeWidth={3} />
            </div>
            <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-4">Application Submitted!</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-lg mx-auto">
              Thank you for applying to sponsor <span className="font-bold">{event?.title}</span>. Our team will review your application and get back to you shortly.
            </p>
            <div className="bg-gray-50 dark:bg-black/20 p-6 rounded-2xl mb-8 max-w-sm mx-auto text-left border border-gray-100 dark:border-white/5">
              <div className="text-sm font-bold text-gray-500 mb-2">Next Steps</div>
              <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2 list-disc list-inside">
                <li>Admin review (1-2 business days)</li>
                <li>Invoice and payment instructions</li>
                <li>Asset collection and onboarding</li>
              </ul>
            </div>
            <Link href={`/platform/events/${eventId}`} className="inline-block bg-[#131313] dark:bg-white text-white dark:text-[#131313] px-8 py-3 rounded-xl font-black transition-colors">
              Return to Event
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
