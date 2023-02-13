<script setup lang="ts">
import { ref, onBeforeMount, watchEffect, watch, computed } from "vue";
import { spotifyApi, initToken } from "../api";
import type { PlaylistTrack, Playlist } from "../api";
import { mdiHarddisk } from "@mdi/js";

import PanelItem from "./PanelItem.vue";
import Icon from "./Icon.vue";
import ListContainer from "./ListContainer.vue";
import ListItem from "./ListItem.vue";
import PanelTitle from "./PanelTitle.vue";
import { usePlaylistStore } from "../stores/playlist";
import { useUserStore } from "@/stores/user";

const local = ref(false);
const unavailable = ref(false);
const filter = ref("");

const playlistStore = usePlaylistStore();
const userStore = useUserStore();

const playlistTracksFiltered = computed(() =>
  playlistStore.playlistTracks
    .map((track, index) => ({ ...track, position: index + 1 }))
    .filter((track) => {
      return (
        (local.value ? track.is_local : true) &&
        (unavailable.value ? !track.track.is_playable && !track.is_local : true) &&
        (filter.value
          ? track.track.name.toLowerCase().includes(filter.value.toLowerCase())
          : true)
      );
    })
);

function refresh() {
  if (userStore.user) {
    playlistStore.refreshPlaylist(userStore.user);
  }
}

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
  <PanelItem>
    <div class="container" @scroll="handleScroll">
      <PanelTitle>{{ playlistStore.playlist?.name }}</PanelTitle>
      <p v-if="playlistStore.playlist">{{ playlistStore.playlist.tracks.total }} tracks</p>
      <button class="secondary refresh" @click="refresh">Refresh</button>
      <label><input type="checkbox" v-model="local" />Local</label>
      <label><input type="checkbox" v-model="unavailable" />Unavailable</label>
      <input class="filter" type="text" v-model="filter" placeholder="Search" />
      <progress
        v-if="playlistStore.playlistTracksLoading"
        :max="playlistStore.playlist?.tracks.total"
        :value="playlistStore.playlistTracks.length"
      />
      <div>
        <ListContainer>
          <ListItem
            v-for="track in playlistTracksFiltered"
            :key="track.position"
            @click="playlistStore.setPlaylistTrack(track)"
            :style="{ opacity: track.track.is_playable ? 1 : 0.5 }"
          >
            <span class="position">{{ track.position }}</span
            >{{ track.track.name }} <em>{{ track.track.artists[0].name }}</em>
            <Icon class="local" v-if="track.is_local" :icon="mdiHarddisk" />
          </ListItem>
        </ListContainer>
      </div>
    </div>
    <!-- <div class="scroll" :style="{ top: `${scrollTop}%`, height: `${scrollHeight}%` }" /> -->
  </PanelItem>
</template>

<style scoped>
input {
  margin-right: 0.5rem;
  margin-bottom: 0.25rem;
}
.position {
  min-width: 2rem;
  margin-right: 0.75rem;
}
.filter {
  margin-top: 0.25rem;
}
.local {
  margin-left: 0.5rem;
}
.refresh {
  width: auto;
  padding: 0.4rem 1rem;
}
</style>
