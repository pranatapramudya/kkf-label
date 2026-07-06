# PRD: 025 Finalisasi Spacing & Tipografi Beranda

## 1. Konteks
Evaluasi UI beranda menunjukkan adanya ruang kosong (whitespace) yang terlalu besar di bagian atas (antara header logo dan badge koleksi terbaru). Hal ini mendorong seluruh konten ke bawah, menyebabkan kartu produk terbaru terpotong oleh bottom navigation bar pada tampilan mobile. Selain itu, label pada menu grid icon kurang terlihat tegas.

## 2. Tujuan
- Memangkas margin/padding atas secara drastis agar elemen Hero section (badge dan judul gradasi) naik mendekati header.
- Memastikan keseluruhan konten (terutama produk di bagian bawah) naik dan masuk ke dalam viewport pertama (above the fold) tanpa terpotong bottom bar.
- Mempertegas tipografi pada label menu icon.

## 3. Persyaratan Fungsional & UI (Requirements)
- **Koreksi Spacing Atas (Top Whitespace):**
  - Cari container utama di `app/page.tsx` (atau komponen Hero). Kurangi nilai padding-top atau margin-top yang berlebihan (misal dari `pt-24` atau `mt-16` menjadi `pt-4` atau `pt-6`).
  - Pastikan jarak antara header utama (logo KKF LABEL) dengan badge "Koleksi terbaru 2026" sangat minim namun tetap rapi.
- **Tipografi Menu Grid:**
  - Tambahkan class Tailwind `font-bold` dan `text-black` (atau `text-gray-900`) pada label teks "SEMUA PRODUK" dan "PALING DISUKAI".
- **Koreksi Spacing Bawah (Bottom Safe Area):**
  - Pastikan container utama halaman memiliki padding-bottom yang cukup (misal `pb-24` atau `pb-28`) agar ketika user men-scroll sampai mentok ke bawah, bagian bawah kartu produk tidak tertutup oleh fixed bottom navigation.

## 4. Pembaruan Dokumentasi
- Lakukan minor update pada `README.md` (jika diperlukan) terkait penyempurnaan UI responsif mobile.