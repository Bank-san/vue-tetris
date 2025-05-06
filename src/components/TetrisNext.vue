<template>
  <canvas ref="canvas" width="120" height="300"></canvas>
</template>

<script setup lang="ts">
import { inject, onMounted, ref } from "vue";
import type { Ref } from "vue";
import type { Game } from "@/logic/gameLoop";
import { TETROMINOES } from "@/logic/tetromino";

const game = inject<Ref<Game | null>>("game");
const canvas = ref<HTMLCanvasElement | null>(null);

function draw() {
  const ctx = canvas.value?.getContext("2d");
  if (!ctx || !game?.value) return;

  const blockSize = 20;
  const queue = game.value.queue.slice(0, 5);

  ctx.clearRect(0, 0, canvas.value!.width, canvas.value!.height);
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
}

onMounted(() => {
  const loop = () => {
    draw();
    requestAnimationFrame(loop);
  };
  loop();
});
</script>
