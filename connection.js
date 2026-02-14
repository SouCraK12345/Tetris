const owner = "SouCraK12345";    // ←リポジトリのオーナー名
const repo = "Tetris"; // ←リポジトリ名

// GitHub issues の新着チェック（ページを開くごとに実行）
async function checkNewIssues() {
    try {
        const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues?state=closed`);
        if (!res.ok) {
            console.error(`GitHub API error: ${res.status}`);
            return;
        }
        const data = await res.json();
        // issue 番号の配列
        const fetchedNumbers = data.map(i => i.number);

        // 既知の issue を localStorage から取得
        const knownJson = localStorage.getItem('known_issues');
        if (!knownJson) {
            // 初回は基準として保存して通知は出さない
            localStorage.setItem('known_issues', JSON.stringify(fetchedNumbers));
            return;
        }
        let known = [];
        try {
            known = JSON.parse(knownJson) || [];
        } catch (e) {
            known = [];
        }

        // 新しい issue を検出
        const newNums = fetchedNumbers.filter(n => !known.includes(n));
        if (newNums.length > 0) {
            const newIssues = data.filter(i => newNums.includes(i.number));
            showIssueDialog(newIssues);
            // 既知リストを更新して保存
            const merged = Array.from(new Set([...known, ...fetchedNumbers]));
            localStorage.setItem('known_issues', JSON.stringify(merged));
        }
        // デバッグログ
        data.forEach(issue => console.log(`#${issue.number}: ${issue.title}`));
    } catch (err) {
        console.error(err);
    }
}

function showIssueDialog(issues) {
    // シンプルなダイアログを動的に生成して表示
    const dialog = document.createElement('dialog');
    dialog.className = 'issue-notice-dialog';
    const title = document.createElement('h3');
    title.innerText = `${issues.length}件のプログラムが更新されました。`;
    dialog.appendChild(title);

    const list = document.createElement('ul');
    issues.forEach(issue => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = issue.html_url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.innerText = `#${issue.number}: ${issue.title}`;
        li.appendChild(a);
        list.appendChild(li);
    });
    dialog.appendChild(list);

    const btn = document.createElement('button');
    btn.innerText = '閉じる';
    btn.addEventListener('click', () => {
        try { dialog.close(); } catch (e) { }
        dialog.remove();
    });
    dialog.appendChild(btn);

    document.body.appendChild(dialog);
    // showModal が使える場合はモーダル表示
    try {
        dialog.showModal();
    } catch (e) {
        alert(`新しいIssueが ${issues.length} 件あります`);
    }
}

// ページ読み込み時にチェック
checkNewIssues();



// Firebase SDK 読み込み (サーバー2)
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyC_57psiQlniIFwp4BpALqoi483WFq75nA",
    authDomain: "online-tetris-souki-server2.firebaseapp.com",
    projectId: "online-tetris-souki-server2",
    storageBucket: "online-tetris-souki-server2.firebasestorage.app",
    messagingSenderId: "228868946372",
    appId: "1:228868946372:web:0f45222c93467a021e8c91"
};

// Firebase初期化
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// 書き込み（例: ボタン押したら送信）
function sendData() {
    let text = map;
    if (gearPowers_set.filter(x => x === "テトニンジャ(フク)").length > 0) {
        // 配列内をすべて9に置換
        text = map.map(row => 9);
    }
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
        // set(ref(db, "requests/" + address), {
        //     from: user_name,
        //     accepted: false,
        //     time: new Date(getServerTime()).getTime()
        // });
        fetch("https://script.google.com/macros/s/AKfycbwDKI_-L5Asg5e4wP_vkyWkjop1VCDaFRFgY7S_J7xV5ws0o60DZAr7tWyE0BxguO3v1Q/exec", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: JSON.stringify({
                type: "create_match",
                to: address,
                username: user_name
            })
        }).then(response => response.text()).then(data => {
            battle_id = data;
        });
    }
    window.sendTo = address;
    // } catch (e) { };
}

// 読み込み（リアルタイムで更新）
const msgRef = ref(db, "messages/");
onValue(msgRef, (snapshot) => {
    if (document.querySelector(".Watch")) document.querySelector(".Watch").disabled = false;
    window.cloudData = snapshot.val();
});

