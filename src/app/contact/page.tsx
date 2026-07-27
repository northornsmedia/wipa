'use client';

import Link from 'next/link';
import { Mail, MapPin, MessageSquare, Send } from 'lucide-react';
import { useState } from 'react';
import PublicHeader from '@/components/PublicHeader';
import PublicFooter from '@/components/PublicFooter';

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#fbe8d5] bg-grid-pattern font-sans overflow-x-hidden flex flex-col">
      
      <PublicHeader />

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12 md:py-20 z-10 relative">
        
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Left Column - Info */}
          <div className="w-full lg:w-5/12">
            <span className="inline-block bg-[#6eb4ff] text-black font-black px-6 py-2 rounded-full text-sm border-4 border-[#131313] shadow-[4px_4px_0px_0px_#131313] mb-8 tracking-wider uppercase">
              Get In Touch
            </span>
            <h1 className="font-serif text-5xl md:text-7xl text-gray-900 mb-6 leading-[1.1]">
              Let's Start a Conversation
            </h1>
            <p className="text-xl font-bold text-gray-600 mb-12">
              Have questions about our memberships, resources, or looking to partner? Reach out to our team.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-[#ff90e8] border-4 border-[#131313] rounded-2xl flex items-center justify-center flex-shrink-0 shadow-[4px_4px_0px_0px_#131313]">
                  <Mail className="w-6 h-6 text-[#131313]" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-[#131313] mb-1">Email Us</h3>
                  <p className="text-gray-600 font-bold text-lg">hello@wipa.global</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-[#48d29b] border-4 border-[#131313] rounded-2xl flex items-center justify-center flex-shrink-0 shadow-[4px_4px_0px_0px_#131313]">
                  <MapPin className="w-6 h-6 text-[#131313]" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-[#131313] mb-1">HQ</h3>
                  <p className="text-gray-600 font-bold text-lg">123 Innovation Drive<br/>San Francisco, CA 94105</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-[#ffd05b] border-4 border-[#131313] rounded-2xl flex items-center justify-center flex-shrink-0 shadow-[4px_4px_0px_0px_#131313]">
                  <MessageSquare className="w-6 h-6 text-[#131313]" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-[#131313] mb-1">Support</h3>
                  <p className="text-gray-600 font-bold text-lg">Available 24/7 on the Platform</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="w-full lg:w-7/12">
            <div className="bg-white rounded-[3rem] border-4 border-[#131313] shadow-[12px_12px_0px_0px_#131313] p-10 md:p-14 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff5241] rounded-full -translate-y-1/2 translate-x-1/2 border-4 border-[#131313]"></div>
              
              {submitted ? (
                <div className="h-[450px] flex flex-col items-center justify-center text-center">
                  <div className="w-24 h-24 bg-[#00d26a] border-4 border-[#131313] rounded-full flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_#131313]">
                    <Send className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-4xl font-black text-[#131313] mb-4">Message Sent!</h3>
                  <p className="text-xl font-bold text-gray-600">We'll get back to you within 24 hours.</p>
                  <button onClick={() => setSubmitted(false)} className="mt-8 text-[#5a32fa] font-bold underline decoration-2 underline-offset-4">Send another message</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                  <div>
                    <label className="block text-sm font-black text-[#131313] mb-2 uppercase tracking-wide">Full Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Jane Doe"
                      className="w-full px-6 py-4 bg-gray-50 border-4 border-[#131313] rounded-xl font-bold text-lg focus:outline-none focus:bg-white focus:shadow-[4px_4px_0px_0px_#131313] transition-all"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-black text-[#131313] mb-2 uppercase tracking-wide">Email Address</label>
                    <input 
                      type="email" 
                      required
                      placeholder="jane@example.com"
                      className="w-full px-6 py-4 bg-gray-50 border-4 border-[#131313] rounded-xl font-bold text-lg focus:outline-none focus:bg-white focus:shadow-[4px_4px_0px_0px_#131313] transition-all"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-black text-[#131313] mb-2 uppercase tracking-wide">Message</label>
                    <textarea 
                      required
                      rows={5}
                      placeholder="How can we help you?"
                      className="w-full px-6 py-4 bg-gray-50 border-4 border-[#131313] rounded-xl font-bold text-lg focus:outline-none focus:bg-white focus:shadow-[4px_4px_0px_0px_#131313] transition-all resize-none"
                    ></textarea>
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-[#131313] text-white px-8 py-5 rounded-xl font-black text-xl hover:bg-black hover:shadow-[4px_4px_0px_0px_#131313] hover:-translate-y-1 transition-all disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none flex items-center justify-center gap-3"
                  >
                    {isSubmitting ? 'Sending...' : (
                      <>Send Message <Send className="w-5 h-5" /></>
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
