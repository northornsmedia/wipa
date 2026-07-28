'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { 
  Calendar, LayoutGrid, Users, Mail, UsersRound, FileText, Briefcase, GraduationCap,
  BadgeCheck, ThumbsUp, MapPin, Clock, ArrowRight, X, MessageSquare
, BookOpen
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const INITIAL_MOCK_EVENTS = [
  {
      id: 1,
      title: "Women in AI & IP Leadership Summit",
      type: "Conference",
      location: "London, UK",
      time: "10:00 AM - 4:00 PM GMT",
      month: "JUL",
      day: "22",
      attendees: 145,
      isRegistered: true,
      color: "#ff90e8",
      description: "Join industry leaders to discuss the intersection of artificial intelligence and intellectual property law."
    },
    {
      id: 2,
      title: "Global Trademark Trends 2025",
      type: "Online Webinar",
      location: "Zoom",
      time: "03:00 PM - 04:30 PM GMT",
      month: "AUG",
      day: "05",
      attendees: 312,
      isRegistered: false,
      color: "#b892ff",
      description: "A deep dive into emerging trademark challenges in digital marketplaces and the metaverse."
    },
    {
      id: 3,
      title: "IP Strategy for Start-ups",
      type: "Meetup",
      location: "New York, USA",
      time: "11:00 AM - 1:00 PM EST",
      month: "AUG",
      day: "19",
      attendees: 89,
      isRegistered: false,
      color: "#00d26a",
      description: "Practical advice for founders on securing and protecting intellectual property early."
    },
    {
      id: 4,
      title: "Blockchain & Smart Contracts Masterclass",
      type: "Workshop",
      location: "Berlin, DE",
      time: "09:00 AM - 5:00 PM CET",
      month: "SEP",
      day: "12",
      attendees: 55,
      isRegistered: false,
      color: "#ffc900",
      description: "Hands-on technical and legal workshop for automating royalty distributions."
    }
  ];

