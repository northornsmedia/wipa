'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Mic, Upload, CheckCircle2, Lock, FileText, Send, User } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function PodcastUploadPage() {
  const router = useRouter();
  
  // State
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [canPublish, setCanPublish] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Form states
  const [podcastName, setPodcastName] = useState('');
  const [podcastTopic, setPodcastTopic] = useState('');
  const [podcastDesc, setPodcastDesc] = useState('');

  useEffect(() => {
    async function checkAuth() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setIsLoading(false);
          return;
        }

        setUser(user);

        // Check if user has permission
        const { data: profile } = await supabase
          .from('profiles')
          .select('can_publish_podcast')
          .eq('id', user.id)
          .single();

        if (profile?.can_publish_podcast) {
          setCanPublish(true);
        }
      } catch (err) {
        console.error("Auth check error:", err);
      } finally {
        setIsLoading(false);
      }
    }

    checkAuth();
  }, []);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate API call to submit application
      // In reality, this would insert into a podcast_applications table
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmitSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate API call to upload podcast
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#f59e0b]/20 border-t-[#f59e0b] rounded-full animate-spin"></div>
      </div>
    );
  }

  // 1. Not Authenticated State
  if (!user) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#121212] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
          <Lock className="w-10 h-10 text-gray-400 dark:text-white/40" />
        </div>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-4">Authentication Required</h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-8">
          You need to be logged in to upload or apply to publish a podcast on WIPA.
        </p>
        <div className="flex gap-4">
          <Link href="/platform/resources/podcasts-conversations" className="px-6 py-3 rounded-full font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
            Go Back
          </Link>
          <Link href="/login?redirect=/platform/resources/podcasts-conversations/upload" className="px-6 py-3 rounded-full font-bold text-white bg-gradient-to-r from-[#f59e0b] to-[#d97706] shadow-lg hover:shadow-xl transition-all">
            Log In Now
          </Link>
        </div>
      </div>
    );
  }

  // 2. Authenticated but No Permission -> Show Application Form
  if (!canPublish) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#09090b] pb-24 text-gray-900 dark:text-white relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#f59e0b]/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] rounded-full bg-orange-500/10 blur-[100px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-6 pt-16 relative z-10">
          <Link href="/platform/resources/podcasts-conversations" className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-[#f59e0b] dark:hover:text-[#f59e0b] font-bold text-sm mb-12 hover:-translate-x-1 transition-all">
            <ArrowLeft size={16} /> Back to Podcasts
          </Link>
          
          <div className="flex flex-col items-center text-center mb-16">
            <div className="w-20 h-20 bg-gradient-to-br from-[#f59e0b] to-[#d97706] rounded-[2rem] flex items-center justify-center shadow-[0_0_40px_rgba(245,158,11,0.3)] mb-6 transform rotate-3">
              <Mic className="text-white w-10 h-10 -rotate-3" />
            </div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-6">
              Become a <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f59e0b] to-[#ea580c]">Publisher</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl font-medium leading-relaxed">
              You currently don't have permissions to upload directly. Please submit an application to join our exclusive network of certified podcast publishers.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            {submitSuccess ? (
               <div className="bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-green-200/50 dark:border-green-500/20 rounded-[2rem] p-12 text-center flex flex-col items-center shadow-2xl relative overflow-hidden group">
                 <div className="absolute inset-0 bg-gradient-to-b from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                 <div className="w-24 h-24 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mb-8 relative z-10 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                   <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
                 </div>
                 <h2 className="text-3xl font-black mb-4 relative z-10">Application Submitted!</h2>
                 <p className="text-gray-600 dark:text-gray-400 mb-10 text-lg relative z-10">
                   Our team will review your publisher application within 2-3 business days. We will notify you via email once approved.
                 </p>
                 <Link href="/platform/resources/podcasts-conversations" className="relative z-10 bg-white dark:bg-[#181818] border border-gray-200 dark:border-white/10 px-8 py-4 rounded-full font-bold hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                   Return to Podcasts
                 </Link>
               </div>
            ) : (
              <form onSubmit={handleApply} className="bg-white/70 dark:bg-[#18181b]/60 backdrop-blur-2xl border border-gray-200/50 dark:border-white/10 rounded-[2rem] p-8 md:p-10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#f59e0b] to-[#ea580c] opacity-80" />
                
                <div className="mb-10 flex items-center gap-3">
                  <FileText className="text-[#f59e0b]" size={24} />
                  <h2 className="text-2xl font-bold">Publisher Application</h2>
                </div>
                
                <div className="space-y-8">
                  <div className="group">
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 group-focus-within:text-[#f59e0b] transition-colors">Proposed Podcast Name</label>
                    <input 
                      required
                      type="text" 
                      value={podcastName}
                      onChange={e => setPodcastName(e.target.value)}
                      className="w-full bg-gray-50/50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-2xl px-5 py-4 focus:border-[#f59e0b] focus:ring-1 focus:ring-[#f59e0b] outline-none transition-all placeholder-gray-400 dark:placeholder-gray-600 font-medium"
                      placeholder="e.g., Tech Law Today"
                    />
                  </div>
                  
                  <div className="group">
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 group-focus-within:text-[#f59e0b] transition-colors">Primary Topic / Audience</label>
                    <input 
                      required
                      type="text" 
                      value={podcastTopic}
                      onChange={e => setPodcastTopic(e.target.value)}
                      className="w-full bg-gray-50/50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-2xl px-5 py-4 focus:border-[#f59e0b] focus:ring-1 focus:ring-[#f59e0b] outline-none transition-all placeholder-gray-400 dark:placeholder-gray-600 font-medium"
                      placeholder="e.g., IP Strategy for Startups"
                    />
                  </div>
                  
                  <div className="group">
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 group-focus-within:text-[#f59e0b] transition-colors">Why do you want to publish on WIPA?</label>
                    <textarea 
                      required
                      rows={5}
                      value={podcastDesc}
                      onChange={e => setPodcastDesc(e.target.value)}
                      className="w-full bg-gray-50/50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-2xl px-5 py-4 focus:border-[#f59e0b] focus:ring-1 focus:ring-[#f59e0b] outline-none transition-all resize-none placeholder-gray-400 dark:placeholder-gray-600 font-medium"
                      placeholder="Tell us about your background and the content you plan to share..."
                    ></textarea>
                  </div>
                  
                  <button 
                    disabled={isSubmitting}
                    type="submit" 
                    className="w-full mt-4 flex items-center justify-center gap-3 bg-gradient-to-r from-[#f59e0b] to-[#ea580c] hover:from-[#ea580c] hover:to-[#c2410c] disabled:opacity-50 text-white py-4 md:py-5 rounded-2xl font-black text-lg shadow-[0_10px_30px_rgba(245,158,11,0.3)] hover:shadow-[0_15px_40px_rgba(245,158,11,0.4)] hover:-translate-y-1 transition-all duration-300"
                  >
                    {isSubmitting ? (
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <Send size={20} /> Submit Application
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 3. Authenticated and Permitted -> Show Upload Form
  return (
    <div className="min-h-screen bg-white dark:bg-[#121212] pb-24 text-gray-900 dark:text-white">
      <div className="bg-gradient-to-r from-[#f59e0b] to-[#d97706] pt-8 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          <Link href="/platform/resources/podcasts-conversations" className="inline-flex items-center gap-2 text-white/80 hover:text-white font-bold text-sm mb-6 hover:-translate-x-1 transition-transform">
            <ArrowLeft size={16} /> Back to Podcasts
          </Link>
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg">
              <Upload className="text-[#f59e0b] w-6 h-6" />
            </div>
            <h1 className="text-4xl font-black text-white">Upload New Episode</h1>
          </div>
          <p className="text-white/80 font-medium ml-16">
            Publish your latest podcast episode directly to the WIPA network.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-8 relative z-10">
        {submitSuccess ? (
           <div className="bg-white dark:bg-[#181818] border border-gray-200 dark:border-white/10 rounded-3xl p-10 shadow-xl text-center flex flex-col items-center">
             <div className="w-20 h-20 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mb-6">
               <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
             </div>
             <h2 className="text-3xl font-black mb-4">Episode Published!</h2>
             <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
               Your episode "{podcastName}" has been successfully uploaded and is now live on the platform.
             </p>
             <div className="flex gap-4">
               <Link href="/platform/resources/podcasts-conversations" className="px-6 py-3 rounded-full font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
                 Go to Podcasts
               </Link>
               <button onClick={() => {setSubmitSuccess(false); setPodcastName(''); setPodcastTopic(''); setPodcastDesc('');}} className="px-6 py-3 rounded-full font-bold text-white bg-[#f59e0b] shadow-lg hover:shadow-xl transition-all">
                 Upload Another
               </button>
             </div>
           </div>
        ) : (
          <form onSubmit={handleUpload} className="bg-white dark:bg-[#181818] border border-gray-200 dark:border-white/10 rounded-3xl p-8 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Left Column */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Episode Title</label>
                  <input 
                    required
                    type="text" 
                    value={podcastName}
                    onChange={e => setPodcastName(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-[#121212] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 focus:border-[#f59e0b] focus:ring-1 focus:ring-[#f59e0b] outline-none transition-all"
                    placeholder="Season X, Episode Y - Title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Category / Topic</label>
                  <select 
                    required
                    value={podcastTopic}
                    onChange={e => setPodcastTopic(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-[#121212] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 focus:border-[#f59e0b] focus:ring-1 focus:ring-[#f59e0b] outline-none transition-all appearance-none"
                  >
                    <option value="" disabled>Select a topic...</option>
                    <option value="Trademarks">Trademarks</option>
                    <option value="Patents">Patents</option>
                    <option value="Copyright">Copyright</option>
                    <option value="Leadership">Leadership</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Episode Description</label>
                  <textarea 
                    required
                    rows={6}
                    value={podcastDesc}
                    onChange={e => setPodcastDesc(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-[#121212] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 focus:border-[#f59e0b] focus:ring-1 focus:ring-[#f59e0b] outline-none transition-all resize-none"
                    placeholder="Show notes and episode description..."
                  ></textarea>
                </div>
              </div>
              
              {/* Right Column */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Audio File (MP3/WAV)</label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-white/20 rounded-2xl h-32 flex flex-col items-center justify-center text-gray-500 hover:border-[#f59e0b] hover:bg-[#f59e0b]/5 transition-all cursor-pointer">
                    <Upload className="w-8 h-8 mb-2 text-gray-400" />
                    <span className="text-sm font-medium">Click to browse or drag file here</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Cover Artwork (Optional)</label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-white/20 rounded-2xl h-48 flex flex-col items-center justify-center text-gray-500 hover:border-[#f59e0b] hover:bg-[#f59e0b]/5 transition-all cursor-pointer">
                    <User className="w-10 h-10 mb-2 text-gray-400" />
                    <span className="text-sm font-medium">Upload thumbnail (1:1 ratio)</span>
                  </div>
                </div>
              </div>
              
            </div>
            
            <div className="mt-10 pt-6 border-t border-gray-100 dark:border-white/5 flex justify-end gap-4">
              <Link href="/platform/resources/podcasts-conversations" className="px-6 py-3 rounded-xl font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                Cancel
              </Link>
              <button 
                disabled={isSubmitting}
                type="submit" 
                className="flex items-center gap-2 bg-[#f59e0b] hover:bg-[#d97706] disabled:opacity-50 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Upload size={18} /> Publish Episode
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
