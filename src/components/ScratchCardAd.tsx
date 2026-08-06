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
    <div className="mb-12 relative w-full h-[180px] md:h-[200px] rounded-3xl overflow-hidden shadow-xl border border-gray-100 dark:border-white/10 bg-white dark:bg-[#0f172a] group cursor-pointer flex items-center justify-center">
       <div className="absolute inset-0 bg-gradient-to-br from-[#5a32fa]/80 to-[#b892ff]/80 flex items-center justify-center text-white font-black text-2xl md:text-3xl tracking-widest opacity-80 group-hover:opacity-100 transition-opacity z-0">AD SPACE</div>
    </div>
  );
}
