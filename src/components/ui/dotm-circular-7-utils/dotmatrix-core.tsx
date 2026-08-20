'use client';

import type { CSSProperties, HTMLAttributes } from 'react';

export type DotMatrixPhase = 'idle' | 'running';
export type DotAnimationResolver = (args: { row: number; col: number; phase: DotMatrixPhase }) => {
  className?: string;
  style?: CSSProperties;
};

export type DotMatrixCommonProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  size?: number;
  dotSize?: number;
  speed?: number;
  animated?: boolean;
  hoverAnimated?: boolean;
};

type DotMatrixBaseProps = DotMatrixCommonProps & {
  pattern?: 'full';
  phase: DotMatrixPhase;
  reducedMotion?: boolean;
  animationResolver: DotAnimationResolver;
};

export function isWithinCircularMask(row: number, col: number) {
  const x = col - 2;
  const y = row - 2;
  return Math.sqrt(x * x + y * y) <= 2.25;
}

export function DotMatrixBase({
  size = 36,
  dotSize = 5,
  phase,
  animationResolver,
  className = '',
  style,
  speed: _speed,
  animated: _animated,
  hoverAnimated: _hoverAnimated,
  reducedMotion: _reducedMotion,
  pattern: _pattern,
  ...props
}: DotMatrixBaseProps) {
  const cellSize = size / 5;
  const renderedDotSize = Math.min(dotSize, cellSize * 0.72);
  const safeClassName = className.replace(/\banimate-spin\b/g, '').trim();

  return (
    <div
      {...props}
      role={props.role ?? 'status'}
      aria-label={props['aria-label'] ?? 'Loading'}
      className={`inline-grid shrink-0 grid-cols-5 grid-rows-5 place-items-center align-middle ${safeClassName}`}
      style={{ width: size, height: size, ...style }}
    >
      {Array.from({ length: 25 }, (_, index) => {
        const row = Math.floor(index / 5);
        const col = index % 5;
        const resolved = animationResolver({ row, col, phase });
        return (
          <span
            key={index}
            className={resolved.className}
            style={{
              width: renderedDotSize,
              height: renderedDotSize,
              borderRadius: 999,
              backgroundColor: 'currentColor',
              transition: 'opacity 90ms linear',
              ...resolved.style,
            }}
          />
        );
      })}
    </div>
  );
}
