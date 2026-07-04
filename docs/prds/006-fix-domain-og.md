# Product Requirements Document (PRD) - Sinkronisasi Canonical Domain & Open Graph (SEO Social Media)

## 1. Konteks
Terdapat tiga isu terkait *sharing* dan SEO setelah deployment ke Vercel:
1. `sitemap.xml` dan `robots.txt` menggunakan domain bawaan Vercel (`.vercel.app`) alih-alih domain utama (`.com`).
2. *Link preview* saat dibagikan ke WhatsApp tidak memunculkan judul, deskripsi, dan gambar produk karena kurangnya Open Graph (OG) tags.
3. Tombol "Bagikan" di halaman produk menyalin URL kotor (termasuk *query parameters* tidak penting) atau URL Vercel.

## 2. Detail Tugas (Tasks)

**Task A: Tetapkan Base URL secara Global**
- Buka file `app/layout.tsx` (Root Layout).
- Tambahkan properti `metadataBase` pada *object* `metadata`.
- Set nilainya menjadi `new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000')`. (Catatan: Kita akan menggunakan URL `.com` untuk variabel ini nantinya).

**Task B: Perbaikan Sitemap & Robots.txt**
- Buka `app/sitemap.ts` dan `app/robots.ts`.
- Ganti semua *hardcoded* URL atau pemanggilan domain otomatis dengan mengambil dari `process.env.NEXT_PUBLIC_BASE_URL`. Pastikan hasil akhirnya menggunakan domain utama.

**Task C: Penambahan Open Graph (OG) Meta Tags**
- Buka halaman dinamis detail produk (kemungkinan `app/(main)/produk/[slug]/page.tsx` atau sejenisnya).
- Pada fungsi `generateMetadata`, tambahkan *object* `openGraph`.
- Isi `openGraph` dengan:
  - `title`: Nama Produk
  - `description`: Deskripsi Produk
  - `url`: Endpoint lengkap produk tersebut (menggunakan base URL).
  - `siteName`: 'KKF Label'
  - `images`: Array berisi URL gambar utama produk (`fotoUtama`) dari database.
  - `type`: 'website'

**Task D: Refactor Tombol "Bagikan"**
- Buka komponen yang merender tombol "Bagikan" (contoh: `ClientProdukDetail.tsx`).
- Ubah fungsi *copy* ke *clipboard* / *Web Share API*.
- Jangan gunakan `window.location.href` mentah. Konstruksi URL bersih: gabungkan `process.env.NEXT_PUBLIC_BASE_URL` (atau baca dari origin window jika env tidak tersedia) dengan `pathname` produk saja, tanpa menyertakan `searchParams` (seperti `?ref=...`).

## 3. Aturan Pengembangan
1. Dilarang menjalankan perintah terminal/git.
2. Edit secara langsung pada *codebase*.
3. Tulis komentar kode dalam Bahasa Indonesia.