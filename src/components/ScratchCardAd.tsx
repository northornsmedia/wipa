'use client';

import React, { useRef, useEffect, useState } from 'react';

export default function ScratchCardAd() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (isRevealed) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // Load texture
    const img = new window.Image();
    img.src = 'https://www.transparenttextures.com/patterns/brushed-alum.png';
    
    const initCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#d7d7d7');
      gradient.addColorStop(0.5, '#f5f5f5');
      gradient.addColorStop(1, '#d7d7d7');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      if (img.complete) {
        ctx.globalCompositeOperation = 'multiply';
        const pattern = ctx.createPattern(img, 'repeat');
        if (pattern) {
          ctx.fillStyle = pattern;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        ctx.globalCompositeOperation = 'source-over';
      }
    };

    img.onload = initCanvas;
    initCanvas();

    const handleResize = () => {
      if (!isRevealed) initCanvas();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isRevealed]);

  const scratch = (x: number, y: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 40, 0, Math.PI * 2);
    ctx.fill();
  };

  const getPointerPos = (e: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const checkReveal = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparentPixels = 0;
    
    // Check alpha channel (every 4th value)
    // To speed up, we check every 4th pixel (stride = 16)
    const totalChecks = pixels.length / 16;
    for (let i = 3; i < pixels.length; i += 16) {
      if (pixels[i] < 128) {
        transparentPixels++;
      }
    }

    if (transparentPixels / totalChecks > 0.5) {
      setIsRevealed(true);
    }
  };

  const handleStart = (e: any) => {
    if (isRevealed) return;
    setIsDrawing(true);
    setHasStarted(true);
    const { x, y } = getPointerPos(e);
    scratch(x, y);
  };

  const handleMove = (e: any) => {
    if (!isDrawing || isRevealed) return;
    const { x, y } = getPointerPos(e);
    scratch(x, y);
    
    // Check occasionally during move for smoother reveal
    if (Math.random() < 0.1) {
      checkReveal();
    }
  };

  const handleEnd = () => {
    setIsDrawing(false);
    if (!isRevealed) {
      checkReveal();
    }
  };

  return (
    <div className="mb-12 relative w-full h-[180px] md:h-[200px] rounded-3xl overflow-hidden shadow-xl bg-[#0f172a] border-[3px] border-[#131313]">
      {/* The Hidden Prize */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-[#ffc900] via-[#ff90e8] to-[#5a32fa] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between z-0">
        <div className="text-center md:text-left flex-1">
          <div className="inline-block bg-white dark:bg-[#0f172a]/20 px-3 py-1 rounded-full text-white font-black text-[10px] md:text-xs mb-2 backdrop-blur-sm border border-white/30 shadow-sm animate-pulse">
            🎉 SECRET UNLOCKED
          </div>
          <h2 className="text-2xl md:text-4xl font-black text-white mb-1 tracking-tight leading-none drop-shadow-xl" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.3)' }}>
            JACKPOT ROLE!
          </h2>
          <p className="text-white font-bold text-sm md:text-base md:max-w-md drop-shadow-md">
            Director of AI Patents @ AGI Systems. $600k+ Equity. Remote.
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <a href="https://careers.google.com/" target="_blank" rel="noopener noreferrer" className="inline-block bg-[#131313] text-[#ffc900] px-8 py-3 md:py-4 rounded-xl font-black text-lg md:text-xl hover:scale-110 transition-transform duration-300 shadow-[0_5px_20px_rgba(0,0,0,0.4)] border-2 border-[#ffc900]">
            APPLY NOW
          </a>
        </div>
      </div>
      
      {/* The Scratch Layer */}
      <div className={`absolute inset-0 z-10 transition-all duration-[1200ms] ${isRevealed ? 'opacity-0 scale-110 rotate-3 pointer-events-none' : 'opacity-100'}`}>
        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-crosshair touch-none"
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
        />
        {/* Instruction overlay (passes pointer events to canvas) */}
        <div className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300 ${hasStarted ? 'opacity-0' : 'opacity-100'}`}>
           <div className="bg-[#131313] text-[#ffc900] px-6 md:px-8 py-3 md:py-4 rounded-full font-black text-base md:text-xl flex items-center gap-3 shadow-[0_5px_15px_rgba(0,0,0,0.2)] border-[3px] border-[#ffc900] animate-bounce">
              <span className="text-2xl md:text-3xl animate-[spin_3s_linear_infinite]">🪙</span> CLICK & DRAG TO SCRATCH
            </div>
        </div>
      </div>
    </div>
  );
}
