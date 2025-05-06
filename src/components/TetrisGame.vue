<template>
  <div class="tetris-layout">
    <div class="side-panel">
      <TetrisHold />
    </div>

    <div class="main-panel">
      <canvas ref="canvasRef" width="300" height="600"></canvas>
      <div class="info-panel">
        <p>Score: {{ stats.score }}</p>
        <p>Lines: {{ stats.lines }}</p>
        <p v-if="stats.isGameOver">🎮 GAME OVER 🎮</p>
      </div>
    </div>

    <div class="side-panel">
      <TetrisNext />
    </div>
  </div>
</template>

<script setup lang="ts">
import { provide, ref, onMounted, reactive } from "vue";
import TetrisHold from "./TetrisHold.vue";
import TetrisNext from "./TetrisNext.vue";
import { Game } from "@/logic/gameLoop";

// ゲームステータスをリアクティブに保持
const stats = reactive({
  score: 0,
  lines: 0,
  isGameOver: false,
});

const canvasRef = ref<HTMLCanvasElement | null>(null);
const game = ref<Game | null>(null);
provide("game", game); // 他コンポーネントにも共有

onMounted(() => {
  if (!canvasRef.value) return;
  const ctx = canvasRef.value.getContext("2d");
  if (!ctx) return;

  game.value = new Game(ctx, stats);
  requestAnimationFrame(game.value.update.bind(game.value));
});
</script>

<style scoped>
.tetris-layout {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 20px;
  padding: 20px;
  color: white;
  font-family: sans-serif;
}

.side-panel,
.main-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.info-panel {
  margin-top: 10px;
  text-align: center;
  background: #111;
  padding: 10px;
  border-radius: 8px;
  width: 300px;
}
</style>
