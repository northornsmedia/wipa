import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'org.wipa.app',
  appName: 'WIPA',
  webDir: 'capacitor-web',
  backgroundColor: '#6600FF',
  server: {
    url: 'https://platform.womensipalliance.com/platform',
    cleartext: false,
  },
  android: {
    allowMixedContent: false,
    backgroundColor: '#6600FF',
  },
};

export default config;
