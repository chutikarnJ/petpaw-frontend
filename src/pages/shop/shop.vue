<template>
  <div class="min-h-screen bg-brand-light text-brand-dark p-6">
    <div class="max-w-8xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">

      <!-- Sidebar Filter -->
      <aside class="bg-white rounded-lg p-10 shadow-md h-fit">
        <h2 class="text-xl font-bold mb-4">Filter</h2>

        <div class="mb-6">
          <h3 class="font-bold mb-2">Search</h3>
          <input type="search" v-model="search" placeholder="Enter product name or brand"
            class="w-full border border-gray-300 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-brand-orange" />
        </div>
        <div class="mb-6">
          <h3 class="font-bold mb-2">Category</h3>
          <div v-for="cat in categories" :key="cat" class="flex items-center gap-2 mb-1">
            <input type="checkbox" :value="cat" v-model="selectedCategories" />
            <span>{{ cat }}</span>
          </div>
        </div>

        <div class="mb-6">
          <h3 class="font-bold mb-2">Pet Type</h3>
          <div v-for="type in petTypes" :key="type" class="flex items-center gap-2 mb-1">
            <input type="checkbox" :value="type" v-model="selectedPetTypes" />
            <span>{{ type }}</span>
          </div>
        </div>

        <div>
          <h3 class="font-bold mb-2">Price (฿)</h3>
          <div class="w-35 mb-4 text-lg flex gap-2">
            <input type="number" v-model="minPrice" :min="0" :max="2000" placeholder="Min"
              class="p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-orange" />
            -
            <input type="number" v-model="maxPrice" :min="0" :max="2000" placeHolder="Max"
              class="p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-orange" />
          </div>
          <p class="text-sm mt-1">Up to ฿{{ maxPrice }}</p>
        </div>
      </aside>

      <!-- Product Grid -->
      <main class="md:col-span-3">
        <h2 class="text-2xl font-bold mb-6">All Products</h2>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          <ProductCard v-for="product in products" :key="product.id" :productId="product.id" :title="product.name"
            :image="product.imageUrl" :brand="product.brand" :price="product.price" class="button" />
        </div>
        <!-- Pagination Controls -->
        <div class="flex justify-between items-center mt-6">
          <p class="text-sm text-gray-600">
            Showing page {{ currentPage }} of {{ totalPages }} — Total {{ totalProducts }} products
          </p>
          <div class="space-x-2">
            <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1"
              class="px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50">
              Prev
            </button>
            <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages"
              class="px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50">
              Next
            </button>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, watchEffect, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/libs/api'
import ProductCard from '@/components/ProductCard.vue'
import qs from 'qs'

const route = useRoute()
const products = ref([])
const totalPages = ref(1)
const totalProducts = ref(0)
const currentPage = ref(1)

const shopCategory = ref(route.query.category || 'ALL')
const categories = ['FOOD', 'TOYS', 'GROOMING', 'HEALTH', 'ACCESSORIES']
const petTypes = ['DOG', 'CAT', 'BIRD', 'RABBIT', 'ALL', 'OTHER']

const selectedCategories = ref([])
const selectedPetTypes = ref([])
const search = ref()
const maxPrice = ref(2000)
const minPrice = ref(0)


const fetchProducts = async (page = 1) => {
  const res = await api.get('/product', {
    params: {
      page,
      limit: 10,
      category: selectedCategories.value,
      petTypes: selectedPetTypes.value,
      search: search.value,
      maxPrice: maxPrice.value,
      minPrice: minPrice.value,
    },
    paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' })
  })
  products.value = res.data.data
  totalPages.value = res.data.totalPages
  totalProducts.value = res.data.count
}

const changePage = async (newPage) => {
  if (newPage >= 1 && newPage <= totalPages.value) {
    currentPage.value = newPage;
    await fetchProducts(currentPage.value);
  }
};

onMounted(async () => {
  try {
    if (shopCategory.value && categories.includes(shopCategory.value.toUpperCase())) {
      selectedCategories.value = [shopCategory.value.toUpperCase()]
    }
    await fetchProducts()
  } catch (err) {
    console.error('Error fetching products:', err)
  }
})

watch(
  [selectedCategories,
    selectedPetTypes,
    search,
    minPrice,
    maxPrice,],
  async () => {
    await fetchProducts(1) //reset to page 1
  },
  { immediate: true }
)

</script>

<style scoped>
input[type="checkbox"] {
  accent-color: theme('colors.brand.orange');
}
</style>