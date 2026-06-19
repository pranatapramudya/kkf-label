import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.kkflabel.admin',
  appName: 'Admin KKF',
  webDir: 'public',
  server: {
    url: 'https://kkf-label.vercel.app/admin', // 👈 Tembak langsung ke rute admin
    cleartext: true
  }
};

export default config;