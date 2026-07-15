import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'uz.medid.app',
  appName: 'MED-ID',
  webDir: 'public',
  server: {
    url: 'http://192.168.23.175:3000',
    cleartext: true
  }
};

export default config;
