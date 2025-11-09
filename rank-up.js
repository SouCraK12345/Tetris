const ruCanvas = document.getElementById('confettiCanvas');
const ruCtx = ruCanvas.getContext('2d');
ruResize();
window.addEventListener('resize', ruResize);

let ruConfetti = [];
const ruColors = ['#ff0', '#f0f', '#0ff', '#fff', '#fc0', '#0f0', '#f00'];

function ruResize() {
    ruCanvas.width = window.innerWidth;
    ruCanvas.height = window.innerHeight;
}

class RuConfetto {
    constructor(x, y, color, velocity) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 6 + 4;
        this.color = color;
        this.vx = velocity.x;
        this.vy = velocity.y;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.2;
        this.lifetime = 600;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.rotation += this.rotationSpeed;
        this.vy += 0.05;
        this.lifetime--;
    }
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        ctx.restore();
    }
}

function ruBurst() {
    const ruCount = 400;
    for (let i = 0; i < ruCount; i++) {
        const x = Math.random() * ruCanvas.width;
        const y = ruCanvas.height;
        const color = ruColors[Math.floor(Math.random() * ruColors.length)];
        const angle = Math.random() * 10;
        const speed = Math.random() * 8 + 4;
        const velocity = {
            x: Math.cos(angle) * speed,
            y: Math.sin(angle) * speed * -1
        };
        ruConfetti.push(new RuConfetto(x, y, color, velocity));
    }
}

function ruAnimate() {
    ruCtx.clearRect(0, 0, ruCanvas.width, ruCanvas.height);
    ruConfetti.forEach((c, i) => {
        c.update();
        c.draw(ruCtx);
        if (c.lifetime <= 0 || c.y > ruCanvas.height + 50) ruConfetti.splice(i, 1);
    });
    requestAnimationFrame(ruAnimate);
}

let ruPointFrame = 0;
document.querySelector(".rank-up-container").style.display = "none";
document.querySelector(".center-text").style.display = "none";
document.querySelector("#confettiCanvas").style.display = "none";
document.querySelector("body > div.rank-up-container > table > tbody > tr > td.win-count").innerHTML = localStorage["win-count"];
document.querySelector("body > div.rank-up-container > table > tbody > tr > td.lose-count").innerHTML = localStorage["lose-count"];
document.querySelector(".rank-up-total-point").innerHTML = Math.round(localStorage["total-point"]) + "pt";
document.querySelector(".rank-up-point").innerHTML = "+" + Math.round(localStorage["point"]) + "pt";
document.querySelector("table").style.display = "table";
function ruAnimationStart() {
    document.querySelector("body").style.backgroundColor = "lightblue";
    document.querySelector(".rank-up-table").style.display = "table";
    document.querySelector(".rank-up-sound").play();
    setTimeout(() => {
        document.querySelector("body > div.rank-up-container > table > tbody > tr > td.win-count").style.color = "#ffffff";
    }, 200);
    setTimeout(() => {
        document.querySelector("body > div.rank-up-container > table > tbody > tr > td.lose-count").style.color = "#ffffff";
    }, 1750);
    setTimeout(() => {
        document.querySelector(".rank-up-total-point").style.color = "#ffffff";
        document.querySelector(".rank-up-point").style.color = "#ffffff";
    }, 3350);
    setTimeout(() => {
        setInterval(() => {
            if (ruPointFrame > Math.round(localStorage["point"])) {
                return;
            }
            document.querySelector(".rank-up-total-point").innerHTML = Math.round(localStorage["total-point"]) + ruPointFrame + "pt";
            document.querySelector(".rank-up-point").innerHTML = "+" + (Math.round(localStorage["point"]) - ruPointFrame) + "pt";
            ruPointFrame++;
        }, 30)
    }, 4400);
    setTimeout(() => {
        document.querySelector(".rank-up-container").classList.add("falling");
    }, 8400);
    setTimeout(() => {
        document.onclick = () => {
            location.reload();
        };
    }, 10000);
}
document.querySelector(".rank-up-container").addEventListener("animationend", () => {
    document.querySelector(".rank-up-container").style.display = "none";
    ruBurst();
    ruAnimate();
});