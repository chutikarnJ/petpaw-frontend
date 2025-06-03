<template>
  <nav class="bg-brand-dark px-6 py-4 shadow-md text-brand-light">
    <div class="max-w-8xl mx-auto flex justify-between items-center">
      <!-- Logo -->
      <div class="text-2xl font-bold text-brand-light">Pet-Paw</div>

      <!-- Nav links -->
      <ul class="hidden md:flex space-x-10 font-medium">
        <li><router-link to="/" class="hover:text-brand-teal transition">Home</router-link></li>
        <li><router-link to="/shop" class="hover:text-brand-teal transition">Shop</router-link></li>
        <li>
          <router-link to="/about" class="hover:text-brand-teal transition">About</router-link>
        </li>
        <li>
          <router-link to="/contact" class="hover:text-brand-teal transition">Contact</router-link>
        </li>
      </ul>

      <!-- Right actions -->
      <div class="flex items-center space-x-5">
        <!-- Auth Section -->
        <template v-if="isLoggedIn">
          <router-link to="/cart" class="hover:text-brand-teal transition">
            <i class="pi pi-shopping-cart text-xl"></i>
            <span v-if="cartCount > 0" class="absolute top-3 bg-red-500 text-white rounded-full text-xs px-1.5 py-0.5">
              {{ cart.count }}
            </span>
          </router-link>
          <div class="relative" @click="toggleDropdown">
            <button class="flex items-center text-sm font-medium focus:outline-none hover:text-brand-teal">
              <i class="pi pi-user text-xl mr-2"></i>
              {{ username || "User" }}
            </button>

            <!-- Dropdown -->
            <div v-if="isDropdownOpen"
              class="absolute right-0 mt-2 w-40 bg-brand-light text-brand-dark rounded-lg shadow-lg z-50 border transition-all duration-300 ease-in-out">
              <router-link to="/profile" class="block px-4 py-2 hover:bg-gray-100 transition">
                My Profile
              </router-link>
              <router-link to="/order" class="block px-4 py-2 hover:bg-gray-100 transition">
                Orders
              </router-link>
              <button @click="handleLogout"
                class="block w-full text-left px-4 py-2 hover:bg-red-100 text-red-600 transition">
                Log Out
              </button>
            </div>
          </div>
        </template>
        <template v-else>
          <router-link to="/signin" class="bg-brand-teal hover:bg-teal-700 text-white px-4 py-1.5 rounded text-sm">
            Sign In
          </router-link>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useAuthStore } from "@/stores/auth";
import { useCartStore } from "@/stores/cart";
import { useRouter } from "vue-router";
import { ref, onMounted, computed } from "vue";
import "primeicons/primeicons.css";
const auth = useAuthStore();
const cart = useCartStore();

const router = useRouter();

const isDropdownOpen = ref(false);

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const isLoggedIn = computed(() => auth.isLoggedIn);
const username = computed(() => auth.user?.username || "User");
const cartCount = computed(() => cart.count);

onMounted(async () => {

  await auth.fetchProfile()
  console.log("auth.user", auth.user);
  console.log("auth.isLoggedIn", auth.isLoggedIn);

  if (auth.isLoggedIn) {
    cart.fetchCartCount();
  }
});

const handleLogout = async () => {
  await auth.logout();
  cart.reset();
  router.push("/signin");
};
</script>
