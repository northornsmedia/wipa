import React from 'react';
import { Check, CheckCheck, Clock, AlertCircle } from 'lucide-react';

export type MessageStatus = 'queued' | 'sending' | 'sent' | 'delivered' | 'read' | 'failed';

interface MessageStatusTickProps {
  status?: MessageStatus;
  time: string;
  isMe: boolean;
  onRetry?: () => void;
}

export const MessageStatusTick: React.FC<MessageStatusTickProps> = React.memo(({
  status = 'sent',
  time,
  isMe,
  onRetry
}) => {
  return (
    <div className="flex items-center gap-1 mt-0.5 px-0.5 select-none shrink-0 whitespace-nowrap">
      <span className="text-[10px] font-mono text-gray-400 dark:text-gray-400">
        {time}
      </span>

      {isMe && (
        <span className="inline-flex items-center ml-0.5">
          {/* 🕒 Queued / Sending: Clock icon */}
          {(status === 'queued' || status === 'sending') && (
            <span title={status === 'queued' ? 'Queued offline' : 'Sending...'}>
              <Clock size={12} className="text-gray-400 animate-spin" />
            </span>
          )}

          {/* 🩶 Sent: 1 Single Grey Tick (Saved in DB, recipient is offline) */}
          {status === 'sent' && (
            <span title="Sent to server">
              <Check size={14} className="text-gray-400 dark:text-gray-400" />
            </span>
          )}

          {/* 🩶🩶 Delivered: 2 Double Grey Ticks (Recipient is online/delivered) */}
          {status === 'delivered' && (
            <span title="Delivered to recipient">
              <CheckCheck size={14} className="text-gray-400 dark:text-gray-400" />
            </span>
          )}

          {/* 💜💜 Read / Seen: 2 Double Purple Ticks */}
          {status === 'read' && (
            <span title="Seen by recipient">
              <CheckCheck size={14} className="text-[#5a32fa] dark:text-[#a855f7] font-black" />
            </span>
          )}

          {/* 🔴 Failed / Dropped: Red Alert + Retry Button */}
          {status === 'failed' && onRetry && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRetry();
              }}
              className="flex items-center gap-1 text-[10px] font-bold text-rose-500 hover:text-rose-600 bg-rose-500/10 hover:bg-rose-500/20 px-1.5 py-0.5 rounded-full transition-colors ml-1 active:scale-95"
              title="Click to retry sending"
            >
              <AlertCircle size={11} />
              <span>Failed · tap to retry</span>
            </button>
          )}
        </span>
      )}
    </div>
  );
});

MessageStatusTick.displayName = 'MessageStatusTick';
