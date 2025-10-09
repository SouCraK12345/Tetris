// ----関数----

function mainloop() {
    if (game()) {
        draw();
        requestAnimationFrame(mainloop);
    }
}

function game() {
    // キーイベントの処理（JSの他の場所でセットアップされているべき）
    // キー処理は key_list と key_down 配列を更新すると仮定

    if (touch === 1) {
        rockdown_f += 1;
    } else {
        rockdown_f = 0;
    }
    G += 1;

    // ミノセット
    if (tet_type === "") {
        tet_type = next[0];
        tet_x = 5;
        tet_y = 22;
        tet_d = 0;
        rockdown_f = 0;
        next.shift();
        if (next.length < 21) {
            gene_next();
        }
    }

    // ホールド処理
    if (key_list[6] === true) {
        if (able_hold === 1) {
            able_hold = 0;
            tet_x = 5;
            tet_y = 22;
            tet_d = 0;
            if (hold === "") {
                hold = tet_type;
                tet_type = next[0];
                next.shift();
            } else {
                let v1 = hold;
                hold = tet_type;
                tet_type = v1;
            }
        }
    }

    // 自由落下
    if (G > 15) {
        mino_set();
        G = 0;
        let v1 = enable(-12);
        if (v1 === 1) {
            tet_y -= 1;
            t_spin_type = 0;
        }
    }

    // ロックダウン
    if (rockdown_f > 40) {
        rockdown();
    }

    // ハードドロップ
    if (key_list[0] === true && key_down[0] === 0) {
        key_down[0] = 1;
        rockdown();
        shaking_y += 3;
    } else {
        if (key_list[0] === false) {
            key_down[0] = 0;
        }

        // 左移動
        if (key_list[2] === true && key_list[3] === false) {
            if (key_down[2] === 0 || key_down[2] > DAS) {
                let dash = key_down[2] > DAS ? 1 : 0;
                for (let i = 0; i < 1 + dash * ARR; i++) {
                    mino_set();
                    let v1 = enable(-1);
                    if (v1 === 1) {
                        tet_x -= 1;
                        rockdown_f = 0;
                    }
                }
            }
            key_down[2] += 1;
        } else {
            key_down[2] = 0;
        }

        // 右移動
        if (key_list[3] === true && key_list[2] === false) {
            if (key_down[3] === 0 || key_down[3] > DAS) {
                let dash = key_down[3] > DAS ? 1 : 0;
                for (let i = 0; i < 1 + dash * ARR; i++) {
                    mino_set();
                    let v1 = enable(1);
                    if (v1 === 1) {
                        tet_x += 1;
                        rockdown_f = 0;
                    }
                }
            }
            key_down[3] += 1;
        } else {
            key_down[3] = 0;
        }

        // ソフトドロップ
        if (key_list[1] === true) {
            for (let i = 0; i < SDF; i++) {
                mino_set();
                let v1 = enable(-12);
                if (v1 === 1) {
                    tet_y -= 1;
                    G = 0;
                } else {
                    rockdown_f += 3 / SDF;
                }
            }
        }

        // 左回転
        if (key_list[4] === true) {
            if (key_down[4] === 0) {
                rotate(-1);
            }
            key_down[4] = 1;
        } else {
            key_down[4] = 0;
        }

        // 右回転
        if (key_list[5] === true) {
            if (key_down[5] === 0) {
                rotate(1);
            }
            key_down[5] = 1;
        } else {
            key_down[5] = 0;
        }
    }
    if ((new Date() - start_time) / 1000 > 100 && gamemode == "Ultra") {
        Finish();
        return false;
    } else if (lines >= 40 && gamemode == "40 Line") {
        Finish();
        return false;
    } else if (lines >= 150 && gamemode == "Marathon") {
        Finish();
        return false;
    } {
        return true;
    }
}


