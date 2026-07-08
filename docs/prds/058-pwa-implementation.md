# PRD 058: Implementasi Progressive Web App (PWA) KKF Label

## 1. Meta Data
* **Dokumen:** PRD-058
* **Judul:** Implementasi PWA untuk Frontend dan Admin KKF Label
* **Target OS:** Android (Chrome, Play Store via TWA) & iOS (Safari)
* **PIC:** Arsitek Sistem / Full-Stack Engineer

## 2. Tujuan (Objective)
Membangun sistem PWA agar web KKF Label dapat diinstal sebagai aplikasi mandiri di perangkat *mobile* pengguna. PWA ini akan menggunakan *single codebase* (Next.js) yang dapat menangani *routing* pelanggan (toko) dan admin (dashboard) tanpa perlu *build* APK/AAB manual, dengan opsi ekspansi ke Google Play Store menggunakan Trusted Web Activity (TWA) di masa depan.

## 3. Penanganan Arsitektur & Lingkungan (Environment)
* **Pembersihan Root Directory:** Hapus direktori `/android` dari *repository* Next.js saat ini untuk menerapkan *Separation of Concerns* dan meringankan beban *repository*.
* **Local First Strategy:** Seluruh pengerjaan dan pengujian **wajib dilakukan di `localhost`** terlebih dahulu pada *branch* terpisah (misal: `feature/058-pwa`). Dilarang melakukan *push* ke Vercel sebelum Service Worker berjalan stabil di lokal.

## 4. Spesifikasi Teknis (Langkah Eksekusi)

### Step 1: Instalasi Dependensi
Jalankan perintah ini di terminal root *project*:
`npm install @ducanh2912/next-pwa`

### Step 2: Konfigurasi File `next.config.js`
Bungkus konfigurasi Next.js yang sudah ada. PWA akan di-*disable* saat mode *development* agar tidak mengganggu *hot-reloading* saat koding.

```javascript
const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === "development",
  workboxOptions: {
    disableDevLogs: true,
  },
});

module.exports = withPWA({
  // Konfigurasi Next.js yang sudah ada sebelumnya taruh di sini
});

Step 3: Persiapan Aset & Manifest (public/manifest.json)
Buat file manifest.json di dalam folder public. Siapkan dua aset gambar logo KKF Label (icon-192x192.png dan icon-512x512.png) dan letakkan juga di folder public.

{
  "name": "KKF Label",
  "short_name": "KKF",
  "description": "Fashion wanita minimalis untuk hari yang terasa lembut.",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#ff0080",
  "icons": [
    {
      "src": "/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}

Step 4: Injeksi Meta Tags di app/layout.tsx
Tambahkan tag meta PWA di dalam fungsi metadata atau langsung di bagian <head> pada root layout agar browser mengenali aplikasi.

<link rel="manifest" href="/manifest.json" />
<meta name="theme-color" content="#ff0080" />
<link rel="apple-touch-icon" href="/icon-192x192.png" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="default" />

5. Alur Pengujian (Testing Flow di Localhost)
Build Local: Karena PWA di-disable di mode dev, jalankan npm run build dilanjut npm run start untuk mengetes PWA secara lokal.

Lighthouse Check: Buka localhost:3000, buka Chrome DevTools -> Lighthouse. Jalankan test PWA dan pastikan mendapat centang hijau (Installable).

Simulasi Install: Cek pada address bar Chrome, pastikan muncul ikon instalasi (layar monitor dengan tanda panah ke bawah).

6. Kriteria Penerimaan (Acceptance Criteria)
Folder android lama sudah terhapus dari repository.

Web berhasil diinstal dari browser ke Home Screen (tampil sebagai aplikasi Standalone tanpa address bar).

Console browser bersih dari error Service Worker.

Kode berhasil di-merge dan berjalan lancar di Production (Vercel) tanpa bentrok dengan routing Clerk.