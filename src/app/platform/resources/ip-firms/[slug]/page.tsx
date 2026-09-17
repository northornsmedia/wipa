'use client';

import { DotmCircular7 } from '@/components/ui/dotm-circular-7';
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/store/useAppStore';
import { ArrowLeft, CheckCircle2, MapPin, Globe, Mail, Phone, Building2, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function FirmProfilePage({ params }: { params: Promise<{ slug: string }> | { slug: string } }) {
  const resolvedParams = React.use(params as any) as { slug: string };
  const slug = resolvedParams?.slug;
  const { user } = useAppStore();
  const [firm, setFirm] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Reviews state
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (!slug) return;
    const fetchFirm = async () => {
      setLoading(true);
      let { data } = await supabase.from('ip_firms').select('*').eq('slug', slug).maybeSingle();
      if (!data) {
        const { data: bData } = await supabase.from('business_profiles').select('*').eq('slug', slug).maybeSingle();
        if (bData) {
          data = {
            id: bData.id,
            name: bData.name,
            slug: bData.slug,
            logo_url: bData.logo_url,
            cover_image_url: bData.cover_image_url,
            description: bData.description || bData.tagline,
            website_url: bData.website_url,
            linkedin_url: bData.linkedin_url,
            headquarters: bData.headquarters,
            size_range: bData.company_size,
            founded_year: bData.founded_year,
            specializations: bData.specializations || [],
            is_verified: bData.is_verified,
            is_claimed: true,
            contact_email: bData.contact_email,
            phone: bData.phone
          };
        }
      }
      if (data) {
        setFirm(data);
        fetchReviews(data.id);
      }
      setLoading(false);
    };
    fetchFirm();
  }, [slug]);

  const fetchReviews = async (firmId: string) => {
    const { data } = await supabase.from('ip_firm_reviews').select('*, profiles(first_name, last_name, avatar_url)').eq('firm_id', firmId).order('created_at', { ascending: false });
    if (data) setReviews(data);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return alert('You must be logged in to leave a review.');
    setSubmittingReview(true);
    const { error } = await supabase.from('ip_firm_reviews').insert({
      firm_id: firm.id,
      reviewer_id: user.id,
      rating: reviewRating,
      review_text: reviewText
    });
    setSubmittingReview(false);
    if (error) {
      alert('Error submitting review');
    } else {
      setReviewText('');
      setReviewRating(5);
      fetchReviews(firm.id);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#020617]"><DotmCircular7 size={40} className="text-[#6600FF]" /></div>;
  }

  if (!firm) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-[#020617] p-4 text-center">
        <Building2 size={64} className="text-slate-300 dark:text-slate-700 mb-6" />
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Firm Not Found</h1>
        <p className="text-slate-500 mb-8">The IP firm you're looking for doesn't exist or has been removed.</p>
        <Link href="/platform/resources/ip-firms" className="bg-[#5a32fa] text-white px-6 py-3 rounded-xl font-bold">Back to Directory</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-white pb-24">
      
      {/* Cover & Header */}
      <div className="bg-white dark:bg-[#0f172a] border-b border-slate-200/80 dark:border-white/10">
        <div className="h-48 sm:h-64 md:h-80 w-full relative bg-slate-900 overflow-hidden">
          <img 
            src={firm.cover_image_url || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80'} 
            alt={`${firm.name} cover`} 
            className="w-full h-full object-cover brightness-[0.88]" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20 pointer-events-none" />
          <div className="absolute top-4 left-4 z-10">
            <Link 
              href="/platform/resources/ip-firms" 
              className="bg-black/40 hover:bg-black/60 backdrop-blur-md text-white p-2.5 rounded-full inline-flex transition-colors border border-white/20 active:scale-95"
            >
              <ArrowLeft size={18} />
            </Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative pb-6 sm:pb-8">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6 md:gap-8 -mt-12 sm:-mt-16 relative z-10 mb-6 sm:mb-8">
            <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl shadow-2xl ring-4 ring-white dark:ring-[#0f172a] flex items-center justify-center overflow-hidden shrink-0">
              {firm.logo_url ? (
                <img 
                  src={firm.logo_url} 
                  alt={firm.name} 
                  className="w-full h-full object-cover" 
                  onError={(e: any) => {
                    e.target.style.display = 'none';
                    if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div 
                className="w-full h-full bg-gradient-to-br from-[#5a32fa] to-purple-600 text-white font-black text-3xl sm:text-4xl flex items-center justify-center"
                style={{ display: firm.logo_url ? 'none' : 'flex' }}
              >
                {firm.name.charAt(0)}
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">{firm.name}</h1>
                {firm.is_verified && <CheckCircle2 size={20} className="text-blue-500 shrink-0 fill-blue-500/20" />}
                {firm.is_featured && (
                  <span className="bg-slate-900 dark:bg-purple-950 text-purple-300 border border-purple-500/40 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                    <ShieldCheck size={11} className="text-purple-400" /> Premier Practice
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-3 text-slate-600 dark:text-slate-400 font-bold text-xs sm:text-sm">
                {firm.headquarters && <div className="flex items-center gap-1"><MapPin size={14} className="text-rose-500" /> {firm.headquarters}</div>}
                {firm.founded_year && <div className="flex items-center gap-1"><Building2 size={14} className="text-indigo-500" /> Est. {firm.founded_year}</div>}
                {firm.size_range && <div>• {firm.size_range} Attorneys</div>}
              </div>
            </div>
          </div>

          <div className="flex overflow-x-auto gap-8 border-b border-slate-200 dark:border-white/10">
            {['overview', 'specializations', 'team', 'reviews'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-sm font-black uppercase tracking-widest border-b-2 transition-colors whitespace-nowrap ${activeTab === tab ? 'border-[#5a32fa] text-[#5a32fa]' : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col lg:flex-row gap-12">
        
        {/* Main Content */}
        <div className="flex-1 space-y-12">
          
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-in fade-in">
              <section>
                <h2 className="text-2xl font-black mb-4">About the Firm</h2>
                <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
                  {firm.description ? (
                    <p className="whitespace-pre-wrap">{firm.description}</p>
                  ) : (
                    <p className="italic">No description provided.</p>
                  )}
                </div>
              </section>
              
              <section className="bg-white dark:bg-[#0f172a] rounded-3xl p-8 border border-slate-200 dark:border-white/10 shadow-sm">
                <h2 className="text-xl font-black mb-6">Contact & Links</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {firm.website_url && (
                    <a href={firm.website_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-slate-700 dark:text-slate-300 hover:text-[#5a32fa] font-bold transition-colors">
                      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center"><Globe size={18} /></div>
                      Website
                    </a>
                  )}
                  {firm.linkedin_url && (
                    <a href={firm.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-slate-700 dark:text-slate-300 hover:text-[#5a32fa] font-bold transition-colors">
                      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center"><Globe size={18} /></div>
                      LinkedIn Profile
                    </a>
                  )}
                  {firm.contact_email && (
                    <a href={`mailto:${firm.contact_email}`} className="flex items-center gap-3 text-slate-700 dark:text-slate-300 hover:text-[#5a32fa] font-bold transition-colors">
                      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center"><Mail size={18} /></div>
                      {firm.contact_email}
                    </a>
                  )}
                  {firm.phone && (
                    <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300 font-bold">
                      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center"><Phone size={18} /></div>
                      {firm.phone}
                    </div>
                  )}
                </div>
              </section>
            </div>
          )}

          {activeTab === 'specializations' && (
            <div className="space-y-12 animate-in fade-in">
              <section>
                <h2 className="text-2xl font-black mb-6">Practice Areas</h2>
                {firm.specializations && firm.specializations.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {firm.specializations.map((spec: string) => (
                      <span key={spec} className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-4 py-2 rounded-xl font-bold">
                        {spec}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 italic">No specializations listed.</p>
                )}
              </section>
              
              <section>
                <h2 className="text-2xl font-black mb-6">Jurisdictions</h2>
                {firm.jurisdictions && firm.jurisdictions.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {firm.jurisdictions.map((jur: string) => (
                      <span key={jur} className="bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-4 py-2 rounded-xl font-bold">
                        {jur}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 italic">No jurisdictions listed.</p>
                )}
              </section>
            </div>
          )}

          {activeTab === 'team' && (
            <div className="animate-in fade-in">
              <h2 className="text-2xl font-black mb-6">Our Team</h2>
              <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-12 border border-slate-200 dark:border-white/10 text-center">
                <p className="text-slate-500 italic">No team members listed yet.</p>
                {/* Team members feature to be fully implemented later */}
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-8 animate-in fade-in">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black">Reviews ({reviews.length})</h2>
              </div>

              {user && (
                <form onSubmit={handleSubmitReview} className="bg-white dark:bg-[#0f172a] p-6 rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
                  <h3 className="font-bold text-lg mb-2">Write a Review</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500">Client Rating:</span>
                    {[1, 2, 3, 4, 5].map(score => (
                      <button 
                        type="button" 
                        key={score} 
                        onClick={() => setReviewRating(score)}
                        className={`w-8 h-8 rounded-lg font-black text-xs transition-all cursor-pointer ${
                          score <= reviewRating 
                            ? 'bg-[#5a32fa] text-white shadow-sm' 
                            : 'bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        {score}
                      </button>
                    ))}
                    <span className="text-xs font-bold text-[#5a32fa] dark:text-purple-400 ml-1">({reviewRating} of 5)</span>
                  </div>
                  <textarea 
                    required 
                    value={reviewText} 
                    onChange={e => setReviewText(e.target.value)} 
                    placeholder="Share your experience working with this firm..."
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 outline-none focus:ring-2 focus:ring-[#5a32fa]/50 min-h-[100px]"
                  />
                  <button type="submit" disabled={submittingReview} className="bg-[#5a32fa] text-white px-6 py-2 rounded-xl font-bold disabled:opacity-50">
                    {submittingReview ? 'Submitting...' : 'Post Review'}
                  </button>
                </form>
              )}

              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <div className="text-center p-12 text-slate-500 italic">No reviews yet. Be the first to review!</div>
                ) : (
                  reviews.map(review => (
                    <div key={review.id} className="bg-white dark:bg-[#0f172a] p-6 rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <img src={review.profiles.avatar_url || `https://ui-avatars.com/api/?name=${review.profiles.first_name}+${review.profiles.last_name}`} alt="Reviewer" className="w-10 h-10 rounded-full" />
                          <div>
                            <div className="font-bold text-sm">{review.profiles.first_name} {review.profiles.last_name}</div>
                            <div className="text-xs text-slate-500">{new Date(review.created_at).toLocaleDateString()}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/40 text-xs font-black text-purple-700 dark:text-purple-300">
                          <span>Rating:</span>
                          <span>{review.rating || 5}/5</span>
                        </div>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{review.review_text}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-80 shrink-0 space-y-6">
          {!firm.is_claimed && (
            <div className="bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-white/10">
              <h3 className="text-xl font-black mb-2">Showcase your firm</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
                Submit your firm details to enhance this listing, add team members, and manage your presence on WIPA.
              </p>
              <Link href={`/platform/resources/ip-firms/claim?slug=${firm.slug}`} className="block w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-center py-3 rounded-xl font-black hover:opacity-90 transition-opacity">
                Manage Firm Listing
              </Link>
            </div>
          )}
          
          <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-6 border border-slate-200 dark:border-white/10 shadow-sm text-center">
            <h3 className="font-black mb-4">Want to get in touch?</h3>
            <a href={`mailto:${firm.contact_email || 'hello@example.com'}`} className="block w-full bg-[#5a32fa] text-white text-center py-3 rounded-xl font-black hover:bg-[#4a24db] transition-colors">
              Contact Firm
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
