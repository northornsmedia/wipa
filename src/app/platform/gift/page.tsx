'use client';

import React, { useState } from 'react';
import { Gift, ChevronLeft, CreditCard, Sparkles, Copy, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function GiftMembershipPage() {
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [message, setMessage] = useState('');
  const [tier, setTier] = useState('Annual WIP');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [giftCode, setGiftCode] = useState('');

  const tiers = [
    { name: 'Annual WIP', price: '$299/yr', desc: 'Full access for 1 year' },
    { name: 'Lifetime', price: '$999', desc: 'Forever access' },
    { name: 'Student', price: '$99/yr', desc: 'For enrolled students' },
  ];

  const handlePurchase = () => {
    if (!recipientName || !recipientEmail) {
      alert("Please fill in recipient details.");
      return;
    }
    setIsProcessing(true);
    // Mock processing delay
    setTimeout(() => {
      setIsProcessing(false);
      setGiftCode(`WIPA-GIFT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`);
      setIsSuccess(true);
    }, 2000);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(giftCode);
    alert('Gift code copied to clipboard!');
  };

  return (
    <div className="w-full h-[calc(100vh-73px)] overflow-y-auto no-scrollbar bg-slate-50 dark:bg-[#0b1120] p-4 sm:p-8">
      <div className="max-w-6xl mx-auto flex flex-col gap-8 pb-20">
        
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/platform/profile" className="p-2 bg-white dark:bg-white/5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors shadow-sm border border-gray-100 dark:border-white/5">
            <ChevronLeft size={24} className="text-gray-600 dark:text-gray-300" />
          </Link>
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
              Give the Gift of Innovation <Sparkles className="text-[#ff90e8]" size={28} />
            </h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">Empower a colleague or friend with full WIPA membership access.</p>
          </div>
        </div>

        {isSuccess ? (
          <div className="bg-white dark:bg-[#0f172a] rounded-[2.5rem] p-12 text-center shadow-xl border border-gray-100 dark:border-white/5 flex flex-col items-center animate-in zoom-in-95 duration-500">
            <div className="w-24 h-24 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 size={48} className="text-green-500" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4">Gift Card Purchased Successfully!</h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-8 max-w-lg">
              We've generated a unique gift code. You can copy this code and send it to <span className="font-bold text-gray-700 dark:text-gray-200">{recipientName}</span>, or we will automatically email it to <span className="font-bold text-gray-700 dark:text-gray-200">{recipientEmail}</span>.
            </p>
            
            <div className="bg-gray-50 dark:bg-black/30 border border-dashed border-[#5a32fa]/40 p-6 rounded-2xl flex flex-col items-center gap-4 mb-8 w-full max-w-md">
              <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Your Unique Gift Code</span>
              <div className="text-3xl font-black tracking-widest text-[#5a32fa] dark:text-[#ff90e8]">
                {giftCode}
              </div>
              <button 
                onClick={copyCode}
                className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 hover:text-[#5a32fa] dark:hover:text-[#ff90e8] transition-colors bg-white dark:bg-white/5 px-4 py-2 rounded-lg border border-gray-200 dark:border-white/10 shadow-sm mt-2"
              >
                <Copy size={16} /> Copy Code
              </button>
            </div>

            <Link href="/platform" className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-4 rounded-xl font-bold hover:scale-105 transition-transform shadow-md">
              Return to Feed
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* Form Section */}
            <div className="flex-1 w-full bg-white dark:bg-[#0f172a] rounded-[2rem] p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-white/5">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Customize Your Gift</h2>
              
              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Select Membership Tier</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {tiers.map(t => (
                      <div 
                        key={t.name}
                        onClick={() => setTier(t.name)}
                        className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${tier === t.name ? 'border-[#5a32fa] bg-[#5a32fa]/5 shadow-md' : 'border-gray-100 dark:border-white/10 hover:border-[#5a32fa]/30 bg-gray-50/50 dark:bg-black/10'}`}
                      >
                        <h4 className={`font-black text-lg ${tier === t.name ? 'text-[#5a32fa] dark:text-[#ff90e8]' : 'text-gray-900 dark:text-white'}`}>{t.name}</h4>
                        <p className="text-xs text-gray-500 mt-1.5 font-bold">{t.price}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Recipient Name</label>
                    <input 
                      type="text" 
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#5a32fa] focus:ring-1 focus:ring-[#5a32fa] transition-all dark:text-white placeholder:text-gray-400 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Recipient Email</label>
                    <input 
                      type="email" 
                      value={recipientEmail}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                      placeholder="jane@example.com"
                      className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#5a32fa] focus:ring-1 focus:ring-[#5a32fa] transition-all dark:text-white placeholder:text-gray-400 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Personalized Message (Optional)</label>
                  <textarea 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Happy Birthday! Here's to another year of innovation."
                    rows={4}
                    className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#5a32fa] focus:ring-1 focus:ring-[#5a32fa] transition-all dark:text-white placeholder:text-gray-400 resize-none font-medium"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Preview & Checkout Section */}
            <div className="w-full lg:w-[400px] flex flex-col gap-6 sticky top-8">
              
              {/* Dynamic Gift Card Preview */}
              <div className="bg-gradient-to-br from-[#12121a] to-[#20202a] rounded-[2rem] p-8 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#5a32fa]/40 to-[#ff90e8]/40 blur-[60px] rounded-full pointer-events-none group-hover:scale-110 transition-transform duration-700"></div>
                <div className="absolute inset-0 bg-[url('/patterns/stardust.png')] opacity-20 mix-blend-overlay pointer-events-none"></div>
                
                <div className="relative z-10 flex justify-between items-start mb-16">
                  <div>
                    <h3 className="text-white/50 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Membership Gift</h3>
                    <div className="text-white font-black text-xl tracking-tight">WIPA {tier}</div>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-lg">
                    <Gift className="text-white" size={24} />
                  </div>
                </div>

                <div className="relative z-10 space-y-6">
                  <div>
                    <p className="text-white/50 text-[10px] font-black uppercase tracking-[0.2em] mb-1">To</p>
                    <p className="text-white font-bold text-xl min-h-[28px] tracking-tight">{recipientName || 'Recipient Name'}</p>
                  </div>
                  
                  {message && (
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10 backdrop-blur-sm shadow-inner">
                      <p className="text-white/80 text-sm font-medium italic leading-relaxed line-clamp-3">"{message}"</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Checkout Button */}
              <button 
                onClick={handlePurchase}
                disabled={isProcessing}
                className="w-full bg-[#5a32fa] hover:bg-[#4a28d4] text-white py-4 rounded-[1.5rem] font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-[0_10px_30px_rgba(90,50,250,0.3)] hover:shadow-[0_15px_40px_rgba(90,50,250,0.4)] hover:-translate-y-1 disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {isProcessing ? (
                  <>Processing Payment...</>
                ) : (
                  <><CreditCard size={22} /> Proceed to Checkout</>
                )}
              </button>
              
              <p className="text-center text-xs font-medium text-gray-400">Secure mocked transaction for WIPA.</p>
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
}
