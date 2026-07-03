import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.kkflabel.adminapp',
  appName: 'Admin KKF',
  webDir: 'public',
  server: {
    url: 'https://kkf-label.vercel.app/admin', // 👈 Tembak langsung ke rute admin
    cleartext: true,
    allowNavigation: [
      '*',
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