'use client';

import Image from 'next/image';

export default function AppLaunchSplash({ message = 'Connecting your global IP community…' }: { message?: string }) {
  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center overflow-hidden bg-[#16054a] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,#7c3cff_0%,#35118d_42%,#16054a_76%)]" />
      <div className="absolute h-72 w-72 rounded-full border border-white/10 animate-[ping_2.4s_ease-out_infinite]" />
      <div className="absolute h-52 w-52 rounded-full border border-fuchsia-300/20 animate-[ping_2.4s_ease-out_.6s_infinite]" />

      <div className="relative flex flex-col items-center px-8 text-center animate-in fade-in zoom-in-95 duration-500">
        <div className="relative h-32 w-32 overflow-hidden rounded-[2rem] border border-white/20 shadow-[0_24px_70px_rgba(0,0,0,.45)] sm:h-36 sm:w-36">
          <Image src="/mobilelogowipa.png" alt="WIPA" fill priority sizes="144px" className="object-cover" />
        </div>
        <h1 className="mt-6 text-3xl font-black tracking-[0.16em]">WIPA</h1>
        <p className="mt-2 text-sm font-medium text-purple-100/85">{message}</p>
        <div className="mt-7 h-1 w-32 overflow-hidden rounded-full bg-white/15">
          <div className="h-full w-1/2 rounded-full bg-gradient-to-r from-fuchsia-300 to-white animate-[wipa-loading_1.1s_ease-in-out_infinite]" />
        </div>
      </div>

      <style jsx>{`
        @keyframes wipa-loading {
          0% { transform: translateX(-110%); }
          100% { transform: translateX(210%); }
        }
      `}</style>
    </div>
  );
}
