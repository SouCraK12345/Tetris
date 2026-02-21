
// --- ハンドリング設定の自動保存・復元 ---
const slider1 = document.getElementById("arr");
const output1 = document.getElementById("arr-label");
slider1.value = localStorage.getItem("arr") || slider1.value;
output1.innerHTML = slider1.value;
slider1.oninput = function () {
  output1.innerHTML = this.value;
  ARR = this.value;
  localStorage.setItem("arr", this.value);
};

const slider2 = document.getElementById("das");
const output2 = document.getElementById("das-label");
slider2.value = localStorage.getItem("das") || slider2.value;
output2.innerHTML = slider2.value;
slider2.oninput = function () {
  output2.innerHTML = this.value;
  DAS = this.value;
  localStorage.setItem("das", this.value);
};

const slider3 = document.getElementById("sdf");
const output3 = document.getElementById("sdf-label");
slider3.value = localStorage.getItem("sdf") || slider3.value;
output3.innerHTML = slider3.value;
slider3.oninput = function () {
  output3.innerHTML = this.value;
  SDF = this.value;
  localStorage.setItem("sdf", this.value);
};

// --- VirtualBattle APMの自動保存・復元 ---
const slider4 = document.getElementById("virtualbattle-apm");
const output4 = document.getElementById("virtualbattle-apm-label");
slider4.value = localStorage.getItem("virtualbattle_apm") || slider4.value;
virtualbattle_apm = slider4.value;
output4.innerHTML = slider4.value;
slider4.oninput = function () {
  output4.innerHTML = this.value;
  virtualbattle_apm = this.value;
  localStorage.setItem("virtualbattle_apm", this.value);
};

// --- リトライトグルの自動保存・復元 ---
const retryToggle = document.getElementById("toggle");
const retrySaved = localStorage.getItem("retry_toggle");
if (retrySaved !== null) {
  retryToggle.checked = retrySaved === "true";
}
retryToggle.addEventListener("change", function () {
  localStorage.setItem("retry_toggle", this.checked);
});

const recordToggle = document.getElementById("record_toggle");
const recordSaved = localStorage.getItem("record_toggle");
recordToggle.checked = "true";
if (recordSaved !== null) {
  recordToggle.checked = recordSaved === "true";
}
recordToggle.addEventListener("change", function () {
  localStorage.setItem("record_toggle", this.checked);
});

// --- オンライン通知トグルの自動保存・復元 ---
const notificationToggle = document.getElementById("notification_toggle");
const notificationSaved = localStorage.getItem("notification_toggle");
if (notificationSaved !== null) {
  notificationToggle.checked = notificationSaved === "true";
} else {
  // デフォルトはオン
  notificationToggle.checked = false;
}
notificationToggle.addEventListener("change", function () {
  localStorage.setItem("notification_toggle", this.checked);
  // もしオンにした時に通知許可がなければリクエストする
  if (this.checked && Notification.permission !== "granted" && Notification.permission !== "denied") {
    Notification.requestPermission();
  }
});


const musicStopToggle = document.querySelector("input.stop-music");
const musicStopSaved = localStorage.getItem("music_stop_toggle");
if (musicStopSaved !== null) {
  musicStopToggle.checked = musicStopSaved === "true";
}
musicStopToggle.addEventListener("change", function () {
  localStorage.setItem("music_stop_toggle", this.checked);
});



function regist_mail() {
  let address = prompt("メールアドレスを入力してください");
  if (address != "") {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "https://script.google.com/macros/s/AKfycbwDKI_-L5Asg5e4wP_vkyWkjop1VCDaFRFgY7S_J7xV5ws0o60DZAr7tWyE0BxguO3v1Q/exec");
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    const body = JSON.stringify({
      username: user_name,
      address: address,
      type: "mail_address",
    });
    xhr.onload = () => {
      if (xhr.readyState == 4 && xhr.status == 200) {
        console.log(xhr.responseText);
      }
    };
    xhr.send(body);
    alert("メールアドレスが登録されました");
  }
}

