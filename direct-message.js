const url = "https://script.google.com/macros/s/AKfycbwDKI_-L5Asg5e4wP_vkyWkjop1VCDaFRFgY7S_J7xV5ws0o60DZAr7tWyE0BxguO3v1Q/exec";
const payload = {
  type: "get_chat",
  username: "-SouCraK12345-" // ここに実際のユーザー名が入ります
};

let last_chat_data_length;

function get_chat_data(bool = true){
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded" // GASはJSON型で送るとCORSエラーが出やすい場合があります。この形式推奨です。
        // または "Content-Type": "application/json" で送り、GAS側で JSON.parse(e.postData.contents) する方法もあります。
      },
      body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(data => {
        if(bool){
            let new_data = data.slice(last_chat_data_length);
            if(new_data.length > 0){
                new_data.forEach((e)=>{
                    console.log(e);
                    notification(e[0])
                })
            }
        }
        last_chat_data_length = data.length;
    })
    .catch(error => console.error("Error:", error));
    setTimeout(get_chat_data, 10000);
}

function notification(user_name){
    document.querySelectorAll(".dm-notification").forEach((e)=>{e.remove()})
    const el = document.createElement("div");
    el.innerHTML = `
        <div class="notification-banner dm-notification">
            <p class="message-text"><label class="request-from">${user_name}</label><br>からDM通知が来ました!</p>
            </div>
        </div>`
    document.querySelector("body").appendChild(el);
    el.childNodes[1].classList.add("show"); // hiddenクラスを追加
    setTimeout(()=>{
        document.querySelectorAll(".dm-notification").forEach((e)=>{e.remove()})
    }, 10000)
}

get_chat_data(bool = false);