# PRD 051: Koreksi Skema Payload API Biteship (Array Items Mapping)

## 1. Konteks & Tujuan
Implementasi dinamisasi berat pada PRD 050 gagal mengubah nilai ongkos kirim. Berdasarkan laporan, AI Agent menyematkan variabel `weight` pada *root level* objek payload. Skema API Rates Biteship tidak membaca `weight` pada level root. Biteship mengkalkulasi berat total secara internal berdasarkan perkalian nilai `weight` dan `quantity` di dalam array `items`.
Tujuan PRD ini adalah memperbaiki struktur JSON payload yang dikirim ke endpoint Biteship agar sepenuhnya patuh pada dokumentasi resmi Biteship API.

## 2. Instruksi Eksekusi Backend (`app/api/ongkir/route.ts`)
AI Agent wajib memodifikasi pembentukan payload ke Biteship dengan instruksi berikut:

### A. Hapus Variabel Root
- Hapus properti `weight` atau `totalBerat` yang disematkan di *root level* objek utama yang dikirim ke fungsi fetch Biteship.

### B. Pemetaan Array Items (Mapping)
- Pastikan payload yang dikirimkan ke Biteship memiliki properti `items` (berupa array).
- Lakukan *mapping* dari data keranjang belanja (*cart items* yang diterima dari frontend) ke dalam array `items` tersebut.
- Di dalam setiap objek *item* hasil *mapping*, **WAJIB** menyertakan tiga properti inti logistik ini:
  1. `name`: Nama produk (string)
  2. `value`: Harga produk (number)
  3. `weight`: 250 (number, hardcode dalam satuan gram)
  4. `quantity`: item.quantity (number, kuantitas aktual dari keranjang)

*Catatan untuk AI Agent: Dengan menyematkan `weight: 250` dan `quantity` yang dinamis di dalam masing-masing objek pada array `items`, engine Biteship akan secara otomatis mengalkulasi total berat volumetrik tanpa perlu kita hitung manual.*

## 3. Kriteria Selesai (Acceptance Criteria)
- Payload yang dikirim ke Biteship tidak lagi memiliki properti `weight` di luar, melainkan terdistribusi di dalam array `items`.
- Saat dicoba *checkout* dengan **10 buah barang** (estimasi 2.500 gram), tarif pengiriman secara otomatis merespons dengan harga kelas berat 2kg atau 3kg.