// const msgRef2 = ref(db, "requests/");
// onValue(msgRef2, (snapshot) => {
//     var data = snapshot.val();
//     for (const key in data) {
//         if (new Date(getServerTime()).getTime() - data[key].time > 30000) {
//             delete data[key];
//         }
//     }
//     window.requests = data;
// });

function get_match_data(bool = false) {
    if (stop_getting_match_data) return;
    try {
        fetch("https://script.google.com/macros/s/AKfycbwDKI_-L5Asg5e4wP_vkyWkjop1VCDaFRFgY7S_J7xV5ws0o60DZAr7tWyE0BxguO3v1Q/exec", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: JSON.stringify({
                type: "get_match",
                username: user_name
            })
        }).then(response => response.json()).then(data => {
            let count = -1;
            data.forEach(match => {
                count += 1;
                if (matched_list.includes(match[0])) {
                    return;
                }
                if (gamemode == "Battle" && match[0] == battle_id) {
                    return;
                }
                if (match[0] == battle_id && match[2] == user_name && match[3]) {
                    rejected_list.push(match[0]);
                    setTimeout(() => {
                        start_match_dialog(match[1], match[2]);
                        stop_getting_match_data = false;
                        matched_list.push(match[0]);
                    }, match_start_date - Date.now())
                    console.log(match_start_date - Date.now());
                    showMatchMaking()
                    stop_getting_match_data = true;
                    return;
                }
                if (match[0] == battle_id && match[1] == user_name && match[4]) {
                    fetch("https://script.google.com/macros/s/AKfycbwDKI_-L5Asg5e4wP_vkyWkjop1VCDaFRFgY7S_J7xV5ws0o60DZAr7tWyE0BxguO3v1Q/exec", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        },
                        body: JSON.stringify({
                            type: "accept",
                            id: battle_id,
                            username: user_name
                        })
                    }).then(response => response.text()).then(data => {
                        setTimeout(() => {
                            start_match_dialog(match[1], match[2]);
                            stop_getting_match_data = false;
                            matched_list.push(match[0]);
                        }, data - Date.now())
                        console.log(data);
                        showMatchMaking()
                    });
                    rejected_list.push(match[0]);
                    stop_getting_match_data = true;
                    return;
                }
                if (rejected_list.includes(match[0])) {
                    return;
                }
                if (bool) {
                    rejected_list.push(match[0]);
                    return;
                }
                requests[match[2]] = {
                    from: match[1],
                    id: match[0],
                };
            });
        });
    } catch (e) {
    }
}
let stop_getting_match_data = false;
setInterval(get_match_data, 5000);
get_match_data(true);
let match_start_date = 0;

const msgRef3 = ref(db, "rate/");
onValue(msgRef3, (snapshot) => {
    var data = snapshot.val();
    window.rating_data = data;
    if (user_name) {
        RatingSystem.receive(rating_first ? "first" : null, data);

        if (localStorage.getItem("Sranker") == "1") {
            document.querySelector("body").style.background = "#add8e6a6";
        }
    }
    rating_first = false;
});

function accept() {
    if (user_name) {
        fetch("https://script.google.com/macros/s/AKfycbwDKI_-L5Asg5e4wP_vkyWkjop1VCDaFRFgY7S_J7xV5ws0o60DZAr7tWyE0BxguO3v1Q/exec", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: JSON.stringify({
                type: "accept",
                id: requests[user_name].id,
                username: user_name
            })
        }).then(response => response.text()).then(data => {
            match_start_date = data;
        });
        battle_id = requests[user_name].id;
        close_accept();
        showMatchMaking();
    }
}

