import type { Matrix, Position } from "@/types/types";
import { TETROMINOES, randomTetromino } from "./tetromino";

const DROP_INTERVAL = 1000; // ミリ秒で落下速度

export class Game {
  ctx: CanvasRenderingContext2D;
  blockSize = 30;
  position: Position = { x: 3, y: 0 };
  piece: Matrix = randomTetromino();
  lastTime = 0;
  dropCounter = 0;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  update(time: number) {
    const deltaTime = time - this.lastTime;
    this.lastTime = time;
    this.dropCounter += deltaTime;

    if (this.dropCounter > DROP_INTERVAL) {
      this.position.y++;
      this.dropCounter = 0;
    }

    this.draw();
    requestAnimationFrame(this.update.bind(this));
  }

  draw() {
    this.ctx.fillStyle = "#000";
    this.ctx.fillRect(0, 0, 300, 600);

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
