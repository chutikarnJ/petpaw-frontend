<template>
  <div class="min-h-screen flex flex-col bg-brand-light">
    <Navbar v-if="showLayout" />
    <router-view />
    <Footer v-if="showFooter" />
  </div>
</template>

<script setup>
import Navbar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue';
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from './stores/auth';

const auth = useAuthStore();

const route = useRoute()
const noFooterRoutes = ['/signin', '/signup', '/admin/signin', '/admin/dashboard', '/admin/users', '/admin/products', '/admin/orders']
const showFooter = computed(() => !noFooterRoutes.includes(route.path))

const noLayoutRoutes = ['/admin/signin', '/admin/dashboard', '/admin/users', '/admin/products', '/admin/orders']
const showLayout = computed(() => !noLayoutRoutes.includes(route.path))

onMounted(() => {
  auth.fetchProfile();
})
</script>
