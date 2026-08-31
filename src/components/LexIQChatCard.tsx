'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, X, User, RotateCcw } from 'lucide-react';
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
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isOpen) return null;

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
    
    if (res.action?.action === 'navigate') {
      router.push(res.action.path);
    }

    if (res.error) {
      setMessages([...newMessages, { role: 'ai', content: res.error }]);
    } else if (res.text) {
      setMessages([...newMessages, { role: 'ai', content: res.text, reasoning_details: res.reasoning_details }]);
    }
  };

  return (
    <>
      {/* Backdrop overlay for mobile */}
      <div 
        className={`fixed inset-0 z-[100] pointer-events-none transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div 
          className={`absolute sm:fixed top-0 sm:top-auto sm:bottom-24 sm:right-6 w-full sm:w-[460px] h-full sm:h-[680px] sm:max-h-[85vh] sm:rounded-[32px] shadow-2xl border border-white/20 flex flex-col overflow-hidden pointer-events-auto transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] origin-bottom-right z-[100] ${
            isOpen 
              ? 'opacity-100 translate-y-0 scale-100' 
              : 'opacity-0 translate-y-10 scale-95 pointer-events-none'
          }`}
          style={{
            backgroundImage: "radial-gradient(125% 125% at 50% 101%, rgba(245,87,2,1) 10.5%, rgba(245,120,2,1) 16%, rgba(245,140,2,1) 17.5%, rgba(245,170,100,1) 25%, rgba(238,174,202,1) 40%, rgba(202,179,214,1) 65%, rgba(148,201,233,1) 100%)"
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-white/10 bg-white/10 backdrop-blur-md shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-lg overflow-hidden">
                <SiriWave variant="wave" size={32} />
              </div>
              <div>
                <h3 className="font-black text-white text-lg tracking-tight flex items-center gap-2 drop-shadow-md">
                  Sally 4.1 Pro
                  <span className="text-[9px] uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded-full text-white shadow-sm backdrop-blur-sm">Pro</span>
                </h3>
                <p className="text-xs font-bold text-white/80 drop-shadow-sm">Your AI Legal Assistant</p>
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
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shrink-0 mt-1 shadow-lg overflow-hidden">
                    <SiriWave variant="wave" size={26} />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-black/20 backdrop-blur-md border border-black/10 flex items-center justify-center shrink-0 mt-1 shadow-lg">
                    <User size={14} className="text-white drop-shadow-md" />
                  </div>
                )}
                <div className={`p-3.5 rounded-2xl text-[15px] leading-relaxed shadow-lg backdrop-blur-md border ${
                  msg.role === 'user' 
                    ? 'bg-black/40 text-white border-white/10 rounded-tr-sm' 
                    : 'bg-white/30 text-gray-900 border-white/40 rounded-tl-sm shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] font-medium'
                }`}>
                  {msg.role === 'ai' ? (
                    <>
                      {msg.reasoning_details && (
                        <details className="mb-2 border border-black/10 rounded-md bg-white/40 cursor-pointer text-xs">
                          <summary className="px-3 py-2 font-medium text-gray-600 select-none">
                            Thought Process
                          </summary>
                          <div className="px-3 pb-2 text-gray-700 border-t border-black/10 pt-2 whitespace-pre-wrap font-mono">
                            {typeof msg.reasoning_details === 'string' ? msg.reasoning_details : JSON.stringify(msg.reasoning_details, null, 2)}
                          </div>
                        </details>
                      )}
                      <div dangerouslySetInnerHTML={{ __html: msg.content }} />
                    </>
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex items-start gap-3 max-w-[85%]">
                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shrink-0 mt-1 shadow-lg overflow-hidden">
                  <SiriWave variant="wave" size={26} />
                </div>
                <div className="p-3.5 rounded-2xl bg-white/30 backdrop-blur-md border border-white/40 rounded-tl-sm shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] flex items-center">
                  <LoadingState label="Sally 4.1 Pro is thinking..." variant="Dots" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* New Input Area */}
          <div className="px-5 pb-6 pt-2 bg-transparent shrink-0">
            <PromptInput
              onSubmit={handleSend}
              placeholder="Ask Sally 4.1 Pro..."
              disabled={isTyping}
              models={["Sally 4.1 Pro", "Sally Gemini", "Sally Fast", "Sally Advanced", "Sally Beta"]}
            />
            <p className="text-[10px] text-white/50 text-center mt-2 font-medium tracking-wide">
              For legal news and information Sally 4.1 Pro can make mistakes*
            </p>
          </div>

        </div>
      </div>
    </>
  );
}
