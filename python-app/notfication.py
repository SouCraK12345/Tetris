import tkinter as tk

class ToastNotification:
    def __init__(self, root, message, duration=3000):
        """
        :param root: 親ウィンドウ
        :param message: 表示するメッセージ
        :param duration: 表示時間（ミリ秒） default: 3000ms = 3秒
        """
        self.top = tk.Toplevel(root)
        self.top.overrideredirect(True)  # ウィンドウ枠（タイトルバー）を削除
        
        # デザイン設定（背景黒、文字白、少し透過）
        bg_color = "#333333"
        fg_color = "#ffffff"
        self.top.configure(bg=bg_color)
        self.top.attributes("-topmost", True)  # 常に最前面
        self.top.attributes("-alpha", 0.9)     # 少し透けさせる

        # ラベルの配置
        label = tk.Label(
            self.top, text=message, fg=fg_color, bg=bg_color,
            font=("Meiryo", 12), padx=20, pady=10
        )
        label.pack()

        # ウィンドウサイズと位置の計算（画面右下に表示）
        root.update_idletasks()
        width = label.winfo_reqwidth() + 4  # 少し余裕を持たせる
        height = label.winfo_reqheight() + 4
        
        screen_width = root.winfo_screenwidth()
        screen_height = root.winfo_screenheight()
        
        # 右端から20px、下端から50pxの位置
        x = screen_width - width - 20
        y = screen_height - height - 50
        
        self.top.geometry(f"{width}x{height}+{x}+{y}")

        # 指定時間後にウィンドウを破棄
        self.top.after(duration, self.top.destroy)

# --- メイン処理 ---
def show_toast(root, text):
    ToastNotification(root, text, duration=10000)
