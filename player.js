/*
Player.js

Extended Player class.

Responsibilities:
- Store player position
- Draw the avatar
- Attempt grid-based movement
- Interact with tiles (points, switches, disappearing floors)

Does NOT:
- Track score totals
- Switch levels
Those stay in sketch.js.
*/

class Player {
  constructor(tileSize) {
    this.ts = tileSize;

    // Grid position
    this.r = 0;
    this.c = 0;

    // Movement throttle
    this.movedAt = 0;
    this.moveDelay = 90;
  }

  setCell(r, c) {
    this.r = r;
    this.c = c;
  }

  pixelX() {
    return this.c * this.ts + this.ts / 2;
  }

  pixelY() {
    return this.r * this.ts + this.ts / 2;
  }

  draw() {
    fill(20, 120, 255);
    circle(this.pixelX(), this.pixelY(), this.ts * 0.6);
  }

  tryMove(level, dr, dc) {
    const now = millis();
    if (now - this.movedAt < this.moveDelay) return false;

    const nr = this.r + dr;
    const nc = this.c + dc;

    // Bounds + collisions
    if (!level.inBounds(nr, nc)) return false;
    if (level.isWall(nr, nc)) return false;
    if (level.isGate(nr, nc)) return false;

    // One-way tile (right only)
    if (level.isOneWay(this.r, this.c) && dc !== 1) return false;

    // ---- Move ----
    const prevR = this.r;
    const prevC = this.c;

    this.r = nr;
    this.c = nc;
    this.movedAt = now;

    // ---- Tile interactions AFTER move ----

    // Collect points
    if (level.isPoint(this.r, this.c)) {
      level.collectPoint(this.r, this.c);
    }

    // Purple switch → toggle gates
    if (level.isSwitch(this.r, this.c)) {
      level.toggleGates();
    }

    // Grey tile → RESTART LEVEL
    if (level.isDisappearing(this.r, this.c)) {
      restartLevel();
      return true;
    }

    // Disappearing floor effect (remove tile stepped off)
    if (level.isDisappearing(prevR, prevC)) {
      level.setTile(prevR, prevC, 0);
    }

    return true;
  }
}