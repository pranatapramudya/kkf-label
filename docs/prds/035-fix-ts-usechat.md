# PRD 035: Resolusi TypeScript Type Error pada Hook useChat

## 1. Konteks & Tujuan
Terdapat *type error* (garis merah) pada saat melakukan destructuring variabel dari hook `useChat` (seperti `input`, `handleInputChange`, dll) di file `app/(main)/rekomendasi/page.tsx`. Kesalahan ini bukan berasal dari struktur folder API, melainkan dari inferensi tipe data TypeScript pada variabel konstan `initialMessageFallback`. TypeScript membaca properti `role: "assistant"` sebagai `string` umum, yang menyebabkan ketidakcocokan tipe dengan interface `Message` bawaan Vercel AI SDK. Tujuan PRD ini adalah melakukan *type assertion* pada objek tersebut agar validasi hook berjalan sempurna.

## 2. Instruksi Refactoring Frontend (`app/(main)/rekomendasi/page.tsx`)
AI Agent harus memperbaiki deklarasi `initialMessageFallback` tanpa mengubah logika komponen lainnya.

### Aturan Ketat Implementasi:
- Temukan deklarasi konstan `initialMessageFallback` di luar komponen (sekitar baris 8-14).
- Tambahkan *type assertion* `as const` secara spesifik pada properti `role`, ATAU pada seluruh blok objek tersebut agar TypeScript mengenalinya sebagai literal type yang valid untuk SDK.

**Spesifikasi Perubahan:**
Ubah deklarasi menjadi persis seperti ini:
```typescript
const initialMessageFallback = [
  {
    id: "init-1",
    role: "assistant" as const,
    content: "Halo! Saya AI Virtual Stylist KKF Label. Mau bepergian kemana hari ini? Biar kami siapkan rekomendasi outfit yang paling cocok untuk kamu!"
  }
];

3. Kriteria Selesai (Acceptance Criteria)
Tidak ada lagi peringatan atau garis bawah merah (Type Error) pada pemanggilan hook useChat.

Destructuring variabel (messages, input, handleInputChange, handleSubmit, isLoading, error) dikenali dengan benar oleh TypeScript.

File berhasil dikompilasi tanpa error di terminal development server.