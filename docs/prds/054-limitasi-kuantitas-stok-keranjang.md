# PRD 054: Limitasi Kuantitas Keranjang Berdasarkan Stok Aktual (Overselling Prevention)

## 1. Konteks & Tujuan
Ditemukan *bug* kritikal pada antarmuka keranjang belanja dan *checkout*. Pengguna saat ini dapat terus menekan tombol tambah (`+`) kuantitas tanpa ada batasan maksimum (melebihi kapasitas stok aktual di *database*). Hal ini berisiko menyebabkan *overselling* dan kegagalan pemenuhan pesanan (*fulfillment*). 
Tujuan PRD ini adalah mengintegrasikan data stok produk dari *backend* ke dalam *state* keranjang belanja *frontend*, serta memodifikasi logika fungsi inkremen (penambahan) agar terkunci ketika mencapai batas maksimal stok.

## 2. Instruksi Eksekusi Backend (Prisma Payload)
AI Agent wajib memastikan data stok ikut terbawa saat produk ditambahkan ke keranjang:

### A. Validasi Payload Produk
- Telusuri alur fungsi yang memasukkan produk ke keranjang (*Add to Cart* API atau fungsi *fetch* katalog produk).
- Pastikan bahwa kueri `prisma.product.findMany` atau `prisma.product.findUnique` juga melakukan *select* terhadap kolom stok (misalnya `stok` atau `stock`).
- Pastikan tipe data (TypeScript Interface/Type) dari objek `CartItem` di *frontend* telah diperbarui untuk menerima properti `stock: number`.

## 3. Instruksi Eksekusi Frontend (`app/(main)/checkout/page.tsx` atau Komponen Keranjang)
AI Agent wajib memodifikasi UI dan fungsi manipulasi kuantitas:

### A. Modifikasi Logika Inkremen (Tombol `+`)
- Temukan fungsi yang menangani penambahan kuantitas (misalnya `handleIncrement(productId)` atau `updateQuantity()`).
- Tambahkan validasi kondisional (`if`) di dalam fungsi tersebut.
- **Logika Wajib:** `if (item.quantity < item.stock) { ...tambah kuantitas } else { ...jangan lakukan apa-apa / return }`.

### B. Umpan Balik Visual UI (Disabled State)
- Temukan elemen HTML/React (tag `<button>`) yang merender tombol `+`.
- Ikat atribut `disabled` dengan kondisi batas stok: `disabled={item.quantity >= item.stock}`.
- Tambahkan penyesuaian kelas CSS/Tailwind (misalnya `disabled:opacity-50 disabled:cursor-not-allowed`) agar tombol secara visual terlihat tidak aktif/berwarna pudar saat kuantitas sudah mencapai batas maksimum.
- *(Opsional)* Jika pengguna mencoba mengetik manual angka 60 di dalam *input box*, berikan validasi `onChange` atau `onBlur` yang memaksa angka tersebut kembali ke nilai maksimal stok secara otomatis.

## 4. Kriteria Selesai (Acceptance Criteria)
- Jika stok produk X di *database* adalah 5, pengguna tidak akan bisa mengubah angka di keranjang menjadi 6.
- Tombol `+` akan mati secara visual dan fungsional saat angka mencapai 5.
- Jika pengguna mengetik manual angka melebihi batas, nilai akan dikoreksi otomatis kembali ke batas stok.
- Risiko *overselling* berhasil dieliminasi sepenuhnya.