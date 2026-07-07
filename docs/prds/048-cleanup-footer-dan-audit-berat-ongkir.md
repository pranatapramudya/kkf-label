# PRD 048: Finalisasi UI Footer & Audit Logika Berat Pengiriman (Shipping Weight)

## 1. Konteks & Tujuan
Setelah teks deskripsi dan judul berhasil dihapus dari area *footer*, tertinggal sebuah ikon logo (Sparkles/Bintang) yang kini berdiri sendiri tanpa konteks visual yang pas. Selain itu, terdapat kebutuhan untuk mengaudit algoritma perhitungan berat barang dalam sistem kalkulasi ongkos kirim agar ongkir yang dibebankan kepada pelanggan akurat dan tidak *overpriced*.
Tujuan PRD ini adalah menghapus sisa ikon pada *footer* dan melakukan inspeksi (serta pelaporan) terhadap variabel berat barang pada sistem *checkout*.

## 2. Instruksi Eksekusi Frontend (Finalisasi Footer)
AI Agent wajib membersihkan sisa elemen di komponen *footer*:

### A. Penghapusan Ikon Logo
- Buka kembali file komponen *footer* yang dimodifikasi pada PRD sebelumnya.
- Temukan elemen visual yang merender ikon logo (berupa lingkaran dengan ikon bintang/sparkles di dalamnya).
- Hapus seluruh blok kode pembungkus ikon tersebut.
- Pastikan area *footer* kini benar-benar bersih dan proporsinya (margin/padding) tetap seimbang meskipun elemen logonya sudah hilang.

## 3. Instruksi Eksekusi Audit (Logika Berat Pengiriman)
**Tugas AI Agent (Wajib dilaporkan kembali kepada Developer via Chat):**
AI Agent HARUS menelusuri logika perhitungan ongkos kirim atau integrasi dengan API logistik (seperti Biteship/RajaOngkir jika ada) dan memberikan laporan terkait hal berikut:

### A. Pengecekan Variabel Berat (Weight)
- Telusuri file skema Prisma (`schema.prisma`) dan periksa apakah ada kolom `berat` atau `weight` pada tabel `Product`.
- Telusuri logika *checkout* atau kalkulasi ongkir. Periksa apakah sistem saat ini mengasumsikan/meng- *hardcode* berat 1 barang = 1000 gram (1kg).
- **Instruksi Pelaporan:** Jika berat di- *hardcode* 1kg per barang, laporkan ke *developer*. Jika nilai berat diambil dari *database*, laporkan juga statusnya.
- **Tindakan Pencegahan (Opsional tapi disarankan):** Jika saat ini sistem mengalikan ongkir mentah dengan kuantitas (seperti instruksi PRD 047) TANPA mempertimbangkan limit 1kg dari kurir, berikan saran perbaikan kode agar perhitungan ongkir didasarkan pada total berat keranjang (misalnya: `Math.ceil(totalBeratGram / 1000) * tarifPerKg`), bukan sekadar `kuantitas * tarifFlat`.

## 4. Kriteria Selesai (Acceptance Criteria)
- Logo ikon di *footer* berhasil dihapus, menyisakan area *footer* yang bersih.
- AI Agent memberikan laporan tertulis yang merinci bagaimana sistem saat ini menangani berat barang untuk kalkulasi ongkos kirim.
- Kompilasi berjalan lancar tanpa *error* visual.