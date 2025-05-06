import type { Matrix, Position } from "@/types/types";
import { TETROMINOES, randomTetromino } from "./tetromino";
import { collide } from "./collision";
import { rotate } from "./rotation";
import { clearLines } from "./clearLines";

const DROP_INTERVAL = 1000;

export class Game {
  ctx: CanvasRenderingContext2D;
  blockSize = 30;
  position: Position = { x: 3, y: 0 };
  piece: Matrix = randomTetromino();
  lastTime = 0;
  dropCounter = 0;
  board: Matrix = Array.from({ length: 20 }, () => Array(10).fill(0));
  isGameOver = false;

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

    this.ctx.fillStyle = "white";
    this.ctx.font = "24px sans-serif";
    this.ctx.textAlign = "center";
    this.ctx.fillText("GAME OVER", 150, 300);
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
    this.piece = randomTetromino();
    this.position = { x: 3, y: 0 };

    if (collide(this.board, this.piece, this.position)) {
      this.isGameOver = true;
      console.log("Game Over");
    }
  }

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
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
      }
    });
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
    this.piece = rotated;
    if (collide(this.board, this.piece, this.position)) {
      this.piece = original;
    }
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
    this.ctx.fillRect(0, 0, 300, 600);

    this.drawMatrix(this.board, { x: 0, y: 0 });
    this.drawMatrix(this.piece, this.position);
  }

  drawMatrix(matrix: Matrix, pos: Position) {
    matrix.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          this.ctx.fillStyle = `hsl(${value * 50}, 70%, 60%)`;
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
    if (lines > 0) {
      this.score += this.calculateScore(lines);
      console.log(`Score: ${this.score}`);
    }
  }

  calculateScore(lines: number): number {
    switch (lines) {
      case 1:
        return 100;
      case 2:
        return 300;
      case 3:
        return 500;
      case 4:
        return 800;
      default:
        return 0;
    }
  }
}
