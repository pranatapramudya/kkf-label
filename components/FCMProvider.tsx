"use client";

import { useEffect } from "react";
import { requestForToken } from "@/lib/firebaseClient";

export function FCMProvider() {
  useEffect(() => {
    async function setupFCM() {
      // Hanya berjalan di browser
      if (typeof window !== "undefined" && "serviceWorker" in navigator) {
        try {
          const token = await requestForToken();
          if (token) {
            // Simpan token ke localStorage agar bisa dilampirkan saat Checkout
            localStorage.setItem("fcm_token", token);
          }
        } catch (error) {
          console.warn("FCM Provider Error:", error);
        }
      }
    }
    setupFCM();
  }, []);

  return null;
}
