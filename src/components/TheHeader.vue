<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { logOut } from "../api";

const user = useUserStore();
</script>

<template>
  <header>
    <h3>Playlist Manager</h3>
    <div class="controls">
      <span class="display-name">{{ user.user?.display_name }}</span>
      <img :src="user.user?.images?.[0].url" class="user" />

      <button @click="logOut" class="secondary">Log out</button>
    </div>
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
.controls {
  display: flex;
  align-items: center;
}
.display-name {
  margin-right: 1rem;
}
.user {
  width: 3rem;
  border-radius: 50%;
  margin-right: 2rem;
}
</style>
