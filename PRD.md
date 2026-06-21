# PRD: Checkout Item Price Integrity Fix (v51.0)

## 1. Objective
Memperbaiki *bug* pada API *Checkout* di mana sistem menyimpan harga normal produk ke dalam tabel `OrderItem`, alih-alih menyimpan harga aktual setelah dipotong `diskonPersen`.

## 2. Scope of Work
- **Checkout API Logic:** Mengubah fungsi POST saat *checkout* (atau *server action* yang menyimpan pesanan ke Prisma).
- **Price Calculation Map:** Saat melakukan *mapping* keranjang belanja ke objek `orderItems`, pastikan variabel `harga` yang disimpan adalah harga setelah diskon.
  - Rumus: `hargaBeli = produk.harga - (produk.harga * (produk.diskonPersen / 100))`
- **Database Insertion:** Memastikan payload `prisma.pesanan.create` menyimpan `hargaBeli` tersebut ke *field* `harga` di tabel *Order Item*.

## 3. Strict Guidelines
- **Data Consistency:** Kalkulasi harga satuan di `OrderItem` HARUS presisi dan sinkron dengan kalkulasi `Total Belanja` pesanan.