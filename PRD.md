# PRD: KKF Label Phase 2.18 - Capacitor StatusBar Property Correction

## 1. Objective (Tujuan)
Memperbaiki kesalahan penulisan (*typo*) pada konfigurasi Capacitor yang menyebabkan antarmuka aplikasi masih bertumpuk dengan *Status Bar* bawaan perangkat.

## 2. Analisis Masalah & Solusi
- **Masalah:** Properti konfigurasi `overlay: false` tidak dikenali oleh API Capacitor. Properti yang valid untuk versi saat ini adalah `overlaysWebView`.
- **Solusi:** Memperbarui kunci properti di `capacitor.config.ts` menjadi `overlaysWebView: false` agar OS Android memberikan ruang statis untuk jam dan baterai di atas *WebView*.

## 3. Spesifikasi Implementasi
1. Ubah kunci konfigurasi `StatusBar` di `capacitor.config.ts` dari `overlay` menjadi `overlaysWebView`.
2. Jalankan `npx cap sync android` untuk memperbarui sistem *native*.