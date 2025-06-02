<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded shadow-md w-full max-w-md">
      <h2 class="text-2xl font-bold mb-6 text-center text-brand-dark">Admin Sign In</h2>
      <form @submit.prevent="handleAdminLogin">
        <input v-model="email" type="email" placeholder="Admin Email"
               class="w-full p-3 mb-4 border border-gray-300 rounded" required />
        <input v-model="password" type="password" placeholder="Password"
               class="w-full p-3 mb-4 border border-gray-300 rounded" required />
        <button type="submit"
                class="w-full bg-brand-dark text-white py-2 rounded hover:bg-gray-800 transition">
          Sign In as Admin
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import { useAuthStore } from '@/stores/auth'

const email = ref('')
const password = ref('')
const router = useRouter()
const auth = useAuthStore()

const handleAdminLogin = async () => {
  try {
    await auth.signIn(email.value, password.value)
    if (auth.user?.role === 'ADMIN') {
      router.push('/admin/dashboard')
    } else {
      Swal.fire('Access Denied', 'Not an admin account.', 'error')
    }
  } catch (err) {
    Swal.fire('Error', 'Failed to sign in', 'error')
  }
}
</script>
