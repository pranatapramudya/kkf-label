# Update PRD: UI Enhancement - Copy Order ID Button

## 1. Latar Belakang Masalah
- Pada halaman "Checkout Success" (Pembayaran Diproses) dan halaman "Saya" (Riwayat Pesanan), pengguna kesulitan menyalin Order ID/Nomor Pesanan untuk keperluan pelacakan.
- Dibutuhkan tombol *copy* (*clipboard*) berukuran kecil di sebelah teks Order ID untuk meningkatkan UX pelacakan pesanan.

## 2. Kebutuhan Solusi Logika (Requirement)
- **Komponen Fungsional:**
  - Buat utilitas fungsi penyalinan menggunakan `navigator.clipboard.writeText(orderId)`.
  - Berikan *feedback* visual sementara kepada pengguna setelah tombol ditekan (misal: ikon berubah menjadi tanda centang atau muncul *toast* "Disalin!").
- **Implementasi UI:**
  - **Halaman Checkout Success:** Letakkan ikon copy kecil persis di sebelah teks Order ID (misal: KKF-178...).
  - **Halaman Profile/Pesanan Saya:** Letakkan ikon copy kecil di sebelah Order ID pada daftar kartu riwayat pesanan (seperti yang terlihat pada status "MENUNGGU VERIFIKASI").
  - Gunakan ikon standar (seperti `Copy` dari `lucide-react` atau library ikon yang digunakan di proyek ini).