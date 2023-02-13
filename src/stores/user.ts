import { spotifyApi, type User } from '@/api';
import { defineStore } from 'pinia';

export const useUserStore = defineStore("user", {
  state: (): {
    user: User | null;
  }=> ({
    user: null
  }),
  actions: {
    async loadUser() {
      this.user = await spotifyApi.getMe();
    }
  },
});
