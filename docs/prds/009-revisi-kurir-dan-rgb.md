# Product Requirements Document (PRD) - Revisi Filter Biteship & RGB Color Picker

## 1. Konteks
Berdasarkan evaluasi sistem *e-commerce*, terdapat kebutuhan untuk menyederhanakan opsi pengiriman bagi pelanggan dan meningkatkan UX admin. Opsi kurir dari API Biteship perlu difilter hanya untuk layanan tertentu. Selain itu, input varian warna produk harus menggunakan *Color Picker* (nilai RGB/Hex) di sisi Admin, dan dirender secara visual di Frontend.

## 2. Detail Tugas (Tasks)

**Task A: Kurasi Layanan Ekspedisi (Biteship API)**
- Buka file yang menangani *fetch* atau filter data kurir/ongkir dari Biteship (Frontend/Backend).
- Modifikasi hasil respon dari API Biteship agar HANYA menampilkan kurir dan layanan berikut:
  1. **J&T:** EZ
  2. **JNE:** Reguler
  3. **Sicepat:** Reguler (2-3 hari) & Best (1 hari)
  4. **Pos Indonesia:** Pos Reguler
  5. **Gojek:** Instant (1-3 jam) & Same Day (6-8 jam)
- Sembunyikan atau abaikan layanan ekspedisi lain yang dikembalikan oleh API.

**Task B: Implementasi RGB Color Picker (Admin Dashboard)**
- Buka komponen Admin untuk "Tambah Produk" dan "Edit Produk" (terutama pada bagian input Varian Warna).
- Ganti input teks warna manual menjadi input visual (*Color Picker*). Bisa menggunakan `<input type="color">` bawaan HTML5 atau *library color picker* ringan.
- Pastikan nilai yang disimpan ke *database* (Prisma) adalah kode Hex/RGB (contoh: `#FF5733`).

**Task C: Render Visual Warna di Frontend**
- Buka halaman Klien (Detail Produk).
- Pada bagian pemilihan varian warna, ganti/tambahkan visualisasi warna. Alih-alih hanya teks, tampilkan lingkaran warna (bentuk UI *swatch*) yang me-render *background-color* sesuai kode Hex/RGB dari *database*.

**Task D: Housekeeping (Arsip PRD Lama)**
- Buat direktori baru: `docs/prds/archive/`.
- Pindahkan file `PRD-security-env.md` dan `PRD-validasi-stok.md` ke dalam folder `archive` tersebut agar *root* folder `prds/` tetap rapi.

**Task E: Pembaruan Dokumentasi Utama**
- **README.md:** Tambahkan di bagian fitur bahwa sistem mendukung "Visual RGB Color Variants" dan "Curated Shipping Options via Biteship".
- **SYSTEM_ARCHITECTURE.md:** Tambahkan catatan teknis tentang bagaimana filter respon API Biteship dilakukan di level kode agar tidak membengkak di sisi *client*.

## 3. Aturan Pengembangan (Strict Rules)
1. **NO GIT PUSH/COMMIT:** JANGAN jalankan perintah git apapun (add, commit, push, dll). Perubahan HANYA untuk di-test di localhost.
2. Edit secara langsung pada *codebase* dan timpa file dokumentasi yang ada.
3. Seluruh komentar kode dan dokumentasi wajib menggunakan Bahasa Indonesia.