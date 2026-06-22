# PRD: KKF Label Phase 2.6 - WebView Navigation Fix & Auto-Update Validation

## 1. Objective (Tujuan)
Memastikan aplikasi Android (Capacitor) menahan seluruh aktivitas navigasi tetap di dalam *WebView* internal (layar penuh) dan tidak melempar pengguna ke peramban eksternal (Google Chrome).

## 2. Analisis Masalah & Solusi
- **Masalah:** Saat aplikasi diluncurkan atau pengguna melakukan klik/navigasi di Dasbor Admin, Capacitor mendeteksi perpindahan rute sebagai tautan eksternal yang tidak dikenal, sehingga mendelegasikan URL tersebut ke aplikasi peramban bawaan OS (Chrome).
- **Solusi:** Menambahkan properti `allowNavigation` (Daftar Putih / *Whitelist*) pada berkas konfigurasi Capacitor. Ini akan menginstruksikan sistem Android bahwa seluruh URL yang berada di bawah domain Vercel tersebut adalah bagian integral dari aplikasi lokal.

## 3. Spesifikasi Implementasi
1. Modifikasi `capacitor.config.ts`: Tambahkan `allowNavigation: ['kkf-label.vercel.app']` ke dalam objek `server`.
2. Eksekusi `npx cap sync android` untuk menyuntikkan daftar putih tersebut ke dalam berkas manifes *native* Android.