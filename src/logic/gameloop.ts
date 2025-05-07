import type { Matrix, Position } from "@/types/types";
import { TETROMINOES, randomTetromino } from "./tetromino";
import { collide } from "./collision";
import { rotate } from "./rotation";
import { clearLines } from "./clearLines";
import { generateQueue } from "./tetromino";
import { wallKickOffsets } from "./wallKickOffsets";

const DROP_INTERVAL = 1000;

export class Game {
  ctx: CanvasRenderingContext2D;
  stats: { score: number; lines: number; isGameOver: boolean };
  blockSize = 30;
  position: Position = { x: 3, y: 0 };
  piece: Matrix = randomTetromino();
  lastTime = 0;
  dropCounter = 0;
  board: Matrix = Array.from({ length: 20 }, () => Array(10).fill(0));
  isGameOver = false;
  pieceType: string = "";
  queue: string[] = [...generateQueue(), ...generateQueue()];
  holdType: string | null = null;
  canHold: boolean = true;

  getGhostPosition(): Position {
    const ghost = { ...this.position };
    while (!collide(this.board, this.piece, ghost)) {
      ghost.y++;
    }
    ghost.y--;
    return ghost;
  }

  update(time: number) {
    if (this.isGameOver) {
      this.drawGameOver();
      return;
    }

    const deltaTime = time - this.lastTime;
    this.lastTime = time;
    this.dropCounter += deltaTime;

    if (this.dropCounter > DROP_INTERVAL) {
      this.drop();
      this.dropCounter = 0;
    }

    this.draw();
    requestAnimationFrame(this.update.bind(this));
  }

  drawGameOver() {
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    this.ctx.fillRect(0, 0, 300, 600);
  }

  drop() {
    this.position.y++;
    if (collide(this.board, this.piece, this.position)) {
      this.position.y--;
      this.merge();
      this.reset();
    }
  }

  reset() {
    this.canHold = true;
    this.pieceType = this.queue.shift()!;
    if (this.queue.length < 7) {
      this.queue.push(...generateQueue());
    }
    this.piece = TETROMINOES[this.pieceType];
    this.position = { x: 3, y: 0 };

    if (collide(this.board, this.piece, this.position)) {
      this.isGameOver = true;
      this.stats.isGameOver = true;
    }
  }

  constructor(
    ctx: CanvasRenderingContext2D,
    stats: { score: number; lines: number; isGameOver: boolean }
  ) {
    this.ctx = ctx;
    this.stats = stats;
    this.registerEvents();
  }

  registerEvents() {
    window.addEventListener("keydown", (e) => {
      switch (e.code) {
        case "ArrowLeft":
          this.move(-1);
          break;
        case "ArrowRight":
          this.move(1);
          break;
        case "ArrowDown":
          this.drop();
          break;
        case "Space":
          this.hardDrop();
          break;
        case "KeyZ":
          this.rotatePiece(-1);
          break;
        case "KeyX":
          this.rotatePiece(1);
          break;
        case "KeyC":
          this.hold();
          break;
      }
    });
  }

  hold() {
    if (!this.canHold) return;

    const temp = this.holdType;
    this.holdType = this.pieceType;

    if (temp) {
      this.pieceType = temp;
      this.piece = TETROMINOES[this.pieceType];
    } else {
      this.pieceType = this.queue.shift()!;
      if (this.queue.length < 7) {
        this.queue.push(...generateQueue());
      }
      this.piece = TETROMINOES[this.pieceType];
    }

    this.position = { x: 3, y: 0 };
    this.canHold = false;
  }

  move(dir: -1 | 1) {
    this.position.x += dir;
    if (collide(this.board, this.piece, this.position)) {
      this.position.x -= dir;
    }
  }

  rotatePiece(dir: 1 | -1) {
    const original = this.piece;
    const rotated = rotate(this.piece, dir);

    for (const offset of wallKickOffsets) {
      const newPos = {
        x: this.position.x + offset.x,
        y: this.position.y + offset.y,
      };

      if (!collide(this.board, rotated, newPos)) {
        this.piece = rotated;
        this.position = newPos;
        return;
      }
    }

    // 回転できない場合は元に戻す
    this.piece = original;
  }

  isTSpin(): boolean {
    if (this.pieceType !== "T") return false;

    const { x, y } = this.position;
    const corners = [
      this.board[y - 1]?.[x - 1],
      this.board[y - 1]?.[x + 1],
      this.board[y + 1]?.[x - 1],
      this.board[y + 1]?.[x + 1],
    ];

    const filled = corners.filter((v) => v !== 0 && v !== undefined).length;
    return filled >= 3;
  }

  hardDrop() {
    while (!collide(this.board, this.piece, this.position)) {
      this.position.y++;
    }
    this.position.y--;
    this.merge();
    this.reset();
  }

  draw() {
    this.ctx.fillStyle = "#000";
    this.ctx.fillRect(0, 0, 500, 600); // ← widthを500に

    this.drawMatrix(this.board, { x: 0, y: 0 });

    const ghost = this.getGhostPosition();
    this.drawMatrix(this.piece, ghost, true);

    this.drawMatrix(this.piece, this.position);

    for (let i = 0; i < 5; i++) {
      const type = this.queue[i];
      const shape = TETROMINOES[type];
      this.drawMatrix(shape, { x: 11, y: 1 + i * 3 }, false, 0.5);
    }

    if (this.holdType) {
      const shape = TETROMINOES[this.holdType];
      this.drawMatrix(shape, { x: -4, y: 2 }, false, 0.5);
    }
  }

  drawMatrix(matrix: Matrix, pos: Position, isGhost = false, alpha = 1) {
    matrix.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          this.ctx.globalAlpha = alpha;
          this.ctx.fillStyle = isGhost
            ? "rgba(255, 255, 255, 0.2)"
            : `hsl(${value * 50}, 70%, 60%)`;
          this.ctx.fillRect(
            (x + pos.x) * this.blockSize,
            (y + pos.y) * this.blockSize,
            this.blockSize,
            this.blockSize
          );
          this.ctx.strokeStyle = "#111";
          this.ctx.strokeRect(
            (x + pos.x) * this.blockSize,
            (y + pos.y) * this.blockSize,
            this.blockSize,
            this.blockSize
          );
          this.ctx.globalAlpha = 1;
        }
      });
    });
  }

  score = 0;

  merge() {
    this.piece.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          const boardY = y + this.position.y;
          const boardX = x + this.position.x;
          this.board[boardY][boardX] = value;
        }
      });
    });

    const lines = clearLines(this.board);
    const isTSpin = this.isTSpin();

    if (lines > 0) {
      if (isTSpin) {
        console.log(`T-SPIN! lines: ${lines}`);
      }

      const gained = this.calculateScore(lines, isTSpin);
      this.stats.score += gained;
      this.stats.lines += lines;
      console.log(`Score: ${this.stats.score} (+${gained})`);
    }
  }

  calculateScore(lines: number, tSpin = false): number {
    if (tSpin) {
      if (lines === 1) return 800;
      if (lines === 2) return 1200;
      if (lines === 3) return 1600;
    }

    if (lines === 1) return 100;
    if (lines === 2) return 300;
    if (lines === 3) return 500;
    if (lines === 4) return 800;

    return 0; // ← これだけが本当の fallback
  }
}
