importScripts(
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyBYSh2TsK2F9ZigoyF-QYMIVLxw6Wa3l88",
  authDomain: "stockit-7a0f4.firebaseapp.com",
  projectId: "stockit-7a0f4",
  storageBucket: "stockit-7a0f4.firebasestorage.app",
  messagingSenderId: "811459523193",
  appId: "1:811459523193:web:ea0bc8904890a6d07a1aa8",
  measurementId: "G-K37M1BKTPY",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );

  const notificationTitle = payload.data?.title || "StockIt 알림";
  const notificationOptions = {
    body: payload.data?.body,
    icon: "/logo-192.png",
    badge: "/logo-192.png",
    data: payload.data,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener("notificationclick", function (event) {
  console.log("[firebase-messaging-sw.js] Notification click received.");

  event.notification.close();
  const urlToOpen = new URL(
    event.notification.data?.url || "/pwa",
    self.location.origin
  ).href;

  // 2. 앱 열기 또는 포커싱 로직
  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((windowClients) => {
        // 이미 열려있는 탭 중 해당 URL(혹은 앱)이 있는지 확인
        for (var i = 0; i < windowClients.length; i++) {
          var client = windowClients[i];
          if (client.url === urlToOpen && "focus" in client) {
            return client.focus();
          }
        }
        // 열린 탭이 없으면 새 창으로 열기
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});
