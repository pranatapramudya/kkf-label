# PRD 047: Pembersihan Komponen Footer & Pembaruan Logika Kalkulasi Ongkos Kirim

## 1. Konteks & Tujuan
Sistem E-Commerce KKF Label sedang dalam tahap finalisasi sebelum rilis produksi. Terdapat dua penyesuaian yang perlu dilakukan:
1. **Pembaruan UI (Visual):** Menghilangkan elemen teks judul merek dan paragraf deskripsi pada area *footer* agar tampilan lebih minimalis dan bersih.
2. **Pembaruan Logika Bisnis (Checkout):** Menyesuaikan algoritma perhitungan ongkos kirim (ongkir). Sebelumnya ongkir mungkin dihitung flat per transaksi. Sekarang, total ongkir harus merupakan hasil kali antara tarif dasar ongkir dengan total kuantitas (jumlah) seluruh barang yang ada di dalam keranjang belanja.

## 2. Instruksi Eksekusi Frontend (Pembersihan UI Footer)
AI Agent wajib menelusuri dan memodifikasi komponen global *footer*:

### A. Pelacakan Komponen
- Cari file komponen yang merender *footer* aplikasi (kemungkinan bernama `Footer.tsx`, berada di dalam direktori `components/`, atau di dalam `app/layout.tsx` / `app/(main)/layout.tsx`).

### B. Penghapusan Elemen Teks
- Temukan blok kode yang merender teks judul "kkf-label".
- Temukan blok kode yang merender teks paragraf deskripsi: "Fashion wanita minimalis dengan warna lembut, potongan bersih, dan detail yang mudah dipakai setiap hari."
- Hapus kedua elemen teks tersebut (tag `<p>`, `<h1>`/`<h2>`, atau `<span>` yang membungkusnya) dengan rapi tanpa merusak struktur *grid* atau *flexbox* utama dari *footer*.

## 3. Instruksi Eksekusi Logika Bisnis (Kalkulasi Ongkir di Checkout)
AI Agent wajib memperbarui logika matematika pada halaman keranjang/checkout:

### A. Pelacakan State / Logika Kalkulasi
- Telusuri file yang menangani perhitungan total biaya transaksi. (Kemungkinan di `app/(main)/checkout/page.tsx`, `app/(main)/keranjang/page.tsx`, atau di dalam *global state management* yang mengatur struk pembayaran).
- Temukan variabel yang menyimpan nilai tarif ongkos kirim (misalnya `shippingCost`, `ongkir`, atau `biayaPengiriman`).

### B. Implementasi Multiplier Kuantitas
- Buat sebuah variabel penghitung total kuantitas barang. Lakukan iterasi (*reduce*) pada array produk di keranjang belanja untuk mendapatkan total keseluruhan *item* (misalnya: `const totalKuantitas = cartItems.reduce((total, item) => total + item.quantity, 0);`).
- Ubah rumus perhitungan ongkir akhir menjadi: `Total Ongkir = Tarif Dasar Ongkir * totalKuantitas`.
- Pastikan nilai `Total Ongkir` yang baru ini yang dimasukkan ke dalam perhitungan `Grand Total` pembayaran tagihan (*Total Belanja + Total Ongkir*).

## 4. Kriteria Selesai (Acceptance Criteria)
- Teks judul "kkf-label" dan deskripsi filosofi fashion sudah tidak terlihat lagi di bagian bawah (*footer*) situs web.
- Saat pengguna memasukkan 3 buah baju ke dalam keranjang, nilai ongkos kirim yang tertera di rincian pembayaran akan otomatis dikalikan 3 dari tarif dasar aslinya.
- Tidak ada peringatan *Type Error* atau kerusakan kalkulasi nilai (NaN) pada rincian tagihan.