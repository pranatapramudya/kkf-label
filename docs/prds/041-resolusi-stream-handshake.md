# PRD 041: Resolusi Handshake Data Stream Protocol & UI Rendering

## 1. Konteks & Tujuan
Berdasarkan log server, endpoint `/api/chat` berhasil memproses RAG dan mengembalikan status `200 OK` dalam waktu ~8 detik. Namun, balasan AI tidak ter-render (blank) pada antarmuka pengguna (UI). Masalah ini merupakan dampak dari *mismatch* format protokol *streaming* antara respons yang dikirimkan *backend* dengan metode ekstraksi data yang diantisipasi oleh hook `useChat` di *frontend* pada Vercel AI SDK v4+. Tujuan PRD ini adalah menyelaraskan protokol *output stream backend* dengan logika *rendering frontend*.

## 2. Instruksi Eksekusi Backend (`app/api/chat/route.ts`)
**Fokus: Standarisasi Data Stream**
- Evaluasi *method* pengembalian (*return statement*) pada objek hasil eksekusi `streamText`.
- Pastikan *backend* **tidak** mereturn respons dalam bentuk teks mentah (misalnya `toTextStreamResponse()`).
- AI Agent wajib memastikan fungsi *return* menggunakan standar Vercel Data Stream Protocol, yaitu `toDataStreamResponse()`. Jika SDK versi terbaru membutuhkan inisialisasi spesifik untuk *Response header*, pastikan format *Data Stream* ini teraplikasi dengan benar agar bisa ditangkap oleh hook UI.

## 3. Instruksi Eksekusi Frontend (`app/(main)/rekomendasi/page.tsx`)
**Fokus: Logika Rendering Pesan (Message Mapping)**
- Tinjau ulang bagian UI yang melakukan *mapping* terhadap array `messages` yang dihasilkan oleh hook `useChat`.
- Pada implementasi SDK terbaru, pesan masuk dari asisten seringkali didistribusikan dalam properti `content` (sebagai string yang di- *stream*) atau terbungkus di dalam `parts`. 
- AI Agent wajib memperbaiki logika render UI agar secara dinamis memeriksa: Jika *message* memiliki teks di dalam `content`, render bagian tersebut. Jika struktur yang diterima adalah array `parts` dari *stream*, lakukan ekstraksi teks dari elemen *parts* yang relevan.
- Pastikan elemen komponen *chat bubble* untuk `role === 'assistant'` dapat membaca dan menampilkan *string* hasil *streaming* tersebut tanpa terjadi *silent error* (gagal render).

## 4. Kriteria Selesai (Acceptance Criteria)
- Terdapat *chat bubble* dari asisten yang muncul di bawah pesan pengguna pada UI.
- Teks rekomendasi produk dari *database* (yang sudah diproses oleh backend RAG) berhasil tertampil dan ter- *stream* secara *real-time* di layar pengguna.