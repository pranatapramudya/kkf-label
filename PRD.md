# PRD: KKF Label Phase 2.7 - Otomatisasi Penamaan Output APK (Gradle Configuration)

## 1. Objective (Tujuan)
Menghilangkan proses *rename* manual setiap kali melakukan *build* aplikasi Android. Berkas keluaran dari Android Studio harus secara otomatis bernama `Admin-KKF-LABEL.apk` bukan nama *default* bawaan sistem (`app-debug.apk`).

## 2. Analisis Masalah & Solusi
- **Masalah:** Gradle secara bawaan akan memberikan nama `app-[buildType].apk` (contoh: `app-debug.apk` atau `app-release.apk`) pada setiap hasil kompilasi.
- **Solusi:** Memodifikasi konfigurasi `build.gradle` pada level modul aplikasi (`android/app/build.gradle`). Dengan mengintervensi objek `applicationVariants`, sistem akan memaksa penggantian nama berkas (`outputFileName`) tepat sebelum proses kompilasi selesai.

## 3. Spesifikasi Implementasi
1. Modifikasi berkas `android/app/build.gradle`.
2. Tambahkan blok logika `applicationVariants.all` di dalam penutup blok `android { ... }` untuk menimpa parameter `outputFileName` menjadi `Admin-KKF-LABEL.apk`.