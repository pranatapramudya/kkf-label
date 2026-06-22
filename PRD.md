# PRD: KKF Label Phase 2.4 - Audit Stabilitas & Skalabilitas Panel Admin

## 1. Objective (Tujuan)
Mencegah terjadinya *crash*, *memory leak*, atau *timeout* pada halaman dasbor admin ketika volume pesanan dan data pengguna (Mitra/Customer) mencapai ribuan baris. Panel admin harus tetap responsif dan menyajikan data secara *real-time* tanpa membebani *database*.

## 2. Analisis Masalah & Solusi
- **Masalah Overload Data (Fatal):** Menarik seluruh data pesanan dengan `prisma.pesanan.findMany()` tanpa batas akan menyebabkan *Out of Memory* pada *serverless function* dan membuat peramban (*browser*) admin *freeze*.
  - **Solusi:** Wajib mengimplementasikan *Server-Side Pagination* (Paginasi di sisi peladen). Server hanya boleh mengirimkan maksimal 20-50 data pesanan per halaman.
- **Masalah Pencarian Lambat (Bottleneck):** Ketika admin mencari nama pelanggan atau nomor resi di antara puluhan ribu data, *database* akan melakukan *Full Table Scan* yang sangat berat.
  - **Solusi:** Menambahkan *Database Indexing* (`@@index`) pada kolom yang sering dicari di `schema.prisma`.
- **Masalah Data Basi (Caching Conflict):** Konfigurasi *layout* Next.js secara *default* mungkin menahan *cache*, membuat pesanan baru tidak langsung muncul.
  - **Solusi:** Memaksa rute admin menjadi sepenuhnya dinamis (*force-dynamic*).

## 3. Spesifikasi Implementasi
1. **Server-Side Pagination:** Modifikasi *query* Prisma di halaman daftar pesanan (`/admin/pesanan`) dengan parameter `take` (limit) dan `skip` (offset).
2. **Prisma Indexing:** Tambahkan `@@index([statusPesanan])` dan `@@index([createdAt])` pada model `Pesanan` (atau `Order`) di `schema.prisma`.
3. **Dynamic Route:** Tambahkan `export const dynamic = 'force-dynamic';` pada setiap halaman utama admin agar data selalu aktual 100%.