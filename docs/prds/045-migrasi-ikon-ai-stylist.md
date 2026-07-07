# PRD 045: Konsistensi Visual - Migrasi Ikon Avatar AI Stylist

## 1. Konteks & Tujuan
Berdasarkan peninjauan antarmuka obrolan (Chat UI), avatar yang merepresentasikan AI Stylist saat ini masih menggunakan ikon bawaan (seperti `Sparkles` atau bintang dari *library* ikon). Untuk menjaga konsistensi identitas visual *brand* KKF Label dengan halaman beranda, ikon bawaan ini harus diganti dengan aset khusus `icon-technical-support` yang sudah tersedia di direktori lokal.
Tujuan PRD ini adalah menginstruksikan AI Agent untuk melacak dan mengganti aset visual pada komponen *header* obrolan dan *bubble chat* asisten.

## 2. Instruksi Eksekusi Frontend (`app/(main)/rekomendasi/page.tsx` atau komponen Chat UI)
AI Agent wajib melakukan penelusuran dan penyesuaian pada file antarmuka obrolan dengan langkah-langkah arsitektural berikut:

### A. Pelacakan & Penggantian Avatar Header
- Cari bagian kode yang merender *Header* obrolan (area yang menampilkan teks "AI Stylist KKF" dan status "Online").
- Temukan elemen ikon yang berada di dalam lingkaran berlatar belakang merah muda di sebelah teks tersebut.
- Hapus pemanggilan ikon dari *library* eksternal (misalnya `lucide-react`).
- Gantikan dengan elemen gambar bawaan Next.js (`<Image />`) atau tag `<img>`.
- Arahkan sumber gambar (`src`) ke path `/icons/icon-technical-support.png` (sesuaikan ekstensi fail `.png` atau `.svg` berdasarkan fail aktual yang ada di dalam folder `public/icons`).

### B. Pelacakan & Penggantian Avatar Chat Bubble
- Telusuri logika *mapping* pada array `messages` (bagian yang merender pesan pengguna dan asisten).
- Temukan blok kondisional yang merender avatar khusus untuk asisten (`role === 'assistant'`).
- Lakukan hal yang sama seperti langkah A: Hapus ikon bawaan dan ganti dengan aset gambar `/icons/icon-technical-support`.

### C. Penyesuaian Properti Penataan (Styling)
- Pastikan elemen gambar yang baru dipasang mewarisi proporsi ukuran yang tepat (misalnya menggunakan kelas Tailwind seperti `w-5 h-5` atau `w-6 h-6`).
- Pastikan gambar terpusat sempurna di dalam wadah lingkarannya (gunakan properti seperti `object-contain` jika diperlukan).
- Jangan merusak struktur warna *background* lingkaran (seperti `bg-pink-500`) yang sudah ada.

## 3. Kriteria Selesai (Acceptance Criteria)
- Tidak ada lagi logo bintang atau robot bawaan di seluruh antarmuka halaman rekomendasi.
- Avatar di *header* dan di sebelah balon teks balasan AI telah berubah menjadi ikon *technical support* dari direktori lokal.
- UI tidak pecah dan gambar termuat dengan ukuran proporsional.