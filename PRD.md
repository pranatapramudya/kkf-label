# Product Requirements Document (PRD) - Penonaktifan Sementara Metode Pembayaran Midtrans

## 1. Konteks
Saat ini, fitur pembayaran otomatis menggunakan Midtrans sudah selesai dikembangkan, namun masih menunggu persetujuan (approval) metode pembayaran dari pihak Midtrans. Untuk mencegah pelanggan menggunakan fitur yang belum aktif ini, opsi pembayaran Midtrans di halaman Checkout harus dinonaktifkan sementara (disabled) tanpa menghapus kode integrasi yang sudah ada.

## 2. Detail Tugas (Tasks)

**Task A: Modifikasi UI Pembayaran (Frontend/Checkout)**
- Buka file komponen yang menampilkan daftar metode pembayaran di halaman Checkout (kemungkinan di `app/(main)/checkout/page.tsx` atau komponen terkait).
- Cari opsi/tombol yang mewakili pembayaran otomatis (Midtrans).
- Terapkan gaya visual non-aktif (disabled state):
  - Buat elemen tersebut menjadi abu-abu (grayscale/opacity diturunkan).
  - Ubah kursor menjadi `cursor-not-allowed`.
  - Nonaktifkan fungsi klik (`pointer-events-none` atau cegah perubahan *state* `onClick`).
- **Tambahkan teks/badge peringatan:** Sisipkan teks kecil berwarna merah atau abu-abu bertuliskan *"Fitur ini sedang dalam tahap pengembangan"* tepat di bawah atau di dalam opsi Midtrans tersebut.

**Task B: Pertahankan Kode Eksisting**
- DILARANG menghapus fungsi, *state*, atau integrasi API Midtrans yang sudah ada di dalam file tersebut. Cukup modifikasi pada level antarmuka (UI) saja.

## 3. Aturan Pengembangan (Strict Rules)
1. Dilarang melakukan eksekusi perintah terminal seperti `git push`.
2. Semua *copywriting* dan *comment* kode harus menggunakan bahasa Indonesia.
3. Modifikasi kode langsung pada file yang bersangkutan di environment lokal.