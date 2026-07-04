# Product Requirements Document (PRD) - Audit & Pembersihan Variabel Lingkungan (.env)

## 1. Konteks
Aplikasi saat ini menggunakan Next.js. Terdapat indikasi bahwa beberapa variabel lingkungan (environment variables) rahasia terekspos ke *client-side* karena menggunakan awalan `NEXT_PUBLIC_`. Hal ini berisiko membocorkan kredensial melalui fitur *Inspect Element* di browser.

## 2. Detail Tugas (Tasks)

**Task A: Pemisahan Variabel Publik vs Rahasia**
- Analisa seluruh variabel di dalam file `.env` (atau file *config* sejenis).
- **Pertahankan** `NEXT_PUBLIC_` hanya untuk variabel yang memang WAJIB diakses klien (misal: Clerk Publishable Key, URL API Publik).
- **Hapus** awalan `NEXT_PUBLIC_` dari variabel yang bersifat SANGAT RAHASIA (misal: `DATABASE_URL` untuk Prisma/PostgreSQL, Resend API Key, Midtrans Server Key, JWT Secrets, atau kredensial backend lainnya).

**Task B: Penyesuaian Pemanggilan di Kode**
- Setelah nama variabel diubah (awalan `NEXT_PUBLIC_` dihapus), cari seluruh file `.ts` atau `.tsx` yang memanggil variabel tersebut.
- Ubah pemanggilannya. Contoh: dari `process.env.NEXT_PUBLIC_DATABASE_URL` menjadi `process.env.DATABASE_URL`.
- Pastikan variabel rahasia tersebut HANYA dipanggil di dalam file yang aman, seperti *Server Actions*, API Routes (`app/api/...`), atau *Server Components* murni.

## 3. Aturan Pengembangan (Strict Rules)
1. **NO PRODUCTION PUSH:** Dilarang keras melakukan `git add`, `git commit`, atau `git push`.
2. **LOCAL UPDATE ONLY:** Edit langsung isi file `.env` (atau `.env.local` / `.env.example`) dan file `.ts/.tsx` yang terdampak di lokal.
3. Dokumentasi dan *comment* perbaikan di dalam kode harus menggunakan bahasa Indonesia.