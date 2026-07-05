# Product Requirements Document (PRD) - Auto-Extract Dominant Color via Image Upload

## 1. Konteks
Sistem saat ini sudah mendukung input warna visual (Color Picker) di sisi Admin dan merendernya dengan baik di sisi Klien/Resi. Namun, pengguna menginginkan otomatisasi seperti platform e-commerce besar (Shopee/Tokopedia): ketika admin mengunggah foto produk, sistem secara otomatis mendeteksi warna dominan dari foto tersebut dan mengisi input nilai Hex-nya.

## 2. Detail Tugas (Tasks)

**Task A: Buat Utility Fungsi Ekstraksi Warna (Native Canvas)**
- Buat sebuah fungsi *helper* (misal: di `utils/colorExtractor.ts` atau langsung di dalam komponen).
- Fungsi ini menerima objek `File` (gambar yang baru diunggah).
- Gunakan `FileReader` dan elemen `HTMLCanvasElement` (Canvas API) secara *client-side* untuk merender gambar.
- Ambil data pixel menggunakan `canvas.getContext('2d').getImageData()`.
- Hitung nilai rata-rata RGB (atau warna dominan di area tengah gambar) untuk menghindari warna *background*.
- Kembalikan (*return*) nilai tersebut dalam format Hex (contoh: `#FFC0CB`).

**Task B: Injeksi ke Event Upload Gambar (Admin)**
- Buka komponen Admin pada form "Tambah Produk" dan "Edit Produk" (yang mengatur upload foto varian).
- Modifikasi fungsi `onChange` pada input file gambar.
- Saat gambar dipilih, panggil fungsi ekstraksi warna dari Task A.
- Hasil *return* berupa kode Hex otomatis di-set (menggunakan state *setter*, misal `setWarna(hexColor)`) ke dalam input varian warna.

**Task C: Pertahankan Manual Override (UX)**
- Pastikan input Color Picker yang sudah ada tetap berfungsi.
- Jika hasil ekstraksi otomatis dirasa kurang tepat (misal mendeteksi warna *background*), admin tetap bisa mengklik Color Picker untuk mengubah warnanya secara manual.

## 3. Aturan Pengembangan (Strict Rules)
1. **ZERO DEPENDENCIES:** Dilarang meng-install library eksternal (seperti `colorthief`). Gunakan murni HTML5 Canvas API untuk ekstraksi warna.
2. **NO GIT PUSH/COMMIT:** Lakukan perubahan HANYA di localhost. Dilarang menjalankan terminal Git.
3. Gunakan bahasa Indonesia untuk penamaan variabel jika diperlukan dan komentar kode.