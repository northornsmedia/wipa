'use client';

import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { 
  Calendar, LayoutGrid, Users, Mail, UsersRound, FileText, Briefcase, GraduationCap,
  Calendar, LayoutGrid, Users, Mail, UsersRound, FileText, Briefcase, GraduationCap,
  BadgeCheck, MapPin, Clock, ArrowLeft, ArrowRight, BookOpen, UserPlus, FileUp, Star
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

// Duplicated for now to avoid needing a separate file for shared state
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

export default function EventDetailsPage({ params }: { params: { id: string } }) {
  const { user } = useAppStore();
  const router = useRouter();
  
  const eventId = params.id;
  const [event, setEvent] = useState<any>(null);
  const [sponsors, setSponsors] = useState<any[]>([]);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      setIsLoading(true);
      const { data: eventData } = await supabase
        .from('events')
        .select(`
          *,
          organizer:profiles(id, full_name, role, is_wipa_recommended)
        `)
        .eq('id', eventId)
        .single();
        
      if (eventData) {
        let attendeesCount = 0;
        const { count } = await supabase
          .from('event_registrations')
          .select('*', { count: 'exact', head: true })
          .eq('event_id', eventId);
        attendeesCount = count || 0;
        
        let userRegistered = false;
        if (user?.id) {
          const { data: myReg } = await supabase
            .from('event_registrations')
            .select('*')
            .eq('event_id', eventId)
            .eq('user_id', user.id)
            .maybeSingle();
          if (myReg) userRegistered = true;
        }

        const date = new Date(eventData.event_date);
        const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
        const day = date.getDate().toString();
        let time = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        if (eventData.end_date) {
          const endDate = new Date(eventData.end_date);
          time += ' - ' + endDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        }
        
        setEvent({
          id: eventData.id,
          title: eventData.title,
          type: eventData.is_virtual ? 'Online Event' : 'In-Person',
          location: eventData.location || 'TBA',
          time,
          month,
          day,
          attendees: attendeesCount,
          color: eventData.cover_image_url || ['#5a32fa', '#ff90e8', '#00d26a', '#ffc900'][Math.floor(Math.random() * 4)],
          description: eventData.description,
          organizerName: eventData.organizer?.full_name || 'WIPA Admin',
          organizerRole: eventData.organizer?.role || 'Event Organizer',
          organizerIsWipaRecommended: eventData.organizer?.is_wipa_recommended
        });
        setIsRegistered(userRegistered);
        
        // Fetch sponsors
        const { data: sponsorData } = await supabase
          .from('event_sponsorships')
          .select('*, package:sponsorship_packages(*)')
          .eq('event_id', eventId)
          .in('status', ['approved', 'paid']);
          
        if (sponsorData) setSponsors(sponsorData);
      }
      setIsLoading(false);
    };
    
    fetchEvent();
  }, [eventId, user?.id]);
  
  const handleToggleRegistration = async () => {
    if (!user?.id || !event) return;
    
    if (isRegistered) {
      await supabase.from('event_registrations').delete().match({ event_id: event.id, user_id: user.id });
      setEvent({ ...event, attendees: event.attendees - 1 });
      setIsRegistered(false);
    } else {
      await supabase.from('event_registrations').insert({ event_id: event.id, user_id: user.id });
      setEvent({ ...event, attendees: event.attendees + 1 });
      setIsRegistered(true);
    }
  };

  if (isLoading || !event) {
    return <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0f172a] flex items-center justify-center font-bold text-gray-500">Loading Event...</div>;
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0f172a]">
      {/* MAIN CONTENT */}
      <div className="w-full min-h-screen">
        <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8 pt-8">
          
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-500 dark:text-gray-400 font-bold mb-6 hover:text-gray-900 dark:text-white transition-colors"
          >
            <ArrowLeft size={20} /> Back to Events
          </button>

          {/* Hero Card */}
          <div className="bg-white dark:bg-[#0f172a] rounded-[2rem] border-4 border-[#131313] shadow-[8px_8px_0px_0px_#131313] overflow-hidden flex flex-col md:flex-row mb-8">
            <div className="md:w-64 border-b-4 md:border-b-0 md:border-r-4 border-[#131313] flex flex-col items-center justify-center p-8 md:p-12" style={{ backgroundColor: event.color }}>
              <div className="text-[#131313] font-black text-3xl tracking-widest uppercase">{event.month}</div>
              <div className="text-white text-7xl font-black mt-2" style={{ textShadow: '4px 4px 0 #131313' }}>{event.day}</div>
            </div>
            
            <div className="flex-1 p-8 md:p-10 flex flex-col justify-center relative">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-gray-100 text-[11px] font-bold px-3 py-1 rounded-md uppercase tracking-wider border-2 border-gray-200 dark:border-white/20">
                  {event.type}
                </span>
                {isRegistered && (
                  <span className="bg-[#00d26a] text-white text-[11px] font-bold px-3 py-1 rounded-md uppercase tracking-wider border-2 border-[#131313]">
                    Attending
                  </span>
                )}
              </div>
              
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-4 leading-tight">
                {event.title}
              </h1>
              
              <p className="text-lg text-gray-600 dark:text-gray-300 font-medium mb-6">
                {event.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-200 font-bold bg-gray-50 dark:bg-white/5 p-3 rounded-xl border-2 border-gray-100 dark:border-white/10">
                  <Clock size={20} className="text-[#5a32fa]" />
                  {event.time}
                </div>
                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-200 font-bold bg-gray-50 dark:bg-white/5 p-3 rounded-xl border-2 border-gray-100 dark:border-white/10">
                  <MapPin size={20} className="text-[#5a32fa]" />
                  {event.location}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 border-t-2 border-dashed border-gray-200 dark:border-white/20 pt-6">
                <div className="flex-1 flex items-center -space-x-3 w-full">
                  <div className="w-10 h-10 rounded-full bg-blue-100 border-2 border-white flex justify-center items-center font-bold text-xs">AB</div>
                  <div className="w-10 h-10 rounded-full bg-pink-100 border-2 border-white flex justify-center items-center font-bold text-xs">CD</div>
                  <div className="w-10 h-10 rounded-full bg-green-100 border-2 border-white flex justify-center items-center font-bold text-xs">EF</div>
                  <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/10 border-2 border-white flex justify-center items-center font-bold text-xs">+{event.attendees}</div>
                  <span className="pl-4 text-sm font-bold text-gray-500 dark:text-gray-400">attending</span>
                </div>

                <button 
                  onClick={handleToggleRegistration}
                  className={`w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-black text-base border-2 border-[#131313] transition-all ${
                  isRegistered 
                    ? 'bg-white dark:bg-[#0f172a] text-[#ff4b4b] border-gray-200 dark:border-white/20 hover:border-[#ff4b4b] hover:bg-[#ff4b4b]/10' 
                    : 'bg-[#131313] text-white hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_#5a32fa]'
                }`}>
                  {isRegistered ? 'Cancel Registration' : 'Register Now'}
                  {!isRegistered && <ArrowRight size={18} />}
                </button>
              </div>
            </div>
          </div>
          
          {/* Sponsor Banner (If any sponsor has banner_placement) */}
          {sponsors.some(s => s.package?.banner_placement) && (
            <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-[2rem] p-1 border border-gray-700 mb-8 overflow-hidden shadow-2xl relative">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
              <div className="bg-white/5 backdrop-blur-sm rounded-[1.8rem] p-6 flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="bg-yellow-500/20 text-yellow-400 p-2 rounded-xl">
                    <Star size={24} fill="currentColor" />
                  </div>
                  <div>
                    <div className="text-gray-400 font-bold text-sm tracking-wider uppercase">Premium Sponsor</div>
                    <div className="text-white font-black text-2xl">{sponsors.find(s => s.package?.banner_placement)?.sponsor_name}</div>
                  </div>
                </div>
                <div className="text-gray-300 font-medium max-w-sm text-center sm:text-left italic">
                  "{sponsors.find(s => s.package?.banner_placement)?.sponsor_tagline || 'Proudly supporting WIPA'}"
                </div>
                {sponsors.find(s => s.package?.banner_placement)?.sponsor_website_url && (
                  <a href={sponsors.find(s => s.package?.banner_placement)?.sponsor_website_url} target="_blank" rel="noopener noreferrer" className="bg-white text-gray-900 px-6 py-2 rounded-xl font-bold hover:bg-gray-200 transition-colors shrink-0">
                    Visit Sponsor
                  </a>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white dark:bg-[#0f172a] rounded-[2rem] border-4 border-[#131313] p-8">
                <h2 className="text-xl font-black mb-4">About this Event</h2>
                <p className="text-gray-600 dark:text-gray-300 font-medium leading-relaxed mb-4">
                  Join us for an exclusive gathering of IP professionals, legal experts, and tech innovators as we explore the rapidly evolving landscape of our industry. This event is designed to provide actionable insights, foster meaningful connections, and equip you with the knowledge to navigate future challenges.
                </p>
                <p className="text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
                  Whether you're a seasoned practitioner or just starting out, you'll find valuable perspectives in our keynote speeches, panel discussions, and interactive workshops. Don't miss this opportunity to stay ahead of the curve.
                </p>
              </div>

              <div className="bg-white dark:bg-[#0f172a] rounded-[2rem] border-4 border-[#131313] p-8">
                <h2 className="text-xl font-black mb-4">Agenda</h2>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="font-black text-[#5a32fa] w-16">10:00</div>
                    <div>
                      <h4 className="font-bold">Welcome & Keynote</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Opening remarks and industry overview.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="font-black text-[#5a32fa] w-16">11:30</div>
                    <div>
                      <h4 className="font-bold">Panel Discussion</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Deep dive into current trends.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="font-black text-[#5a32fa] w-16">13:00</div>
                    <div>
                      <h4 className="font-bold">Networking Lunch</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Connect with peers over lunch.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {sponsors.length > 0 && (
                <div className="bg-white dark:bg-[#0f172a] rounded-[2rem] border-4 border-[#131313] p-8">
                  <h2 className="text-xl font-black mb-6">Proudly Sponsored By</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                    {sponsors.map(sponsor => (
                      <a key={sponsor.id} href={sponsor.sponsor_website_url} target="_blank" rel="noopener noreferrer" className="bg-gray-50 dark:bg-black/20 rounded-2xl p-4 border-2 border-transparent hover:border-gray-200 dark:hover:border-white/10 flex flex-col items-center justify-center text-center gap-3 transition-colors group">
                        <div className={`w-16 h-16 rounded-xl flex items-center justify-center font-black text-2xl shadow-sm ${
                          sponsor.package?.name.includes('Gold') ? 'bg-gradient-to-br from-yellow-300 to-yellow-600 text-white' :
                          sponsor.package?.name.includes('Silver') ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-white' :
                          'bg-gradient-to-br from-orange-300 to-orange-700 text-white'
                        }`}>
                          {sponsor.sponsor_name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 dark:text-white group-hover:text-[#5a32fa] transition-colors">{sponsor.sponsor_name}</div>
                          <div className="text-xs text-gray-500">{sponsor.package?.name}</div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="bg-white dark:bg-[#0f172a] rounded-2xl border-2 border-[#131313] p-6 shadow-[4px_4px_0px_0px_#131313]">
                <h3 className="font-black mb-4">Host</h3>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#131313] text-white flex items-center justify-center font-bold text-xl">
                    {event.organizerName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold flex items-center gap-1">{event.organizerName} {event.organizerIsWipaRecommended && <span className="text-[9px] bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 px-1 py-0.5 rounded-full whitespace-nowrap ml-1">⭐ WIPA</span>}</h4>
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400">{event.organizerRole}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-[#5a32fa]/10 rounded-2xl border-2 border-[#5a32fa] p-6">
                <h3 className="font-black text-[#5a32fa] mb-2">Need help?</h3>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-4">Have questions about registration or accessibility?</p>
                <button className="w-full bg-white dark:bg-[#0f172a] text-[#5a32fa] font-bold py-2 rounded-xl border-2 border-[#5a32fa] hover:bg-[#5a32fa] hover:text-white transition-colors">
                  Contact Organizer
                </button>
              </div>

              {/* Sponsorship Opportunities */}
              <div className="bg-gradient-to-br from-[#ffc900]/20 to-[#ff90e8]/20 rounded-2xl border-2 border-[#ffc900] p-6 shadow-[4px_4px_0px_0px_#ffc900]">
                <h3 className="font-black text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <Star size={20} className="text-[#ffc900]" fill="currentColor" /> Become a Sponsor
                </h3>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                  Boost your brand visibility. Support WIPA and connect with industry leaders.
                </p>
                <button onClick={() => router.push(`/platform/events/${eventId}/sponsor`)} className="w-full bg-[#131313] dark:bg-white text-white dark:text-[#131313] font-black py-3 rounded-xl hover:-translate-y-1 hover:shadow-lg transition-all flex justify-center items-center gap-2">
                  View Packages <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
