# PRD: KKF Label Phase 2.9 - Auth Redirect Fix & Package ID Cache Busting

## 1. Objective (Tujuan)
Memastikan proses autentikasi (Login/Sign-in) tetap tertahan di dalam *WebView* tanpa memicu peramban eksternal, dan membersihkan memori singgahan (*cache*) ikon OS Android yang menampilkan logo aplikasi lama.

## 2. Analisis Masalah & Solusi
- **Masalah Auth Redirect:** Sistem proteksi rute (Middleware Auth) mengalihkan pengguna ke halaman login yang memicu intervensi keamanan Capacitor, sehingga tautan dibuka di Chrome.
  - **Solusi:** Menerapkan *wildcard* universal `['*']` dan domain spesifik otentikasi pada `allowNavigation` agar seluruh proses peralihan (*redirect*) diizinkan berjalan di dalam aplikasi.
- **Masalah Ikon Usang (Cache Clash):** Pemindai keamanan Android menampilkan logo proyek lama karena aplikasi menggunakan `appId` yang sama dengan proyek sebelumnya.
  - **Solusi:** Memperbarui `appId` menjadi identitas yang sepenuhnya unik (contoh: `com.kkflabel.adminapp`) untuk memaksa Android memperlakukan aplikasi ini sebagai entitas baru yang bersih.

## 3. Spesifikasi Implementasi
1. Ubah `appId` di `capacitor.config.ts` menjadi `com.kkflabel.adminapp`.
2. Ubah `allowNavigation` menjadi `['*', '*.vercel.app', '*.clerk.com', '*.clerk.accounts.dev']`.
3. Lakukan sinkronisasi ulang dengan `npx cap sync android`.