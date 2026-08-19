import React from 'react';
import { Search } from 'lucide-react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export interface SidebarChat {
  id: string;
  name: string;
  role: string;
  avatarUrl?: string | null;
  initial: string;
  color: string;
  unread: number;
  lastMessage: string;
  lastTime: string;
  rawTimestamp?: number;
  isOnline?: boolean;
  isTyping?: boolean;
}

interface ChatSidebarProps {
  conversations: SidebarChat[];
  activeChatId: string | null;
  onSelectChat: (id: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  chatFilter: 'all' | 'unread' | 'direct' | 'groups';
  onFilterChange: (f: 'all' | 'unread' | 'direct' | 'groups') => void;
  showMobileChat: boolean;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = React.memo(({
  conversations,
  activeChatId,
  onSelectChat,
  searchQuery,
  onSearchChange,
  chatFilter,
  onFilterChange,
  showMobileChat
}) => {
  const filteredConversations = conversations.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (chatFilter === 'unread') return c.unread > 0;
    if (chatFilter === 'groups') return c.role?.toLowerCase().includes('group') || c.name?.toLowerCase().includes('group');
    if (chatFilter === 'direct') return !c.role?.toLowerCase().includes('group') && !c.name?.toLowerCase().includes('group');
    return true;
  });

  return (
    <div className={`w-full md:w-[350px] lg:w-[400px] bg-white dark:bg-[#0f172a] md:rounded-3xl border-0 md:border border-gray-200 dark:border-white/10 md:shadow-xl flex-col overflow-hidden shrink-0 h-full min-h-0 ${showMobileChat ? 'hidden md:flex' : 'flex'}`}>
      
      {/* Top Bar with Back Button to Platform */}
      <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-white/10 space-y-3">
        <div className="relative flex items-center justify-between h-10">
          <Link 
            href="/platform" 
            className="flex items-center justify-center w-9 h-9 rounded-2xl bg-gray-100 dark:bg-white/10 hover:bg-[#5a32fa] hover:text-white text-gray-700 dark:text-gray-200 transition-all duration-200 shadow-sm active:scale-90 z-10 shrink-0"
            title="Back to Feed"
          >
            <ArrowLeft size={18} />
          </Link>
          
          <h2 className="absolute inset-0 flex items-center justify-center text-lg sm:text-xl font-black text-gray-900 dark:text-white tracking-tight pointer-events-none">
            Messages
          </h2>

          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#5a32fa]/10 text-[#5a32fa] dark:text-[#9b7aff] z-10 shrink-0">
            {conversations.length} Active
          </span>
        </div>

        <div className="relative">
          <input 
            type="text" 
            placeholder="Search messages & contacts..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-2xl border border-gray-200 dark:border-white/10 focus:outline-none focus:border-[#5a32fa] font-medium text-xs transition-colors bg-gray-50/70 dark:bg-white/5 text-gray-900 dark:text-white placeholder:text-gray-400"
          />
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>

        {/* Quick Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
          {[
            { id: 'all', label: 'All' },
            { id: 'unread', label: 'Unread', count: conversations.filter(c => c.unread > 0).length },
            { id: 'direct', label: 'Direct' },
            { id: 'groups', label: 'Groups' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => onFilterChange(tab.id as any)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all whitespace-nowrap active:scale-95 flex items-center gap-1.5 ${
                chatFilter === tab.id
                  ? 'bg-[#5a32fa] text-white shadow-sm'
                  : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && tab.count > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${chatFilter === tab.id ? 'bg-white/20 text-white' : 'bg-[#5a32fa] text-white'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto no-scrollbar divide-y divide-gray-50 dark:divide-white/5">
        {filteredConversations.map(chat => (
          <div 
            key={chat.id}
            onClick={() => onSelectChat(String(chat.id))}
            className={`flex items-center gap-3.5 p-4 cursor-pointer transition-all duration-200 ${
              String(activeChatId) === String(chat.id) 
                ? 'md:bg-[#5a32fa]/10 md:dark:bg-[#5a32fa]/15 md:border-l-4 md:border-[#5a32fa] bg-transparent hover:bg-gray-50 dark:hover:bg-white/5' 
                : 'hover:bg-gray-50 dark:hover:bg-white/5'
            }`}
          >
            <div className="relative shrink-0">
              {chat.avatarUrl ? (
                <img 
                  src={chat.avatarUrl} 
                  alt={chat.name} 
                  className="w-12 h-12 rounded-2xl object-cover shadow-sm border border-gray-200 dark:border-white/10"
                />
              ) : (
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-base shadow-sm" style={{ backgroundColor: chat.color }}>
                  {chat.initial}
                </div>
              )}
              {chat.isOnline && (
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-[#0f172a] rounded-full"></span>
              )}
              {chat.unread > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 border-2 border-white dark:border-[#0f172a] rounded-full animate-pulse"></span>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-1">
                <h3 className={`font-bold text-sm truncate ${chat.unread > 0 ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-200'}`}>
                  {chat.name}
                </h3>
                <span className={`text-[11px] whitespace-nowrap ml-2 font-mono ${chat.unread > 0 ? 'font-bold text-[#5a32fa]' : 'text-gray-400'}`}>
                  {chat.lastTime}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <p className={`text-xs truncate pr-2 ${chat.unread > 0 ? 'font-bold text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                  {chat.isTyping ? <span className="text-[#5a32fa] font-bold animate-pulse">typing...</span> : chat.lastMessage}
                </p>
                {chat.unread > 0 && (
                  <span className="bg-[#5a32fa] text-white text-[10px] font-black px-2 py-0.5 rounded-full min-w-[18px] text-center flex items-center justify-center shrink-0">
                    {chat.unread}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
        {filteredConversations.length === 0 && (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400 font-medium text-xs">
            No conversations found.
          </div>
        )}
      </div>
    </div>
  );
});

ChatSidebar.displayName = 'ChatSidebar';
