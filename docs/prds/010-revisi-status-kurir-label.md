# Product Requirements Document (PRD) - Revisi Alur Status, Filter Kurir Frontend, & Label Varian

## 1. Konteks
Ditemukan tiga isu (bug/enhancement) pada saat pengujian lokal:
1. **Auto-Save Bug:** Dropdown status pesanan di modal Admin langsung memicu update database saat diklik (onChange), sehingga tombol "Simpan Update" menjadi tidak berguna.
2. **Filter Kurir Frontend:** Halaman Checkout masih menampilkan kurir di luar ketentuan (seperti Ninja, AnterAja, Lion Parcel).
3. **Detail Varian pada Resi:** Label pengiriman dan detail pesanan belum menampilkan informasi varian warna yang dipilih pelanggan, sehingga menyulitkan proses *packing* (Gudang).

## 2. Detail Tugas (Tasks)

**Task A: Fix Bug Auto-Save Status Pesanan (Admin)**
- Buka komponen Modal/Dialog detail pesanan di sisi Admin.
- Cari elemen `<select>` atau Dropdown yang mengatur "Status Pesanan".
- **HAPUS** pemanggilan fungsi mutasi/API update database dari dalam properti `onChange` atau `onValueChange`.
- Pastikan `onChange` HANYA memperbarui *state* lokal (misal: `setSelectedStatus(val)`).
- Eksekusi API update database HANYA boleh dipanggil di dalam fungsi `onSubmit` atau `onClick` milik tombol "Simpan Update".

**Task B: Hard-Filter Kurir di Frontend (Checkout)**
- Buka komponen Frontend yang merender daftar pilihan kurir saat Checkout.
- Lakukan filter ketat (*strict filtering*) pada *array* data yang diterima dari Biteship. Tampilkan HANYA kurir dan layanan berikut:
  - `J&T` (Layanan: EZ)
  - `JNE` (Layanan: REG/Reguler)
  - `Sicepat` (Layanan: REG/Reguler & BEST)
  - `Pos Indonesia` (Layanan: Pos Reguler)
  - `Gojek` (Layanan: Instant & Same Day)
- Sembunyikan opsi kurir/layanan selain dari list di atas.

**Task C: Injeksi Detail Varian (Warna) pada Checkout & Resi**
- **Checkout/Cart:** Pastikan saat data `OrderItem` dikirim ke database, string varian (misal: "Warna: #FFC0CB" atau nilai RGB-nya) tersimpan ke dalam kolom yang tepat (contoh: `variantName` atau digabungkan ke `productName`).
- **Resi Pengiriman (A6):** Buka komponen cetak resi (seperti yang ada di `image_19c348.png`). Pada bagian **ISI PAKET**, modifikasi agar merender nama produk beserta variannya. Contoh output yang diharapkan: `1x Rainy Atasan Cardigan... (Warna: Merah / #FFXXXX)`.

## 3. Aturan Pengembangan (Strict Rules)
1. **NO GIT PUSH/COMMIT:** JANGAN jalankan perintah git apapun. Perubahan HANYA untuk di-test di localhost.
2. Edit secara langsung pada *codebase* dan pastikan tidak merusak UI yang sudah ada.
3. Seluruh komentar kode wajib menggunakan Bahasa Indonesia.