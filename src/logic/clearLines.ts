import type { Matrix } from "@/types/types";

export function clearLines(board: Matrix): number {
  let linesCleared = 0;
  outer: for (let y = board.length - 1; y >= 0; y--) {
    for (let x = 0; x < board[y].length; x++) {
      if (board[y][x] === 0) {
        continue outer;
      }
    }
    board.splice(y, 1);
    board.unshift(new Array(10).fill(0));
    linesCleared++;
    y++; // 再チェック
  }
  return linesCleared;
}