export default function EventsPage() {
  const { user } = useAppStore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'Upcoming' | 'My Events' | 'Past'>('Upcoming');
  const [events, setEvents] = useState(INITIAL_MOCK_EVENTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('create') === 'true') {
        setIsModalOpen(true);
        window.history.replaceState({}, '', '/platform/events');
      }
    }
  }, []);
  
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

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const eventToAdd = {
      id: events.length + 1,
      ...newEvent,
      attendees: 1, // Just you initially
      isRegistered: true, // You're attending since you created it
      color: '#00d26a' // Default color for new events
    };
    
    setEvents([eventToAdd, ...events]);
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
    // Switch to upcoming/my events tab
    setActiveTab('My Events');
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      
      {/* MAIN SCROLLABLE CONTENT */}
      <div className="w-full min-h-[calc(100vh-73px)]">
        <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 pt-8">
          
          <div className="mb-8 border-b border-gray-100 pb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Calendar size={32} className="text-[#5a32fa]" />
                Events
              </h1>
              <p className="text-gray-500 font-medium mt-2">
                Discover upcoming webinars, meetups, and conferences.
              </p>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-[#5a32fa] text-white px-6 py-3 rounded-xl font-bold text-sm border border-gray-100 hover:shadow-sm hover:-translate-y-0.5 transition-all"
            >
              + Create Event
            </button>
          </div>

          <div className="flex items-center gap-4 mb-8">
            <button 
              onClick={() => setActiveTab('Upcoming')}
              className={`px-5 py-2 rounded-full font-bold text-sm transition-colors ${activeTab === 'Upcoming' ? 'bg-[#5a32fa] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              Upcoming
            </button>
            <button 
              onClick={() => setActiveTab('My Events')}
              className={`px-5 py-2 rounded-full font-bold text-sm transition-colors ${activeTab === 'My Events' ? 'bg-[#5a32fa] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              My Events
            </button>
            <button 
              onClick={() => setActiveTab('Past')}
              className={`px-5 py-2 rounded-full font-bold text-sm transition-colors ${activeTab === 'Past' ? 'bg-[#5a32fa] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              Past
            </button>
          </div>

          <div className="space-y-6 pb-24">
            {events.filter(event => {
              if (activeTab === 'My Events') return event.isRegistered;
              if (activeTab === 'Past') return false; // In a real app, compare dates
              return true; // Upcoming
            }).length === 0 ? (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-12 text-center flex flex-col items-center">
                <Calendar size={48} className="text-gray-300 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No {activeTab.toLowerCase()} events found</h3>
                <p className="text-gray-500 font-medium">Check back later or explore other tabs.</p>
              </div>
            ) : events.filter(event => {
              if (activeTab === 'My Events') return event.isRegistered;
              if (activeTab === 'Past') return false; 
              return true; 
            }).map((event) => (
              <div 
                key={event.id} 
                onClick={() => router.push(`/platform/events/${event.id}`)}
                className="cursor-pointer bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col md:flex-row group transition-all hover:-translate-y-0.5 hover:shadow-sm">
                
                {/* Date Block */}
                <div className="md:w-48 border-b border-gray-100 md:border-b-0 md:border-r flex flex-row md:flex-col items-center justify-center p-6 md:p-8" style={{ backgroundColor: event.color }}>
                  <div className="text-gray-900 font-bold text-2xl md:text-3xl tracking-widest uppercase">{event.month}</div>
                  <div className="text-white text-5xl md:text-7xl font-bold md:mt-2" style={{ textShadow: "none" }}>{event.day}</div>
                </div>

                {/* Event Details */}
                <div className="flex-1 p-6 md:p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-gray-100 text-gray-800 text-[11px] font-bold px-3 py-1 rounded-md uppercase tracking-wider border-2 border-gray-200">
                      {event.type}
                    </span>
                    {event.isRegistered && (
                      <span className="bg-[#00d26a] text-white text-[11px] font-bold px-3 py-1 rounded-md uppercase tracking-wider border border-gray-100">
                        Attending
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">
                    {event.title}
                  </h3>
                  
                  <p className="text-gray-600 font-medium mb-6 leading-relaxed">
                    {event.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-2 text-gray-600 font-bold text-sm">
                      <Clock size={18} className="text-[#5a32fa]" />
                      {event.time}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 font-bold text-sm">
                      <MapPin size={18} className="text-[#5a32fa]" />
                      {event.location}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t-2 border-dashed border-gray-200">
                    <div className="flex items-center -space-x-2">
                      <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white"></div>
                      <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white"></div>
                      <div className="w-8 h-8 rounded-full bg-gray-400 border-2 border-white"></div>
                      <div className="pl-4 text-xs font-bold text-gray-500">
                        +{event.attendees} attending
                      </div>
                    </div>

                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        // handle registration toggle here
                      }}
                      className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm border border-gray-100 transition-all ${
                      event.isRegistered 
                        ? 'bg-white text-gray-400 border-gray-200 hover:bg-gray-50' 
                        : 'bg-[#5a32fa] text-white hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_#5a32fa]'
                    }`}>
                      {event.isRegistered ? 'Manage' : 'Register'}
                      {!event.isRegistered && <ArrowRight size={16} />}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* CREATE EVENT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 w-full max-w-lg relative z-10 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto no-scrollbar">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition-colors bg-gray-100 hover:bg-gray-200 p-2 rounded-full"
            >
              <X size={20} />
            </button>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Calendar size={28} className="text-[#5a32fa]" />
              Create Event
            </h2>
            
            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-1">Event Title</label>
                <input 
                  type="text" 
                  required
                  value={newEvent.title}
                  onChange={e => setNewEvent({...newEvent, title: e.target.value})}
                  className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 font-medium focus:outline-none focus:border-[#5a32fa] focus:bg-white transition-colors"
                  placeholder="e.g. AI in Healthcare Symposium"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1">Event Type</label>
                  <select 
                    value={newEvent.type}
                    onChange={e => setNewEvent({...newEvent, type: e.target.value})}
                    className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 font-medium focus:outline-none focus:border-[#5a32fa] focus:bg-white transition-colors appearance-none"
                  >
                    <option>Meetup</option>
                    <option>Conference</option>
                    <option>Workshop</option>
                    <option>Online Webinar</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1">Location</label>
                  <input 
                    type="text" 
                    required
                    value={newEvent.location}
                    onChange={e => setNewEvent({...newEvent, location: e.target.value})}
                    className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 font-medium focus:outline-none focus:border-[#5a32fa] focus:bg-white transition-colors"
                    placeholder="e.g. London or Zoom"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1">Month</label>
                  <select 
                    value={newEvent.month}
                    onChange={e => setNewEvent({...newEvent, month: e.target.value})}
                    className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 font-medium focus:outline-none focus:border-[#5a32fa] focus:bg-white transition-colors appearance-none"
                  >
                    <option>JAN</option><option>FEB</option><option>MAR</option>
                    <option>APR</option><option>MAY</option><option>JUN</option>
                    <option>JUL</option><option>AUG</option><option>SEP</option>
                    <option>OCT</option><option>NOV</option><option>DEC</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1">Day</label>
                  <input 
                    type="number" 
                    required min="1" max="31"
                    value={newEvent.day}
                    onChange={e => setNewEvent({...newEvent, day: e.target.value})}
                    className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 font-medium focus:outline-none focus:border-[#5a32fa] focus:bg-white transition-colors"
                    placeholder="25"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1">Time</label>
                  <input 
                    type="text" 
                    required
                    value={newEvent.time}
                    onChange={e => setNewEvent({...newEvent, time: e.target.value})}
                    className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 font-medium focus:outline-none focus:border-[#5a32fa] focus:bg-white transition-colors"
                    placeholder="10:00 AM"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-1">Description</label>
                <textarea 
                  required
                  value={newEvent.description}
                  onChange={e => setNewEvent({...newEvent, description: e.target.value})}
                  className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 font-medium focus:outline-none focus:border-[#5a32fa] focus:bg-white transition-colors resize-none h-24"
                  placeholder="What is this event about?"
                />
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-bold text-gray-900">Agenda</label>
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
                      className="w-1/3 bg-gray-50 border-2 border-gray-200 rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:border-[#5a32fa] focus:bg-white transition-colors"
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
                      className="w-2/3 bg-gray-50 border-2 border-gray-200 rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:border-[#5a32fa] focus:bg-white transition-colors"
                    />
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <button type="submit" className="w-full bg-[#00d26a] text-gray-900 px-6 py-4 rounded-xl font-bold text-lg border border-gray-100 hover:shadow-sm hover:-translate-y-0.5 transition-all active:translate-y-0 active:shadow-none">
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
