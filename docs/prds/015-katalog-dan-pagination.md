# Product Requirements Document (PRD) - Halaman Katalog Semua Produk & Pagination Mobile

## 1. Konteks
Saat ini, tombol "Lihat Katalog" di beranda belum mengarah ke halaman khusus yang menampilkan semua produk. Pengguna (berdasarkan standar Shopee/Tokopedia) membutuhkan halaman `/katalog` khusus dengan layout mobile berupa *grid* 2 kolom. Untuk menjaga performa, produk yang ditampilkan dibatasi 10 item (5 baris) pada pemuatan awal, dengan fitur penambahan pemuatan (*load more/pagination*) saat di-scroll ke bawah.

## 2. Detail Tugas (Tasks)

**Task A: Update Tautan "Lihat Katalog"**
- Buka komponen Beranda (Hero section) yang berisi tombol "Lihat Katalog".
- Ubah aksi tombol tersebut menggunakan `<Link href="/katalog">` dari Next.js agar mengarahkan pelanggan ke halaman katalog baru.

**Task B: Buat Halaman Katalog Utama (`/katalog`)**
- Buat *route* baru di `app/(main)/katalog/page.tsx` (atau sesuaikan dengan struktur folder Klien).
- Halaman ini wajib merender komponen *Client* untuk menangani *state* pagination dan filter.
- Tampilkan *Chips/Badge* filter kategori di bagian atas (Semua, Setelan Rajut, Cardigan Rajut Wanita, dll) yang bisa digeser horizontal (`overflow-x-auto`).

**Task C: Implementasi Mobile Grid 2 Kolom**
- Gunakan Tailwind `grid grid-cols-2 gap-3` pada *container* daftar produk agar secara konsisten menampilkan 2 produk berdampingan (kiri-kanan) di layar HP.
- Pada layar tablet/desktop, sesuaikan menjadi `md:grid-cols-4 lg:grid-cols-5`.

**Task D: Logika Pagination / Load More**
- Tampilkan maksimal 10 produk (5 baris ke bawah) pada *state* awal.
- Tambahkan tombol "Muat Lebih Banyak" di bagian bawah grid (atau gunakan *Infinite Scroll Observer* jika memungkinkan).
- Setiap kali *next* atau dimuat ulang, tambahkan 10 produk berikutnya yang sesuai dengan kategori yang sedang dipilih.

## 3. Aturan Pengembangan (Strict Rules)
1. **MOBILE FIRST:** Pastikan ukuran *font* judul produk, harga, dan label diskon disesuaikan agar tidak tumpang tindih dalam mode 2 kolom.
2. **NO GIT PUSH/COMMIT:** Lakukan perubahan HANYA di lingkungan localhost.
3. Seluruh komponen Klien dan logika filter harus dioptimalkan untuk Next.js App Router (`"use client"`).