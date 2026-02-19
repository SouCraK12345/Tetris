// const canvas = document.getElementById("tetris");
// const ctx = canvas.getContext("2d");
const video = document.getElementById("preview");

// デモ描画
let x = 0;

// ===== 録画 =====
let recorder;
let chunks = [];

let start_recording = () => {
  if (!recordToggle.checked) { return; }
  const stream = canvas.captureStream(10);

  recorder = new MediaRecorder(stream, {
    mimeType: "video/webm"
  });

  chunks = [];

  recorder.ondataavailable = e => {
    if (e.data.size > 0) chunks.push(e.data);
  };

  recorder.onstop = () => {
    const blob = new Blob(chunks, { type: "video/webm" });

    // ⭐ ここがポイント
    const url = URL.createObjectURL(blob);
    video.src = url;

    document.querySelector(".save_replay").href = url;
  };

  recorder.start();
};

let stop_recording = () => {
  if (!retryToggle.checked) { return; }
  recorder.stop();
};