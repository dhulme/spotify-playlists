<script setup lang="ts">
import { ref, onBeforeMount, watchEffect, watch, computed } from "vue";
import { spotifyApi, initToken } from "../api";
import type { PlaylistTrack } from "../api";
import { mdiHarddisk } from "@mdi/js";

import PaneItem from "./PaneItem.vue";
import Icon from "./Icon.vue";
import ListContainer from "./ListContainer.vue";
import ListItem from "./ListItem.vue";
import PanelTitle from "./PanelTitle.vue";

const emit = defineEmits<{
  (event: "trackSelected", track: PlaylistTrack): void;
}>();
const props = defineProps<{
  playlist?: {
    tracks: {
      total: number;
    };
    id: string;
    name: string;
  };
}>();
const playlistTracks = ref<PlaylistTrack[]>([]);
const limit = 50;
const localOnly = ref(false);
const unavailableOnly = ref(false);

watchEffect(async () => {
  if (props.playlist?.id) {
    playlistTracks.value = [];
    for (
      let offset = 0;
      offset < props.playlist.tracks.total;
      offset += limit
    ) {
      const tracks = await spotifyApi.getPlaylistTracks(props.playlist.id, {
        offset,
        limit,
        market: 'GB'
      });
      for (let index = 0; index < limit; index++) {
        if (tracks.items[index]) {
          const track: any = tracks.items[index];
          playlistTracks.value[offset + index] = {
            ...track,
            position: offset + index + 1,
          };
        }
      }
    }
    console.log('playlistTracks', playlistTracks);
  }
});

const playlistTracksFiltered = computed(() =>
  playlistTracks.value.filter((track) => {
    return (localOnly.value ? track.is_local : true) &&
      (unavailableOnly.value ? !track.track.is_playable : true);
  })
);

function handleScroll(event: Event) {
  // const target = event.target as HTMLElement;
  // if (tracksOffset.value !== null && target.scrollHeight - target.scrollTop === target.clientHeight) {
  //   tracksOffset.value += limit;
  // }
  // scrollTop.value = target.scrollTop;
}

// function handleKeyDown(event: KeyboardEvent) {
//   console.log('event.key', event.key);
//   if (event.key === 'End') {
//     console.log('hey');

//     tracksOffset.value = tracksTotal.value - limit;
//   }
// }
// @click="albumId = track.track.album.id"
</script>

<template>
  <PaneItem class="pane">
    <div class="container" @scroll="handleScroll">
      <PanelTitle>{{ playlist?.name }}</PanelTitle>
      <label>Local Only<input type="checkbox" v-model="localOnly" /></label><br />
      <label>Unavailable Only<input type="checkbox" v-model="unavailableOnly" /></label>
      <progress
        v-if="playlistTracks.length < (playlist?.tracks.total ?? 0)"
        :max="playlist?.tracks.total"
        :value="playlistTracks.length"
      />
      <div>
        <ListContainer>
          <ListItem
            v-for="track in playlistTracksFiltered"
            :key="track.position"
            @click="$emit('trackSelected', track)"
            :style="{ opacity: track.track.is_playable ? 1 : 0.5 }"
          >
            {{ track.position }} - {{ track.track.name }} <em>{{ track.track.artists[0].name }}</em>
            <Icon v-if="track.is_local" :icon="mdiHarddisk" />
          </ListItem>
        </ListContainer>
      </div>
    </div>
    <!-- <div class="scroll" :style="{ top: `${scrollTop}%`, height: `${scrollHeight}%` }" /> -->
  </PaneItem>
</template>

<style scoped>
.pane {
  max-width: 25rem;
}
</style>
