<template>
  <div class="tetris-layout">
    <div class="side-panel">
      <TetrisHold />
    </div>

    <div class="main-panel">
      <div class="canvas-wrapper">
        <canvas ref="canvasRef" width="300" height="600"></canvas>

        <!-- Game Over Overlay -->
        <div class="game-over-overlay" v-if="stats.isGameOver">
          <p>🎮 GAME OVER 🎮</p>
          <button @click="retry">🔁 Retry</button>
        </div>
      </div>

      <!-- Score Info -->
      <div class="info-panel">
        <p>Score: {{ stats.score }}</p>
        <p>Lines: {{ stats.lines }}</p>
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

// リアクティブなステータス情報
const stats = reactive({
  score: 0,
  lines: 0,
  isGameOver: false,
});

const canvasRef = ref<HTMLCanvasElement | null>(null);
const game = ref<Game | null>(null);
provide("game", game);

// ゲームの初期化とスタート
onMounted(() => {
  if (!canvasRef.value) return;
  const ctx = canvasRef.value.getContext("2d");
  if (!ctx) return;

  game.value = new Game(ctx, stats);
  requestAnimationFrame(game.value.update.bind(game.value));
});

// リトライ処理
function retry() {
  if (!canvasRef.value) return;
  const ctx = canvasRef.value.getContext("2d");
  if (!ctx) return;

  stats.score = 0;
  stats.lines = 0;
  stats.isGameOver = false;

  game.value = new Game(ctx, stats);
  requestAnimationFrame(game.value.update.bind(game.value));
}
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

.canvas-wrapper {
  position: relative;
}

canvas {
  display: block;
  border: 2px solid #333;
}

.game-over-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 300px;
  height: 600px;
  background-color: rgba(0, 0, 0, 0.5); /* 半透明の黒背景 */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 1.5rem;
  gap: 10px;
}

.game-over-overlay button {
  padding: 8px 16px;
  background-color: #444;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.game-over-overlay button:hover {
  background-color: #666;
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
