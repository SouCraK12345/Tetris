import firebase_admin
from firebase_admin import credentials, db
import time
import requests
import json
import tkinter as tk
from tkinter import ttk
from datetime import datetime
import notfication


def update():
    global old_data
    print("update")
    data = requests.post(url, data=json.dumps(send_data), headers={"Content-Type": "application/json"}).text
    update_table(data)
    if len(data) != len(old_data):
        print("更新されている")
        notfication.show_toast(root, "Online Tetris\nDMが届きました")
        children = tree.get_children()
        if children:
            tree.see(children[-1])
    old_data = data
    root.after(10000, update)

def update_table(json_input):
    """
    JSON文字列を受け取り、Treeviewの内容を更新する関数
    """
    # 1. 現在のテーブルの中身をすべて削除（クリア）
    for item in tree.get_children():
        tree.delete(item)

    try:
        # JSONをパース
        data_list = json.loads(json_input)
    except json.JSONDecodeError:
        print("JSONの形式が正しくありません")
        return

    # 2. 新しいデータを挿入
    for item in data_list:
        # データ構造が正しいか簡易チェック（長さが4であること）
        if len(item) >= 4:
            sender = item[0]
            receiver = item[1]
            message = item[2]
            timestamp_ms = item[3]
            
            # ミリ秒のタイムスタンプを日時に変換
            dt = datetime.fromtimestamp(timestamp_ms / 1000.0)
            formatted_time = dt.strftime("%Y/%m/%d %H:%M:%S")
            
            # テーブルに行を追加
            tree.insert("", tk.END, values=(sender, receiver, message, formatted_time))
# サービスアカウントキーを読み込み
cred = credentials.Certificate("online-tetris-souki-server2-firebase-adminsdk-fbsvc-5d5b53a53e.json")
url = "https://script.google.com/macros/s/AKfycbwDKI_-L5Asg5e4wP_vkyWkjop1VCDaFRFgY7S_J7xV5ws0o60DZAr7tWyE0BxguO3v1Q/exec"

# Firebaseアプリの初期化（データベースURLを入れる）
firebase_admin.initialize_app(
    cred,
    {
        "databaseURL": "https://online-tetris-souki-server2-default-rtdb.firebaseio.com/"
    }
)

send_data = {"type": "get_chat","username": "-SouCraK12345-"}

# -------------------------
#   データベース参照
# -------------------------
# 例：/game/players にアクセス
ref = db.reference("active")


# データの定義（ご提示いただいたJSON文字列）
json_str = requests.post(url, data=json.dumps(send_data), headers={"Content-Type": "application/json"}).text

old_data = json_str

# JSON文字列をPythonのリストに変換
data = json.loads(json_str)

# メインウィンドウの作成
root = tk.Tk()
root.title("チャットログビューア")
root.geometry("800x500")

# スタイル設定（見た目を少し良くする）
style = ttk.Style()
style.theme_use("clam")
style.configure("Treeview", rowheight=25)

# フレームの作成（スクロールバー配置用）
frame = ttk.Frame(root)
frame.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)

# Treeview（表）の作成
columns = ("sender", "receiver", "message", "time")
tree = ttk.Treeview(frame, columns=columns, show="headings")

# 列（カラム）の設定
tree.heading("sender", text="送信者")
tree.heading("receiver", text="受信者")
tree.heading("message", text="メッセージ内容")
tree.heading("time", text="日時")

tree.column("sender", width=120, anchor="center")
tree.column("receiver", width=120, anchor="center")
tree.column("message", width=350, anchor="w") # メッセージは左寄せ
tree.column("time", width=150, anchor="center")

# スクロールバーの追加
scrollbar = ttk.Scrollbar(frame, orient=tk.VERTICAL, command=tree.yview)
tree.configure(yscrollcommand=scrollbar.set)
scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
tree.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)

# データの挿入処理
for item in data:
    sender = item[0]
    receiver = item[1]
    message = item[2]
    timestamp_ms = item[3]
    
    # ミリ秒のタイムスタンプを日時に変換
    dt = datetime.fromtimestamp(timestamp_ms / 1000.0)
    formatted_time = dt.strftime("%Y/%m/%d %H:%M:%S")
    
    # テーブルに行を追加
    tree.insert("", tk.END, values=(sender, receiver, message, formatted_time))

root.after(10000, update)


children = tree.get_children()
if children:
    tree.see(children[-1])

# メインループの開始
root.mainloop()


# データの読み込み
# data = ref.get()
# print("現在のデータ:", data)