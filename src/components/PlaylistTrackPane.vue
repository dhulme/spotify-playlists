<script setup lang="ts">
import type { PlaylistTrack } from "../api";
import { spotifyApi, initToken } from "../api";
import { usePlaylistStore } from '../stores/playlist';
import PanelItem from "./PanelItem.vue";

const playlistStore = usePlaylistStore();


function remove() {
  playlistStore.removeTrackFromPlaylist();
}

</script>

<template>
  <PanelItem v-if="playlistStore.playlistTrack">
    <h1>{{ playlistStore.playlistTrack.position }} - {{ playlistStore.playlistTrack.track.name }}</h1>
    <a :href="playlistStore.playlistTrack.track.external_urls.spotify" target="_blank">
    <img v-if="playlistStore.playlistTrack.track.album.images.length" :src="playlistStore.playlistTrack.track.album.images[0].url" class="album-art" />
    </a>
    <p>
      <span v-for="artist in playlistStore.playlistTrack.track.artists" :key="artist.id">
        {{ artist.name }}<br>
      </span>
    </p>

    <div class="buttons">
      <button class="secondary" @click="remove">Remove</button>
      <button class="secondary">Move to</button>
      <button class="secondary">Replace</button>
    </div>
  </PanelItem>
</template>

<style scoped>
.album-art {
  width: 10rem;
}
</style>