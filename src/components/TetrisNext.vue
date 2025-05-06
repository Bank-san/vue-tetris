<template>
  <canvas ref="canvas" width="100" height="300"></canvas>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { TETROMINOES } from "@/logic/tetromino";

// 仮: 固定で5個分描画確認
const queue = ["S", "L", "O", "Z", "I"];

const canvas = ref<HTMLCanvasElement | null>(null);

onMounted(() => {
  const ctx = canvas.value?.getContext("2d");
  if (!ctx) return;

  const blockSize = 20;

  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.value!.width, canvas.value!.height);

  queue.forEach((type, index) => {
    const shape = TETROMINOES[type];
    const offsetY = index * 60;

    shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          ctx.fillStyle = `hsl(${value * 50}, 70%, 60%)`;
          ctx.fillRect(
            x * blockSize,
            offsetY + y * blockSize,
            blockSize,
            blockSize
          );
          ctx.strokeStyle = "#111";
          ctx.strokeRect(
            x * blockSize,
            offsetY + y * blockSize,
            blockSize,
            blockSize
          );
        }
      });
    });
  });
});
</script>
