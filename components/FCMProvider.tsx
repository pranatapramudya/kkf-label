"use client";

import { useEffect } from "react";
import { requestForToken } from "@/lib/firebaseClient";

export function FCMProvider() {
  useEffect(() => {
    async function setupFCM() {
      // Hanya berjalan di browser
      if (typeof window !== "undefined" && "serviceWorker" in navigator) {
        try {
          // Minta token hanya jika izin tidak diblokir secara eksplisit
          if (Notification.permission !== "denied") {
            const token = await requestForToken();
            if (token) {
              // Simpan token ke localStorage agar bisa dilampirkan saat Checkout
              localStorage.setItem("fcm_token", token);
            }
          }
        } catch (error) {
          // Silent fail
        }
      }
    }
    setupFCM();
  }, []);

  return null;
}
