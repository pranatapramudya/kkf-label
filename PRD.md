# Update PRD: Migrasi Total API Ongkir dari Komerce ke BiteShip

## 1. Latar Belakang Masalah
- API Komerce/RajaOngkir menerapkan limitasi ketat pada mode Sandbox dan mewajibkan dokumen legal (SLA/CA) untuk masuk ke mode Live, sehingga kurir seperti SiCepat, Ninja, dll selalu merespons "Not Found".
- Untuk efisiensi dan kebersihan arsitektur, seluruh sistem logistik (Cek Ongkir & Pelacakan) akan disatukan menggunakan **BiteShip API**.

## 2. Kebutuhan Solusi Logika (Requirement)
- **Refaktor API Cek Ongkir (Backend):**
  - Buka route API yang bertugas mengecek ongkir (misal: `app/api/ongkir/route.ts`).
  - Hapus seluruh logika, URL, dan *headers* yang mengarah ke Komerce/RajaOngkir.
  - Ganti menggunakan *endpoint* BiteShip: `POST https://api.biteship.com/v1/rates/couriers`.
  - Gunakan `process.env.BITESHIP_API_KEY` pada *header* Authorization.
  - Sesuaikan struktur *payload* (body) yang dikirim agar sesuai dengan standar BiteShip (menggunakan data asal, tujuan, berat barang, dan `couriers` yang dipilih).
- **Penyesuaian Response ke Frontend:**
  - *Mapping* hasil *response* JSON dari BiteShip sedemikian rupa agar struktur datanya (harga, nama layanan) tetap kompatibel dengan komponen *Checkout* di *frontend* tanpa harus merombak total UI yang sudah ada.
  - Pastikan daftar kurir di *dropdown* *frontend* (`value` seperti `sicepat`, `jne`, `jnt`, dll) dikirim dengan benar ke API BiteShip ini.