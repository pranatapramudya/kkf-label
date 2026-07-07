import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.kkflabel.adminapp',
  appName: 'Admin KKF',
  webDir: 'public',
  server: {
    url: 'https://www.kkflabel.com/sign-in', // 👈 Tembak langsung ke rute sign-in
    cleartext: true,
    allowNavigation: [
      '*',
      '*.kkflabel.com',
      '*.vercel.app',
      '*.clerk.com',
      '*.clerk.accounts.dev',
      '*.google.com'
    ]
  },
  plugins: {
    StatusBar: {
      overlaysWebView: false,
      backgroundColor: '#ffffff',
      style: 'LIGHT'
    }
  }
};

export default config;