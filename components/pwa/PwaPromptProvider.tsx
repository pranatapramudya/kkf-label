"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

interface PwaPromptContextValue {
  // Install
  showInstallDrawer: boolean;
  isIos: boolean;
  isStandalone: boolean;
  dismissInstall: () => void;
  triggerNativeInstall: () => Promise<void>;
  // Notification
  showNotifDrawer: boolean;
  dismissNotif: () => void;
  triggerNotifPermission: () => Promise<NotificationPermission | null>;
}

const PwaPromptContext = createContext<PwaPromptContextValue | null>(null);

export function usePwaPrompt() {
  const ctx = useContext(PwaPromptContext);
  if (!ctx) throw new Error("usePwaPrompt must be used within PwaPromptProvider");
  return ctx;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const INSTALL_DISMISSED_KEY = "pwa-install-dismissed";
const NOTIF_DISMISSED_KEY = "pwa-notif-dismissed";
const COOLDOWN_DAYS = 7;
const INSTALL_DELAY_MS = 30_000; // 30 seconds
const NOTIF_DELAY_AFTER_INSTALL_MS = 10_000; // 10 seconds after install resolved
const NOTIF_STANDALONE_DELAY_MS = 60_000; // 60 seconds if install doesn't apply

// ─── Helpers ─────────────────────────────────────────────────────────────────

function isCooldownActive(key: string): boolean {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return false;
    const dismissed = parseInt(stored, 10);
    const daysSince = (Date.now() - dismissed) / (1000 * 60 * 60 * 24);
    return daysSince < COOLDOWN_DAYS;
  } catch {
    return false;
  }
}

function setCooldown(key: string): void {
  try {
    localStorage.setItem(key, Date.now().toString());
  } catch {
    // localStorage not available
  }
}

function detectIos(): boolean {
  if (typeof navigator === "undefined") return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
}

function detectStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as any).standalone === true
  );
}

// ─── Provider ────────────────────────────────────────────────────────────────

export function PwaPromptProvider({ children }: { children: React.ReactNode }) {
  const [showInstallDrawer, setShowInstallDrawer] = useState(false);
  const [showNotifDrawer, setShowNotifDrawer] = useState(false);
  const [isIos] = useState(detectIos);
  const [isStandalone] = useState(detectStandalone);

  const deferredPromptRef = useRef<BeforeInstallPromptEvent | null>(null);
  const installResolvedRef = useRef(false);

  // ── Capture beforeinstallprompt (Android/Chrome) ──

  useEffect(() => {
    if (isStandalone) return; // Already installed

    const handler = (e: Event) => {
      e.preventDefault();
      deferredPromptRef.current = e as BeforeInstallPromptEvent;
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, [isStandalone]);

  // ── Install drawer timer ──

  useEffect(() => {
    if (isStandalone) return;
    if (isCooldownActive(INSTALL_DISMISSED_KEY)) return;

    // Show install drawer for iOS (manual guide) or when beforeinstallprompt fires
    const timer = setTimeout(() => {
      // For non-iOS, only show if we captured the deferred prompt
      if (isIos || deferredPromptRef.current) {
        setShowInstallDrawer(true);
      } else {
        // No install prompt available and not iOS — skip to notification
        installResolvedRef.current = true;
        scheduleNotifDrawer(NOTIF_DELAY_AFTER_INSTALL_MS);
      }
    }, INSTALL_DELAY_MS);

    return () => clearTimeout(timer);
  }, [isStandalone, isIos]);

  // ── Notification drawer scheduling ──

  const notifTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleNotifDrawer = useCallback((delayMs: number) => {
    if (typeof window === "undefined") return;
    if (!("Notification" in window)) return;
    if (Notification.permission !== "default") return;
    if (isCooldownActive(NOTIF_DISMISSED_KEY)) return;

    notifTimerRef.current = setTimeout(() => {
      // Double-check permission hasn't changed
      if (Notification.permission === "default") {
        setShowNotifDrawer(true);
      }
    }, delayMs);
  }, []);

  // If install prompt is never applicable, schedule notification standalone
  useEffect(() => {
    if (isStandalone) return;
    if (!isIos && !deferredPromptRef.current) {
      // Will be handled by the install timer fallback above
      return;
    }

    return () => {
      if (notifTimerRef.current) clearTimeout(notifTimerRef.current);
    };
  }, [isStandalone, isIos]);

  // ── Actions ──

  const dismissInstall = useCallback(() => {
    setShowInstallDrawer(false);
    setCooldown(INSTALL_DISMISSED_KEY);
    installResolvedRef.current = true;
    scheduleNotifDrawer(NOTIF_DELAY_AFTER_INSTALL_MS);
  }, [scheduleNotifDrawer]);

  const triggerNativeInstall = useCallback(async () => {
    const prompt = deferredPromptRef.current;
    if (!prompt) return;

    await prompt.prompt();
    const { outcome } = await prompt.userChoice;

    deferredPromptRef.current = null;
    setShowInstallDrawer(false);
    installResolvedRef.current = true;

    if (outcome === "dismissed") {
      setCooldown(INSTALL_DISMISSED_KEY);
    }

    scheduleNotifDrawer(NOTIF_DELAY_AFTER_INSTALL_MS);
  }, [scheduleNotifDrawer]);

  const dismissNotif = useCallback(() => {
    setShowNotifDrawer(false);
    setCooldown(NOTIF_DISMISSED_KEY);
  }, []);

  const triggerNotifPermission = useCallback(async (): Promise<NotificationPermission | null> => {
    if (!("Notification" in window)) return null;

    try {
      const permission = await Notification.requestPermission();
      setShowNotifDrawer(false);

      if (permission === "granted") {
        // Trigger FCM token registration
        const { requestForToken } = await import("@/lib/firebaseClient");
        const token = await requestForToken();
        if (token) {
          localStorage.setItem("fcm_token", token);
        }
      } else {
        setCooldown(NOTIF_DISMISSED_KEY);
      }

      return permission;
    } catch {
      setShowNotifDrawer(false);
      return null;
    }
  }, []);

  // ── Don't render anything if already standalone ──

  const value: PwaPromptContextValue = {
    showInstallDrawer,
    isIos,
    isStandalone,
    dismissInstall,
    triggerNativeInstall,
    showNotifDrawer,
    dismissNotif,
    triggerNotifPermission,
  };

  return (
    <PwaPromptContext.Provider value={value}>
      {children}
    </PwaPromptContext.Provider>
  );
}
