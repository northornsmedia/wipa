'use client';

import React, { useState } from 'react';
import { Sparkles, X, Send, Wand2, Lightbulb, Check, ArrowRight } from 'lucide-react';
import { DotmCircular7 as Loader2 } from '@/components/ui/dotm-circular-7';

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

  if (!isOpen) return null;

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
        onClose();
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
    <div 
      className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-[560px] bg-white dark:bg-[#0f172a] rounded-3xl shadow-2xl border border-slate-200/80 dark:border-white/10 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100 dark:border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#5a32fa]/10 text-[#5a32fa] dark:text-purple-300 flex items-center justify-center border border-[#5a32fa]/20">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                AI Post Assistant
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Powered by specialized IP Legal AI
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto no-scrollbar">
          
          {/* Main prompt input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              What would you like to share or discuss?
            </label>
            <textarea
              value={intention}
              onChange={(e) => {
                setIntention(e.target.value);
                if (error) setError(null);
              }}
              rows={3}
              placeholder="e.g. We won our appeal in the Unified Patent Court today on FRAND licensing terms, or I'd like to share advice on patent classification..."
              className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#5a32fa]/50 focus:border-transparent transition-all"
              autoFocus
            />
          </div>

          {/* Suggested Idea Chips */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">
              <Lightbulb size={13} className="text-amber-500" />
              <span>Or click an idea to get started:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTED_IDEAS.map((idea, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIntention(idea)}
                  className="text-left text-xs px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-[#5a32fa]/10 hover:text-[#5a32fa] dark:hover:text-purple-300 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-white/5 transition-all"
                >
                  {idea}
                </button>
              ))}
            </div>
          </div>

          {/* Tone Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
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
                    className={`flex items-center justify-between p-3 rounded-2xl text-left border transition-all ${
                      isSelected
                        ? 'border-[#5a32fa] bg-[#5a32fa]/10 dark:bg-[#5a32fa]/20 text-[#5a32fa] dark:text-purple-200 font-bold shadow-xs'
                        : 'border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold">{tone.label}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{tone.desc}</div>
                    </div>
                    {isSelected && <Check size={14} className="text-[#5a32fa] shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs font-semibold">
              {error}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#5a32fa] hover:bg-[#4a24de] disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            {isGenerating ? (
              <>
                <Loader2 size={15} className="animate-spin text-white" />
                <span>Generating with AI...</span>
              </>
            ) : (
              <>
                <Sparkles size={15} />
                <span>Generate Post</span>
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
