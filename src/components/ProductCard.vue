<!-- src/components/ProductCard.vue -->
<template>
  <div
    class="border flex flex-col justify-between rounded-xl shadow p-4 text-center transition relative card-hover-effect h-full">
    <router-link :to="`shop/${productId}`">
      <img :src="image ? `${apiUrl}/public/uploads/${image}` : noImageIcon" alt="Product"
        class="w-full h-40 object-contain mb-5 rounded" />
      <h3 class="font-semibold text-medium mb-1">{{ title }}</h3>
      <div class="text-sm text-gray-500 mb-1">{{ brand }}</div>
      <p class="text-brand-orange font-bold text-lg mb-3">฿{{ price }}</p>
    </router-link>

    <button @click.stop="addToCart" class="bg-brand-orange text-white px-4 py-2 rounded hover:bg-orange-800">
      <i class="pi pi-shopping-cart"></i>
      Add to Cart
    </button>
  </div>
</template>

<script setup>
import api from "@/libs/api";
import noImageIcon from "@/assets/images/no-image-icon.png";
import swal from "sweetalert2";
import { useCartStore } from "@/stores/cart";
const cart = useCartStore();
const apiUrl = api.defaults.baseURL;

const props = defineProps({
  title: String,
  productId: String,
  des: String,
  brand: String,
  price: Number,
  image: String,
});

const addToCart = async () => {
  try {
    await api.post("/cart/add", {
      productId: props.productId,
      quantity: 1,
    });

    await cart.fetchCartCount();
    swal.fire({
      title: "Success",
      text: "Item added to cart successfully!",
      icon: "success",
      timer: 2000,
      showConfirmButton: false,
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    swal.fire({
      title: "Error",
      text: "Failed to add item to cart. Please try again.",
      icon: "error",
      timer: 2000,
      showConfirmButton: false,
    });
  }
};
</script>

<style scoped>
.card-hover-effect {
  transition:
    transform 0.2s ease-in-out,
    box-shadow 0.2s ease-in-out;
}

.card-hover-effect:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}
</style>