function draw_mino(x, y, mino_type, mino_position, size, ghost) {
    let lu_x = ((mino_position % 12 - 1) * 0.9 + 11.5);
    let lu_y = ((20 - Math.floor(mino_position / 12)) * 0.9 + 3);
    let color;
    if (ghost === 0) {
        color = mino_color[mino_type - 2];
    } else {
        color = ghost_mino_color[mino_type - 2];
    }
    ctx.fillStyle = color;
    ctx.fillRect(
        lu_x * size + x,
        lu_y * size + y,
        0.9 * size,
        0.9 * size
    );
}
function draw() {
    ctx.save();
    ctx.translate(-200 + shaking_x, 0 + shaking_y);
    shaking_x *= -0.5;
    shaking_y *= -0.5;
    if (tet_type !== "") {
        mino_set();
        ghost_mino_set();
    }
    // 画面クリアと背景描画
    ctx.clearRect(0, 0, 26 * size, 24 * size);
    // ctx.fillStyle = "#0e101f";
    // ctx.fillRect(0, 0, 26 * size, 24 * size);
    ctx.fillStyle = "#4d4d4d";
    ctx.fillRect(11.4 * size, 2.9 * size, 9.2 * size, 18.2 * size);
    ctx.fillRect(20.6 * size, 2.9 * size, 3.5 * size, 13.2 * size);
    ctx.fillRect(8 * size, 2.9 * size, 3.4 * size, 3.1 * size);
    ctx.fillStyle = "#222222";
    ctx.fillRect(11.5 * size, 3 * size, 9 * size, 18 * size);
    ctx.fillRect(20.6 * size, 3 * size, 3.4 * size, 13 * size);
    ctx.fillRect(8.1 * size, 3 * size, 3.3 * size, 2.9 * size);

    // 盤面上のミノ描画
    let v1 = 10;
    for (let row = 0; row < 25; row++) {
        v1 += 2;
        for (let col = 0; col < 10; col++) {
            v1 += 1;
            if (map[v1] > 0) {
                draw_mino(0, 0, map[v1], v1, size, 0);
            }
        }
    }

    if (tet_type !== "") {
        // ゴーストミノ描画
        for (let i = 0; i < 4; i++) {
            draw_mino(0, 0, tet_type, ghost_fall_mino[i], size, 1);
        }
        // 落下中ミノ描画
        for (let i = 0; i < 4; i++) {
            draw_mino(0, 0, tet_type, fall_mino[i], size, 0);
        }
    }

    // ホールドミノ描画
    if (hold !== "") {
        for (let i = 0; i < 4; i++) {
            draw_mino(-60, -305, hold, mino_position[i + (hold - 2) * 16] + 6, size * 0.7, 0);
        }
    }

    // ネクストミノ描画
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 4; j++) {
            draw_mino(315, -305 + 65 * i, next[i], mino_position[j + (next[i] - 2) * 16] + 6, size * 0.7, 0);
        }
    }
    ctx.restore()

    document.querySelector(".APM").innerHTML = `APM: ${Math.round(attack / ((new Date() - start_time) / 1000) * 600) / 10}`;
    document.querySelector(".PPS").innerHTML = `PPS: ${Math.round(blocks / ((new Date() - start_time) / 1000) * 10) / 10}`;
    document.querySelector(".LINES").innerHTML = `Lines: ${lines}`;
    document.querySelector(".REN").innerHTML = `REN: ${(REN > 0 ? REN : 0)}`;
    document.querySelector(".SCORE").innerHTML = `Score: ${score}`;
    document.querySelector(".TIME").innerHTML = `Time: ${formatSecondsToMinutes((new Date() - start_time) / 1000)}`;
}
function mino_set() {
    if (tet_type !== "") {
        let v1 = tet_y * 12 + tet_x + 1; // ミノ中心位置
        let v2 = (tet_type - 2) * 16 + tet_d * 4;
        for (let i = 0; i < 4; i++) {
            fall_mino[i] = v1 + mino_position[i + v2] - 1;
        }
    }
}
function ghost_mino_set() {
    let v2 = -12;
    let v1 = enable(-12);
    while (v1 === 1 && v2 > -300) {
        v2 -= 12;
        v1 = enable(v2);
    }
    for (let i = 0; i < 4; i++) {
        ghost_fall_mino[i] = fall_mino[i] + v2 + 12;
    }
    if (v2 === -12) {
        touch = 1;
    } else {
        touch = 0;
    }
}

