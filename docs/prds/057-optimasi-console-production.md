# PRD 057: Penyelesaian Log Error Production (Clerk Live Keys & Firebase FCM)

## 1. Konteks & Tujuan
Berdasarkan hasil pengujian *deployment* di *production* (kkflabel.com), terdeteksi dua isu pada *browser console*:
1. **Peringatan Clerk Auth:** Sistem autentikasi berjalan menggunakan *Development Keys* di *environment production*.
2. **Firebase Cloud Messaging (FCM) Error:** Upaya pengambilan token notifikasi gagal dan menghasilkan *error* karena izin notifikasi ditolak/diblokir secara *default* oleh *browser*.
Tujuan PRD ini adalah menginstruksikan pengembang untuk memperbarui variabel lingkungan (Env) dan menginstruksikan AI Agent untuk menangani kegagalan Firebase secara elegan (*graceful degradation*).

## 2. Instruksi Eksekusi Manual (Tugas Developer)
- Akses dasbor Clerk (clerk.com) untuk proyek KKF Label.
- Alihkan (*toggle*) mode dari "Development" ke "Production" / "Live".
- Salin `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` dan `CLERK_SECRET_KEY` versi Production.
- Ganti *value* variabel tersebut pada pengaturan *Environment Variables* di platform *hosting* (Vercel/dll), lalu lakukan *Redeploy*.

## 3. Instruksi Eksekusi Frontend (Tugas AI Agent)
AI Agent wajib menangani *error* Firebase pada komponen yang bertanggung jawab meminta izin notifikasi (kemungkinan di `app/layout.tsx`, file *provider* khusus, atau *service worker*):

### A. Modifikasi Logika Permintaan Token FCM
- Temukan blok kode pemanggilan `getToken()` dari pustaka Firebase Messaging.
- Bungkus pemanggilan tersebut ke dalam blok `try-catch` yang ketat.
- **Logika Penanganan (Catch):** Jika terjadi *error* (khususnya karena `permission-blocked`), JANGAN gunakan `console.error()`. Ubah menjadi `console.warn()` dengan pesan yang lebih ramah, atau abaikan saja (*silent fail*) agar *console* production tetap bersih.
- *(Opsional namun disarankan)*: Ubah alur agar sistem tidak meminta izin notifikasi secara otomatis saat halaman dimuat (*on-load*), melainkan pemicunya dipindah ke interaksi pengguna (misalnya saat pengguna mengklik tombol "Aktifkan Notifikasi Promo").

## 4. Kriteria Selesai (Acceptance Criteria)
- Tidak ada lagi peringatan "Clerk has been loaded with development keys" di *console production*.
- Tidak ada log *error* merah dari Firebase saat pengguna memblokir atau menolak izin notifikasi *browser*.