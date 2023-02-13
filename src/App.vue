<script setup lang="ts">
import { spotifyApi, initToken } from "./api";
import type { PlaylistTrack } from "./api";
import { ref, onBeforeMount, watchEffect } from "vue";
import { usePlaylistStore } from "./stores/playlist";
import PlaylistPane from "./components/PlaylistPane.vue";
import PlaylistTrackPane from "./components/PlaylistTrackPane.vue";
import SearchPane from "./components/SearchPane.vue";
import PlaylistsPane from "./components/PlaylistsPane.vue";
import TheHeader from "./components/TheHeader.vue";
import { useUserStore } from './stores/user';

const playlistStore = usePlaylistStore();
const userStore = useUserStore();

onBeforeMount(async () => {
  initToken();
  userStore.loadUser()
});
</script>

<template>
  <div class="app">
    <TheHeader />
    <main>
      <div class="section">
        <PlaylistsPane
        />
        <PlaylistPane
          v-if="playlistStore.playlist"
        />
        <PlaylistTrackPane
          v-if="playlistStore.playlistTrack"
        />
      </div>
      <SearchPane />
    </main>
  </div>
</template>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
}
main {
  display: flex;
  justify-content: space-between;
  height: calc(100vh - 5rem);
}
.section {
  display: flex;
}
</style>

<style global>
html,
body {
  margin: 0;
  background: #181818;
  color: white;
  font-family: "Open Sans", sans-serif;
}
@media (min-width: 768px) {
  :root {
    --font-size: 14px;
  }
}
</style>
