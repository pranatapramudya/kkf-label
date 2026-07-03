'use client';
import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';

export default function CapacitorInit() {
  useEffect(() => {
    const initCapacitor = async () => {
      if (Capacitor.isNativePlatform()) {
        try {
          await StatusBar.setStyle({ style: Style.Light });
          await StatusBar.setBackgroundColor({ color: '#ffffff' });
        } catch (error) {
          console.error('Error setting status bar:', error);
        }
      }
    };
    initCapacitor();
  }, []);

  return null;
}
