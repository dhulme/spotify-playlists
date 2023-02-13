<script setup lang="ts">
import { ref, watchEffect } from "vue";
import type { PlaylistTrack } from "../api";
import { spotifyApi, initToken } from "../api";
import { usePlaylistStore } from "../stores/playlist";
import PanelItem from "./PanelItem.vue";

const playlistStore = usePlaylistStore();

const position = ref(playlistStore.playlistTrack?.position);

function remove() {
  playlistStore.removeTrackFromPlaylist();
  playlistStore.setPlaylistTrack(null);
}

function move() {
  if (position.value !== undefined) {
    playlistStore.reorderTrackInPlaylist(position.value);
  }
}

watchEffect(() => {
  position.value = playlistStore.playlistTrack?.position;
});
</script>

<template>
  <PanelItem v-if="playlistStore.playlistTrack">
    <h1>
      {{ playlistStore.playlistTrack.track.name }}
    </h1>
    <a
      :href="playlistStore.playlistTrack.track.external_urls.spotify"
      target="_blank"
    >
      <img
        v-if="playlistStore.playlistTrack.track.album.images.length"
        :src="playlistStore.playlistTrack.track.album.images[0].url"
        class="album-art"
      />
    </a>
    <p>
      <span
        v-for="artist in playlistStore.playlistTrack.track.artists"
        :key="artist.id"
      >
        {{ artist.name }}<br />
      </span>
    </p>
    <p>
      {{ new Date(playlistStore.playlistTrack.added_at).toLocaleDateString() }}
    </p>
    
    <label for="position">Position</label>
    <input
    id="position"
      type="number"
      v-model="position"
      :max="playlistStore.playlistTracks.length"
      min="1"
    />

    <div class="buttons" v-if="playlistStore.playlist?.editable">
      <button class="secondary" @click="remove">Remove</button>
      <button class="secondary" @click="move">Move</button>
    </div>
  </PanelItem>

  <!-- <dialog open>
    <article>
      <header>
        Yo
      </header>
      <p>
        margin-bottom
      </p>
    </article>
  </dialog> -->
</template>

<style scoped>
.album-art {
  width: 10rem;
}
h1 {
  margin-bottom: 0.5rem;
}
</style>
