import React, { useState, useRef, useEffect } from 'react';
import { FileText, MapPin, Play, Pause } from 'lucide-react';
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
    <div className="flex items-center gap-2.5 py-1 min-w-[200px] sm:min-w-[230px]">
      <audio
        ref={audioRef}
        src={audioUrl}
        preload="metadata"
        playsInline
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        className="hidden"
      />
      <button
        type="button"
        onClick={togglePlay}
        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-transform active:scale-90 shadow-sm ${
          isMe 
            ? 'bg-white text-[#5a32fa]' 
            : 'bg-[#5a32fa] text-white'
        }`}
      >
        {isPlaying ? <Pause size={14} className="fill-current" /> : <Play size={14} className="fill-current ml-0.5" />}
      </button>

      <div className="flex-1 flex flex-col justify-center min-w-0">
        {/* Animated Waveform Visualizer */}
        <div className="flex items-center gap-0.5 h-6 cursor-pointer" onClick={togglePlay}>
          {[40, 75, 55, 90, 60, 100, 45, 80, 65, 95, 50, 85, 70, 40, 90, 60].map((h, i) => {
            const barProgress = (i / 16) * 100;
            const isPlayed = progress >= barProgress;
            return (
              <span
                key={i}
                className={`flex-1 rounded-full transition-all duration-100 ${
                  isPlayed 
                    ? isMe ? 'bg-white' : 'bg-[#5a32fa]' 
                    : isMe ? 'bg-white/40' : 'bg-gray-300 dark:bg-white/20'
                }`}
                style={{ height: `${h}%` }}
              />
            );
          })}
        </div>

        <div className={`flex justify-between items-center text-[10px] font-mono mt-0.5 ${isMe ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
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
          <VoiceNotePlayer audioUrl={message.mediaUrl} isMe={isMe} />
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
