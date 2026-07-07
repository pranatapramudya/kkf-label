# PRD 046: Audit Kesiapan Produksi (Go-Live) & Implementasi Rate Limiting

## 1. Konteks & Tujuan
Fitur "AI Stylist KKF" telah berhasil memproses RAG dari database, menampilkan visual produk, dan mengarahkan pengguna ke tautan e-commerce. Sebelum fitur ini dirilis secara publik (Production), perlu dilakukan audit menyeluruh terhadap stabilitas kode dan keamanan. Selain itu, untuk mengontrol biaya API LLM dan mencegah penyalahgunaan (spam), sistem harus membatasi setiap pengguna maksimal hanya dapat mengirimkan 3 pesan (chat) per sesi.
Tujuan PRD ini adalah menginstruksikan AI Agent untuk mengevaluasi kesiapan kode dan mengimplementasikan mekanisme *Rate Limiting* di sisi UI dan API.

## 2. Instruksi Eksekusi: Audit Kesiapan Produksi
**Tugas AI Agent (Wajib dilaporkan kembali kepada Developer via Chat):**
Sebelum merombak kode, AI Agent HARUS melakukan pengecekan pada file `app/api/chat/route.ts` dan `app/(main)/rekomendasi/page.tsx` lalu memberikan laporan status mengenai 3 hal ini:
1. **Keamanan Environment:** Apakah ada kunci API (API Keys) atau kredensial database yang tertulis langsung (*hardcoded*) di dalam file? (Pastikan semua menggunakan `process.env`).
2. **Error Handling:** Apakah blok `try-catch` sudah mencakup pengembalian respons error yang aman dan tidak mengekspos detail sensitif database ke *client* jika terjadi kegagalan?
3. **Optimasi:** Apakah ada *console.log* sisa *debugging* yang perlu dibersihkan sebelum kompilasi *production*?

## 3. Instruksi Eksekusi: Implementasi Batas 3 Chat (Rate Limiting)
Setelah memberikan laporan audit, AI Agent wajib memodifikasi UI untuk membatasi interaksi pengguna.

### A. Modifikasi Frontend (`app/(main)/rekomendasi/page.tsx`)
- Buat sebuah variabel turunan untuk menghitung jumlah pesan yang sudah dikirimkan oleh pengguna. (Contoh: `const userMessageCount = messages.filter(m => m.role === 'user').length;`).
- **Logika Pemblokiran UI:** Jika `userMessageCount >= 3`, maka:
  1. Nonaktifkan form input (berikan atribut `disabled` pada input teks dan tombol kirim).
  2. Ubah *placeholder* pada input teks menjadi peringatan yang ramah. Contoh: *"Batas konsultasi harian habis. Silakan klik produk di atas untuk berbelanja!"*
  3. Ubah visual input (misalnya warna latar menjadi abu-abu) agar secara UX pengguna paham bahwa form tidak bisa diketik lagi.

### B. Modifikasi Backend (`app/api/chat/route.ts`) - Lapis Keamanan Kedua
- Sebagai pelindung tambahan jika pengguna mencoba membypass UI, tambahkan validasi di awal fungsi `POST`.
- Hitung jumlah pesan dalam array `messages` yang berasal dari *user*. Jika jumlahnya sudah lebih dari 3 (atau array melebihi panjang wajar dari 3 kali tanya-jawab), tolak *request* tersebut.
- Kembalikan respons *Error 429 (Too Many Requests)* dengan pesan JSON yang rapi.

## 4. Kriteria Selesai (Acceptance Criteria)
- AI Agent memberikan laporan tertulis yang jelas mengenai kesiapan produksi sistem (Aman/Perlu Perbaikan).
- Pengguna hanya dapat mengirimkan maksimal 3 pertanyaan kepada AI Stylist.
- Pada percobaan ke-4, form otomatis terkunci, *placeholder* berubah, dan tidak ada lagi *request* yang bocor ke API Gemini.