"""import系"""
import tkinter as tk
import random


"""定義系"""
def mainloop():
    game()
    draw()
    app.after(33,mainloop)


def game():
    global tet_type, tet_x, tet_y, tet_d, G, able_hold, hold, rockdown_f
    app.bind("<Key>", key_press)
    app.bind("<KeyRelease>", key_release)  
    if touch == 1:
        rockdown_f += 1
    else:
        rockdown_f = 0
    G += 1
    if tet_type == "":    # ミノセット
        tet_type = next[0]
        tet_x = 5
        tet_y = 22
        tet_d = 0
        rockdown_f = 0
        del next[0]
        if len(next) < 21:    # Next生成
            gene_next()
    if key_list[6] == "True":    # Hold処理
        if able_hold == 1:
            able_hold = 0
            tet_x = 5
            tet_y = 22
            tet_d = 0
            if hold == "":
                hold = tet_type
                tet_type = next[0]
                del next[0]
            else:
                v1 = hold
                hold = tet_type
                tet_type = v1
    if 15 < G:    # 自由落下
        mino_set
        G = 0
        v1 = enable(-12)
        if v1 == 1:
            tet_y -= 1
            tspin_type = 0
    if 40 < rockdown_f:    # ロックダウン
        rockdown()
    if key_list[0] == "True" and key_down[0] == 0:    # ハードドロップ
        key_down[0] = 1
        rockdown()
    else:
        if key_list[0] == "False":
            key_down[0] = 0
        if key_list[2] == "True" and key_list[3] == "False":    # 左移動
            if key_down[2] == 0 or DAS < key_down[2]:
                if DAS < key_down[2]:
                    dash = 1
                else:
                    dash = 0
                for i in range(1 + dash * ARR):
                    mino_set()
                    v1 = enable(-1)
                    if v1 == 1:
                        tet_x -= 1
                        rockdown_f = 0
            key_down[2] += 1
        else:
            key_down[2] = 0
        if key_list[3] == "True" and key_list[2] == "False":    # 右移動
            if key_down[3] == 0 or DAS < key_down[3]:
                if DAS < key_down[3]:
                    dash = 1
                else:
                    dash = 0
                for i in range(1 + dash * ARR):
                    mino_set()
                    v1 = enable(1)
                    if v1 == 1:
                        tet_x += 1
                        rockdown_f = 0
            key_down[3] += 1
        else:
            key_down[3] = 0
        if key_list[1] == "True":    # ソフトドロップ
            for i in range(SDF):
                mino_set()
                v1 = enable(-12)
                if v1 == 1:
                    tet_y -= 1
                    G = 0
                else:
                    rockdown_f += 2
        if key_list[4] == "True":    # 左回転
            if key_down[4] == 0:
                rotate(-1)
            key_down[4] = 1
        else:
            key_down[4] = 0
        if key_list[5] == "True":    # 右回転
            if key_down[5] == 0:
                rotate(1)
            key_down[5] = 1
        else:
            key_down[5] = 0



