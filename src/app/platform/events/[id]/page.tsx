'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { 
  Calendar, LayoutGrid, Users, Mail, UsersRound, FileText, Briefcase, GraduationCap,
  BadgeCheck, MapPin, Clock, ArrowLeft, ArrowRight, BookOpen, UserPlus, FileUp
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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
  
  const eventId = parseInt(params.id);
  const event = INITIAL_MOCK_EVENTS.find(e => e.id === eventId) || INITIAL_MOCK_EVENTS[0];
  const [isRegistered, setIsRegistered] = useState(event.isRegistered);

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* MAIN CONTENT */}
      <div className="w-full min-h-screen">
        <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8 pt-8">
          
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-500 font-bold mb-6 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} /> Back to Events
          </button>

          {/* Hero Card */}
          <div className="bg-white rounded-[2rem] border-4 border-[#131313] shadow-[8px_8px_0px_0px_#131313] overflow-hidden flex flex-col md:flex-row mb-8">
            <div className="md:w-64 border-b-4 md:border-b-0 md:border-r-4 border-[#131313] flex flex-col items-center justify-center p-8 md:p-12" style={{ backgroundColor: event.color }}>
              <div className="text-[#131313] font-black text-3xl tracking-widest uppercase">{event.month}</div>
              <div className="text-white text-7xl font-black mt-2" style={{ textShadow: '4px 4px 0 #131313' }}>{event.day}</div>
            </div>
            
            <div className="flex-1 p-8 md:p-10 flex flex-col justify-center relative">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-gray-100 text-gray-800 text-[11px] font-bold px-3 py-1 rounded-md uppercase tracking-wider border-2 border-gray-200">
                  {event.type}
                </span>
                {isRegistered && (
                  <span className="bg-[#00d26a] text-white text-[11px] font-bold px-3 py-1 rounded-md uppercase tracking-wider border-2 border-[#131313]">
                    Attending
                  </span>
                )}
              </div>
              
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 leading-tight">
                {event.title}
              </h1>
              
              <p className="text-lg text-gray-600 font-medium mb-6">
                {event.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="flex items-center gap-3 text-gray-700 font-bold bg-gray-50 p-3 rounded-xl border-2 border-gray-100">
                  <Clock size={20} className="text-[#5a32fa]" />
                  {event.time}
                </div>
                <div className="flex items-center gap-3 text-gray-700 font-bold bg-gray-50 p-3 rounded-xl border-2 border-gray-100">
                  <MapPin size={20} className="text-[#5a32fa]" />
                  {event.location}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 border-t-2 border-dashed border-gray-200 pt-6">
                <div className="flex-1 flex items-center -space-x-3 w-full">
                  <div className="w-10 h-10 rounded-full bg-blue-100 border-2 border-white flex justify-center items-center font-bold text-xs">AB</div>
                  <div className="w-10 h-10 rounded-full bg-pink-100 border-2 border-white flex justify-center items-center font-bold text-xs">CD</div>
                  <div className="w-10 h-10 rounded-full bg-green-100 border-2 border-white flex justify-center items-center font-bold text-xs">EF</div>
                  <div className="w-10 h-10 rounded-full bg-gray-100 border-2 border-white flex justify-center items-center font-bold text-xs">+{event.attendees}</div>
                  <span className="pl-4 text-sm font-bold text-gray-500">attending</span>
                </div>

                <button 
                  onClick={() => setIsRegistered(!isRegistered)}
                  className={`w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-black text-base border-2 border-[#131313] transition-all ${
                  isRegistered 
                    ? 'bg-white text-[#ff4b4b] border-gray-200 hover:border-[#ff4b4b] hover:bg-[#ff4b4b]/10' 
                    : 'bg-[#131313] text-white hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_#5a32fa]'
                }`}>
                  {isRegistered ? 'Cancel Registration' : 'Register Now'}
                  {!isRegistered && <ArrowRight size={18} />}
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-[2rem] border-4 border-[#131313] p-8">
                <h2 className="text-xl font-black mb-4">About this Event</h2>
                <p className="text-gray-600 font-medium leading-relaxed mb-4">
                  Join us for an exclusive gathering of IP professionals, legal experts, and tech innovators as we explore the rapidly evolving landscape of our industry. This event is designed to provide actionable insights, foster meaningful connections, and equip you with the knowledge to navigate future challenges.
                </p>
                <p className="text-gray-600 font-medium leading-relaxed">
                  Whether you're a seasoned practitioner or just starting out, you'll find valuable perspectives in our keynote speeches, panel discussions, and interactive workshops. Don't miss this opportunity to stay ahead of the curve.
                </p>
              </div>

              <div className="bg-white rounded-[2rem] border-4 border-[#131313] p-8">
                <h2 className="text-xl font-black mb-4">Agenda</h2>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="font-black text-[#5a32fa] w-16">10:00</div>
                    <div>
                      <h4 className="font-bold">Welcome & Keynote</h4>
                      <p className="text-sm text-gray-500 font-medium">Opening remarks and industry overview.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="font-black text-[#5a32fa] w-16">11:30</div>
                    <div>
                      <h4 className="font-bold">Panel Discussion</h4>
                      <p className="text-sm text-gray-500 font-medium">Deep dive into current trends.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="font-black text-[#5a32fa] w-16">13:00</div>
                    <div>
                      <h4 className="font-bold">Networking Lunch</h4>
                      <p className="text-sm text-gray-500 font-medium">Connect with peers over lunch.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl border-2 border-[#131313] p-6 shadow-[4px_4px_0px_0px_#131313]">
                <h3 className="font-black mb-4">Host</h3>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#131313] text-white flex items-center justify-center font-bold text-xl">W</div>
                  <div>
                    <h4 className="font-bold">WIPA Admin</h4>
                    <p className="text-xs font-bold text-gray-500">Event Organizer</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-[#5a32fa]/10 rounded-2xl border-2 border-[#5a32fa] p-6">
                <h3 className="font-black text-[#5a32fa] mb-2">Need help?</h3>
                <p className="text-sm font-medium text-gray-600 mb-4">Have questions about registration or accessibility?</p>
                <button className="w-full bg-white text-[#5a32fa] font-bold py-2 rounded-xl border-2 border-[#5a32fa] hover:bg-[#5a32fa] hover:text-white transition-colors">
                  Contact Organizer
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
