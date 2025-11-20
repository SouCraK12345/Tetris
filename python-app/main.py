import firebase_admin
from firebase_admin import credentials, db
import time

# サービスアカウントキーを読み込み
cred = credentials.Certificate("python-app/online-tetris-souki-server2-firebase-adminsdk-fbsvc-5d5b53a53e.json")

# Firebaseアプリの初期化（データベースURLを入れる）
firebase_admin.initialize_app(
    cred,
    {
        "databaseURL": "https://online-tetris-souki-server2-default-rtdb.firebaseio.com/"
    }
)

# -------------------------
#   データベース参照
# -------------------------
# 例：/game/players にアクセス
ref = db.reference("active")

# データの読み込み
while 1:
    data = ref.get()
    print("現在のデータ:", data)
    time.sleep(5)