<template>
  <div v-if="product" class="max-w-7xl mx-auto p-10 grid grid-cols-1 lg:grid-cols-2 gap-20">
    <!-- Image Section -->
    <div class="flex justify-center items-center bg-brand-light rounded-lg shadow p-4">
      <img
        :src="`${apiUrl}/public/uploads/${product.imageUrl}`"
        alt="Product"
        class="w-full max-w-md object-contain"
      />
    </div>

    <!-- Info Section -->
    <div class="space-y-4">
      <h1 class="text-3xl font-bold text-brand-dark">{{ product.name }}</h1>
      <p class="text-xl text-brand-orange font-semibold">฿{{ product.price }}</p>
      <p :class="product.stock > 0 ? 'text-green-600' : 'text-red-500'" class="font-medium">
        {{ product.stock > 0 ? "In Stock" : "Out of Stock" }}
      </p>

      <p class="text-gray-700 text-sm leading-relaxed">{{ product.description }}</p>

      <div class="space-y-5">
        <div>
          <label class="font-semibold">Brand: </label>
          <span class="text-gray-600">{{ product.brand }}</span>
        </div>
        <div>
          <label class="font-semibold">Category: </label>
          <span class="text-gray-600">{{ product.category }}</span>
        </div>
        <div>
          <label class="font-semibold">Pet Types: </label>
          <span class="text-gray-600">{{ product.petTypes?.join(", ") }}</span>
        </div>
      </div>

      <div class="flex items-center gap-4 mt-8">
        <input type="number" v-model="quantity" min="1" class="w-16 border px-3 py-1 rounded" />
        <button @click="buyNow" class="bg-brand-orange text-white px-6 py-2 rounded hover:bg-orange-600">
          Buy Now
        </button>
        <button
          @click="addToCart"
          class="border border-gray-400 px-4 py-2 rounded hover:bg-gray-200"
        >
          <i class="pi pi-shopping-cart text-medium text-brand-dark"></i>
          Add to Cart
        </button>
      </div>

      <!-- Shipping Info -->
      <div class="mt-6 border-t pt-4 space-y-2 text-sm text-gray-600">
        <div class="flex items-center gap-3">
          <i class="pi pi-truck text-lg text-brand-teal"></i>
          <span>Free Delivery available</span>
        </div>
        <div class="flex items-center gap-3">
          <i class="pi pi-refresh text-lg text-brand-teal"></i>
          <span>30-day return policy</span>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="text-center py-20 text-gray-500">Loading product...</div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useCartStore } from "@/stores/cart";
import api from "@/libs/api";
import swal from "sweetalert2";

const route = useRoute();
const router = useRouter();
const quantity = ref(1);
const product = ref(null);
const apiUrl = api.defaults.baseURL;
const cart = useCartStore();

const props = defineProps({
  productId: String,
});

const addToCart = async () => {
  try {
    await api.post("/cart/add", {
      productId: route.params.id,
      quantity: quantity.value,
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

const buyNow = async () => {
  try {
    await addToCart();
    router.push("/cart/checkout");
  } catch (error) {
    console.error("Error buying now:", error);
    swal.fire({
      title: "Error",
      text: "Failed to add item to cart. Please try again.",
      icon: "error",
      timer: 2000,
      showConfirmButton: false,
    });
  }
};

onMounted(async () => {
  try {
    const res = await api.get(`/product/${route.params.id}`);
    product.value = res.data;
  } catch (err) {
    console.error("Failed to fetch product:", err);
  }
});
</script>
