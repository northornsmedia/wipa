'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, BadgeCheck, MoreHorizontal, Search, ShieldCheck, X } from 'lucide-react';
import Link from 'next/link';

interface ChatHeaderProps {
  name: string;
  role: string;
  avatarUrl?: string | null;
  initial: string;
  color: string;
  isOnline?: boolean;
  isTyping?: boolean;
  participantId?: string;
  onBackMobile: () => void;
  onOptionsToggle: () => void;
  onCloseOptions?: () => void;
  isOptionsOpen: boolean;
  onBlockUser: () => void;
  onClearChat: () => void;
  inChatSearchQuery?: string;
  onInChatSearchChange?: (q: string) => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = React.memo(({
  name,
  role,
  avatarUrl,
  initial,
  color,
  isOnline = false,
  isTyping = false,
  participantId,
  onBackMobile,
  onOptionsToggle,
  onCloseOptions,
  isOptionsOpen,
  onBlockUser,
  onClearChat,
  inChatSearchQuery = '',
  onInChatSearchChange
}) => {
  const [showSearchInput, setShowSearchInput] = useState(false);
  const optionsRef = useRef<HTMLDivElement>(null);

  // Close options menu when clicking outside
  useEffect(() => {
    if (!isOptionsOpen) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target as Node)) {
        if (onCloseOptions) {
          onCloseOptions();
        } else {
          onOptionsToggle();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOptionsOpen, onOptionsToggle, onCloseOptions]);

  return (
    <header className="sticky top-0 left-0 right-0 z-30 px-4 sm:px-6 pt-safe pb-3 border-b border-gray-100 dark:border-white/10 flex items-center justify-between bg-white/90 dark:bg-black/95 md:dark:bg-[#0f172a]/90 backdrop-blur-xl shrink-0 select-none w-full max-w-full box-border shadow-xs">
      
      {showSearchInput ? (
        /* In-Chat Search Bar Mode */
        <div className="flex items-center gap-2 w-full animate-in fade-in duration-150">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={inChatSearchQuery}
              onChange={(e) => onInChatSearchChange?.(e.target.value)}
              placeholder="Search in this conversation..."
              autoFocus
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-gray-100 dark:bg-white/10 text-xs font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5a32fa]"
            />
          </div>
          <button
            onClick={() => {
              setShowSearchInput(false);
              onInChatSearchChange?.('');
            }}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-white"
          >
            <X size={18} />
          </button>
        </div>
      ) : (
        /* Standard Header Mode */
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {/* Mobile Back Arrow */}
          <button 
            onClick={onBackMobile}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-white/10 hover:bg-[#5a32fa] hover:text-white text-gray-900 dark:text-white transition-colors active:scale-95 shrink-0"
            aria-label="Back to conversations list"
          >
            <ArrowLeft size={18} />
          </button>

          {/* Profile Identity */}
          {participantId ? (
            <Link
              href={participantId === 'sally-ip' ? '/platform/sallyip' : `/platform/profile/${participantId}`}
              prefetch={true}
              className="flex items-center gap-3 min-w-0 flex-1 hover:opacity-85 transition-opacity cursor-pointer group"
            >
              {/* Profile Avatar */}
              <div className="relative shrink-0">
                {avatarUrl ? (
                  <img 
                    src={avatarUrl} 
                    alt={name} 
                    className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full shadow-sm border border-gray-200 dark:border-white/10 group-hover:scale-105 transition-transform ${
                      avatarUrl.includes('sally')
                        ? 'object-contain p-2 bg-purple-100 dark:bg-purple-950/60 dark:invert'
                        : 'object-cover'
                    }`} 
                    loading="eager"
                  />
                ) : (
                  <div 
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-white font-black text-sm shadow-sm shrink-0 group-hover:scale-105 transition-transform" 
                    style={{ backgroundColor: color }}
                  >
                    {initial}
                  </div>
                )}
              </div>

              {/* Name & Verified Badge Only */}
              <div className="min-w-0 flex-1 flex items-center">
                <h2 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white flex items-center gap-1.5 leading-tight truncate group-hover:text-[#5a32fa] dark:group-hover:text-[#ff90e8] transition-colors">
                  <span className="truncate">{name}</span>
                  <BadgeCheck size={16} className="text-[#5a32fa] shrink-0 fill-[#5a32fa]/10" />
                </h2>
              </div>
            </Link>
          ) : (
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="relative shrink-0">
                {avatarUrl ? (
                  <img 
                    src={avatarUrl} 
                    alt={name} 
                    className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full shadow-sm border border-gray-200 dark:border-white/10 ${
                      avatarUrl.includes('sally')
                        ? 'object-contain p-2 bg-purple-100 dark:bg-purple-950/60 dark:invert'
                        : 'object-cover'
                    }`} 
                    loading="eager"
                  />
                ) : (
                  <div 
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-white font-black text-sm shadow-sm shrink-0" 
                    style={{ backgroundColor: color }}
                  >
                    {initial}
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1 flex flex-col justify-center">
                <h2 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white flex items-center gap-1.5 leading-tight truncate">
                  <span className="truncate">{name}</span>
                </h2>
                {role && (
                  <span className="text-[11px] text-gray-500 dark:text-gray-400 font-medium truncate">
                    {role}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Right Controls */}
      {!showSearchInput && (
        <div className="flex items-center gap-1.5 sm:gap-2 relative shrink-0">
          {/* In-Chat Search Icon Button */}
          <button
            type="button"
            onClick={() => setShowSearchInput(true)}
            className="w-9 h-9 flex items-center justify-center border border-gray-200 dark:border-white/10 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            title="Search in chat"
          >
            <Search size={16} />
          </button>

          {participantId && (
            <Link 
              href={`/platform/profile/${participantId}`} 
              className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 border border-gray-200 dark:border-white/10 rounded-xl font-bold text-xs text-gray-700 dark:text-gray-200 hover:border-[#5a32fa] hover:text-[#5a32fa] transition-colors shadow-xs"
            >
              View Profile
            </Link>
          )}
          
          {/* Options Button & Dropdown */}
          <div className="relative" ref={optionsRef}>
            <button 
              type="button"
              onClick={onOptionsToggle}
              className="w-9 h-9 flex items-center justify-center border border-gray-200 dark:border-white/10 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors active:scale-95 cursor-pointer"
              aria-label="Chat options menu"
            >
              <MoreHorizontal size={17} />
            </button>
            
            {/* Chat Options Dropdown Menu */}
            {isOptionsOpen && (
              <div className="absolute top-11 right-0 w-48 bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-white/10 rounded-2xl shadow-xl py-1.5 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                <button 
                  type="button"
                  onClick={onBlockUser}
                  className="w-full text-left px-4 py-2.5 text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors cursor-pointer"
                >
                  Block User
                </button>
                <button 
                  type="button"
                  onClick={onClearChat}
                  className="w-full text-left px-4 py-2.5 text-xs font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
                >
                  Clear Chat
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
});

ChatHeader.displayName = 'ChatHeader';
