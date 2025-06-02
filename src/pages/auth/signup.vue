<template>
  <div class="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-white px-4 overflow-hidden">
    <div class="hidden md:flex items-center justify-center">
      <img src="@/assets/images/logo/auth.jpg" alt="Image" class="max-w object-contain rounded-lg shadow-lg" />
    </div>

    <div class="flex items-center justify-center bg-white px-8">
      <div class="w-full max-w-md">
        <h2 class="text-2xl font-bold text-brand-dark mb-8">Create an Account</h2>
        <form @submit.prevent="handleSignUp">
          <input v-model="email" type="email" placeholder="Email" class="w-full mb-4 p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-orange rounded"
            required />
          <input v-model="username" placeholder="Username" class="w-full mb-4 p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-orange rounded"
            required />
          <input v-model="password" type="password" placeholder="Password"
            class="w-full mb-4 p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-orange rounded" required />
          <input v-model="confirmPassword" type="password" placeholder="Confirm Password"
            class="w-full mb-3 p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-orange rounded" required />
          <p class="text-sm text-gray-500 mb-4 text-center">Already have an account?
            <router-link to="/signin" class="text-brand-orange font-medium hover:underline ml-1">Sign In</router-link>
          </p>
          <button type="submit"
            class="w-full bg-brand-orange text-white font-semibold py-3 rounded-lg hover:bg-brand-yellow transition">
            Create Account
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import Swal from 'sweetalert2'
import api from '@/libs/api'

export default {
  setup() {
    const email = ref('')
    const username = ref('')
    const password = ref('')
    const confirmPassword = ref('')
    const router = useRouter()

    const handleSignUp = async () => {
      if (password.value !== confirmPassword.value) {
        Swal.fire({
          title: 'Error!',
          text: 'Passwords do not match',
          icon: 'error',
          timer: 2000
        })
        return
      }

      try {
        await api.post('/auth/signup', {
          email: email.value,
          username: username.value,
          password: password.value
        })

        Swal.fire({
          title: 'Success!',
          text: 'Account created. Please sign in.',
          icon: 'success',
          timer: 2000
        })
        router.push('/signin')
      } catch (err) {
        Swal.fire({
          title: 'Error!',
          text: 'Error create an account',
          icon: 'error',
          timer: 2000
        })
      }
    }

    return { email, username, password, confirmPassword, handleSignUp }
  }
}
</script>
