# Update PRD: Logika Pencarian & Pelacakan Halaman "Lacak Pesanan"

## 1. Latar Belakang Masalah
- UI Halaman "Lacak Pesanan" sudah tersedia. Pengguna dapat melacak paket dengan memasukkan **Nomor Invoice** (bukan Nomor Resi).
- Sistem Admin memiliki 2 jalur input resi (Hybrid: Manual dan Otomatis via Biteship). Keduanya harus bermuara pada satu fungsi pelacakan yang sama di sisi klien.

## 2. Kebutuhan Solusi Logika (Requirement)
- **Logika Halaman Lacak Pesanan (`/lacak` atau sejenisnya):**
  - Form pencarian menerima input `Nomor Invoice`.
  - Lakukan *fetch* ke database untuk mengambil detail pesanan berdasarkan `Nomor Invoice` tersebut.
  - Jika `noResi` belum ada (null/kosong), tampilkan status: "Pesanan sedang diproses oleh admin KKF. Resi pengiriman belum tersedia."
  - Jika `noResi` sudah ada (berisi string), jalankan *fetch* kedua secara otomatis ke *endpoint* internal `/api/tracking` dengan membawa *payload* `noResi` dan `kode_kurir`.
  - Tampilkan hasil dari `/api/tracking` ke dalam bentuk *Timeline* visual Status Pengiriman di bawah detail pesanan.
- **Optimasi UX Tombol "Lacak" di Halaman Pesanan Saya:**
  - Pastikan tombol "Lacak" (warna pink) pada kartu pesanan yang berstatus "DIKIRIM" berfungsi sebagai *shortcut*.
  - Saat ditekan, arahkan pengguna ke halaman Lacak Pesanan dengan Nomor Invoice yang sudah terisi otomatis (misal menggunakan URL parameter `?invoice=KKF-XXXXX`), sehingga pengguna tidak perlu melakukan *copy-paste* secara manual.