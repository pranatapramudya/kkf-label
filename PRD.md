# Update PRD: Fix Resend Sandbox Limitation & PC Mailto Link

## 1. Latar Belakang Masalah
- **Error Email Massal:** Resend menolak *request batch* dengan error `Invalid 'to' field` karena akun masih dalam mode Sandbox (belum ada verifikasi domain). API mencoba mengirim ke email eksternal.
- **Error Tombol Individual:** Tombol "Email" (warna biru) di dalam tabel tidak berfungsi di PC desktop karena OS tidak memiliki *default email client* untuk menangani protokol `mailto:`.

## 2. Kebutuhan Solusi Logika (Requirement)
- **Bypass Resend Sandbox (Testing Mode):**
  - Di dalam file API route pengiriman email (`api/admin/broadcast/route.ts`), modifikasi hasil *mapping* data email dari Prisma.
  - Selama tahap *development* ini, paksa (override) parameter `to` menjadi email testing resmi (contoh: `prapranata20@gmail.com`) terlepas dari siapa pemilik pesanan tersebut.
  - (Opsional) Berikan *comment* di kode tersebut agar mudah dikembalikan ke email pelanggan asli (`user.email`) setelah domain production `.com` diverifikasi.
- **Perbaikan Tombol Email di Tabel (Universal Mail Link):**
  - Ubah logika tombol "Email" biru pada tabel. Jangan gunakan protokol standar `mailto:email@domain.com`.
  - Gunakan URL Gmail Web Composer agar bisa dibuka langsung via Browser di PC maupun HP.
  - Format URL: `https://mail.google.com/mail/?view=cm&fs=1&to={email_pelanggan}`.
  - Pastikan tombol menggunakan atribut `target="_blank" rel="noopener noreferrer"`.