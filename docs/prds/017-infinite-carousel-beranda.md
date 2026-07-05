# Product Requirements Document (PRD) - Infinite Auto-Scroll Carousel Beranda

## 1. Konteks
Daftar produk di halaman Beranda (kategori Semua Produk, dll) saat ini menggunakan scroll horizontal standar yang memiliki batas akhir (mentok). Pengguna menginginkan fitur Auto-Scroll yang berjalan terus-menerus (Infinite Loop) secara otomatis, berfungsi dengan mulus baik di perangkat mobile/iOS maupun Desktop.

## 2. Detail Tugas (Tasks)

**Task A: Konfigurasi Animasi di Tailwind**
- Buka file `tailwind.config.ts`.
- Tambahkan keyframes untuk animasi `scroll` atau `marquee` yang mentranslasikan elemen dari `translateX(0)` ke `translateX(-50%)` atau `-100%`.
- Tambahkan konfigurasi `animation: { marquee: 'marquee 25s linear infinite' }`.

**Task B: Implementasi Seamless Loop di Komponen**
- Buka komponen Klien untuk slider produk di Beranda.
- Untuk menciptakan ilusi tanpa batas (infinite), gandakan array produk yang dirender. Contoh: `const duplicatedProducts = [...products, ...products];` (atau render dua blok `.map` berdampingan di dalam satu *wrapper*).
- Terapkan class animasi Tailwind yang sudah dibuat ke *container* flex yang membungkus produk tersebut.

**Task C: Interaksi User (Pause on Hover/Touch)**
- Tambahkan class CSS/Tailwind agar animasi berhenti saat pengguna menyorot (hover) atau menyentuh (active/focus) area carousel, misalnya menggunakan custom class yang mengubah `animation-play-state: paused`. Ini sangat penting agar pengguna dapat mengklik produk yang sedang bergerak.

## 3. Aturan Pengembangan (Strict Rules)
1. **NO HEAVY LIBRARIES:** Prioritaskan penggunaan CSS Murni (Tailwind) alih-alih meng-install library berat seperti SwiperJS, kecuali jika implementasi manual dirasa tidak optimal untuk pengalaman *touch/swipe* di mobile iOS (opsional menggunakan `framer-motion` jika sudah ada).
2. **NO GIT PUSH/COMMIT:** Lakukan perubahan HANYA di lingkungan localhost.