# PRD: KKF Label Phase 2.21 - Perbaikan Otorisasi Middleware Clerk untuk Admin

## 1. Objective (Tujuan)
Memastikan seluruh email yang didaftarkan sebagai admin memiliki hak akses penuh ke halaman dasbor admin tanpa terblokir atau terlempar kembali ke halaman pelanggan.

## 2. Analisis Masalah & Solusi
- **Masalah:** Akun dengan email `uwen.rejekismd@gmail.com` berhasil melakukan autentikasi (login/reset password) di sistem Clerk, namun sistem *middleware* Next.js menolak aksesnya ke *route* admin. Hal ini mengindikasikan adanya kegagalan pencocokan *string array* email statis atau ketergantungan pada *metadata role* yang belum tersinkronisasi.
- **Solusi:** Memperbarui dan merapikan logika pengecekan otorisasi pada berkas `middleware.ts`. Menambahkan *fallback* atau validasi *hardcoded* untuk *array whitelist* email admin agar rute terlindungi dapat dilewati oleh akun yang terdaftar.

## 3. Spesifikasi Implementasi
1. Buka berkas `middleware.ts`.
2. Validasi ulang *array* yang menyimpan daftar email admin. Pastikan daftar berikut masuk ke dalam *whitelist* tanpa *typo* atau spasi berlebih:
   - kkflabel@gmail.com
   - pranatapramudya39@gmail.com
   - pranajaya52@gmail.com
   - uwen.rejekismd@gmail.com
3. Pastikan logika *routing* mengizinkan akses ke rute admin (misal: `/admin/:path*`) jika email *user* yang *login* cocok dengan salah satu dari *array* di atas.