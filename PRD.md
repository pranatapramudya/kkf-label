# Update PRD: Migration to Resend for Professional Email Promotions

## 1. Latar Belakang Masalah
- Fitur promosi via WhatsApp dihentikan karena dinilai kurang profesional untuk *blast* massal dan memiliki risiko *banned* dari Meta.
- Proyek ini akan menggunakan **Resend** sebagai layanan pengiriman email promosi resmi karena terintegrasi sangat baik dengan ekosistem Next.js.

## 2. Kebutuhan Solusi Logika (Requirement)
- **Integrasi Resend SDK:**
  - Lakukan instalasi dependensi Resend: `npm install resend`.
  - Gunakan `process.env.RESEND_API_KEY` untuk inisialisasi *client* Resend di *backend*.
- **Pembuatan API Route Email Promo:**
  - Buat *endpoint* baru (misal `app/api/admin/promo/email/route.ts`).
  - *Endpoint* ini harus menerima *payload* berupa daftar email tujuan (atau ID *user*), subjek promo, dan isi/konten promo.
  - Gunakan `resend.emails.send({...})` untuk mengirim email.
- **Refaktor Halaman Admin Promosi:**
  - Hapus tombol/logika pengiriman via WhatsApp.
  - Ubah UI menjadi *form* pengiriman Email Promo. Admin harus bisa memasukkan Subjek Email dan Pesan Promo.
  - Saat tombol "Kirim Promo Email" diklik, *frontend* akan menembak *endpoint* API Resend yang baru dibuat.
  - Tambahkan indikator *loading* (Toaster/Notifikasi UI) agar Admin tahu email sedang diproses dan berhasil dikirim.