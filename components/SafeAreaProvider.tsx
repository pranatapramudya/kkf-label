'use client';
import { useEffect } from 'react';

export default function SafeAreaProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Set CSS custom properties from standard env() safe area insets.
    // These are natively supported in PWA standalone mode on iOS/Android.
    const root = document.documentElement;
    root.style.setProperty('--safe-area-inset-top', 'env(safe-area-inset-top)');
    root.style.setProperty('--safe-area-inset-bottom', 'env(safe-area-inset-bottom)');
    root.style.setProperty('--safe-area-inset-left', 'env(safe-area-inset-left)');
    root.style.setProperty('--safe-area-inset-right', 'env(safe-area-inset-right)');
  }, []);

  return <>{children}</>;
}

