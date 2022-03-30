<script setup lang="ts">
import type { PlaylistTrack } from "../api";
import { spotifyApi, initToken } from "../api";
import PaneItem from "./PaneItem.vue";

const props = defineProps<{
  playlistTrack: PlaylistTrack;
  playlist: any;
}>();


function remove() {
  spotifyApi.removeTracksFromPlaylist(
    props.playlist.id,
    [props.playlistTrack.track]
  );
}
</script>

<template>
  <PaneItem>
    <h1>{{ playlistTrack.position }} - {{ playlistTrack.track.name }}</h1>
    <a :href="playlistTrack.track.external_urls.spotify" target="_blank">
    <img :src="playlistTrack.track.album.images[0].url" class="album-art" />
    </a>
    <p>
      <span v-for="artist in playlistTrack.track.artists" :key="artist.id">
        {{ artist.name }}<br>
      </span>
    </p>

    <div class="buttons">
      <button @click="remove">Remove</button>
      <button>Move to</button>
      <button>Replace</button>
    </div>
  </PaneItem>
</template>

<style scoped>
.album-art {
  width: 10rem;
}
</style>