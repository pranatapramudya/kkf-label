# Product Requirements Document (PRD) - Implementasi Technical SEO & Pembaruan Dokumentasi

## 1. Konteks
Aplikasi KKF Label membutuhkan optimasi *Search Engine Optimization* (SEO) teknikal secara menyeluruh agar dapat bersaing di halaman pencarian Google tanpa iklan. Optimasi ini mencakup Metadata Dinamis, pembuatan Sitemap & Robots.txt otomatis, optimasi Semantic HTML, serta pembaruan pada dokumen arsitektur proyek.

## 2. Detail Tugas (Tasks)

**Task A: Dynamic Metadata (Next.js)**
- Buka halaman detail produk (`app/(main)/produk/[slug]/page.tsx` atau file serupa).
- Implementasikan fungsi `generateMetadata` dari Next.js.
- Tarik data dari Prisma berdasarkan parameter `slug` atau `id`, lalu atur `<title>` menjadi `[Nama Produk] | KKF Label` dan `description` mengambil dari teks deksripsi produk.

**Task B: Sitemap & Robots.txt Dinamis**
- Buat file `app/sitemap.ts` yang memanfaatkan fungsi bawaan Next.js.
- Lakukan query ke Prisma untuk mengambil semua produk aktif (`isArchived: false`).
- *Return* URL statis (Beranda, Lacak Pesanan, dll) dan URL dinamis (URL setiap produk) beserta `lastModified`-nya.
- Buat file `app/robots.ts` standar yang mengizinkan semua *crawling* (`User-Agent: *`, `Allow: /`) dan arahkan path sitemap ke `/sitemap.xml`, tetapi `Disallow` untuk rute `/admin` dan API rahasia.

**Task C: Semantic HTML & Optimasi Gambar**
- Pastikan semua pemanggilan `<Image>` dari `next/image` di halaman produk memiliki atribut `alt` yang dinamis sesuai dengan nama produk asli, bukan sekadar teks statis.
- Pastikan halaman detail produk hanya memiliki satu tag `<h1>` untuk Nama Produk.

**Task D: Pembaruan Dokumentasi (README & SYSTEM_ARCHITECTURE)**
- Buka file `README.md` dan tambahkan sub-fitur baru di bagian "Customer Storefront" mengenai "Technical SEO Ready (Dynamic Sitemap, Robots.txt, & Meta Tags)".
- Buka file `SYSTEM_ARCHITECTURE.md`, tambahkan satu bab baru (misal: "6. Arsitektur SEO & Web Vitals") yang menjelaskan bagaimana Next.js men-generate sitemap secara dinamis dari database Prisma dan bagaimana metadata produk dirender di sisi server untuk *crawler* Google.

## 3. Aturan Pengembangan (Strict Rules)
1. **NO PRODUCTION PUSH:** Dilarang mengeksekusi perintah terminal atau git.
2. Semua *coding*, deskripsi meta tag, atribut gambar, dan pembaruan dokumen harus menggunakan Bahasa Indonesia.
3. Langsung modifikasi dan buat file yang diperlukan di dalam *codebase* lokal.