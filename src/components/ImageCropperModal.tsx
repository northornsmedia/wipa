'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Check, ZoomIn, ZoomOut, User } from 'lucide-react';
import { DotmCircular7 as Loader2 } from '@/components/ui/dotm-circular-7';
import Cancel02Icon from '@/components/icons/Cancel02Icon';
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

  const isBanner = shape === 'banner';
  const saveLabel = isBanner ? 'Save Cover' : 'Save Photo';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#121620] rounded-2xl sm:rounded-3xl max-w-md sm:max-w-lg w-full border border-gray-200 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Clean Header */}
        <div className="px-5 py-4 border-b border-gray-100 dark:border-white/10 flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              {title}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Drag to reposition • Scroll or use slider to zoom
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <Cancel02Icon size={16} />
          </button>
        </div>

        {/* Interactive Cropper Viewport */}
        <div className="p-4 sm:p-6 flex flex-col items-center justify-center bg-[#0a0d14] select-none overflow-hidden relative min-h-[290px] sm:min-h-[320px]">
          
          {/* Crop Frame Box with surrounding dark shading */}
          <div
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onWheel={handleWheel}
            className={`relative overflow-hidden cursor-grab active:cursor-grabbing border-2 border-white shadow-[0_0_0_9999px_rgba(0,0,0,0.65)] flex items-center justify-center ${
              shape === 'rounded' 
                ? 'rounded-full' 
                : 'rounded-2xl'
            }`}
            style={{
              width: aspectRatio === 1 ? '240px' : '100%',
              maxWidth: aspectRatio === 1 ? '240px' : '460px',
              height: aspectRatio === 1 ? '240px' : `${Math.round(460 / aspectRatio)}px`,
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

            {/* Rule-of-thirds precision grid */}
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

            {/* Visual Avatar Guide for Cover Banner */}
            {showAvatarGuide && (
              <div className="absolute -bottom-6 left-4 sm:left-6 w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-dashed border-white/70 bg-black/50 flex flex-col items-center justify-center pointer-events-none shadow-lg z-20">
                <User size={16} className="text-white/80" />
                <span className="text-[8px] font-bold text-white/90 uppercase tracking-wider mt-0.5">Avatar</span>
              </div>
            )}
          </div>

          {/* Simple Size Hint */}
          {recommendedPx && (
            <div className="mt-3 text-[11px] text-gray-400 font-medium">
              Recommended: {recommendedPx}
            </div>
          )}

        </div>

        {/* Controls & Action Buttons */}
        <div className="p-4 sm:p-5 bg-white dark:bg-[#121620] border-t border-gray-100 dark:border-white/10 space-y-4">
          
          {/* Zoom Slider */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(0.8, parseFloat((z - 0.1).toFixed(2))))}
              className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors p-1"
              title="Zoom out"
            >
              <ZoomOut size={16} />
            </button>
            <input
              type="range"
              min="0.8"
              max="3"
              step="0.02"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="flex-1 accent-[#5a32fa] h-1.5 bg-gray-200 dark:bg-white/15 rounded-lg cursor-pointer"
            />
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(3, parseFloat((z + 0.1).toFixed(2))))}
              className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors p-1"
              title="Zoom in"
            >
              <ZoomIn size={16} />
            </button>
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 w-10 text-right tabular-nums">
              {Math.round(zoom * 100)}%
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/15 text-gray-700 dark:text-gray-300 py-2.5 rounded-xl font-bold text-xs sm:text-sm cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmCrop}
              disabled={isProcessing}
              className="flex-1 bg-[#5a32fa] hover:bg-[#4a24db] disabled:opacity-50 text-white py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all active:scale-[0.98]"
            >
              {isProcessing ? (
                <>
                  <Loader2 size={15} className="animate-spin text-white" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check size={16} strokeWidth={2.5} />
                  <span>{saveLabel}</span>
                </>
              )}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
