import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getMessaging, getToken } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging.js";

const firebaseConfig = {
    apiKey: "AIzaSyCmAhWBckkH5Tsd9a_K3kFxWy7d9T0kvJw",
    authDomain: "online-tetris-notification.firebaseapp.com",
    projectId: "online-tetris-notification",
    storageBucket: "online-tetris-notification.firebasestorage.app",
    messagingSenderId: "1022302639724",
    appId: "1:1022302639724:web:5eeaf901b141834bf0ea49",
    measurementId: "G-2X3GJJC8HP"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

document.getElementById("enable-notification").addEventListener("click", async () => {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
        console.log("通知が許可されました。");
        try {
            const registration = await navigator.serviceWorker.register('./firebase-messaging-sw.js');
            console.log('Service Worker 登録:', registration);
            const token = await getToken(messaging, {
                vapidKey: "BE7Njv2zIqwFBV0wkcZUC3O5RnRSyYwe3zGve_gT6KeeHsou17U_6mEwknVGFrs_UcJXwsF30Y-cR5eJZmnOKhc",
                serviceWorkerRegistration: registration
            });
            console.log("FCMトークン:", token);
        } catch (err) {
            console.error('Service Worker 登録またはトークン取得に失敗:', err);
        }
    }
});
