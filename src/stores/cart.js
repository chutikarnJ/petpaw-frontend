import { defineStore } from "pinia";
import api from "@/libs/api";

export const useCartStore = defineStore("cart", {
  state: () => ({
    count: 0,
  }),

  actions: {
    async fetchCartCount() {
      try {
        const res = await api.get("/cart");
        this.count = res.data.length;
      } catch (err) {
        console.error("Failed to fetch cart count:", err);
      }
    },

    increment(by = 1) {
      this.count += by;
    },

    reset() {
      this.count = 0;
    },
  },
});
