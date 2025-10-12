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