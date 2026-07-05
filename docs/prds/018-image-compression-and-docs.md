# Product Requirements Document (PRD) - Client-Side Image Compression & Final Docs

## 1. Konteks
Untuk menghemat ruang penyimpanan cloud (storage) dan mempercepat waktu pemuatan halaman, gambar produk yang diunggah oleh Admin perlu dikompresi secara otomatis di sisi klien (browser) sebelum dikirim ke server. Selain itu, pembaruan hari ini perlu didokumentasikan secara menyeluruh sebelum di-deploy.

## 2. Detail Tugas (Tasks)

**Task A: Fungsi Kompresi Gambar (Client-Side)**
- Buat sebuah utility function `compressImage(file: File)` di dalam folder `utils` atau langsung di komponen Admin.
- Gunakan `HTMLCanvasElement` untuk merender gambar, lalu gunakan `canvas.toBlob()` atau `canvas.toDataURL()` dengan format `image/jpeg` atau `image/webp` dan kualitas kompresi sekitar `0.7` (70%).
- Jika dimensi gambar terlalu besar (misal lebih dari 1200px), perkecil proporsinya.
- Terapkan fungsi ini pada `onChange` di input file unggah gambar utama dan unggah gambar varian di halaman Tambah/Edit Produk.
- (Catatan: Video tidak perlu dikompresi, tetap gunakan validasi max size 15MB).

**Task B: Update README.md**
- Tambahkan fitur "Auto-Compress Upload" di bagian Fitur Admin.
- Pastikan semua pembaruan hari ini (Infinite Scroll Beranda, Cross-Selling, Auto-Extract Warna) sudah tercatat rapi.

**Task C: Update SYSTEM_ARCHITECTURE.md**
- Tambahkan penjelasan teknis di bagian Optimasi & Performa bahwa sistem menggunakan "Client-Side Image Compression via Canvas API" untuk menghemat bandwidth server dan storage cloud.

## 3. Aturan Pengembangan (Strict Rules)
1. **NO EXTERNAL HEAVY LIBRARIES:** Gunakan murni HTML5 Canvas API untuk kompresi agar bundle size tetap ringan.
2. Lakukan semua pembaruan secara lokal, periksa apakah gambar berhasil diunggah dengan ukuran file yang lebih kecil di storage.