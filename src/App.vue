<template>
  <v-app>
    <TetrisGame />
  </v-app>
</template>

<script setup lang="ts">
import { computed } from "vue";
import TetrisGame from "./components/TetrisGame.vue";
</script>

<style>
html,
body,
#app {
  margin: 0;
  padding: 0;
  height: 100%;
  background-color: #121212;
  color: white;
  font-family: "Roboto", sans-serif;
}
</style>
