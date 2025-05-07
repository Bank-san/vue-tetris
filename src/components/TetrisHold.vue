<template>
  <canvas ref="canvas" width="120" height="120"></canvas>
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

  const type = game.value.holdType;
  if (!type) return; // holdされてなければ描画しない

  const shape = TETROMINOES[type];
  const blockSize = 20;

  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.value.width, canvas.value.height);

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
}

onMounted(() => {
  const loop = () => {
    draw();
    requestAnimationFrame(loop);
  };
  loop();
});
</script>
