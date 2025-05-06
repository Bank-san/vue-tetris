<script setup lang="ts">
import { provide, ref, onMounted } from "vue";
import TetrisMain from "./TetrisMain.vue";
import TetrisHold from "./TetrisHold.vue";
import TetrisNext from "./TetrisNext.vue";
import { Game } from "@/logic/gameLoop";

const canvasRef = ref<HTMLCanvasElement | null>(null);
const game = ref<Game | null>(null);

provide("game", game); // ← ここで共有

onMounted(() => {
  if (!canvasRef.value) return;
  const ctx = canvasRef.value.getContext("2d");
  if (!ctx) return;

  game.value = new Game(ctx);
  requestAnimationFrame(game.value.update.bind(game.value));
});
</script>

<template>
  <div class="tetris-layout">
    <div class="side-panel">
      <TetrisHold />
    </div>

    <div class="main-panel">
      <canvas ref="canvasRef" width="300" height="600"></canvas>
    </div>

    <div class="side-panel">
      <TetrisNext />
    </div>
  </div>
</template>

<style scoped>
.tetris-layout {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 20px;
  margin-top: 20px;
}

.main-panel canvas,
.side-panel canvas {
  display: block;
  background-color: black;
  border: 2px solid #333;
}
</style>
