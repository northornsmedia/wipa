'use client';

import React from 'react';

interface FormattedPostTextProps {
  text: string;
  className?: string;
}

/**
 * Parses markdown bold (**text**), italics (*text*), hashtags (#tag), and URLs
 * into clean React elements so raw asterisks are never displayed.
 */
export default function FormattedPostText({ text, className = '' }: FormattedPostTextProps) {
  if (!text) return null;

  // Split by line to preserve paragraphs and line breaks
  const lines = text.split('\n');

  return (
    <span className={`inline-block w-full ${className}`}>
      {lines.map((line, lineIdx) => {
        return (
          <React.Fragment key={lineIdx}>
            {lineIdx > 0 && <br />}
            {parseLineSegments(line)}
          </React.Fragment>
        );
      })}
    </span>
  );
}

function parseLineSegments(line: string) {
  if (!line) return null;

  // Tokenize regex for **bold**, *italic*, URLs, and #hashtags
  const tokenRegex = /(\*\*[^*]+\*\*|\*[^*]+\*|https?:\/\/[^\s]+|#\w+)/g;
  const parts = line.split(tokenRegex);

  return parts.map((part, index) => {
    if (!part) return null;

    // Bold: **text**
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      const boldContent = part.slice(2, -2);
      return (
        <strong key={index} className="font-bold text-slate-900 dark:text-white">
          {boldContent}
        </strong>
      );
    }

    // Italic: *text*
    if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
      const italicContent = part.slice(1, -1);
      return (
        <em key={index} className="italic text-slate-800 dark:text-slate-200">
          {italicContent}
        </em>
      );
    }

    // URLs
    if (part.startsWith('http://') || part.startsWith('https://')) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="text-[#5a32fa] dark:text-[#a78bfa] hover:underline break-all"
        >
          {part}
        </a>
      );
    }

    // Hashtags: #tag
    if (part.startsWith('#') && part.length > 1) {
      return (
        <span
          key={index}
          className="font-medium text-[#5a32fa] dark:text-purple-400 hover:underline"
        >
          {part}
        </span>
      );
    }

    return <span key={index}>{part}</span>;
  });
}
