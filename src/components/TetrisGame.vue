<template>
  <v-container class="pa-4">
    <v-row>
      <v-col cols="2">
        <TetrisHold />
      </v-col>

      <v-col cols="8">
        <v-card elevation="4" class="pa-2">
          <canvas ref="canvasRef" width="300" height="600"></canvas>
          <v-card-text>
            <v-row justify="center" align="center" class="mt-2">
              <v-col cols="auto">
                <v-chip color="primary" class="ma-1"
                  >Score: {{ stats.score }}</v-chip
                >
                <v-chip color="success" class="ma-1"
                  >Lines: {{ stats.lines }}</v-chip
                >
                <v-chip color="deep-purple" class="ma-1"
                  >Level: {{ level }}</v-chip
                >
                <v-chip v-if="stats.isGameOver" color="error" class="ma-1"
                  >GAME OVER</v-chip
                >
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="2">
        <TetrisNext />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, provide, reactive, computed } from "vue";
import { Game } from "@/logic/gameLoop";
import TetrisHold from "./TetrisHold.vue";
import TetrisNext from "./TetrisNext.vue";

const canvasRef = ref<HTMLCanvasElement | null>(null);
const game = ref<Game | null>(null);
const stats = reactive({ score: 0, lines: 0, isGameOver: false });

provide("game", game);
provide("gameStats", stats);

const level = computed(() => Math.floor(stats.lines / 10) + 1);

onMounted(() => {
  if (!canvasRef.value) return;
  const ctx = canvasRef.value.getContext("2d");
  if (!ctx) return;

  game.value = new Game(ctx, stats);
  requestAnimationFrame(game.value.update.bind(game.value));
});
</script>

<style scoped>
canvas {
  background: black;
  display: block;
  margin: 0 auto;
}
</style>