def draw():
    global tet_x, tet_y, tet_type, tet_d, size
    if tet_type != "":
        mino_set()
        ghost_mino_set()
    canvas.delete("all")
    canvas.create_rectangle(0, 0, 24*size, 32*size, fill="#0e101f", width=0)
    canvas.create_rectangle(11.4*size, 2.9*size, 20.6*size, 21.1*size, fill="#4d4d4d", width=0)
    canvas.create_rectangle(20.6*size, 2.9*size, 24.1*size, 16.1*size, fill="#4d4d4d", width=0)
    canvas.create_rectangle(8*size, 2.9*size, 11.4*size, 6*size, fill="#4d4d4d", width=0)
    canvas.create_rectangle(11.5*size, 3*size, 20.5*size, 21*size, fill="#000000", width=0)
    canvas.create_rectangle(20.6*size, 3*size, 24*size, 16*size, fill="#000000", width=0)
    canvas.create_rectangle(8.1*size, 3*size, 11.4*size, 5.9*size, fill="#000000", width=0)
    v1 = 10   #ミノ描写
    for i in range(25):
        v1 = v1 + 2
        for i in range(10):
            v1 = v1 + 1
            if 0 < map[v1]:
                draw_mino(0, 0, map[v1], v1, size, 0)
    if tet_type != "":
        for i in range(4):     # ゴーストミノ描写
            draw_mino(0, 0, tet_type, ghost_fall_mino[i], size, 1)
        for i in range(4):     # 落ちミノ描写
            draw_mino(0, 0, tet_type, fall_mino[i], size, 0)
    if hold != "":    # ホールド描写
        for i in range(4):
            draw_mino(-60, -305, hold, mino_position[i + (hold - 2) * 16] + 6, size * 0.7, 0)
    for i in range(5):    # ネクスト描写
        for j in range(4):
            draw_mino(315, -305 + 65 * i, next[i], mino_position[j + (next[i] - 2) * 16] + 6, size * 0.7, 0)
        

