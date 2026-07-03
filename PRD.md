# Update PRD: Konfigurasi Native Status Bar (Capacitor)

## 1. Latar Belakang
- Aplikasi KKF Label telah di-build menjadi APK menggunakan Capacitor.
- Pada perangkat Android/iOS, teks pada Status Bar (jam, sinyal, baterai) berwarna putih, sehingga tidak terlihat karena menyatu dengan background TopBar aplikasi yang juga berwarna putih (Light Mode).

## 2. Kebutuhan Solusi Logika (Requirement)
- **Konfigurasi Plugin Capacitor Status Bar:**
  - Integrasikan `@capacitor/status-bar` ke dalam proyek.
  - Ubah gaya (*style*) Status Bar secara global melalui file `capacitor.config.ts` (atau `.json`) agar menggunakan tema `LIGHT` (yang berarti *background* terang, sehingga teks/ikon status bar otomatis menjadi gelap/hitam).
  - Tetapkan `backgroundColor` status bar menjadi `#ffffff` (putih) agar serasi dengan *header* aplikasi.
  - Opsi tambahan: Lakukan pengaturan *safe-area* atau padding di `globals.css` (menggunakan `env(safe-area-inset-top)`) jika status bar menutupi konten web.