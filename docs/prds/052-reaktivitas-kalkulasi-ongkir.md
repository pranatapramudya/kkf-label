# PRD 052: Reaktivitas UI & Auto-Fetch Kalkulasi Ongkos Kirim (Debounced)

## 1. Konteks & Tujuan
Terdapat kelemahan UX (User Experience) pada halaman *checkout*. Saat pengguna memodifikasi kuantitas produk menggunakan tombol `+` atau `-`, subtotal harga barang berubah, namun nilai ongkos kirim tidak ter- *update* secara otomatis. Pengguna terpaksa memicu ulang (*trigger*) dengan cara mengubah pilihan ekspedisi. Hal ini disebabkan oleh tidak adanya *state* keranjang belanja di dalam *dependency array* pada siklus hidup (*lifecycle*) komponen yang bertugas melakukan *fetch* ke API logistik.
Tujuan PRD ini adalah memperbaiki reaktivitas React *hook* agar kalkulasi ongkir berjalan otomatis setiap ada perubahan jumlah barang, serta menerapkan teknik *debouncing* untuk melindungi API dari *spam request*.

## 2. Instruksi Eksekusi Frontend (`app/(main)/checkout/page.tsx` atau sejenisnya)
AI Agent wajib memodifikasi alur *trigger* fungsi *fetch* API ongkos kirim dengan spesifikasi arsitektur berikut:

### A. Penyesuaian Dependency Array pada useEffect
- Temukan *hook* `useEffect` yang memanggil fungsi pemanggilan API Biteship (misalnya fungsi `hitungOngkir()` atau `fetchShippingRates()`).
- Tambahkan *state* yang merepresentasikan isi keranjang atau total kuantitas (misalnya `cartItems`, `totalQuantity`, atau objek sejenis) ke dalam *dependency array* pada bagian akhir `useEffect`.
- Dengan ini, setiap kali jumlah barang di keranjang bertambah/berkurang, `useEffect` akan secara otomatis tereksekusi ulang tanpa menunggu pergantian ekspedisi.

### B. Implementasi Debounce (Pencegahan API Spam)
- Menerapkan auto-fetch secara langsung setiap kali tombol `+` atau `-` diklik berisiko memicu *API Rate Limit* jika pengguna melakukan klik dengan sangat cepat.
- AI Agent wajib membungkus logika pemanggilan fungsi pemanggilan API ke dalam sebuah fungsi *Debounce* (dengan durasi tunda sekitar 500ms - 800ms).
- Anda dapat mengimplementasikan *debounce* murni menggunakan fungsi `setTimeout` dan `clearTimeout` bawaan JavaScript di dalam `useEffect`, atau menggunakan *library* utilitas seperti `lodash.debounce` jika sudah tersedia di dalam proyek.

### C. Umpan Balik Visual (Loading State)
- Pastikan ada variabel *state* (misal `isLoadingOngkir` bernilai `true`) yang aktif saat *debounce* mulai menghitung dan API sedang melakukan *fetching*.
- Ikat *state* ini ke elemen UI agar saat pengguna menekan `+`, teks nominal ongkos kirim (misalnya "Rp 27.000") berubah sementara menjadi indikator proses (misal menampilkan teks "Menghitung..." atau *skeleton loading*) agar pengguna tahu bahwa harga sedang dikalkulasi ulang.

## 3. Kriteria Selesai (Acceptance Criteria)
- Saat pengguna mengubah kuantitas (klik `+` atau `-`), ongkos kirim otomatis melakukan penyesuaian (naik jika melewati batas berat volumetrik) tanpa perlu memanipulasi *dropdown* ekspedisi/kurir.
- Klik beruntun pada tombol kuantitas dengan kecepatan tinggi tidak menembak API berkali-kali, melainkan hanya menembak API 1 kali setelah pengguna selesai melakukan klik (berkat *debounce*).
- Terdapat indikator *loading* saat ongkir sedang dikalkulasi.