function gene_next() {
    let l1 = [2, 3, 4, 5, 6, 7, 8];
    for (let i = 0; i < 7; i++) {
        let idx = Math.floor(Math.random() * l1.length);
        let v1 = l1[idx];
        next.push(v1);
        l1.splice(idx, 1);
    }
}
function enable(plus) {
    let v1 = 1;
    for (let i = 0; i < 4; i++) {
        if (map[fall_mino[i] + plus] !== 0) {
            v1 = 0;
            break;
        }
    }
    return v1;
}
function rockdown() {
    mino_set();
    ghost_mino_set();
    for (let i = 0; i < 4; i++) {
        map[ghost_fall_mino[i]] = tet_type;
    }
    able_hold = 1;
    line_delete();
    tet_type = "";
    blocks++;
}

function rotate(d) {
    // d: -1は左回転, 1は右回転
    let d_minus = d < 0 ? 1 : 0;
    let mino_basic_plus = (20 * (tet_type - 2)) + (5 * ((tet_d - d_minus + 4) % 4));
    let before_d = tet_d;
    tet_d = (tet_d + d + 4) % 4;
    mino_set();
    let end = 0;
    for (let i = 0; i < 5; i++) {
        let mino_plus = rotate_position[mino_basic_plus + i] * d;
        let v1 = enable(mino_plus);
        if (v1 === 1) {
            let center_mino_position = tet_y * 12 + tet_x + 1 + mino_plus;
            tet_x = (center_mino_position % 12) - 1;
            tet_y = Math.floor(center_mino_position / 12);
            rockdown_f = 0;
            mino_set();
            ghost_mino_set();
            end = 1;
            break;
        }
    }
    if (end === 0) {
        tet_d = before_d;
    }
}

