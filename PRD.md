# Update PRD: Security Patch & Performance Optimization (Pre-Launch)

## 1. Latar Belakang Masalah
Berdasarkan hasil audit pre-launch, ditemukan 4 celah (blind spots) krusial pada arsitektur sistem yang harus segera ditambal sebelum aplikasi dirilis ke publik:
- **Webhook Idempotency:** Risiko pemrosesan ganda pada notifikasi Midtrans yang dapat menyebabkan pengurangan stok berkali-kali untuk satu pesanan.
- **Backend File Validation:** Validasi ukuran dan jenis file bukti transfer saat ini hanya berada di sisi klien (frontend), sehingga rentan di-bypass menggunakan tools API (seperti Postman).
- **Race Condition:** Pengurangan stok rentan terhadap *race condition* jika dua pengguna melakukan *checkout* pada milidetik yang sama.
- **Database Scalability:** Tabel `Order` dan `Product` belum memiliki indeks pencarian, yang berisiko memperlambat performa saat data membesar.

## 2. Kebutuhan Solusi Logika (Requirement)
- **Keamanan Webhook (Idempotency):**
  - Validasi `signature_key` dari Midtrans (gabungan `order_id`, `status_code`, `gross_amount`, dan `ServerKey` yang di-hash menggunakan SHA512).
  - Pastikan sistem mengecek apakah pesanan sudah berstatus `DIBAYAR` di database sebelum melakukan update status dan pengurangan stok. Jika sudah `DIBAYAR`, abaikan webhook (return 200 OK).
- **Validasi Backend (Storage):**
  - Di dalam rute `/api/upload-bukti/route.ts`, tambahkan validasi *server-side*: maksimal ukuran *buffer* 3MB dan tipe MIME yang diizinkan hanya `image/jpeg`, `image/png`, dan `image/webp`. Tolak *request* jika tidak sesuai (return 400 Bad Request).
- **Atomic Transaction (Prisma):**
  - Bungkus operasi pembuatan pesanan (`prisma.order.create`) dan pengurangan stok produk (`stokTotal: { decrement: x }`) ke dalam `prisma.$transaction` agar terhindar dari *race condition*.
- **Database Indexing:**
  - Tambahkan `@@index([kodePesanan])` dan `@@index([statusPesanan])` pada model `Order` di dalam `schema.prisma`.