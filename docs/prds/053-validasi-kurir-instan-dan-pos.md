# PRD 053: Validasi Courier-Specific Logic (Gojek Instant & Pos Indonesia)

## 1. Konteks & Tujuan
Integrasi Biteship untuk JNE, J&T, dan SiCepat telah berjalan sempurna dengan kalkulasi volumetrik (*Weight-Based*). Namun, *developer* mendeteksi bahwa ongkos kirim untuk **Gojek (Instant)** dan **Pos Indonesia** bersifat *flat* meski kuantitas barang ditambah. 
Secara arsitektur bisnis, Gojek menggunakan *Distance-Based Pricing* (harga berdasarkan kilometer, bukan gram) selama masih di bawah batas maksimal muatan motor (20 kg). Sementara itu, Pos Indonesia memiliki toleransi tiering berat awal yang lebih lebar untuk rute tertentu. 
Tujuan PRD ini adalah mengaudit dan mengoptimalkan *payload* khusus untuk mendukung akurasi perhitungan jarak Gojek (Instant) dan memvalidasi *courier code* untuk Pos Indonesia.

## 2. Instruksi Eksekusi Backend (`app/api/ongkir/route.ts`)
AI Agent wajib memvalidasi dan memodifikasi *payload request* Biteship dengan instruksi berikut:

### A. Validasi Kode Kurir (Courier Routing)
- Temukan bagian payload yang mengatur kurir apa saja yang di- *request* ke Biteship (misalnya properti `couriers: string[]`).
- Pastikan kode untuk Gojek tertulis dengan benar sesuai dokumentasi Biteship (umumnya `'gojek'` atau `'gosend'`).
- Pastikan kode untuk Pos Indonesia tertulis dengan benar (umumnya `'pos'`).

### B. Optimasi Payload Jarak untuk Kurir Instan (Gojek)
- Kurir instan seperti Gojek sangat bergantung pada presisi alamat (*Distance-Based*). Jika *payload* asal (`origin`) dan tujuan (`destination`) hanya menggunakan teks alamat mentah, perhitungan jarak bisa tidak akurat atau gagal.
- Pastikan objek `origin` (Gudang KKF Label) dan `destination` (Pembeli) menyertakan setidaknya **kodepos** (`postal_code`) yang valid.
- *(Opsional namun sangat disarankan)*: Jika Biteship mendukung input koordinat (`latitude` & `longitude`), pastikan struktur data mendukungnya, karena ini akan menentukan akurasi tarif Gojek dalam radius 40km.

### C. Proteksi Limit Muatan (Max Weight Gateway)
- Tambahkan logika *guardrail* (pelindung) sebelum memanggil API Biteship.
- Jika pengguna memilih ekspedisi "Gojek", periksa variabel `totalBerat`.
- Jika `totalBerat` melebihi 20.000 gram (20 kg, standar maksimal muatan motor GoSend), kembalikan *error message* yang ramah: *"Pesanan terlalu berat untuk pengiriman Instan/Motor. Silakan gunakan ekspedisi reguler."* 

## 3. Kriteria Selesai (Acceptance Criteria)
- AI Agent melaporkan konfirmasi bahwa kode kurir `'pos'` dan `'gojek'` sudah terpetakan dengan benar ke API Biteship.
- Sistem tidak memaksakan kalkulasi berbasis berat untuk Gojek, membiarkan API Biteship menghitung tarif murni berdasarkan jarak asal-tujuan.
- Terdapat limitasi maksimal 20kg jika pengguna mencoba mengeksploitasi pengiriman Instan dengan kuantitas barang yang tidak wajar.