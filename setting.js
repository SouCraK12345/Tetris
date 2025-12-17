
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

function regist_mail() {
  let address = prompt("メールアドレスを入力してください");
  if (address != "") {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "https://script.google.com/macros/s/AKfycbwDKI_-L5Asg5e4wP_vkyWkjop1VCDaFRFgY7S_J7xV5ws0o60DZAr7tWyE0BxguO3v1Q/exec");
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    const body = JSON.stringify({
      username: localStorage["user_name"],
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

updateBgmSources(folder);
function bgm_change() {
  if (folder === "Splatoon") {
    folder = "Undertale";
  } else if (folder === "Undertale") {
    folder = "Original";
  } else if (folder === "Original") {
    folder = "Splatoon";
  }
  localStorage["sound_folder"] = folder;
  updateBgmSources(folder);
}

const gearPowers = [
  "BTB継続",
  "REN回数アップ",
  "おじゃまカット",
  "おじゃま制限",
  "おじゃま直列減少",
  "おじゃま直列追加",
  "おじゃま遅延",
  "シンプルスタート(アタマ)",
  "テトニンジャ(フク)",
  "テトリス火力アップ",
  "開幕TST",
  "バトルが激化(クツ)"
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