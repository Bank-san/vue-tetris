import type { Matrix, Position } from "@/types/types";
import { TETROMINOES, randomTetromino } from "./tetromino";
import { collide } from "./collision";
import { rotate } from "./rotation";

const DROP_INTERVAL = 1000;

export class Game {
  ctx: CanvasRenderingContext2D;
  blockSize = 30;
  position: Position = { x: 3, y: 0 };
  piece: Matrix = randomTetromino();
  lastTime = 0;
  dropCounter = 0;
  board: Matrix = Array.from({ length: 20 }, () => Array(10).fill(0));

  update(time: number) {
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

  drop() {
    this.position.y++;
    if (collide(this.board, this.piece, this.position)) {
      this.position.y--;
      this.merge();
      this.reset();
    }
  }

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
  }

  reset() {
    this.piece = randomTetromino();
    this.position = { x: 3, y: 0 };
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
}
