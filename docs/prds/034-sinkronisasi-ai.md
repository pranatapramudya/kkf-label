# PRD 034: Sinkronisasi Total Frontend & Backend Vercel AI SDK

## 1. Konteks & Tujuan
Terjadi *silent failure* berulang pada halaman `/rekomendasi` di mana pesan awal (`initialMessages`) gagal dirender (layar blank) dan tombol submit terblokir. Hal ini diakibatkan oleh *mismatch* inisialisasi antara *frontend* dan penanganan *request* di *backend*. Tujuan dari PRD ini adalah menginstruksikan AI Agent untuk melakukan standardisasi ulang pada kedua file tersebut dengan menerapkan pola *error handling* dan *fallback UI* yang dianjurkan oleh dokumentasi resmi Vercel AI SDK.

## 2. Arsitektur Backend (`app/api/chat/route.ts`)
AI Agent harus menulis ulang *endpoint* POST ini dengan spesifikasi:
- **Konfigurasi Edge:** Wajib mendefinisikan `export const runtime = 'edge';` di baris atas untuk performa *streaming* maksimal.
- **Error Handling (Try-Catch):** Seluruh proses inisialisasi AI harus dibungkus dalam blok `try-catch`. Jika terjadi *error* (misalnya API key gagal dibaca), tangkap *error*-nya, lakukan `console.error`, dan kembalikan respons HTTP status 500 dengan *payload* JSON berisi pesan *error*.
- **Integrasi Model:** Gunakan modul `streamText` dari `ai` dan model `google('gemini-1.5-flash')` dari `@ai-sdk/google`.
- **System Prompt:** Tetapkan prompt sistem bahasa Indonesia yang profesional (sebagai Virtual Stylist KKF Label).

## 3. Arsitektur Frontend (`app/(main)/rekomendasi/page.tsx`)
AI Agent harus memfaktorkan ulang komponen halaman ini dengan spesifikasi:
- **Import:** Wajib menggunakan `import { useChat } from '@ai-sdk/react';`.
- **Inisialisasi useChat:** Tambahkan fungsi `onError` ke dalam opsi `useChat` untuk mencetak *error* ke *console browser* jika koneksi ke `/api/chat` terputus.
- **Proteksi Layar Blank (Fallback UI):** Buat variabel `initialMessageFallback` di luar komponen. Buat logika *render* bernama `displayMessages`: jika array `messages` dari hook `useChat` kosong, paksa UI menggunakan `initialMessageFallback` tersebut untuk di-*map* ke layar, sehingga sapaan awal tidak pernah hilang.
- **Proteksi Form:** Pastikan elemen *button submit* diamankan dari nilai *undefined* dengan optional chaining: `disabled={isLoading || !input?.trim()}`.

## 4. Kriteria Selesai (Acceptance Criteria)
- Proses kompilasi Next.js berhasil tanpa pesan *error module not found*.
- Layar obrolan tidak lagi mengalami *blank screen* pada saat dimuat pertama kali.
- Pesan dapat diketik dan dikirim tanpa memicu *error* "read-only" atau "setInput is not a function".
- Jika *backend* mengalami kegagalan, *frontend* akan memunculkan *log error* yang jelas di *console*, bukan mengalami *silent freeze*.