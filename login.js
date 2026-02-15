function login() {
    document.querySelector(".login-submit").disabled = true;
    document.querySelector(".username").disabled = true;
    document.querySelector(".password").disabled = true;

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "https://script.google.com/macros/s/AKfycbwDKI_-L5Asg5e4wP_vkyWkjop1VCDaFRFgY7S_J7xV5ws0o60DZAr7tWyE0BxguO3v1Q/exec");
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    const body = JSON.stringify({
        username: document.querySelector(".username").value,
        password: document.querySelector(".password").value,
        type: "login",
    });
    xhr.onload = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            if (xhr.responseText != "パスワードが違います" && xhr.responseText != "ユーザー名が違います") {
                user_name = document.querySelector(".username").value;
                localStorage.setItem("user_name", user_name);
                document.querySelector(".login-button").style.display = "none";
                document.querySelector(".user-name-label").innerHTML = user_name;
                location.reload();
            } else {
                alert(xhr.responseText);
            }
        } else {
            alert(`Error: ${xhr.status}`);
        }
        document.querySelector(".login-submit").disabled = false;
        document.querySelector(".username").disabled = false;
        document.querySelector(".password").disabled = false;
    };
    xhr.send(body);
}
document.querySelector(".user-name-label").addEventListener("click", function () {
    confirm("ログアウトしますか？") && logout();
});
function logout() {
    localStorage.clear();
    location.reload();
}
user_name_ls = localStorage.getItem("user_name");
if (user_name_ls) {
    user_name = user_name_ls;
    // document.querySelector(".login").close();
    document.querySelector(".login-button").style.display = "none";
    document.querySelector(".user-name-label").innerHTML = user_name;
}

document.querySelector("span.title-username").innerHTML = user_name;
document.querySelector("input.title-password").addEventListener("keydown", e => {
    if (e.key == "Enter") {
        title_login();
    }
});

function title_login() {
    document.querySelector("input.title-password").disabled = true;
    document.querySelector(".title-submit").disabled = true;
    fetch("https://script.google.com/macros/s/AKfycbwDKI_-L5Asg5e4wP_vkyWkjop1VCDaFRFgY7S_J7xV5ws0o60DZAr7tWyE0BxguO3v1Q/exec", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: JSON.stringify({
            type: "login",
            username: user_name,
            password: document.querySelector("input.title-password").value,
        })
    }).then(response => response.text()).then(data => {
        if (data != "パスワードが違います" && data != "ユーザー名が違います") {
            const json = JSON.parse(data);
            clearInterval(certification_loop);
            document.querySelector(".title-cover").classList.add("hide");
            document.querySelector(".title-cover").addEventListener("animationend", function () {
                console.log("title");
                document.querySelector(".title-cover").close();
                json.forEach(i => {
                    if (i[0] == user_name) {
                        console.log(i);
                        localStorage["win-count"] = i[3];
                        localStorage["lose-count"] = i[4];
                        localStorage["point"] = i[5];
                        localStorage["total-point"] = i[6];
                        localStorage["Sranker"] = i[7];
                    }
                });
                RatingSystem.update();
            });
        } else {
            alert("パスワードが違います");
            document.querySelector("input.title-password").disabled = false;
            document.querySelector(".title-submit").disabled = false;
        }
    });
}
let certification_loop;
if (user_name_ls) {
    document.querySelector(".title-cover").showModal()

    certification_loop = setInterval(function () {
        if (!document.querySelector(".title-cover")?.matches(":modal")) {
            location.reload();
        }
    }, 1000)
};