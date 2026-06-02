/* ==========================================
   RUCHI FOOTBALL ARCADE - GAME ENGINES
   ========================================== */

let activeGame = null; // 'penalty' or 'runner'
let canvas = null;
let ctx = null;
let animationFrameId = null;
let gameInterval = null;

// Game State vars
let gameScore = 0;
let gameTimer = 30;
let gameRunning = false;

// Penalty Shootout variables
let goalkeeper = { x: 400, y: 150, radius: 25, speed: 4, direction: 1 };
let ball = { x: 400, y: 380, targetX: 400, targetY: 380, radius: 12, speed: 18, isKicked: false, scale: 1 };
let goalNet = { x: 150, y: 80, width: 500, height: 180 };
let shotStatusText = "";
let shotStatusTime = 0;

// Runner variables
let runnerPlayer = { lane: 1, targetX: 400, x: 400, y: 360, radius: 20 };
let runnerLanes = [250, 400, 550]; // X positions for 3 lanes
let obstacles = []; // { x, y, type: 'cone'|'defender', radius }
let collectibles = []; // { x, y, type: 'ball'|'drink', radius }
let gameSpeed = 4;
let obstacleSpawnTimer = 0;
let collectibleSpawnTimer = 0;
let runnerMultiplier = 1;
let multiplierTimer = 0;

// --- Launch Game Interface ---
window.launchGame = function(gameKey) {
  activeGame = gameKey;
  
  // Show Modal
  const modal = document.getElementById("game-modal");
  modal.style.display = "flex";
  
  canvas = document.getElementById("game-canvas");
  ctx = canvas.getContext("2d");
  
  // Reset HUD
  document.getElementById("hud-score").innerText = "0";
  document.getElementById("hud-timer-wrap").style.display = gameKey === "penalty" ? "flex" : "none";
  document.getElementById("hud-timer").innerText = gameKey === "penalty" ? "30" : "";
  
  // Start overlay
  const overlay = document.getElementById("game-start-overlay");
  overlay.style.display = "flex";
  document.getElementById("game-result-overlay").style.display = "none";
  
  if (gameKey === "penalty") {
    document.getElementById("game-title").innerText = "Penalty Shootout Challenge ⚽";
    document.getElementById("start-overlay-title").innerText = "Ready to Shoot?";
    document.getElementById("start-overlay-desc").innerText = "Use your mouse/touch to aim inside the net. Click to take a shot! Target the top corners for a bonus, but avoid the goalkeeper!";
  } else {
    document.getElementById("game-title").innerText = "Football Runner Challenge 🏃";
    document.getElementById("start-overlay-title").innerText = "Sprint down the Pitch!";
    document.getElementById("start-overlay-desc").innerText = "Use Left/Right Arrow keys (or tap Left/Right side of screen) to switch lanes. Dodge defender cones and collect golden footballs + energy drinks!";
  }
  
  // Draw static preview
  drawStaticPreview();
};

window.closeGameModal = function() {
  gameRunning = false;
  activeGame = null;
  
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
  if (gameInterval) clearInterval(gameInterval);
  if (canvas) {
    canvas.removeEventListener("mousedown", handleCanvasClick);
    canvas.removeEventListener("touchstart", handleCanvasTouch);
  }
  
  const modal = document.getElementById("game-modal");
  modal.style.display = "none";
};

window.startGameLoop = function() {
  document.getElementById("game-start-overlay").style.display = "none";
  gameRunning = true;
  gameScore = 0;
  
  // Bind input listeners
  canvas.removeEventListener("mousedown", handleCanvasClick);
  canvas.removeEventListener("touchstart", handleCanvasTouch);
  window.removeEventListener("keydown", handleKeyDown);
  
  if (activeGame === "penalty") {
    initPenaltyGame();
    canvas.addEventListener("mousedown", handleCanvasClick);
    canvas.addEventListener("touchstart", handleCanvasTouch, { passive: false });
  } else {
    initRunnerGame();
    canvas.addEventListener("mousedown", handleCanvasClick);
    canvas.addEventListener("touchstart", handleCanvasTouch, { passive: false });
    window.addEventListener("keydown", handleKeyDown);
  }
  
  // Start ticks
  runGameLoop();
};

window.restartGame = function() {
  document.getElementById("game-result-overlay").style.display = "none";
  startGameLoop();
};

