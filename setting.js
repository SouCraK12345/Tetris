var slider1 = document.getElementById("arr")
var output1 = document.getElementById("arr-label")
output1.innerHTML = slider1.value // 初期値を表示

slider1.oninput = function () {
  output1.innerHTML = this.value
  ARR = this.value;
}

var slider2 = document.getElementById("das")
var output2 = document.getElementById("das-label")
output2.innerHTML = slider2.value

slider2.oninput = function () {
  output2.innerHTML = this.value
  DAS = this.value;
}

var slider3 = document.getElementById("sdf")
var output3 = document.getElementById("sdf-label")
output3.innerHTML = slider3.value

slider3.oninput = function () {
  output3.innerHTML = this.value
  SDF = this.value;
}
var slider4 = document.getElementById("virtualbattle-apm")
var output4 = document.getElementById("virtualbattle-apm-label")
output4.innerHTML = slider4.value

slider4.oninput = function () {
  output4.innerHTML = this.value
  virtualbattle_apm = this.value;
}

function regist_mail() {
  let address = prompt("メールアドレスを入力してください");
  if (address != "") {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "https://script.google.com/macros/s/AKfycbwDKI_-L5Asg5e4wP_vkyWkjop1VCDaFRFgY7S_J7xV5ws0o60DZAr7tWyE0BxguO3v1Q/exec");
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    const body = JSON.stringify({
      username: localStorage["username"],
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

let folder = localStorage["sound_folder"] || "Splatoon";
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
  }else if (folder === "Undertale") {
    folder = "Splatoon";
  }
  localStorage["sound_folder"] = folder;
  updateBgmSources(folder);
}