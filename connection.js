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
    const text = map;
    // try {
    if (user_name) {
        set(ref(db, "messages/" + user_name), {
            message: text,
            next: next,
            hold: hold,
            attack: attack,
            blocks: blocks,
            lines: lines,
            REN: REN,
            score: score,
            start_time: start_time.getTime(),
            time: Date.now()
        });
    }
    // } catch (e) { };
}

function sendRequest(address) {
    // try {
    if (user_name) {
        set(ref(db, "requests/" + address), {
            from: user_name,
            accepted: false,
            time: Date.now()
        });
    }
    window.sendTo = address;
    // } catch (e) { };
}

// 読み込み（リアルタイムで更新）
const msgRef = ref(db, "messages/");
onValue(msgRef, (snapshot) => {
    document.querySelector(".Watch").disabled = false;
    window.cloudData = snapshot.val();
    // const data = snapshot.val();
    // document.getElementById("output").innerText =
    // data ? `${data.message} (${new Date(data.time).toLocaleTimeString()})` : "データなし";
});

const msgRef2 = ref(db, "requests/");
onValue(msgRef2, (snapshot) => {
    var data = snapshot.val();
    for (const key in data) {
        if (Date.now() - data[key].time > 30000) {
            delete data[key];
        }
    }
    window.requests = data;
});

function accept(from, to) {
    // try {
    if (user_name) {
        set(ref(db, "requests/" + from), {
            from: to,
            accepted: true,
            time: Date.now()
        });
        battle_started = true;
        start_match_dialog(from, to);
        closeNotification();
    }

    // } catch (e) { };
}

function start_match_dialog(from, to) {
    document.querySelector(".battle-start").currentTime = 0;
    document.querySelector(".battle-start").play();
    setTimeout(function () {
        document.querySelector(".show-card").currentTime = 0;
        document.querySelector(".show-card").play();
    }, 3800);
    if (from == user_name) {
        enemy_name = to;
    } else {
        enemy_name = from;
    }
    document.querySelector("#MatchUserCardLeft").innerText = user_name;
    document.querySelector("#MatchUserCardRight").innerText = enemy_name;
    document.querySelector(".accept_dialog").close();
    setTimeout(function () {
        let dialog = document.querySelector(".match-start-dialog");
        dialog.classList.add("show");
        let fixed_dialog = document.querySelector(".fixed-background-in-div");
        fixed_dialog.classList.add("show");
    });
    setTimeout(function () {
        let dialog = document.querySelector(".match-start-dialog");
        dialog.classList.add("hide");
    }, 2700)
    setTimeout(vsBoomPlay, 4000)
}
const vsBoomStage = document.getElementById('vsBoom-stage');
const vsBoomText = document.getElementById('vsBoom-text');

function vsBoomPlay() {
    vsBoomStage.classList.remove('animate');
    requestAnimationFrame(() => {
        requestAnimationFrame(() => vsBoomStage.classList.add('animate'));
    });
    vsBoomText.classList.add("show");
    document.querySelector("#MatchUserCardLeft").classList.add("left");
    document.querySelector("#MatchUserCardRight").classList.add("right");
}

function isAccepted(from) {
    try {
        if (window.requests[from].accepted) {
            start_match_dialog(from, user_name);
            battle_started = true;
            return true;
        } else {
            return false;
        }
    } catch (e) {
        return false;
    }
}

let cloudData;
let requests;
let sendTo = null;
let enemy_name = null;


// グローバル関数化
window.sendData = sendData;
window.sendRequest = sendRequest;
window.accept = accept;
window.isAccepted = isAccepted;
window.sendTo = sendTo;