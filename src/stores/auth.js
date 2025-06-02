// stores/auth.js
import { defineStore } from "pinia";
import api from "@/libs/api";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
  }),
  persist: true,
  getters: {
    isLoggedIn: (state) => !!state.user,
  },
  actions: {
    async signIn(email, password) {
      await api.post("/auth/signin", { email, password }); //set token in cookie

      const userRes = await api.get("/user/profile");
      this.user = userRes.data;
      
    },
    async fetchProfile() {
      try {
        const res = await api.get("/user/profile");
        this.user = res.data;
      } catch (err) {
        this.user = null;
      }
    },
    async logout() {
      await api.post("/auth/logout");
      this.user = null;
    },
  },
});
