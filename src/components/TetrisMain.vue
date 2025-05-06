<template>
  <canvas ref="canvas" width="300" height="600"></canvas>
</template>

<script setup lang="ts">
import { inject, onMounted, ref } from "vue";
import type { Ref } from "vue";
import type { Game } from "@/logic/gameLoop";

const canvas = ref<HTMLCanvasElement | null>(null);
const game = inject<Ref<Game | null>>("game");

onMounted(() => {
  if (!canvas.value || !game?.value) return;
  game.value.ctx = canvas.value.getContext("2d")!;
});
</script>