// --- Main Game Loop Runner ---
function runGameLoop() {
  if (!gameRunning) return;
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  if (activeGame === "penalty") {
    updatePenalty();
    drawPenalty();
  } else {
    updateRunner();
    drawRunner();
  }
  
  animationFrameId = requestAnimationFrame(runGameLoop);
}

// --- PENALTY SHOOTOUT ---
function initPenaltyGame() {
  gameTimer = 30;
  goalkeeper = { x: 400, y: 150, radius: 30, speed: 4.5, direction: 1 };
  resetBall();
  shotStatusText = "";
  shotStatusTime = 0;
  
  // Clock tick
  if (gameInterval) clearInterval(gameInterval);
  gameInterval = setInterval(() => {
    if (gameRunning) {
      gameTimer--;
      document.getElementById("hud-timer").innerText = gameTimer;
      if (gameTimer <= 0) {
        endGame();
      }
    }
  }, 1000);
}

function resetBall() {
  ball.x = 400;
  ball.y = 390;
  ball.targetX = 400;
  ball.targetY = 390;
  ball.isKicked = false;
  ball.scale = 1;
}

function updatePenalty() {
  // Move Goalkeeper
  goalkeeper.x += goalkeeper.speed * goalkeeper.direction;
  if (goalkeeper.x > goalNet.x + goalNet.width - goalkeeper.radius || goalkeeper.x < goalNet.x + goalkeeper.radius) {
    goalkeeper.direction *= -1;
  }
  
  // Move kicked ball
  if (ball.isKicked) {
    const dx = ball.targetX - ball.x;
    const dy = ball.targetY - ball.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    // Scale ball down to simulate depth
    ball.scale = Math.max(0.4, ball.scale - 0.025);
    
    if (dist < ball.speed) {
      ball.x = ball.targetX;
      ball.y = ball.targetY;
      checkGoalResult();
    } else {
      ball.x += (dx / dist) * ball.speed;
      ball.y += (dy / dist) * ball.speed;
    }
  }
  
  if (shotStatusTime > 0) {
    shotStatusTime--;
  }
}

function checkGoalResult() {
  const goalX = ball.x;
  const goalY = ball.y;
  
  // Check collision with goalkeeper radius
  const gkDx = goalkeeper.x - goalX;
  const gkDy = goalkeeper.y - goalY;
  const gkDist = Math.sqrt(gkDx * gkDx + gkDy * gkDy);
  
  if (gkDist < goalkeeper.radius + ball.radius) {
    // Saved!
    shotStatusText = "SAVED! 🧤";
    shotStatusTime = 40;
    // Increase goalie speed slightly to make it progressively harder
    goalkeeper.speed = Math.min(8, goalkeeper.speed + 0.3);
  } else {
    // Goal! Check if inside Net bounding box
    if (goalX >= goalNet.x && goalX <= goalNet.x + goalNet.width &&
        goalY >= goalNet.y && goalY <= goalNet.y + goalNet.height) {
      
      // Check top corner bonus (close to top corners)
      const distTopLeft = Math.sqrt(Math.pow(goalX - goalNet.x, 2) + Math.pow(goalY - goalNet.y, 2));
      const distTopRight = Math.sqrt(Math.pow(goalX - (goalNet.x + goalNet.width), 2) + Math.pow(goalY - goalNet.y, 2));
      
      if (distTopLeft < 70 || distTopRight < 70) {
        shotStatusText = "TOP CORNER! +150 🚀";
        gameScore += 150;
      } else {
        shotStatusText = "GOAL! +100 ⚽";
        gameScore += 100;
      }
      shotStatusTime = 40;
      document.getElementById("hud-score").innerText = gameScore;
    } else {
      shotStatusText = "MISSED! ❌";
      shotStatusTime = 40;
    }
  }
  
  setTimeout(resetBall, 800);
}

