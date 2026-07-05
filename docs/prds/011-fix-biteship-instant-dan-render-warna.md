# Product Requirements Document (PRD) - Perbaikan Instant Courier & Visualisasi Hex Color

## 1. Konteks
Terdapat dua isu pada antarmuka pelanggan dan admin:
1. Kurir Instant (Gojek) dari Biteship mengembalikan error karena kurangnya parameter koordinat pemetaan (Latitude/Longitude).
2. Varian warna RGB/Hex pada halaman detail pesanan, *checkout*, dan cetak resi (A6) masih berupa teks mentah (contoh: `#000000`). Teks ini perlu diubah atau disandingkan dengan elemen visual (lingkaran/kotak warna) agar admin gudang dan pelanggan mudah mengenalinya.

## 2. Detail Tugas (Tasks)

**Task A: Penanganan Parameter Koordinat untuk Kurir Instant**
- Buka file API/Server Action yang mengirim *payload* ke Biteship (`/v1/rates/couriers` atau sejenisnya).
- Pastikan logika pengecekan kurir memvalidasi: Jika layanan yang dipilih adalah Gojek (Instant/Same Day), periksa apakah titik koordinat origin dan destinasi tersedia.
- Jika API Biteship membutuhkan `origin_coordinate` dan `destination_coordinate`, tambahkan parameter tersebut ke dalam *payload* *request* (bisa di-*hardcode* sementara dengan titik koordinat *default* toko jika origin belum dinamis).

**Task B: Visualisasi Hex Color di Frontend & Resi**
- Buat sebuah komponen utilitas kecil (misal: `ColorBadge`) atau fungsi helper di level UI yang bertugas menerima *string* teks varian.
- Fungsi ini harus mendeteksi apakah di dalam teks terdapat kode warna hex (Regex: `/#([0-9A-F]{3}){1,2}/i`).
- Jika terdeteksi:
  - **Di Halaman Riwayat Pesanan & Checkout:** Render teks varian tersebut dan tambahkan elemen `<span>` atau `<div>` kecil berbentuk lingkaran/kotak dengan properti CSS `backgroundColor` sesuai kode hex yang ditemukan.
  - **Di Komponen Cetak Resi (A6):** Tambahkan sebuah kotak kecil berwarna (menggunakan inline CSS background-color dan `-webkit-print-color-adjust: exact;` agar warnanya tercetak di printer biasa) tepat di sebelah teks hex.

## 3. Aturan Pengembangan (Strict Rules)
1. **NO GIT PUSH/COMMIT:** Lakukan perubahan HANYA di lingkungan localhost.
2. Edit kode secara langsung. Pastikan layout cetak resi tidak berantakan setelah ditambahkan kotak warna.
3. Gunakan bahasa Indonesia untuk semua komentar kode dan penamaan komponen baru jika ada.