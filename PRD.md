# PRD: KKF Label Phase 2.20 - Hardcoded Mobile Layout Spacer untuk Custom ROM

## 1. Objective (Tujuan)
Menyediakan ruang aman (*safe area*) buatan pada perangkat seluler secara universal tanpa bergantung pada deteksi sensor sistem operasi bawaan perangkat keras yang sering kali tidak akurat pada *Custom ROM* tertentu.

## 2. Analisis Masalah & Solusi
- **Masalah:** Sistem operasi seperti itelOS secara paksa menyembunyikan atau memanipulasi nilai *safe area* menjadi 0 piksel pada komponen *WebView*, sehingga teks *header* tertutup oleh informasi sistem (jam, baterai, sinyal).
- **Solusi:** Menerapkan padding atas statis (*hardcoded padding-top*) khusus untuk tampilan layar seluler (*mobile viewport*) pada pembungkus komponen utama dasbor admin, dan menonaktifkannya kembali pada tampilan desktop.

## 3. Spesifikasi Implementasi
1. Buka berkas layout pembungkus utama di area admin.
2. Tambahkan kelas utilitas Tailwind `pt-10` (setara 40px) khusus untuk layar kecil, dan kembalikan ke ukuran normal di layar besar menggunakan `md:pt-0` (atau disesuaikan dengan layout desktop yang sudah ada).