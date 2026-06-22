# PRD: KKF Label Phase 2.19 - Universal Hardware Safe Area Insets

## 1. Objective (Tujuan)
Menyelesaikan tumpang tindih antarmuka pengguna pada perangkat dengan *Custom ROM* restriktif (seperti itelOS) dan Android 15+ yang mengabaikan nilai standar `env(safe-area-inset-top)`.

## 2. Analisis Masalah & Solusi
- **Masalah:** OS perangkat memaksa mode *edge-to-edge*, menolak konfigurasi `overlaysWebView`, dan peramban internal mengembalikan nilai ruang aman 0 piksel.
- **Solusi:** Menggunakan pengaya level-perangkat keras `capacitor-plugin-safe-area` untuk secara sinkron mengambil jarak piksel perangkat (*notch/status bar*) dan menyuntikkannya sebagai Variabel CSS global (`--safe-area-inset-top`) yang tahan banting.

## 3. Spesifikasi Implementasi
1. Pasang modul `capacitor-plugin-safe-area`.
2. Buat Komponen Klien (*Client Component*) `SafeAreaProvider` untuk mengeksekusi `SafeArea.getSafeAreaInsets()` pada saat aplikasi dimuat (*mount*), lalu oper nilainya ke objek `document.documentElement.style`.
3. Ubah utilitas Tailwind menjadi `pt-[var(--safe-area-inset-top,env(safe-area-inset-top))]` agar mendukung ekosistem hibrida (*native* maupun web PC standar).