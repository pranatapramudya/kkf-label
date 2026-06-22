'use client';
import { useEffect } from 'react';
import { SafeArea } from 'capacitor-plugin-safe-area';

export default function SafeAreaProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const initSafeArea = async () => {
      try {
        const { insets } = await SafeArea.getSafeAreaInsets();
        for (const [key, value] of Object.entries(insets)) {
          document.documentElement.style.setProperty(`--safe-area-inset-${key}`, `${value}px`);
        }
      } catch (e) {
        console.log('SafeArea plugin tidak berjalan di web standar');
      }
    };
    initSafeArea();
  }, []);

  return <>{children}</>;
}
