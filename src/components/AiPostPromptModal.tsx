'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, Check, ArrowRight, Wand2 } from 'lucide-react';
import { DotmCircular7 as Loader2 } from '@/components/ui/dotm-circular-7';
import ArrowUpDoubleIcon from '@/components/icons/ArrowUpDoubleIcon';
import Cancel02Icon from '@/components/icons/Cancel02Icon';

interface AiPostPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyDraft: (generatedText: string) => void;
  initialTopic?: string;
  initialDraft?: string;
}

const TONE_OPTIONS = [
  { id: 'thought-leadership', label: '🎯 Thought Leadership', desc: 'Strategic & forward-looking' },
  { id: 'achievement', label: '🏆 Celebration / Win', desc: 'Patent grant, case win, milestone' },
  { id: 'legal-analysis', label: '⚖️ Legal Analysis', desc: 'Deep dive into a ruling or statute' },
  { id: 'practical-tip', label: '💡 Practical Tips', desc: 'Best practices for practitioners' },
  { id: 'question', label: '💬 Discussion / Question', desc: 'Engage the community for opinions' },
];

const SUGGESTED_IDEAS = [
  "Insights on recent AI patentability and inventorship rules",
  "Celebrated a major trademark registration milestone today",
  "Key takeaways from a cross-border IP licensing dispute",
  "Advice for early-career women entering intellectual property law",
  "Upcoming trends in green innovation and clean-tech patents"
];

