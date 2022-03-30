<script setup lang="ts">
import { spotifyApi, initToken } from "./api";
import type { PlaylistTrack } from "./api";
import { ref, onBeforeMount, watchEffect } from "vue";
import PlaylistPane from "./components/PlaylistPane.vue";
import PlaylistTrackPane from "./components/PlaylistTrackPane.vue";
import SearchPane from "./components/SearchPane.vue";
import PlaylistsPane from "./components/PlaylistsPane.vue";
import TheHeader from "./components/TheHeader.vue";

const album = ref();
const playlist = ref(null);
const albumId = ref(null);
const playlistTrack = ref<PlaylistTrack | null>(null);

onBeforeMount(async () => {
  initToken();
});

watchEffect(async () => {
  if (albumId.value) {
    album.value = await spotifyApi.getAlbum(albumId.value);
    console.log("album.value", album.value);
  }
});
</script>

<template>
  <div class="app">
    <TheHeader />
    <main>
      <div class="section">
      <PlaylistsPane @playlist-selected="(_) => (playlist = _)" />
      <PlaylistPane
        v-if="playlist"
        :playlist="playlist"
        @track-selected="(track) => (playlistTrack = track)"
      />
      <PlaylistTrackPane
        v-if="playlistTrack"
        :playlistTrack="playlistTrack"
        :playlist="playlist"
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
