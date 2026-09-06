self.addEventListener("install", function () {
  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  event.waitUntil(clients.claim());
});

self.addEventListener("push", function (event) {
  event.waitUntil(
    (async function () {
      const data = event.data
        ? event.data.json()
        : { title: "Test Notification", body: "Push received" };

    const options = {
      body: data.body,
      icon: data.icon || "/icon-192x192.png",
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: "2",
      },
    };

      await self.registration.showNotification(
        data.title || "Test Notification",
        options,
      );
    })(),
  );
});

self.addEventListener("notificationclick", function (event) {
  console.log("Notification click received");
  event.notification.close();
  event.waitUntil(clients.openWindow("https://localhost:3001"));
});
