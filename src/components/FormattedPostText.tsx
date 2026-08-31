'use client';

import React from 'react';

interface FormattedPostTextProps {
  text: string;
  className?: string;
}

/**
 * Truncates post content to the first paragraph / first complete thought ending with a full stop.
 * Returns the preview text and whether the post has additional content to read.
 */
export function getPostPreview(content: string = ''): { preview: string; hasMore: boolean } {
  if (!content) return { preview: '', hasMore: false };
  const raw = content.trim();

  // Check if content has multiple paragraphs (separated by newlines)
  const paragraphs = raw.split(/\r?\n/).filter(line => line.trim().length > 0);
  
  if (paragraphs.length > 1) {
    const firstParagraph = paragraphs[0].trim();
    // Ensure the first paragraph ends cleanly with a full stop / punctuation
    const endsWithPunctuation = /[.!?…:]$/.test(firstParagraph);
    const cleanFirstPara = endsWithPunctuation ? firstParagraph : `${firstParagraph}.`;
    return {
      preview: cleanFirstPara,
      hasMore: true
    };
  }

  // If it's a single paragraph, but long (> 200 characters)
  if (raw.length > 200) {
    // Look for sentence end (. ! ?) followed by space or end around 120-320 chars
    const sentenceMatch = raw.slice(120, 320).match(/([.!?])(\s+|$)/);
    if (sentenceMatch && sentenceMatch.index !== undefined) {
      const cutIndex = 120 + sentenceMatch.index + 1;
      return {
        preview: raw.slice(0, cutIndex).trim(),
        hasMore: true
      };
    }

    // Look for any earlier sentence end after 80 chars
    const anySentence = raw.slice(80).match(/([.!?])(\s+|$)/);
    if (anySentence && anySentence.index !== undefined && 80 + anySentence.index < 380) {
      const cutIndex = 80 + anySentence.index + 1;
      return {
        preview: raw.slice(0, cutIndex).trim(),
        hasMore: true
      };
    }

    // Fallback: word boundary around 200 chars with full stop
    const spaceCut = raw.lastIndexOf(' ', 200);
    const cut = spaceCut > 100 ? spaceCut : 200;
    return {
      preview: `${raw.slice(0, cut).trim()}.`,
      hasMore: true
    };
  }

  return { preview: raw, hasMore: false };
}

/**
 * Parses markdown bold (**text**), italics (*text*), hashtags (#tag), and URLs
 * into clean inline React elements so raw asterisks are never displayed and text wraps naturally.
 */
export default function FormattedPostText({ text, className = '' }: FormattedPostTextProps) {
  if (!text) return null;

  // Split by line to preserve paragraphs and line breaks
  const lines = text.split('\n');

  return (
    <span className={`inline ${className}`}>
      {lines.map((line, lineIdx) => {
        return (
          <React.Fragment key={lineIdx}>
            {lineIdx > 0 && <br className="my-1 block content-['']" />}
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
