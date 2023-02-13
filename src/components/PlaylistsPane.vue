<script setup lang="ts">
import { onBeforeMount, onMounted, ref, watchEffect } from 'vue';
import PaneItem from "./PanelItem.vue";
import type { spotifyApi, Playlist } from "../api";
import ListContainer from "./ListContainer.vue";
import ListItem from "./ListItem.vue";
import PanelTitle from "./PanelTitle.vue";
import { usePlaylistStore } from '../stores/playlist';
import { useUserStore } from '@/stores/user';

const playlistStore = usePlaylistStore();
const user = useUserStore();

watchEffect(() => {
  if (user.user) {
    playlistStore.loadPlaylists(user.user);
  }
})

</script>

<template>
  <PaneItem class="pane">
    <PanelTitle>Playlists</PanelTitle>
    <ListContainer>
        <ListItem
          v-for="playlist in playlistStore.playlists"
          :key="playlist.id"
          @click="playlistStore.setPlaylist(playlist)"
          :class="{ editable: playlist.editable }"
        >
          {{ playlist.name }}
        </ListItem>
    </ListContainer>
    </PaneItem>
</template>

<style scoped>
.pane {
  max-width: 18rem;
}
li:not(.editable) {
  opacity: 0.4;
}
</style>