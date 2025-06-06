import { defineStore } from "pinia";
import api from "@/libs/api";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
  }),
  persist: {
    //add to let pinia stores to perist across refreshes
    key: "auth",
    storage: localStorage,
  },
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
        if (this.isLoggedIn) {
          const res = await api.get("/user/profile");
          this.user = res.data;
        }
      } catch (err) {
        this.user = null;
      }
    },
    async logout() {
      try {
        await api.post("/auth/logout");
        console.log("logout api");
      } catch (e) {
        console.warn("Logout failed", e);
      }
      this.$reset();
      localStorage.removeItem("auth");
      console.log(localStorage.getItem("auth"));
      console.log("romove auth");
      console.log(this.isLoggedIn);
    },
    reset() {
      this.user = null;
    },
  },
});
