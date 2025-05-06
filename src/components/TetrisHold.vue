<template>
  <canvas ref="canvas" width="100" height="100"></canvas>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { TETROMINOES } from "@/logic/tetromino";

// 仮: 固定表示で確認する
const holdType = "T"; // ← ゲームロジックから受け取るように後で拡張

const canvas = ref<HTMLCanvasElement | null>(null);

onMounted(() => {
  const ctx = canvas.value?.getContext("2d");
  if (!ctx || !holdType) return;

  const shape = TETROMINOES[holdType];
  const blockSize = 20;

  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.value!.width, canvas.value!.height);

  shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        ctx.fillStyle = `hsl(${value * 50}, 70%, 60%)`;
        ctx.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
        ctx.strokeStyle = "#111";
        ctx.strokeRect(x * blockSize, y * blockSize, blockSize, blockSize);
      }
    });
  });
});
</script>
