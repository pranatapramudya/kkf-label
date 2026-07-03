# Update PRD: Implement Mass Email Broadcast (Resend Batch API)

## 1. Latar Belakang Masalah
- Klien (Admin) membutuhkan fitur untuk melakukan *blast* (siaran) email promosi ke seluruh pelanggan secara massal langsung dari halaman Dasbor Admin, tanpa harus membuka dasbor pihak ketiga.
- Layanan yang digunakan adalah Resend. Kunci API sudah disiapkan di dalam *environment variable* `RESEND_API_KEY`.

## 2. Kebutuhan Solusi Logika (Requirement)
- **Pengambilan Data (Database Query):**
  - Rute API harus mengambil seluruh daftar email pelanggan yang valid dari *database* menggunakan Prisma (misalnya dari tabel `User` atau `Pelanggan`).
- **Logika Pengiriman Massal (Resend Batch):**
  - Gunakan fungsi `resend.batch.send([...])` untuk mengirim email.
  - Lakukan *mapping* (*looping*) dari data email yang didapat dari *database* untuk membentuk *array of objects* sesuai format Resend Batch API.
  - Untuk saat ini, gunakan alamat pengirim standar: `onboarding@resend.dev` (karena domain belum diverifikasi).
- **Refaktor UI Admin Promosi:**
  - Buat *form* sederhana yang terdiri dari:
    1. Input Teks: "Subjek Email Promo"
    2. Textarea: "Isi Pesan Promosi"
    3. Tombol Submit: "Kirim Broadcast Email"
  - Pastikan ada status *loading* saat tombol ditekan dan munculkan notifikasi (Toast) "Berhasil" atau "Gagal" setelah mendapatkan respons dari API.