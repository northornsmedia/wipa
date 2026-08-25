'use client';

import Link from 'next/link';
import { Mail, MapPin, MessageSquare, Send, Phone, CheckCircle2, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import PublicHeader from '@/components/PublicHeader';
import PublicFooter from '@/components/PublicFooter';

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Membership Inquiry',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#060608] text-slate-900 dark:text-white font-sans overflow-x-hidden flex flex-col transition-colors duration-300 relative selection:bg-pink-500 selection:text-white">
      
      {/* Background Glowing Wavy Line Gradient SVG */}
      <div className="absolute top-16 left-0 right-0 w-full overflow-hidden pointer-events-none opacity-85 z-0">
        <svg viewBox="0 0 500 150" preserveAspectRatio="none" className="w-full h-44 sm:h-64 stroke-current">
          <defs>
            <linearGradient id="contactWaveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ff2a70" />
              <stop offset="50%" stopColor="#ff7836" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
          <path d="M-20,30 Q80,130 200,60 T440,80 T550,20" fill="none" stroke="url(#contactWaveGradient)" strokeWidth="3.5" strokeLinecap="round" />
        </svg>
      </div>

      {/* Ambient Radial Neon Glows */}
      <div className="absolute top-24 left-1/4 w-96 h-96 bg-[#ff2a70]/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-48 right-1/4 w-96 h-96 bg-[#8b5cf6]/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Top Header */}
      <div className="w-full z-50 relative border-b border-slate-100 dark:border-white/5 bg-white/90 dark:bg-[#060608]/80 backdrop-blur-md">
        <PublicHeader />
      </div>

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12 md:py-20 z-10 relative">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/15 px-4 py-1.5 mb-6 shadow-sm backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-[#ff2a70] animate-pulse" />
            <span className="text-xs font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-orange-500 to-purple-600 dark:from-pink-400 dark:via-orange-300 dark:to-purple-400">
              Get In Touch With WIPA
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white leading-[1.12] mb-6 max-w-4xl mx-auto tracking-tight">
            Let&apos;s Start a <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff2a70] via-[#ff7836] to-[#a855f7]">
              Global Conversation
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed">
            Have questions about memberships, firm directory verification, publication features, or event partnerships? Our team is here to assist.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 mb-20 items-start">
          
          {/* Left Column: Office Contacts */}
          <div className="w-full lg:w-5/12 space-y-6">
            
            {/* UK Headquarters Card */}
            <div className="p-8 rounded-3xl bg-white dark:bg-[#0c101d] border border-slate-200/90 dark:border-white/[0.08] shadow-md hover:shadow-xl dark:shadow-2xl transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                  <MapPin size={20} />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-purple-600 dark:text-purple-400">Global Headquarters</span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">United Kingdom Office</h3>
                </div>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-3">
                60 Castle Street, Dover, CT16 1PJ, United Kingdom
              </p>
              <p className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Phone size={13} className="text-purple-500" /> +44 (0)203-813-0457
              </p>
            </div>

            {/* India Office Card */}
            <div className="p-8 rounded-3xl bg-white dark:bg-[#0c101d] border border-slate-200/90 dark:border-white/[0.08] shadow-md hover:shadow-xl dark:shadow-2xl transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <MapPin size={20} />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Asia-Pacific Hub</span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">India Office</h3>
                </div>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-3">
                E-606, PNTC, Times Of India Press Rd, Satellite, Shyamal, Ahmedabad, Gujarat, 380015
              </p>
              <p className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Phone size={13} className="text-emerald-500" /> +91 90545 75950
              </p>
            </div>

            {/* Email Support Card */}
            <div className="p-8 rounded-3xl bg-white dark:bg-[#0c101d] border border-slate-200/90 dark:border-white/[0.08] shadow-md hover:shadow-xl dark:shadow-2xl transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
                  <Mail size={20} />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-orange-600 dark:text-orange-400">Direct Inquiries</span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Alliance Support</h3>
                </div>
              </div>
              <a
                href="mailto:info@northonsprmarketing.com"
                className="text-sm font-bold text-slate-800 dark:text-slate-200 hover:text-orange-500 transition-colors"
              >
                info@northonsprmarketing.com
              </a>
              <p className="text-xs text-slate-500 mt-1 font-medium">Responses guaranteed within 24 business hours.</p>
            </div>

          </div>

          {/* Right Column: Contact Form */}
          <div className="w-full lg:w-7/12">
            <div className="p-8 sm:p-12 rounded-[2.5rem] bg-white dark:bg-[#0c101d] border border-slate-200/90 dark:border-white/[0.08] shadow-xl dark:shadow-2xl">
              {submitted ? (
                <div className="py-16 flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 size={40} />
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Message Dispatched</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mb-8">
                    Thank you for reaching out. An alliance representative will contact you at {formData.email || 'your email'} shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-xs font-bold text-pink-500 hover:underline"
                  >
                    Send another inquiry ➔
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-1">
                      Send Us an Inquiry
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      Fill out the form below and we will route your inquiry to the appropriate committee.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Dr. Eleanor Vance"
                        className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-3 px-4 text-sm font-medium outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 text-slate-900 dark:text-white transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="eleanor@iplaw.com"
                        className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-3 px-4 text-sm font-medium outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 text-slate-900 dark:text-white transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Inquiry Category
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-3 px-4 text-sm font-medium outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 text-slate-900 dark:text-white transition-all"
                    >
                      <option value="Membership Inquiry" className="bg-slate-900 text-white">Membership Inquiry & Tiers</option>
                      <option value="Law Firm Claim & Directory" className="bg-slate-900 text-white">Law Firm Directory Listing</option>
                      <option value="Publications & Annuals" className="bg-slate-900 text-white">Women&apos;s IP World Annual Submissions</option>
                      <option value="Event Sponsorship" className="bg-slate-900 text-white">Event Keynote & Sponsorship</option>
                      <option value="General Support" className="bg-slate-900 text-white">General Inquiries & Feedback</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Message
                    </label>
                    <textarea
                      rows={5}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please describe your inquiry or collaboration request..."
                      className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-3 px-4 text-sm font-medium outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 text-slate-900 dark:text-white transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-full bg-gradient-to-r from-[#d946ef] via-[#ff2a70] to-[#f97316] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-pink-500/20 hover:scale-101 active:scale-99 transition-all cursor-pointer disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <span>Transmitting Inquiry...</span>
                    ) : (
                      <>
                        <Send size={15} />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

      </main>

      <PublicFooter />
    </div>
  );
}
