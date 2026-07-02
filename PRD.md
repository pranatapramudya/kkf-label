# Update PRD: Bug Fix Notifikasi (Audio Fail-safe & Routing Detail)

## 1. Latar Belakang Masalah
- **Audio Error:** Terjadi `NotSupportedError` di konsol karena *file* MP3 tidak ditemukan atau gagal dimuat, yang dapat mengganggu *render* komponen.
- **Routing Macet:** Tombol "Buka Detail" pada pop-over notifikasi gagal mengarahkan admin ke halaman pesanan. Ini mungkin disebabkan oleh *path* yang tidak valid atau *error handler* yang memblokir eksekusi navigasi.

## 2. Kebutuhan Solusi Logika (Requirement)
- **Audio Fail-safe:**
  - Tambahkan blok `try-catch` yang kokoh di sekitar pemanggilan `audio.play()`.
  - Pastikan pemutaran audio tidak memblokir atau merusak proses *render* komponen utama jika file belum ada di folder `public/notif.mp3`.
- **Koreksi Routing "Buka Detail":**
  - Pastikan fungsi `onClick` menggunakan `e.preventDefault()`.
  - Eksekusi *update database* (`isRead: true`) dan *routing* (`router.push`) harus dijalankan secara asinkron dengan benar.
  - Verifikasi URL tujuan. Berdasarkan sidebar, URL yang benar kemungkinan adalah `/admin/pesanan` atau `/pesanan`. Pastikan URL ini akurat.