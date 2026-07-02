# Update PRD: Fix Firebase Admin Initialization (SDK v12+)

## 1. Latar Belakang Masalah
- Terjadi *build error* di Vercel: `Property 'apps' does not exist on type...` pada file `lib/firebase-admin.ts`.
- Hal ini disebabkan oleh pembaruan struktur Firebase Admin SDK v12+ yang mengharuskan penggunaan *modular imports* untuk TypeScript.

## 2. Kebutuhan Solusi Logika (Requirement)
- **Refaktor `lib/firebase-admin.ts`:**
  - Hapus import bergaya lama (`import * as admin from 'firebase-admin'`).
  - Gunakan import modular khusus dari `firebase-admin/app`: `import { initializeApp, getApps, cert } from 'firebase-admin/app';`
  - Ganti pengecekan `admin.apps.length` menjadi `getApps().length`.
  - Ganti `admin.initializeApp` menjadi `initializeApp`.
  - Ganti `admin.credential.cert` menjadi `cert`.