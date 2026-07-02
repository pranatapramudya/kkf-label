# Update PRD: Clean Up Obsolete Firebase Import

## 1. Latar Belakang Masalah
- Terjadi *build error* di Vercel: `Module '"@/lib/firebase-admin"' has no exported member 'admin'` pada file `app/api/payment/route.ts`.
- Ini adalah sisa residu dari pembaruan Firebase Admin v12+. Karena `lib/firebase-admin.ts` sudah diubah menjadi modular dan tidak lagi mengekspor `admin`, pemanggilan impor di file lain menjadi *error*.

## 2. Kebutuhan Solusi Logika (Requirement)
- **Refaktor `app/api/payment/route.ts`:**
  - Hapus atau ubah baris `import { admin } from "@/lib/firebase-admin";`.
  - Karena kita hanya butuh file tersebut dieksekusi untuk inisialisasi (side-effect), ubah menjadi impor tanpa destructuring: `import "@/lib/firebase-admin";`.
  - Pastikan fungsi pengiriman pesan tetap menggunakan `getMessaging().sendEachForMulticast(...)` yang diimpor langsung dari `firebase-admin/messaging`.