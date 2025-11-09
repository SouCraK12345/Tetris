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
            attack2: attack2,
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
    if (user_name) {
        RatingSystem.receive(rating_first ? "first" : null, data);
    }
    rating_first = false;
});

function accept(from, to) {
    if (user_name) {
        RatingSystem.update();
        battle_started = true;
        back_to_menu();
        gamemode = "Battle";
        set(ref(db, "requests/" + from), {
            from: to,
            accepted: true,
            time: new Date(getServerTime()).getTime()
        });
        start_match_dialog(from, to);
        closeNotification();
    }
}

function start_match_dialog(from, to) {
    console.log("Start match between " + from + " and " + to);
    back_to_menu();
    gamemode = "Battle";
    document.querySelector(".battle-start").currentTime = 0;
    document.querySelector(".battle-start").play();
    setTimeout(function () {
        document.querySelector(".show-card").currentTime = 0;
        document.querySelector(".show-card").play();
    }, 3800);
    if (from == user_name) {
        window.enemy_name = to;
    } else {
        document.querySelector(".reBattle").style.display = "block";
        window.enemy_name = from;
    }
    document.querySelector("#MatchUserCardRight").style.backgroundImage = `url(${image_url_dict && image_url_dict[window.enemy_name] ? image_url_dict[window.enemy_name] : ""})`;
    document.querySelector("#MatchUserCardRight").style.backgroundSize = "cover";
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
        set(ref(db, "requests/" + window.sendTo), {});
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
        for(var key in data){
            if(data[key]["image"] && (!image_url_dict || !image_url_dict[key])){
                if(!image_url_dict) image_url_dict = {};
                image_url_dict[key] = data[key]["image"];
            }
            console.log(image_url_dict);
        }

        const keys = ["win-count", "lose-count", "point", "total-point", "Sranker", "image"];
        const userData = data && data[user_name] ? data[user_name] : null;

        if (userData) {
            keys.forEach((k) => {
                try {
                    const v = userData[k];
                    if (v === undefined || v === null) {
                        localStorage.setItem(k, "0");
                    } else {
                        localStorage.setItem(k, String(v));
                    }
                } catch (err) {
                    localStorage.setItem(k, "0");
                }
            });
        } else {
            keys.forEach((k) => localStorage.setItem(k, "0"));
        }
        if (e == "first") {
            this.update();
        }
        if(localStorage["image"] != "0"){
            document.querySelector("#MatchUserCardLeft").style.backgroundImage = `url(${localStorage["image"]})`;
            document.querySelector("#MatchUserCardLeft").style.backgroundSize = "cover";
        }
        this.setItem();
    },
    getItem: function (key) {
        return localStorage.getItem(key);
    },
    setItem: function (key = null, value = null) {
        // clearInterval(receive_interval);
        // receive_interval = setInterval(() => {
        //     RatingSystem.receive();
        // }, 10000);
        if (key === null || value === null) { } else {
            localStorage.setItem(key, value);
        }
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
            "total-point": localStorage.getItem("total-point"),
            "Sranker": localStorage.getItem("Sranker"),
            "image": localStorage.getItem("image")
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
            this.setItem("point", (-convertGradeToPoints(getRank(localStorage["total-point"]))).toString());
        }
        document.querySelector("label.rank").innerHTML = getRank(localStorage.getItem("total-point"));
        document.querySelector("label.point").innerHTML = `${Math.round(localStorage.getItem("total-point"))}pt(${Math.round(localStorage.getItem("point")) >= 0 ? "+" : ""}${Math.round(localStorage.getItem("point"))}pt)`;
        draw_challange();
    }
};
function getRank(e) { if (e < 0) return "範囲外"; if (e <= 299) return "C-"; if (e <= 699) return "C"; if (e <= 1199) return "C+"; if (e <= 1799) return "B-"; if (e <= 2499) return "B"; if (e <= 3499) return "B+"; if (e <= 4499) { if (e >= 3500) return "A"; return "A-" } if (e <= 5499) return "A+"; if (e >= 5500) { const s = Math.floor((e - 5500) / 1e3); if (0 === s) return "S"; if (s >= 1 && s <= 30) return `S+${s}`; if (s > 30) return "S+30" } return "範囲外" }
function convertGradeToPoints(e) { return e = e.toUpperCase(), e.startsWith("S") ? 150 : "A-" === e || "A" === e || "A+" === e ? 100 : "B-" === e || "B" === e || "B+" === e ? 50 : "C-" === e || "C" === e || "C+" === e ? 0 : -1 }

if(localStorage.getItem("Sranker") == "1"){
    document.querySelector("body").style.background = "lightblue";
}

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
    challange_container.innerHTML += `${Math.round(RatingSystem.getItem("total-point"))}pt ( ${Math.round(localStorage.getItem("point")) >= 0 ? "+" : ""}${Math.round(RatingSystem.getItem("point"))}pt)`;
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
let image_url_dict = null;

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
window.getRank = getRank;