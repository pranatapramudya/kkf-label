# PRD 036: Resolusi Fatal Type Error Ekosistem Vercel AI SDK

## 1. Konteks & Tujuan
Terdapat *TypeScript (TS) Error* yang memblokir kompilasi pada dua file utama penyusun fitur SaaS premium boilerplate ini.
1. **Frontend (`page.tsx`)**: Destructuring dari `useChat` (messages, input, dll) ditandai garis merah karena `initialMessages` tidak dikenali sebagai tipe `Message[]` yang valid secara absolut oleh TypeScript.
2. **Backend (`route.ts`)**: Method `toDataStreamResponse()` ditandai garis merah pada objek `result` hasil eksekusi `streamText`.
Tujuan PRD ini adalah memberikan instruksi mutlak kepada AI Agent untuk memperbaiki definisi tipe data (*typing*) di kedua file tersebut agar kompatibel dengan versi SDK yang terinstal, tanpa merombak logika UI.

## 2. Instruksi Refactoring Frontend (`app/(main)/rekomendasi/page.tsx`)
**Tugas AI Agent:**
1. Tambahkan *import* tipe data eksplisit di bagian atas file:
   `import { type Message } from 'ai';`
2. Modifikasi deklarasi `initialMessageFallback` dengan memberikan *strict typing* `Message[]` secara langsung. 
   Contoh format yang diwajibkan:
   `const initialMessageFallback: Message[] = [ { id: 'init-1', role: 'assistant', content: 'Halo! Saya AI Virtual Stylist KKF Label...' } ];`
3. Pastikan bahasa instruksi UI tetap dalam bahasa Indonesia sesuai standar proyek. Jangan hapus konfigurasi `onError` pada hook `useChat`.

## 3. Instruksi Refactoring Backend (`app/api/chat/route.ts`)
**Tugas AI Agent:**
1. Evaluasi *method* pada objek `result` hasil eksekusi `streamText`.
2. Jika TS menolak `toDataStreamResponse()`, ini berarti versi SDK lokal menggunakan penamaan *method* generasi sebelumnya. Agent **wajib** mengubah baris pengembalian respons menjadi:
   `return result.toTextStreamResponse();`
3. Jika Agent mendeteksi bahwa *method* tersebut membutuhkan parameter tambahan atau *cast* tertentu berdasarkan versi `@ai-sdk/google` yang terinstal, lakukan *casting* yang tepat. 
4. Pertahankan seluruh blok `try-catch` dan *system prompt* bahasa Indonesia yang sudah ada.

## 4. Kriteria Selesai (Acceptance Criteria)
- AI Agent telah mengeliminasi semua garis bawah merah (TS Error) di file `page.tsx` pada baris `const { messages, input, ... } = useChat(...)`.
- AI Agent telah mengeliminasi garis bawah merah di file `route.ts` pada baris `return result...`.
- Proses kompilasi di terminal `npm run dev` berhasil tanpa peringatan *Type Error*.