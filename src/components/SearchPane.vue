<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { spotifyApi, initToken } from "../api";
import PanelItem from "./PanelItem.vue";
import PanelTitle from "./PanelTitle.vue";
import ListContainer from "./ListContainer.vue";
import ListItem from "./ListItem.vue";
import { usePlaylistStore } from '../stores/playlist';

const search = ref("");
const results = ref<any>([]);
const selectedTrack = ref<any>(null);
// const selectedAlbum = ref<any>(null);

const playlistStore = usePlaylistStore();

async function searchTracks() {
  if (!search.value) {
    results.value = [];
    return;
  }
const response =await spotifyApi.searchTracks(search.value, {
    limit: 50,
    market: 'GB'
  })
  results.value = response.tracks.items;
}

function addToPlaylist() {
  if (!selectedTrack.value || !playlistStore.playlist?.id) {
    return;
  }
  playlistStore.addTrackToPlaylist(selectedTrack.value);
}

// watchEffect(async () => {
//   if (selectedTrack.value) {
//     selectedAlbum.value = await spotifyApi.getAlbum(selectedTrack.value.album.id);
//   }
// });
</script>


<template>
<div class="search-container">
  <PanelItem borderLeft>
    <PanelTitle>Search</PanelTitle>
    <input type="text" v-model="search" @keyup.enter="searchTracks" />
    <ListContainer>
      <ListItem v-for="track in results" :key="track.id" @click="selectedTrack = track">
        {{ track.name }} <em>{{ track.artists[0].name }}</em>
      </ListItem>
    </ListContainer>
        
  </PanelItem>
  <PanelItem v-if="selectedTrack" borderTop borderLeft>
    <PanelTitle>{{ selectedTrack.name }}</PanelTitle>
    <a :href="selectedTrack.external_urls.spotify" target="_blank">
    <img :src="selectedTrack.album.images[0].url" class="album-art" />
    </a>
    <p>
      <span v-for="artist in selectedTrack.artists" :key="artist.id">
        {{ artist.name }}<br>
      </span>
    </p>
    <button @click="addToPlaylist">Add to playlist</button>
    <!-- <ListContainer>
      <ListItem v-for="track in selectedAlbum.tracks.items" :key="track.id">
        {{ track.name }}
      </ListItem>
    </ListContainer> -->
  </PanelItem>
  </div>
</template>

<style scoped>
  .pane {
    width: 25rem;
  }
  .album-art {
  width: 10rem;
}
.search-container {
  display: flex;
  flex-direction: column;
}
</style>