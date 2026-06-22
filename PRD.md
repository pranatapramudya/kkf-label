# PRD: KKF Label Phase 2.12 - Middleware Redirect & Meta Theme Color

## 1. Objective (Tujuan)
Memperbaiki aturan pengalihan (*redirect*) pada Middleware agar pengguna yang tidak terautentikasi di rute admin tetap diarahkan ke halaman masuk admin, serta memaksa OS Android khusus (seperti itelOS) untuk menghormati warna *status bar*.

## 2. Analisis Masalah & Solusi
- **Masalah Middleware:** Fitur *logout* tertahan oleh `middleware.ts` yang secara paksa mengalihkan pengguna tamu dari rute `/admin` ke beranda utama `/`.
  - **Solusi:** Menambahkan logika kondisional pada `clerkMiddleware` untuk memisahkan pengalihan rute publik dan rute admin (`/admin` dikembalikan ke `/admin`).
- **Masalah Status Bar Custom ROM:** Beberapa perangkat mengabaikan `safe-area` CSS.
  - **Solusi:** Menambahkan atribut `themeColor` pada ekspor *viewport* utama di Next.js untuk memaksa peramban internal (WebView) menyelaraskan warna perangkat keras dengan aplikasi.

## 3. Spesifikasi Implementasi
1. Edit berkas `middleware.ts`: Tentukan `unauthenticatedUrl` secara spesifik menunjuk ke `/admin` jika permintaan berasal dari rute admin.
2. Edit berkas `layout.tsx`: Tambahkan `themeColor: '#0f172a'` (atau warna gelap hex Tailwind yang sesuai) ke dalam objek `export const viewport`.