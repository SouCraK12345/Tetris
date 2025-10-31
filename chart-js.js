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
        console.log(JSON.parse(xhr.responseText));
        player_stats = JSON.parse(xhr.responseText);

        draw_graph();
      } else {
        alert(`Error: ${xhr.status}`);
      }
    };
    xhr.send(body);
  })();
  function draw_graph() {
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
            data: player_stats.map(data => data[3]),
            borderColor: "rgba(255,0,0,1)",
            backgroundColor: "rgba(0,0,0,0)"
          },
          // {
          //   label: 'PPS (x40)',
          //   data: player_stats.map(data => data[4] * 40),
          //   borderColor: "rgba(0,0,255,1)",
          //   backgroundColor: "rgba(0,0,0,0)",
          // }
        ],
      },
      options: {
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
  if (user_name != "") {
    fetch_player_stats();
  }
}, 1000);