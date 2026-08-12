"use client";

import React from "react";
import { Database, Bot, Zap, PenTool, MessageSquare, Brain, Code2, Terminal } from "lucide-react";

// Mocking the ParticleSphereAnimation since it wasn't provided in the prompt
const ParticleSphereAnimation = () => {
  return (
    <div className="w-full h-full rounded-full bg-gradient-to-br from-[#5a32fa]/20 to-[#ff90e8]/20 border border-[#5a32fa]/30 animate-pulse flex items-center justify-center shadow-[0_0_40px_rgba(90,50,250,0.4)] backdrop-blur-xl">
      <div className="w-2/3 h-2/3 rounded-full bg-gradient-to-br from-[#5a32fa] to-[#ff90e8] blur-xl opacity-50" />
      <div className="absolute inset-0 rounded-full border-[1px] border-dashed border-white/40 animate-[spin_10s_linear_infinite]" />
    </div>
  );
};

const orbits = [
  {
    size: "w-[220px] h-[220px] md:w-[360px] md:h-[360px]",
    duration: 18,
    icons: [
      { icon: <Database className="text-[#5a32fa]" size={18} />, angle: -60 },
      { icon: <Bot className="text-[#ff90e8]" size={18} />, angle: 0 },
      { icon: <Zap className="text-yellow-400" size={18} />, angle: 60 },
    ],
  },
  {
    size: "w-[300px] h-[300px] md:w-[440px] md:h-[440px]",
    duration: 24,
    icons: [
      { icon: <PenTool className="text-pink-500" size={18} />, angle: 0 },
      { icon: <MessageSquare className="text-blue-400" size={18} />, angle: -90 },
    ],
  },
  {
    size: "w-[360px] h-[360px] md:w-[530px] md:h-[530px]",
    duration: 30,
    icons: [
      { icon: <Brain className="text-purple-500" size={18} />, angle: -60 },
      { icon: <Code2 className="text-cyan-400" size={18} />, angle: 0 },
      { icon: <Terminal className="text-green-400" size={18} />, angle: 60 },
    ],
  },
];

export default function OrbitingCirclesGlobe() {
  return (
    <div className="relative w-full h-[200px] md:h-[300px] overflow-hidden flex justify-center mt-auto">
      <style>{`
        @keyframes orbit-cw {
          from { transform: rotate(var(--start-angle)) }
          to   { transform: rotate(calc(var(--start-angle) + 360deg)) }
        }
        @keyframes orbit-ccw {
          from { transform: rotate(var(--start-angle)) }
          to   { transform: rotate(calc(var(--start-angle) - 360deg)) }
        }
        @keyframes counter-cw {
          from { transform: rotate(var(--counter-offset, 0deg)) }
          to   { transform: rotate(calc(var(--counter-offset, 0deg) - 360deg)) }
        }
        @keyframes counter-ccw {
          from { transform: rotate(var(--counter-offset, 0deg)) }
          to   { transform: rotate(calc(var(--counter-offset, 0deg) + 360deg)) }
        }
      `}</style>

      {/* Center particle globe */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 aspect-square pointer-events-none w-[150px] md:w-[290px] z-10">
        <ParticleSphereAnimation />
      </div>

      {/* Orbiting rings */}
      {orbits.map((orbit, index) => {
        const isCW = index % 2 === 0;
        const orbitAnim = isCW ? "orbit-cw" : "orbit-ccw";
        const counterAnim = isCW ? "counter-cw" : "counter-ccw";

        const allIcons = [
          ...orbit.icons,
          ...orbit.icons.map((ic) => ({
            ...ic,
            angle: ic.angle + 180,
          })),
        ];

        return (
          <div
            key={index}
            className={`absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rounded-full border border-gray-200 dark:border-white/10 ${orbit.size}`}
          >
            {allIcons.map((iconData, iconIndex) => (
              <div
                key={iconIndex}
                className="absolute top-0 left-1/2 h-1/2 -ml-5 origin-bottom flex flex-col justify-start items-center"
                style={
                  {
                    "--start-angle": `${iconData.angle}deg`,
                    animation: `${orbitAnim} ${orbit.duration}s linear infinite`,
                  } as React.CSSProperties
                }
              >
                <div
                  className="w-10 h-10 border border-gray-200 dark:border-white/20 rounded-full bg-white dark:bg-[#0f172a] shadow-sm -mt-5 relative z-10 flex items-center justify-center"
                  style={
                    {
                      "--counter-offset": `${-iconData.angle}deg`,
                      animation: `${counterAnim} ${orbit.duration}s linear infinite`,
                    } as React.CSSProperties
                  }
                >
                  {iconData.icon}
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
