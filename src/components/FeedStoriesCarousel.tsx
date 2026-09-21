// @ts-nocheck
'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Plus, User } from 'lucide-react';
import Link from 'next/link';
import { useAppStore } from '@/store/useAppStore';

const SPOTLIGHT_STORIES = [
  {
    id: 1,
    name: 'Elena Rostova',
    role: 'Patent Partner',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    storyBg: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    badge: '⭐ WIPA Leader',
    path: '/platform/resources/articles-insights'
  },
  {
    id: 2,
    name: 'AI & Patent Law',
    role: 'Live Masterclass',
    avatar: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=400',
    storyBg: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=400',
    badge: '🔴 Live Webinar',
    path: '/platform/resources/webinars'
  },
  {
    id: 3,
    name: 'Sarah Jenkins',
    role: 'TechLaw Counsel',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400',
    storyBg: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400',
    badge: '🌟 Verified Member',
    path: '/platform/network'
  },
  {
    id: 4,
    name: 'Maria Garcia',
    role: 'Corporate Counsel',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    storyBg: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    badge: '🎓 Mentor',
    path: '/platform/mentorship'
  },
  {
    id: 5,
    name: 'Top 50 IP Firms',
    role: 'Global Rankings',
    avatar: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=400',
    storyBg: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=400',
    badge: '🏢 Top Firms',
    path: '/platform/resources/ip-firms'
  },
  {
    id: 6,
    name: 'IP Podcast #42',
    role: 'New Episode',
    avatar: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=400',
    storyBg: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=400',
    badge: '🎙️ Podcast',
    path: '/platform/resources/podcasts-conversations'
  }
];

export default function FeedStoriesCarousel({ onOpenCreatePost }: { onOpenCreatePost: () => void }) {
  const user = useAppStore((state) => state.user);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const isDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const hasMovedRef = useRef(false);
  const lastXRef = useRef(0);
  const lastTimeRef = useRef(0);
  const velXRef = useRef(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onMouseDown = (e: MouseEvent) => {
      // Primary mouse button only
      if (e.button !== 0) return;
      isDownRef.current = true;
      hasMovedRef.current = false;
      startXRef.current = e.pageX - el.offsetLeft;
      scrollLeftRef.current = el.scrollLeft;
      lastXRef.current = e.pageX;
      lastTimeRef.current = Date.now();
      velXRef.current = 0;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDownRef.current) return;
      const x = e.pageX - el.offsetLeft;
      const walk = x - startXRef.current;

      if (!hasMovedRef.current && Math.abs(walk) > 4) {
        hasMovedRef.current = true;
        setIsDragging(true);
      }

      if (hasMovedRef.current) {
        e.preventDefault();
        el.scrollLeft = scrollLeftRef.current - walk;

        const now = Date.now();
        const dt = now - lastTimeRef.current || 16;
        velXRef.current = (e.pageX - lastXRef.current) / dt;
        lastXRef.current = e.pageX;
        lastTimeRef.current = now;
      }
    };

    const onMouseUp = () => {
      if (!isDownRef.current) return;
      isDownRef.current = false;
      setIsDragging(false);

      if (hasMovedRef.current) {
        // Natural flick momentum on release
        if (Math.abs(velXRef.current) > 0.25) {
          const momentum = velXRef.current * 180;
          el.scrollBy({ left: -momentum, behavior: 'smooth' });
        }
        // Brief timeout prevents click event on release
        setTimeout(() => {
          hasMovedRef.current = false;
        }, 120);
      }
    };

    const onWheel = (e: WheelEvent) => {
      // Enable horizontal scrolling with vertical mouse wheel on desktop if carousel has room
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX) && Math.abs(e.deltaY) > 8) {
        const canScrollLeft = el.scrollLeft > 0;
        const canScrollRight = el.scrollLeft < el.scrollWidth - el.clientWidth - 2;
        if ((e.deltaY > 0 && canScrollRight) || (e.deltaY < 0 && canScrollLeft)) {
          e.preventDefault();
          el.scrollLeft += e.deltaY;
        }
      }
    };

    el.addEventListener('mousedown', onMouseDown);
    el.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      el.removeEventListener('mousedown', onMouseDown);
      el.removeEventListener('wheel', onWheel);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  const handleClickCapture = (e: React.MouseEvent) => {
    if (hasMovedRef.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <div className="w-full max-w-full min-w-0 bg-white dark:bg-[#0b0f19] py-1 sm:py-2 mb-3 box-border border-0 border-none">
      <div 
        ref={scrollRef}
        onClickCapture={handleClickCapture}
        onDragStart={(e) => e.preventDefault()}
        className={`flex items-center gap-2.5 sm:gap-3 overflow-x-auto pb-1 no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden w-full max-w-full min-w-0 box-border px-3.5 sm:px-4 md:cursor-grab ${
          isDragging ? 'md:cursor-grabbing md:select-none' : ''
        }`}
      >
        {/* Executive Spotlight & Feature Story Cards */}
        {SPOTLIGHT_STORIES.map((story) => (
          <Link
            key={story.id}
            href={story.path}
            draggable={false}
            className="w-[96px] h-[138px] sm:w-28 sm:h-38 md:w-36 md:h-28 rounded-2xl shrink-0 relative overflow-hidden group border border-slate-200/80 dark:border-white/10 shadow-xs hover:shadow-md transition-all active:scale-95 block select-none"
          >
            {/* Background Image */}
            <img
              src={story.storyBg || story.avatar}
              alt={story.name}
              draggable={false}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 select-none pointer-events-none"
            />
            
            {/* Mobile Top Floating Circle Avatar */}
            <div className="md:hidden absolute top-2 left-1/2 -translate-x-1/2 z-10">
              <img
                src={story.avatar}
                alt={story.name}
                draggable={false}
                className="w-9 h-9 rounded-full object-cover border-2 border-white dark:border-slate-800 shadow-sm select-none pointer-events-none"
              />
            </div>

            {/* Desktop Gradient & Badges */}
            <div className="hidden md:block absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />
            <div className="hidden md:flex absolute top-2 left-2 right-2 items-center justify-between z-10">
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-black/60 backdrop-blur-md text-white border border-white/20 truncate max-w-[110px]">
                {story.badge}
              </span>
            </div>
            <div className="hidden md:block absolute bottom-2 left-2.5 right-2.5 z-10">
              <h4 className="text-xs font-bold text-white leading-tight truncate">
                {story.name}
              </h4>
              <p className="text-[9.5px] text-gray-300 font-medium truncate">
                {story.role}
              </p>
            </div>
          </Link>
        ))}

      </div>
    </div>
  );
}
