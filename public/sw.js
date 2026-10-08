// Service Worker for LiderKids background notifications and offline capabilities

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Bildirishnoma bosilganda ilovaga yo'naltirish
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const targetUrl = event.notification.data?.url || '/lessons';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url && 'focus' in client) {
          client.focus();
          client.navigate(targetUrl);
          return;
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});

// Background push notification event listener (if Web Push is configured)
self.addEventListener('push', (event) => {
  let data = {
    title: '🔥 LiderKids: Darsni boshla!',
    body: 'Sherchang kutmoqda! Bugungi olovchangni yoqib qo‘y!',
    url: '/lessons',
  };

  try {
    if (event.data) {
      data = event.data.json();
    }
  } catch (e) {
    // Fallback
  }

  const options = {
    body: data.body,
    icon: '/icon.svg',
    badge: '/icon.svg',
    vibrate: [200, 100, 200],
    data: { url: data.url },
    actions: [
      { action: 'open', title: 'Darsga kirish 🚀' },
      { action: 'quiz', title: 'Test yechish 📝' },
    ],
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});
