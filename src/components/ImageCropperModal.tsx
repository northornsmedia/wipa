'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, Check, ZoomIn, ZoomOut, RotateCw, Move, Sparkles, Image as ImageIcon } from 'lucide-react';
import { compressImage } from '@/lib/imageCompressor';

interface ImageCropperModalProps {
  isOpen: boolean;
  imageSrc: string;
  title?: string;
  recommendedPx?: string;
  aspectRatio?: number; // width / height (e.g. 1 for 1:1, 3 for 3:1)
  shape?: 'square' | 'rounded' | 'banner';
  onClose: () => void;
  onCropComplete: (croppedBlob: Blob, previewUrl: string) => void;
}

export default function ImageCropperModal({
  isOpen,
  imageSrc,
  title = "Crop & Frame Image",
  recommendedPx = "500 × 500 px (1:1 Ratio)",
  aspectRatio = 1,
  shape = 'rounded',
  onClose,
  onCropComplete,
}: ImageCropperModalProps) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Reset states on new image
  useEffect(() => {
    if (isOpen) {
      setZoom(1);
      setPan({ x: 0, y: 0 });
      setImageLoaded(false);
    }
  }, [isOpen, imageSrc]);

  // Mouse & Touch Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX - pan.x, y: e.touches[0].clientY - pan.y });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    setPan({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Perform High-Resolution Canvas Crop
  const handleConfirmCrop = useCallback(() => {
    if (!imageRef.current || !containerRef.current) return;

    const img = imageRef.current;
    const container = containerRef.current;
    const cropFrame = container.getBoundingClientRect();

    // Export dimensions
    const exportWidth = aspectRatio === 1 ? 600 : 1200;
    const exportHeight = Math.round(exportWidth / aspectRatio);

    const canvas = document.createElement('canvas');
    canvas.width = exportWidth;
    canvas.height = exportHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background color
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, exportWidth, exportHeight);

    // Calculate image position relative to the crop frame
    const imgRect = img.getBoundingClientRect();

    const scaleX = img.naturalWidth / imgRect.width;
    const scaleY = img.naturalHeight / imgRect.height;

    const sourceX = (cropFrame.left - imgRect.left) * scaleX;
    const sourceY = (cropFrame.top - imgRect.top) * scaleY;
    const sourceWidth = cropFrame.width * scaleX;
    const sourceHeight = cropFrame.height * scaleY;

    // Set image smoothing for maximum crispness
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(
      img,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      0,
      0,
      exportWidth,
      exportHeight
    );

    // Single-pass optimal compression (< 80KB for avatar, < 200KB for banner)
    canvas.toBlob(
      (blob) => {
        if (blob) {
          const previewUrl = URL.createObjectURL(blob);
          onCropComplete(blob, previewUrl);
          onClose();
        }
      },
      'image/webp',
      0.86
    );
  }, [aspectRatio, onCropComplete, onClose]);

  if (!isOpen || !imageSrc) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#11141f] rounded-[2rem] max-w-xl w-full border border-gray-200 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-5 border-b border-gray-200 dark:border-white/10 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
              <ImageIcon size={20} className="text-[#5a32fa]" />
              {title}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[11px] font-bold bg-[#5a32fa]/10 text-[#5a32fa] dark:text-indigo-300 px-2.5 py-0.5 rounded-full border border-[#5a32fa]/20">
                Recommended: {recommendedPx}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Interactive Cropper Viewport */}
        <div className="p-6 flex flex-col items-center justify-center bg-gray-950 select-none overflow-hidden relative min-h-[320px]">
          
          {/* Instruction tooltip */}
          <div className="absolute top-3 left-4 z-20 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[11px] text-white/90 font-medium flex items-center gap-1.5 pointer-events-none">
            <Move size={12} /> Drag to reposition • Scroll or slide to zoom
          </div>

          {/* Crop Frame Box */}
          <div
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className={`relative overflow-hidden cursor-grab active:cursor-grabbing border-2 border-[#5a32fa] shadow-2xl flex items-center justify-center ${
              shape === 'rounded' 
                ? 'rounded-3xl' 
                : shape === 'banner'
                ? 'rounded-2xl'
                : 'rounded-2xl'
            }`}
            style={{
              width: aspectRatio === 1 ? '260px' : '100%',
              maxWidth: aspectRatio === 1 ? '260px' : '480px',
              height: aspectRatio === 1 ? '260px' : `${480 / aspectRatio}px`,
              maxHeight: '280px',
            }}
          >
            {/* Image being dragged/zoomed */}
            <img
              ref={imageRef}
              src={imageSrc}
              alt="Crop target"
              draggable={false}
              onLoad={() => setImageLoaded(true)}
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                transformOrigin: 'center center',
                transition: isDragging ? 'none' : 'transform 0.05s ease-out',
                maxWidth: 'none',
                maxHeight: 'none',
                minWidth: '100%',
                minHeight: '100%',
                objectFit: 'cover',
                pointerEvents: 'none'
              }}
            />

            {/* Grid overlay for rule-of-thirds precision */}
            <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-20">
              <div className="border-r border-b border-white" />
              <div className="border-r border-b border-white" />
              <div className="border-b border-white" />
              <div className="border-r border-b border-white" />
              <div className="border-r border-b border-white" />
              <div className="border-b border-white" />
              <div className="border-r border-white" />
              <div className="border-r border-white" />
              <div />
            </div>
          </div>

          {/* Dimension Tag */}
          <div className="mt-3 text-[11px] text-gray-400 font-bold flex items-center gap-1.5">
            <span>Aspect Ratio {aspectRatio === 1 ? '1:1 (Square)' : '3:1 (Panoramic)'}</span>
            <span>•</span>
            <span className="text-indigo-400">Target Resolution: {recommendedPx.split('(')[0]}</span>
          </div>

        </div>

        {/* Controls & Sliders */}
        <div className="p-5 bg-white dark:bg-[#11141f] border-t border-gray-200 dark:border-white/10 space-y-4">
          
          {/* Zoom Slider */}
          <div className="flex items-center gap-3">
            <ZoomOut size={16} className="text-gray-400" />
            <input
              type="range"
              min="1"
              max="3"
              step="0.05"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="flex-1 accent-[#5a32fa] h-2 bg-gray-200 dark:bg-white/10 rounded-lg cursor-pointer"
            />
            <ZoomIn size={16} className="text-gray-400" />
            <span className="text-xs font-bold text-gray-500 w-10 text-right">{Math.round(zoom * 100)}%</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/15 text-gray-700 dark:text-gray-300 py-3 rounded-xl font-bold text-xs cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmCrop}
              className="flex-1 bg-gradient-to-r from-[#5a32fa] to-[#7952ff] hover:from-[#4927cb] hover:to-[#6841ea] text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-500/25 transition-all active:scale-95"
            >
              <Check size={16} strokeWidth={2.5} />
              <span>Apply & Save Frame</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
