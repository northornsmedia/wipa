import React from 'react';
import { ArrowLeft, BadgeCheck, MoreHorizontal } from 'lucide-react';
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
  isOptionsOpen: boolean;
  onBlockUser: () => void;
  onClearChat: () => void;
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
  isOptionsOpen,
  onBlockUser,
  onClearChat
}) => {
  return (
    <header className="sticky top-0 left-0 right-0 z-30 px-4 sm:px-6 pt-[max(env(safe-area-inset-top,0px),1rem)] md:pt-3.5 pb-3.5 border-b border-gray-100 dark:border-white/10 flex items-center justify-between bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-xl shrink-0 select-none w-full max-w-full box-border">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {/* Mobile WhatsApp Back Arrow */}
        <button 
          onClick={onBackMobile}
          className="md:hidden w-9 h-9 flex items-center justify-center rounded-2xl bg-gray-100 dark:bg-white/10 hover:bg-[#5a32fa] hover:text-white text-gray-900 dark:text-white transition-colors active:scale-95 shrink-0"
          aria-label="Back to conversations list"
        >
          <ArrowLeft size={18} />
        </button>

        {/* Real Profile Avatar & Title - Clickable to Profile */}
        {participantId ? (
          <Link
            href={`/platform/profile/${participantId}`}
            prefetch={true}
            className="flex items-center gap-3 min-w-0 flex-1 hover:opacity-85 transition-opacity cursor-pointer group"
          >
            {/* Real Profile Avatar with Online Presence Dot */}
            <div className="relative shrink-0">
              {avatarUrl ? (
                <img 
                  src={avatarUrl} 
                  alt={name} 
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl object-cover shadow-sm border border-gray-200 dark:border-white/10 group-hover:scale-105 transition-transform" 
                  loading="eager"
                />
              ) : (
                <div 
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-sm shrink-0 group-hover:scale-105 transition-transform" 
                  style={{ backgroundColor: color }}
                >
                  {initial}
                </div>
              )}
              {isOnline && (
                <span 
                  className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-[#0f172a] rounded-full shadow-sm"
                  title="Online"
                />
              )}
            </div>

            {/* Title, Badge & Dynamic Presence Text */}
            <div className="min-w-0 flex-1">
              <h2 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white flex items-center gap-1.5 leading-tight truncate group-hover:text-[#5a32fa] dark:group-hover:text-[#ff90e8] transition-colors">
                <span className="truncate">{name}</span>
                <BadgeCheck size={16} className="text-[#5a32fa] shrink-0" />
              </h2>
              <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 leading-tight mt-0.5 truncate">
                {isTyping ? (
                  <span className="text-[#5a32fa] dark:text-[#ff90e8] font-bold flex items-center gap-1">
                    <span>typing</span>
                    <span className="flex items-center gap-0.5 mt-0.5">
                      <span className="w-1 h-1 rounded-full bg-[#5a32fa] dark:bg-[#ff90e8] animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-1 h-1 rounded-full bg-[#5a32fa] dark:bg-[#ff90e8] animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-1 h-1 rounded-full bg-[#5a32fa] dark:bg-[#ff90e8] animate-bounce" />
                    </span>
                  </span>
                ) : isOnline ? (
                  <span className="text-emerald-500 font-bold">
                    ● Online
                  </span>
                ) : (
                  <span>Offline • {role}</span>
                )}
              </p>
            </div>
          </Link>
        ) : (
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="relative shrink-0">
              {avatarUrl ? (
                <img 
                  src={avatarUrl} 
                  alt={name} 
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl object-cover shadow-sm border border-gray-200 dark:border-white/10" 
                  loading="eager"
                />
              ) : (
                <div 
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-sm shrink-0" 
                  style={{ backgroundColor: color }}
                >
                  {initial}
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white flex items-center gap-1.5 leading-tight truncate">
                <span className="truncate">{name}</span>
              </h2>
              <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 leading-tight mt-0.5 truncate">
                <span>{role}</span>
              </p>
            </div>
          </div>
        )}
      </div>
      
      {/* Action Controls */}
      <div className="flex items-center gap-2 relative">
        {participantId && (
          <Link 
            href={`/platform/profile/${participantId}`} 
            className="hidden sm:inline-flex items-center gap-1 px-3.5 py-1.5 border border-gray-200 dark:border-white/10 rounded-xl font-bold text-xs text-gray-700 dark:text-gray-200 hover:border-[#5a32fa] hover:text-[#5a32fa] transition-colors shadow-sm"
          >
            View Profile
          </Link>
        )}
        
        <button 
          onClick={onOptionsToggle}
          className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center border border-gray-200 dark:border-white/10 rounded-2xl text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors active:scale-95"
          aria-label="Chat options menu"
        >
          <MoreHorizontal size={18} />
        </button>
        
        {/* Chat Options Dropdown Menu */}
        {isOptionsOpen && (
          <div className="absolute top-12 right-0 w-48 bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-white/10 rounded-2xl shadow-xl py-1.5 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <button 
              onClick={onBlockUser}
              className="w-full text-left px-4 py-2.5 text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
            >
              Block User
            </button>
            <button 
              onClick={onClearChat}
              className="w-full text-left px-4 py-2.5 text-xs font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            >
              Clear Chat
            </button>
          </div>
        )}
      </div>
    </header>
  );
});

ChatHeader.displayName = 'ChatHeader';
