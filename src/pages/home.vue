<template>
  <div class="min-h-screen bg-brand-light text-brand-dark">
    <section
      class="relative bg-gradient-to-r from-brand-orange to-brand-teal px-6 py-16 text-center text-brand-light md:py-32 md:px-10 overflow-hidden rounded-b-3xl shadow-lg"
    >
      <!-- hero -->
      <div class="container mx-auto relative z-10 text-center">
        <h1 class="text-4xl md:text-6xl font-extrabold leading-tight mb-6 drop-shadow-md">
          Everything Your Pet Needs,<br class="hidden md:inline" />
          All in One Place!
        </h1>
        <p class="text-lg md:text-xl mb-10 max-w-2xl mx-auto opacity-90">
          Discover food, fun toys, stylish accessories, and essential supplies for your beloved
          companions.
        </p>
        <router-link
          to="/shop"
          class="bg-brand-light text-brand-orange font-bold px-8 py-3 rounded-full shadow-lg hover:bg-orange-300 transition-all duration-300"
        >
          Shop Now
        </router-link>
      </div>
    </section>

    <!-- categories -->
    <section class="py-12 px-16 max-w-6xl mx-auto">
      <h2 class="text-3xl font-bold mb-12 text-center">Product Categories</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <CategoryCard title="Toys" :image="toyImg" @select="goToCategory" />
        <CategoryCard title="Food" :image="foodImg" @select="goToCategory" />
        <CategoryCard title="Grooming" :image="groomImg" @select="goToCategory" />
        <CategoryCard title="Accessories" :image="accessoryImg" @select="goToCategory" />
        <CategoryCard title="Health" :image="healthImg" @select="goToCategory" />
      </div>
    </section>

    <!-- product -->
    <section class="py-12 px-4 max-w-7xl mx-auto">
      <div class="flex justify-between items-center mb-10">
        <h2 class="text-3xl font-bold text-brand-dark">New Products</h2>
        <router-link to="/shop" class="hover:text-brand-orange text-brand-dark px-5">
          View All
          <i class="pi pi-arrow-right ml-2"></i>
        </router-link>
      </div>
      <div class="container mx-auto">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          <ProductCard
            v-for="product in products"
            :key="product.id"
            :productId="product.id"
            :title="product.name"
            :des="product.description"
            :image="product.imageUrl"
            :brand="product.brand"
            :price="product.price"
          />
        </div>
      </div>
    </section>

    <section
      v-if="!auth.isLoggedIn"
      class="bg-brand-teal text-white py-16 px-6 md:px-10 mt-16 rounded-t-lg shadow-xl"
    >
      <div class="container mx-auto text-center">
        <h2 class="text-4xl font-bold mb-6">Join Our Pet-Paw Family!</h2>
        <p class="text-lg mb-8 opacity-90">
          Sign up for our newsletter to get exclusive deals, pet care tips, and new product alerts.
        </p>
        <router-link to="/signup">
          <button
            type="submit"
            class="w-full md:w-1/3 bg-white text-brand-teal font-bold py-3 px-6 rounded-full hover:bg-blue-100 transition-colors duration-200 shadow-md"
          >
            Sign Up
          </button>
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup>
import toyImg from "@/assets/images/toys.webp";
import groomImg from "@/assets/images/grooming.webp";
import foodImg from "@/assets/images/food.jpg";
import accessoryImg from "@/assets/images/accessory.webp";
import healthImg from "@/assets/images/health.webp";

import CategoryCard from "@/components/CategoryCard.vue";
import ProductCard from "@/components/ProductCard.vue";

import api from "@/libs/api";
import { useAuthStore } from "@/stores/auth";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const products = ref([]);
const auth = useAuthStore();

const goToCategory = (category) => {
  router.push({ path: "/shop", query: { category } });
};

onMounted(async () => {
  try {
    const res = await api.get("/product", {
      params: {
        page: 1,
        limit: 5,
      },
    });
    products.value = res.data.data;
  } catch (err) {
    console.error("Error fetching products:", err);
  }
});
</script>
