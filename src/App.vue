<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div id="app">
    <RouterView />
  </div>
</template>

<style lang="scss">
@import './app/styles/main.scss';

#app {
  min-height: 100vh;
  font-family: $font-family-base;
  color: $text-primary;
  background-color: $background-color;
}
</style>
