const RatingSystem = {
    receive: function (e = null) {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "https://script.google.com/macros/s/AKfycbwDKI_-L5Asg5e4wP_vkyWkjop1VCDaFRFgY7S_J7xV5ws0o60DZAr7tWyE0BxguO3v1Q/exec");
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        const body = JSON.stringify({
            type: "getValue-challange",
            username: user_name,
        });
        xhr.onload = () => {
            if (xhr.readyState == 4 && xhr.status == 200) {
                const response = JSON.parse(xhr.responseText);
                localStorage.setItem("win-count", response[0]);
                localStorage.setItem("lose-count", response[1]);
                localStorage.setItem("point", response[2]);
                localStorage.setItem("total-point", response[3]);
                if (e == "first") {
                    this.update();
                }
            } else {
                alert(`Error: ${xhr.status}`);
            }
        };
        xhr.send(body);
    },
    getItem: function (key) {
        return localStorage.getItem(key);
    },
    setItem: function (key, value) {
        clearInterval(receive_interval);
        receive_interval = setInterval(() => {
            RatingSystem.receive();
        }, 10000);
        localStorage.setItem(key, value);
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "https://script.google.com/macros/s/AKfycbwDKI_-L5Asg5e4wP_vkyWkjop1VCDaFRFgY7S_J7xV5ws0o60DZAr7tWyE0BxguO3v1Q/exec");
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        const body = JSON.stringify({
            type: "setValue-challange",
            username: user_name,
            key: key,
            value: value
        });
        xhr.send(body);
    },
    update: function () {
        if (localStorage["win-count"] >= 5 || localStorage["lose-count"] >= 3) {
            document.querySelector(".challange-result").showModal();
            document.querySelector(".challange-result .win-count").innerText = localStorage["win-count"];
            document.querySelector(".challange-result .lose-count").innerText = localStorage["lose-count"];
            document.querySelector(".challange-result .point").innerText = Math.round(localStorage["point"]) + "pt";
            this.setItem("win-count", "0");
            this.setItem("lose-count", "0");
            this.setItem("total-point", Number(this.getItem("total-point")) + Number(this.getItem("point")));
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
let receive_interval;
document.addEventListener("DOMContentLoaded", () => {
    if (!user_name) return;
    receive_interval = setInterval(() => {
        RatingSystem.receive();
    }, 10000);
    RatingSystem.receive("first");
});
if (!(RatingSystem.getItem("win-count") && RatingSystem.getItem("lose-count") && RatingSystem.getItem("point") && RatingSystem.getItem("total-point"))) {
    RatingSystem.setItem("win-count", "0");
    RatingSystem.setItem("lose-count", "0");
    RatingSystem.setItem("point", "0");
    RatingSystem.setItem("total-point", "0");
}