let folder = localStorage["sound_folder"] || "Original";
function updateBgmSources(folderName) {
  const ultra = document.querySelector(".bgm-ultra");
  const battle = document.querySelector(".bgm-battle");
  const virtual = document.querySelector(".bgm-virtualbattle");
  const line40 = document.querySelector(".bgm-40line");
  if (ultra) ultra.src = `${folderName}/bgm-ultra.mp3`;
  if (battle) battle.src = `${folderName}/bgm-battle.mp3`;
  if (virtual) virtual.src = `${folderName}/bgm-virtualbattle.mp3`;
  if (line40) line40.src = `${folderName}/bgm-40line.mp3`;
  document.querySelector(".bgm-button").innerHTML = folder;
}

// updateBgmSources(folder);
// function bgm_change() {
//   if (folder === "なし") {
//     folder = "Undertale";
//   } else if (folder === "Undertale") {
//     folder = "Original";
//   } else if (folder === "Original") {
//     folder = "Splatoon";
//   } else if (folder == "Splatoon") {
//     folder = "なし";
//   }
//   localStorage["sound_folder"] = folder;
//   updateBgmSources(folder);
// }

const gearPowers = [
  "BTB継続",
  "REN回数アップ",
  "おじゃまカット",
  "おじゃま制限",
  "おじゃま直列減少",
  "おじゃま直列追加",
  "おじゃま遅延",
  "スタートダッシュ(アタマ)",
  "テトニンジャ(フク)",
  "テトリス火力アップ",
  "開幕TST",
  "バトルが激化(クツ)",
  "T-Not-Spin有効化(フク)",
  "開幕テトリス"
];

const gearRestrictions = {
  1: ["アタマ"], // ギア1: アタマ
  2: ["フク"],   // ギア2: フク
  3: ["クツ"]    // ギア3: クツ
};


document.querySelectorAll(".gear-row").forEach(row => {
  const index = parseInt(row.querySelector(".gear").dataset.index);
  const select = row.querySelector("select");

  select.innerHTML = `<option value="">（未選択）</option>`;

  gearPowers.forEach(name => {
    // 制限対象のギアパワーは指定スロットのみ
    const restricted = name.match(/\((アタマ|フク|クツ)\)/);
    if (restricted) {
      if (gearRestrictions[index].includes(restricted[1])) {
        const opt = document.createElement("option");
        opt.value = name;
        opt.textContent = name;
        select.appendChild(opt);
      }
    } else {
      // それ以外はどのスロットでも追加
      const opt = document.createElement("option");
      opt.value = name;
      opt.textContent = name;
      select.appendChild(opt);
    }
  });
});

document.querySelectorAll("select").forEach(select => {
  select.addEventListener("change", e => {
    const row = e.target.closest('.gear-row');
    const gearBtn = row.querySelector('.gear');
    const value = e.target.value;
    const index = gearBtn.dataset.index;
    if (value && value !== "") {
      gearBtn.textContent = "";
      gearBtn.style.backgroundImage = `url("gear-power/${value}.png")`;
      gearBtn.style.backgroundSize = "110% 110%";
      gearBtn.style.backgroundRepeat = "no-repeat";
      gearBtn.style.backgroundPosition = "center";
      gearPowers_set[index - 1] = value;
      localStorage.setItem("gearPowers", JSON.stringify(gearPowers_set));
    } else {
      gearBtn.style.backgroundImage = "";
      gearBtn.textContent = index;
      gearPowers_set[index - 1] = "";
      localStorage.setItem("gearPowers", JSON.stringify(gearPowers_set));
    }
  });
});

const gears = document.querySelectorAll(".gear");
gears.forEach(gear => {
  gear.addEventListener("click", () => {
    gears.forEach(g => g.classList.remove("active"));
    gear.classList.add("active");
  });
});


// ギアパワーのリストをローカルストレージから取得(リスト配列)
let gearPowers_set = ["", "", ""];
try {
  gearPowers_set = JSON.parse(localStorage.getItem("gearPowers")) || [];
  // ギアパワーのリストを各セレクトボックスに追加
  for (let i = 0; i < 3; i++) {
    const gearPower = gearPowers_set[i];
    if (gearPower) {
      document.querySelector(`div:nth-child(${i + 1}) > select`).value = gearPower;
      const gearBtn = document.querySelector(`.gear[data-index="${i + 1}"]`);
      gearBtn.textContent = "";
      gearBtn.style.backgroundImage = `url("gear-power/${gearPower}.png")`;
      gearBtn.style.backgroundSize = "110% 110%";
      gearBtn.style.backgroundRepeat = "no-repeat";
      gearBtn.style.backgroundPosition = "center";
    }
  }
} catch (e) {
  console.error(e)
}



