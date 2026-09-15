'use client';

import ApertureSplashLoader from '@/components/ApertureSplashLoader';

export interface AppLaunchSplashProps {
  message?: string;
  onComplete?: () => void;
  speedMs?: number;
  background?: string;
  logo?: React.ReactNode;
  minDurationMs?: number;
  isReady?: boolean;
}

export default function AppLaunchSplash({
  message,
  onComplete,
  speedMs,
  background = 'linear-gradient(135deg, #18153c 0%, #0c0a24 50%, #060515 100%)',
  logo,
  minDurationMs = 4200,
  isReady = true,
}: AppLaunchSplashProps) {
  return (
    <ApertureSplashLoader
      message={message}
      onComplete={onComplete}
      speedMs={speedMs}
      background={background}
      logo={logo}
      minDurationMs={minDurationMs}
      isReady={isReady}
    />
  );
}
