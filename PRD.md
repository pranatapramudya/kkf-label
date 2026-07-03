# Update PRD: Fix Broadcast Email Data Fetching Logic

## 1. Latar Belakang Masalah
- UI Halaman Promosi sudah berhasil menampilkan daftar pelanggan beserta emailnya di tabel "Pelanggan Setia".
- Namun, saat fungsi "Kirim Email Massal" dieksekusi, API mengembalikan *error* "Tidak ada data email pelanggan yang valid di database".
- Hal ini mengindikasikan adanya ketidaksesuaian (*mismatch*) antara Prisma *query* yang digunakan untuk me-render tabel dengan Prisma *query* di dalam API *route* pengiriman email.

## 2. Kebutuhan Solusi Logika (Requirement)
- **Sinkronisasi Query Database:**
  - Buka *file* API route untuk pengiriman email broadcast (contoh: `api/admin/broadcast/route.ts` atau fungsi server action terkait).
  - Periksa darimana data tabel "Pelanggan Setia" diambil (apakah dari model `Pesanan` yang di-*grouping*, atau model `Pelanggan`).
  - Gunakan logika Prisma yang **SAMA PERSIS** di dalam API pengiriman email untuk mengambil (meng-ekstrak) alamat email tersebut.
- **Validasi & Filtering:**
  - Pastikan hasil *query* di-*filter* (saring) untuk membuang baris yang tidak memiliki email (`email !== null` dan `email !== ''`).
  - Ekstrak datanya menjadi *array of strings* murni, contoh: `const emailList = ['email1@gmail.com', 'email2@gmail.com']`.
  - Teruskan `emailList` ini ke *payload* `resend.batch.send()`.