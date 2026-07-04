importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

// Service worker ini berfungsi agar FCM tidak error 404.
// Jika ingin menangani push notifikasi di background secara aktif,
// Anda dapat melakukan inisialisasi firebase.initializeApp(...) di sini.

self.addEventListener('push', function(event) {
  console.log('[firebase-messaging-sw.js] Received background message ', event);
});
