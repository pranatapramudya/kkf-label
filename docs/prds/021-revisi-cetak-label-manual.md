# PRD: 021 Revisi Cetak Label Pengiriman Manual (Non-Cashless)

## 1. Konteks
Sistem pengiriman KKF Label saat ini menggunakan alur manual tanpa integrasi API ekspedisi pihak ketiga (seperti Biteship). Semua pembayaran pesanan dilakukan melalui transfer bank manual (bukan COD, bukan sistem Cashless). Oleh karena itu, komponen cetak label (resi internal) harus disesuaikan agar logikanya sesuai dengan operasional lapangan di mana label dicetak sebelum nomor resi dari kurir didapatkan.

## 2. Tujuan
- Menyesuaikan tampilan label pengiriman agar relevan dengan sistem pembayaran transfer manual.
- Menangani kondisi pesanan yang belum memiliki nomor resi saat akan dicetak.
- Memastikan struktur desain (layout A6/thermal) tetap rapi dan tidak berubah.

## 3. Persyaratan Fungsional (Requirements)
- **Hapus Label Cashless:** Hapus teks atau *badge* yang bertuliskan "CASHLESS" di bawah nama kurir pada tampilan cetak label.
- **Conditional Rendering untuk Resi & Barcode:**
  - JIKA `nomor_resi` **kosong** (null/undefined/empty string):
    - Sembunyikan/hilangkan elemen *barcode*.
    - Ganti teks nomor resi yang berada di bawah *barcode* menjadi teks tebal (bold): **RESI MENYUSUL**.
  - JIKA `nomor_resi` **sudah diisi** (melalui update manual di modal Proses Pesanan):
    - Tampilkan elemen *barcode* (gunakan library barcode yang sudah ada, misalnya `react-barcode`).
    - Tampilkan teks nomor resi di bawah *barcode* tersebut.

## 4. Instruksi Implementasi untuk Developer (AI Agent)
1. Buka file komponen yang menangani tampilan cetak label/invoice (misalnya `PrintLabel`, `CetakResi`, atau file terkait di dalam folder `app/(admin)` atau `components/admin`).
2. Cari baris kode yang me-render *badge* "CASHLESS" dan hapus elemen tersebut.
3. Bungkus komponen *barcode* dan teks resinya dengan *ternary operator* (kondisional) berdasarkan keberadaan variabel `nomor_resi` dari data pesanan.
4. **JANGAN** mengubah ukuran *font*, *margin*, ketebalan garis batas, atau layout posisi elemen lainnya. Pertahankan struktur desain yang sudah ada.
5. Uji tampilan (Print Preview) pada pesanan yang sudah ada nomor resinya dan pesanan yang belum ada nomor resinya di environment `localhost`.