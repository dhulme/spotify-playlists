<script setup lang="ts">
import { onBeforeMount, onMounted, ref } from 'vue';
import PaneItem from "./PanelItem.vue";
import { spotifyApi } from "../api";
import ListContainer from "./ListContainer.vue";
import ListItem from "./ListItem.vue";
import PanelTitle from "./PanelTitle.vue";
import { usePlaylistStore } from '../stores/playlist';

const playlistStore = usePlaylistStore();

onBeforeMount(() => {
  playlistStore.loadPlaylists();
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
</style>