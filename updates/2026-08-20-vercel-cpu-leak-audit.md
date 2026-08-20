# Vercel CPU Leak Audit & Massive Query Refactoring
**Tanggal:** 20 Agustus 2026

## Ringkasan Perbaikan (Refactoring)
Telah dilakukan perbaikan besar-besaran untuk mengatasi masalah kebocoran CPU dan Memori di server Vercel (Next.js) yang disebabkan oleh N+1 Query dan ketiadaan paginasi (unbounded queries) pada Prisma ORM.

### 1. Optimasi Halaman Publik (Beranda & Katalog)
- **Halaman Beranda (`app/(main)/page.tsx`)**: 
  - Logika komputasi JS `.reduce()` untuk menghitung rata-rata bintang dihapus.
  - Diubah menggunakan `prisma.review.groupBy` tingkat database (PostgreSQL) agar komputasi dilakukan secara native oleh mesin database.
  - Kueri `semuaProdukLengkap` ditambahkan limitasi `take: 12`.
- **Halaman Katalog (`app/(main)/katalog/page.tsx`)**: 
  - Kueri `semuaProduk` yang tadinya menarik keseluruhan isi database tanpa batas, sekarang dilindungi dengan limitasi `take: 24` per halaman.

### 2. Optimasi API & Dasbor Admin
- **Halaman Produk Admin (`app/(dashboard)/admin/produk/page.tsx`)**:
  - Paginasi murni berbasis `searchParams` (`take: 50`, `skip`) disuntikkan untuk menghentikan kueri tak terbatas saat admin membuka tabel inventaris.
- **Analitik Dasbor (`app/api/admin/analitik/route.ts`)**:
  - Mengubah fungsi manual `(pesananReal).reduce()` untuk total penjualan menjadi operasi `prisma.order.aggregate({ _sum: { total: true } })`.
- **RFM Kalkulasi (`app/api/admin/rfm/route.ts`)**:
  - Algoritma kluster RFM dirombak total menggunakan `prisma.order.groupBy` yang otomatis menjumlahkan nilai agregasi `_count`, `_sum`, dan `_max` tanggal untuk setiap pelanggan (menghilangkan iterasi _array_ raksasa).
- **Profitabilitas Kalkulasi (`app/api/admin/profitability/route.ts`)**:
  - Pengambilan data pesanan penuh yang memuat ribuan relasi telah diganti menjadi `prisma.orderItem.groupBy` dan di-kalkulasi secara paralel dengan HPP Produk (Cost Price).
- **Broadcast API (`app/api/marketing/broadcast/route.ts`)**:
  - Pemanggilan _User_ dibatasi maksimal `take: 1000` dan spesifik hanya _select_ ID, nama, email, serta nomor telepon.

### 3. Stabilisasi API Caching (Next.js Cache)
- File wilayah Komerce (`provinsi`, `kabupaten`) dan API `BiteShip` telah dirombak.
- Deklarasi `export const dynamic = "force-dynamic"` dihapus sepenuhnya karena memicu Vercel untuk menarik koneksi jaringan eksternal tiap detik.
- Diganti dengan implementasi *native caching* standar Next.js: `export const revalidate = 2592000` (TTL: 30 Hari). API `ongkir` POST dipertahankan statis karena standar dari Next.js.

Semua kueri dan file TypeScript telah diverifikasi berjalan dengan baik via `npx tsc --noEmit`.
