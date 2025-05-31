// Doom Mini FPS (기관차 버전) - Helpy
const doomGameHTML = `
  <div id="doom-modal-bg"></div>
  <div id="doom-modal">
    <canvas id="doom-canvas" width="480" height="320"></canvas>
    <div id="doom-ui">
      <button id="doom-close">❌ 닫기</button>
      <div id="doom-status"></div>
      <div>← →로 이동, ↑/Space로 전진</div>
    </div>
  </div>
`;

function showDoomGame() {
  if(document.getElementById('doom-modal')) return;
  document.body.insertAdjacentHTML('beforeend', doomGameHTML);
  document.getElementById('doom-close').onclick = closeDoomGame;
  doomMain();
}
function closeDoomGame() {
  document.getElementById('doom-modal').remove();
  document.getElementById('doom-modal-bg').remove();
}

function doomMain() {
  const canvas = document.getElementById('doom-canvas');
  const ctx = canvas.getContext('2d');
  const status = document.getElementById('doom-status');
  const TRACK_LENGTH = 40;
  const TRACK_WIDTH = 5;
  const VIEW_DEPTH = 8;
  let running = true;
  let player = { x: 2, y: 0 };
  let train = { y: -6 };
  let keys = {};
  function draw3DTrack() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let depth = 1; depth <= VIEW_DEPTH; depth++) {
      const y = player.y + depth;
      if (y >= TRACK_LENGTH) continue;
      const scale = 1 / depth;
      const trackW = canvas.width * 0.7 * scale;
      const trackX = (canvas.width - trackW) / 2;
      const trackY = canvas.height * 0.2 + depth * 32 * scale;
      ctx.fillStyle = '#888';
      ctx.fillRect(trackX, trackY, trackW, 18 * scale);
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2 * scale;
      ctx.strokeRect(trackX, trackY, trackW, 18 * scale);
      if (depth === 1) {
        ctx.fillStyle = '#6cf';
        ctx.beginPath();
        ctx.arc(canvas.width / 2 + (player.x - 2) * 30, trackY + 9 * scale, 12 * scale, 0, 2 * Math.PI);
        ctx.fill();
      }
      if (y === Math.round(train.y)) {
        ctx.fillStyle = '#f33';
        ctx.fillRect(trackX + trackW * 0.2, trackY - 16 * scale, trackW * 0.6, 30 * scale);
        ctx.fillStyle = '#fff';
        ctx.font = `${16 * scale}px Arial`;
        ctx.fillText('🚂', canvas.width / 2 - 10 * scale, trackY);
      }
    }
  }
  function update() {
    if (!running) return;
    if (keys['ArrowLeft'] && player.x > 0) player.x--;
    if (keys['ArrowRight'] && player.x < TRACK_WIDTH - 1) player.x++;
    if (keys['ArrowUp'] || keys[' '] ) player.y++;
    train.y += 0.6;
    if (Math.round(train.y) >= player.y && Math.abs(player.x - 2) < 2) {
      running = false;
      status.textContent = '기관차에 잡혔어요! 게임 오버!';
    }
    if (player.y >= TRACK_LENGTH - 1) {
      running = false;
      status.textContent = '탈출 성공! 축하합니다!';
    }
  }
  function gameLoop() {
    if (running) {
      update();
      draw3DTrack();
      requestAnimationFrame(gameLoop);
    } else {
      draw3DTrack();
    }
  }
  window.addEventListener('keydown', doomKeydown);
  window.addEventListener('keyup', doomKeyup);
  function doomKeydown(e){ keys[e.key]=true; }
  function doomKeyup(e){ keys[e.key]=false; }
  draw3DTrack();
  gameLoop();
}

// 버튼 이벤트 연결
window.addEventListener('DOMContentLoaded', () => {
  const doomBtn = document.getElementById('play-doom-btn');
  if(doomBtn) doomBtn.onclick = showDoomGame;
});
