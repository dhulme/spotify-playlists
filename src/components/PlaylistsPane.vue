<script setup lang="ts">
import { onBeforeMount, onMounted, ref } from 'vue';
import PaneItem from "./PaneItem.vue";
import { spotifyApi } from "../api";
import ListContainer from "./ListContainer.vue";
import ListItem from "./ListItem.vue";
import PanelTitle from "./PanelTitle.vue";
defineEmits<{
  (event: "playlistSelected", playlist: any): void;
}>();
const playlists = ref<any>();

onBeforeMount(async () => {
  playlists.value = (await spotifyApi.getUserPlaylists((await spotifyApi.getMe()).id, {
    limit: 50
  })).items;
})
</script>

<template>
  <PaneItem class="pane">
    <PanelTitle>Playlists</PanelTitle>
    <ListContainer>
        <ListItem
          v-for="playlist in playlists"
          :key="playlist.id"
          @click="$emit('playlistSelected', playlist)"
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