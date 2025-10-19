
setInterval(check_request, 100)
function check_request() {
    // try {
    for (var i in requests) {
        if (requests[i].time + 30000 < new Date()) {
            delete requests[i];
            continue;
        }
        if (i == user_name && !battle_started) {
            request_time = requests[i].time;
            document.querySelectorAll(".request-from").forEach(function (e) {
                e.innerHTML = requests[i].from;
            });
            requested_name = requests[i].from;
            const banner = document.getElementById("myNotificationBanner");
            banner.onclick = function () {
                document.querySelector("dialog.accept_dialog").showModal();
            }
            banner.classList.add("show"); // hiddenクラスを追加
            decrease_progress_bar();
        }
    }
    if (!battle_started) {
        isAccepted(sendTo);
    }
    // } catch (e) { }
}

function decrease_progress_bar() {
    progress_bar_value = 30 - parseInt(new Date() - request_time) / 1000;
    document.querySelector(".progress-fill").style.width = `${progress_bar_value / 30 * 100}%`;
    if (progress_bar_value < 0) {
        return closeNotification();
    }
    setTimeout(decrease_progress_bar, 1000)
}


function closeNotification() {
    const banner = document.getElementById("myNotificationBanner")
    banner.classList.add("hidden") // hiddenクラスを追加

    // アニメーションが終わったら要素を完全に非表示にする
    banner.addEventListener(
        "animationend",
        () => {
            if (banner.classList.contains("hidden")) {
                banner.classList.remove("hidden", "show");
            }
        },
        { once: true },
    ) // 一度だけ実行されるように設定
}
function close_accept() {
    document.querySelector("dialog.accept_dialog").close();
}

function beforeSendRequest() {
    sendRequest(Object.keys(cloudData)[document.querySelector(".user").value]);
    document.querySelector("button.request").disabled = true;
    setTimeout(function () {
        document.querySelector("button.request").disabled = false;
    }, 35000);
}