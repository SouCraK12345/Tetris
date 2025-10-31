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
        <tr><th>スコア</th><td>${r[4].toLocaleString()}</td></tr>
        <tr><th>消去ライン</th><td>${r[5]}</td></tr>
        <tr><th>タイム</th><td>${r[6]}</td></tr>
        <tr><th>勝敗</th><td class="${r[7] ? 'psb-win-true' : 'psb-win-false'}">${r[7] ? 'Win' : 'Lose'}</td></tr>
        <tr><th>相手APM</th><td>${r[8]}</td></tr>
      </tbody></table>`;
    detailsDiv.innerHTML = html;
    detailsDiv.classList.remove('psb-visible');
    // 強制リフローでアニメーション再発火
    void detailsDiv.offsetWidth;
    detailsDiv.classList.add('psb-visible');
}