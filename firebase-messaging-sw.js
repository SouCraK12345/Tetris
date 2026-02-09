// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

const firebaseConfig = {
    apiKey: "AIzaSyCmAhWBckkH5Tsd9a_K3kFxWy7d9T0kvJw",
    authDomain: "online-tetris-notification.firebaseapp.com",
    projectId: "online-tetris-notification",
    storageBucket: "online-tetris-notification.firebasestorage.app",
    messagingSenderId: "1022302639724",
    appId: "1:1022302639724:web:5eeaf901b141834bf0ea49",
    measurementId: "G-2X3GJJC8HP"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  const title = (payload && payload.notification && payload.notification.title) || '通知';
  const options = {
    body: (payload && payload.notification && payload.notification.body) || '',
    icon: (payload && payload.notification && payload.notification.icon) || '/favicon.ico'
  };
  self.registration.showNotification(title, options);
});
