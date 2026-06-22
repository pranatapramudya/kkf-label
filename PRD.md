# PRD: KKF Label Phase 2.17 - Capacitor Status Bar Overlap Fix

## 1. Objective (Tujuan)
Menyelesaikan masalah antarmuka (UI) di mana *header* aplikasi bertumpuk dengan *Status Bar* bawaan perangkat Android (jam, baterai, sinyal).

## 2. Analisis Masalah & Solusi
- **Masalah:** Sistem Capacitor secara bawaan merender *WebView* dalam mode *edge-to-edge* (menyeluruh hingga ujung layar), sehingga menabrak elemen perangkat keras (*notch/status bar*) pada antarmuka pengguna.
- **Solusi:** Memanfaatkan konfigurasi pengaya (plugin) bawaan Capacitor untuk mematikan mode *overlay*, sehingga sistem Android akan menyediakan ruang (ruang khusus) secara otomatis untuk *Status Bar*.

## 3. Spesifikasi Implementasi
1. Pastikan modul `@capacitor/status-bar` telah diinstal.
2. Modifikasi berkas `capacitor.config.ts`: Tambahkan blok pengaturan `StatusBar` di dalam objek `plugins` dengan nilai `overlay: false`.
3. Jalankan `npx cap sync android` untuk menyuntikkan pengaturan ke dalam kerangka *native*.