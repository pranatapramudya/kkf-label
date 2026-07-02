# Update PRD: Native Push Notification (Capacitor + Firebase FCM)

## 1. Latar Belakang Masalah
- In-App Notification (Web Audio & Polling) tidak berjalan saat aplikasi Android (Capacitor) berada di *background* atau layar perangkat terkunci (OS *battery optimization*).
- Admin membutuhkan notifikasi *push* asli (Native Push Notification) yang muncul di *system tray* Android kapan pun pesanan baru masuk.

## 2. Kebutuhan Solusi Logika & Infrastruktur (Requirement)
- **Plugin Capacitor:** Instalasi dan konfigurasi `@capacitor/push-notifications` untuk meminta izin (*permission*) kepada OS Android dan mengambil FCM Device Token.
- **Database (Prisma):** Tambahkan model/tabel `DeviceToken` atau tambahkan *field* `fcmToken` pada tabel User/Admin untuk menyimpan token perangkat admin.
- **Backend Trigger (Firebase Admin SDK):** 
  - Instal `firebase-admin` di Next.js.
  - Saat API `/api/payment` sukses memproses orderan baru, jalankan fungsi *push* menggunakan `firebase-admin` ke FCM Token milik admin yang tersimpan di database.
  - *Payload* notifikasi harus berisi judul ("Pesanan Masuk KKF Label") dan body ("Nominal Rp XXX masuk").