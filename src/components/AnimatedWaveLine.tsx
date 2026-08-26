'use client';

import { motion } from 'framer-motion';

interface AnimatedWaveLineProps {
  className?: string;
}

export default function AnimatedWaveLine({ className = '' }: AnimatedWaveLineProps) {
  const pathKeyframes = [
    "M-20,30 Q80,130 200,60 T440,80 T550,20",
    "M-20,50 Q105,30 225,85 T430,35 T550,50",
    "M-20,25 Q70,110 190,40 T455,95 T550,25",
    "M-20,45 Q115,125 210,75 T420,50 T550,40",
    "M-20,30 Q80,130 200,60 T440,80 T550,20"
  ];

  return (
    <div className={`absolute top-16 sm:top-20 left-0 right-0 w-full overflow-hidden pointer-events-none opacity-90 z-0 select-none ${className}`}>
      <motion.div
        animate={{
          y: [-2, 3, -3, 2, -2],
          opacity: [0.85, 1, 0.9, 1, 0.85]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="w-full relative"
      >
        {/* Soft Ambient Neon Glow Underneath */}
        <svg
          viewBox="0 0 500 150"
          preserveAspectRatio="none"
          className="w-full h-32 sm:h-44 stroke-current absolute inset-0 blur-md opacity-60 dark:opacity-75 pointer-events-none"
        >
          <defs>
            <linearGradient id="waveGlowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ff2a70" />
              <stop offset="50%" stopColor="#ff7836" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
          <motion.path
            d={pathKeyframes[0]}
            animate={{
              d: pathKeyframes
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            fill="none"
            stroke="url(#waveGlowGradient)"
            strokeWidth="7"
            strokeLinecap="round"
          />
        </svg>

        {/* Sharp Foreground Gradient Wave Ribbon */}
        <svg
          viewBox="0 0 500 150"
          preserveAspectRatio="none"
          className="w-full h-32 sm:h-44 stroke-current relative z-10"
        >
          <defs>
            <linearGradient id="waveSharpGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ff2a70" />
              <stop offset="50%" stopColor="#ff7836" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
          <motion.path
            d={pathKeyframes[0]}
            animate={{
              d: pathKeyframes
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            fill="none"
            stroke="url(#waveSharpGradient)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </svg>
      </motion.div>
    </div>
  );
}
