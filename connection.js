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
            hp: isGameover ? 0 : 1,
            time: new Date(getServerTime()).getTime()
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
            time: new Date(getServerTime()).getTime()
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
        if (new Date(getServerTime()).getTime() - data[key].time > 30000) {
            delete data[key];
        }
    }
    window.requests = data;
});

const msgRef3 = ref(db, "rate/");
onValue(msgRef3, (snapshot) => {
    var data = snapshot.val();
    window.rating_data = data;
    console.log("Rating data updated:", data);
    if (user_name) {
        RatingSystem.receive(rating_first ? "first" : null, data);
    }
    rating_first = false;
});

function accept(from, to) {
    if (user_name) {
        set(ref(db, "requests/" + from), {
            from: to,
            accepted: true,
            time: new Date(getServerTime()).getTime()
        });
        battle_started = true;
        start_match_dialog(from, to);
        closeNotification();
    }
}

function start_match_dialog(from, to) {
    back_to_menu();
    document.querySelector(".battle-start").currentTime = 0;
    document.querySelector(".battle-start").play();
    setTimeout(function () {
        document.querySelector(".show-card").currentTime = 0;
        document.querySelector(".show-card").play();
    }, 3800);
    if (from == user_name) {
        window.enemy_name = to;
    } else {
        window.enemy_name = from;
    }
    document.querySelector("#MatchUserCardLeft").innerText = user_name;
    document.querySelector("#MatchUserCardRight").innerText = window.enemy_name;
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
        setTimeout(function () {
            dialog.classList.remove("show");
            dialog.classList.remove("hide");
        }, 1000);
    }, 2700)
    setTimeout(vsBoomPlay, 4000)
    setTimeout(function () {
        document.querySelector("#MatchUserCardRight").classList.add("slideOutToRight");
        document.querySelector("#MatchUserCardRight").classList.remove("right");
        document.querySelector("#MatchUserCardLeft").classList.add("slideOutToLeft");
        document.querySelector("#MatchUserCardLeft").classList.remove("left");
        document.querySelector("#vsBoom-text").classList.remove("show");
        document.querySelector(".battle-start").pause();
        let fixed_dialog = document.querySelector(".fixed-background-in-div");
        fixed_dialog.classList.add("hide");
        setTimeout(function () {
            fixed_dialog.classList.remove("show");
            fixed_dialog.classList.remove("hide");
            fixed_dialog.style.dispaly = "none";
        }, 1000);

        solo = false;
        canvas.style.display = "block";
        RatingSystem.setItem("lose-count", String(Number(RatingSystem.getItem("lose-count")) + 1));
        restart();
        draw();
        setTimeout(function () {
            document.querySelector(".details").style.display = "block";
            start_time = new Date();
            mainloop();
            if (gamemode != "Watch") {
                sendData_interval = setInterval(sendData, 150);
            }
            bgm()
        }, 2000);
    }, 8000);
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
    // try {
        if (window.requests[from].accepted) {
            battle_started = true;
            start_match_dialog(from, user_name);
            set(ref(db, "requests/" + sendTo), {
            });
            return true;
        } else {
            return false;
        }
    // } catch (e) {
    //     return false;
    // }
}

function get_enemy_data() {
    // try {
    let enemy_data = window.cloudData[window.enemy_name];
    damage += enemy_data.attack - last_attack;
    virtual_enemy_hp = enemy_data.hp;
    if (enemy_data.attack - last_attack > 0) {
        waiting_damage = 0;
    }
    last_attack = enemy_data.attack;
    // } catch (e) {
    //     return null;
    // }
}

const RatingSystem = {
    receive: function (e = null, data = null) {
        try {
            localStorage.setItem("win-count", data[user_name]["win-count"]);
            localStorage.setItem("lose-count", data[user_name]["lose-count"]);
            localStorage.setItem("point", data[user_name]["point"]);
            localStorage.setItem("total-point", data[user_name]["total-point"]);
        } catch (error) {
            localStorage.setItem("win-count", "0");
            localStorage.setItem("lose-count", "0");
            localStorage.setItem("point", "0");
            RatingSystem.setItem("total-point", "0");
        }
    },
    getItem: function (key) {
        return localStorage.getItem(key);
    },
    setItem: function (key, value) {
        // clearInterval(receive_interval);
        // receive_interval = setInterval(() => {
        //     RatingSystem.receive();
        // }, 10000);
        localStorage.setItem(key, value);
        // const xhr = new XMLHttpRequest();
        // xhr.open("POST", "https://script.google.com/macros/s/AKfycbwDKI_-L5Asg5e4wP_vkyWkjop1VCDaFRFgY7S_J7xV5ws0o60DZAr7tWyE0BxguO3v1Q/exec");
        // xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        // const body = JSON.stringify({
        //     type: "setValue-challange",
        //     username: user_name,
        //     key: key,
        //     value: value
        // });
        // xhr.send(body);
        set(ref(db, "rate/" + user_name), {
            "win-count": localStorage.getItem("win-count"),
            "lose-count": localStorage.getItem("lose-count"),
            "point": localStorage.getItem("point"),
            "total-point": localStorage.getItem("total-point")
        });
    },
    update: function () {
        if (localStorage["win-count"] >= 5 || localStorage["lose-count"] >= 3) {
            document.querySelector(".challange-result").showModal();
            document.querySelector(".challange-result .win-count").innerText = localStorage["win-count"];
            document.querySelector(".challange-result .lose-count").innerText = localStorage["lose-count"];
            document.querySelector(".challange-result .point").innerText = Math.round(localStorage["point"]) + "pt";
            localStorage.setItem("win-count", "0");
            localStorage.setItem("lose-count", "0");
            localStorage.setItem("total-point", Number(this.getItem("total-point")) + Number(this.getItem("point")));
            this.setItem("point", "0");
        }
        draw_challange();
    }
};

function draw_challange() {
    let win_count = RatingSystem.getItem("win-count")
    let lose_count = RatingSystem.getItem("lose-count")
    let challange_container = document.querySelector(".challange-container")
    challange_container.innerHTML = "";
    for (var i = 0; i < 5; i++) {
        let newElement;
        newElement = document.createElement("img");
        newElement.classList.add("challange-win");
        newElement.src = i < win_count ? "./challange-win.png" : "./challange-not-win.png";
        challange_container.appendChild(newElement);
    }
    for (var i = 0; i < 3; i++) {
        let newElement;
        newElement = document.createElement("img");
        newElement.classList.add("challange-lose");
        newElement.src = i < lose_count ? "./challange-lose.jpg" : "./challange-life.jpg";
        challange_container.appendChild(newElement);
    }
    challange_container.innerHTML += `${Math.round(RatingSystem.getItem("total-point"))}pt ( +${Math.round(RatingSystem.getItem("point"))}pt)`;
    challange_container.classList.add("show");
    setTimeout(() => {
        challange_container.classList.add("hide");
        challange_container.addEventListener("animationend", function () {
            challange_container.classList.remove("show", "hide");
        }, { once: true });
    }, 3000);
}

let cloudData;
let requests;
let rating_data;
let sendTo = null;
let enemy_name = null;
let rating_first = true;

// 時差

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


// グローバル関数化
window.sendData = sendData;
window.sendRequest = sendRequest;
window.accept = accept;
window.isAccepted = isAccepted;
window.sendTo = sendTo;
window.enemy_name = enemy_name;
window.get_enemy_data = get_enemy_data;
window.getServerTime = getServerTime;
window.RatingSystem = RatingSystem;
window.draw_challange = draw_challange;