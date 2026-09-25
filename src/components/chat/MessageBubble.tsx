'use client';

import React, { useState, useRef } from 'react';
import { FileText, MapPin, Play, Pause, Copy, Check, Smile } from 'lucide-react';
import { MessageStatusTick, MessageStatus } from './MessageStatusTick';

export type MediaType = 'text' | 'image' | 'video' | 'document' | 'location' | 'audio';

export interface ChatMessage {
  id: string;
  conversation_id?: string;
  text?: string;
  sender: 'me' | 'them';
  sender_id?: string;
  sender_name?: string;
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
  reaction?: string;
}

function VoiceNotePlayer({ audioUrl, isMe }: { audioUrl: string; isMe: boolean }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch(err => {
            console.warn("Audio playback interrupted or failed:", err);
            setIsPlaying(false);
          });
      }
    }
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isFinite(audio.duration) && audio.duration > 0) {
      setCurrentTime(audio.currentTime);
      setProgress(Math.min(100, Math.max(0, (audio.currentTime / audio.duration) * 100)));
      if (!isFinite(duration) || duration <= 0) {
        setDuration(audio.duration);
      }
    } else if (isFinite(audio.currentTime)) {
      setCurrentTime(audio.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isFinite(audio.duration) && !isNaN(audio.duration) && audio.duration > 0) {
      setDuration(audio.duration);
    } else {
      audio.currentTime = 1e6;
      const onEndCheck = () => {
        audio.removeEventListener('timeupdate', onEndCheck);
        audio.currentTime = 0;
        if (isFinite(audio.duration) && !isNaN(audio.duration) && audio.duration > 0) {
          setDuration(audio.duration);
        }
      };
      audio.addEventListener('timeupdate', onEndCheck);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);
  };

  const formatTime = (secs: number) => {
    if (!isFinite(secs) || isNaN(secs) || secs <= 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="flex items-center gap-3 py-1 min-w-[210px] sm:min-w-[240px]">
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        preload="metadata"
      />
      <button
        type="button"
        onClick={togglePlay}
        className={`w-9 h-9 flex items-center justify-center rounded-full shadow-md shrink-0 transition-transform active:scale-95 ${
          isMe 
            ? 'bg-white text-[#5a32fa] hover:bg-white/90' 
            : 'bg-[#5a32fa] text-white hover:bg-[#6c47ff]'
        }`}
        aria-label={isPlaying ? "Pause voice note" : "Play voice note"}
      >
        {isPlaying ? <Pause size={16} className="fill-current" /> : <Play size={16} className="fill-current ml-0.5" />}
      </button>

      {/* Visualizer Waveform Bar */}
      <div className="flex-1 flex flex-col gap-1">
        <div className="flex items-center gap-[2.5px] h-6 cursor-pointer" onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const clickX = e.clientX - rect.left;
          const percentage = Math.max(0, Math.min(1, clickX / rect.width));
          if (audioRef.current && isFinite(audioRef.current.duration)) {
            audioRef.current.currentTime = percentage * audioRef.current.duration;
          }
        }}>
          {[40, 70, 30, 90, 60, 100, 45, 80, 55, 95, 35, 75, 50, 85, 65, 40, 70, 30, 85].map((h, i) => {
            const barProgress = (i / 19) * 100;
            const isFilled = progress >= barProgress;
            return (
              <span
                key={i}
                style={{ height: `${h}%` }}
                className={`w-[3px] rounded-full transition-all duration-100 ${
                  isMe
                    ? (isFilled ? 'bg-white' : 'bg-white/40')
                    : (isFilled ? 'bg-[#5a32fa]' : 'bg-gray-300 dark:bg-white/20')
                } ${isPlaying && isFilled ? 'scale-y-110' : ''}`}
              />
            );
          })}
        </div>
        <div className={`flex justify-between text-[10px] font-mono ${isMe ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
}

interface MessageBubbleProps {
  message: ChatMessage;
  onRetry?: (message: ChatMessage) => void;
  onImageClick?: (url: string) => void;
  onReaction?: (messageId: string, emoji: string) => void;
}

const QUICK_EMOJIS = ['❤️', '🔥', '👍', '😂', '👏'];

export const MessageBubble: React.FC<MessageBubbleProps> = React.memo(({
  message,
  onRetry,
  onImageClick,
  onReaction
}) => {
  const isMe = message.sender === 'me';
  const [copied, setCopied] = useState(false);
  const [localReaction, setLocalReaction] = useState<string | null>(message.reaction || null);
  const [showReactions, setShowReactions] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (message.text) {
      navigator.clipboard.writeText(message.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSelectReaction = (emoji: string) => {
    const next = localReaction === emoji ? null : emoji;
    setLocalReaction(next);
    setShowReactions(false);
    if (onReaction) onReaction(message.id, next || '');
  };

  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const renderLinkedText = (text: string) => text.split(urlRegex).map((part, index) =>
    urlRegex.test(part) ? (
      <a
        key={index}
        href={part}
        target={part.includes('/platform/post/') ? '_self' : '_blank'}
        rel={part.includes('/platform/post/') ? undefined : 'noopener noreferrer'}
        className={`break-all underline underline-offset-2 hover:opacity-80 font-bold ${
          isMe ? 'text-white' : 'text-[#5a32fa] dark:text-[#a080ff]'
        }`}
      >
        {part}
      </a>
    ) : <React.Fragment key={index}>{part}</React.Fragment>
  );

  return (
    <div 
      className={`group relative flex flex-col max-w-[85%] sm:max-w-[72%] transition-all duration-150 ${
        isMe 
          ? 'self-end items-end ml-auto animate-message-fly-in-me origin-bottom-right' 
          : 'self-start items-start mr-auto animate-message-fly-in-them origin-bottom-left'
      }`}
      onMouseLeave={() => setShowReactions(false)}
    >
      {/* Floating Hover Reaction Bar */}
      <div 
        className={`absolute -top-9 z-20 hidden group-hover:flex items-center gap-1 bg-white dark:bg-[#1a2333] border border-gray-200 dark:border-white/10 shadow-lg rounded-full px-2 py-1 transition-all duration-150 animate-in fade-in zoom-in-95 ${
          isMe ? 'right-0' : 'left-0'
        }`}
      >
        {QUICK_EMOJIS.map(emoji => (
          <button
            key={emoji}
            type="button"
            onClick={() => handleSelectReaction(emoji)}
            className="hover:scale-130 active:scale-95 transition-transform text-sm p-0.5"
            title={`React with ${emoji}`}
          >
            {emoji}
          </button>
        ))}

        {message.text && (
          <button
            type="button"
            onClick={handleCopy}
            className="p-1 text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors ml-1"
            title="Copy message"
          >
            {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
          </button>
        )}
      </div>

      {/* Sender Name for group chats */}
      {!isMe && message.sender_name && (
        <span className="text-[11px] font-bold text-[#5a32fa] dark:text-[#a080ff] mb-1 px-1.5 select-none">
          {message.sender_name}
        </span>
      )}

      {/* Message Bubble Body */}
      <div 
        className={`relative px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed shadow-sm transition-all break-words ${
          isMe 
            ? 'bg-gradient-to-tr from-[#5a32fa] via-[#653bfb] to-[#7952ff] text-white rounded-tr-xs shadow-[#5a32fa]/15' 
            : 'bg-white dark:bg-[#151c2c] text-gray-900 dark:text-gray-100 border border-gray-200/80 dark:border-white/10 rounded-tl-xs shadow-sm'
        }`}
      >
        {/* 1. Image Attachment */}
        {message.type === 'image' && message.mediaUrl && (
          <div 
            onClick={() => onImageClick?.(message.mediaUrl!)}
            className="rounded-xl overflow-hidden border border-white/10 mb-2 max-h-72 aspect-video bg-black/10 cursor-pointer hover:opacity-95 transition-opacity"
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
          <div className="rounded-xl overflow-hidden border border-white/10 mb-2 max-h-72 aspect-video bg-black">
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
            className="flex items-center gap-3 bg-black/15 dark:bg-white/10 hover:bg-black/25 p-2.5 rounded-xl border border-white/10 mb-1 transition-colors"
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
          <VoiceNotePlayer audioUrl={message.mediaUrl} isMe={isMe} />
        )}

        {/* 6. Standard Text Message */}
        {(!message.type || message.type === 'text') && (
          <span className="whitespace-pre-wrap select-text leading-relaxed font-normal">
            {renderLinkedText(message.text || '')}
          </span>
        )}

        {/* Reaction Pill Badge */}
        {localReaction && (
          <span 
            onClick={() => handleSelectReaction(localReaction)}
            className="absolute -bottom-2.5 right-2 bg-white dark:bg-[#1a2333] border border-gray-200 dark:border-white/10 rounded-full px-1.5 py-0.5 text-xs shadow-md cursor-pointer hover:scale-110 active:scale-95 transition-transform"
          >
            {localReaction}
          </span>
        )}
      </div>

      {/* Timestamp & Status Ticks */}
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
