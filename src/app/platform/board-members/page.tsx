"use client";

import FluidExpandingGrid from "@/components/ui/fluid-expanding-grid";
import { Sparkles, Users, Award, ShieldCheck, Globe2, Crown } from "lucide-react";

export default function BoardMembersPage() {
  const roles = [
    { name: "Alliance President", icon: Crown, color: "text-amber-500", bg: "bg-amber-500/10 border-amber-500/20" },
    { name: "Advisory Board", icon: ShieldCheck, color: "text-emerald-500", bg: "bg-emerald-500/10 border-emerald-500/20" },
    { name: "Regional Chairs", icon: Globe2, color: "text-pink-500", bg: "bg-pink-500/10 border-pink-500/20" },
    { name: "Community Ambassadors", icon: Sparkles, color: "text-yellow-500", bg: "bg-yellow-500/10 border-yellow-500/20" },
    { name: "Regional Representatives", icon: Users, color: "text-indigo-500", bg: "bg-indigo-500/10 border-indigo-500/20" },
  ];

  return (
    <div className="relative z-0 flex flex-col items-center w-full min-h-screen bg-transparent pb-24">
      
      {/* Solid Background Color */}
      <div className="absolute inset-0 -z-30 bg-white dark:bg-[#0a0a0f]" />
      
      {/* Ice Blue Diagonal Pattern Lines Overlay */}
      <div 
        className="absolute inset-0 -z-20 opacity-5" 
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, #7dd3fc 0, #7dd3fc 1px, transparent 1px, transparent 40px)`
        }}
      />
      
      {/* Ice Blue Glowing Orbs */}
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute left-0 right-0 top-[5%] m-auto h-[200px] w-[200px] rounded-full bg-cyan-400 opacity-30 dark:opacity-20 blur-[80px]" />
        <div className="absolute left-1/4 right-0 top-[10%] m-auto h-[250px] w-[250px] rounded-full bg-blue-500 opacity-20 dark:opacity-10 blur-[100px]" />
      </div>

      <div className="w-full px-6 pt-8 pb-12">
        {/* Header Section */}
        <div className="text-center w-full mx-auto mb-8 relative z-10">
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white tracking-tighter mb-6 leading-[1.1]">
            LED BY RESPECTED <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5a32fa] to-[#ff90e8]">
              GLOBAL IP LEADERS
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 font-medium leading-relaxed w-full mx-auto">
            The Alliance is guided by experienced professionals who share a common vision of empowering women <br className="hidden md:block" />
            through collaboration, education, and leadership.
          </p>
        </div>

        {/* Roles Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 mb-10 relative z-10">
          {roles.map((role) => (
            <div 
              key={role.name}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border backdrop-blur-md shadow-sm transition-all hover:-translate-y-1 ${role.bg}`}
            >
              <role.icon size={16} className={role.color} />
              <span className="text-sm font-bold text-gray-800 dark:text-gray-200 tracking-wide">
                {role.name}
              </span>
            </div>
          ))}
        </div>

        {/* The Grid Component */}
        <div className="relative z-10">
          <FluidExpandingGrid />
        </div>
      </div>
    </div>
  );
}
