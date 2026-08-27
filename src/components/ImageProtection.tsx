"use client";

import { useEffect } from "react";

export default function ImageProtection() {
  useEffect(() => {
    // 1. Prevent Right-Click Context Menu on images, media, and protected containers
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const isImageOrMedia = 
        target.tagName === 'IMG' ||
        target.tagName === 'PICTURE' ||
        target.tagName === 'VIDEO' ||
        target.tagName === 'CANVAS' ||
        target.tagName === 'SVG' ||
        target.closest('img') ||
        target.closest('picture') ||
        target.closest('[data-protected-media]') ||
        target.classList.contains('protected-image-container') ||
        target.classList.contains('protected-media');

      if (isImageOrMedia) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    // 2. Prevent Drag and Drop of all images to desktop or extension capture zones
    const handleDragStart = (e: DragEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const isImageOrMedia = 
        target.tagName === 'IMG' ||
        target.tagName === 'PICTURE' ||
        target.tagName === 'VIDEO' ||
        target.tagName === 'CANVAS' ||
        target.closest('img') ||
        target.closest('picture') ||
        target.closest('[data-protected-media]');

      if (isImageOrMedia) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    // 3. Block Save Page / Print Page Shortcuts (Ctrl+S, Cmd+S, Ctrl+P, Cmd+P)
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const isCmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      if (isCmdOrCtrl && (e.key === 's' || e.key === 'S' || e.key === 'p' || e.key === 'P')) {
        // Prevent accidental full page / image save dumps
        e.preventDefault();
        e.stopPropagation();
      }
    };

    // 4. DOM MutationObserver: Automatically enforce draggable="false" and user-select none on all dynamically loaded images
    const applyProtectionToElement = (el: HTMLElement) => {
      if (el.tagName === 'IMG' || el.tagName === 'VIDEO' || el.tagName === 'PICTURE') {
        el.setAttribute('draggable', 'false');
        el.setAttribute('oncontextmenu', 'return false;');
        (el.style as any).webkitUserDrag = 'none';
        (el.style as any).userDrag = 'none';
        el.style.userSelect = 'none';
        (el.style as any).webkitUserSelect = 'none';
      }
    };

    // Initial pass on existing elements
    document.querySelectorAll('img, video, picture').forEach((node) => {
      applyProtectionToElement(node as HTMLElement);
    });

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const addedNode of Array.from(mutation.addedNodes)) {
          if (addedNode.nodeType === Node.ELEMENT_NODE) {
            const el = addedNode as HTMLElement;
            applyProtectionToElement(el);
            el.querySelectorAll?.('img, video, picture').forEach((nested) => {
              applyProtectionToElement(nested as HTMLElement);
            });
          }
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // 5. Cloak Performance Resource Timing from bulk harvest scripts / extensions
    try {
      if (typeof window !== 'undefined' && window.performance && typeof window.performance.clearResourceTimings === 'function') {
        // Clear resource timings periodically so bulk scraper extensions querying performance.getEntriesByType('resource') find empty buffers
        const timer = setInterval(() => {
          try {
            window.performance.clearResourceTimings();
          } catch (_) {}
        }, 3000);

        return () => {
          clearInterval(timer);
          document.removeEventListener("contextmenu", handleContextMenu, true);
          document.removeEventListener("dragstart", handleDragStart, true);
          document.removeEventListener("keydown", handleKeyDown, true);
          observer.disconnect();
        };
      }
    } catch (_) {}

    // Register capture-phase listeners (executes before extension content scripts)
    document.addEventListener("contextmenu", handleContextMenu, true);
    document.addEventListener("dragstart", handleDragStart, true);
    document.addEventListener("keydown", handleKeyDown, true);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu, true);
      document.removeEventListener("dragstart", handleDragStart, true);
      document.removeEventListener("keydown", handleKeyDown, true);
      observer.disconnect();
    };
  }, []);

  return null;
}
