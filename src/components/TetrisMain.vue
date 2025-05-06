<template>
  <canvas ref="canvas" width="300" height="600"></canvas>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { Game } from "@/logic/gameLoop";

const canvas = ref<HTMLCanvasElement | null>(null);

onMounted(() => {
  const ctx = canvas.value?.getContext("2d");
  if (!ctx) return;

  const game = new Game(ctx);
  requestAnimationFrame(game.update.bind(game));

  // gameをPiniaやprovide/injectで共有したければここで管理可能
});
</script>
