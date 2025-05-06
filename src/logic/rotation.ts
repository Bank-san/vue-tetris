import type { Matrix } from "@/types/types";

export function rotate(matrix: Matrix, dir: 1 | -1): Matrix {
  const result = matrix.map((_, i) => matrix.map((row) => row[i]));
  return dir === 1 ? result.map((row) => row.reverse()) : result.reverse();
}
