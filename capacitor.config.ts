import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'org.wipa.app',
  appName: 'WIPA',
  webDir: 'capacitor-web',
  server: {
    url: 'https://wipanorthon.vercel.app',
    cleartext: false,
  },
  android: {
    allowMixedContent: false,
  },
};

export default config;
