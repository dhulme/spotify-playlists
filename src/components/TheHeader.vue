<script setup lang="ts">
import { logOut } from '../api';
</script>

<template>
  <header>
    <h3>Playlist Manager</h3>
    <button @click="logOut" class="secondary">Log out</button>
  </header>
</template>

<style scoped>
header {
  height: 5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 1rem;
}
h3 {
  margin-bottom: 0;
}
button {
  width: 8rem;
  margin: 0;
}
</style>