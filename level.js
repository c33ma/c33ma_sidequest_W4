/*
Level.js

Extended Level class for a tile-based maze game.

Tile legend:
0 = floor
1 = wall
2 = start
3 = goal (optional, not used for progression now)

4 = point (1 point)
5 = point (2 points)
6 = point (3 points)

7 = one-way tile (right only)
8 = disappearing floor
9 = gate (closed)
10 = switch (toggles gates)

Responsibilities:
- Store the grid
- Find the start tile
- Track points remaining
- Handle tile meaning queries
- Handle gate toggling + tile removal
- Draw all tiles
*/

class Level {
  constructor(grid, tileSize) {
    this.grid = grid;
    this.ts = tileSize;

    this.start = this.findStart();

    // Normalize start tile to floor
    if (this.start) {
      this.grid[this.start.r][this.start.c] = 0;
    }

    // Count points at load time
    this.remainingPoints = this.countPoints();

    // Gate state
    this.gatesOpen = false;
  }

  // ----- Size helpers -----

  rows() {
    return this.grid.length;
  }

  cols() {
    return this.grid[0].length;
  }

  pixelWidth() {
    return this.cols() * this.ts;
  }

  pixelHeight() {
    return this.rows() * this.ts;
  }

  // ----- Bounds + tile helpers -----

  inBounds(r, c) {
    return r >= 0 && c >= 0 && r < this.rows() && c < this.cols();
  }

  tileAt(r, c) {
    return this.grid[r][c];
  }

  setTile(r, c, v) {
    this.grid[r][c] = v;
  }

  // ----- Tile type checks -----

  isWall(r, c) {
    return this.tileAt(r, c) === 1;
  }

  isGate(r, c) {
    return this.tileAt(r, c) === 9 && !this.gatesOpen;
  }

  isSwitch(r, c) {
    return this.tileAt(r, c) === 10;
  }

  isOneWay(r, c) {
    return this.tileAt(r, c) === 7;
  }

  isDisappearing(r, c) {
    return this.tileAt(r, c) === 8;
  }

  isPoint(r, c) {
    const v = this.tileAt(r, c);
    return v === 4 || v === 5 || v === 6;
  }

  pointValue(r, c) {
    const v = this.tileAt(r, c);
    if (v === 4) return 1;
    if (v === 5) return 2;
    if (v === 6) return 3;
    return 0;
  }

  // ----- Points -----

  countPoints() {
    let count = 0;
    for (let r = 0; r < this.rows(); r++) {
      for (let c = 0; c < this.cols(); c++) {
        if (this.isPoint(r, c)) count++;
      }
    }
    return count;
  }

  collectPoint(r, c) {
    if (this.isPoint(r, c)) {
      this.remainingPoints--;
      this.setTile(r, c, 0);
    }
  }

  // ----- Gates -----

  toggleGates() {
    this.gatesOpen = !this.gatesOpen;
  }

  // ----- Start-finding -----

  findStart() {
    for (let r = 0; r < this.rows(); r++) {
      for (let c = 0; c < this.cols(); c++) {
        if (this.grid[r][c] === 2) {
          return { r, c };
        }
      }
    }
    return null;
  }

  // ----- Drawing -----

  draw() {
    for (let r = 0; r < this.rows(); r++) {
      for (let c = 0; c < this.cols(); c++) {
        const v = this.grid[r][c];

        // Base tile
        if (v === 1) fill(30, 50, 60);            // wall
        else if (v === 9 && !this.gatesOpen) fill(120, 60, 60); // closed gate
        else fill(230);                           // floor

        rect(c * this.ts, r * this.ts, this.ts, this.ts);

        // Points
        if (v === 4 || v === 5 || v === 6) {
          fill(255, 200 - v * 20, 80);
          circle(
            c * this.ts + this.ts / 2,
            r * this.ts + this.ts / 2,
            this.ts * (0.3 + 0.1 * v)
          );
        }

        // One-way arrow (right)
        if (v === 7) {
          fill(80, 120, 200);
          triangle(
            c * this.ts + 8,
            r * this.ts + 8,
            c * this.ts + 8,
            r * this.ts + this.ts - 8,
            c * this.ts + this.ts - 6,
            r * this.ts + this.ts / 2
          );
        }

        // Disappearing floor
        if (v === 8) {
          fill(180, 180, 180);
          rect(
            c * this.ts + 6,
            r * this.ts + 6,
            this.ts - 12,
            this.ts - 12
          );
        }

        // Switch
        if (v === 10) {
          fill(200, 120, 200);
          rect(
            c * this.ts + 6,
            r * this.ts + 6,
            this.ts - 12,
            this.ts - 12,
            6
          );
        }
      }
    }
  }
} 