function line_delete() {
    let i = 0;
    let isFirst = true;
    let deleted_lines = 0;
    let t_spined = false;
    while (i < 24) {
        // 行スライスを取得（壁を除く）
        let rowStart = (i + 1) * 12 + 1;
        let rowEnd = rowStart + 10;
        let row = map.slice(rowStart, rowEnd);
        // 行が全て埋まっている場合（0がない）
        if (row.every(cell => cell !== 0)) {
            deleted_lines += 1;
            // T-Spinの判定
            if (tet_type === 8 && isFirst) { // Tミノの場合のみ
                let corners = [
                    (tet_y + 1) * 12 + (tet_x),     // 左上
                    (tet_y + 1) * 12 + (tet_x + 2), // 右上
                    (tet_y - 1) * 12 + (tet_x),     // 左下
                    (tet_y - 1) * 12 + (tet_x + 2)  // 右下
                ];
                let occupiedCorners = corners.filter(corner => map[corner] !== 0).length;
                if (occupiedCorners >= 3) {
                    t_spined = true;
                }
                isFirst = false;
            }

            // 埋まった行を削除（壁も含む）
            map.splice((i + 1) * 12, 12);
            // 一番上に新しい空行を追加（壁付き）
            map.push(1);
            for (let j = 0; j < 10; j++) {
                map.push(0);
            }
            map.push(1);
            // iを増やさず、同じインデックスを再度チェック（行が下にずれるため）
            shaking_y += 5;
        } else {
            i += 1;
        }
    }
    if (t_spined) {
        rewrite_attackType("T-Spin<br>" + ["", "Single", "Double", "Triple"][deleted_lines])
        BTB++;
        attack += deleted_lines * 2 + (BTB > 1);
    } else {
        if (deleted_lines > 0) {
            rewrite_attackType(["", "Single", "Double", "Triple", "Tetris"][deleted_lines])
            if (deleted_lines < 3) {
                BTB = 0;
            } else {
                BTB++;
            }
            attack += deleted_lines - 1 + (deleted_lines == 4) + (BTB > 1);
        }
    }
    // パーフェクトクリア
    let isPerfectClear = map.slice(12, -12).every(cell => cell === 0 || cell === 1);
    if (isPerfectClear && deleted_lines > 0) {
        rewrite_attackType("Perfect<br>Clear")
        attack += 7;
        if (BTB > 1) {
            score += 66000;
        } else {
            score += [0, 13500, 22500, 34500, 42000][deleted_lines];
        }
    } else if (deleted_lines > 0) {
        if (t_spined) {
            score += [6000, 3000, 12000, 18000, 24000][deleted_lines];
        } else {
            score += [0, 1500, 4500, 7500, 12500][deleted_lines];
        }
    }
    if (deleted_lines) {
        REN += 1;
        attack += REN_attack[REN]
        if (REN > 4) {
            score += 3750;
        }
        else {
            score += [0, 750, 1500, 2250, 3000][REN];
        }
    } else {
        REN = -1;
    }
    lines += deleted_lines;
}
function rewrite_attackType(text) {
    let node = document.querySelector("label#attack_type");
    node.innerHTML = "<span id='#attack_type'>" + text + "</span>";
}
function restart() {
    document.querySelector(".bgm-ultra").currentTime = 0;
    map = Array(12).fill(1);
    for (let i = 0; i < 30; i++) {
        map.push(1);
        for (let j = 0; j < 10; j++) {
            map.push(0);
        }
        map.push(1);
    }
    next = [];
    for (i = 0; i < 100; i++) {
        gene_next();
    }
    tet_type = "";
    hold = "";
    able_hold = 1;
    start_time = new Date();
    attack = 0;
    blocks = 0;
    REN = 0;
    score = 0;
    lines = 0;
}
function formatSecondsToMinutes(totalSeconds) {

    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;

    // 分を2桁にフォーマット
    const paddedMinutes = String(minutes).padStart(2, '0');

    // 秒の整数部分と小数点以下を分ける
    const secondsInteger = Math.floor(remainingSeconds);
    const secondsFraction = remainingSeconds - secondsInteger;

    // 秒の整数部分を2桁にフォーマット
    const paddedSecondsInteger = String(secondsInteger).padStart(2, '0');

    // 小数点以下を2桁にフォーマット
    // toFixed(2) は文字列を返すので、そのまま結合
    const formattedFraction = secondsFraction.toFixed(2).substring(2); // ".xx" から "xx" を取り出す

    // 0.00 のように秒の整数部分が0で小数点以下がない場合を考慮
    let formattedSeconds;
    if (totalSeconds < 1) { // 1秒未満の場合（例: 0.5秒）
        formattedSeconds = `00.${formattedFraction}`;
    } else if (secondsFraction === 0) { // 小数点以下がない場合
        formattedSeconds = `${paddedSecondsInteger}.00`;
    } else {
        formattedSeconds = `${paddedSecondsInteger}.${formattedFraction}`;
    }

    return `${paddedMinutes}:${formattedSeconds}`;
}

function Finish() {
    document.querySelector(".details").style.display = "none";
    let apm = Math.round(attack / ((new Date() - start_time) / 1000) * 600) / 10;
    let pps = Math.round(blocks / ((new Date() - start_time) / 1000) * 10) / 10;
    let time = ((new Date() - start_time) / 1000);
    draw();
    document.querySelector(".wipe-in-box").classList.add("boxWipein");
    setTimeout(function () {
        canvas.style.display = "none";
    }, 4000);
    setTimeout(function () {
        document.querySelector(".result").style.display = "block";
        document.querySelector(".result").classList.add("FloatIn");
        document.querySelector(".result-apm").innerText = apm;
        document.querySelector(".result-attack").innerText = attack;
        document.querySelector(".result-pps").innerText = pps;
        document.querySelector(".result-lines").innerText = lines;
        document.querySelector(".result-score").innerText = score;
        document.querySelector(".result-time").innerText = time;
    }, 5200);
}
function bgm() {
    if (gamemode == "Ultra") {
        document.querySelector(".bgm-ultra").currentTime = 0;
        document.querySelector(".bgm-ultra").play();
    }
}

