// service-worker.js
self.addEventListener('install', event => {
    self.skipWaiting();
  });
  
  self.addEventListener('activate', event => {
    return self.clients.claim();
  });
  
  // Menangani notifikasi saat diklik
  self.addEventListener('notificationclick', event => {
    const notification = event.notification;
    notification.close();
    
    // Buka aplikasi saat notifikasi diklik
    event.waitUntil(
      clients.matchAll({type: 'window'}).then(clientList => {
        // Periksa apakah ada jendela yang sudah terbuka
        for (const client of clientList) {
          if (client.url === '/' && 'focus' in client) {
            return client.focus();
          }
        }
        // Jika tidak ada jendela yang terbuka, buka jendela baru
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
    );
  });
  
  // Menangani push notification dari server (untuk pengembangan masa depan)
  self.addEventListener('push', event => {
    if (event.data) {
      const data = event.data.json();
      const options = {
        body: data.body,
        icon: 'img/logo.png',
        badge: 'img/badge.png',
        data: data.data
      };
      
      event.waitUntil(
        self.registration.showNotification(data.title, options)
      );
    }
  });