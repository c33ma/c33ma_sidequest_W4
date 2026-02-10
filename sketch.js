/*
Week 4 — Playable Maze (JS Arrays + Levels + Player)
Course: GBDA302
*/

const TS = 32;

// ------------------------------
// LEVEL DATA
// ------------------------------
const LEVEL_DATA = [
  [
    [1,1,1,1,1,1,1,1,1,1,1,1],
    [1,2,0,4,0,1,0,5,0,0,6,1],
    [1,0,1,1,0,1,0,1,1,0,0,1],
    [1,0,0,7,0,0,0,0,1,0,1,1],
    [1,1,0,1,1,1,0,1,1,0,0,1],
    [1,0,0,0,10,0,0,9,0,0,0,1],
    [1,0,1,1,1,1,0,1,1,1,0,1],
    [1,0,0,0,8,0,0,0,5,0,4,1],
    [1,1,1,1,1,1,1,1,1,1,1,1],
  ],
  [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,2,0,4,0,1,0,5,0,0,6,0,0,1],
    [1,0,1,1,0,1,0,1,1,0,1,1,0,1],
    [1,0,0,7,0,0,8,0,1,0,0,0,0,1],
    [1,1,0,1,1,1,0,1,1,1,1,0,1,1],
    [1,0,0,0,10,0,0,9,0,0,0,0,0,1],
    [1,0,1,1,1,1,0,1,1,1,1,1,0,1],
    [1,0,0,0,8,0,0,0,5,0,4,0,6,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  ],
];

// ------------------------------
// GAME STATE
// ------------------------------
let levels = [];
let currentLevelIndex = 0;
let player;
let score = 0;
let gameComplete = false;

// ------------------------------
// SETUP
// ------------------------------
function setup() {
  resetGame();
  noStroke();
  textFont("sans-serif");
}

// ------------------------------
// DRAW
// ------------------------------
function draw() {
  background(240);
  levels[currentLevelIndex].draw();
  player.draw();
  drawHUD();

  if (gameComplete) drawGameComplete();
}

// ------------------------------
// HUD
// ------------------------------
function drawHUD() {
  const level = levels[currentLevelIndex];

  fill(0);
  rect(0, 0, width, 32);

  fill(255);
  textSize(14);
  textAlign(LEFT, CENTER);

  text(
    `Level ${currentLevelIndex + 1}/${levels.length}   Score: ${score}   Remaining: ${level.remainingPoints}`,
    10,
    16
  );
}

// ------------------------------
// GAME COMPLETE
// ------------------------------
function drawGameComplete() {
  fill(0, 180);
  rect(0, 0, width, height);

  fill(255);
  textAlign(CENTER, CENTER);
  textSize(28);
  text("All Levels Complete!", width / 2, height / 2 - 20);
  textSize(16);
  text("Press R to restart", width / 2, height / 2 + 20);
}

// ------------------------------
// INPUT
// ------------------------------
function keyPressed() {
  if (gameComplete && (key === "r" || key === "R")) {
    resetGame();
    return;
  }

  if (gameComplete) return;

  let dr = 0;
  let dc = 0;

  if (keyCode === LEFT_ARROW || key === "a" || key === "A") dc = -1;
  else if (keyCode === RIGHT_ARROW || key === "d" || key === "D") dc = 1;
  else if (keyCode === UP_ARROW || key === "w" || key === "W") dr = -1;
  else if (keyCode === DOWN_ARROW || key === "s" || key === "S") dr = 1;
  else return;

  const level = levels[currentLevelIndex];
  const prevPoints = level.remainingPoints;

  const moved = player.tryMove(level, dr, dc);

  if (moved && level.remainingPoints < prevPoints) {
    score += 1;
  }

  if (level.remainingPoints === 0) {
    nextLevel();
  }
}

// ------------------------------
// LEVEL CONTROL
// ------------------------------
function loadLevel(index) {
  currentLevelIndex = index;
  const level = levels[currentLevelIndex];

  player.setCell(level.start ? level.start.r : 1, level.start ? level.start.c : 1);
  resizeCanvas(level.pixelWidth(), level.pixelHeight());
}

function nextLevel() {
  if (currentLevelIndex < levels.length - 1) {
    loadLevel(currentLevelIndex + 1);
  } else {
    gameComplete = true;
  }
}

// 🔁 Restart ONLY current level
function restartLevel() {
  levels[currentLevelIndex] = new Level(
    copyGrid(LEVEL_DATA[currentLevelIndex]),
    TS
  );
  loadLevel(currentLevelIndex);
}

// 🔁 Restart entire game
function resetGame() {
  levels = LEVEL_DATA.map(grid => new Level(copyGrid(grid), TS));
  player = new Player(TS);
  score = 0;
  gameComplete = false;
  loadLevel(0);
  loop();
}

// ------------------------------
// UTILITY
// ------------------------------
function copyGrid(grid) {
  return grid.map(row => row.slice());
}
 