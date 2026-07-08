# PRD 059: Perbaikan Footer iOS & Penambahan Label Lokasi Produk

## 1. Meta Data
* **Dokumen:** PRD-059
* **Judul:** Fix Safe-Area Footer Mobile & UI Lokasi Produk ala Marketplace
* **Target:** Komponen Frontend (Footer & Product Card)
* **PIC:** System Architect / Full-Stack Engineer

## 2. Tujuan (Objective)
1. **Fix Aksesibilitas Pintu Rahasia:** Memperbaiki komponen `Footer` yang terpotong/hilang di perangkat *mobile* (terutama iOS Safari/PWA) agar tautan rahasia Admin tetap bisa diakses.
2. **Peningkatan UI/UX Produk:** Menambahkan label lokasi statis ("Sumedang, Jawa Barat") di setiap kartu produk untuk meningkatkan kepercayaan pelanggan, dengan tata letak mirip *marketplace* (Shopee/Tokopedia).

## 3. Spesifikasi Teknis (Langkah Eksekusi)

### Task 1: Perbaikan Komponen Footer (Safe-Area iOS)
Buka komponen *Footer* utama yang berisi teks *copyright* rahasia.
* **Masalah:** Komponen tenggelam di bawah *Home Indicator* iOS.
* **Solusi:** Tambahkan utilitas Tailwind untuk *padding bottom* berbasis *safe-area*.
* **Implementasi:** Tambahkan *class* `pb-[env(safe-area-inset-bottom)]` pada *wrapper/container* paling luar dari komponen *Footer*. Jika dirasa kurang naik, tambahkan ekstra *padding* standar seperti `pb-4 md:pb-0` agar nyaman di-klik pakai jempol.

### Task 2: Penambahan Label Lokasi di Komponen Kartu Produk
Buka komponen yang me-render daftar produk (misalnya `ProductCard.tsx` atau komponen serupa yang digunakan di halaman "Semua Produk").
* **Target Posisi:** Di bagian paling bawah informasi produk, tepat di sebelah kanan/sejajar dengan Harga.
* **Struktur Layout:**
  * Ubah kontainer (div) yang membungkus elemen Harga menjadi *flexbox* dengan *class* `flex justify-between items-center` atau `items-end`.
  * Di sisi kiri, biarkan elemen Harga (`Rp xxx.xxx`) seperti aslinya.
  * Di sisi kanan, tambahkan elemen label lokasi.
* **Desain Label Lokasi:**
  * Teks wajib statis: **"Sumedang, Jawa Barat"** (karena toko berpusat di Sumedang dan berlaku untuk semua produk tanpa membebani *database*).
  * Gunakan ikon kecil (misalnya `MapPin` dari Lucide React).
  * *Styling* teks: Ukuran sangat kecil (`text-[10px]` atau `text-xs`), warna abu-abu redup (`text-zinc-500` atau `text-gray-500`) agar rapi, tidak mencolok, namun tetap terbaca ala UI *marketplace*.

## 4. Kriteria Penerimaan (Acceptance Criteria)
1. *Footer* (dan tautan rahasia tahun 2026) dapat dilihat dan diklik dengan mudah pada perangkat iPhone/PWA iOS tanpa terhalang bingkai bawah layar.
2. Seluruh produk di halaman "Katalog/Semua Produk" kini menampilkan teks "Sumedang, Jawa Barat" beserta ikon lokasi di sudut kanan bawah setiap kartu.
3. Penambahan produk baru dari Admin akan secara otomatis memiliki label lokasi ini tanpa perlu *input* data lokasi tambahan di panel admin.