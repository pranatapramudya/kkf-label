# Product Requirements Document (PRD) - Update Fitur Ekspedisi

## 1. Konteks
Saat ini aplikasi sudah berada di tahap *production*. Terdapat ketidaksesuaian teks pada antarmuka pencarian ekspedisi dan ada beberapa opsi kurir yang harus dihilangkan dari pilihan pelanggan.

## 2. Detail Tugas (Tasks)

**Task A: Update Teks Placeholder (UI)**
- **Masalah:** Pada komponen *dropdown/search* pilihan ekspedisi, *placeholder* input pencariannya masih tertulis "Cari wilayah...".
- **Ekspektasi:** Ubah teks *placeholder* tersebut agar bahasa Indonesianya lebih relevan, yaitu menjadi "Cari ekspedisi...".
- **Petunjuk:** Cari komponen UI yang merender *dropdown* ekspedisi ini (kemungkinan menggunakan komponen Select/Combobox/Input).

**Task B: Hapus Opsi Kurir (Logic/Data)**
- **Masalah:** Pada daftar ekspedisi, terdapat kurir "sapx" dan "idexpress" yang saat ini tidak didukung oleh operasional toko.
- **Ekspektasi:** Hapus, *comment*, atau *filter out* objek data `sapx` dan `idexpress` dari *array* atau pemanggilan API/sumber data ekspedisi, sehingga tidak muncul lagi di pilihan pelanggan.

## 3. Aturan Pengembangan (Strict Rules)
1. **NO PRODUCTION PUSH:** Dilarang keras melakukan `git add`, `git commit`, atau `git push`. Proyek ini sudah *live*, semua perubahan murni hanya modifikasi kode file di *local environment*.
2. **LOCAL TESTING ONLY:** Fokus berikan perbaikan kodenya saja agar *developer* bisa mengujinya terlebih dahulu di `localhost:3000`.
3. **BAHASA:** Pastikan semua teks UI tetap menggunakan bahasa Indonesia.