<script setup lang="ts">
import { computed, onBeforeMount, onMounted, ref, watchEffect } from 'vue';
import PaneItem from "./PanelItem.vue";
import type { spotifyApi, Playlist } from "../api";
import ListContainer from "./ListContainer.vue";
import ListItem from "./ListItem.vue";
import PanelTitle from "./PanelTitle.vue";
import { usePlaylistStore } from '../stores/playlist';
import { useUserStore } from '@/stores/user';

const playlistStore = usePlaylistStore();
const user = useUserStore();

const filter = ref("");

const playlistsFiltered = computed(() =>
  playlistStore.playlists.filter((playlist) => {
    return filter.value
      ? playlist.name.toLowerCase().includes(filter.value.toLowerCase())
      : true;
  })
);

watchEffect(() => {
  if (user.user) {
    playlistStore.loadPlaylists(user.user);
  }
})

</script>

<template>
  <PaneItem class="pane">
    <PanelTitle>Playlist</PanelTitle>
    <p v-if="playlistStore.playlists.length">{{ playlistStore.playlists.length }} playlists</p>
    <input class="filter" type="text" v-model="filter" placeholder="Search" />
    <ListContainer>
        <ListItem
          v-for="playlist in playlistsFiltered"
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