// ----初期設定----
// 変数セット
const keyname = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "z", "x", "c"];
let key_list = Array(7).fill(false);
let key_down = Array(7).fill(0);
// イベント
document.addEventListener("keydown", (event) => {
    let v1 = keyname.indexOf(event.key);
    if (v1 !== -1) {
        key_list[v1] = true;
    }
    if (event.key == "f") {
        restart();
    }
});
document.addEventListener("keyup", (event) => {
    let v1 = keyname.indexOf(event.key);
    if (v1 !== -1) {
        key_list[v1] = false;
    }
});
let size = 30;
let canvas = document.getElementById("tetris");
canvas.width = 18 * size;
canvas.height = 24 * size;
let ctx = canvas.getContext("2d");
ctx.scale(1, 1);
let ARR = 10;
let DAS = 6;
let SDF = 20;
let tet_type = "";
let tet_d = 0;
let tet_x = 0;
let tet_y = 0;
let hold = "";
let able_hold = 1;
let t_spin_type = "";
let touch = 0;
let G = 0;
let BTB = 0;
let REN = 0;
let shaking_x = 0;
let shaking_y = 0;
let attack = 0;
let blocks = 0;
let lines = 0;
let start_time = new Date();
let REN_attack = [0, 0, 1, 1, 2, 2, 23, 3, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5];
let score = 0;
let game_mode = "";

// ネクスト生成
let next = [];
for (i = 0; i < 100; i++) {
    gene_next();
}

// 盤面セット
let map = Array(12).fill(1);
for (let i = 0; i < 30; i++) {
    map.push(1);
    for (let j = 0; j < 10; j++) {
        map.push(0);
    }
    map.push(1);
}
// ミノデータセット
let fall_mino = [0, 0, 0, 0];
let ghost_fall_mino = [0, 0, 0, 0];
let mino_position = [-1, 0, 1, 2, -23, -11, 1, 13, -13, -12, -11, -10, -24, -12, 0, 12, 0, 1, 12, 13, 0, 1, 12, 13, 0, 1, 12, 13, 0, 1, 12, 13, -1,
    0, 12, 13, -11, 0, 1, 12, -13, -12, 0, 1, -12, -1, 0, 11, 0, 1, 11, 12, -12, 0, 1, 13, -12, -11, -1, 0, -13, -1, 0, 12, -1, 0,
    1, 11, -12, 0, 12, 13, -11, -1, 0, 1, -13, -12, 0, 12, -1, 0, 1, 13, -12, -11, 0, 12, -13, -1, 0, 1, -12, 0, 11, 12, -1, 0, 1,
    12, -12, 0, 1, 12, -12, -1, 0, 1, -12, -1, 0, 12];
let rotate_position = [0, -2, 1, -14, 25, 0, -1, 2, 23, -10, 0, 2, -1, 14, 23, 0, 1, -2, -23, 10, 0, -1, 11, -24,
    -25, 0, 1, -11, 24, 25, 0, 1, 13, -24, -23, 0, -1, -13, 24, 23, 0, -1, 11, -24, -25, 0, 1,
    -11, 24, 25, 0, 1, 13, -24, -23, 0, -1, -13, 24, 23, 0, -1, 11, -24, -25, 0, 1, -11, 24,
    25, 0, 1, 13, -24, -23, 0, -1, -13, 24, 23, 0, -1, 11, -24, -25, 0, 1, -11, 24, 25, 0, 1,
    13, -24, -23, 0, -1, -13, 24, 23, 0, -1, 11, -24, -25, 0, 1, -11, 24, 25, 0, 1, 13, -24,
    -23, 0, -1, -13, 24, 23, 0, -1, 11, -24, -25, 0, 1, -11, 24, 25, 0, 1, 13, -24, -23, 0, -1,
    -13, 24, 23,];
let mino_color = ["#00ffff", "#ffe600", "#33ff00", "#ff0000", "#0012ff", "#ff9100", "#ad00ff"];
let ghost_mino_color = ["#004d4d", "#4d4500", "#0f4d00", "#4d0000", "#00084d", "#4d2700", "#34004d"];

canvas.style.display = "none";
document.querySelector(".details").style.display = "none";
document.querySelectorAll(".tile-card").forEach((e) => {
    e.addEventListener("click", function () {
        gamemode = e.children[0].innerText;
        canvas.style.display = "block";
        draw()
        document.querySelector(".tile-card-container").style.display = "none"
        setTimeout(function () {
            document.querySelector(".details").style.display = "block";
            start_time = new Date();
            mainloop();
            document.querySelector(".bgm-ultra").play();
        }, 1000);
    })
})

