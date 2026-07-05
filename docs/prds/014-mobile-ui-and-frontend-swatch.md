# Product Requirements Document (PRD) - Mobile Responsiveness & Frontend Color Swatches

## 1. Konteks
Terdapat dua area yang perlu disempurnakan berdasarkan pengujian di perangkat mobile (iOS):
1. **Admin UI:** Tampilan "Daftar Produk" dan "Form Varian" sangat berantakan dan berdempetan di layar kecil. Elemen memaksakan layout horizontal.
2. **Klien UI (Frontend):** Pilihan varian warna di halaman detail produk masih berupa teks. Perlu diubah menjadi elemen visual (Color Swatches) berdasarkan data Hex yang sudah di-scan oleh admin, dan visual ini harus terbawa hingga ke Keranjang dan Checkout.

## 2. Detail Tugas (Tasks)

**Task A: Perbaikan Responsif "Daftar Produk" (Admin)**
- Buka komponen list produk admin.
- Batasi panjang teks judul produk menggunakan Tailwind `line-clamp-2` agar maksimal hanya 2 baris pada mobile.
- Pada bagian detail (Harga, Stok, Kategori), gunakan `flex-wrap` dan sesuaikan ukuran teks (`text-sm` atau `text-xs` pada mobile) agar tidak tumpang tindih.

**Task B: Perbaikan Responsif "Form Varian" (Admin)**
- Buka komponen Dynamic Form untuk varian produk.
- Ubah layout grid/flex pada setiap baris varian. Pada layar kecil (mobile), buat input (Ukuran, Warna, Stok, dan Tombol) menumpuk ke bawah (`flex-col` atau grid yang disesuaikan) atau beri jarak (gap) yang memadai agar tombol scanner (📷) dan kotak warna tidak tergencet. Pastikan di layar medium/besar (`md:`) kembali ke layout horizontal.

**Task C: Visual Color Swatches di Halaman Detail Produk (Klien)**
- Buka komponen Klien untuk halaman Detail Produk (tempat pelanggan memilih varian sebelum *Add to Cart*).
- Buat logika deteksi: Jika nama varian mengandung kode Hex (contoh: `#FF0000`), render pilihan tersebut sebagai elemen visual (misalnya lingkaran warna berukuran `w-8 h-8` dengan `bg-[hex]`).
- Tampilkan *tooltip* atau teks nama varian saat *swatch* warna tersebut dipilih.
- Pastikan data Hex ini terkirim dengan benar ke state Keranjang (Cart) sehingga di halaman Checkout warnanya juga muncul secara visual.

## 3. Aturan Pengembangan (Strict Rules)
1. **UI/UX FIRST:** Pastikan penggunaan *utility classes* Tailwind seperti `sm:`, `md:`, `flex-wrap`, dan `gap` diterapkan dengan rapi.
2. **NO GIT PUSH/COMMIT:** Lakukan perubahan HANYA di lingkungan localhost.
3. Gunakan bahasa Indonesia untuk komentar kode.