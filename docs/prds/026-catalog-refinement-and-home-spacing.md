# PRD: 026 Penyempurnaan Spacing Beranda & Modernisasi UI Katalog

## 1. Konteks
Terdapat beberapa elemen UI yang perlu dioptimalkan berdasarkan feedback visual terbaru. Di halaman Beranda, section produk terbaru masih terlalu ke bawah. Di halaman Katalog, UI dropdown "Urutkan" terlihat kaku karena berukuran full-width, terdapat jejak garis scrollbar horizontal pada menu kategori yang mengganggu estetika (kurang clean), dan komponen Footer default memakan ruang layar yang tidak perlu karena sudah ada bottom navigation bar.

## 2. Tujuan
- Menarik section produk di halaman beranda lebih ke atas mendekati menu icon navigasi.
- Mengubah desain dropdown filter "Urutkan" menjadi komponen modern yang ringkas (compact/pill style).
- Menghilangkan jejak garis (track) scrollbar pada menu kategori horizontal.
- Menyembunyikan komponen Footer secara spesifik hanya pada halaman Katalog.

## 3. Persyaratan Fungsional & UI (Requirements)
- **Koreksi Spacing Beranda (`app/page.tsx`):**
  - Kurangi jarak (`margin-top` atau `gap`) antara komponen navigasi menu icon dengan komponen daftar produk terbaru di bawahnya. Pastikan posisi produk naik secara signifikan.
  - Periksa kembali container bagian atas (Hero), kurangi lagi padding/margin atas jika masih ada sisa whitespace yang tidak perlu.
- **Modernisasi Filter Urutkan (`app/katalog/page.tsx` atau terkait):**
  - Ubah elemen dropdown `<select>` "Urutkan" yang sebelumnya `w-full` (lebar penuh) menjadi `w-fit` atau `w-auto`.
  - Gunakan styling modern: ukuran teks lebih kecil (`text-sm`), border tipis melingkar (`rounded-full` atau `rounded-lg`), padding yang proporsional, dan posisikan berdampingan (inline) atau sejajar rata kiri/kanan dengan rapi.
- **Hide Scrollbar Kategori:**
  - Tambahkan utility class untuk menyembunyikan scrollbar pada container kategori (tambahkan class `scrollbar-hide` jika menggunakan plugin tailwind-scrollbar-hide, atau gunakan inline style/CSS custom `&::-webkit-scrollbar { display: none; }`).
- **Kondisional Footer:**
  - Cari file layout utama yang me-render `<Footer />` (biasanya `app/layout.tsx` atau `app/(storefront)/layout.tsx`).
  - Implementasikan logika kondisional (menggunakan `usePathname` dari `next/navigation`) agar komponen `<Footer />` **TIDAK** dirender saat user berada di rute `/katalog` (atau `/semua-produk`).

## 4. Pembaruan Dokumentasi
- Tidak ada pembaruan dokumen arsitektur yang mendesak untuk perubahan UI ini, cukup pastikan kode rapi dan modular.