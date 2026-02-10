/*
Week 4 — Playable Maze (JS Arrays + Levels + Player)
Course: GBDA302

Controls:
- WASD / Arrow keys → Move
- R → Restart current level
- Shift + R → Restart entire game
*/

const TS = 32;

// ------------------------------
// LEVEL DATA (JS ARRAYS)
// ------------------------------
const LEVEL_DATA = [
  // ---------- LEVEL 1 ----------
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

  // ---------- LEVEL 2 (HARDER) ----------
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

// ------------------------------
// SETUP
// ------------------------------
function setup() {
  levels = LEVEL_DATA.map(grid => new Level(copyGrid(grid), TS));
  player = new Player(TS);

  loadLevel(0);

  noStroke();
  textFont("sans-serif");
}

// ------------------------------
// DRAW LOOP
// ------------------------------
function draw() {
  background(240);

  levels[currentLevelIndex].draw();
  player.draw();

  drawHUD();
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
// INPUT
// ------------------------------
function keyPressed() {

  // ---- Restart controls ----
  if (key === "r" || key === "R") {
    if (keyIsDown(SHIFT)) {
      restartGame();    // Shift + R → full reset
    } else {
      restartLevel();   // R → restart level
    }
    return;
  }

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

  // Update score if a point was collected
  if (moved && level.remainingPoints < prevPoints) {
    score += 1;
  }

  // Advance only when ALL points collected
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

  if (level.start) {
    player.setCell(level.start.r, level.start.c);
  } else {
    player.setCell(1, 1);
  }

  resizeCanvas(level.pixelWidth(), level.pixelHeight());
}

function nextLevel() {
  if (currentLevelIndex < levels.length - 1) {
    loadLevel(currentLevelIndex + 1);
  } else {
    // Game completed
    noLoop();
    console.log("All levels complete!");
  }
}

// ------------------------------
// RESTART HELPERS
// ------------------------------
function restartLevel() {
  const grid = LEVEL_DATA[currentLevelIndex];
  levels[currentLevelIndex] = new Level(copyGrid(grid), TS);
  loadLevel(currentLevelIndex);
}

function restartGame() {
  levels = LEVEL_DATA.map(grid => new Level(copyGrid(grid), TS));
  score = 0;
  loadLevel(0);
  loop();
}

// ------------------------------
// UTILITY
// ------------------------------
function copyGrid(grid) {
  return grid.map(row => row.slice());
}
