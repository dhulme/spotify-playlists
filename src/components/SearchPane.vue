<script setup lang="ts">
import { ref } from 'vue';
import { spotifyApi, initToken } from "../api";
import PaneItem from "./PaneItem.vue";
import PanelTitle from "./PanelTitle.vue";
import ListContainer from "./ListContainer.vue";
import ListItem from "./ListItem.vue";

const search = ref("");
const results = ref<any>([]);

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

</script>


<template>
  <PaneItem>
    <PanelTitle>Search</PanelTitle>
    <input type="text" v-model="search" @keyup.enter="searchTracks" />
    <ListContainer>
      <ListItem v-for="track in results" :key="track.id">
        {{ track.name }} <em>{{ track.artists[0].name }}</em>
      </ListItem>
    </ListContainer>
        
  </PaneItem>
</template>

<style scoped>
  .pane {
    width: 25rem;
  }
</style>