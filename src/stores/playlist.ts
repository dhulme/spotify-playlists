import type { Playlist, PlaylistTrack } from "@/api";
import { spotifyApi, initToken } from "@/api";
import { defineStore } from "pinia";

export const usePlaylistStore = defineStore("playlist", {
  state: (): {
    playlists: Playlist[];
    playlistTracks: PlaylistTrack[];
    playlist: Playlist | null;
    playlistTrack: PlaylistTrack | null;
    playlistTracksLoading: boolean;
  } => ({
    playlists: [],
    playlistTracks: [],
    playlist: null,
    playlistTrack: null,
    playlistTracksLoading: false,
  }),
  actions: {
    async setPlaylist(playlist: Playlist) {
      this.playlist = playlist;
      this.playlistTrack = null;
      this.playlistTracks = [];
      await this.loadPlaylistTracks();
    },
    setPlaylistTrack(track: PlaylistTrack | null) {
      this.playlistTrack = track;
    },
    async loadPlaylists() {
      this.playlists = (await spotifyApi.getUserPlaylists((await spotifyApi.getMe()).id, {
        limit: 50
      })).items
    },
    setPlaylistTracks(tracks: PlaylistTrack[]) {
      this.playlistTracks = tracks;
    },
    async loadPlaylistTracks() {
      const playlistTracks = [];
      if (!this.playlist) return;
      const limit = 50;
      this.playlistTracksLoading = true;
      for (
        let offset = 0;
        offset < this.playlist.tracks.total;
        offset += limit
      ) {
        const tracks = await spotifyApi.getPlaylistTracks(this.playlist.id, {
          offset,
          limit,
          market: "GB",
        });
        for (let index = 0; index < limit; index++) {
          if (tracks.items[index]) {
            const track: any = tracks.items[index];
            playlistTracks[offset + index] = {
              ...track,
              position: offset + index + 1,
            };
          }
        }
        console.log('boom')
        this.playlistTracks = [...playlistTracks];
      }
      this.playlistTracksLoading = false;
    },
    async addTrackToPlaylist(track: PlaylistTrack["track"], position?: number) {
      if (this.playlist) {
        console.log("track", track);
        const newPosition = position ?? this.playlistTracks.length;
        this.playlistTracks.splice(newPosition, 0, {
          is_local: false,
          track,
          added_at: new Date().toISOString(),
          position: newPosition + 1,
        });
        console.log("this.playlistTracks", this.playlistTracks);
        await spotifyApi.addTracksToPlaylist(this.playlist?.id, [track.uri], {
          position: newPosition,
        });
      }
    },
    async removeTrackFromPlaylist() {
      if (this.playlist && this.playlistTrack) {
        this.playlistTracks.splice(this.playlistTrack.position - 1, 1);
        await spotifyApi.removeTracksFromPlaylist(this.playlist?.id, [
          this.playlistTrack.track.uri,
        ]);
      }
    },
  },
});
