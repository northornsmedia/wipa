import React from 'react';
import { FileText, MapPin, Play } from 'lucide-react';
import { MessageStatusTick, MessageStatus } from './MessageStatusTick';

export type MediaType = 'text' | 'image' | 'video' | 'document' | 'location' | 'audio';

export interface ChatMessage {
  id: string;
  conversation_id?: string;
  text?: string;
  sender: 'me' | 'them';
  sender_id?: string;
  time: string;
  created_at?: string;
  type?: MediaType;
  mediaUrl?: string;
  mediaName?: string;
  status?: MessageStatus;
  is_read?: boolean;
  delivered_at?: string | null;
  read_at?: string | null;
  temp_id?: string;
  error?: string;
}

interface MessageBubbleProps {
  message: ChatMessage;
  onRetry?: (msg: ChatMessage) => void;
  onImageClick?: (url: string) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = React.memo(({
  message,
  onRetry,
  onImageClick
}) => {
  const isMe = message.sender === 'me';

  return (
    <div 
      className={`flex flex-col max-w-[85%] sm:max-w-[70%] transition-all duration-150 ${
        isMe ? 'self-end items-end ml-auto' : 'self-start items-start mr-auto'
      }`}
    >
      {/* Message Bubble Body */}
      <div 
        className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed shadow-sm transition-all break-words ${
          isMe 
            ? 'bg-gradient-to-r from-[#5a32fa] to-[#6e46ff] text-white rounded-tr-none shadow-[#5a32fa]/10' 
            : 'bg-white dark:bg-[#131b2e] text-gray-900 dark:text-white border border-gray-200/70 dark:border-white/10 rounded-tl-none'
        }`}
      >
        {/* 1. Image Attachment */}
        {message.type === 'image' && message.mediaUrl && (
          <div 
            onClick={() => onImageClick?.(message.mediaUrl!)}
            className="rounded-xl overflow-hidden border border-white/10 mb-2 max-h-64 aspect-video bg-black/10 cursor-pointer hover:opacity-95 transition-opacity"
          >
            <img 
              src={message.mediaUrl} 
              alt={message.text || 'Image Attachment'} 
              className="w-full h-full object-cover" 
              loading="lazy"
            />
          </div>
        )}

        {/* 2. Video Attachment */}
        {message.type === 'video' && message.mediaUrl && (
          <div className="rounded-xl overflow-hidden border border-white/10 mb-2 max-h-64 aspect-video bg-black">
            <video 
              src={message.mediaUrl} 
              controls 
              playsInline 
              preload="metadata"
              className="w-full h-full object-contain" 
            />
          </div>
        )}

        {/* 3. Document Attachment */}
        {message.type === 'document' && (
          <a
            href={message.mediaUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-black/20 dark:bg-white/10 hover:bg-black/30 p-2.5 rounded-xl border border-white/10 mb-1 transition-colors"
          >
            <FileText size={22} className="text-amber-400 shrink-0" />
            <div className="min-w-0">
              <span className="font-bold text-xs truncate block max-w-[180px] sm:max-w-[220px]">
                {message.text || message.mediaName || 'Document.pdf'}
              </span>
              <span className="text-[10px] opacity-75">Click to view document</span>
            </div>
          </a>
        )}

        {/* 4. Shared Location */}
        {message.type === 'location' && message.mediaUrl && (
          <div className="flex flex-col gap-1 mb-1">
            <div className="flex items-center gap-1.5 font-bold text-xs">
              <MapPin size={14} className="text-rose-400 shrink-0" />
              <span>Shared Location</span>
            </div>
            <a 
              href={message.mediaUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-xs underline font-medium hover:opacity-80 transition-opacity block truncate max-w-[220px]"
            >
              {message.text || 'Open Google Maps'}
            </a>
          </div>
        )}

        {/* 5. Voice Note Audio */}
        {message.type === 'audio' && message.mediaUrl && (
          <div className="mb-1 w-full min-w-[200px] max-w-[260px] py-1">
            <audio src={message.mediaUrl} controls className="w-full h-8" preload="metadata" />
          </div>
        )}

        {/* 6. Standard Text Message */}
        {(!message.type || message.type === 'text') && (
          <span className="whitespace-pre-wrap select-text leading-relaxed">
            {message.text}
          </span>
        )}
      </div>

      {/* Timestamp & WhatsApp Status Ticks */}
      <MessageStatusTick 
        status={message.status}
        time={message.time}
        isMe={isMe}
        onRetry={onRetry ? () => onRetry(message) : undefined}
      />
    </div>
  );
});

MessageBubble.displayName = 'MessageBubble';
