# PRD: 023 Redesain UI Beranda (Modern Icon Grid Menu)

## 1. Konteks
Tampilan beranda (Hero section) saat ini menggunakan teks deskripsi yang terlalu panjang dan tombol navigasi berbentuk blok tumpuk (stacked buttons). Desain ini memakan banyak ruang vertikal dan kurang skalabel untuk penambahan fitur di masa depan. Kita perlu mengadopsi desain "Super App" modern (seperti Shopee) yang menggunakan grid icon melingkar dengan teks kecil di bawahnya.

## 2. Tujuan
- Membersihkan tampilan beranda dengan menghapus teks deskripsi yang tidak perlu.
- Mengubah tombol navigasi lama menjadi komponen grid menu yang modern, interaktif, dan mudah diskalakan (*scalable*).
- Memastikan UI baru tetap responsif di perangkat mobile maupun desktop.

## 3. Persyaratan Fungsional & UI (Requirements)
- **Hapus Elemen Lama:** 
  - Hapus paragraf teks deskripsi di Hero section (teks yang berbunyi: "Pilihan dress, blouse, outer, dan setelan...").
  - Hapus kedua tombol besar lama ("Semua Katalog" dan "Pilihan Paling Disukai").
- **Buat Komponen Baru (Modern Menu Grid):**
  - Buat layout berbasis Flexbox atau CSS Grid horizontal (dengan opsi scroll horizontal atau wrap pada mobile).
  - Setiap item menu terdiri dari:
    - **Icon Box:** Kotak melingkar (*rounded-full* atau *rounded-2xl*) dengan warna latar belakang (*background*) yang lembut/cerah (misalnya variasi warna brand pink/putih).
    - **Icon:** Gunakan icon dari library yang sudah ada (misal `lucide-react`) yang merepresentasikan menu (contoh: icon `LayoutGrid` atau `ShoppingBag` untuk Katalog, icon `Heart` untuk Disukai).
    - **Label Teks:** Teks kecil berukuran `text-xs` atau `text-sm` di bawah icon, di-set `text-center`.
  - Item menu awal yang dimasukkan:
    1. **Semua Katalog** (Link ke halaman katalog utama)
    2. **Paling Disukai** (Link ke filter/kategori terpopuler)
- **Animasi/Interaksi:** Berikan efek hover sederhana (misal: *scale-up* atau perubahan warna *background* ringan) saat icon ditekan/di-hover.

## 4. Pembaruan Dokumentasi (Wajib)
Setelah perubahan UI selesai, developer (AI) wajib memperbarui dokumen berikut:
- `README.md`: Perbarui bagian UI/UX dengan menyebutkan implementasi "Modern App-like Icon Grid Navigation".
- `SYSTEM_ARCHITECTURE.md`: Tambahkan catatan mengenai penggunaan komponen UI modular dan skalabel untuk navigasi beranda.