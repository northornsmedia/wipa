'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, CalendarDays, Clock3, Headphones, Mic2, Music2,
  Pause, Play, RotateCcw, Share2, SkipBack, SkipForward, Users,
} from 'lucide-react';
import { DotmCircular7 } from '@/components/ui/dotm-circular-7';
import { supabase } from '@/lib/supabase';

const formatClock = (seconds: number) => {
  if (!Number.isFinite(seconds)) return '0:00';
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${Math.floor(seconds % 60).toString().padStart(2, '0')}`;
};

export default function PodcastDetailPage() {
  const { id } = useParams<{ id: string }>();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [episode, setEpisode] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) return;
    let active = true;

    const fetchEpisode = async () => {
      setLoading(true);
      setLoadError(null);
      const { data, error } = await supabase.from('podcasts').select('*').eq('id', id).maybeSingle();

      if (!active) return;
      if (error) {
        setLoadError(error.message);
        setLoading(false);
        return;
      }
      if (!data) {
        setLoadError('This podcast episode could not be found.');
        setLoading(false);
        return;
      }

      setEpisode(data);
      let relatedQuery = supabase
        .from('podcasts')
        .select('id, title, content_type, host_name, duration, cover_image_url, created_at')
        .neq('id', data.id)
        .order('created_at', { ascending: false })
        .limit(4);
      if (data.subcategory) relatedQuery = relatedQuery.eq('subcategory', data.subcategory);
      const { data: relatedRows } = await relatedQuery;
      if (active) {
        setRelated(relatedRows || []);
        setLoading(false);
      }
    };

    void fetchEpisode();
    return () => { active = false; };
  }, [id]);

  useEffect(() => {
    setPlaying(false);
    setCurrentTime(0);
    setAudioDuration(0);
  }, [id]);

  const togglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio || !episode?.media_file_url) return;
    if (audio.paused) {
      await audio.play();
      setPlaying(true);
    } else {
      audio.pause();
      setPlaying(false);
    }
  };

  const seekBy = (amount: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, Math.min(audio.duration || 0, audio.currentTime + amount));
  };

  const shareEpisode = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: episode.title, url }).catch(() => {});
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[calc(100dvh-72px)] items-center justify-center bg-[#121212] text-[#1ed760]">
        <DotmCircular7 size={64} dotSize={8} />
      </div>
    );
  }

  if (loadError || !episode) {
    return (
      <div className="flex min-h-[calc(100dvh-72px)] flex-col items-center justify-center bg-[#121212] px-6 text-center text-white">
        <Headphones size={48} className="mb-5 text-white/30" />
        <h1 className="text-2xl font-black">Episode unavailable</h1>
        <p className="mt-2 max-w-md text-sm text-white/55">{loadError}</p>
        <Link href="/platform/resources/podcasts-conversations" className="mt-7 rounded-full bg-white px-6 py-3 text-sm font-black text-black">Back to podcasts</Link>
      </div>
    );
  }

  const topic = episode.topic_tag || episode.custom_topic || episode.subcategory;
  const published = episode.created_at
    ? new Date(episode.created_at).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })
    : null;
  const transcript = typeof episode.transcript === 'string' ? episode.transcript.trim() : '';

  return (
    <div className="min-h-screen bg-[#121212] pb-28 text-white">
      <div className="relative overflow-hidden bg-gradient-to-b from-[#473414] via-[#292015] to-[#121212]">
        {episode.cover_image_url && (
          <img src={episode.cover_image_url} alt="" className="absolute inset-0 h-full w-full scale-110 object-cover opacity-20 blur-3xl" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-black/15 to-black/30" />

        <div className="relative mx-auto max-w-6xl px-5 pb-12 pt-6 sm:px-8 sm:pt-8">
          <div className="mb-10 flex items-center justify-between">
            <Link href="/platform/resources/podcasts-conversations" className="inline-flex items-center gap-2 rounded-full bg-black/35 px-4 py-2 text-sm font-bold backdrop-blur hover:bg-black/55">
              <ArrowLeft size={17} /> Podcasts
            </Link>
            <button onClick={() => void shareEpisode()} className="inline-flex items-center gap-2 rounded-full bg-black/35 px-4 py-2 text-sm font-bold backdrop-blur hover:bg-black/55">
              <Share2 size={16} /> {copied ? 'Copied' : 'Share'}
            </button>
          </div>

          <div className="flex flex-col items-center gap-7 md:flex-row md:items-end md:gap-10">
            <div className="flex aspect-square w-56 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-[#1ed760] to-[#075f2d] shadow-[0_24px_60px_rgba(0,0,0,.55)] sm:w-64 md:w-72">
              {episode.cover_image_url ? <img src={episode.cover_image_url} alt={episode.title} className="h-full w-full object-cover" /> : <Headphones size={92} className="text-black/70" />}
            </div>

            <div className="min-w-0 flex-1 text-center md:text-left">
              <p className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-white/75">{episode.content_type || 'Podcast'}</p>
              <h1 className="text-4xl font-black leading-[1.02] tracking-[-0.04em] sm:text-5xl lg:text-7xl">{episode.title}</h1>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm font-semibold text-white/70 md:justify-start">
                {episode.host_name && <span className="font-black text-white">{episode.host_name}</span>}
                {episode.guest_names && <><span>•</span><span>with {episode.guest_names}</span></>}
                {published && <><span>•</span><span>{published}</span></>}
                {episode.duration && <><span>•</span><span>{episode.duration}</span></>}
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-5 sm:px-8">
        <section className="-mt-1 rounded-2xl bg-[#181818] p-5 shadow-2xl sm:p-7">
          {episode.media_file_url ? (
            <>
              <audio
                ref={audioRef}
                src={episode.media_file_url}
                preload="metadata"
                onLoadedMetadata={(event) => setAudioDuration(event.currentTarget.duration || 0)}
                onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                onEnded={() => setPlaying(false)}
              />
              <div className="flex flex-col gap-5">
                <div className="flex items-center justify-center gap-7">
                  <button onClick={() => seekBy(-15)} className="text-white/60 hover:text-white" aria-label="Back 15 seconds"><SkipBack size={24} /></button>
                  <button onClick={() => void togglePlayback()} className="flex h-16 w-16 items-center justify-center rounded-full bg-[#1ed760] text-black transition-transform hover:scale-105" aria-label={playing ? 'Pause episode' : 'Play episode'}>
                    {playing ? <Pause size={29} fill="currentColor" /> : <Play size={29} fill="currentColor" className="ml-1" />}
                  </button>
                  <button onClick={() => seekBy(15)} className="text-white/60 hover:text-white" aria-label="Forward 15 seconds"><SkipForward size={24} /></button>
                </div>
                <div className="flex items-center gap-3 text-xs font-semibold text-white/55">
                  <span className="w-10 text-right">{formatClock(currentTime)}</span>
                  <input
                    type="range"
                    min={0}
                    max={audioDuration || 0}
                    step="0.1"
                    value={Math.min(currentTime, audioDuration || 0)}
                    onChange={(event) => { if (audioRef.current) audioRef.current.currentTime = Number(event.target.value); }}
                    className="h-1 flex-1 cursor-pointer accent-[#1ed760]"
                    aria-label="Episode progress"
                  />
                  <span className="w-10">{formatClock(audioDuration)}</span>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center gap-3 py-5 text-sm font-bold text-white/45"><RotateCcw size={19} /> No media file was saved for this episode.</div>
          )}
        </section>

        <div className="grid gap-10 py-12 lg:grid-cols-[1fr_320px]">
          <div className="space-y-10">
            {episode.description && (
              <section><h2 className="mb-4 text-2xl font-black">About this episode</h2><p className="whitespace-pre-wrap text-base leading-8 text-white/68">{episode.description}</p></section>
            )}
            {transcript && (
              <section className="border-t border-white/10 pt-9"><h2 className="mb-4 text-2xl font-black">Transcript</h2><p className="whitespace-pre-wrap text-sm leading-7 text-white/65">{transcript}</p></section>
            )}
          </div>

          <aside className="space-y-4">
            <h2 className="text-lg font-black">Episode details</h2>
            <div className="space-y-4 rounded-2xl bg-[#181818] p-5 text-sm">
              {episode.host_name && <div className="flex gap-3"><Mic2 size={18} className="shrink-0 text-[#1ed760]" /><div><p className="text-xs text-white/45">Host</p><p className="font-bold">{episode.host_name}</p></div></div>}
              {episode.guest_names && <div className="flex gap-3"><Users size={18} className="shrink-0 text-[#1ed760]" /><div><p className="text-xs text-white/45">Guests</p><p className="font-bold">{episode.guest_names}</p></div></div>}
              {topic && <div className="flex gap-3"><Music2 size={18} className="shrink-0 text-[#1ed760]" /><div><p className="text-xs text-white/45">Topic</p><p className="font-bold">{topic}</p></div></div>}
              {published && <div className="flex gap-3"><CalendarDays size={18} className="shrink-0 text-[#1ed760]" /><div><p className="text-xs text-white/45">Published</p><p className="font-bold">{published}</p></div></div>}
              {episode.duration && <div className="flex gap-3"><Clock3 size={18} className="shrink-0 text-[#1ed760]" /><div><p className="text-xs text-white/45">Duration</p><p className="font-bold">{episode.duration}</p></div></div>}
            </div>
          </aside>
        </div>

        {related.length > 0 && (
          <section className="border-t border-white/10 py-10">
            <h2 className="mb-6 text-2xl font-black">More episodes</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((item) => (
                <Link key={item.id} href={`/platform/resources/podcasts-conversations/${item.id}`} className="group rounded-xl bg-[#181818] p-4 transition-colors hover:bg-[#282828]">
                  <div className="mb-4 flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-[#2b2b2b] to-[#111]">
                    {item.cover_image_url ? <img src={item.cover_image_url} alt={item.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" /> : <Headphones size={44} className="text-white/25" />}
                  </div>
                  <h3 className="line-clamp-2 font-black">{item.title}</h3>
                  {item.host_name && <p className="mt-2 truncate text-xs text-white/50">{item.host_name}</p>}
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
