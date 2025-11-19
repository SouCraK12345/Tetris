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


// 1. Firebaseが提供するサーバータイムとの差分を取得
const offsetRef = ref(db, ".info/serverTimeOffset");
let offset = 0;

onValue(offsetRef, (snap) => {
    offset = snap.val() || 0;
});

// 2. サーバー時刻をリアルタイムで算出
function getServerTime() {
    return Date.now() + offset;
}


set(ref(db, "active/"), {
    time: new Date(getServerTime()).getTime()
});
const msgRef = ref(db, "rate/");
onValue(msgRef, (snapshot) => {
    if (first) {
        document.querySelector(".init").classList.add("fadeout");
        document.querySelector(".init").addEventListener("animationend",function(){
            document.querySelector(".init").style.display = "none";
        },{ once: true});
        window.player_data = snapshot.val();
        let data = window.player_data;
        for(var i in data){
            if(i == "undefined" || i == "null"){
                continue;
            }
            document.querySelector(".user-container").innerHTML += `
              <div class="user-block">
                <div class="user-name">${i}</div>
                <div class="user-point">${Math.round(data[i]["total-point"])}pt</div>
            <div class="user-rank">${getRank(data[i]["total-point"])}</div>
              </div>
            `;
        }
    }
    first = false;
});

function getRank(e) { if (e < 0) return "範囲外"; if (e <= 299) return "C-"; if (e <= 699) return "C"; if (e <= 1199) return "C+"; if (e <= 1799) return "B-"; if (e <= 2499) return "B"; if (e <= 3499) return "B+"; if (e <= 4499) { if (e >= 3500) return "A"; return "A-" } if (e <= 5499) return "A+"; if (e >= 5500) { const s = Math.floor((e - 5500) / 1e3); if (0 === s) return "S"; if (s >= 1 && s <= 30) return `S+${s}`; if (s > 30) return "S+30" } return "範囲外" }

let first = true;

window.player_data;