// IndexedDB初期化
let db;
const dbName = "MusicDB";
const storeName = "musicFiles";

function initDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: "id" });
      }
    };
  });
}

function saveToIndexedDB(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const transaction = db.transaction([storeName], "readwrite");
      const store = transaction.objectStore(storeName);
      const id = file.name;
      const musicData = {
        id: id,
        name: file.name,
        blob: reader.result,
        type: file.type
      };
      const request = store.put(musicData);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });
}

function loadFromIndexedDB() {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], "readonly");
    const store = transaction.objectStore(storeName);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function clearIndexedDB() {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], "readwrite");
    const store = transaction.objectStore(storeName);
    const request = store.clear();

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

function loadMusicList(music_list) {
  const el_music_list = document.querySelector("#music-list");
  el_music_list.innerHTML = "";
  const music_name_list = music_list.map(x => x.name);
  for (var i of music_name_list) {
    const el = document.createElement("li");
    el.innerHTML = i.replace(/\.[^/.]+$/, "");
    el_music_list.appendChild(el);
    el.addEventListener("click", ((musicName) => {
      return () => {
        playing_music = true;
        const audios = document.querySelectorAll("audio");
        audios.forEach(audio => {
          if (audio.getAttribute("data-title") === musicName.replace(/\.[^/.]+$/, "")) {
            audio.currentTime = 0;
            audio.play();
            console.log("Playing:", musicName);
            document.querySelector("#music-title").innerText = `♪ ${musicName.replace(/\.[^/.]+$/, "")}`;
            setTimeout(() => {
              document.querySelector("#music-title").innerText = "";
            }, 5000);
          } else {
            audio.pause();
          }
        });
      };
    })(i));
  }

  document.querySelectorAll("#audioList > audio").forEach(audio => {
    audio.addEventListener("ended", () => {
      play_random_music();
    });
  });
}

function play_random_music() {
  const el_music_list = document.querySelectorAll("#music-list li");
  if (el_music_list.length > 0) {
    const random_index = Math.floor(Math.random() * el_music_list.length);
    playing_music = true;
    el_music_list[random_index].click();
  }
}

function renderAudio(musicData) {
  const audioList = document.getElementById("audioList");
  const blob = new Blob([musicData.blob], { type: musicData.type });
  const url = URL.createObjectURL(blob);

  const label = document.createElement("p");
  label.textContent = musicData.name.replace(/\.[^/.]+$/, "");

  const audio = document.createElement("audio");
  audio.controls = true;
  audio.src = url;
  audio.classList.add("music-item");
  audio.setAttribute("data-title", musicData.name.replace(/\.[^/.]+$/, ""));

  audioList.appendChild(label);
  audioList.appendChild(audio);
}

const folderInput = document.getElementById("folderInput");
const audioList = document.getElementById("audioList");

folderInput.addEventListener("change", async () => {
  // 前回のデータを破棄
  try {
    await clearIndexedDB();
  } catch (error) {
    console.error("Error clearing IndexedDB:", error);
  }

  audioList.innerHTML = "";
  const audioFiles = [...folderInput.files].filter(file => file.type.startsWith("audio/"));

  // ファイルをIndexedDBに保存
  for (const file of audioFiles) {
    try {
      await saveToIndexedDB(file);
    } catch (error) {
      console.error("Error saving file to IndexedDB:", error);
    }
  }

  // 保存したファイルを読み込んで表示
  const savedMusic = await loadFromIndexedDB();
  savedMusic.forEach(musicData => renderAudio(musicData));
  loadMusicList(savedMusic);
});

// ページロード時に保存された曲を復元
document.addEventListener("DOMContentLoaded", async () => {
  try {
    await initDB();
    const savedMusic = await loadFromIndexedDB();
    if (savedMusic.length > 0) {
      savedMusic.forEach(musicData => renderAudio(musicData));
      loadMusicList(savedMusic);
      console.log("Loaded", savedMusic.length, "music files from storage");
    }
  } catch (error) {
    console.error("Error loading from IndexedDB:", error);
  }
});