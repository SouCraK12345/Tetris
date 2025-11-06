let player_stats = [];
let myChart = null;

function fetch_player_stats() {
  (function () {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "https://script.google.com/macros/s/AKfycbwDKI_-L5Asg5e4wP_vkyWkjop1VCDaFRFgY7S_J7xV5ws0o60DZAr7tWyE0BxguO3v1Q/exec");
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    const body = JSON.stringify({
      type: "get_data",
      username: user_name,
    });
    xhr.onload = () => {
      if (xhr.readyState == 4 && xhr.status == 200) {
        player_stats = JSON.parse(xhr.responseText);
        document.querySelector("#psb-body").innerHTML = `
      <div id="psb-matches">
      </div>
      <div id="psb-details"></div>
      `;

        draw_graph();
        setTimeout(() => {
          document.querySelector("#psb-matches").scrollTo(0, -1000)
        });
      } else {
        alert(`Error: ${xhr.status}`);
      }
    };
    xhr.send(body);

  })();
  function draw_graph() {
    const matchesDiv = document.getElementById('psb-matches');
    const detailsDiv = document.getElementById('psb-details');

    player_stats.forEach((r, i) => {
      const btn = document.createElement('button');
      btn.className = 'psb-match-btn';
      btn.innerHTML = `<span class='psb-btn-type'>${r[1]}</span><span class='psb-btn-sub'>apm: ${r[2]} | time: ${r[6]}</span>`;
      btn.onclick = () => showDetails(i);
      matchesDiv.appendChild(btn);
    });

    function showDetails(index) {
      const r = player_stats[index];
      let html = `<h2>${r[1]} 詳細</h2>`;
      html += `<table class='psb-table'><tbody>
        <tr><th>APM</th><td>${r[2]}</td></tr>
        <tr><th>PPS</th><td>${r[3]}</td></tr>
        <tr><th>スコア</th><td>${r[4]}</td></tr>
        <tr><th>消去ライン</th><td>${r[5]}</td></tr>
        <tr><th>タイム</th><td>${r[6]}</td></tr>
        <tr><th>勝敗</th><td class="${r[7] ? 'psb-win-true' : 'psb-win-false'}">${r[7] ? 'Clear!' : 'Failure...'}</td></tr>
        ${r[1] == "VirtualBattle" ? `<tr><th>相手APM</th><td>${r[8]}</td></tr>` : ""}
      </tbody></table>`;
      detailsDiv.innerHTML = html;
      detailsDiv.classList.remove('psb-visible');
      // 強制リフローでアニメーション再発火
      void detailsDiv.offsetWidth;
      detailsDiv.classList.add('psb-visible');
    }
    if (myChart != null) {
      myChart.destroy();
    }
    var ctx = document.getElementById("myLineChart");
    myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [...Array(player_stats.length).keys()].map(i => i + 1),
        datasets: [
          {
            label: 'APM',
            data: player_stats.map(data => data[2]),
            borderColor: "rgba(255,0,0,1)",
            backgroundColor: "rgba(0,0,0,0)"
          },
          {
            label: 'PPS (x40)',
            data: player_stats.map(data => data[3] * 40),
            borderColor: "rgba(0,0,255,1)",
            backgroundColor: "rgba(0,0,0,0)",
          }
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        title: {
          display: true,
          text: '最近のデータ'
        },
        scales: {
          yAxes: [{
            ticks: {
              suggestedMax: 40,
              suggestedMin: 0,
              stepSize: 10,
              callback: function (value, index, values) {
                return value
              }
            }
          }]
        },
      }
    });
  }
}

setTimeout(() => {
  if (user_name) {
    fetch_player_stats();
  }
}, 1000);