'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, X, User, RotateCcw, Shield } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { generateLexIQResponse } from '@/app/actions/lexiq';
import { PromptInput } from './ui/ai-chat-input';
import LoadingState from './ui/loading-state';
import { useAppStore } from '@/store/useAppStore';
import SiriWave from '@/components/ui/siri-wave';
import { useRouter } from 'next/navigation';

interface LexIQChatCardProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LexIQChatCard({ isOpen, onClose }: LexIQChatCardProps) {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const messages = useAppStore((state) => state.lexiqMessages);
  const setMessages = useAppStore((state) => state.setLexiqMessages);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-replace any legacy stored "LexIQ" greeting in user's localStorage
  useEffect(() => {
    if (messages.some(m => typeof m.content === 'string' && /LexIQ/i.test(m.content))) {
      const sanitized = messages.map(m => ({
        ...m,
        content: typeof m.content === 'string' ? m.content.replace(/LexIQ/gi, 'Sally 4.1 Pro') : m.content
      }));
      setMessages(sanitized);
    }
  }, [messages, setMessages]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleResetChat = () => {
    setMessages([{ role: 'ai', content: 'Hello! I am Sally 4.1 Pro, your IP assistant. How can I help you today?' }]);
  };

  const handleSend = async (val: string, meta: any) => {
    const text = val.trim();
    if (!text && (!meta.attachments || meta.attachments.length === 0)) return;
    
    // Add user message
    const newMessages = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setIsTyping(true);
    
    // Call Gemini API Server Action
    const res = await generateLexIQResponse(newMessages, meta.model);
    
    setIsTyping(false);
    
    if ('error' in res && res.error) {
      setMessages([...newMessages, { role: 'ai', content: res.error }]);
    } else if ('text' in res) {
      if (res.action?.action === 'navigate') {
        router.push(res.action.path);
      } else if (res.action?.action === 'compose_message') {
        const recipient = res.action.recipient || '';
        const content = res.action.content || '';

        useAppStore.getState().setPendingMessageDraft({ recipient, content });

        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('wipa:compose_message', {
            detail: { recipient, content }
          }));
        }

        const params = new URLSearchParams();
        if (recipient) params.set('recipient', recipient);
        if (content) params.set('draft', content);
        router.push(`/platform/messages?${params.toString()}`);
      }

      if (res.text) {
        setMessages([...newMessages, { role: 'ai', content: res.text }]);
      }
    }
  };

  return (
    <>
      {/* Backdrop overlay (mobile only - on desktop the main screen shrinks alongside Sally) */}
      <div 
        className={`fixed inset-0 z-[100] bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 md:hidden ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Docked Right Panel (Desktop & Mobile) */}
      <aside 
        role="dialog"
        aria-label="Sally 4.1 Pro AI Legal Assistant"
        aria-modal="true"
        aria-hidden={!isOpen}
        className={`fixed top-0 right-0 bottom-0 h-full w-full md:w-[460px] xl:w-[480px] max-w-[100vw] z-[101] shadow-2xl flex flex-col overflow-hidden transition-transform duration-300 ease-out border-l border-white/20 dark:border-white/10 ${
          isOpen ? 'translate-x-0 pointer-events-auto' : 'translate-x-full pointer-events-none'
        }`}
        style={{
          backgroundImage: "radial-gradient(125% 125% at 50% 101%, rgba(245,87,2,1) 10.5%, rgba(245,120,2,1) 16%, rgba(245,140,2,1) 17.5%, rgba(245,170,100,1) 25%, rgba(238,174,202,1) 40%, rgba(202,179,214,1) 65%, rgba(148,201,233,1) 100%)"
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-white/10 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-lg overflow-hidden p-1.5">
              <img src="/sally-logo.png" alt="Sally 4.1 Pro" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-white text-lg tracking-tight drop-shadow-md">
                  Sally 4.1 Pro
                </h3>
                <span className="text-[9px] uppercase tracking-widest bg-blue-500/30 border border-blue-400/40 px-2 py-0.5 rounded-full text-blue-100 shadow-xs backdrop-blur-sm flex items-center gap-1 font-extrabold">
                  <Shield size={10} /> LexisNexis® IP
                </span>
              </div>
              <p className="text-xs font-bold text-white/80 drop-shadow-sm">Deep Legal & Patent Intelligence</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              type="button"
              onClick={handleResetChat}
              title="New Chat"
              className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 transition-colors text-white cursor-pointer"
            >
              <RotateCcw size={14} />
            </button>
            <button 
              type="button"
              onClick={onClose}
              title="Close"
              className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 transition-colors text-white cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-transparent scrollbar-thin scrollbar-thumb-white/20">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex items-start gap-3 max-w-[90%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
              {msg.role === 'ai' ? (
                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shrink-0 mt-1 shadow-lg overflow-hidden p-1">
                  <img src="/sally-logo.png" alt="Sally" className="w-full h-full object-contain" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-black/20 backdrop-blur-md border border-black/10 flex items-center justify-center shrink-0 mt-1 shadow-lg">
                  <User size={14} className="text-white drop-shadow-md" />
                </div>
              )}
              <div className={`p-3.5 rounded-2xl text-[15px] leading-relaxed shadow-lg backdrop-blur-md border ${
                msg.role === 'user' 
                  ? 'bg-black/40 text-white border-white/10 rounded-tr-sm whitespace-pre-wrap' 
                  : 'bg-white/30 text-gray-900 border-white/40 rounded-tl-sm shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] font-medium'
              }`}>
                {msg.role === 'ai' ? (
                  <div className="prose prose-sm dark:prose-invert max-w-none text-gray-900 leading-relaxed [&>p]:mb-2 [&>p:last-child]:mb-0 [&>ul]:list-disc [&>ul]:pl-4 [&>ol]:list-decimal [&>ol]:pl-4 [&_strong]:font-black [&_strong]:text-gray-950 [&_blockquote]:border-l-4 [&_blockquote]:border-blue-600 [&_blockquote]:bg-white/40 [&_blockquote]:p-2.5 [&_blockquote]:rounded-r-xl [&_blockquote]:my-2">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  msg.content
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex items-start gap-3 max-w-[85%]">
              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shrink-0 mt-1 shadow-lg overflow-hidden p-1">
                <img src="/sally-logo.png" alt="Sally" className="w-full h-full object-contain animate-pulse" />
              </div>
              <div className="p-3.5 rounded-2xl bg-white/30 backdrop-blur-md border border-white/40 rounded-tl-sm shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] flex items-center">
                <LoadingState label="Sally 4.1 Pro is thinking..." variant="Dots" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="px-5 pb-6 pt-2 bg-transparent shrink-0">
          <PromptInput
            onSubmit={handleSend}
            placeholder="Ask Sally 4.1 Pro..."
            disabled={isTyping}
            models={[
              "Sally 4.1 Pro"
            ]}
          />
          <p className="text-[10px] text-white/50 text-center mt-2 font-medium tracking-wide">
            Verified in collaboration with LexisNexis® IP • For legal news and info Sally can make mistakes*
          </p>
        </div>
      </aside>
    </>
  );
}