function start_match_dialog(from, to) {
    document.querySelectorAll(".music-item").forEach((element) => {
        element.pause();
    });
    playing_music = false;
    console.log("Start match between " + from + " and " + to);
    gamemode = "Battle";
    window.gamemode = "Battle";
    document.querySelector("body > div.header > div.match-making").classList.remove("show");
    stop = true;
    back_to_menu(false);
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
    document.querySelector("#MatchUserCardLeft").innerHTML = user_name + "<br>" + Math.round(RatingSystem.getItem("total-point")) + "pt";
    document.querySelector("#MatchUserCardRight").innerHTML = window.enemy_name + "<br>" + (RateDict && RateDict[window.enemy_name] ? RateDict[window.enemy_name] : "0") + "pt";
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
        waiting_damage = -300;
        solo = false;
        canvas.style.display = "block";
        RatingSystem.setItem("lose-count", String(Number(RatingSystem.getItem("lose-count")) + 1));
        restart();
        draw();
        show_iframe();
        document.querySelector("p.ready").style.display = "block";
        document.querySelector("canvas.battle-start").style.display = "block";
        setTimeout(function () {
            battle_start_update();
            document.querySelector("canvas#tetris").classList.add("show");
            document.querySelector(".launch").play();
            document.querySelector(".details").style.display = "block";
            start_time = new Date();
            mainloop();
            if (gamemode != "Watch") {
                sendData_interval = setInterval(sendData, 750);
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

function get_enemy_data() {
    if (gamemode != "Battle") return;
    try {
        let enemy_data = window.cloudData[window.enemy_name];
        if (enemy_data != window.last_enemy_data) {
            window.update_frame = 0;
        }
        window.last_enemy_data = enemy_data;
        virtual_enemy_hp = enemy_data.hp;
        if (enemy_data < 0) {
            return null;
        }
        if (enemy_data.attack - last_attack > 0) {
            if (window.damage == 0) {
                waiting_damage = 0;
            }
        }
        damage += (enemy_data.attack - last_attack) * (1 + gearPowers_set.filter(x => x === "バトルが激化(クツ)").length * 0.2);
        last_attack = enemy_data.attack;
    } catch (e) {
        return null;
    }
}

const RatingSystem = {
    receive: function (e = null, data = null) {
        SrankerList = [];
        RateDict = {};
        for (var key in data) {
            if (data[key]["image"] && (!image_url_dict || !image_url_dict[key])) {
                if (!image_url_dict) image_url_dict = {};
                image_url_dict[key] = data[key]["image"];
            }
            if (data[key]["Sranker"] == "1") {
                SrankerList.push(key)
            }
            RateDict[key] = data[key]["total-point"];
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
        if (localStorage["image"] != "0") {
            document.querySelector("#MatchUserCardLeft").style.backgroundImage = `url(${localStorage["image"]})`;
            document.querySelector("#MatchUserCardLeft").style.backgroundSize = "cover";
        }
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
let rating_data;
let sendTo = null;
let enemy_name = "";
let rating_first = true;
let image_url_dict = null;
let update_frame = 0;
let last_enemy_data;

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


function send_active() {
    set(ref(db, "active/" + localStorage["user_name"]), {
        date: new Date(getServerTime()).getTime(),
    });
}

if (localStorage["user_name"]) {
    setInterval(send_active, 5000)
    send_active();
}


window.active_users = {};
window.active_list = [];

// Firebase の active/ を監視して window に保存する
const activeRef = ref(db, "active/");
onValue(activeRef, (snap) => {
    const raw = snap.val() || {};
    window.active_users = raw;
    const THRESH = 10000; // 10秒
    const now = getServerTime();
    const list = [];
    for (const [name, obj] of Object.entries(raw)) {
        // obj: {date: timestamp} 形式
        const t = obj && typeof obj.date === 'number' ? obj.date : Number(obj && obj.date);
        if (!Number.isNaN(t) && (now - t) <= THRESH) {
            list.push(name);
        }
    }
    active_list = list;
});

function getActiveUsers() {
    return Array.isArray(window.active_list) ? window.active_list.slice() : [];
}
window.getActiveUsers = getActiveUsers;


// グローバル関数化
window.sendData = sendData;
window.sendRequest = sendRequest;
window.accept = accept;
// window.isAccepted = isAccepted;
window.sendTo = sendTo;
window.enemy_name = enemy_name;
window.get_enemy_data = get_enemy_data;
window.getServerTime = getServerTime;
window.RatingSystem = RatingSystem;
window.draw_challange = draw_challange;
window.getRank = getRank;
window.update_frame = update_frame;
window.SrankerList = [];
window.RateDict = [];
window.start_match_dialog = start_match_dialog;