'use client';

import { useEffect, useState } from 'react';
import type { DotMatrixPhase } from './dotmatrix-core';

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  return reduced;
}

export function useDotMatrixPhases({ animated, hoverAnimated }: { animated: boolean; hoverAnimated: boolean; speed: number }) {
  const [hovered, setHovered] = useState(false);
  const phase: DotMatrixPhase = animated || (hoverAnimated && hovered) ? 'running' : 'idle';
  return {
    phase,
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
  };
}

export function useCyclePhase({ active, cycleMsBase, speed }: { active: boolean; cycleMsBase: number; speed: number }) {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    if (!active) {
      setPhase(0);
      return;
    }
    let frame = 0;
    const startedAt = performance.now();
    const tick = (now: number) => {
      setPhase((((now - startedAt) * Math.max(speed, 0.1)) % cycleMsBase) / cycleMsBase);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, cycleMsBase, speed]);
  return phase;
}
