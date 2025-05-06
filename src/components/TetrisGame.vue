<template>
  <div style="display: flex; gap: 20px">
    <TetrisHold />
    <TetrisMain />
    <TetrisNext />
  </div>
</template>

<script setup lang="ts">
import TetrisMain from "./TetrisMain.vue";
import TetrisHold from "./TetrisHold.vue";
import TetrisNext from "./TetrisNext.vue";
</script>
