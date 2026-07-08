"use client";

import { useState } from "react";
import Image from "next/image";
import { Download, Share, PlusSquare, X } from "lucide-react";
import { usePwaPrompt } from "./PwaPromptProvider";

export function InstallDrawer() {
  const {
    showInstallDrawer,
    isIos,
    dismissInstall,
    triggerNativeInstall,
  } = usePwaPrompt();

  const [isClosing, setIsClosing] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  if (!showInstallDrawer && !isClosing) return null;

  const handleDismiss = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      dismissInstall();
    }, 300);
  };

  const handleInstall = async () => {
    setIsInstalling(true);
    try {
      await triggerNativeInstall();
    } finally {
      setIsInstalling(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-[200] flex items-end justify-center ${
        isClosing ? "animate-fade-out" : "animate-fade-in"
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="Pasang Aplikasi KKF Label"
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
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-soft-pink-50 to-soft-pink-100 border border-pink-100 flex items-center justify-center shadow-sm">
              <Image
                src="/logo-kkf.png"
                alt="KKF Label"
                width={44}
                height={44}
                className="object-contain"
              />
            </div>
          </div>

          {isIos ? (
            // ── iOS Mode: Manual Instructions ──
            <>
              <h2 className="text-center text-lg font-bold text-zinc-900 mb-1">
                Pasang di iPhone Kamu
              </h2>
              <p className="text-center text-sm text-zinc-500 mb-5">
                Ikuti langkah mudah ini untuk menambahkan KKF Label ke layar utama.
              </p>

              <div className="space-y-4 mb-6">
                {/* Step 1 */}
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-soft-pink-50 border border-pink-100 flex items-center justify-center">
                    <span className="text-xs font-bold text-soft-pink-600">1</span>
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="text-sm text-zinc-700">
                      Ketuk ikon{" "}
                      <Share size={14} className="inline text-blue-500 -mt-0.5" />{" "}
                      <span className="font-semibold">Share</span> di bagian bawah Safari
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-soft-pink-50 border border-pink-100 flex items-center justify-center">
                    <span className="text-xs font-bold text-soft-pink-600">2</span>
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="text-sm text-zinc-700">
                      Scroll ke bawah, pilih{" "}
                      <PlusSquare size={14} className="inline text-zinc-700 -mt-0.5" />{" "}
                      <span className="font-semibold">&quot;Add to Home Screen&quot;</span>
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-soft-pink-50 border border-pink-100 flex items-center justify-center">
                    <span className="text-xs font-bold text-soft-pink-600">3</span>
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="text-sm text-zinc-700">
                      Ketuk <span className="font-semibold">&quot;Add&quot;</span> — selesai! 🎉
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleDismiss}
                className="tombol-utama w-full"
              >
                Mengerti 👍
              </button>
            </>
          ) : (
            // ── Android / Chrome Mode: Native Install ──
            <>
              <h2 className="text-center text-lg font-bold text-zinc-900 mb-1">
                Pasang Aplikasi KKF Label
              </h2>
              <p className="text-center text-sm text-zinc-500 mb-6">
                Akses lebih cepat tanpa buka browser. Langsung dari layar utama HP kamu!
              </p>

              {/* Feature highlights */}
              <div className="flex items-center justify-center gap-6 mb-6">
                {[
                  { icon: "⚡", label: "Cepat" },
                  { icon: "📱", label: "Ringan" },
                  { icon: "🔔", label: "Notifikasi" },
                ].map((feat) => (
                  <div key={feat.label} className="flex flex-col items-center gap-1">
                    <span className="text-2xl">{feat.icon}</span>
                    <span className="text-xs text-zinc-500 font-medium">{feat.label}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleInstall}
                  disabled={isInstalling}
                  className="tombol-utama w-full gap-2 disabled:opacity-60"
                >
                  <Download size={18} />
                  {isInstalling ? "Memasang..." : "Pasang Sekarang"}
                </button>
                <button
                  onClick={handleDismiss}
                  className="tombol-sekunder w-full"
                >
                  Nanti Saja
                </button>
              </div>
            </>
          )}
        </div>

        {/* Safe area bottom padding for standalone PWA */}
        <div className="pb-[env(safe-area-inset-bottom)]" />
      </div>
    </div>
  );
}
