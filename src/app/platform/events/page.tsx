'use client';

import { useState, useEffect, Fragment } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { 
  Calendar, LayoutGrid, Users, Mail, UsersRound, FileText, Briefcase, GraduationCap,
  BadgeCheck, ThumbsUp, MapPin, Clock, ArrowRight, X, MessageSquare
, BookOpen
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import AdSlot from '@/components/AdSlot';
export default function EventsPage() {
  const { user } = useAppStore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'Upcoming' | 'My Events' | 'Past'>('Upcoming');
  const [events, setEvents] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('create') === 'true') {
        setIsModalOpen(true);
        window.history.replaceState({}, '', '/platform/events');
      }
    }
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const { data: eventsData, error } = await supabase
          .from('events')
          .select('*')
          .order('display_order', { ascending: true })
          .order('event_date', { ascending: true });

        if (error) {
          console.error("Error fetching events:", error.message);
        }

        let registeredIds = new Set<string>();
        if (user?.id) {
          const { data: myRegistrations } = await supabase
            .from('event_registrations')
            .select('event_id')
            .eq('user_id', user.id);
          registeredIds = new Set(myRegistrations?.map(r => r.event_id) || []);
        }

        if (eventsData) {
          const colors = ['#5a32fa', '#ff90e8', '#00d26a', '#ffb800', '#00c6ff'];
          const formatted = eventsData.map((e: any, idx: number) => {
            const date = new Date(e.event_date);
            const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
            const day = date.getDate().toString();
            let time = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
            if (e.end_date) {
              const endDate = new Date(e.end_date);
              time += ' - ' + endDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
            }

            return {
              id: e.id,
              title: e.title,
              category: e.category || 'Event',
              type: e.is_virtual ? 'Online Event' : (e.location ? e.location : 'In-Person Summit'),
              location: e.location || (e.is_virtual ? 'Virtual (Online)' : 'Global Venue'),
              time,
              month,
              day,
              price: e.price || 0,
              attendees: e.max_attendees || 500,
              isRegistered: registeredIds.has(e.id) || (user?.id && e.organizer_id === user.id),
              description: e.description || '',
              cover_image_url: e.cover_image_url,
              color: colors[idx % colors.length],
              organizerName: e.organizer_name || (e.slug === 'inta-annual-meeting-2027' ? 'International Trademark Association' : 'WIPA Global Community'),
              organizerLogo: e.organizer_logo_url || (e.slug === 'inta-annual-meeting-2027' ? '/inta-logo.png' : null),
              organizerIsWipaRecommended: true,
              registrationUrl: e.registration_url || e.meeting_url,
              event_date: e.event_date
            };
          });
          setEvents(formatted);
        }
      } catch (err) {
        console.error("Fetch events error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [user?.id]);
  
  const [newEvent, setNewEvent] = useState({
    title: '',
    type: 'Meetup',
    location: '',
    time: '',
    month: 'AUG',
    day: '25',
    description: '',
    agenda: [
      { time: '', brief: '' },
      { time: '', brief: '' }
    ]
  });

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    
    const eventDate = new Date();
    eventDate.setMonth(new Date(`${newEvent.month} 1, 2026`).getMonth());
    eventDate.setDate(parseInt(newEvent.day));
    
    const { data: createdEvent, error } = await supabase.from('events').insert({
      title: newEvent.title,
      description: newEvent.description,
      location: newEvent.location,
      is_virtual: newEvent.type === 'Online Webinar',
      event_date: eventDate.toISOString(),
      organizer_id: user.id
    }).select().single();
    
    const { data: userProfile } = await supabase.from('profiles').select('full_name, is_wipa_recommended').eq('id', user.id).single();
    
    if (createdEvent) {
      await supabase.from('event_registrations').insert({
        event_id: createdEvent.id,
        user_id: user.id
      });
      
      const newEventFormatted = {
        id: createdEvent.id,
        title: createdEvent.title,
        type: createdEvent.is_virtual ? 'Online Event' : 'In-Person',
        location: createdEvent.location,
        time: newEvent.time,
        month: newEvent.month,
        day: newEvent.day,
        attendees: 1,
        isRegistered: true,
        description: createdEvent.description,
        organizerName: userProfile?.full_name || 'WIPA Admin',
        organizerIsWipaRecommended: userProfile?.is_wipa_recommended,
        event_date: createdEvent.event_date
      };
      
      setEvents([newEventFormatted, ...events]);
      setIsModalOpen(false);
      setNewEvent({
        title: '',
        type: 'Meetup',
        location: '',
        time: '',
        month: 'AUG',
        day: '25',
        description: '',
        agenda: [
          { time: '', brief: '' },
          { time: '', brief: '' }
        ]
      });
      setActiveTab('My Events');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0f172a]">
      
      {/* MAIN SCROLLABLE CONTENT */}
      <div className="w-full min-h-[calc(100vh-73px)]">
        <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 pt-8">
          
          <div className="mb-8 border-b border-gray-100 dark:border-white/10 pb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <Calendar size={32} className="text-[#5a32fa]" />
                Events
              </h1>
              <p className="text-gray-500 dark:text-gray-400 font-medium mt-2">
                Discover upcoming webinars, meetups, and conferences.
              </p>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-[#5a32fa] text-white px-6 py-3 rounded-xl font-bold text-sm border border-gray-100 dark:border-white/10 hover:shadow-sm hover:-translate-y-0.5 transition-all"
            >
              + Create Event
            </button>
          </div>

          <div className="flex items-center gap-4 mb-8">
            <button 
              onClick={() => setActiveTab('Upcoming')}
              className={`px-5 py-2 rounded-full font-bold text-sm transition-colors ${activeTab === 'Upcoming' ? 'bg-[#5a32fa] text-white' : 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-200'}`}
            >
              Upcoming
            </button>
            <button 
              onClick={() => setActiveTab('My Events')}
              className={`px-5 py-2 rounded-full font-bold text-sm transition-colors ${activeTab === 'My Events' ? 'bg-[#5a32fa] text-white' : 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-200'}`}
            >
              My Events
            </button>
            <button 
              onClick={() => setActiveTab('Past')}
              className={`px-5 py-2 rounded-full font-bold text-sm transition-colors ${activeTab === 'Past' ? 'bg-[#5a32fa] text-white' : 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-200'}`}
            >
              Past
            </button>
          </div>

          {/* Dynamic Ad Banner */}
          <div className="mb-6">
            <AdSlot slotId="events_sidebar" />
          </div>

          <div className="space-y-6 pb-24">
            {events.filter(event => {
              const evtDate = new Date(event.event_date);
              const isPast = evtDate < new Date();
              if (activeTab === 'My Events') return event.isRegistered;
              if (activeTab === 'Past') return isPast;
              return true; // Upcoming
            }).length === 0 ? (
              <div className="bg-white dark:bg-[#0f172a] rounded-3xl border border-gray-100 dark:border-white/10 shadow-sm p-12 text-center flex flex-col items-center">
                <Calendar size={48} className="text-gray-300 dark:text-gray-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {activeTab === 'My Events' ? "No Registered Events Yet" : `No ${activeTab.toLowerCase()} events found`}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 font-medium max-w-md mx-auto mb-6">
                  {activeTab === 'My Events' 
                    ? "You haven't registered for any summits or masterclasses yet. Explore our upcoming global schedule below!"
                    : "Check back later or explore other categories."}
                </p>
                {activeTab === 'My Events' && (
                  <button
                    onClick={() => setActiveTab('Upcoming')}
                    className="px-6 py-2.5 rounded-xl bg-[#5a32fa] text-white font-bold text-xs shadow-md shadow-[#5a32fa]/20 hover:opacity-90 transition-all"
                  >
                    Browse Upcoming Events
                  </button>
                )}
              </div>
            ) : events.filter(event => {
              const evtDate = new Date(event.event_date);
              const isPast = evtDate < new Date();
              if (activeTab === 'My Events') return event.isRegistered;
              if (activeTab === 'Past') return isPast;
              return true; 
            }).map((event, index) => (
              <Fragment key={event.id}>

                
                <div 
                  onClick={() => router.push(`/platform/events/${event.id}`)}
                  className="cursor-pointer relative overflow-hidden rounded-3xl shadow-sm hover:shadow-md dark:shadow-xl bg-white dark:bg-[#151c2c] flex flex-col md:flex-row group border border-gray-200 dark:border-white/5 hover:border-[#5a32fa]/40 transition-all duration-500 hover:-translate-y-1"
                >
                  {/* Glowing background blob */}
                  <div className="absolute -top-32 -left-32 w-64 h-64 rounded-full blur-[100px] opacity-20 dark:opacity-30 group-hover:opacity-40 dark:group-hover:opacity-50 transition-opacity duration-1000 pointer-events-none" style={{ backgroundColor: event.color }}></div>

                  {/* Main Ticket Area */}
                  <div className="flex-1 p-6 md:p-8 relative z-10 flex flex-col justify-center border-b-2 md:border-b-0 md:border-r-2 border-dashed border-gray-200 dark:border-white/10">
                    <div className="flex items-center gap-3 mb-5">
                      <span className="bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-200 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest border border-gray-200 dark:border-white/10 shadow-sm">
                        {event.type}
                      </span>
                      {event.isRegistered && (
                        <span className="bg-[#00d26a] text-white flex items-center gap-2 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
                          Attending
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-2xl md:text-3xl font-black mb-1 leading-tight text-gray-900 dark:text-white">
                      {event.title}
                    </h3>
                    <p className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-2">
                      {event.organizerLogo && (
                        <span className="w-5 h-5 rounded-md bg-white dark:bg-slate-800 p-0.5 border border-gray-200 dark:border-white/10 inline-flex items-center justify-center shrink-0 shadow-sm">
                          <img src={event.organizerLogo} alt="" className="max-h-full max-w-full object-contain" />
                        </span>
                      )}
                      <span>By {event.organizerName}</span>
                      {event.organizerIsWipaRecommended && (
                        <span className="text-[9px] bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 px-2 py-0.5 rounded-full whitespace-nowrap font-black">
                          {event.title.includes('INTA') ? '⭐ INTA Official' : '⭐ WIPA'}
                        </span>
                      )}
                    </p>
                    
                    <p className="text-gray-600 dark:text-gray-400 font-medium mb-8 text-sm md:text-base line-clamp-2">
                      {event.description}
                    </p>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 mt-auto">
                      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-bold text-sm">
                        <Clock size={16} className="text-[#5a32fa]" />
                        {event.time}
                      </div>
                      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-bold text-sm">
                        <MapPin size={16} className="text-[#5a32fa]" />
                        {event.location}
                      </div>
                    </div>
                  </div>

                  {/* Ticket Stub (Date & CTA) */}
                  <div className="md:w-64 relative z-10 flex flex-col justify-between p-6 md:p-8 bg-gray-50/50 dark:bg-black/20 items-center text-center">
                    <div className="absolute top-0 right-0 w-full h-full opacity-[0.03] dark:opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '16px 16px' }}></div>
                    
                    <div className="w-full flex flex-col items-center">
                      <div className="text-[13px] text-gray-500 dark:text-gray-400 uppercase tracking-widest font-black mb-1">{event.month}</div>
                      <div className="text-5xl font-black mb-2" style={{ color: event.color }}>{event.day}</div>
                      
                      <div className="flex items-center gap-2 mt-4 text-[11px] font-bold text-gray-600 dark:text-gray-300 bg-white dark:bg-[#0f172a] px-3 py-1.5 rounded-full border border-gray-200 dark:border-white/10 shadow-sm relative z-20">
                        <div className="flex -space-x-1">
                          <div className="w-5 h-5 rounded-full bg-gray-200 border border-white dark:border-[#0f172a]"></div>
                          <div className="w-5 h-5 rounded-full bg-gray-300 border border-white dark:border-[#0f172a]"></div>
                        </div>
                        +{event.attendees} attending
                      </div>
                    </div>
                    
                    <div className="w-full space-y-2 mt-6">
                      <button 
                        onClick={async (e) => {
                          e.stopPropagation();
                          if (event.isRegistered) {
                            await supabase.from('event_registrations').delete().match({ event_id: event.id, user_id: user?.id });
                            setEvents(events.map(ev => ev.id === event.id ? { ...ev, isRegistered: false, attendees: ev.attendees - 1 } : ev));
                          } else {
                            await supabase.from('event_registrations').insert({ event_id: event.id, user_id: user?.id });
                            setEvents(events.map(ev => ev.id === event.id ? { ...ev, isRegistered: true, attendees: ev.attendees + 1 } : ev));
                          }
                        }}
                        className={`w-full py-3 font-black text-xs tracking-wide rounded-xl transition-all relative z-20 active:scale-95 shadow-sm ${
                        event.isRegistered 
                          ? 'bg-emerald-500 text-white shadow-emerald-500/20' 
                          : 'bg-[#5a32fa] hover:bg-[#4a24db] text-white shadow-[#5a32fa]/30'
                      }`}>
                        {event.isRegistered ? '✓ ATTENDING (CLICK TO CANCEL)' : 'RSVP / REGISTER NOW'}
                      </button>

                      {/* 1-Tap Calendar Sync Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const eventStart = new Date(event.event_date || Date.now()).toISOString().replace(/-|:|\.\d\d\d/g, "");
                          const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&details=${encodeURIComponent(event.description || 'WIPA Summit Event')}&location=${encodeURIComponent(event.location || 'Virtual')}&dates=${eventStart}/${eventStart}`;
                          window.open(gcalUrl, '_blank');
                        }}
                        className="w-full py-2 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 text-gray-700 dark:text-gray-300 text-[11px] font-bold rounded-xl transition-all active:scale-95 flex items-center justify-center gap-1.5"
                      >
                        <Calendar size={13} />
                        <span>+ Add to Calendar</span>
                      </button>
                    </div>

                    {/* Fake Barcode */}
                    <div className="w-full flex justify-between h-8 mt-6 opacity-20 dark:opacity-40 px-2 relative z-10">
                      <div className="w-1 bg-gray-900 dark:bg-white h-full"></div>
                      <div className="w-2 bg-gray-900 dark:bg-white h-full"></div>
                      <div className="w-1 bg-gray-900 dark:bg-white h-full"></div>
                      <div className="w-3 bg-gray-900 dark:bg-white h-full"></div>
                      <div className="w-1 bg-gray-900 dark:bg-white h-full"></div>
                      <div className="w-2 bg-gray-900 dark:bg-white h-full"></div>
                      <div className="w-1 bg-gray-900 dark:bg-white h-full"></div>
                      <div className="w-2 bg-gray-900 dark:bg-white h-full"></div>
                      <div className="w-1 bg-gray-900 dark:bg-white h-full"></div>
                      <div className="w-4 bg-gray-900 dark:bg-white h-full"></div>
                    </div>
                  </div>

                  {/* Cutouts for ticket effect */}
                  <div className="hidden md:block absolute -top-4 right-[240px] w-8 h-8 rounded-full bg-[#f8f9fa] dark:bg-[#0f172a] z-20 shadow-inner border-b border-gray-200 dark:border-white/10"></div>
                  <div className="hidden md:block absolute -bottom-4 right-[240px] w-8 h-8 rounded-full bg-[#f8f9fa] dark:bg-[#0f172a] z-20 shadow-inner border-t border-gray-200 dark:border-white/10"></div>
                </div>
              </Fragment>
            ))}
          </div>
        </div>
      </div>
      {/* CREATE EVENT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          
          <div className="bg-white dark:bg-[#0f172a] rounded-3xl border border-gray-100 dark:border-white/10 shadow-sm p-6 md:p-8 w-full max-w-lg relative z-10 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto no-scrollbar">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 dark:text-white transition-colors bg-gray-100 dark:bg-white/10 hover:bg-gray-200 p-2 rounded-full"
            >
              <X size={20} />
            </button>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
              <Calendar size={28} className="text-[#5a32fa]" />
              Create Event
            </h2>
            
            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-900 dark:text-white mb-1">Event Title</label>
                <input 
                  type="text" 
                  required
                  value={newEvent.title}
                  onChange={e => setNewEvent({...newEvent, title: e.target.value})}
                  className="w-full bg-gray-50 dark:bg-white/5 border-2 border-gray-200 dark:border-white/20 rounded-xl px-4 py-3 text-gray-900 dark:text-white font-medium focus:outline-none focus:border-[#5a32fa] focus:bg-white dark:bg-[#0f172a] transition-colors"
                  placeholder="e.g. AI in Healthcare Symposium"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-900 dark:text-white mb-1">Event Type</label>
                  <select 
                    value={newEvent.type}
                    onChange={e => setNewEvent({...newEvent, type: e.target.value})}
                    className="w-full bg-gray-50 dark:bg-white/5 border-2 border-gray-200 dark:border-white/20 rounded-xl px-4 py-3 text-gray-900 dark:text-white font-medium focus:outline-none focus:border-[#5a32fa] focus:bg-white dark:bg-[#0f172a] transition-colors appearance-none"
                  >
                    <option>Meetup</option>
                    <option>Conference</option>
                    <option>Workshop</option>
                    <option>Online Webinar</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 dark:text-white mb-1">Location</label>
                  <input 
                    type="text" 
                    required
                    value={newEvent.location}
                    onChange={e => setNewEvent({...newEvent, location: e.target.value})}
                    className="w-full bg-gray-50 dark:bg-white/5 border-2 border-gray-200 dark:border-white/20 rounded-xl px-4 py-3 text-gray-900 dark:text-white font-medium focus:outline-none focus:border-[#5a32fa] focus:bg-white dark:bg-[#0f172a] transition-colors"
                    placeholder="e.g. London or Zoom"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-900 dark:text-white mb-1">Month</label>
                  <select 
                    value={newEvent.month}
                    onChange={e => setNewEvent({...newEvent, month: e.target.value})}
                    className="w-full bg-gray-50 dark:bg-white/5 border-2 border-gray-200 dark:border-white/20 rounded-xl px-4 py-3 text-gray-900 dark:text-white font-medium focus:outline-none focus:border-[#5a32fa] focus:bg-white dark:bg-[#0f172a] transition-colors appearance-none"
                  >
                    <option>JAN</option><option>FEB</option><option>MAR</option>
                    <option>APR</option><option>MAY</option><option>JUN</option>
                    <option>JUL</option><option>AUG</option><option>SEP</option>
                    <option>OCT</option><option>NOV</option><option>DEC</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 dark:text-white mb-1">Day</label>
                  <input 
                    type="number" 
                    required min="1" max="31"
                    value={newEvent.day}
                    onChange={e => setNewEvent({...newEvent, day: e.target.value})}
                    className="w-full bg-gray-50 dark:bg-white/5 border-2 border-gray-200 dark:border-white/20 rounded-xl px-4 py-3 text-gray-900 dark:text-white font-medium focus:outline-none focus:border-[#5a32fa] focus:bg-white dark:bg-[#0f172a] transition-colors"
                    placeholder="25"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 dark:text-white mb-1">Time</label>
                  <input 
                    type="text" 
                    required
                    value={newEvent.time}
                    onChange={e => setNewEvent({...newEvent, time: e.target.value})}
                    className="w-full bg-gray-50 dark:bg-white/5 border-2 border-gray-200 dark:border-white/20 rounded-xl px-4 py-3 text-gray-900 dark:text-white font-medium focus:outline-none focus:border-[#5a32fa] focus:bg-white dark:bg-[#0f172a] transition-colors"
                    placeholder="10:00 AM"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 dark:text-white mb-1">Description</label>
                <textarea 
                  required
                  value={newEvent.description}
                  onChange={e => setNewEvent({...newEvent, description: e.target.value})}
                  className="w-full bg-gray-50 dark:bg-white/5 border-2 border-gray-200 dark:border-white/20 rounded-xl px-4 py-3 text-gray-900 dark:text-white font-medium focus:outline-none focus:border-[#5a32fa] focus:bg-white dark:bg-[#0f172a] transition-colors resize-none h-24"
                  placeholder="What is this event about?"
                />
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-bold text-gray-900 dark:text-white">Agenda</label>
                  <button 
                    type="button" 
                    onClick={() => setNewEvent({...newEvent, agenda: [...newEvent.agenda, { time: '', brief: '' }]})}
                    className="text-xs font-bold bg-[#5a32fa]/10 text-[#5a32fa] px-3 py-1.5 rounded-lg border-2 border-transparent hover:border-[#5a32fa] transition-colors"
                  >
                    + Add More
                  </button>
                </div>
                {newEvent.agenda.map((item, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input 
                      type="text"
                      placeholder="Time"
                      value={item.time}
                      onChange={(e) => {
                        const newAgenda = [...newEvent.agenda];
                        newAgenda[idx].time = e.target.value;
                        setNewEvent({...newEvent, agenda: newAgenda});
                      }}
                      className="w-1/3 bg-gray-50 dark:bg-white/5 border-2 border-gray-200 dark:border-white/20 rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:border-[#5a32fa] focus:bg-white dark:bg-[#0f172a] transition-colors"
                    />
                    <input 
                      type="text"
                      placeholder="Brief (what we'll talk about)"
                      value={item.brief}
                      onChange={(e) => {
                        const newAgenda = [...newEvent.agenda];
                        newAgenda[idx].brief = e.target.value;
                        setNewEvent({...newEvent, agenda: newAgenda});
                      }}
                      className="w-2/3 bg-gray-50 dark:bg-white/5 border-2 border-gray-200 dark:border-white/20 rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:border-[#5a32fa] focus:bg-white dark:bg-[#0f172a] transition-colors"
                    />
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <button type="submit" className="w-full bg-[#00d26a] text-gray-900 dark:text-white px-6 py-4 rounded-xl font-bold text-lg border border-gray-100 dark:border-white/10 hover:shadow-sm hover:-translate-y-0.5 transition-all active:translate-y-0 active:shadow-none">
                  PUBLISH EVENT
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