export default function AiPostPromptModal({
  isOpen,
  onClose,
  onApplyDraft,
  initialTopic = '',
  initialDraft = ''
}: AiPostPromptModalProps) {
  const [intention, setIntention] = useState(initialDraft || initialTopic || '');
  const [selectedTone, setSelectedTone] = useState<string>('🎯 Thought Leadership');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDismissing, setIsDismissing] = useState(false);

  // Sync draft or topic whenever opening
  useEffect(() => {
    if (isOpen) {
      setIntention(initialDraft || initialTopic || '');
      setIsExpanded(false);
      setIsDismissing(false);
      setError(null);
    }
  }, [isOpen, initialDraft, initialTopic]);

  const triggerClose = useCallback(() => {
    if (isDismissing) return;
    setIsDismissing(true);
  }, [isDismissing]);

  const handleGenerate = async () => {
    if (!intention.trim()) {
      setError('Please tell the AI what you would like to write about.');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const res = await fetch('/api/proxy-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          intention: intention.trim(),
          tone: selectedTone,
          rawDraft: initialDraft
        })
      });

      const data = await res.json();
      if (data?.text) {
        onApplyDraft(data.text);
        triggerClose();
      } else {
        setError('Could not generate draft. Please try again.');
      }
    } catch (err: any) {
      console.error('AI Draft Error:', err);
      setError('Failed to connect to AI service. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex flex-col justify-end sm:items-center sm:justify-center select-none pointer-events-auto">
          {/* Backdrop with fade animation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isDismissing ? 0 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            onClick={triggerClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Sheet Drawer on Mobile, Centered Modal on Desktop */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{
              y: isDismissing ? '100%' : 0,
              height: isExpanded ? '94dvh' : 'auto'
            }}
            exit={{ y: '100%' }}
            transition={{
              y: { duration: 0.32, ease: [0.32, 0.72, 0, 1] },
              height: { duration: 0.32, ease: [0.32, 0.72, 0, 1] }
            }}
            onAnimationComplete={() => {
              if (isDismissing) {
                onClose();
                setIsDismissing(false);
              }
            }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.y > 80 || info.velocity.y > 350) {
                triggerClose();
              }
            }}
            onClick={(e) => e.stopPropagation()}
            className={`relative z-10 w-full sm:max-w-[580px] bg-white dark:bg-black sm:dark:bg-[#0b0f19] rounded-t-[2.2rem] sm:rounded-3xl border-t sm:border border-gray-200 dark:border-white/10 shadow-2xl flex flex-col overflow-hidden will-change-transform transform-gpu max-h-[94dvh] sm:max-h-[85vh] transition-[height] duration-200 ${
              isExpanded ? 'rounded-t-none pt-safe' : ''
            }`}
          >
            {/* Top Pull Handle for Mobile Drag Gesture */}
            <div
              onClick={() => setIsExpanded((prev) => !prev)}
              className="pt-3 pb-1 flex justify-center sm:hidden cursor-pointer active:opacity-60 touch-none shrink-0"
              aria-label={isExpanded ? "Collapse drawer" : "Expand drawer full screen"}
            >
              <div className="w-12 h-1.5 bg-gray-300 dark:bg-white/20 rounded-full" />
            </div>

            {/* Header with Sally AI branding */}
            <div className="flex items-center justify-between px-5 sm:px-6 pt-3 sm:pt-5 pb-3 border-b border-gray-100 dark:border-white/10 shrink-0">
              <div className="flex items-center gap-3">
                {/* Sally AI Gradient Avatar */}
                <div className="shrink-0">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#5a32fa] via-purple-600 to-[#ff90e8] p-0.5 shadow-md shadow-[#5a32fa]/20 flex items-center justify-center">
                    <div className="w-full h-full bg-white dark:bg-black rounded-[14px] flex items-center justify-center p-1.5">
                      <img src="/sally-logo.png" alt="Sally AI" className="w-full h-full object-contain block dark:hidden" />
                      <img src="/sally-logo-white.png" alt="Sally AI" className="w-full h-full object-contain hidden dark:block" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-black text-gray-900 dark:text-white tracking-tight">
                    Sally Assistant
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-extrabold bg-gradient-to-r from-[#5a32fa]/15 to-[#ff90e8]/25 text-[#5a32fa] dark:text-[#ff90e8] border border-[#5a32fa]/20 shadow-2xs">
                    SALLY 4.1 PRO
                  </span>
                </div>
              </div>

              {/* Action Buttons: Expand Drawer & Close */}
              <div className="flex items-center gap-1.5">
                {/* Mobile Expand / Collapse Button */}
                <button
                  type="button"
                  onClick={() => setIsExpanded((prev) => !prev)}
                  className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white flex items-center justify-center transition-transform active:scale-90 sm:hidden cursor-pointer"
                  aria-label={isExpanded ? "Collapse drawer" : "Expand full screen"}
                  title={isExpanded ? "Collapse" : "Expand"}
                >
                  <ArrowUpDoubleIcon size={16} className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                </button>

                {/* Close Button */}
                <button 
                  type="button"
                  onClick={triggerClose}
                  className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white flex items-center justify-center transition-transform active:scale-90 cursor-pointer"
                  aria-label="Close"
                  title="Close"
                >
                  <Cancel02Icon size={16} />
                </button>
              </div>
            </div>

            {/* Scrollable Content Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 [scrollbar-width:none]">
              
              {/* Main Prompt Input Box */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    <Wand2 size={13} className="text-[#5a32fa] dark:text-[#ff90e8]" />
                    <span>What would you like to share or discuss?</span>
                  </label>
                  {intention && (
                    <button
                      type="button"
                      onClick={() => setIntention('')}
                      className="text-[11px] font-semibold text-gray-400 hover:text-[#5a32fa] dark:hover:text-purple-300 transition-colors"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className="relative rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50/70 dark:bg-white/5 focus-within:border-[#5a32fa] focus-within:ring-2 focus-within:ring-[#5a32fa]/20 transition-all overflow-hidden shadow-xs">
                  <textarea
                    value={intention}
                    onChange={(e) => {
                      setIntention(e.target.value);
                      if (error) setError(null);
                    }}
                    rows={3}
                    placeholder="e.g. We won our appeal in the Unified Patent Court today on FRAND licensing terms, or I'd like to share advice on patent classification..."
                    className="w-full p-3.5 bg-transparent text-gray-900 dark:text-white text-xs sm:text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none resize-none leading-relaxed border-none"
                    autoFocus
                  />
                </div>
              </div>

              {/* Suggested Ideas Carousel */}
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 dark:text-gray-400 mb-2">
                  <Lightbulb size={13} className="text-amber-400" />
                  <span>Or click an idea to inspire:</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTED_IDEAS.map((idea, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setIntention(idea);
                        if (error) setError(null);
                      }}
                      className="text-left text-[11px] sm:text-xs px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-[#5a32fa]/10 hover:text-[#5a32fa] dark:hover:bg-[#5a32fa]/20 dark:hover:text-purple-200 text-gray-700 dark:text-gray-300 border border-gray-200/70 dark:border-white/5 transition-all active:scale-95 cursor-pointer shadow-2xs"
                    >
                      {idea}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tone / Goal Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">
                  Select Tone / Goal
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {TONE_OPTIONS.map((tone) => {
                    const isSelected = selectedTone === tone.label;
                    return (
                      <button
                        key={tone.id}
                        type="button"
                        onClick={() => setSelectedTone(tone.label)}
                        className={`flex items-center justify-between p-3 rounded-2xl text-left border transition-all cursor-pointer active:scale-98 ${
                          isSelected
                            ? 'border-[#5a32fa] bg-gradient-to-r from-[#5a32fa]/10 to-[#ff90e8]/10 dark:from-[#5a32fa]/20 dark:to-[#ff90e8]/20 text-[#5a32fa] dark:text-purple-200 font-bold shadow-xs ring-1 ring-[#5a32fa]/30'
                            : 'border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.03] hover:bg-gray-100 dark:hover:bg-white/[0.06] text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <div className="min-w-0 flex-1 pr-2">
                          <div className="text-xs font-bold truncate">{tone.label}</div>
                          <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">{tone.desc}</div>
                        </div>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-[#5a32fa] text-white flex items-center justify-center shrink-0 shadow-xs">
                            <Check size={12} strokeWidth={2.6} />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs font-semibold animate-in fade-in duration-150">
                  {error}
                </div>
              )}

            </div>

            {/* Bottom Action Footer */}
            <div className="px-5 sm:px-6 py-2.5 border-t border-gray-100 dark:border-white/10 bg-gray-50/70 dark:bg-white/[0.02] pb-[max(env(safe-area-inset-bottom),12px)] shrink-0 flex items-center justify-center">
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full max-w-sm inline-flex items-center justify-center gap-2 h-10 py-2 px-5 rounded-full bg-gradient-to-r from-[#5a32fa] via-purple-600 to-[#ff2a5f] hover:opacity-95 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-md shadow-[#5a32fa]/25 transition-all hover:scale-[1.01] active:scale-[0.98] cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <Loader2 size={15} className="animate-spin text-white" />
                    <span>Sally is drafting...</span>
                  </>
                ) : (
                  <>
                    <span>Generate now post</span>
                    <ArrowRight size={14} className="shrink-0" />
                  </>
                )}
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
