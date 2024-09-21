import type { Playlist, PlaylistTrack, User } from "@/api";
import { spotifyApi, initToken } from "@/api";
import { defineStore } from "pinia";

function getPlaylistItem(user: User, playlist: any): Playlist {
  return {
    ...playlist,
    editable: playlist.owner.id === user.id || playlist.collaborative,
  };
}

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
    async loadPlaylists(user: User) {
      const limit = 50;

      let offset = 0;
      let totalPlaylists = 0;
      do {
        const { items: playlists,total} = (
          await spotifyApi.getUserPlaylists(user.id, {
            limit,
            offset
          })
        );
        totalPlaylists = total;
        this.playlists = [...this.playlists, ...playlists.map((playlist) =>
          getPlaylistItem(user, playlist)
        )];
        offset += limit;
      } while (this.playlists.length < totalPlaylists);
    },
    async refreshPlaylist(user: User) {
      await this.loadPlaylists(user);
      this.playlist = getPlaylistItem(
        user,
        this.playlists.find((playlist) => playlist.id === this.playlist?.id)
      );
      await this.loadPlaylistTracks();
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
              position: offset + index,
            };
          }
        }
        this.playlistTracks = [...playlistTracks];
      }
      this.playlistTracksLoading = false;
    },
    async addTrackToPlaylist(track: PlaylistTrack["track"], position?: number) {
      if (this.playlist) {
        const newPosition = position ?? this.playlistTracks.length;
        this.playlistTracks.splice(newPosition, 0, {
          is_local: false,
          track,
          added_at: new Date().toISOString(),
          position: newPosition,
        });
        const response = await spotifyApi.addTracksToPlaylist(
          this.playlist?.id,
          [track.uri],
          {
            position: newPosition,
          }
        );
        this.playlist.snapshot_id = response.snapshot_id;
      }
    },
    async removeTrackFromPlaylist() {
      if (this.playlist && this.playlistTrack) {
        this.playlistTracks.splice(this.playlistTrack.position, 1);
        const response = await spotifyApi.removeTracksFromPlaylistInPositions(
          this.playlist.id,
          [this.playlistTrack.position],
          this.playlist.snapshot_id
        );
        this.playlist.snapshot_id = response.snapshot_id;
      }
    },
    async replaceTrackInPlaylist(track: PlaylistTrack["track"]) {
      if (this.playlist && this.playlistTrack) {
        const position = this.playlistTrack.position;
        this.playlistTracks.splice(position, 1, {
          is_local: false,
          track,
          added_at: new Date().toISOString(),
          position: position,
        });
        await spotifyApi.removeTracksFromPlaylistInPositions(
          this.playlist.id,
          [position],
          this.playlist.snapshot_id
        );
        const response = await spotifyApi.addTracksToPlaylist(
          this.playlist.id,
          [track.uri],
          {
            position: position,
          }
        );
        this.playlist.snapshot_id = response.snapshot_id;
      }
    },
    async reorderTrackInPlaylist(position: number) {
      if (this.playlist && this.playlistTrack) {
        const oldIndex = this.playlistTrack.position;
        this.playlistTracks.splice(oldIndex, 1);
        this.playlistTracks.splice(position, 0, this.playlistTrack);
        this.playlistTracks = this.playlistTracks.map((track, index) => ({
          ...track,
          position: index,
        }));
        const response = await spotifyApi.reorderTracksInPlaylist(
          this.playlist.id,
          oldIndex,
          oldIndex > position ? position : position + 1
        );
        this.playlist.snapshot_id = response.snapshot_id;
        this.playlistTrack.position = position;
      }
    },
  },
});
