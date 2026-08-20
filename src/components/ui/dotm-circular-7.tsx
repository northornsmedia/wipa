"use client";

import { useMemo } from "react";
import { DotMatrixBase, isWithinCircularMask } from "@/components/ui/dotm-circular-7-utils/dotmatrix-core";
import { useCyclePhase, useDotMatrixPhases, usePrefersReducedMotion } from "@/components/ui/dotm-circular-7-utils/dotmatrix-hooks";
import type { DotAnimationResolver, DotMatrixCommonProps } from "@/components/ui/dotm-circular-7-utils/dotmatrix-core";

export type DotmCircular7Props = DotMatrixCommonProps;

const BASE_OPACITY = 0.08;
const GATE_OPACITY = 0.92;

export function DotmCircular7({ speed = 1.8, animated = true, hoverAnimated = false, ...rest }: DotmCircular7Props) {
  const reducedMotion = usePrefersReducedMotion();
  const { phase: matrixPhase, onMouseEnter, onMouseLeave } = useDotMatrixPhases({
    animated: Boolean(animated && !reducedMotion),
    hoverAnimated: Boolean(hoverAnimated && !reducedMotion),
    speed,
  });
  const phase = useCyclePhase({ active: !reducedMotion && matrixPhase !== "idle", cycleMsBase: 1600, speed });

  const resolver = useMemo<DotAnimationResolver>(() => ({ row, col, phase: currentPhase }) => {
    if (!isWithinCircularMask(row, col)) return { className: "dmx-inactive", style: { opacity: 0 } };
    const x = col - 2;
    const y = row - 2;
    const t = reducedMotion || currentPhase === "idle" ? 0 : phase * Math.PI * 2;
    const ring = Math.sqrt(x * x + y * y);
    const angle = Math.atan2(y, x);
    const petalWave = 0.5 + 0.5 * Math.cos(5 * angle - t * 1.7);
    const ringWave = 0.5 + 0.5 * Math.cos(ring * 3.3 - t * 1.2);
    const chordWave = 0.5 + 0.5 * Math.cos((x + y) * 1.6 + t * 1.35);
    const petalGate = Math.pow(petalWave, 2.2);
    const blend = 0.68 * petalGate + 0.22 * ringWave + 0.1 * chordWave;
    return { style: { opacity: BASE_OPACITY + (GATE_OPACITY - BASE_OPACITY) * blend } };
  }, [reducedMotion, phase]);

  return (
    <DotMatrixBase {...rest} size={rest.size ?? 36} dotSize={rest.dotSize ?? 5} speed={speed} pattern="full"
      animated={animated} phase={matrixPhase} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}
      reducedMotion={reducedMotion} animationResolver={resolver} />
  );
}

export default DotmCircular7;
