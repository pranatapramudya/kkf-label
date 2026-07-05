# Product Requirements Document (PRD) - Algoritma "Terakhir Dilihat" & Sorting Katalog

## 1. Konteks
Sebagai bagian dari audit dan peningkatan fitur fase akhir, sistem memerlukan dua algoritma tambahan untuk memaksimalkan retensi dan User Experience (UX):
1. **Recently Viewed Tracker (Client-Side):** Mengingatkan pengunjung tentang produk yang baru saja mereka lihat tanpa membebani database.
2. **Catalog Sorting Engine (Server-Side/Prisma):** Memungkinkan pengunjung mengurutkan produk di halaman katalog berdasarkan Harga dan Ketersediaan.

## 2. Detail Tugas (Tasks)

**Task A: Algoritma "Terakhir Dilihat" (LocalStorage Tracker)**
- Buka komponen Detail Produk Klien (`app/(main)/produk/[slug]/page.tsx`).
- Buat logika `useEffect`: Setiap kali halaman produk dirender, simpan data ringkas produk tersebut (id, nama, harga, gambar, slug) ke dalam `localStorage` browser dengan key `kkf_recently_viewed`. 
- Batasi array maksimal 10 produk. Gunakan filter untuk mencegah duplikasi (jika produk sudah ada di array, pindahkan ke urutan pertama).

**Task B: UI "Terakhir Kamu Lihat" di Beranda**
- Buka komponen Beranda (`app/(main)/page.tsx` atau komponen slider-nya).
- Tambahkan section baru berjudul "Terakhir Kamu Lihat" (tampilkan hanya jika array di `localStorage` tidak kosong).
- Render daftar produk dari `localStorage` tersebut dalam bentuk horizontal scroll (seperti kategori lainnya, namun TIDAK PERLU auto-scroll/marquee).

**Task C: Algoritma Sorting Katalog**
- Buka halaman `/katalog`.
- Tambahkan elemen `select` dropdown atau *Chips* berjejer di bawah filter kategori dengan opsi: "Terbaru" (Default), "Harga: Rendah ke Tinggi", dan "Harga: Tinggi ke Rendah".
- Hubungkan *state* sorting ini ke parameter URL (`?sort=asc` atau `desc`).
- Update Prisma Query di route katalog untuk membaca parameter sort tersebut dan terapkan pada argumen `orderBy: { harga: 'asc' | 'desc' }`.

**Task D: Dokumentasi Menyeluruh**
- Buka `README.md`. Tambahkan daftar fitur baru di bagian Klien: "Recently Viewed Products (Nol-Beban Database)" dan "Dynamic Price Sorting".
- Buka `SYSTEM_ARCHITECTURE.md`. Tambahkan poin "Client-Side LocalStorage Tracking" di bagian Algoritma & Performa, jelaskan bahwa ini adalah pendekatan hemat *resource* untuk fitur histori penjelajahan.
- Perbarui kalimat agar tetap profesional dan mencerminkan arsitektur SaaS yang skalabel. Gunakan bahasa Indonesia.