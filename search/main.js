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


set(ref(db, "load/"), {
    time: new Date(getServerTime()).getTime()
});

function get_user_rate_data(bool = false){
    const url = "https://script.google.com/macros/s/AKfycbwDKI_-L5Asg5e4wP_vkyWkjop1VCDaFRFgY7S_J7xV5ws0o60DZAr7tWyE0BxguO3v1Q/exec";
    const payload = {
      type: "get_rate",
    };
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded" // GASはJSON型で送るとCORSエラーが出やすい場合があります。この形式推奨です。
        // または "Content-Type": "application/json" で送り、GAS側で JSON.parse(e.postData.contents) する方法もあります。
      },
      body: JSON.stringify(payload)
    })
    .then(response => response.json())
      .then(res_data => {
        if(bool){
            document.querySelector(".init").classList.add("fadeout");
            document.querySelector(".init").addEventListener("animationend", function () {
                document.querySelector(".init").style.display = "none";
            }, { once: true });
            let data = {};
            for(let i of res_data){
                data[i[0]] = {
                    Sranker: i[7],
                    "total-point": i[6],
                    point: i[5],
                    image: window.player_data[i[0]] ? window.player_data[i[0]].image : "",
                };
            }
            // "total-point"でソート
            const sortedKeys = Object.keys(data).sort((a, b) => data[b]["total-point"] - data[a]["total-point"]);
            let interval = 0;
            for (var i of sortedKeys) {
                interval += 25;
                if (i == "undefined" || i == "null") {
                    continue;
                }
                let i_copy = i;
                setTimeout(function () {
                    let child = document.createElement("div");
                    // wrapper div — inner .user-block is used for layout
                    child.innerHTML = `
                        <div class="user-block">
                            <div class="user-name">${i_copy}</div>
                            <div class="user-point">${Math.round(data[i_copy]["total-point"])}pt</div>
                            <div class="user-rank">${getRank(data[i_copy]["total-point"])}</div>
                        </div>
                    `
                    child.querySelector(".user-block").style.backgroundColor = window.active_list.includes(i_copy) ? "#55925aff" : "#424452"
                    child.addEventListener("click", function () {
                        document.querySelector(".show-chat").style.display = "block";
                        document.querySelector("iframe").style.display = "none";
                        document.querySelector(".show-chat").style.display = localStorage["user_name"] == undefined ? "none" : "block";
                        document.querySelector(".user-data-container").classList.add("show");
                        let name = this.querySelector("div.user-name").innerHTML;
                        document.querySelector(".image-tile").style.backgroundImage = `url(${data[name]["image"]})`;
                        document.querySelector(".user-name-label").innerHTML = name;
                        document.querySelector(".rank").innerHTML = getRank(data[name]["total-point"]);
                        document.querySelector(".point").innerHTML = `${Math.round(data[name]["total-point"])}pt (${data[name]["point"] >= 0 ? "+" : ""}${Math.round(data[name]["point"])}pt)`;
                        document.querySelector(".online").style.display = window.active_list.includes(name) ? "inline-block" : "none";
                    })
                    document.querySelector(".user-container").appendChild(child);
                    // If there's an active search query, re-apply filtering so newly added items respect it
                    if (typeof filterUsers === "function") {
                        const input = document.getElementById('user-search');
                        filterUsers(input ? input.value : "");
                    }
                }, interval)
            }
        }
    })
    .catch(error => console.error("Error:", error));
    setTimeout(get_user_rate_data, 10000);
}

get_user_rate_data(true);

const msgRef = ref(db, "rate/");
onValue(msgRef, (snapshot) => {
    if (first) {
        window.player_data = snapshot.val();
        let data = window.player_data;
        console.log(data);
    }
    first = false;
});

// 検索機能: user-container 内のラッパー要素を表示/非表示にする
function filterUsers(query) {
    if (!query) query = "";
    const q = query.trim().toLowerCase();
    const wrappers = document.querySelectorAll('.user-container > div');
    wrappers.forEach(wrapper => {
        const nameEl = wrapper.querySelector('.user-name');
        const name = nameEl ? nameEl.textContent.trim().toLowerCase() : '';
        const matches = q === '' || name.indexOf(q) !== -1;
        wrapper.style.display = matches ? '' : 'none';
    });
}

// 検索入力イベントの登録（DOM上に要素があれば）
const searchInput = document.getElementById('user-search');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        filterUsers(e.target.value);
    });
}
const searchClear = document.getElementById('search-clear');
if (searchClear) {
    searchClear.addEventListener('click', () => {
        if (searchInput) {
            searchInput.value = '';
            filterUsers('');
            searchInput.focus();
        }
    });
}

function show_chat() {
    document.querySelector(".show-chat").style.display = "none"
    document.querySelector("iframe").style.display = "block"
    document.querySelector("iframe").src = "../chat.html?to=" + document.querySelector(".user-name-label").innerHTML;
}

function getRank(e) { if (e < 0) return "範囲外"; if (e <= 299) return "C-"; if (e <= 699) return "C"; if (e <= 1199) return "C+"; if (e <= 1799) return "B-"; if (e <= 2499) return "B"; if (e <= 3499) return "B+"; if (e <= 4499) { if (e >= 3500) return "A"; return "A-" } if (e <= 5499) return "A+"; if (e >= 5500) { const s = Math.floor((e - 5500) / 1e3); if (0 === s) return "S"; if (s >= 1 && s <= 30) return `S+${s}`; if (s > 30) return "S+30" } return "範囲外" }

let first = true;

function send_active() {
    set(ref(db, "active/" + localStorage["user_name"]), {
        date: new Date(getServerTime()).getTime(),
    });
}

if (localStorage["user_name"]) {
    setInterval(send_active, 60000)
    send_active();
}

// ----- アクティブユーザーのリスト化（表示はしない） -----
// window.active_users: Firebase の生データ（{ name: timestamp, ... }）
// window.active_list: getServerTime() を基準に "最近" アクティブなユーザー名の配列
// 閾値: 2分 (120000ms)
window.active_users = {};
window.active_list = [];

// Firebase の active/ を監視して window に保存する
const activeRef = ref(db, "active/");
onValue(activeRef, (snap) => {
    const raw = snap.val() || {};
    window.active_users = raw;

    // 最近アクティブ（2分以内）を抽出
    const THRESH = 2 * 60 * 1000; // 2分
    const now = getServerTime();
    const list = [];
    for (const [name, obj] of Object.entries(raw)) {
        // obj: {date: timestamp} 形式
        const t = obj && typeof obj.date === 'number' ? obj.date : Number(obj && obj.date);
        if (!Number.isNaN(t) && (now - t) <= THRESH) {
            list.push(name);
        }
    }
    // 安定表示のためソート（任意: 名前順）
    list.sort();
    window.active_list = list;
    document.querySelector(".online").style.display = window.active_list.includes(document.querySelector(".user-name-label").innerHTML) ? "inline-block" : "none";
    // --- l66の処理を全ユーザーブロックに反映 ---
    const userBlocks = document.querySelectorAll('.user-block');
    userBlocks.forEach(block => {
        const nameEl = block.querySelector('.user-name');
        const name = nameEl ? nameEl.textContent : '';
        block.style.backgroundColor = window.active_list.includes(name) ? "#55925aff" : "#424452";
    });
});

// 簡易 API: 現在のアクティブユーザー配列を返す
function getActiveUsers() {
    return Array.isArray(window.active_list) ? window.active_list.slice() : [];
}
window.getActiveUsers = getActiveUsers;

window.player_data;
window.show_chat = show_chat;