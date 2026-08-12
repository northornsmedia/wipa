import React from "react";

export function VideoText({ src, children }: { src: string; children: React.ReactNode }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <video
        src={src}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="relative z-10 flex h-full w-full items-center justify-center bg-black mix-blend-multiply">
        <h1 className="text-5xl font-black uppercase tracking-tighter text-white sm:text-7xl md:text-[8rem] text-center">
          {children}
        </h1>
      </div>
    </div>
  );
}
