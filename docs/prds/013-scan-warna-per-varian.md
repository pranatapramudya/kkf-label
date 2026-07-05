# Product Requirements Document (PRD) - Temporary Color Scanner per Variant

## 1. Konteks
Fitur auto-extract warna saat ini hanya berjalan pada foto utama produk. Karena satu produk bisa memiliki banyak varian warna (yang tidak ada di foto utama), admin kesulitan jika harus menebak Hex warna varian lainnya. Solusi UX yang dibutuhkan adalah fitur "Scan Foto" mandiri pada setiap baris varian yang berfungsi murni sebagai pembaca warna sementara di sisi klien, tanpa mengunggah gambar tersebut ke server.

## 2. Detail Tugas (Tasks)

**Task A: Modifikasi Baris Varian (UI)**
- Buka komponen yang merender *Dynamic Form* untuk Varian Produk di halaman Tambah/Edit Produk Admin.
- Pada setiap baris varian, di sebelah input "Warna (RGB/Hex)", tambahkan sebuah elemen input file tersembunyi (`<input type="file" hidden>`) dan sebuah tombol/icon (misal: "📷 Scan Warna").
- Saat tombol "Scan Warna" diklik, picu (trigger) klik pada input file tersembunyi tersebut.

**Task B: Implementasi Client-Side Color Scanner**
- Gunakan fungsi `colorExtractor` (Canvas API) yang sudah dibuat pada tugas sebelumnya.
- Buat fungsi `handleScanColor(index, file)` yang berjalan saat input file di baris varian tersebut berubah (`onChange`).
- Fungsi ini akan membaca *file* gambar yang dipilih, mengekstrak warna dominannya menggunakan Canvas, dan langsung men-set hasil Hex-nya ke dalam *state* warna varian pada `index` yang bersangkutan.
- **SANGAT PENTING:** Pastikan *file* yang dipilih dari tombol "Scan Warna" ini TIDAK dimasukkan ke dalam *payload submit* form. File ini murni hanya dibaca sesaat oleh browser (Client-side) dan dibuang setelah warnanya didapatkan.

## 3. Aturan Pengembangan (Strict Rules)
1. **NO DATABASE/SCHEMA CHANGES:** Dilarang mengubah skema Prisma atau menambah kolom gambar pada tabel Varian.
2. **NO UPLOAD TO STORAGE:** Gambar yang discan per varian tidak boleh diunggah ke Supabase/Server.
3. **NO GIT PUSH/COMMIT:** Lakukan perubahan HANYA di localhost.