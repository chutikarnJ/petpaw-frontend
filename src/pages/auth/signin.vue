<template>
  <div class="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-white overflow-hidden px-4">
    <div class="hidden md:flex items-center justify-center">
      <img src="@/assets/images/logo/auth.jpg" alt="Image" class="max-w object-contain rounded-lg shadow-lg" />
    </div>

    <div class="flex items-center justify-center bg-white px-8">
      <div class="w-full max-w-md">
        <h2 class="text-2xl font-bold text-brand-dark mb-8">Sign In</h2>
        <form @submit.prevent="handleSignIn">
          <input v-model="email" type="email" placeholder="Email"
            class="w-full mb-4 p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-orange rounded"
            required />
          <input v-model="password" type="password" placeholder="Password"
            class="w-full mb-4 p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-orange rounded"
            required />
          <p class="text-sm text-gray-500 mb-4 text-center">Don't have an Account?
            <router-link to="/signup" class="text-brand-orange font-medium hover:underline ml-1">Sign Up</router-link>
          </p>
          <button type="submit"
            class="w-full bg-brand-orange text-white font-semibold py-3 rounded-lg hover:bg-brand-yellow transition">
            Sign In
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import { useAuthStore } from '@/stores/auth'

export default {
  setup() {
    const email = ref('')
    const password = ref('')
    const router = useRouter()
    const auth = useAuthStore()

    const handleSignIn = async () => {
      try {
        await auth.signIn(email.value, password.value)

        router.push('/')
      } catch (err) {
        Swal.fire({
          title: 'Error!',
          text: 'Invalid email or password',
          icon: 'error',
          timer: 2000
        })
      }
    }

    return { email, password, handleSignIn }
  }
}
</script>
