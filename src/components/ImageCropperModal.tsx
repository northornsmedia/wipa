'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, Check, ZoomIn, ZoomOut, RotateCw, Move, Sparkles, Image as ImageIcon, User } from 'lucide-react';
import { compressImage } from '@/lib/imageCompressor';

interface ImageCropperModalProps {
  isOpen: boolean;
  imageSrc: string;
  title?: string;
  recommendedPx?: string;
  aspectRatio?: number; // width / height (e.g. 1 for 1:1, 3.2 for 3.2:1)
  shape?: 'square' | 'rounded' | 'banner';
  showAvatarGuide?: boolean; // Shows bottom-left avatar positioning outline
  onClose: () => void;
  onCropComplete: (croppedBlob: Blob, previewUrl: string) => void;
}

export default function ImageCropperModal({
  isOpen,
  imageSrc,
  title = "Crop & Frame Image",
  recommendedPx = "1440 × 450 px (3.2:1 Ratio)",
  aspectRatio = 1,
  shape = 'rounded',
  showAvatarGuide = false,
  onClose,
  onCropComplete,
}: ImageCropperModalProps) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Reset states on new image
  useEffect(() => {
    if (isOpen) {
      setZoom(1);
      setPan({ x: 0, y: 0 });
      setImageLoaded(false);
      setIsProcessing(false);
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

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setZoom((prev) => {
      const next = prev - e.deltaY * 0.0015;
      return Math.min(3, Math.max(0.8, parseFloat(next.toFixed(3))));
    });
  };

  // Perform High-Resolution Canvas Crop + WebP Compression
  const handleConfirmCrop = useCallback(async () => {
    if (!imageRef.current || !containerRef.current || isProcessing) return;
    setIsProcessing(true);

    try {
      const img = imageRef.current;
      const container = containerRef.current;
      const cropFrame = container.getBoundingClientRect();

      // Target export resolution (1440 for banner, 600 for avatar)
      const exportWidth = aspectRatio === 1 ? 600 : 1440;
      const exportHeight = Math.round(exportWidth / aspectRatio);

      const canvas = document.createElement('canvas');
      canvas.width = exportWidth;
      canvas.height = exportHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Background fill
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, exportWidth, exportHeight);

      // Calculate position relative to crop frame
      const imgRect = img.getBoundingClientRect();
      const scaleX = img.naturalWidth / imgRect.width;
      const scaleY = img.naturalHeight / imgRect.height;

      const sourceX = (cropFrame.left - imgRect.left) * scaleX;
      const sourceY = (cropFrame.top - imgRect.top) * scaleY;
      const sourceWidth = cropFrame.width * scaleX;
      const sourceHeight = cropFrame.height * scaleY;

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

      // Convert to WebP blob with optimal size compression (< 150KB)
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const previewUrl = URL.createObjectURL(blob);
            onCropComplete(blob, previewUrl);
            onClose();
          }
          setIsProcessing(false);
        },
        'image/webp',
        0.85
      );
    } catch (err) {
      console.error('Crop processing failed', err);
      setIsProcessing(false);
    }
  }, [aspectRatio, onCropComplete, onClose, isProcessing]);

  if (!isOpen || !imageSrc) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#11141f] rounded-2xl sm:rounded-3xl max-w-2xl w-full border border-gray-200 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-200 dark:border-white/10 flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
              <ImageIcon size={20} className="text-[#5a32fa]" />
              {title}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[11px] font-bold bg-[#5a32fa]/10 text-[#5a32fa] dark:text-indigo-300 px-2.5 py-0.5 rounded-full border border-[#5a32fa]/20">
                Display Preview: {recommendedPx}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Interactive Cropper Viewport */}
        <div className="p-4 sm:p-6 flex flex-col items-center justify-center bg-gray-950 select-none overflow-hidden relative min-h-[300px] sm:min-h-[340px]">
          
          {/* Instruction tooltip */}
          <div className="absolute top-3 left-4 z-20 bg-black/75 backdrop-blur-md px-3 py-1 rounded-full text-[11px] text-white/90 font-medium flex items-center gap-1.5 pointer-events-none border border-white/10">
            <Move size={12} /> Drag image to position • Use slider to zoom
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
            onWheel={handleWheel}
            className={`relative overflow-hidden cursor-grab active:cursor-grabbing border-2 border-[#5a32fa] shadow-2xl flex items-center justify-center ${
              shape === 'rounded' 
                ? 'rounded-full' 
                : 'rounded-xl sm:rounded-2xl'
            }`}
            style={{
              width: aspectRatio === 1 ? '240px' : '100%',
              maxWidth: aspectRatio === 1 ? '240px' : '540px',
              height: aspectRatio === 1 ? '240px' : `${Math.round(540 / aspectRatio)}px`,
              maxHeight: '260px',
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

            {/* Visual Avatar Overlap Guide (shows exact placement on profile) */}
            {showAvatarGuide && (
              <div className="absolute -bottom-7 left-4 sm:left-6 w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-dashed border-yellow-300 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center pointer-events-none shadow-xl z-20">
                <User size={16} className="text-yellow-300 opacity-90" />
                <span className="text-[8px] font-bold text-yellow-300 uppercase tracking-wider mt-0.5">Avatar</span>
              </div>
            )}
          </div>

          {/* Dimension Tag */}
          <div className="mt-3 text-[11px] text-gray-400 font-medium flex items-center gap-2">
            <span>Aspect Ratio {aspectRatio === 1 ? '1:1 (Square)' : '3.2:1 (Cover Banner)'}</span>
            <span>•</span>
            <span className="text-indigo-400">Optimized to lightweight WebP</span>
          </div>

        </div>

        {/* Controls & Sliders */}
        <div className="p-4 sm:p-5 bg-white dark:bg-[#11141f] border-t border-gray-200 dark:border-white/10 space-y-3.5">
          
          {/* Zoom Slider */}
          <div className="flex items-center gap-3">
            <ZoomOut size={16} className="text-gray-400 shrink-0" />
            <input
              type="range"
              min="0.8"
              max="3"
              step="0.05"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="flex-1 accent-[#5a32fa] h-2 bg-gray-200 dark:bg-white/10 rounded-lg cursor-pointer"
            />
            <ZoomIn size={16} className="text-gray-400 shrink-0" />
            <span className="text-xs font-bold text-gray-500 w-10 text-right">{Math.round(zoom * 100)}%</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="flex-1 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/15 text-gray-700 dark:text-gray-300 py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmCrop}
              disabled={isProcessing}
              className="flex-1 bg-gradient-to-r from-[#5a32fa] to-[#7952ff] hover:from-[#4927cb] hover:to-[#6841ea] disabled:opacity-50 text-white py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-500/25 transition-all active:scale-95"
            >
              {isProcessing ? (
                <span>Optimizing & Saving…</span>
              ) : (
                <>
                  <Check size={16} strokeWidth={2.5} />
                  <span>Apply & Save Cover</span>
                </>
              )}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
