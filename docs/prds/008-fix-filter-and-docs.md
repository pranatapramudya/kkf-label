# Product Requirements Document (PRD) - Perbaikan Filter Transaksi & Pembaruan Dokumentasi

## 1. Konteks
Terdapat *bug* pada halaman Dasbor Admin (Rekapan Transaksi) di mana filter "Bulan" dan "Tahun" tidak merespons atau menyinkronkan data saat diklik. Selain itu, dokumentasi proyek perlu diperbarui untuk mencatat fitur Vercel Speed Insights dan logika pengembalian stok otomatis yang baru saja dibuat.

## 2. Detail Tugas (Tasks)

**Task A: Perbaiki Bug Filter Bulan & Tahun (Admin Dashboard)**
- Buka komponen yang merender analitik/rekapan transaksi admin.
- Cek logika pada *dropdown* atau tombol filter Bulan dan Tahun.
- Pastikan perubahan pada filter tersebut memicu pengambilan ulang data (data re-fetch). 
- **Solusi:** Gunakan `useEffect` yang memiliki *dependency* pada *state* bulan/tahun untuk memanggil fungsi *fetch* data, ATAU gunakan `useRouter` dari `next/navigation` untuk melakukan `router.push` dengan mengubah *query params* (contoh: `?month=X&year=Y`), lalu tangkap *params* tersebut untuk memfilter data.

**Task B: Pembaruan README.md**
- Tambahkan `@vercel/speed-insights` pada bagian Tech Stack / Analitik di file `README.md`.

**Task C: Pembaruan SYSTEM_ARCHITECTURE.md**
- Buka file `SYSTEM_ARCHITECTURE.md`.
- Tambahkan penjelasan di bagian "Alur Transaksi & Validasi Stok" mengenai **Atomic Stock Return**: Jelaskan bahwa sistem secara otomatis mengembalikan stok (increment) ke database menggunakan `prisma.$transaction` apabila admin membatalkan pesanan.
- Tambahkan penyebutan pemantauan performa menggunakan Vercel Speed Insights di bab Web Vitals.

## 3. Aturan Pengembangan
1. Dilarang menjalankan perintah terminal/git apapun.
2. Edit kode secara langsung pada komponen terkait dan timpa (*overwrite*) file dokumentasinya.
3. Gunakan bahasa Indonesia untuk seluruh dokumentasi.