def draw_mino(x, y, mino_type, mino_position, size, ghost):
    lu_x = ((mino_position % 12 - 1) * 0.9 + 11.5)
    lu_y = ((20 - (mino_position // 12)) * 0.9  + 3)
    if ghost == 0:
        color = mino_color[mino_type - 2]
    else:
        color = ghost_mino_color[mino_type - 2]
    canvas.create_rectangle(lu_x * size + x, 
                            lu_y * size + y, 
                            (lu_x + 0.9) * size + x, 
                            (lu_y + 0.9) * size + y, 
                            fill = color, 
                            width = 0)


def mino_set():
    global tet_x, tet_y, tet_type, tet_d
    if tet_type != "":
        v1 = tet_y * 12 + tet_x + 1 # ミノ中心位置
        v2 = (tet_type - 2) * 16 + tet_d * 4
        for i in range(4):
            fall_mino[i] = v1 + mino_position[i + v2] - 1


def ghost_mino_set():
    global touch
    v2 = -12
    v1 = enable(-12)
    while v1 == 1 and -300 < v2:
        v2 -= 12
        v1 = enable(v2)
    for i in range(4):
        ghost_fall_mino[i] = fall_mino[i] + v2 + 12
    if v2 == -12:
        touch = 1
    else:
        touch = 0


def gene_next():
    l1 = [2,3,4,5,6,7,8]
    for i in range(7):
        v1 = l1[random.randint(0, len(l1) - 1)]
        next.append(v1)
        l1.remove(v1)


def enable(plus):
    v1 = 1
    for i in range(4):
        if map[fall_mino[i] + plus] != 0:
            v1 = 0
            break
            return v1
    return v1


def key_press(event):
    v1 = event.keysym
    for i in range(7):
        if v1 == keyname[i]:
            key_list[i] = "True"


def key_release(event):
    v1 = event.keysym
    for i in range(7):
        if v1 == keyname[i]:
            key_list[i] = "False"


def rockdown():
    global tet_type, able_hold
    mino_set()
    ghost_mino_set()
    for i in range(4):
        map[ghost_fall_mino[i]] = tet_type
    tet_type = ""
    able_hold = 1
    line_delete()


def rotate(d):
    global tet_type, tet_x, tet_y, tet_d, t_spin_type, rockdown_f
    if d < 0:
        d_minus = 1
    else:
        d_minus = 0
    mino_basic_plus = (20 * (tet_type - 2)) + (5 * ((tet_d - d_minus) % 4))
    before_d = tet_d
    tet_d = (tet_d + d) % 4
    mino_set()
    end = 0
    for i in range(5):
        mino_plus = rotate_position[mino_basic_plus + i] * d
        v1 = enable(mino_plus)
        if v1 == 1:
            center_mino_position = tet_y * 12 + tet_x + 1 + mino_plus
            tet_x = center_mino_position % 12 - 1
            tet_y = center_mino_position // 12
            rockdown_f = 0
            mino_set()
            ghost_mino_set()
            end = 1
            break
    if end == 0:
        tet_d = before_d


def line_delete():
    i = 0
    while i < 24:
        if not 0 in (map[(i + 1) * 12:(i + 2) * 12]):
            del map[(i + 1) * 12:(i + 2) * 12]
            map.append(1)
            for j in range(10):
                map.append(0)
            map.append(1)
        else:
            i += 1







"""初期設定"""
# 変数セット
ARR = 3
DAS = 2
SDF = 3
app = tk.Tk()
size = 30
tet_type = ""
tet_d = 0
tet_x = 0
tet_y = 0
hold = ""
able_hold = 1
t_spin_type = ""
touch = 0
G = 0

# ネクスト生成
next = []
for i in range(100):
    gene_next()

# 盤面セット
map = [1 for i in range(12)]
for i in range(30):
    map.append(1)
    for i in range(10):
        map.append(0)
    map.append(1)
# ミノデータセット
fall_mino = [0, 0, 0, 0]
ghost_fall_mino = [0, 0, 0, 0]
mino_position = [-1,0,1,2,-23,-11,1,13,-13,-12,-11,-10,-24,-12,0,12,0,1,12,13,0,1,12,13,0,1,12,13,0,1,12,13,-1,
                0,12,13,-11,0,1,12,-13,-12,0,1,-12,-1,0,11,0,1,11,12,-12,0,1,13,-12,-11,-1,0,-13,-1,0,12,-1,0,
                1,11,-12,0,12,13,-11,-1,0,1,-13,-12,0,12,-1,0,1,13,-12,-11,0,12,-13,-1,0,1,-12,0,11,12,-1,0,1,
                12,-12,0,1,12,-12,-1,0,1,-12,-1,0,12]
rotate_position = [0, -2, 1, -14, 25, 0, -1, 2, 23, -10, 0, 2, -1, 14, 23, 0, 1, -2, -23, 10, 0, -1, 11, -24, 
                   -25, 0, 1, -11, 24, 25, 0, 1, 13, -24, -23, 0, -1, -13, 24, 23, 0, -1, 11, -24, -25, 0, 1,
                   -11, 24, 25, 0, 1, 13, -24, -23, 0, -1, -13, 24, 23, 0, -1, 11, -24, -25, 0, 1, -11, 24, 
                   25, 0, 1, 13, -24, -23, 0, -1, -13, 24, 23, 0, -1, 11, -24, -25, 0, 1, -11, 24, 25, 0, 1, 
                   13, -24, -23, 0, -1, -13, 24, 23, 0, -1, 11, -24, -25, 0, 1, -11, 24, 25, 0, 1, 13, -24, 
                   -23, 0, -1, -13, 24, 23, 0, -1, 11, -24, -25, 0, 1, -11, 24, 25, 0, 1, 13, -24, -23, 0, -1, 
                   -13, 24, 23, ]
mino_color = ["#00ffff","#ffe600","#33ff00","#ff0000","#0012ff","#ff9100","#ad00ff"]
ghost_mino_color = ["#004d4d", "#4d4500", "#0f4d00", "#4d0000", "#00084d", "#4d2700","#34004d"]

# キーセット
keyname = ["Up", "Down", "Left", "Right", "z", "x", "c"]
key_list = ["False" for i in range(7)]
key_down = [0 for i in range(7)]

# windowセット
v1 = str(str(32 * size) + "x" + str(24 * size))
app.geometry(v1)
app.title("Tetris")
canvas = tk.Canvas(
    app,
    width = 32 * size,
    height = 24 * size,
    bg = "#0e101f",
    highlightthickness = 0
    )
canvas.place(
    x = 0,
    y = 0
)


"""mainloop"""
mainloop()
app.mainloop()