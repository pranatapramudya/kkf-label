"use client";

import { useState } from "react";
import { Bell, X } from "lucide-react";
import { usePwaPrompt } from "./PwaPromptProvider";

export function NotificationDrawer() {
  const {
    showNotifDrawer,
    dismissNotif,
    triggerNotifPermission,
  } = usePwaPrompt();

  const [isClosing, setIsClosing] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);

  if (!showNotifDrawer && !isClosing) return null;

  const handleDismiss = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      dismissNotif();
    }, 300);
  };

  const handleAllow = async () => {
    setIsRequesting(true);
    try {
      await triggerNotifPermission();
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-[200] flex items-end justify-center ${
        isClosing ? "animate-fade-out" : "animate-fade-in"
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="Aktifkan Notifikasi"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={handleDismiss}
      />

      {/* Drawer */}
      <div
        className={`relative w-full max-w-lg mx-4 mb-4 rounded-3xl border border-pink-100 bg-white/95 backdrop-blur-xl shadow-2xl overflow-hidden ${
          isClosing ? "animate-slide-down" : "animate-slide-up"
        }`}
      >
        {/* Drag Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-zinc-300" />
        </div>

        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 p-2 rounded-full text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-colors"
          aria-label="Tutup"
        >
          <X size={20} />
        </button>

        <div className="px-6 pb-6 pt-2">
          {/* Bell Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-soft-pink-50 to-soft-pink-100 border border-pink-100 flex items-center justify-center shadow-sm">
              <Bell size={28} className="text-soft-pink-500" />
            </div>
          </div>

          <h2 className="text-center text-lg font-bold text-zinc-900 mb-1">
            Aktifkan Notifikasi
          </h2>
          <p className="text-center text-sm text-zinc-500 mb-6">
            Dapatkan update pesanan, promo eksklusif, dan info restock langsung di HP kamu.
          </p>

          {/* Benefits */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { icon: "📦", label: "Update\nPesanan" },
              { icon: "🏷️", label: "Promo\nEksklusif" },
              { icon: "✨", label: "Info\nRestock" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-soft-pink-50/50 border border-pink-50"
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-[10px] text-zinc-500 font-medium text-center leading-tight whitespace-pre-line">
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleAllow}
              disabled={isRequesting}
              className="tombol-utama w-full gap-2 disabled:opacity-60"
            >
              <Bell size={18} />
              {isRequesting ? "Meminta izin..." : "Aktifkan Notifikasi"}
            </button>
            <button
              onClick={handleDismiss}
              className="tombol-sekunder w-full"
            >
              Tidak, Terima Kasih
            </button>
          </div>
        </div>

        {/* Safe area bottom padding for standalone PWA */}
        <div className="pb-[env(safe-area-inset-bottom)]" />
      </div>
    </div>
  );
}