function drawPenalty() {
  // 1. Draw Field Green Grass Gradients
  const pitchGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  pitchGrad.addColorStop(0, '#103010');
  pitchGrad.addColorStop(0.3, '#1e541b');
  pitchGrad.addColorStop(1, '#0cf25d');
  ctx.fillStyle = pitchGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw white lines
  ctx.strokeStyle = "rgba(255,255,255,0.4)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  // Penalty area line arc
  ctx.arc(400, 390, 80, Math.PI, 0);
  ctx.stroke();
  
  // 2. Draw Net / Goalpost
  // Net meshes
  ctx.fillStyle = "rgba(255,255,255,0.15)";
  ctx.fillRect(goalNet.x, goalNet.y, goalNet.width, goalNet.height);
  
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 6;
  ctx.strokeRect(goalNet.x, goalNet.y, goalNet.width, goalNet.height);
  
  // Net grids drawing
  ctx.strokeStyle = "rgba(255,255,255,0.1)";
  ctx.lineWidth = 1;
  for (let x = goalNet.x; x < goalNet.x + goalNet.width; x += 20) {
    ctx.beginPath();
    ctx.moveTo(x, goalNet.y);
    ctx.lineTo(x, goalNet.y + goalNet.height);
    ctx.stroke();
  }
  for (let y = goalNet.y; y < goalNet.y + goalNet.height; y += 20) {
    ctx.beginPath();
    ctx.moveTo(goalNet.x, y);
    ctx.lineTo(goalNet.x + goalNet.width, y);
    ctx.stroke();
  }
  
  // Highlight target corners
  ctx.fillStyle = "rgba(255, 229, 0, 0.25)";
  ctx.beginPath();
  ctx.arc(goalNet.x + 30, goalNet.y + 30, 25, 0, Math.PI * 2);
  ctx.arc(goalNet.x + goalNet.width - 30, goalNet.y + 30, 25, 0, Math.PI * 2);
  ctx.fill();
  
  // 3. Draw Goalkeeper
  ctx.fillStyle = "#ff3366";
  ctx.shadowColor = "#ff3366";
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.arc(goalkeeper.x, goalkeeper.y, goalkeeper.radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0; // Reset
  
  // Goalkeeper jersey number or eyes
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 14px 'Outfit'";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("GK", goalkeeper.x, goalkeeper.y);
  
  // 4. Draw Ball
  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius * ball.scale, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  
  // Ball lines details
  ctx.strokeStyle = "rgba(0,0,0,0.5)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, (ball.radius * ball.scale) / 2, 0, Math.PI * 2);
  ctx.stroke();
  
  // 5. Draw Shot status text
  if (shotStatusTime > 0) {
    ctx.fillStyle = shotStatusText.includes("GOAL") ? "#ff9900" : shotStatusText.includes("SAVED") ? "#ff3366" : "#ffffff";
    ctx.font = "900 24px 'Syncopate'";
    ctx.textAlign = "center";
    ctx.fillText(shotStatusText, 400, 60);
  }
}

function handleCanvasClick(e) {
  if (!gameRunning || ball.isKicked) return;
  
  // Get click coordinate relative to canvas
  const rect = canvas.getBoundingClientRect();
  const clickX = ((e.clientX - rect.left) / rect.width) * canvas.width;
  const clickY = ((e.clientY - rect.top) / rect.height) * canvas.height;
  
  // Trigger kick
  ball.targetX = clickX;
  ball.targetY = clickY;
  ball.isKicked = true;
}

// --- RUNNER GAME ---
function initRunnerGame() {
  runnerPlayer = { lane: 1, targetX: runnerLanes[1], x: runnerLanes[1], y: 360, radius: 18 };
  obstacles = [];
  collectibles = [];
  gameSpeed = 5;
  obstacleSpawnTimer = 0;
  collectibleSpawnTimer = 0;
  runnerMultiplier = 1;
  multiplierTimer = 0;
  
  if (gameInterval) clearInterval(gameInterval);
}

function updateRunner() {
  // Smoothly slide player towards target lane X coordinate
  const dx = runnerPlayer.targetX - runnerPlayer.x;
  runnerPlayer.x += dx * 0.25;
  
  // Spawn obstacles
  obstacleSpawnTimer++;
  if (obstacleSpawnTimer > 70 / (gameSpeed * 0.2)) {
    obstacleSpawnTimer = 0;
    const laneIdx = Math.floor(Math.random() * 3);
    const type = Math.random() > 0.5 ? 'cone' : 'defender';
    obstacles.push({
      x: runnerLanes[laneIdx],
      y: -30,
      radius: type === 'cone' ? 14 : 20,
      type: type
    });
  }
  
  // Spawn collectibles
  collectibleSpawnTimer++;
  if (collectibleSpawnTimer > 50 / (gameSpeed * 0.2)) {
    collectibleSpawnTimer = 0;
    const laneIdx = Math.floor(Math.random() * 3);
    const type = Math.random() > 0.85 ? 'drink' : 'ball';
    collectibles.push({
      x: runnerLanes[laneIdx],
      y: -30,
      radius: 12,
      type: type
    });
  }
  
  // Speed up game gradually
  gameSpeed += 0.0015;
  
  // Update multiplier duration
  if (multiplierTimer > 0) {
    multiplierTimer--;
    if (multiplierTimer <= 0) {
      runnerMultiplier = 1;
    }
  }
  
  // Update obstacles
  for (let i = obstacles.length - 1; i >= 0; i--) {
    obstacles[i].y += gameSpeed;
    
    // Check Collision with player
    const dist = Math.sqrt(Math.pow(obstacles[i].x - runnerPlayer.x, 2) + Math.pow(obstacles[i].y - runnerPlayer.y, 2));
    if (dist < obstacles[i].radius + runnerPlayer.radius) {
      endGame();
      return;
    }
    
    // Remove if off-screen
    if (obstacles[i].y > canvas.height + 30) {
      obstacles.splice(i, 1);
    }
  }
  
  // Update collectibles
  for (let i = collectibles.length - 1; i >= 0; i--) {
    collectibles[i].y += gameSpeed;
    
    // Check collection
    const dist = Math.sqrt(Math.pow(collectibles[i].x - runnerPlayer.x, 2) + Math.pow(collectibles[i].y - runnerPlayer.y, 2));
    if (dist < collectibles[i].radius + runnerPlayer.radius) {
      if (collectibles[i].type === 'ball') {
        gameScore += 50 * runnerMultiplier;
      } else {
        // Energy drink gives 2x score and speed boost
        runnerMultiplier = 2;
        multiplierTimer = 200; // frames
        gameScore += 100;
      }
      document.getElementById("hud-score").innerText = gameScore;
      collectibles.splice(i, 1);
    } else if (collectibles[i].y > canvas.height + 30) {
      collectibles.splice(i, 1);
    }
  }
}

function drawRunner() {
  // 1. Draw Scrolling Turf Lanes
  ctx.fillStyle = "#1e541b";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Perspective pitch stripes
  ctx.fillStyle = "#143a12";
  for (let y = 0; y < canvas.height; y += 80) {
    if (Math.floor(y / 80) % 2 === 0) {
      ctx.fillRect(0, y, canvas.width, 40);
    }
  }
  
  // Lane Dividers
  ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
  ctx.lineWidth = 4;
  
  // Lane X dividers lines
  ctx.beginPath();
  ctx.moveTo(320, 0); ctx.lineTo(320, canvas.height);
  ctx.moveTo(480, 0); ctx.lineTo(480, canvas.height);
  ctx.stroke();
  
  // Draw side boundaries
  ctx.strokeStyle = "rgba(255,255,255,0.4)";
  ctx.beginPath();
  ctx.moveTo(170, 0); ctx.lineTo(170, canvas.height);
  ctx.moveTo(630, 0); ctx.lineTo(630, canvas.height);
  ctx.stroke();
  
  // 2. Draw Collectibles
  collectibles.forEach(col => {
    if (col.type === 'ball') {
      ctx.fillStyle = "#ffc107"; // Gold Soccer Ball
      ctx.shadowColor = "#ffc107";
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(col.x, col.y, col.radius, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Energy Drink
      ctx.fillStyle = "#d80027"; // Ruchi Red Can
      ctx.shadowColor = "#d80027";
      ctx.shadowBlur = 10;
      ctx.fillRect(col.x - 7, col.y - 12, 14, 24);
    }
    ctx.shadowBlur = 0; // Reset
  });
  
  // 3. Draw Obstacles (Cones / Defender blocks)
  obstacles.forEach(obs => {
    if (obs.type === 'cone') {
      ctx.fillStyle = "#ff3366"; // Crimson Cone
      ctx.beginPath();
      ctx.moveTo(obs.x, obs.y - obs.radius);
      ctx.lineTo(obs.x + obs.radius, obs.y + obs.radius);
      ctx.lineTo(obs.x - obs.radius, obs.y + obs.radius);
      ctx.closePath();
      ctx.fill();
    } else {
      // Defender blocker
      ctx.fillStyle = "#708090"; // Solid Grey Block
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#ffffff";
      ctx.strokeRect(obs.x - obs.radius, obs.y - 12, obs.radius * 2, 24);
      ctx.fillRect(obs.x - obs.radius, obs.y - 12, obs.radius * 2, 24);
    }
  });
  
  // 4. Draw Player Striker
  ctx.fillStyle = "#ff9900"; // Ruchi Orange
  ctx.shadowColor = "#ff9900";
  ctx.shadowBlur = 12;
  ctx.beginPath();
  ctx.arc(runnerPlayer.x, runnerPlayer.y, runnerPlayer.radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0; // Reset
  
  // Jersey details on player
  ctx.fillStyle = "#000000";
  ctx.font = "900 12px 'Outfit'";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("10", runnerPlayer.x, runnerPlayer.y);
  
  // Show Multiplier text
  if (runnerMultiplier > 1) {
    ctx.fillStyle = "#ffe500";
    ctx.font = "900 18px 'Syncopate'";
    ctx.textAlign = "right";
    ctx.fillText("2X MULTIPLIER ⚡", 620, 400);
  }
}

function handleKeyDown(e) {
  if (!gameRunning) return;
  
  if (e.key === "ArrowLeft" || e.key === "a") {
    if (runnerPlayer.lane > 0) {
      runnerPlayer.lane--;
      runnerPlayer.targetX = runnerLanes[runnerPlayer.lane];
    }
  } else if (e.key === "ArrowRight" || e.key === "d") {
    if (runnerPlayer.lane < 2) {
      runnerPlayer.lane++;
      runnerPlayer.targetX = runnerLanes[runnerPlayer.lane];
    }
  }
}

// Mobile/Mouse touch click runner lane swerve
function handleCanvasClickRunner(clientX, rectWidth) {
  // If clicked left side of screen
  if (clientX < rectWidth / 2) {
    if (runnerPlayer.lane > 0) {
      runnerPlayer.lane--;
      runnerPlayer.targetX = runnerLanes[runnerPlayer.lane];
    }
  } else {
    // Clicked right side
    if (runnerPlayer.lane < 2) {
      runnerPlayer.lane++;
      runnerPlayer.targetX = runnerLanes[runnerPlayer.lane];
    }
  }
}

// Override general click handler if runner is active
function handleCanvasClick(e) {
  const rect = canvas.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  
  if (activeGame === "penalty") {
    const targetX = (clickX / rect.width) * canvas.width;
    const clickY = ((e.clientY - rect.top) / rect.height) * canvas.height;
    if (!ball.isKicked) {
      ball.targetX = targetX;
      ball.targetY = clickY;
      ball.isKicked = true;
    }
  } else if (activeGame === "runner") {
    handleCanvasClickRunner(clickX, rect.width);
  }
}

function handleCanvasTouch(e) {
  if (!e.touches || e.touches.length === 0) return;
  e.preventDefault();
  handleCanvasClick(e.touches[0]);
}

// --- End Game State Manager ---
function endGame() {
  gameRunning = false;
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
  if (gameInterval) clearInterval(gameInterval);
  
  // Submit score back to core state
  if (window.onGameFinished) {
    window.onGameFinished(activeGame, Math.floor(gameScore));
  }
}

// --- Draw Static Game Previews ---
function drawStaticPreview() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Pitch Grass
  ctx.fillStyle = "#1e541b";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Goal details
  ctx.fillStyle = "rgba(255,255,255,0.1)";
  ctx.fillRect(goalNet.x, goalNet.y, goalNet.width, goalNet.height);
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 4;
  ctx.strokeRect(goalNet.x, goalNet.y, goalNet.width, goalNet.height);
  
  // Text instructions
  ctx.fillStyle = "#ffffff";
  ctx.font = "900 28px 'Syncopate'";
  ctx.textAlign = "center";
  ctx.fillText("RUCHI FOOTBALL ARCADE", 400, 220);
  
  ctx.fillStyle = varColorText();
  ctx.font = "bold 14px 'Outfit'";
  ctx.fillText("PRESS 'KICK OFF' TO START GAME", 400, 260);
}

function varColorText() {
  return activeGame === "penalty" ? "#ff9900" : "#ffe500";
}
