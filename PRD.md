# PRD: Final Scroll & Layout Unlocking (v20.0)

## 1. Objective
Membuka kunci *vertical scrolling* pada halaman admin dan memperbaiki *layout breaking* (melebar ke kanan) pada bagian filter "Hari Ini - Minggu Ini - Bulanan - Juni".

## 2. Scope of Work
- **Unlocking Scroll:** Menghapus properti `h-screen` dan `overflow-hidden` pada container utama yang mencegah halaman di-scroll ke bawah.
- **Filter Row Wrapping:** Memperbaiki layout filter agar bisa turun ke baris berikutnya (wrap) jika layar tidak cukup, mencegah *layout* melebar ke kanan.
- **Main Container Reset:** Memastikan semua *root wrapper* memiliki `min-h-screen` (bukan `h-screen`) dan `overflow-y-auto`.

## 3. Strict Guidelines
- **Vertical Freedom:** Halaman admin wajib bisa di-scroll ke bawah jika konten melebihi tinggi layar.
- **Horizontal Stability:** Tidak boleh ada *horizontal scroll* yang disebabkan oleh elemen yang "maksa" melebar (seperti area filter/tanggal).
- **Layout Integrity:** Tidak merusak *fluidity* yang sudah dibangun di tahap sebelumnya.