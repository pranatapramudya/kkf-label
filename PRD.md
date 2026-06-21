# PRD: Hero Section "New Arrival" Limiter (v43.0)

## 1. Objective
Membatasi *rendering* produk pada *Hero Section* halaman utama agar berfungsi sebagai etalase "Koleksi Terbaru" (Teaser) tanpa merusak *layout* utama saat jumlah produk bertambah.

## 2. Scope of Work
- **Data Fetching Limit:** Memodifikasi *query* Prisma atau fungsi *fetch* yang menyuplai data ke komponen Hero.
- **Sorting Logic:** Memastikan data yang ditarik adalah produk terbaru (diurutkan berdasarkan `createdAt` descending).
- **Strict Hard Limit:** Membatasi pengambilan data maksimal hanya 2 produk (`take: 2` pada Prisma, atau `.slice(0, 2)` di sisi komponen/API jika *endpoint* di-*share* dengan komponen lain).

## 3. Strict Guidelines
- **Layout Integrity:** Memastikan *grid* atau *flex container* di Hero Section tidak memiliki *overflow* jika data dibatasi 2 produk.
- **No Dummy Data:** Tetap menggunakan data dari *database*, hanya dibatasi jumlah yang tampil.