// Firebase SDK 読み込み
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyAYxyejiMqg2bWO9dx7zoDg4X9aLyZEgG8",
    authDomain: "online-tetris-souki.firebaseapp.com",
    databaseURL: "https://online-tetris-souki-default-rtdb.firebaseio.com",
    projectId: "online-tetris-souki",
    storageBucket: "online-tetris-souki.firebasestorage.app",
    messagingSenderId: "564189331569",
    appId: "1:564189331569:web:0c7e30ba76e88423c31bd0",
    measurementId: "G-1HYR4KWBDV"
};

// Firebase初期化
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// 書き込み（例: ボタン押したら送信）
function sendData() {
    const text = map.slice(0, 200);
    if (user_name) {
        set(ref(db, "messages/" + user_name), {
            message: text,
            time: Date.now()
        });
    }
}

// 読み込み（リアルタイムで更新）
const msgRef = ref(db, "messages/");
onValue(msgRef, (snapshot) => {
    window.cloudData = snapshot.val();
    // const data = snapshot.val();
    // document.getElementById("output").innerText =
    // data ? `${data.message} (${new Date(data.time).toLocaleTimeString()})` : "データなし";
});

let cloudData;

// グローバル関数化
window.sendData = sendData;