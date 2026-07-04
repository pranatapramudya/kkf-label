# Product Requirements Document (PRD) - Penanganan Error Firebase Cloud Messaging (FCM)

## 1. Konteks
Saat menjalankan aplikasi di environment lokal (localhost), muncul pesan error *unhandled rejection* dari Next.js berupa `AbortError: Registration failed - push service error`. Error ini dipicu oleh kegagalan registrasi *Service Worker* atau penolakan izin *push notification* oleh browser saat memanggil Firebase Cloud Messaging (FCM).

## 2. Detail Tugas (Tasks)

**Task A: Implementasi Graceful Error Handling pada FCM**
- Cari file yang bertugas menginisialisasi Firebase Messaging dan meminta token (kemungkinan di `lib/firebaseClient.ts`, `components/FCMProvider.tsx`, atau file *hook* sejenis).
- Temukan baris kode yang memanggil fungsi `getToken(messaging, { vapidKey: ... })`.
- **Solusi:** Bungkus pemanggilan `getToken` (dan logika registrasi service worker terkait) menggunakan blok `try...catch`.
- Di dalam blok `catch (error)`, cegah error tersebut agar tidak *bubble up* dan merusak UI. Cukup berikan log peringatan yang informatif menggunakan `console.warn('FCM Token generation failed:', error)`.

## 3. Aturan Pengembangan (Strict Rules)
1. **NO PRODUCTION PUSH:** Dilarang melakukan eksekusi perintah terminal seperti `git push`.
2. Semua dokumentasi dan komentar dalam kode harus menggunakan bahasa Indonesia.
3. Edit kode secara langsung agar developer bisa memastikan *overlay* error merah di localhost menghilang.