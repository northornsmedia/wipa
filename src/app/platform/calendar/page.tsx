'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/store/useAppStore';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, List, Grid, Plus, X, Link as LinkIcon, RefreshCw, AlertCircle, Building, Video, Users, CheckCircle2 } from 'lucide-react';
import ThemeWrapper from '@/components/ThemeWrapper';
import Sidebar from '@/components/Sidebar';

export default function CalendarPage() {
  const { user } = useAppStore();
  const [view, setView] = useState<'grid' | 'agenda'>('grid');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', description: '', date: '', time: '12:00' });
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  
  const [calendarToken, setCalendarToken] = useState('');
  
  useEffect(() => {
    if (user) {
      fetchEvents();
      ensureToken();
    }
  }, [user]);

  const ensureToken = async () => {
    if (!user) return;
    const { data: profile } = await supabase.from('profiles').select('calendar_token').eq('id', user.id).single();
    if (!profile?.calendar_token) {
      const newToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      await supabase.from('profiles').update({ calendar_token: newToken }).eq('id', user.id);
      setCalendarToken(newToken);
    } else {
      setCalendarToken(profile.calendar_token);
    }
  };

  const fetchEvents = async () => {
    if (!user) return;
    const { data } = await supabase.from('calendar_events').select('*').eq('user_id', user.id).order('start_at', { ascending: true });
    if (data) setEvents(data);
    setLoading(false);
  };

  const handleAddEvent = async () => {
    if (!user || !newEvent.title || !newEvent.date) return;
    
    const start_at = new Date(`${newEvent.date}T${newEvent.time}:00`).toISOString();
    
    const { error } = await supabase.from('calendar_events').insert({
      user_id: user.id,
      title: newEvent.title,
      description: newEvent.description,
      start_at,
      end_at: new Date(new Date(start_at).getTime() + 60*60*1000).toISOString(),
      event_type: 'personal_note'
    });
    
    if (!error) {
      setShowAddModal(false);
      setNewEvent({ title: '', description: '', date: '', time: '12:00' });
      fetchEvents();
    }
  };

  const deleteEvent = async (id: string) => {
    await supabase.from('calendar_events').delete().eq('id', id);
    setSelectedEvent(null);
    fetchEvents();
  };

  const syncGoogle = async () => {
    window.location.href = '/api/calendar/google/auth';
  };

  const syncOutlook = async () => {
    window.location.href = '/api/calendar/outlook/auth';
  };

  // Calendar logic
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();
  
  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const firstDay = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());
  
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDay }, (_, i) => i);

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'wipa_event': return <Building size={12} />;
      case 'webinar': return <Video size={12} />;
      case 'mentorship': return <Users size={12} />;
      default: return <CalendarIcon size={12} />;
    }
  };

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const icalUrl = `${baseUrl}/api/calendar/ical?userId=${user?.id}&token=${calendarToken}`;

  return (
    <ThemeWrapper>
      <div className="flex h-screen bg-slate-50 dark:bg-[#020617] overflow-hidden font-sans">
        <Sidebar />
        
        <main className="flex-1 overflow-y-auto">
          <div className="p-8 max-w-7xl mx-auto">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">My Calendar</h1>
                <p className="text-slate-500 font-medium mt-1">Manage your events, webinars, and personal schedule.</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-white dark:bg-white/5 p-1 rounded-xl border border-slate-200 dark:border-white/10 flex">
                  <button 
                    onClick={() => setView('grid')}
                    className={`p-2 rounded-lg transition-colors ${view === 'grid' ? 'bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                  >
                    <Grid size={18} />
                  </button>
                  <button 
                    onClick={() => setView('agenda')}
                    className={`p-2 rounded-lg transition-colors ${view === 'agenda' ? 'bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                  >
                    <List size={18} />
                  </button>
                </div>
                <button 
                  onClick={() => setShowAddModal(true)}
                  className="bg-[#5a32fa] text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-[#4d2be6] transition-colors shadow-lg shadow-[#5a32fa]/20"
                >
                  <Plus size={18} /> Add Note
                </button>
              </div>
            </div>

            <div className="grid lg:grid-cols-4 gap-8">
              
              <div className="lg:col-span-3">
                {view === 'grid' ? (
                  <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-white/10 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                        {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                      </h2>
                      <div className="flex items-center gap-2">
                        <button onClick={prevMonth} className="p-2 bg-slate-100 dark:bg-white/5 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"><ChevronLeft size={20}/></button>
                        <button onClick={nextMonth} className="p-2 bg-slate-100 dark:bg-white/5 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"><ChevronRight size={20}/></button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-7 gap-px bg-slate-100 dark:bg-white/5 rounded-2xl overflow-hidden border border-slate-100 dark:border-white/5">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="bg-white dark:bg-slate-900 py-3 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">
                          {day}
                        </div>
                      ))}
                      
                      {blanks.map(b => (
                        <div key={`blank-${b}`} className="bg-slate-50/50 dark:bg-slate-900/50 min-h-[120px] p-2"></div>
                      ))}
                      
                      {days.map(day => {
                        const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                        const dayEvents = events.filter(e => e.start_at.startsWith(dateStr));
                        
                        return (
                          <div key={day} className="bg-white dark:bg-slate-900 min-h-[120px] p-2 border-t border-l border-slate-100 dark:border-white/5 group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer" onClick={() => {}}>
                            <div className={`text-sm font-bold w-7 h-7 rounded-full flex items-center justify-center mb-2 ${new Date().toISOString().startsWith(dateStr) ? 'bg-[#5a32fa] text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                              {day}
                            </div>
                            <div className="space-y-1.5">
                              {dayEvents.map(e => (
                                <div 
                                  key={e.id} 
                                  onClick={(ev) => { ev.stopPropagation(); setSelectedEvent(e); }}
                                  className="text-xs px-2 py-1.5 rounded-md truncate font-medium flex items-center gap-1.5"
                                  style={{ backgroundColor: `${e.color || '#5a32fa'}15`, color: e.color || '#5a32fa' }}
                                >
                                  {getEventIcon(e.event_type)}
                                  {e.title}
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 dark:border-white/5">
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white">Upcoming Agenda</h2>
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-white/5">
                      {events.filter(e => new Date(e.start_at) >= new Date()).slice(0, 20).map(e => (
                        <div key={e.id} className="p-6 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors flex gap-6 cursor-pointer" onClick={() => setSelectedEvent(e)}>
                          <div className="text-center shrink-0 w-16">
                            <div className="text-xs font-bold text-slate-400 uppercase">{new Date(e.start_at).toLocaleString('default', { month: 'short' })}</div>
                            <div className="text-2xl font-black text-slate-900 dark:text-white">{new Date(e.start_at).getDate()}</div>
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2 mb-1">
                              <span style={{ color: e.color || '#5a32fa' }}>{getEventIcon(e.event_type)}</span>
                              {e.title}
                            </h3>
                            <div className="text-sm text-slate-500 flex items-center gap-4">
                              <span>{new Date(e.start_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              {e.location && <span>• {e.location}</span>}
                            </div>
                          </div>
                        </div>
                      ))}
                      {events.filter(e => new Date(e.start_at) >= new Date()).length === 0 && (
                        <div className="p-12 text-center text-slate-500">
                          <CalendarIcon size={32} className="mx-auto mb-4 opacity-50" />
                          <p>No upcoming events.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                
                {/* Sync Widget */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-white/10 shadow-sm">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4">Calendar Sync</h3>
                  <div className="space-y-3">
                    <button onClick={syncGoogle} className="w-full bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-between border border-slate-200 dark:border-white/5">
                      <div className="flex items-center gap-3">
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                        <span>Google Calendar</span>
                      </div>
                      <ChevronRight size={16} className="text-slate-400" />
                    </button>
                    <button onClick={syncOutlook} className="w-full bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-between border border-slate-200 dark:border-white/5">
                      <div className="flex items-center gap-3">
                        <img src="https://www.svgrepo.com/show/475665/microsoft-color.svg" className="w-5 h-5" alt="Microsoft" />
                        <span>Outlook</span>
                      </div>
                      <ChevronRight size={16} className="text-slate-400" />
                    </button>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-slate-100 dark:border-white/5">
                    <div className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                      <LinkIcon size={14} /> iCal Feed URL
                    </div>
                    <div className="flex">
                      <input 
                        type="text" 
                        readOnly 
                        value={icalUrl} 
                        className="flex-1 bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 rounded-l-lg px-3 py-2 text-xs text-slate-500 focus:outline-none"
                      />
                      <button 
                        onClick={() => navigator.clipboard.writeText(icalUrl)}
                        className="bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 px-3 rounded-r-lg font-bold text-xs transition-colors"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </main>

        {/* Add Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl border border-slate-200 dark:border-white/10">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Add Personal Note</h3>
                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600"><X size={24}/></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Title</label>
                  <input type="text" value={newEvent.title} onChange={e=>setNewEvent({...newEvent, title: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a32fa]" placeholder="Lunch with client" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Date</label>
                    <input type="date" value={newEvent.date} onChange={e=>setNewEvent({...newEvent, date: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a32fa]" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Time</label>
                    <input type="time" value={newEvent.time} onChange={e=>setNewEvent({...newEvent, time: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a32fa]" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Description (Optional)</label>
                  <textarea value={newEvent.description} onChange={e=>setNewEvent({...newEvent, description: e.target.value})} rows={3} className="w-full px-4 py-3 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a32fa]" placeholder="Any notes..."></textarea>
                </div>
                <button onClick={handleAddEvent} className="w-full bg-[#5a32fa] text-white font-bold py-3 rounded-xl mt-2 hover:bg-[#4d2be6] transition-colors">
                  Save Note
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Event Popover */}
        {selectedEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedEvent(null)}>
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 w-full max-w-sm shadow-2xl border border-slate-200 dark:border-white/10" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${selectedEvent.color || '#5a32fa'}20`, color: selectedEvent.color || '#5a32fa' }}>
                  {getEventIcon(selectedEvent.event_type)}
                </div>
                <button onClick={() => setSelectedEvent(null)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">{selectedEvent.title}</h3>
              <div className="text-sm text-slate-500 font-medium mb-4 space-y-1">
                <div>{new Date(selectedEvent.start_at).toLocaleString([], { weekday: 'long', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                {selectedEvent.location && <div>📍 {selectedEvent.location}</div>}
              </div>
              {selectedEvent.description && (
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 bg-slate-50 dark:bg-white/5 p-3 rounded-xl">
                  {selectedEvent.description}
                </p>
              )}
              
              <div className="flex gap-3">
                {selectedEvent.meeting_url && (
                  <a href={selectedEvent.meeting_url} target="_blank" rel="noreferrer" className="flex-1 bg-[#5a32fa] text-white text-center font-bold py-2.5 rounded-xl hover:bg-[#4d2be6] transition-colors">
                    Join
                  </a>
                )}
                {selectedEvent.event_type === 'personal_note' && (
                  <button onClick={() => deleteEvent(selectedEvent.id)} className="flex-1 bg-red-100 text-red-600 text-center font-bold py-2.5 rounded-xl hover:bg-red-200 transition-colors">
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </ThemeWrapper>
  );
}
