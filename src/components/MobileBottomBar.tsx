import Link from 'next/link';
import { MessageSquare, Users, Home, MessageCircle, Briefcase } from 'lucide-react';

export default function MobileBottomBar() {
  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full bg-[#fbe8d5] bg-grid-pattern border-t-[1.5px] border-black z-40 flex items-center justify-around py-2 px-2 shadow-[0px_-4px_0px_0px_rgba(19,19,19,0.05)]">
      <Link href="/platform/messages" className="flex flex-col items-center gap-1 text-[#1a1a1a] hover:opacity-70 transition-opacity">
        <MessageSquare size={22} strokeWidth={2.5} />
        <span className="text-[10px] font-bold">Messages</span>
      </Link>
      <Link href="/platform/network" className="flex flex-col items-center gap-1 text-[#1a1a1a] hover:opacity-70 transition-opacity">
        <Users size={22} strokeWidth={2.5} />
        <span className="text-[10px] font-bold">Network</span>
      </Link>
      
      {/* Center Home Button */}
      <Link href="/platform" className="relative -top-6 flex flex-col items-center justify-center w-14 h-14 bg-[#b892ff] text-[#131313] rounded-full border-[1.5px] border-black shadow-[3px_3px_0px_0px_#131313] hover:shadow-[1px_1px_0px_0px_#131313] hover:translate-y-px transition-all">
        <Home size={26} strokeWidth={2.5} />
      </Link>

      <Link href="/platform/forums" className="flex flex-col items-center gap-1 text-[#1a1a1a] hover:opacity-70 transition-opacity">
        <MessageCircle size={22} strokeWidth={2.5} />
        <span className="text-[10px] font-bold">Forums</span>
      </Link>
      <Link href="/platform/jobs" className="flex flex-col items-center gap-1 text-[#1a1a1a] hover:opacity-70 transition-opacity">
        <Briefcase size={22} strokeWidth={2.5} />
        <span className="text-[10px] font-bold">Jobs</span>
      </Link>
    </div>
  );
}
