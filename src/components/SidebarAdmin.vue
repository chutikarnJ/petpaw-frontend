<template>
  <aside class="w-60 bg-brand-dark text-white min-h-screen px-6 py-6 flex flex-col justify-between shadow-lg">
    <!-- Logo -->
    <div>
      <div class="text-2xl text-center font-bold text-brand-light mb-2">
        Pet-Paw Admin
      </div>
      <div class="text-medium text-center font-bold text-brand-light mb-8">
        Welcome, {{ auth.user?.username || 'Admin' }}
      </div>

      <!-- Navigation -->
      <nav class="space-y-4">
        <router-link
          to="/admin/dashboard"
          class="flex items-center gap-3 px-3 py-2 rounded hover:bg-brand-teal/20 transition"
        >
          <i class="pi pi-home text-lg"></i> Dashboard
        </router-link>
        <router-link
          to="/admin/users"
          class="flex items-center gap-3 px-3 py-2 rounded hover:bg-brand-teal/20 transition"
        >
          <i class="pi pi-users text-lg"></i> Users
        </router-link>
        <router-link
          to="/admin/products"
          class="flex items-center gap-3 px-3 py-2 rounded hover:bg-brand-teal/20 transition"
        >
          <i class="pi pi-box text-lg"></i> Products
        </router-link>
        <router-link
          to="/admin/orders"
          class="flex items-center gap-3 px-3 py-2 rounded hover:bg-brand-teal/20 transition"
        >
          <i class="pi pi-shopping-cart text-lg"></i> Orders
        </router-link>
      </nav>
    </div>

    <!-- Logout -->
    <button
      @click="logout"
      class="flex items-center gap-2 px-3 py-2 text-red-400 hover:text-red-600 hover:bg-red-500/10 rounded transition"
    >
      <i class="pi pi-sign-out"></i> Logout
    </button>
  </aside>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import 'primeicons/primeicons.css'

const auth = useAuthStore()
const router = useRouter()

function logout() {
  auth.logout()
  router.push('/admin/signin')
}
</script>
