# PRD: Custom Free Allowlist (v31.0)

## 1. Objective
Membuat sistem *Allowlist* kustom di level aplikasi (Server-Side) untuk membatasi akses dasbor admin hanya kepada 4 email spesifik, sebagai alternatif gratis dari fitur Clerk Pro.

## 2. Scope of Work
- **Server-Side Authorization:** Menggunakan fungsi `currentUser()` dari `@clerk/nextjs/server` di dalam *root layout* admin (`app/(dashboard)/layout.tsx`).
- **Email Validation:** Mengekstrak alamat email pengguna yang sedang *login* dan mencocokkannya dengan array `ALLOWED_EMAILS`.
- **Rejection Logic:** Jika pengguna *login* dengan email di luar daftar tersebut, sistem akan langsung melakukan `redirect` ke halaman utama (`/`) atau merender komponen "Akses Ditolak".

## 3. Strict Guidelines
- **Hardcoded Security:** Array email di-*hardcode* dengan aman di sisi server agar tidak bisa dimanipulasi dari *client*.
- **List Email yang Diizinkan:** 1. pranatapramudya39@gmail.com
  2. pranajaya52@gmail.com
  3. kkflabel@gmail.com
  4. uwenkuswendi5@gmail.com