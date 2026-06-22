# PRD: KKF Label Phase 2.8 - WebView Wildcard Whitelist & App Icon Generation

## 1. Objective (Tujuan)
Mengunci total navigasi agar 100% *Full Screen* di dalam aplikasi (mencegah kebocoran ke Google Chrome) menggunakan metode *Wildcard*, serta memperbarui ikon aplikasi bawaan menjadi logo resmi KKF Label.

## 2. Analisis Masalah & Solusi
- **Masalah Navigasi Bocor:** Aturan `allowNavigation` sebelumnya terlalu kaku. Jika Next.js melakukan pengalihan (*redirect*), Capacitor akan mendeteksinya sebagai tautan eksternal.
  - **Solusi:** Menggunakan parameter *wildcard* (`*.vercel.app` dan `*kkf-label.vercel.app*`) agar semua variasi URL dikenali sebagai domain internal.
- **Masalah Ikon Usang:** Berkas APK masih menggunakan gambar *placeholder* bawaan Capacitor.
  - **Solusi:** Memanfaatkan modul `@capacitor/assets` untuk membuat ikon *native* secara otomatis (`hdpi`, `xhdpi`, dll) dari logo KKF Label yang ada di folder `public`.

## 3. Spesifikasi Implementasi
1. Ubah array `allowNavigation` di `capacitor.config.ts` menjadi: `['kkf-label.vercel.app', '*.vercel.app', '*kkf-label.vercel.app*']`.
2. Pasang pustaka `@capacitor/assets`, salin logo dari `public` ke folder `assets`, dan jalankan perintah *generate*.
3. Sinkronisasikan ulang dengan `npx cap sync android`.