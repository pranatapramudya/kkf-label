# PRD 050: Dinamisasi Payload Berat Pengiriman pada API Biteship

## 1. Konteks & Tujuan
Berdasarkan pengujian pada halaman *checkout*, nilai ongkos kirim (ongkir) yang dikembalikan oleh API Biteship bersifat statis (flat), tidak peduli berapa banyak kuantitas barang di dalam keranjang. Hal ini terjadi karena *payload* berat (*weight*) yang dikirimkan ke *endpoint* Biteship di- *hardcode* menjadi 250 gram untuk keseluruhan pesanan, bukan per *item*.
Tujuan PRD ini adalah memodifikasi logika pembentukan *payload request* ke API Biteship agar total berat pengiriman dihitung secara dinamis berdasarkan total kuantitas barang di keranjang belanja.

## 2. Instruksi Eksekusi (Logika Fetch API Biteship)
AI Agent wajib menelusuri fungsi yang bertanggung jawab melakukan *fetch* / *request* ke API Biteship (kemungkinan berada di file `app/api/ongkir/route.ts` atau fungsi *handler* di halaman *checkout*):

### A. Kalkulasi Total Kuantitas & Total Berat
- Sebelum menyusun objek *payload* (JSON) yang akan dikirim ke Biteship, tangkap data keranjang belanja (*cart items*) dari *request* atau *state*.
- Hitung total kuantitas seluruh barang di keranjang. (Contoh: `const totalKuantitas = cartItems.reduce((acc, item) => acc + item.quantity, 0);`).
- Definisikan asumsi berat statis per barang, yaitu **250 gram**.
- Hitung total berat riil pesanan: `const totalBerat = totalKuantitas * 250;`.

### B. Modifikasi Payload API Biteship
- Temukan bagian kode yang mendeklarasikan struktur objek untuk dikirim ke API Biteship (biasanya berisi asal pengiriman, tujuan, dan item/berat).
- Jika API Biteship mengekspektasikan total berat di level *root* (misalnya parameter `weight`), pastikan nilainya menggunakan variabel `totalBerat`. (Contoh: `weight: totalBerat`).
- Jika API Biteship mengekspektasikan array `items`, pastikan Anda melakukan *mapping* pada array tersebut dan menyertakan properti `weight: 250` dan `quantity: item.quantity` pada masing-masing objek produk, sehingga sistem Biteship dapat mengalkulasi volumetriknya sendiri.
- Sesuaikan dengan dokumentasi skema payload Biteship yang saat ini digunakan di dalam kode.

## 3. Kriteria Selesai (Acceptance Criteria)
- Saat pengguna memasukkan 1 barang, API dikirimkan data berat 250g (ongkir 1kg).
- Saat pengguna memasukkan 5 barang, API dikirimkan data berat 1250g (ongkir otomatis masuk hitungan 2kg dari logistik).
- Nilai *response* ongkir dari API akan otomatis naik saat kuantitas barang melewati batas berat volumetrik logistik (1kg).