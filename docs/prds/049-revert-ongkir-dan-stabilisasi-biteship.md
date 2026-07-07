# PRD 049: Stabilisasi Logika Kalkulasi Ongkos Kirim (Integrasi Biteship)

## 1. Konteks & Tujuan
Berdasarkan hasil audit sistem pengiriman, diketahui bahwa API Biteship telah secara otomatis menghitung akumulasi berat belanjaan berdasarkan *hardcode* 250 gram per item. Logika perkalian ongkos kirim dengan kuantitas barang yang diinstruksikan pada PRD 047 terbukti redundan dan berisiko menyebabkan *overpricing* ongkos kirim (tagihan berlipat ganda untuk berat yang sama).
Tujuan PRD ini adalah membatalkan (*revert*) logika perkalian kuantitas tersebut dan mengembalikan otoritas kalkulasi harga akhir ongkos kirim sepenuhnya kepada *response* API Biteship.

## 2. Instruksi Eksekusi Frontend / Backend (Logika Checkout)
AI Agent wajib menormalkan kembali kalkulasi pembayaran pada halaman keranjang/checkout:

### A. Revert Logika Multiplier (PRD 047)
- Temukan variabel atau fungsi yang melakukan kalkulasi `Total Ongkir = Tarif Dasar Ongkir * totalKuantitas`.
- Hapus perkalian kuantitas (`* totalKuantitas`) tersebut.
- Kembalikan nilai `Total Ongkir` menjadi murni dari *value* biaya pengiriman yang dikembalikan oleh *response* API Biteship (misalnya: `pilihanOngkir.biaya` atau `shippingCost`).

### B. Validasi Total Tagihan (Grand Total)
- Pastikan kalkulasi `Grand Total` tagihan akhir kembali menggunakan rumus standar: `(Total Harga Semua Barang) + (Ongkir Murni dari Biteship)`.

## 3. Kriteria Selesai (Acceptance Criteria)
- Sistem tidak lagi mengalikan biaya ongkir secara manual dengan jumlah barang.
- Saat pengguna memasukkan 4 buah barang (asumsi total berat 4 x 250g = 1.000g / 1kg), nilai ongkos kirim yang tertagih tetap masuk akal dan sesuai dengan tarif riil 1kg dari pihak logistik (Biteship).
- Tidak ada lonjakan biaya ongkos kirim yang tidak wajar akibat duplikasi kalkulasi.