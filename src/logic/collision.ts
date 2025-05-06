import type { Matrix, Position } from "@/types/types";

export function collide(
  board: Matrix,
  piece: Matrix,
  position: Position
): boolean {
  for (let y = 0; y < piece.length; ++y) {
    for (let x = 0; x < piece[y].length; ++x) {
      if (piece[y][x] !== 0) {
        const boardY = y + position.y;
        const boardX = x + position.x;
        if (
          boardY >= board.length ||
          boardX < 0 ||
          boardX >= board[0].length ||
          (boardY >= 0 && board[boardY][boardX] !== 0)
        ) {
          return true;
        }
      }
    }
  }
  return false;
}
