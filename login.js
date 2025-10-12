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
        console.log(xhr)
        if (xhr.readyState == 4 && xhr.status == 200) {
            if (xhr.responseText == "ログイン完了") {
                user_name = document.querySelector(".username").value;
                document.querySelector(".login").close();
                document.querySelector(".login-button").style.display = "none";
                document.querySelector(".user-name-label").innerHTML = user_name;
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