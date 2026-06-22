# PRD: KKF Label Phase 2.10 - Notch/Safe Area Inset Optimization

## 1. Objective (Tujuan)
Memperbaiki antarmuka pengguna (UI) yang menabrak *notch* (poni) atau *status bar* pada ponsel pintar modern tanpa perlu melakukan *build* ulang pada level *native*.

## 2. Analisis Masalah & Solusi
- **Masalah:** Sistem Capacitor dengan layar penuh (*fullscreen*) akan merender konten mulai dari piksel 0 paling atas, yang berisiko tertutup oleh perangkat keras kamera.
- **Solusi:** Menerapkan instruksi `viewport-fit=cover` pada meta *viewport* Next.js, dan menambahkan utilitas *padding* berbasis *environment variables* bawaan peramban, yaitu `env(safe-area-inset-top)` dan `env(safe-area-inset-bottom)`.

## 3. Spesifikasi Implementasi
1. Ekspor objek `viewport` dengan properti `viewportFit: 'cover'` pada `layout.tsx` utama Next.js.
2. Tambahkan kelas utilitas Tailwind kustom `pt-[env(safe-area-inset-top)]` dan `pb-[env(safe-area-inset-bottom)]` pada pembungkus (container) layout utama admin/auth.